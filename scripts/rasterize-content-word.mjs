import { readFile, writeFile } from "node:fs/promises";
import { createCanvas } from "@napi-rs/canvas";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
const doc = await pdfjs.getDocument({ data: new Uint8Array(await readFile("tmp/content-guides-qa/blank-template-word.pdf")), disableWorker: true }).promise;
for (let i = 1; i <= doc.numPages; i++) {
  const page = await doc.getPage(i);
  const viewport = page.getViewport({ scale: 96 / 72 });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  await page.render({ canvas, canvasContext: canvas.getContext("2d"), viewport }).promise;
  await writeFile(`tmp/content-guides-qa/word-page-${i}.png`, canvas.toBuffer("image/png"));
  if (i === 1) await writeFile("public/product-proof/blank-word-template.png", canvas.toBuffer("image/png"));
}
console.log(`WORD_RENDER_OK pages=${doc.numPages}`);
