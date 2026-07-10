import assert from "node:assert/strict";
import test from "node:test";

import {
  assessBulletPointQuality,
  CvBulletPointError,
  cvBulletPointInputSchema,
  generateCvBulletPoints,
} from "../lib/cv-bullet-point-generator.ts";

const input = {
  jobTitle: "Customer Service Team Leader",
  employmentStatus: "previous" as const,
  rawExperience:
    "Led eight advisers, coached four new starters, used Salesforce daily, introduced complaint triage and reduced overdue complaints by 18%. Reviewed service quality and handled escalated customer cases.",
  targetRole: "Customer Experience Manager",
  jobDescription:
    "Lead service teams, coach colleagues, resolve escalated complaints and improve customer experience using service data.",
};

const validBullets = [
  "Led eight customer service advisers, coordinating daily workloads and maintaining clear ownership of escalated customer cases",
  "Coached four new starters on complaint handling and Salesforce workflows, supporting consistent service across the team",
  "Introduced a complaint triage process that reduced overdue cases by 18% and clarified escalation priorities",
  "Reviewed service quality data to identify recurring issues and guide practical improvements to customer support",
  "Resolved complex customer complaints through structured investigation, clear communication and appropriate escalation to senior colleagues",
];

const questions = [
  "How often did you review service quality data?",
  "What customer outcome improved after your coaching?",
  "How many escalated cases did you typically handle?",
];

test("validates and trims bullet generator inputs", () => {
  const parsed = cvBulletPointInputSchema.parse({
    ...input,
    jobTitle: `  ${input.jobTitle}  `,
  });
  assert.equal(parsed.jobTitle, input.jobTitle);
});

test("accepts five concise, distinct and evidence-led bullets", () => {
  const quality = assessBulletPointQuality(validBullets, input);
  assert.deepEqual(quality.issues, []);
  assert.equal(quality.bullets.length, 5);
  assert.ok(quality.outcomeCount >= 2);
});

test("removes list markers and ending punctuation", () => {
  const marked = validBullets.map((bullet, index) => `- ${bullet}${index ? "." : ";"}`);
  const quality = assessBulletPointQuality(marked, input);
  assert.deepEqual(quality.issues, []);
  assert.equal(quality.bullets[0], validBullets[0]);
  assert.equal(quality.bullets[1], validBullets[1]);
});

test("flags pronouns, weak openings, repeated verbs and invented numbers", () => {
  const poorBullets = [
    "Responsible for a team of eight advisers and I handled customer complaints across every available service channel",
    "Led daily service operations and achieved a 25% improvement in customer satisfaction across the department",
    "Led daily service operations while working as a passionate team player within the wider customer function",
    "Helped with escalated complaints and worked on a range of general customer service tasks every day",
    "Managed customer cases and shared regular updates with colleagues across the wider customer support operation",
  ];
  const quality = assessBulletPointQuality(poorBullets, input);
  assert.ok(quality.issues.some((issue) => issue.includes("implied first person")));
  assert.ok(quality.issues.some((issue) => issue.includes("specific action verb")));
  assert.ok(quality.issues.includes("Use a different opening action verb for every bullet point."));
  assert.ok(quality.issues.includes("Do not introduce numbers that were not supplied."));
});

test("retries once when generated bullets fail quality checks", async () => {
  let calls = 0;
  const result = await generateCvBulletPoints(input, async (_details, correction) => {
    calls += 1;
    if (calls === 1) {
      assert.equal(correction, undefined);
      return { bullets: validBullets.map(() => "Responsible for customer service"), followUpQuestions: questions };
    }
    assert.match(correction || "", /10 to 32 words/);
    return { bullets: validBullets, followUpQuestions: questions };
  });
  assert.equal(calls, 2);
  assert.deepEqual(result.bullets, validBullets);
});

test("fails safely after two unreliable outputs", async () => {
  await assert.rejects(
    generateCvBulletPoints(input, async () => ({
      bullets: validBullets.map(() => "Responsible for customer service"),
      followUpQuestions: questions,
    })),
    (error: unknown) => error instanceof CvBulletPointError && error.status === 422,
  );
});
