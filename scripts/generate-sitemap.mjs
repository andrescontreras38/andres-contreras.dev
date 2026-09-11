/**
 * Genera public/sitemap.xml a partir de las rutas estáticas y de los artículos
 * publicados en Supabase. Corre en cada build para que no se quede viejo.
 *
 * Si no hay credenciales o Supabase no responde, escribe el sitemap solo con
 * las rutas estáticas en vez de romper el build.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const SITE_URL = (process.env.VITE_SITE_URL || "https://contreras.dev").replace(/\/$/, "");
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// changefreq/priority son orientativos; Google los ignora, pero Bing y otros no.
const staticRoutes = [
  { path: "/", priority: "1.0", changefreq: "monthly" },
  { path: "/features", priority: "0.9", changefreq: "monthly" },
  { path: "/company", priority: "0.8", changefreq: "yearly" },
  { path: "/recursos", priority: "0.9", changefreq: "weekly" },
  { path: "/blog", priority: "0.8", changefreq: "weekly" },
  { path: "/contact", priority: "0.7", changefreq: "yearly" },
  { path: "/privacy-policy", priority: "0.2", changefreq: "yearly" },
  { path: "/terms-&-condition", priority: "0.2", changefreq: "yearly" },
  { path: "/cookie-policy", priority: "0.2", changefreq: "yearly" },
];

const escapeXml = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function fetchRows(table, select, filter = "status=eq.published") {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${select}&${filter}`, {
      headers: { apikey: SUPABASE_KEY },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`[sitemap] No se pudo leer ${table} (${error.message}).`);
    return [];
  }
}

async function fetchPosts() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn("[sitemap] Sin credenciales de Supabase: solo rutas estáticas.");
    return [];
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,date,updated_at&status=eq.published&order=date.desc`,
      { headers: { apikey: SUPABASE_KEY } }
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`[sitemap] No se pudieron leer los artículos (${error.message}); solo rutas estáticas.`);
    return [];
  }
}

const today = new Date().toISOString().slice(0, 10);
const posts = await fetchPosts();
const resources = await fetchRows("resources", "slug,updated_at");

const urls = [
  ...staticRoutes.map((route) => ({
    loc: `${SITE_URL}${route.path}`,
    lastmod: today,
    changefreq: route.changefreq,
    priority: route.priority,
  })),
  ...resources.map((resource) => ({
    loc: `${SITE_URL}/recursos/${resource.slug}`,
    lastmod: (resource.updated_at || today).slice(0, 10),
    changefreq: "monthly",
    priority: "0.7",
  })),
  ...posts.map((post) => ({
    loc: `${SITE_URL}/blog/${post.slug}`,
    lastmod: (post.updated_at || post.date || today).slice(0, 10),
    changefreq: "yearly",
    priority: "0.6",
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const publicDir = resolve(dirname(fileURLToPath(import.meta.url)), "../public");
await writeFile(resolve(publicDir, "sitemap.xml"), xml, "utf8");

// La línea Sitemap del robots.txt tiene que seguir al dominio, así que se
// reescribe aquí en vez de dejarla fija en el archivo.
const robotsPath = resolve(publicDir, "robots.txt");
const robots = await readFile(robotsPath, "utf8");
await writeFile(
  robotsPath,
  robots.replace(/^Sitemap: .*$/m, `Sitemap: ${SITE_URL}/sitemap.xml`),
  "utf8"
);
console.log(`[sitemap] ${urls.length} URLs (${posts.length} artículos, ${resources.length} recursos) → public/sitemap.xml`);
