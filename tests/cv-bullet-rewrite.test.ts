import assert from "node:assert/strict";
import test from "node:test";

import { assessExistingBullet } from "../lib/cv-bullet-rules.ts";
import {
  assessRewriteQuality,
  CvBulletRewriteError,
  cvBulletRewriteInputSchema,
  normaliseFollowUpQuestion,
  rewriteCvBullet,
} from "../lib/cv-bullet-rewrite.ts";

const input = {
  jobTitle: "Retail Assistant",
  bullet: "Helped customers find books and answered their questions in the shop every day.",
  targetRole: "Customer Service Assistant",
  jobDescription: "",
  avoid: [] as string[],
};

const validOptions = [
  "Assisted customers in locating books and answered product questions throughout each shift in a busy independent shop",
  "Guided shoppers to suitable titles by answering daily questions about stock, authors and recommendations in store",
  "Supported a steady flow of in-store customers by finding books and resolving customer queries promptly and politely",
];

const question = "Roughly how many customers did you help on a typical day?";

test("flags weak bullets with plain-English reasons", () => {
  assert.deepEqual(assessExistingBullet(""), []);
  assert.deepEqual(assessExistingBullet("   "), []);
  assert.ok(assessExistingBullet("Helped with customer queries in the shop").includes("Opens with a weak phrase, not an action verb"));
  assert.ok(assessExistingBullet("Responsible for opening the till").includes("Opens with a weak phrase, not an action verb"));
  assert.ok(assessExistingBullet("Served customers").includes("Too short to show what you did"));
  assert.ok(assessExistingBullet("I am a hard-working team player").length >= 2);
  assert.ok(assessExistingBullet("Cleared the stockroom backlog and organised shelves for weekly deliveries").includes("No result or number"));
});

test("does not flag a strong bullet", () => {
  assert.deepEqual(
    assessExistingBullet("Reduced till queue times by 20% by introducing a second checkout at peak hours"),
    [],
  );
});

test("rewrite input needs a job title and a real bullet", () => {
  assert.throws(() => cvBulletRewriteInputSchema.parse({ ...input, jobTitle: "" }));
  assert.throws(() => cvBulletRewriteInputSchema.parse({ ...input, bullet: "Sold" }));
  assert.deepEqual(cvBulletRewriteInputSchema.parse({ jobTitle: "Chef", bullet: "Prepared meals for service" }).avoid, []);
});

test("rewrite quality rejects invented numbers, weak openings and repeats", () => {
  const parsed = cvBulletRewriteInputSchema.parse(input);
  assert.deepEqual(assessRewriteQuality(validOptions, parsed).issues, []);

  const invented = [...validOptions];
  invented[0] = "Assisted around 200 customers a day in locating books and answered product questions throughout each shift";
  assert.ok(assessRewriteQuality(invented, parsed).issues.includes("Do not introduce numbers that were not supplied."));

  const weak = [...validOptions];
  weak[1] = "Helped with finding suitable titles for shoppers by answering daily questions about stock and authors in store";
  assert.ok(assessRewriteQuality(weak, parsed).issues.some((issue) => issue.includes("action verb")));

  const repeated = [...validOptions];
  repeated[2] = validOptions[0];
  assert.ok(assessRewriteQuality(repeated, parsed).issues.includes("Every option must be distinct."));

  const withAvoid = cvBulletRewriteInputSchema.parse({ ...input, avoid: [validOptions[0]] });
  assert.ok(assessRewriteQuality(validOptions, withAvoid).issues.includes("Do not repeat the original bullet or an earlier suggestion."));
});

test("returns three vetted options and a follow-up question", async () => {
  const result = await rewriteCvBullet(input, async () => ({ options: validOptions, followUpQuestion: question }));
  assert.deepEqual(result.options, validOptions);
  assert.equal(result.followUpQuestion, question);
});

test("retries once with the quality issues, then succeeds", async () => {
  const corrections: Array<string | undefined> = [];
  let calls = 0;
  const result = await rewriteCvBullet(input, async (_input, correction) => {
    corrections.push(correction);
    calls += 1;
    if (calls === 1) {
      return { options: [validOptions[0], validOptions[1], "Assisted around 200 customers a day in locating books and answered product questions daily"], followUpQuestion: question };
    }
    return { options: validOptions, followUpQuestion: question };
  });
  assert.equal(calls, 2);
  assert.equal(corrections[0], undefined);
  assert.match(corrections[1] ?? "", /Do not introduce numbers/);
  assert.deepEqual(result.options, validOptions);
});

test("fails with a 422 after two unusable attempts", async () => {
  await assert.rejects(
    () => rewriteCvBullet(input, async () => ({ options: ["too short", "also short", "short again"], followUpQuestion: "no question mark" })),
    (error: unknown) => error instanceof CvBulletRewriteError && error.status === 422,
  );
});

test("accepts short rewrites of a short bullet", async () => {
  const short = [
    "Resolved customer queries and supported stock activities",
    "Assisted with customer queries and stock in the shop",
    "Responded to customer queries while supporting stock tasks",
  ];
  const result = await rewriteCvBullet(input, async () => ({ options: short, followUpQuestion: question }));
  assert.deepEqual(result.options, short);
});

test("repairs or drops a follow-up question without a question mark", async () => {
  assert.equal(normaliseFollowUpQuestion("How often did you restock shelves?"), "How often did you restock shelves?");
  assert.equal(normaliseFollowUpQuestion("How often did you restock shelves."), "How often did you restock shelves?");
  assert.equal(normaliseFollowUpQuestion("Add the number of customers served"), "");

  const result = await rewriteCvBullet(input, async () => ({ options: validOptions, followUpQuestion: "How many customers did you help each day" }));
  assert.equal(result.followUpQuestion, "How many customers did you help each day?");
});
