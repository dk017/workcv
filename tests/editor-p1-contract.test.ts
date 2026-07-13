import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const editorSource = readFileSync("components/cv-editor.tsx", "utf8");
const formsSource = readFileSync("components/editor/editor-forms.tsx", "utf8");
const eventsSource = readFileSync("lib/editor-events.ts", "utf8");

test("editor assistance keeps AI changes behind explicit review", () => {
  assert.match(editorSource, /Compare before applying/);
  assert.match(editorSource, /will never apply AI text without your confirmation/);
  assert.match(editorSource, /Select only accurate suggestions/);
  assert.match(editorSource, /ai_suggestion_rejected/);
});

test("AI assistance is limited to high-value CV content fields", () => {
  assert.match(formsSource, /Improve profile/);
  assert.match(formsSource, /Improve/);
  assert.match(formsSource, /Suggest skills/);
  assert.doesNotMatch(formsSource, /Improve email|Improve phone|Suggest name/i);
});

test("mobile editing and page-count guidance remain available", () => {
  assert.match(editorSource, /aria-label="Editor view"/);
  assert.match(editorSource, /Edit CV/);
  assert.match(editorSource, /Preview/);
  assert.match(editorSource, /Most UK applicants should aim for two pages/);
  assert.match(editorSource, /Use Compact/);
});

test("preview uses the available column without redundant chrome", () => {
  assert.doesNotMatch(editorSource, />\s*Live preview\s*</);
  assert.doesNotMatch(editorSource, /Local draft/);
  assert.match(editorSource, /availableWidth \/ 794/);
  assert.match(editorSource, /Math\.min\(1, availableWidth \/ 794\)/);
});

test("readiness checks stay out of creation and remain minimal at download", () => {
  assert.doesNotMatch(editorSource, /Checks for this section/);
  assert.doesNotMatch(editorSource, /Your CV needs one more review/);
  assert.doesNotMatch(editorSource, /Review complete/);
  assert.match(editorSource, /issue\.severity === "fix"/);
  assert.match(editorSource, /Before downloading:/);
  assert.match(editorSource, /You can keep editing or continue with this version/);
});

test("P1 funnel events are allowlisted", () => {
  for (const eventName of [
    "ai_suggestion_generated",
    "ai_suggestion_applied",
    "ai_suggestion_rejected",
    "skill_suggestions_opened",
    "job_tailoring_saved",
    "mobile_view_changed",
    "pdf_generation_retried",
    "pdf_generation_failed",
  ]) {
    assert.match(eventsSource, new RegExp(`"${eventName}"`));
  }
});
