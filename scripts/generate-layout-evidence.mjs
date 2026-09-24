import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright-core";
import { createCanvas } from "@napi-rs/canvas";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
const base = process.env.LAYOUT_BASE_URL || "http://127.0.0.1:3100";
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const variants = [
  ["classic", "Classic", "classic", "standard"], ["modern", "Modern", "modern", "standard"], ["compact", "Compact", "compact", "standard"],
  ["education-first", "Education first", "classic", "education-first"], ["compact-single", "Compact single column", "classic", "compact-single"], ["experienced", "Experienced professional", "classic", "experienced"],
];
const reports = [];
await mkdir("public/samples/layouts", { recursive: true });
await mkdir("tmp/layout-evidence", { recursive: true });
try {
  for (const [id, name, template, preset] of variants) {
    const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
    await page.route("**/api/**", route => route.fulfill({ status: 200, json: {} }));
    await page.goto(base + "/cv-pdf-parity?sample=layout&template=" + template + "&layoutPreset=" + preset, { waitUntil: "networkidle" });
    await page.waitForSelector('[data-pdf-ready="true"]');
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: "print" });
    const buffer = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true, margin: { top: "0", right: "0", bottom: "0", left: "0" } });
    const task = pdfjs.getDocument({ data: new Uint8Array(buffer) });
    const pdf = await task.promise;
    const pages = [];
    for (let n = 1; n <= pdf.numPages; n++) {
      const parsed = await pdf.getPage(n);
      const content = await parsed.getTextContent();
      pages.push(content.items.map(item => "str" in item ? item.str + (item.hasEOL ? "\n" : " ") : "").join(""));
      const viewport = parsed.getViewport({ scale: 1 });
      const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
      await parsed.render({ canvas, canvasContext: canvas.getContext("2d"), viewport }).promise;
      await writeFile("tmp/layout-evidence/" + id + "-" + n + ".png", canvas.toBuffer("image/png"));
      if (n === 1) await writeFile("public/samples/layouts/" + id + ".png", canvas.toBuffer("image/png"));
    }
    const text = pages.join("\n\n").split(/\r?\n/).map(line => line.trimEnd()).join("\n");
    for (const phrase of ["Emily Thompson", "North Street Books", "Community book exchange", "Emergency First Aid", "French"]) {
      if (!text.replace(/\s+/g, " ").includes(phrase)) throw new Error(id + ": expected sample text missing: " + phrase);
    }
    await writeFile("public/samples/layouts/" + id + ".pdf", buffer);
    await writeFile("public/samples/layouts/" + id + ".txt", text);
    reports.push({ id, name, template, preset, pages: pdf.numPages, words: text.trim().split(/\s+/).length, headings: [...text.matchAll(/\b(PROFILE|EXPERIENCE|EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|VOLUNTEERING|LANGUAGES)\b/g)].map(match => match[0]) });
    await task.destroy(); await page.close();
  }
  await writeFile("public/samples/layouts/report.json", JSON.stringify({ generatedAt: new Date().toISOString(), parser: "PDF.js " + pdfjs.version, renderer: "Chromium " + browser.version(), fixture: "Fictional Emily Thompson CV with the same content across six layouts", reports }, null, 2));
  console.log(JSON.stringify(reports, null, 2));
} finally { await browser.close(); }
