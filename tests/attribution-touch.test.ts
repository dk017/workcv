import assert from "node:assert/strict";
import test from "node:test";

import { shouldReplaceLastTouch } from "../lib/attribution.ts";

test("non-direct traffic updates last touch immediately", () => {
  assert.equal(shouldReplaceLastTouch(new Date().toISOString(), true), true);
});

test("direct traffic preserves a known last touch for 30 days", () => {
  const now = Date.parse("2026-08-27T12:00:00Z");
  assert.equal(
    shouldReplaceLastTouch("2026-08-10T12:00:00Z", false, now),
    false,
  );
  assert.equal(
    shouldReplaceLastTouch("2026-07-20T12:00:00Z", false, now),
    true,
  );
});
