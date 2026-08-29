import assert from "node:assert/strict";
import test from "node:test";

import { isAllowedClientEditorEvent } from "../lib/editor-events.ts";

test("client event ingestion rejects server-authoritative lifecycle events", () => {
  for (const eventName of [
    "document_created",
    "cv_created",
    "payment_confirmed",
    "pdf_downloaded",
  ]) {
    assert.equal(isAllowedClientEditorEvent(eventName), false, eventName);
  }
  assert.equal(isAllowedClientEditorEvent("preview_ready"), true);
  assert.equal(isAllowedClientEditorEvent("payment_started"), true);
});
