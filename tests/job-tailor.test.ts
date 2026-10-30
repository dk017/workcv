import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

import { prepareDuplicateCv } from "../lib/cv-duplicate.ts";
import { parseCvData } from "../lib/cv-schema.ts";
import { createBlankCv, type CvData } from "../lib/editor-data.ts";
import {
  cvHasContent,
  decodeJobFromHash,
  encodeJobForHash,
  parseJobTailorHandoff,
  parseTailorJob,
  serializeJobTailorHandoff,
  tailorCvForJob,
  tailoredCvTitle,
} from "../lib/job-tailor.ts";

const advert =
  "Warehouse Operative. Essential: forklift licence and experience with stock control. " +
  "You will pick and pack orders, follow health and safety rules and keep accurate records.";

const savedCv = (): CvData => ({
  ...createBlankCv(),
  fullName: "Sam Patel",
  targetRole: "Retail Assistant",
  skills: "Customer service\nCash handling",
  experience: [{ id: "role-1", role: "Retail Assistant", company: "Corner Shop", location: "Leeds", start: "2023", end: "Present", bullets: "Served customers\nRestocked shelves" }],
  coverLetter: {
    jobTitle: "Retail Assistant",
    employer: "Corner Shop",
    reference: "",
    recipientName: "",
    greeting: "hiring-manager",
    employerAddress: "",
    includeDate: true,
    paragraphs: ["I would like to join Corner Shop."],
  },
});

test("accepts a job with a title or a usable advert, and trims untrusted input", () => {
  assert.deepEqual(parseTailorJob({ role: "  Picker  ", employer: " Acme ", advertText: "", source: "job-tracker" }), {
    role: "Picker", employer: "Acme", advertText: "", source: "job-tracker",
  });
  assert.equal(parseTailorJob({ role: "", advertText: advert, source: "tailor-page" })?.advertText, advert);
  assert.equal(parseTailorJob({ role: "", advertText: "too short", source: "tailor-page" }), null);
  assert.equal(parseTailorJob({ role: "Picker", source: "somewhere-else" }), null);
  assert.equal(parseTailorJob({ role: 42, source: "job-tracker" }), null);
  assert.equal(parseTailorJob({ role: "x".repeat(500), source: "job-tracker" })?.role.length, 160);
  assert.equal(parseTailorJob({ role: "Picker", advertText: "a".repeat(20_000), source: "job-tracker" })?.advertText.length, 12_000);
});

test("handoff survives sign-in but expires after an hour", () => {
  const job = parseTailorJob({ role: "Picker", employer: "Acme", advertText: advert, source: "job-tracker" })!;
  const raw = serializeJobTailorHandoff(job, 1_000);
  assert.equal(parseJobTailorHandoff(raw, 1_000 + 59 * 60_000)?.employer, "Acme");
  assert.equal(parseJobTailorHandoff(raw, 1_000 + 61 * 60_000), null);
  assert.equal(parseJobTailorHandoff("{not json", 1_000), null);
  assert.equal(parseJobTailorHandoff(null), null);
});

test("hash links round-trip non-ASCII text and reject anything else", () => {
  const job = { role: "Café Supervisor – Weekends", employer: "Crème & Co", advertText: `${advert} Pay: £12.21 per hour. 😊` };
  const decoded = decodeJobFromHash(`#${encodeJobForHash(job)}`);
  assert.deepEqual(decoded, { ...job, source: "chrome-extension" });
  assert.equal(decodeJobFromHash("#job=not*base64"), null);
  assert.equal(decodeJobFromHash("#something=else"), null);
  assert.equal(decodeJobFromHash(`#job=${Buffer.from(JSON.stringify({ v: 2, role: "Picker" })).toString("base64url")}`), null);
});

test("the Chrome extension builds links the site can read", () => {
  const context: Record<string, unknown> = { TextEncoder, btoa };
  context.globalThis = context;
  vm.runInNewContext(readFileSync(new URL("../chrome-extension/workcv-job-keyword-highlighter/job-link.js", import.meta.url), "utf8"), context);
  const { buildTailorUrl } = context.WorkCVJobLink as { buildTailorUrl: (job: object) => string };
  const url = new URL(buildTailorUrl({ role: "Café Supervisor", employer: "Crème & Co", advertText: `${advert} £12.21 😊` }));
  assert.equal(url.origin + url.pathname, "https://workcv.co.uk/tailor");
  assert.equal(url.searchParams.get("utm_source"), "chrome_extension");
  assert.equal(url.search.includes("Supervisor"), false, "the job must stay in the fragment");
  assert.deepEqual(decodeJobFromHash(url.hash), { role: "Café Supervisor", employer: "Crème & Co", advertText: `${advert} £12.21 😊`, source: "chrome-extension" });
});

test("a CV counts as saved once it has a name or a job", () => {
  assert.equal(cvHasContent(createBlankCv()), false);
  assert.equal(cvHasContent({ ...createBlankCv(), fullName: "Sam" }), true);
  assert.equal(cvHasContent(savedCv()), true);
});

test("tailoring points a copied CV at the vacancy and keeps the letter flagged for review", () => {
  const copy = prepareDuplicateCv(savedCv());
  const tailored = tailorCvForJob(copy, { role: "Warehouse Operative", employer: "Acme Logistics", advertText: advert });
  assert.equal(tailored.targetRole, "Warehouse Operative");
  assert.equal(tailored.targeting?.role, "Warehouse Operative");
  assert.equal(tailored.targeting?.jobDescription, advert);
  assert.ok(tailored.targeting!.priorities.length > 0);
  assert.equal(tailored.coverLetter?.employer, "Acme Logistics");
  assert.equal(tailored.coverLetter?.jobTitle, "Warehouse Operative");
  assert.deepEqual(tailored.coverLetter?.paragraphs, ["I would like to join [employer]."]);
  assert.equal(tailored.experience[0].bullets, "Served customers\nRestocked shelves");
  // The result must still pass the saved-CV schema the API enforces.
  assert.doesNotThrow(() => parseCvData(tailored));
});

test("without advert text the role is set but no keyword targeting is invented", () => {
  const tailored = tailorCvForJob(savedCv(), { role: "Picker", employer: "", advertText: "short" });
  assert.equal(tailored.targetRole, "Picker");
  assert.equal(tailored.targeting, undefined);
  assert.equal(tailored.coverLetter?.employer, "Corner Shop");
});

test("copied CVs are named after the job", () => {
  assert.equal(tailoredCvTitle({ role: "Picker", employer: "Acme" }, "Sam (copy)"), "Picker – Acme");
  assert.equal(tailoredCvTitle({ role: "Picker", employer: "" }, "Sam (copy)"), "Picker");
  assert.equal(tailoredCvTitle({ role: " ", employer: "" }, "Sam (copy)"), "Sam (copy)");
});
