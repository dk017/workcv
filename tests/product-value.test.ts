import test from "node:test";
import assert from "node:assert/strict";
import { createBlankCv, orderedCvSections } from "../lib/editor-data.ts";
import { parseCvData, repairCvData } from "../lib/cv-schema.ts";
import { canCapturePublicTouch } from "../lib/attribution.ts";
import { normalizeTrafficSource } from "../lib/funnel-events.ts";
import { documentReadability, validateDocxArchive } from "../lib/document-readability.ts";
import { evidenceStatus, statementExample, buildStatement, statementWordCount } from "../lib/supporting-statement.ts";
test("legacy CVs still validate and optional sections survive save/repair", () => {
  const old = createBlankCv(); assert.deepEqual(parseCvData(old), old);
  const cv = { ...old, layoutPreset: "education-first" as const, additionalSections: { projects: "A real project", languages: "French: conversational" }, applicationPack: { bullets: ["Truthful wording"], coverLetter: "My draft", interviewPrompts: ["Explain your actions"], thankYouEmail: "Thank you", originalCvText: "Original CV unchanged", evidenceReview: ["Not evidenced"] } };
  assert.deepEqual(parseCvData(cv), cv); assert.deepEqual(repairCvData(cv), cv);
  assert.ok(orderedCvSections(cv).indexOf("education") < orderedCvSections(cv).indexOf("experience"));
  assert.throws(() => parseCvData({ ...cv, sectionOrder: ["education", "education"] }));
  assert.throws(() => parseCvData({ ...cv, additionalSections: { projects: "x".repeat(5001) } }));
  assert.equal(orderedCvSections({ ...cv, sectionOrder: ["languages", "profile"] })[0], "languages");
});
test("Brave is separate from generic referrals without matching spoofed suffixes", () => {
  assert.equal(normalizeTrafficSource(undefined, "search.brave.com"), "brave");
  assert.equal(normalizeTrafficSource("brave"), "brave");
  assert.equal(normalizeTrafficSource(undefined, "search.brave.com.evil.test"), "referral");
});
test("public acquisition cannot be replaced by private paths or client navigation", () => {
  assert.equal(canCapturePublicTouch("/login", "/tools"), false);
  assert.equal(canCapturePublicTouch("/editor", "/tools"), false);
  assert.equal(canCapturePublicTouch("/pricing", "/tools", true), false);
  assert.equal(canCapturePublicTouch("/tools", "/login", true), true);
  assert.equal(canCapturePublicTouch("/pricing", "/tools", false), true);
});
test("file checks report empty/image pages and unsupported text honestly", () => {
  const report = documentReadability([{ number: 1, text: "" }, { number: 2, text: "Experience\nContact test@example.com\nBad \uFFFD character" }]);
  assert.deepEqual(report.emptyPages, [1]);
  assert.ok(report.warnings.some((item) => item.includes("OCR")));
  assert.ok(report.warnings.some((item) => item.includes("decoded")));
  assert.throws(() => validateDocxArchive(new ArrayBuffer(12)));
});
test("statement planner only assembles entered evidence and exposes missing fields", () => {
  assert.equal(evidenceStatus(statementExample), "Draft evidence entered");
  assert.equal(evidenceStatus({ ...statementExample, outcome: "" }), "Needs detail");
  const draft = buildStatement([statementExample]);
  assert.ok(draft.includes(statementExample.action)); assert.ok(statementWordCount(draft) > 20);
  assert.equal(buildStatement([{ ...statementExample, criterion: "" }]), "");
  assert.equal(statementWordCount(""), 0);
});
