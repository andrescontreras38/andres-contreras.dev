/**
 * Prerenderiza el sitio después del build.
 *
 * El sitio es una SPA: el HTML que sale de `vite build` es un <div id="root">
 * vacío. Googlebot ejecuta JavaScript, pero los rastreadores de los motores de
 * respuesta (GPTBot, PerplexityBot, ClaudeBot) en general no, así que verían una
 * página en blanco y ni el contenido ni el structured data les llegarían.
 *
 * Este script levanta el build, visita cada ruta con un navegador real, espera a
 * que React pinte, y guarda el HTML ya renderizado en dist/<ruta>/index.html.
 * El resultado sigue siendo una SPA para el visitante: React arranca encima y
 * toma el control igual que antes.
 *
 * Límite a tener en cuenta: los artículos se congelan tal como estaban en el
 * build. Al publicar uno nuevo hay que volver a desplegar.
 */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, extname } from "node:path";

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), "../dist");
const PORT = 4178;

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

/** Servidor estático con fallback a index.html, como haría el hosting. */
function serveDist() {
  return new Promise((ready) => {
    const server = createServer(async (req, res) => {
      const url = decodeURIComponent(req.url.split("?")[0]);
      let filePath = join(DIST, url);

      if (!extname(url) || !existsSync(filePath)) {
        filePath = join(DIST, "index.html");
      }

      try {
        const body = await readFile(filePath);
        res.writeHead(200, { "Content-Type": MIME[extname(filePath)] || "application/octet-stream" });
        res.end(body);
      } catch {
        res.writeHead(404).end("not found");
      }
    });
    server.listen(PORT, () => ready(server));
  });
}

async function dynamicRoutes(table, prefix) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?select=slug&status=eq.published`,
      { headers: { apikey: SUPABASE_KEY } }
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return (await response.json()).map((row) => `${prefix}/${row.slug}`);
  } catch (error) {
    console.warn(`[prerender] Sin ${table} (${error.message}).`);
    return [];
  }
}

const routes = [
  "/",
  "/features",
  "/company",
  "/blog",
  "/recursos",
  "/contact",
  "/privacy-policy",
  "/terms-&-condition",
  "/cookie-policy",
  ...(await dynamicRoutes("blog_posts", "/blog")),
  ...(await dynamicRoutes("resources", "/recursos")),
];

const server = await serveDist();

let browser;
try {
  browser = await chromium.launch();
} catch (error) {
  // Sin navegador no hay prerenderizado, pero el sitio funciona igual: se
  // pierde el HTML para los rastreadores que no ejecutan JavaScript, no el
  // despliegue. Romper el build por esto sería mucho peor.
  server.close();
  console.warn("");
  console.warn("[prerender] OMITIDO: no se pudo abrir el navegador.");
  console.warn(`[prerender] ${String(error.message).split("\n")[0]}`);
  console.warn("[prerender] El sitio se publica sin prerenderizar: los buscadores");
  console.warn("[prerender] que ejecutan JavaScript lo verán bien, GPTBot y");
  console.warn("[prerender] similares no. Revisa la instalación de Playwright.");
  console.warn("");
  process.exit(0);
}

const page = await browser.newPage();

let ok = 0;
for (const route of routes) {
  try {
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "networkidle", timeout: 30000 });
    // Esperar a que haya contenido real, no solo el contenedor vacío.
    await page.waitForFunction(() => document.querySelector("#root")?.children.length > 0, { timeout: 15000 });
    await page.waitForTimeout(400);

    const html = await page.evaluate(() => `<!doctype html>\n${document.documentElement.outerHTML}`);

    const outDir = route === "/" ? DIST : join(DIST, route);
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, "index.html"), html, "utf8");

    const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
    console.log(`[prerender] ${route.padEnd(42)} ${kb} kB`);
    ok++;
  } catch (error) {
    console.error(`[prerender] FALLÓ ${route}: ${error.message}`);
  }
}

await browser.close();
server.close();
console.log(`[prerender] ${ok}/${routes.length} rutas generadas.`);
if (ok < routes.length) process.exitCode = 1;
