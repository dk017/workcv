import assert from "node:assert/strict";
import test from "node:test";

import {
  funnelEventDedupeValue,
  hashAnalyticsIdentifier,
  normalizeTrafficSource,
  sanitizeFunnelEvent,
  sanitizeReferrerHost,
  sanitizeSameOriginPath,
} from "../lib/funnel-events.ts";

process.env.ANALYTICS_HASH_SECRET = "test-only-analytics-secret";

test("landing views deduplicate by session while other events keep their event ID", () => {
  assert.equal(
    funnelEventDedupeValue("landing_view", "event_1234567890123456", "session_1234567890123456"),
    "landing_view:session_1234567890123456",
  );
  assert.equal(
    funnelEventDedupeValue(
      "marketing_cta_clicked",
      "event_1234567890123456",
      "session_1234567890123456",
    ),
    "event_1234567890123456",
  );
});

const validEvent = {
  eventId: "event_1234567890123456",
  visitorId: "visitor_12345678901234",
  sessionId: "session_12345678901234",
  eventName: "marketing_cta_clicked",
  path: "/pricing?ignored=yes",
  source: "chatgpt.com",
  referrerHost: "chatgpt.com",
  deviceClass: "mobile",
  metadata: {
    destination: "/editor?new=1",
    placement: "pricing_hero_editor",
    cv_text: "must not survive",
  },
};

test("sanitises a privacy-safe public funnel event", () => {
  const event = sanitizeFunnelEvent(validEvent);
  assert.ok(event);
  assert.equal(event.path, "/pricing");
  assert.equal(event.referrerHost, "chatgpt.com");
  assert.deepEqual(event.metadata, {
    destination: "/editor",
    placement: "pricing_hero_editor",
  });
  assert.equal("cv_text" in event.metadata, false);
});

test("rejects unknown events, unsafe paths, raw URLs and invalid identifiers", () => {
  assert.equal(sanitizeFunnelEvent({ ...validEvent, eventName: "payment_confirmed" }), null);
  assert.equal(sanitizeFunnelEvent({ ...validEvent, path: "https://evil.example/" }), null);
  assert.equal(sanitizeFunnelEvent({ ...validEvent, visitorId: "short" }), null);
  assert.equal(sanitizeSameOriginPath("//evil.example/path"), null);
  assert.equal(sanitizeReferrerHost("https://google.com/search"), undefined);
});

test("normalises search and AI sources without treating UTMs as proof", () => {
  assert.equal(normalizeTrafficSource("chatgpt.com"), "chatgpt");
  assert.equal(normalizeTrafficSource(undefined, "claude.ai"), "claude");
  assert.equal(normalizeTrafficSource(undefined, "gemini.google.com"), "gemini");
  assert.equal(normalizeTrafficSource(undefined, "www.google.co.uk"), "google");
  assert.equal(normalizeTrafficSource(undefined, undefined), "direct_or_unknown");
});

test("hashes browser identifiers before persistence", () => {
  const value = "visitor_12345678901234";
  const hash = hashAnalyticsIdentifier(value);
  assert.notEqual(hash, value);
  assert.match(hash, /^[a-f0-9]{64}$/);
  assert.equal(hash, hashAnalyticsIdentifier(value));
});
