import assert from "node:assert/strict";
import test from "node:test";
import { coverLetterTemplateText, changeCoverLetterRecipient } from "../lib/cover-letter-template.ts";

test("recipient changes preserve edited text", () => {
  const edited = coverLetterTemplateText(true).replace("[Your name]", "Test Applicant");
  const changed = changeCoverLetterRecipient(edited, false);
  assert.equal(changed, edited.replace("Dear [Hiring manager name],", "Dear Sir or Madam,").replace("Yours sincerely,", "Yours faithfully,"));
  assert.equal(changeCoverLetterRecipient(changed, true), edited);
});

test("uses sincerely when the hiring manager is known", () => {
  const template = coverLetterTemplateText(true);
  assert.match(template, /Dear \[Hiring manager name\],/);
  assert.match(template, /Yours sincerely,/);
});

test("uses faithfully when the hiring manager is unknown", () => {
  const template = coverLetterTemplateText(false);
  assert.match(template, /Dear Sir or Madam,/);
  assert.match(template, /Yours faithfully,/);
});

test("includes four evidence-led paragraph prompts", () => {
  const template = coverLetterTemplateText(true);
  assert.match(template, /strongest relevant example/);
  assert.match(template, /second, different example/);
  assert.match(template, /measured result only when you can verify it/);
});
