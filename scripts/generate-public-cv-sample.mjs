import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

const baseUrl = process.env.PUBLIC_SAMPLE_BASE_URL || "http://127.0.0.1:3000";
const executablePath =
  process.env.CHROMIUM_PATH ||
  (process.platform === "win32"
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : "/usr/bin/chromium");

const pdfPath = resolve("public/samples/workcv-customer-service-cv-example.pdf");
const imagePath = resolve("public/product-proof/workcv-customer-service-sample.png");
const pageUrl = `${baseUrl}/cv-pdf-parity?template=compact&roleTemplate=customer-service`;
const samplePdfTitle = "WorkCV fictional customer service CV example";

await mkdir(resolve("public/samples"), { recursive: true });
await mkdir(resolve("public/product-proof"), { recursive: true });

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1 });
  await page.goto(pageUrl, { waitUntil: "networkidle", timeout: 30_000 });
  await page.waitForSelector('[data-pdf-ready="true"]', { timeout: 10_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate((title) => {
    document.title = title;
  }, samplePdfTitle);
  await page.emulateMedia({ media: "print" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
    displayHeaderFooter: false,
  });
  const parsedPdf = await pdfjs.getDocument({
    data: new Uint8Array(pdf),
    disableWorker: true,
  }).promise;
  const metadata = await parsedPdf.getMetadata();
  const screenshot = await page.screenshot({ fullPage: true, type: "png" });

  if (pdf.byteLength < 10_000 || !pdf.subarray(0, 4).equals(Buffer.from("%PDF"))) {
    throw new Error(`Sample PDF failed validation (${pdf.byteLength} bytes)`);
  }
  if (metadata.info?.Title !== samplePdfTitle) {
    throw new Error(`Sample PDF metadata title mismatch (${metadata.info?.Title || "missing"})`);
  }
  if (screenshot.byteLength < 10_000) {
    throw new Error(`Sample screenshot failed validation (${screenshot.byteLength} bytes)`);
  }

  await writeFile(pdfPath, pdf);
  await writeFile(imagePath, screenshot);
  console.log(`PUBLIC_SAMPLE_OK pdf=${pdfPath} bytes=${pdf.byteLength} image=${imagePath} bytes=${screenshot.byteLength}`);
} finally {
  await browser.close();
}
