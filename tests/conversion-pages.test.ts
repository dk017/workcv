import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const globalCss = readFileSync("app/globals.css", "utf8");
const siteSource = readFileSync("lib/site.ts", "utf8");
const pricingSource = readFileSync("app/pricing/page.tsx", "utf8");
const editorSource = readFileSync("components/cv-editor.tsx", "utf8");

test("mobile page containers use valid calculated widths", () => {
  assert.match(globalCss, /min\(1120px, calc\(100% - 32px\)\)/);
  assert.match(globalCss, /min\(1360px, calc\(100% - 32px\)\)/);
  assert.doesNotMatch(globalCss, /min\(100% - 32px/);
});

test("customer-facing WorkCV prices use the UK pound symbol", () => {
  assert.match(siteSource, /priceGbp:\s*`£\$\{priceAmount\.toFixed\(2\)\}`/);
});

test("pricing keeps the evidence while removing repeated reassurance sections", () => {
  assert.match(pricingSource, /id="compare"/);
  assert.match(pricingSource, /Competitor prices checked/);
  assert.match(pricingSource, /source:\s*"https:\/\/www\.myperfectcv\.co\.uk\/pricing"/);
  assert.doesNotMatch(pricingSource, /No hidden fees guarantee/);
  assert.doesNotMatch(pricingSource, /When a subscription might make sense/);
});

test("editor keeps primary actions focused and groups secondary actions", () => {
  assert.match(editorSource, /<details className="relative order-1 sm:order-none">/);
  assert.match(editorSource, />\s*More\s*<\/summary>/);
  assert.match(editorSource, /Template: \{selectedTemplate\?\.name \?\? "Choose"\}/);
  assert.match(editorSource, /Tailor to job/);
  assert.match(editorSource, /Import CV/);
  assert.match(editorSource, /New CV/);
  assert.doesNotMatch(editorSource, /Fill the guided sections/);
});
