/**
 * Prerenderiza el sitio despues del build.
 *
 * El sitio es una SPA: el HTML que sale de `vite build` es un <div id="root">
 * vacio. Googlebot ejecuta JavaScript, pero los rastreadores de los motores de
 * respuesta (GPTBot, PerplexityBot, ClaudeBot) en general no, asi que verian
 * una pagina en blanco.
 *
 * Este script levanta el build, lo visita con un navegador real, espera a que
 * React pinte y guarda el HTML ya renderizado. Para el visitante sigue siendo
 * una SPA: React arranca encima y toma el control igual que antes.
 */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, extname } from "node:path";

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), "../dist");
const PORT = 4178;
const RUTAS = ["/"];

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif",
  ".ico": "image/x-icon", ".json": "application/json", ".mp4": "video/mp4",
  ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf",
  ".otf": "font/otf", ".eot": "application/vnd.ms-fontobject",
  ".txt": "text/plain; charset=utf-8", ".xml": "application/xml",
};

function servirDist() {
  return new Promise((listo) => {
    const servidor = createServer(async (req, res) => {
      const url = decodeURIComponent(req.url.split("?")[0]);
      let ruta = join(DIST, url);
      if (!existsSync(ruta) || statSync(ruta).isDirectory()) ruta = join(DIST, "index.html");
      try {
        const cuerpo = await readFile(ruta);
        res.writeHead(200, { "Content-Type": MIME[extname(ruta)] || "application/octet-stream" });
        res.end(cuerpo);
      } catch {
        res.writeHead(404).end("not found");
      }
    });
    servidor.listen(PORT, () => listo(servidor));
  });
}

const servidor = await servirDist();

let navegador;
try {
  navegador = await chromium.launch({
    // El contenedor de build de Vercel no permite el sandbox de Chrome.
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
  });
} catch (error) {
  // Sin navegador no hay prerenderizado, pero el sitio funciona igual: se
  // pierde el HTML para los rastreadores que no ejecutan JavaScript, no el
  // despliegue. Romper el build por esto seria mucho peor.
  servidor.close();
  console.warn("");
  console.warn("[prerender] OMITIDO: no se pudo abrir el navegador.");
  String(error.message).split("\n").slice(0, 12).forEach((l) => console.warn(`[prerender] ${l}`));
  console.warn("");
  process.exit(0);
}

const pagina = await navegador.newPage();
let ok = 0;

for (const ruta of RUTAS) {
  try {
    await pagina.goto(`http://localhost:${PORT}${ruta}`, { waitUntil: "networkidle", timeout: 45000 });
    await pagina.waitForFunction(() => document.querySelector("#root")?.children.length > 0, { timeout: 20000 });
    await pagina.waitForTimeout(1200);

    const titulos = await pagina.evaluate(() => document.querySelectorAll("h1, h2").length);
    if (titulos === 0) throw new Error("la pagina se renderizo sin ningun encabezado");

    const html = await pagina.evaluate(() => `<!doctype html>\n${document.documentElement.outerHTML}`);
    const destino = ruta === "/" ? DIST : join(DIST, ruta);
    await mkdir(destino, { recursive: true });
    await writeFile(join(destino, "index.html"), html, "utf8");

    console.log(`[prerender] ${ruta.padEnd(30)} ${(Buffer.byteLength(html) / 1024).toFixed(0)} kB`);
    ok++;
  } catch (error) {
    console.error(`[prerender] FALLO ${ruta}: ${error.message}`);
  }
}

await navegador.close();
servidor.close();
console.log(`[prerender] ${ok}/${RUTAS.length} rutas generadas.`);
if (ok < RUTAS.length) process.exitCode = 1;
