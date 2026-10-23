import assert from "node:assert/strict";
import test from "node:test";

import { describeCvValidationError, findCvSaveIssue, tabForCvField } from "../lib/cv-save-validation.ts";
import { CvValidationError, parseCvData } from "../lib/cv-schema.ts";
import { createBlankCv } from "../lib/editor-data.ts";

const blank = createBlankCv("classic");

test("a valid CV has no save issue", () => {
  assert.equal(findCvSaveIssue(blank), null);
});

test("editor input the server rejects is named in plain English", () => {
  const cases: Array<[unknown, string, RegExp]> = [
    [{ ...blank, skills: Array(30).fill("Stakeholder management").join(", ") }, "skills", /^Not saved\. Skills has a line over 200 characters\. Put each skill on its own line\.$/],
    [{ ...blank, skills: Array(51).fill("Excel").join("\n") }, "skills", /Skills has more than 50 lines/],
    [{ ...blank, experience: [blank.experience[0], { ...blank.experience[0], id: "exp-2", bullets: "x".repeat(1_001) }] }, "experience.bullets", /Experience 2 – bullet points has a line over 1,000 characters/],
    [{ ...blank, experience: [{ ...blank.experience[0], role: "r".repeat(161) }] }, "experience.role", /Experience 1 – job title is too long\. Keep it under 160 characters\./],
    [{ ...blank, profile: "p".repeat(5_001) }, "profile", /Profile summary is too long\. Keep it under 5,000 characters\./],
  ];
  for (const [cv, field, message] of cases) {
    const issue = findCvSaveIssue(cv);
    assert.equal(issue?.field, field);
    assert.match(issue?.message || "", message);
  }
});

test("the client check matches the server's response for the same data", () => {
  const cv = { ...blank, skills: "s".repeat(201) };
  let serverError: unknown;
  try { parseCvData(cv); } catch (error) { serverError = error; }
  assert.ok(serverError instanceof CvValidationError);
  assert.deepEqual(describeCvValidationError(serverError), findCvSaveIssue(cv));
});

test("an oversized CV is reported without field details", () => {
  const issue = findCvSaveIssue({ ...blank, applicationPack: { bullets: [], coverLetter: "c".repeat(10_000), interviewPrompts: [], thankYouEmail: "t".repeat(5_000), originalCvText: "o".repeat(24_000) }, targeting: { role: "", jobDescription: "j".repeat(30_000), priorities: [] }, profile: "p".repeat(5_000), skills: "", experience: [{ ...blank.experience[0], bullets: Array(50).fill("b".repeat(600)).join("\n") }] });
  assert.equal(issue?.field, "size");
});

test("fields map to the editor tab that holds them", () => {
  assert.equal(tabForCvField("experience.bullets"), "experience");
  assert.equal(tabForCvField("coverLetter.paragraphs"), "cover-letter");
  assert.equal(tabForCvField("additionalSections.projects"), "template");
  assert.equal(tabForCvField("targeting.jobDescription"), null);
  assert.equal(tabForCvField("size"), null);
});
