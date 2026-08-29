import assert from "node:assert/strict";
import test from "node:test";

import {
  preparePersistedSignupAttribution,
  sanitizePersistedSignupAttribution,
} from "../lib/persisted-attribution.ts";

process.env.ANALYTICS_HASH_SECRET = "test-only-persisted-attribution-secret";

test("raw browser identifiers are irreversibly replaced before persistence", () => {
  const persisted = preparePersistedSignupAttribution({
    visitorId: "visitor_1234567890123456",
    sessionId: "session_1234567890123456",
    landingPath: "/pricing",
    utmSource: "newsletter",
  });
  const serialized = JSON.stringify(persisted);

  assert.doesNotMatch(serialized, /visitor_1234567890123456/);
  assert.doesNotMatch(serialized, /session_1234567890123456/);
  assert.match(persisted.visitorHash || "", /^[a-f0-9]{64}$/);
  assert.match(persisted.sessionHash || "", /^[a-f0-9]{64}$/);
  assert.equal(persisted.landingPath, "/pricing");
});

test("historical raw fields and invalid hashes are scrubbed on read", () => {
  const safe = sanitizePersistedSignupAttribution({
    visitorId: "visitor_legacy_identifier",
    sessionId: "session_legacy_identifier",
    visitorHash: "not-a-hash",
    sessionHash: "a".repeat(64),
    landingPath: "/cv-builder-no-subscription-uk",
  });

  assert.equal("visitorId" in safe, false);
  assert.equal("sessionId" in safe, false);
  assert.equal(safe.visitorHash, undefined);
  assert.equal(safe.sessionHash, "a".repeat(64));
});
