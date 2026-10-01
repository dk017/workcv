import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const editorSource = readFileSync(
  new URL("../components/cv-editor.tsx", import.meta.url),
  "utf8",
);
const documentSource = readFileSync(
  new URL("../components/editor/cv-document.tsx", import.meta.url),
  "utf8",
);
const printCss = readFileSync(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);

test("all CV templates are covered by fixed A4 print rules", () => {
  ["classic", "modern", "compact"].forEach((template) => {
    assert.match(
      printCss,
      new RegExp(`print-document\\[data-template="${template}"\\]`),
    );
    assert.match(documentSource, new RegExp(`data-template="${template}"`));
  });
  assert.match(printCss, /@page\s*{[\s\S]*size:\s*A4/);
});

test("fixed-format CV documents do not use viewport layout breakpoints", () => {
  assert.doesNotMatch(documentSource, /\b(?:sm|md|lg|xl):[^\s"`]+/);
});

test("preview does not render misleading page guide boundaries", () => {
  assert.doesNotMatch(editorSource, /cv-page-guide/);
  assert.doesNotMatch(editorSource, /Page count is an estimate/);
  assert.match(editorSource, /Math\.ceil\(document\.scrollHeight \/ 1123\)/);
});

test("CV headings keep letter spacing low enough to extract as whole words", () => {
  // pdf.js, pdfminer and PyMuPDF split uppercase headings into single letters
  // ("P R O F I L E") from about 0.12em; 0.1em was the widest value that still
  // extracted cleanly, so stay well below it on screen and use normal in print.
  const trackingValues = Array.from(documentSource.matchAll(/tracking-\[(\d*\.?\d+)em\]/g)).map((m) => Number(m[1]));
  assert.ok(trackingValues.length > 0);
  trackingValues.forEach((value) => assert.ok(value <= 0.05, `tracking ${value}em is too wide`));
  assert.doesNotMatch(documentSource, /tracking-(?:wide|wider|widest)\b/);
  assert.match(printCss, /\.print-document h3,\s*\.print-document \.cv-sidebar > p\s*{\s*letter-spacing: normal !important;/);
  const cssSpacing = Array.from(printCss.matchAll(/letter-spacing:\s*(\d*\.?\d+)em/g)).map((m) => Number(m[1]));
  cssSpacing.forEach((value) => assert.ok(value <= 0.05, `letter-spacing ${value}em is too wide`));
});
