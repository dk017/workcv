import assert from "node:assert/strict";
import test from "node:test";
import { assessCvSummaryQuality, CvSummaryError, generateCvSummaries } from "../lib/cv-summary-generator.ts";

const input = { background: "Customer service team leader with experience managing retail support teams across phone and email channels.", targetRole: "Customer Experience Manager", evidence: "Led eight advisers, coached four starters, used Salesforce and reduced overdue complaints by 18% through a triage process.", jobDescription: "Lead service teams, improve customer experience and use performance data to resolve recurring issues.", careerStage: "experienced" as const };
const variants = [
  { label: "Balanced", summary: "Customer service team leader experienced in managing retail support across phone and email channels. Led eight advisers, coached four starters and used Salesforce to coordinate service delivery. Reduced overdue complaints by 18% through a structured triage process. Now targeting a Customer Experience Manager role focused on team leadership and service improvement." },
  { label: "Achievement-led", summary: "Reduced overdue complaints by 18% by introducing a structured triage process within a retail support operation. Customer service team leader with experience leading eight advisers, coaching four starters and using Salesforce across phone and email channels. Seeking a Customer Experience Manager role requiring practical service improvement and team leadership." },
  { label: "Concise", summary: "Customer service team leader with experience leading eight advisers across phone and email support. Coached four starters and reduced overdue complaints by 18% through structured triage and Salesforce-supported workflows. Ready to bring evidence-led team leadership and service improvement to a Customer Experience Manager role." },
] as const;
const questions = ["What service measure improved after coaching the new starters?", "How frequently did you review team performance data?"];

test("accepts three distinct evidence-safe summary variants", () => {
  const quality = assessCvSummaryQuality([...variants], input);
  assert.deepEqual(quality.issues, []);
  assert.equal(quality.wordCounts.length, 3);
});

test("rejects invented numbers and first-person clichés", () => {
  const poor = variants.map((variant) => ({ ...variant, summary: `I am a passionate professional with 12 years of experience. ${variant.summary}` }));
  const quality = assessCvSummaryQuality(poor, input);
  assert.ok(quality.issues.some((issue) => issue.includes("implied first person")));
  assert.ok(quality.issues.includes("Do not introduce numbers that were not supplied."));
});

test("does not treat vacancy numbers as candidate evidence", () => {
  const quality = assessCvSummaryQuality(
    [
      {
        label: "Balanced",
        summary:
          "Customer service team leader experienced in managing retail support across phone and email channels. Led eight advisers and used Salesforce to coordinate service delivery. Ready to meet a vacancy requiring 5 years of leadership experience. Now targeting a Customer Experience Manager role focused on service improvement.",
      },
      variants[1],
      variants[2],
    ],
    {
      ...input,
      jobDescription: "Customer Experience Manager role requiring 5 years of leadership experience.",
    },
  );
  assert.ok(quality.issues.includes("Do not introduce numbers that were not supplied."));
});

test("retries once and returns word counts", async () => {
  let calls = 0;
  const result = await generateCvSummaries(input, async (_input, correction) => {
    calls += 1;
    if (calls === 1) return { variants: variants.map((variant) => ({ ...variant, summary: "Too short." })), followUpQuestions: questions };
    assert.match(correction || "", /required schema/);
    return { variants, followUpQuestions: questions };
  });
  assert.equal(calls, 2);
  assert.equal(result.variants.length, 3);
  assert.ok(result.variants.every((variant) => variant.wordCount >= 40));
});

test("fails safely after two unreliable outputs", async () => {
  await assert.rejects(generateCvSummaries(input, async () => ({ variants: variants.map((variant) => ({ ...variant, summary: "Too short." })), followUpQuestions: questions })), (error: unknown) => error instanceof CvSummaryError && error.status === 422);
});
