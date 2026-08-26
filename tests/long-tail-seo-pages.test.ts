import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (route: string) => readFileSync(route, "utf8");

const blank = read("app/tools/blank-cv-template-uk/page.tsx");
const word = read("app/tools/cv-template-word-uk/page.tsx");
const noSubscription = read("app/cv-builder-no-subscription-uk/page.tsx");
const pricing = read("app/pricing/page.tsx");
const sitemap = read("app/sitemap.ts");

test("long-tail canonical pages exist and stay distinct", () => {
  assert.ok(existsSync("app/tools/blank-cv-template-uk/page.tsx"));
  assert.ok(existsSync("app/tools/cv-template-word-uk/page.tsx"));
  assert.match(blank, /Free UK CV template to download and edit/);
  assert.match(blank, /api\/tools\/blank-cv-template/);
  assert.match(word, /How to edit a CV template in Microsoft Word/);
  assert.match(word, /Word's paragraph and style controls/);
  assert.match(word, /page breaks/);
  assert.doesNotMatch(word, /Download a free UK CV template for Microsoft Word\. Editable single-column DOCX/);
});

test("free-template truth is explicit and does not blur the paid flow", () => {
  assert.match(blank, /no account, email gate, payment,\s*watermark or subscription/);
  assert.match(blank, /free to build and preview/);
  assert.match(blank, /site\.price/);
  assert.match(blank, /offers: \{ "@type": "Offer", price: "0"/);
  assert.doesNotMatch(blank, /free PDF/i);
  assert.match(word, /blank DOCX template downloads directly/);
  assert.match(word, /one-time PDF price shown before download/);
});

test("internal-link clusters connect commercial and editorial intent", () => {
  for (const source of [noSubscription, pricing]) {
    assert.match(source, /\/tools\/blank-cv-template-uk/);
    assert.match(source, /\/tools\/cv-template-word-uk/);
    assert.match(source, /\/cv-personal-statement-uk/);
  }
  for (const route of [
    "app/cv-template-customer-service-uk/page.tsx",
    "app/cv-template-care-worker-uk/page.tsx",
    "app/cv-template-warehouse-uk/page.tsx",
    "app/cv-template-nurse-uk/page.tsx",
    "app/cv-template-graduate-uk/page.tsx",
    "app/cv-template-engineer-uk/page.tsx",
    "app/career-change-cv-uk/page.tsx",
    "app/return-to-work-cv-uk/page.tsx",
  ]) {
    const source = read(route);
    assert.match(source, /\/cv-personal-statement-uk/);
    assert.match(source, /\/tools\/blank-cv-template-uk/);
    assert.match(source, /\/tools\/cv-template-word-uk/);
  }
});

test("sitemap dates reflect the implementation pass", () => {
  for (const route of [
    "/pricing",
    "/cv-builder-no-subscription-uk",
    "/tools/blank-cv-template-uk",
    "/tools/cv-template-word-uk",
    "/cv-template-customer-service-uk",
    "/cv-template-engineer-uk",
    "/cv-template-care-worker-uk",
    "/cv-template-warehouse-uk",
    "/cv-template-nurse-uk",
    "/cv-template-graduate-uk",
    "/career-change-cv-uk",
    "/return-to-work-cv-uk",
  ]) assert.match(sitemap, new RegExp(`path: "${route.replaceAll("/", "\\/")}"[^\\n]*lastModified: "2026-08-26"`));
});

test("new pages avoid unsupported guarantees", () => {
  for (const source of [blank, word]) {
    assert.doesNotMatch(source, /guaranteed interview|ATS guaranteed|NHS approved|recruiter approved/i);
  }
});
