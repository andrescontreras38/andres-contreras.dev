import { chromium } from "playwright";

const navegador = await chromium.launch();
const pagina = await navegador.newPage();
pagina.on("console", (m) => m.type() === "error" && console.log("consola:", m.text()));
pagina.on("pageerror", (e) => console.log("JS:", e.message));

pagina.on("response", async (r) => {
  if (!r.url().includes("formsubmit")) return;
  console.log("respuesta:", r.status(), r.url());
  const t = await r.text().catch(() => "(sin cuerpo)");
  console.log("cuerpo   :", t.slice(0, 300).replace(/\s+/g, " "));
});
pagina.on("requestfailed", (r) => {
  if (r.url().includes("formsubmit")) console.log("FALLO   :", r.url(), "->", r.failure()?.errorText);
});

await pagina.goto("https://andres-contreras-dev.vercel.app/", { waitUntil: "networkidle" });
await pagina.locator("#contactform").scrollIntoViewIfNeeded();
await pagina.fill("#name", "Prueba automatica");
await pagina.fill("#email", "prueba@ejemplo.com");
await pagina.fill("#message", "Comprobacion del formulario.");
await pagina.click("#contactform button[type=submit]");
await pagina.waitForTimeout(12000);
await navegador.close();
