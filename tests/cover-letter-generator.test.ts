import assert from "node:assert/strict";
import test from "node:test";

import {
  assessCoverLetterQuality,
  generateCoverLetter,
  type CoverLetterInput,
} from "../lib/cover-letter-generator.ts";

const input: CoverLetterInput = {
  fullName: "Amira Khan",
  targetRole: "Customer Service Team Leader",
  company: "Northstar Retail",
  hiringManager: "Ms Patel",
  jobDescription:
    "Lead a customer service team, coach colleagues, review service quality and use Salesforce to resolve escalated complaints while meeting response targets.",
  evidence:
    "Led eight advisers, coached four new starters, used Salesforce daily and reduced overdue complaints by 18% through a new triage process.",
  motivation:
    "I want to lead a larger service team and improve how customers with complex cases are supported.",
  tone: "professional",
  length: "concise",
};

const paragraphs = [
  "I am applying for the Customer Service Team Leader role at Northstar Retail because it offers the opportunity to lead a larger service team and improve support for customers with complex cases. My current experience combines day-to-day customer service leadership with practical process improvement.",
  "In my present work, I have led eight advisers and coached four new starters. That experience is directly relevant to your need for someone who can guide colleagues, review service quality and help a team respond consistently when workloads or customer needs change.",
  "I also use Salesforce daily to manage customer information and escalated complaints. By introducing a clearer triage process, I reduced overdue complaints by 18%, demonstrating that I can examine a service problem, organise the response and deliver a measurable improvement without losing sight of the customer.",
  "The combination of team leadership, coaching, complaint resolution and hands-on Salesforce experience would allow me to contribute quickly at Northstar Retail. I would welcome the opportunity to discuss how my evidence fits the priorities of the Customer Service Team Leader role.",
];

test("assesses a tailored cover letter against supplied facts", () => {
  const result = assessCoverLetterQuality(paragraphs, input);
  assert.equal(result.issues.length, 0);
  assert.ok(result.wordCount >= 160);
});

test("flags invented numeric evidence", () => {
  const result = assessCoverLetterQuality(
    paragraphs.map((paragraph, index) =>
      index === 2 ? `${paragraph} This saved £50,000.` : paragraph,
    ),
    input,
  );
  assert.match(result.issues.join(" "), /numbers that were not supplied/i);
});

test("formats the greeting and sign-off deterministically", async () => {
  const result = await generateCoverLetter(input, async () => ({ paragraphs }));
  assert.match(result.letter, /^Dear Ms Patel,/);
  assert.match(result.letter, /Yours sincerely,\nAmira Khan$/);
});
