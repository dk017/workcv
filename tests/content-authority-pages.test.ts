import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("app/cv-personal-statement-uk/page.tsx", "utf8");
const examples = page.split("const examples: Example[] = [")[1]?.split("const beforeAfter")[0] ?? "";
const proof = readFileSync("components/sample-cv-proof.tsx", "utf8");
const sitemap = readFileSync("app/sitemap.ts", "utf8");

test("personal statement page has exactly twelve required examples", () => {
  assert.equal((examples.match(/\n    title:/g) || []).length, 12);
  for (const title of [
    "NHS administrative assistant",
    "Care worker",
    "Graduate data analyst",
    "Retail supervisor",
    "Mechanical engineer",
    "Career changer: retail to administration",
    "Customer service adviser",
    "Warehouse operative",
    "Returning to work",
    "School leaver / no experience",
    "Redundancy / experienced professional",
    "Project or operations manager",
  ]) assert.ok(examples.includes(`title: "${title}"`), title);
});

test("walkthrough and Civil Service clarification are explicit", () => {
  assert.match(page, /C9301-26-0052/);
  assert.match(page, /Fictional candidate/);
  assert.match(page, /Never fill a gap by inventing a system/);
  assert.match(page, /Success Profiles/);
  assert.match(page, /Examples on this page are fictional/);
  assert.match(page, /"@type": "Article"/);
  assert.match(page, /"@type": "FAQPage"/);
  assert.match(page, /name: "WorkCV Editorial Team"/);
});

test("sample proof is wired to the current product promise", () => {
  assert.match(proof, /workcv-customer-service-cv-example\.pdf/);
  assert.match(proof, /download/);
  assert.match(proof, /site\.price/);
  assert.match(proof, /no monthly\s+subscription/i);
  assert.match(proof, /automatic\s+renewal/i);
  assert.match(proof, /Fictional sample/);
  assert.match(proof, /product-proof\/workcv-customer-service-sample\.png/);
  const samplePdf = readFileSync("public/samples/workcv-customer-service-cv-example.pdf");
  assert.equal(samplePdf.subarray(0, 4).toString("ascii"), "%PDF");
  assert.ok(samplePdf.byteLength > 10_000);
});

test("required commercial pages render the proof component", () => {
  for (const route of [
    "app/cv-personal-statement-uk/page.tsx",
    "app/cv-builder-no-subscription-uk/page.tsx",
    "app/pricing/page.tsx",
  ]) assert.match(readFileSync(route, "utf8"), /SampleCvProof/);
});

test("personal statement route has an explicit current sitemap date", () => {
  assert.match(sitemap, /path: "\/cv-personal-statement-uk"[^\n]*lastModified: "2026-08-25"/);
});

test("required related pages link to personal statement guidance", () => {
  for (const route of [
    "app/cv-template-nurse-uk/page.tsx",
    "app/cv-template-care-worker-uk/page.tsx",
    "app/cv-template-engineer-uk/page.tsx",
    "app/cv-template-graduate-uk/page.tsx",
    "app/cv-template-customer-service-uk/page.tsx",
    "app/cv-template-warehouse-uk/page.tsx",
    "app/career-change-cv-uk/page.tsx",
    "app/return-to-work-cv-uk/page.tsx",
    "app/cv-no-experience-uk/page.tsx",
    "app/situations/made-redundant/page.tsx",
  ]) assert.match(readFileSync(route, "utf8"), /\/cv-personal-statement-uk/);
});

test("changed content does not claim fabricated approval or outcomes", () => {
  assert.doesNotMatch(page, /guaranteed interviews|NHS approved|recruiter approved|five-star rating/i);
  assert.doesNotMatch(proof, /testimonial|customer success rate|interview success/i);
});
