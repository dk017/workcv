import { createCanvas, loadImage } from "@napi-rs/canvas";
import { chromium } from "playwright-core";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

const baseUrl = process.env.PDF_PARITY_BASE_URL || "http://127.0.0.1:3000";
const executablePath = process.env.CHROMIUM_PATH || (process.platform === "win32" ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : "/usr/bin/chromium");
const browser = await chromium.launch({ executablePath, headless: true, args: ["--no-sandbox"] });

async function coarsePixels(buffer, width = 40, height = 57) {
  const image = await loadImage(buffer);
  const canvas = createCanvas(width, height);
  canvas.getContext("2d").drawImage(image, 0, 0, width, height);
  return canvas.getContext("2d").getImageData(0, 0, width, height).data;
}

try {
  for (const template of ["classic", "modern", "compact"]) {
    const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1 });
    await page.goto(`${baseUrl}/cv-pdf-parity?template=${template}`, { waitUntil: "networkidle" });
    await page.waitForSelector('[data-pdf-ready="true"]');
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: "print" });
    const htmlPng = await page.screenshot({ fullPage: true });
    const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true, margin: { top: "0", right: "0", bottom: "0", left: "0" } });
    const document = await pdfjs.getDocument({ data: new Uint8Array(pdf), disableWorker: true }).promise;
    const firstPage = await document.getPage(1);
    const viewport = firstPage.getViewport({ scale: 96 / 72 });
    const canvas = createCanvas(Math.round(viewport.width), Math.round(viewport.height));
    await firstPage.render({ canvas, canvasContext: canvas.getContext("2d"), viewport }).promise;
    const [html, renderedPdf] = await Promise.all([coarsePixels(htmlPng), coarsePixels(canvas.toBuffer("image/png"))]);
    let difference = 0;
    for (let i = 0; i < html.length; i += 4) difference += (Math.abs(html[i] - renderedPdf[i]) + Math.abs(html[i + 1] - renderedPdf[i + 1]) + Math.abs(html[i + 2] - renderedPdf[i + 2])) / (255 * 3);
    const meanDifference = difference / (html.length / 4);
    if (meanDifference > 0.085) throw new Error(`${template} preview/PDF drifted (${meanDifference.toFixed(4)})`);
    console.log(`${template}: parity ${meanDifference.toFixed(4)}, ${document.numPages} page(s)`);
    await page.close();
  }
} finally {
  await browser.close();
}
