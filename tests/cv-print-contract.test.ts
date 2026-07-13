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
