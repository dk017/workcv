import assert from "node:assert/strict";
import test from "node:test";

import {
  assessStatementQuality,
  generatePersonalStatement,
  PersonalStatementError,
  personalStatementInputSchema,
} from "../lib/personal-statement-generator.ts";
import {
  clearToolRateLimitsForTests,
  consumeToolRateLimit,
} from "../lib/tool-rate-limit.ts";

const input = {
  background:
    "Customer service adviser with three years of experience supporting retail customers by phone and email.",
  targetRole: "Senior Customer Service Adviser",
  highlights:
    "Salesforce CRM, complaint resolution, trained four starters and resolves 40–50 enquiries each day.",
};

const validStatement =
  "Customer service adviser with three years of experience supporting retail customers across phone and email channels. Skilled in Salesforce CRM, complaint resolution and accurate handling of 40–50 daily enquiries. Experience training four new starters demonstrates the ability to share practical knowledge and maintain service standards. Ready to bring reliable customer support and team guidance to a Senior Customer Service Adviser role.";

test("validates and trims generator inputs", () => {
  const parsed = personalStatementInputSchema.parse({
    ...input,
    targetRole: `  ${input.targetRole}  `,
  });
  assert.equal(parsed.targetRole, input.targetRole);
});

test("accepts a specific 3–4 sentence statement within the word range", () => {
  const quality = assessStatementQuality(validStatement, input);
  assert.equal(quality.sentenceCount, 4);
  assert.equal(quality.issues.length, 0);
});

test("flags pronouns, clichés and invented numbers", () => {
  const quality = assessStatementQuality(
    "I am a passionate professional with 12 years of experience. I work well independently and as part of a team. My dynamic approach suits the role.",
    input,
  );
  assert.ok(quality.issues.includes("Use 50 to 100 words."));
  assert.ok(
    quality.issues.includes(
      "Use an implied first-person voice without personal pronouns.",
    ),
  );
  assert.ok(quality.issues.includes("Remove generic CV clichés."));
  assert.ok(
    quality.issues.includes("Do not introduce numbers that were not supplied."),
  );
});

test("rejects third-person candidate phrasing", () => {
  const quality = assessStatementQuality(
    "Customer service adviser with three years of retail experience. They use Salesforce CRM to manage enquiries and resolve complaints. Their experience training four starters supports consistent team standards. They are now targeting a Senior Customer Service Adviser role where reliable support and practical guidance add value.",
    input,
  );
  assert.ok(
    quality.issues.includes(
      "Use an implied first-person voice without personal pronouns.",
    ),
  );
});

test("retries once when the first generated statement fails quality checks", async () => {
  let calls = 0;
  const result = await generatePersonalStatement(input, async (_details, correction) => {
    calls += 1;
    if (calls === 1) {
      assert.equal(correction, undefined);
      return {
        statement:
          "I am a passionate customer service professional. I am seeking a new role. I work well independently and as part of a team.",
      };
    }
    assert.match(correction || "", /50 to 100 words/);
    return { statement: validStatement };
  });

  assert.equal(calls, 2);
  assert.equal(result.statement, validStatement);
  assert.equal(result.sentenceCount, 4);
});

test("fails safely after two unreliable generated outputs", async () => {
  await assert.rejects(
    generatePersonalStatement(input, async () => ({
      statement:
        "I am a passionate customer service professional. I am seeking a new role. I work well independently and as part of a team.",
    })),
    (error: unknown) =>
      error instanceof PersonalStatementError && error.status === 422,
  );
});

test("rate limiter allows the configured number of requests then blocks", () => {
  clearToolRateLimitsForTests();
  const options = { limit: 2, windowMs: 1_000, now: 10_000 };

  assert.equal(consumeToolRateLimit("visitor", options).allowed, true);
  assert.equal(consumeToolRateLimit("visitor", options).allowed, true);
  const blocked = consumeToolRateLimit("visitor", options);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.remaining, 0);
  assert.equal(blocked.retryAfterSeconds, 1);

  assert.equal(
    consumeToolRateLimit("visitor", { ...options, now: 11_001 }).allowed,
    true,
  );
});
