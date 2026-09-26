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
