import assert from "node:assert/strict";
import test from "node:test";

import { generateJobApplicationPack, JobApplicationPackError, jobApplicationPackInputSchema } from "../lib/job-application-pack.ts";

const baseInput = {
  fullName: "Amira Khan",
  targetRole: "Customer Service Team Leader",
  jobDescription: "Lead the customer service team, coach colleagues and improve service quality. ".repeat(4),
  cvText: "Led customer service advisers, coached new starters, reviewed service reports and improved complaint handling through a clear triage process. ".repeat(5),
};

test("the application pack accepts omitted or blank optional motivation", () => {
  const omitted = jobApplicationPackInputSchema.safeParse(baseInput);
  assert.equal(omitted.success, true);
  if (omitted.success) assert.equal(omitted.data.motivation, "");

  const blank = jobApplicationPackInputSchema.safeParse({ ...baseInput, motivation: "   " });
  assert.equal(blank.success, true);
  if (blank.success) assert.equal(blank.data.motivation, "");
});

const cv = "Led eight advisers and coached four new starters. Used Salesforce daily to record cases and follow up customer issues. Reduced overdue complaints by 18% through a new triage process. Reviewed weekly service reports and organised team priorities. Supported colleagues with difficult conversations and handled phone, email and face-to-face queries. Trained colleagues and explained established processes clearly during busy periods. Completed a Level 3 customer service qualification.";
const input = jobApplicationPackInputSchema.parse({ ...baseInput, company: "Northstar Retail", cvText: cv, motivation: "I want to lead a larger service team and improve support for customers with complex cases." });

const paragraphs = [
  "I am applying for the Customer Service Team Leader role at Northstar Retail because it offers the opportunity to lead a larger service team and improve support for customers with complex cases. My current experience combines day-to-day customer service leadership with practical process improvement.",
  "In my present work, I have led eight advisers and coached four new starters. That experience is directly relevant to your need for someone who can guide colleagues, review service quality and help a team respond consistently when workloads or customer needs change.",
  "I also use Salesforce daily to manage customer information and escalated complaints. By introducing a clearer triage process, I reduced overdue complaints by 18%, demonstrating that I can examine a service problem, organise the response and deliver a measurable improvement without losing sight of the customer.",
  "The combination of team leadership, coaching, complaint resolution and hands-on Salesforce experience would allow me to contribute quickly at Northstar Retail. I would welcome the opportunity to discuss how my evidence fits the priorities of the Customer Service Team Leader role.",
];

function pack() {
  return {
    profile: "Customer service supervisor experienced in coaching advisers, reviewing service reports and organising customer complaint handling through a clear triage process.",
    bullets: [
      "Led eight advisers through daily customer service priorities and supported difficult customer conversations",
      "Coached four new starters on established customer service processes during busy periods",
      "Used Salesforce daily to record customer cases and follow up customer issues",
      "Reduced overdue complaints by 18% through introduction of a clearer triage process",
      "Reviewed weekly service reports and organised team priorities for customer complaint handling",
    ],
    requirements: ["Team leadership", "Customer complaints", "Service reporting"].map((requirement) => ({ requirement, status: "supported", cvEvidence: "Led eight advisers", action: "Review this evidence and place it under the role where it happened." })),
    coverLetterParagraphs: paragraphs,
    interviewQuestions: ["lead a team", "coach colleagues", "handle complaints", "use Salesforce", "review reports", "set priorities", "train starters", "communicate clearly"].map((topic) => ({ question: `How would you ${topic}?`, focus: `Your ability to ${topic}`, answerPrompt: "Describe a real situation, your action and an outcome you can evidence." })),
    thankYouEmail: "Thank you for discussing the Customer Service Team Leader position at Northstar Retail. I appreciated the opportunity to explain my customer service experience and would welcome any further questions.",
    evidence: [{ section: "profile", index: 0, sourceField: "cvText", sourceQuote: cv }, ...Array.from({ length: 5 }, (_, index) => ({ section: "bullet", index, sourceField: "cvText", sourceQuote: cv })), ...Array.from({ length: 4 }, (_, index) => ({ section: "letter", index, sourceField: "cvText", sourceQuote: cv }))],
  };
}

test("a supported pack returns deterministic letter formatting and evidence review", async () => {
  const result = await generateJobApplicationPack(input, async () => pack());
  assert.equal(result.bullets.length, 5);
  assert.match(result.coverLetter.letter, /^Dear Sir or Madam,/);
  assert.match(result.coverLetter.letter, /Yours faithfully,\nAmira Khan$/);
  assert.equal(result.requirements.length, 3);
});

test("a blank employer receives the neutral employer label", () => {
  assert.equal(jobApplicationPackInputSchema.parse({ ...baseInput, company: "  " }).company, "the employer");
});

test("advert-only metrics are rejected and repair is limited to one attempt", async () => {
  let calls = 0;
  await assert.rejects(generateJobApplicationPack({ ...input, jobDescription: input.jobDescription + " Target: 97% satisfaction." }, async () => {
    calls++;
    return { ...pack(), profile: pack().profile + " Achieved 97% satisfaction." };
  }), (error: unknown) => error instanceof JobApplicationPackError && error.status === 422);
  assert.equal(calls, 2);
});

test("a number elsewhere in the CV cannot support an unrelated section citation", async () => {
  await assert.rejects(generateJobApplicationPack(input, async () => {
    const draft = pack();
    draft.profile += " Delivered an 18% improvement.";
    draft.evidence[0].sourceQuote = "Led eight advisers and coached four new starters.";
    return draft;
  }), (error: unknown) => error instanceof JobApplicationPackError && error.status === 422);
});

test("fabricated source quotes are rejected", async () => {
  await assert.rejects(generateJobApplicationPack(input, async () => {
    const draft = pack(); draft.evidence[0].sourceQuote = "Awarded a degree in nuclear engineering"; return draft;
  }), (error: unknown) => error instanceof JobApplicationPackError && error.status === 422);
});

test("duplicate requirements trigger repair rather than a short result", async () => {
  let calls = 0;
  const result = await generateJobApplicationPack(input, async (_, correction) => {
    calls++; const draft = pack();
    if (calls === 1) draft.requirements = [draft.requirements[0], draft.requirements[0], draft.requirements[0]];
    else assert.match(correction || "", /distinct vacancy requirements/);
    return draft;
  });
  assert.equal(calls, 2); assert.equal(result.requirements.length, 3);
});

test("an unsupported requirement quote is downgraded", async () => {
  const result = await generateJobApplicationPack(input, async () => {
    const draft = pack(); draft.requirements[0].cvEvidence = "Managed a hospital"; return draft;
  });
  assert.equal(result.requirements[0].status, "not-evidenced");
  assert.equal(result.requirements[0].cvEvidence, null);
});

test("a hanging provider is aborted by the shared deadline", async () => {
  let signal: AbortSignal | undefined;
  await assert.rejects(generateJobApplicationPack(input, async (_, __, requestSignal) => { signal = requestSignal; return new Promise(() => {}); }, { timeoutMs: 20 }), (error: unknown) => error instanceof JobApplicationPackError && error.status === 504);
  assert.equal(signal?.aborted, true);
});
