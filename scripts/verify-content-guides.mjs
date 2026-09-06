import { mkdir, writeFile, readFile, unlink } from "node:fs/promises";
import { chromium } from "playwright-core";
import { createCanvas } from "@napi-rs/canvas";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

const base = process.env.CONTENT_BASE_URL || "http://127.0.0.1:3100";
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const output = "tmp/content-guides-qa";
await mkdir(output, { recursive: true });
await mkdir("public/product-proof", { recursive: true });
await mkdir("public/samples", { recursive: true });
const errors = [];
let installedProof = false;
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
// Do not send analytics or contact external services during local QA.
await context.route("**/*", route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
await context.route("**/api/events/**", route => route.fulfill({ json: { ok: true } }));
try {
  if (process.argv.includes("--assets")) {
    // An asset-only route is installed temporarily; never overwrite a real page.
    await mkdir("app/content-proof-local", { recursive: true });
    await writeFile("app/content-proof-local/page.tsx", await readFile("scripts/fixtures/content-proof-page.tsx"), { flag: "wx" });
    installedProof = true;
    const page = await context.newPage();
    await page.goto(`${base}/content-proof-local?mode=pdf`, { waitUntil: "networkidle", timeout: 120000 });
    await page.waitForSelector('[data-pdf-ready="true"]');
    const cv = JSON.parse(await page.locator("#content-proof-data").textContent());
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: "print" });
    await page.evaluate(() => {
      document.title = "Alex Morgan - fictional WorkCV example";
      const label = document.createElement("p");
      label.textContent = "Fictional example by WorkCV · Replace all details before applying";
      label.style.cssText = "position:fixed;bottom:12px;left:0;right:0;text-align:center;font:9px Arial;color:#66717d";
      document.body.append(label);
    });
    const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true, margin: { top: "0", right: "0", bottom: "0", left: "0" } });
    await writeFile("public/samples/chatgpt-cv-alex-morgan.pdf", pdf);
    const doc = await pdfjs.getDocument({ data: new Uint8Array(pdf), disableWorker: true }).promise;
    let text = "";
    for (let i = 1; i <= doc.numPages; i++) {
      const p = await doc.getPage(i);
      text += (await p.getTextContent()).items.map(x => x.str || "").join(" ");
      const viewport = p.getViewport({ scale: 96 / 72 });
      const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
      await p.render({ canvas, canvasContext: canvas.getContext("2d"), viewport }).promise;
      await writeFile(`${output}/sample-page-${i}.png`, canvas.toBuffer("image/png"));
      if (i === 1) await writeFile("public/product-proof/chatgpt-cv-pdf.png", canvas.toBuffer("image/png"));
    }
    if (!text.includes("Alex Morgan") || !text.includes("North Lane") || /WorkCV listed|Featured on|Start free/.test(text)) throw new Error("Sample PDF contains missing content or site navigation");
    await writeFile(`${output}/sample-pdf.json`, JSON.stringify({ pages: doc.numPages, bytes: pdf.length, text }, null, 2));
    await page.emulateMedia({ media: "screen" });
    await context.route("**/api/cv/current**", route => route.fulfill({ json: { document: { id: "fictional_content_example", data: cv, updatedAt: "2026-09-06T00:00:00Z" } } }));
    await context.route("**/api/payments/status**", route => route.fulfill({ json: { paid: false, status: "unpaid" } }));
    await page.goto(`${base}/content-proof-local`, { waitUntil: "networkidle", timeout: 120000 });
    await page.locator('input[value="Alex Morgan"]').waitFor();
    await page.screenshot({ path: "public/product-proof/chatgpt-cv-editor.png" });
    await page.locator("summary").filter({ hasText: "More" }).click();
    await page.getByRole("button", { name: "Import CV", exact: true }).click();
    await page.getByRole("dialog").screenshot({ path: "public/product-proof/chatgpt-cv-import.png" });
    const download = await context.request.get(`${base}/api/tools/blank-cv-template`);
    if (!download.ok() || !download.headers()["content-type"].includes("wordprocessingml")) throw new Error("DOCX download failed");
    await writeFile(`${output}/blank-template.docx`, await download.body());
    await page.close();
    console.log(`ASSETS_OK sample_pages=${doc.numPages}`);
  }
  if (!process.argv.includes("--assets-only")) {
    const paths = ["/chatgpt-cv-to-pdf-uk", "/convert-resume-to-uk-cv", "/shorten-cv-to-two-pages", "/cv-word-or-pdf-uk", "/cv-builder-no-subscription-uk", "/tools/blank-cv-template-uk", "/cv-template-care-worker-uk", "/career-change-cv-uk", "/return-to-work-cv-uk", "/tools/ats-score-checker"];
    const rows = [];
    for (const path of paths) {
      const page = await context.newPage();
      page.on("pageerror", err => errors.push(`${path}: ${err.message}`));
      const response = await page.goto(`${base}${path}`, { waitUntil: "networkidle", timeout: 120000 });
      if (!response.ok()) throw new Error(`${path} ${response.status()}`);
      if (await page.locator("h1").count() !== 1) throw new Error(`${path} H1 count`);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      if (canonical !== `https://workcv.co.uk${path}`) throw new Error(`${path} canonical ${canonical}`);
      const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
      schemas.forEach(s => JSON.parse(s));
      for (const width of [390, 768, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(async () => {
          const localImages = [...document.images].filter(i => i.src.startsWith(location.origin));
          localImages.forEach(i => { i.loading = "eager"; });
          await Promise.all(localImages.map(i => i.decode().catch(() => {})));
        });
        const state = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, badImages: [...document.images].filter(i => i.src.startsWith(location.origin) && (!i.complete || i.naturalWidth === 0)).map(i => i.src) }));
        if (state.scroll > width + 1 || state.badImages.length) errors.push(`${path}@${width} ${JSON.stringify(state)}`);
        await page.screenshot({ path: `${output}/${path.slice(1).replaceAll("/", "-")}-${width}.png`, fullPage: true });
        const worked = page.locator("section").filter({ has: page.locator('p', { hasText: "WorkCV worked example" }) }).last();
        if (await worked.count()) await worked.screenshot({ path: `${output}/${path.slice(1).replaceAll("/", "-")}-${width}-worked.png` });
        rows.push({ path, width, canonical, ...state });
      }
      await page.close();
    }
    await writeFile(`${output}/routes.json`, JSON.stringify({ rows, errors }, null, 2));
    if (errors.length) throw new Error(errors.join("\n"));
    console.log(`ROUTES_OK ${rows.length} responsive checks`);
  }
} finally {
  await browser.close();
  if (installedProof) await unlink("app/content-proof-local/page.tsx");
}
