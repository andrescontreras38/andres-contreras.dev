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
  browser = await chromium.launch({
    // El contenedor de build de Vercel no permite el sandbox de Chrome: el
    // proceso arrancaba y moría al instante, y Playwright lo reportaba como
    // "Target page, context or browser has been closed", que suena a otra
    // cosa. Desactivarlo es seguro aquí porque el único contenido que abre
    // este navegador es el propio sitio recién construido.
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      // /dev/shm en los contenedores suele ser diminuto y Chrome se queda sin
      // memoria compartida a media página.
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });
} catch (error) {
  // Sin navegador no hay prerenderizado, pero el sitio funciona igual: se
  // pierde el HTML para los rastreadores que no ejecutan JavaScript, no el
  // despliegue. Romper el build por esto sería mucho peor.
  server.close();
  console.warn("");
  console.warn("[prerender] OMITIDO: no se pudo abrir el navegador.");
  // El mensaje entero, no solo la primera línea: recortarlo escondió una vez
  // la causa real durante un despliegue.
  String(error.message)
    .split("\n")
    .slice(0, 12)
    .forEach((linea) => console.warn(`[prerender] ${linea}`));
  console.warn("[prerender] El sitio se publica sin prerenderizar: los buscadores");
  console.warn("[prerender] que ejecutan JavaScript lo verán bien, GPTBot y");
  console.warn("[prerender] similares no. Revisa la instalación de Playwright.");
  console.warn("");
  process.exit(0);
}

const page = await browser.newPage();

let ok = 0;
let appNoArranco = false;

for (const route of routes) {
  try {
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "networkidle", timeout: 30000 });
    // Esperar a que haya contenido real, no solo el contenedor vacío.
    await page.waitForFunction(() => document.querySelector("#root")?.children.length > 0, { timeout: 15000 });
    await page.waitForTimeout(400);

    // La comprobación de arriba solo dice que #root tiene hijos, y la pantalla
    // de error de main.tsx también los tiene. Sin este segundo filtro, un build
    // al que le falten las variables de entorno congelaría el mensaje de error
    // como HTML estático de todas las rutas: los rastreadores que no ejecutan
    // JavaScript verían una página de error en lugar del sitio, y el HTML
    // anterior (bueno) quedaría sobrescrito. Mejor no escribir nada.
    const estado = await page.evaluate(() => ({
      error: document.body.innerText.includes("El sitio no pudo iniciarse"),
      titulos: document.querySelectorAll("h1, h2").length,
    }));

    if (estado.error) {
      appNoArranco = true;
      throw new Error("la aplicación no arrancó en el navegador");
    }
    if (estado.titulos === 0) {
      throw new Error("la página se renderizó sin ningún encabezado, algo salió mal");
    }

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

if (appNoArranco) {
  // Que la aplicación no arranque es un problema del entorno del build, no del
  // prerenderizado, y ya se nota solo: el sitio desplegado no funciona. Tumbar
  // aquí el despliegue añadiría un fallo encima del fallo sin aportar nada.
  console.warn("");
  console.warn("[prerender] OMITIDO: la aplicación no arrancó en el navegador.");
  console.warn("[prerender] Causa habitual: faltan VITE_SUPABASE_URL y");
  console.warn("[prerender] VITE_SUPABASE_PUBLISHABLE_KEY en las variables de");
  console.warn("[prerender] entorno del proyecto en Vercel. Defínelas y vuelve");
  console.warn("[prerender] a desplegar.");
  console.warn("[prerender] No se ha escrito nada: es preferible publicar la");
  console.warn("[prerender] SPA sin prerenderizar que congelar una pantalla de");
  console.warn("[prerender] error como HTML de todas las páginas.");
  console.warn("");
} else if (ok < routes.length) {
  process.exitCode = 1;
}
