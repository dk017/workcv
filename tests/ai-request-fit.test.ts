import assert from "node:assert/strict";
import test from "node:test";

import { aiLimits, fitAdvert, fitLines } from "../lib/ai-request-fit.ts";
import { cvSummaryInputSchema } from "../lib/cv-summary-generator.ts";

test("long CV evidence keeps whole lines, earliest first, within the limit", () => {
  const lines = Array.from({ length: 60 }, (_, i) => `Line ${i + 1}: handled escalations, reported weekly figures and coached new starters.`);
  const fitted = fitLines(lines.join("\n"), aiLimits.summaryEvidence);
  assert.ok(fitted.length <= aiLimits.summaryEvidence, String(fitted.length));
  assert.ok(fitted.startsWith("Line 1:"));
  assert.ok(fitted.split("\n").every((line) => lines.includes(line)), "no line is cut in half");
  assert.equal(fitLines("short\n\n  text  ", 100), "short\ntext");
});

test("a single line longer than the limit is cut at a word", () => {
  const fitted = fitLines("word ".repeat(100).trim(), 52);
  assert.ok(fitted.length <= 52);
  assert.ok(fitted.endsWith("word"));
});

test("long adverts are shortened at a line break", () => {
  const advert = Array.from({ length: 200 }, (_, i) => `Requirement ${i + 1}: experience with stock control and suppliers.`).join("\n");
  const fitted = fitAdvert(advert);
  assert.ok(fitted.length <= aiLimits.jobDescription);
  assert.ok(fitted.endsWith("suppliers."));
  assert.equal(fitAdvert("  A short advert.  "), "A short advert.");
});

test("the profile tool accepts what the editor sends for a long CV, and explains its limits", () => {
  const evidence = fitLines(Array.from({ length: 80 }, (_, i) => `Achievement ${i + 1} with a measurable result for the team`).join("\n"), aiLimits.summaryEvidence);
  const parsed = cvSummaryInputSchema.safeParse({ background: "Software Engineer at Example Ltd. BSc Computer Science at Example University", targetRole: "Software Engineer", evidence, jobDescription: fitAdvert("x ".repeat(6_000)) });
  assert.ok(parsed.success);
  const tooLong = cvSummaryInputSchema.safeParse({ background: "Software Engineer at Example Ltd. BSc Computer Science at Example University", targetRole: "Software Engineer", evidence: "a".repeat(2_500) });
  assert.equal(tooLong.success, false);
  assert.match(tooLong.error!.issues[0].message, /under 2,000 characters/);
});
