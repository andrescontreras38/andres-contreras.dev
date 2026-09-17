import { chromium } from "playwright";
import { pathToFileURL } from "url";
import path from "path";

const trabajos = [
  ["brand/hoja-de-vida-fuente.html", "public/assets/andres-contreras-hoja-de-vida.pdf"],
  ["brand/resume-en-fuente.html", "public/assets/andres-contreras-resume-en.pdf"],
];

const browser = await chromium.launch();
for (const [fuente, destino] of trabajos) {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(path.resolve(fuente)).href, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.pdf({ path: destino, format: "A4", printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
  if (fuente.includes("resume-en")) {
    await page.setViewportSize({ width: 794, height: 1123 });
    await page.screenshot({ path: "scripts/_resume_preview.png", fullPage: true });
  }
  await page.close();
  console.log("generado:", destino);
}
await browser.close();
