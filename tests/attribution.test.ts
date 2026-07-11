import assert from "node:assert/strict";
import test from "node:test";

import { sanitizeSignupAttribution } from "../lib/attribution.ts";

test("keeps supported first-touch attribution", () => {
  assert.deepEqual(
    sanitizeSignupAttribution({
      landingPath: "/cv-builder-no-subscription-uk",
      referrer: "https://www.google.com/",
      utmSource: "google",
      utmMedium: "organic",
      ignored: "value",
    }),
    {
      landingPath: "/cv-builder-no-subscription-uk",
      referrer: "https://www.google.com/",
      utmSource: "google",
      utmMedium: "organic",
    },
  );
});

test("rejects unsafe paths and referrers and limits field lengths", () => {
  assert.deepEqual(
    sanitizeSignupAttribution({
      landingPath: "https://example.com/phishing",
      referrer: "javascript:alert(1)",
      utmCampaign: `summer\u0000${"x".repeat(300)}`,
    }),
    { utmCampaign: `summer${"x".repeat(194)}` },
  );
});
