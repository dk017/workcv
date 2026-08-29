import assert from "node:assert/strict";
import test from "node:test";

import { consumeFunnelRateLimit } from "../lib/funnel-rate-limit.ts";
import { clearToolRateLimitsForTests } from "../lib/tool-rate-limit.ts";

process.env.ANALYTICS_HASH_SECRET = "test-only-funnel-rate-secret";

test("one session is capped even if its request IDs rotate", () => {
  clearToolRateLimitsForTests();
  const headers = new Headers({ "x-forwarded-for": "203.0.113.10" });
  for (let index = 0; index < 30; index += 1) {
    assert.equal(consumeFunnelRateLimit(headers, "same-session", 1_000).allowed, true);
  }
  const blocked = consumeFunnelRateLimit(headers, "same-session", 1_000);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.scope, "session");
});

test("rotating sessions cannot bypass the address-level cap", () => {
  clearToolRateLimitsForTests();
  const headers = new Headers({ "cf-connecting-ip": "203.0.113.11" });
  for (let index = 0; index < 120; index += 1) {
    assert.equal(
      consumeFunnelRateLimit(headers, `session-${index}`, 2_000).allowed,
      true,
    );
  }
  const blocked = consumeFunnelRateLimit(headers, "session-121", 2_000);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.scope, "address");
});
