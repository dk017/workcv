import assert from "node:assert/strict";
import test from "node:test";

import { isAllowedClientEditorEvent } from "../lib/editor-events.ts";

test("client event ingestion rejects server-authoritative lifecycle events", () => {
  for (const eventName of [
    "document_created",
    "cv_created",
    "payment_confirmed",
    "pdf_downloaded",
    "docx_downloaded",
  ]) {
    assert.equal(isAllowedClientEditorEvent(eventName), false, eventName);
  }
  assert.equal(isAllowedClientEditorEvent("preview_ready"), true);
  assert.equal(isAllowedClientEditorEvent("payment_started"), true);
  assert.equal(isAllowedClientEditorEvent("docx_clicked"), true);
});

test("purpose question accepts only its fixed answers and stores nothing else", async () => {
  const { surveyEventMetadata } = await import("../lib/editor-events.ts");
  assert.deepEqual(surveyEventMetadata("cv_purpose_selected", { purpose: "redundancy", extra: "x" }), { purpose: "redundancy" });
  assert.equal(surveyEventMetadata("cv_purpose_selected", { purpose: "my name is Sam" }), null);
  assert.equal(surveyEventMetadata("cv_purpose_selected", {}), null);
  assert.deepEqual(surveyEventMetadata("cv_application_volume_selected", { volume: "more_than_ten" }), { volume: "more_than_ten" });
  assert.equal(surveyEventMetadata("cv_application_volume_selected", { volume: "50" }), null);
  assert.deepEqual(surveyEventMetadata("cv_purpose_dismissed", { anything: "x" }), {});
  assert.deepEqual(surveyEventMetadata("preview_ready", { page_count: 2 }), { page_count: 2 });
});

test("what-was-missing question accepts only its fixed answers and stores nothing else", async () => {
  const { surveyEventMetadata, missingFeatureOptions, isAllowedClientEditorEvent } = await import("../lib/editor-events.ts");
  assert.equal(isAllowedClientEditorEvent("cv_missing_feature_selected"), true);
  for (const [value] of missingFeatureOptions) {
    assert.deepEqual(surveyEventMetadata("cv_missing_feature_selected", { feature: value, extra: "x" }), { feature: value });
  }
  // Free text, personal details, unknown or empty answers are refused outright.
  assert.equal(surveyEventMetadata("cv_missing_feature_selected", { feature: "my email is sam@example.test" }), null);
  assert.equal(surveyEventMetadata("cv_missing_feature_selected", { feature: "LINKEDIN_IMPORT" }), null);
  assert.equal(surveyEventMetadata("cv_missing_feature_selected", { feature: "" }), null);
  assert.equal(surveyEventMetadata("cv_missing_feature_selected", { feature: 5 }), null);
  assert.equal(surveyEventMetadata("cv_missing_feature_selected", {}), null);
  // The key of another question does not count as an answer to this one.
  assert.equal(surveyEventMetadata("cv_missing_feature_selected", { purpose: "redundancy" }), null);
});

test("what-was-missing options are well formed and the two non-feature answers exist", async () => {
  const { missingFeatureOptions } = await import("../lib/editor-events.ts");
  const values = missingFeatureOptions.map(([value]) => value);
  const labels = missingFeatureOptions.map(([, label]) => label);
  assert.equal(new Set(values).size, values.length, "values are unique");
  assert.equal(new Set(labels).size, labels.length, "labels are unique");
  for (const value of values) assert.match(value, /^[a-z]+(_[a-z]+)*$/);
  for (const label of labels) assert.ok(label.length >= 6 && label.length <= 60, label);
  assert.ok(values.includes("nothing"), "people who needed nothing can say so");
  assert.ok(values.includes("other"));
});
