import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  createFeedbackUnsubscribeToken,
  verifyFeedbackUnsubscribeToken,
} from "../lib/feedback-token.ts";

const dbSource = readFileSync("lib/db.ts", "utf8");
const outreachSource = readFileSync("lib/feedback-outreach.ts", "utf8");
const emailSource = readFileSync("lib/email.ts", "utf8");
const internalRouteSource = readFileSync(
  "app/api/internal/feedback-outreach/route.ts",
  "utf8",
);
const unsubscribePageSource = readFileSync(
  "app/feedback/unsubscribe/page.tsx",
  "utf8",
);
const privacySource = readFileSync("app/privacy/page.tsx", "utf8");

test("feedback unsubscribe tokens are signed and tamper resistant", () => {
  const previous = process.env.FEEDBACK_UNSUBSCRIBE_SECRET;
  process.env.FEEDBACK_UNSUBSCRIBE_SECRET = "test-feedback-secret";
  try {
    const token = createFeedbackUnsubscribeToken("user_123456789");
    assert.deepEqual(verifyFeedbackUnsubscribeToken(token), {
      userId: "user_123456789",
    });
    assert.equal(
      verifyFeedbackUnsubscribeToken(`${token.slice(0, -1)}x`),
      null,
    );
    assert.doesNotMatch(
      Buffer.from(token.split(".")[0], "base64url").toString("utf8"),
      /@/,
    );
  } finally {
    if (previous === undefined) {
      delete process.env.FEEDBACK_UNSUBSCRIBE_SECRET;
    } else {
      process.env.FEEDBACK_UNSUBSCRIBE_SECRET = previous;
    }
  }
});

test("outreach is limited to engaged users and sent once", () => {
  assert.match(dbSource, /CREATE TABLE IF NOT EXISTS workcv_feedback_outreach/);
  assert.match(dbSource, /CREATE TABLE IF NOT EXISTS workcv_feedback_preferences/);
  assert.match(outreachSource, /u\.created_at < NOW\(\) - INTERVAL '12 hours'/);
  assert.match(outreachSource, /EXISTS \(\s*SELECT 1\s*FROM workcv_editor_events/);
  assert.match(outreachSource, /o\.user_id IS NULL/);
  assert.match(outreachSource, /o\.status = 'failed'/);
  assert.match(outreachSource, /FEEDBACK_EXCLUDED_EMAILS/);
  assert.match(outreachSource, /Math\.min\(50/);
});

test("research email is neutral and provides a permanent opt-out path", () => {
  assert.match(emailSource, /This is a one-time product-research email, not a marketing subscription/);
  assert.match(emailSource, /Opt out of future WorkCV research emails/);
  assert.match(emailSource, /Please do not include CV content, payment details, authentication codes/);
  assert.match(unsubscribePageSource, /method="post"/);
  assert.match(unsubscribePageSource, /Opt out of research emails/);
});

test("send job requires a timing-safe server secret", () => {
  assert.match(internalRouteSource, /FEEDBACK_OUTREACH_SECRET/);
  assert.match(internalRouteSource, /crypto\.timingSafeEqual/);
  assert.match(internalRouteSource, /dryRun: payload\.dryRun === true/);
});

test("privacy notice explains research purpose and suppression", () => {
  assert.match(privacySource, /Product research communications/);
  assert.match(privacySource, /legitimate interests/);
  assert.match(privacySource, /do not include tracking pixels/);
  assert.match(privacySource, /suppression record/);
});
