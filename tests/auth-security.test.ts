import assert from "node:assert/strict";
import test from "node:test";

import { AUTH_LIMITS, exceedsAuthLimit } from "../lib/auth-policy.ts";
import { safeInternalRedirect } from "../lib/safe-redirect.ts";

test("verification brute-force limits block email and IP thresholds", () => {
  assert.equal(
    exceedsAuthLimit(
      "verify",
      AUTH_LIMITS.failedVerificationsPerEmailPer15Minutes - 1,
      0,
    ),
    false,
  );
  assert.equal(
    exceedsAuthLimit(
      "verify",
      AUTH_LIMITS.failedVerificationsPerEmailPer15Minutes,
      0,
    ),
    true,
  );
  assert.equal(
    exceedsAuthLimit(
      "verify",
      0,
      AUTH_LIMITS.failedVerificationsPerIpPer15Minutes,
    ),
    true,
  );
});

test("code request limits apply independently to email and IP", () => {
  assert.equal(
    exceedsAuthLimit(
      "request",
      AUTH_LIMITS.codeRequestsPerEmailPerHour,
      0,
    ),
    true,
  );
  assert.equal(
    exceedsAuthLimit("request", 0, AUTH_LIMITS.codeRequestsPerIpPerHour),
    true,
  );
});

test("redirect sanitisation preserves legitimate editor parameters", () => {
  assert.equal(
    safeInternalRedirect("/editor?draftId=cv_123&payment=success"),
    "/editor?draftId=cv_123&payment=success",
  );
});

test("redirect sanitisation rejects external and parser-confusion payloads", () => {
  const payloads = [
    "https://evil.example",
    "//evil.example/path",
    "/\\evil.example",
    "/%5cevil.example",
    "/%2f%2fevil.example",
    "/%252f%252fevil.example",
    "/editor\nLocation:https://evil.example",
    "javascript:alert(1)",
  ];

  payloads.forEach((payload) => {
    assert.equal(safeInternalRedirect(payload), "/editor", payload);
  });
});
