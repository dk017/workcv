import assert from "node:assert/strict";
import test from "node:test";

import {
  assessCvFit,
  scoreCvFit,
  type CvFitInput,
} from "../lib/cv-fit-assessment.ts";

const input: CvFitInput = {
  jobDescription: `Customer Service Advisor
We need a Customer Service Advisor to handle customer queries by phone and email.
Essential requirements include complaint resolution experience, Salesforce CRM,
Microsoft Excel, clear communication and the ability to achieve service KPIs.
The successful candidate will monitor open cases and work with internal teams.`,
  cvText: `JORDAN TAYLOR
jordan.taylor@example.co.uk | 07123 456 789 | Leeds

CUSTOMER SERVICE ADVISOR

Profile
Customer service professional with three years of experience supporting customers.

Key skills
Customer service, complaint resolution, Salesforce CRM, Microsoft Excel, communication

Experience
Customer Service Assistant, North Retail, 2023–Present
- Manage 45 customer queries per day by phone and email.
- Resolved delivery complaints and achieved a 95% response target.
- Updated Salesforce CRM records and monitored open cases in Microsoft Excel.

Education
Five GCSEs including English and Maths.`,
};

const validAiOutput = {
  targetRole: "Customer Service Advisor",
  communicatedRole: "Customer Service Advisor",
  seniority: "mid-level",
  roleClarity: "clear",
  evidenceQuality: "strong",
  requirements: [
    {
      requirement: "Handle customer queries by phone and email",
      status: "supported",
      cvEvidence: "Manage 45 customer queries per day by phone and email.",
      explanation: "The CV gives direct evidence and scale for this responsibility.",
    },
    {
      requirement: "Use Salesforce CRM and Microsoft Excel",
      status: "supported",
      cvEvidence:
        "Updated Salesforce CRM records and monitored open cases in Microsoft Excel.",
      explanation: "Both named tools are evidenced in recent experience.",
    },
    {
      requirement: "Complaint resolution",
      status: "supported",
      cvEvidence: "Resolved delivery complaints and achieved a 95% response target.",
      explanation: "The CV links complaint handling to a measurable result.",
    },
  ],
  vaguePhrases: [],
  priorities: [
    {
      category: "vacancy-relevance",
      title: "Name the target role in the profile",
      action:
        "Connect the existing customer service evidence directly to the advertised advisor role.",
    },
    {
      category: "evidence",
      title: "Add the outcome of case monitoring",
      action:
        "Where truthful, explain what improved because open cases were monitored.",
    },
    {
      category: "completeness",
      title: "Clarify training",
      action:
        "Add relevant completed customer service training only if it can be verified.",
    },
  ],
} as const;

test("calculates the final score from fixed dimensions", async () => {
  const result = await assessCvFit(input, async () => validAiOutput);

  assert.equal(
    result.score,
    result.dimensions.reduce((total, dimension) => total + dimension.score, 0),
  );
  assert.equal(result.dimensions.reduce((total, item) => total + item.maximum, 0), 100);
  assert.equal(result.targetRole, "Customer Service Advisor");
  assert.ok(result.score >= 75);
  assert.equal(result.band, "Strong");
});

test("rejects model evidence that is not an exact CV snippet", () => {
  const result = scoreCvFit(input, {
    ...validAiOutput,
    requirements: [
      {
        ...validAiOutput.requirements[0],
        cvEvidence: "Supervised a team of 12 service advisors.",
      },
      validAiOutput.requirements[1],
      validAiOutput.requirements[2],
    ],
  });

  assert.equal(result.requirements[0].status, "not-evidenced");
  assert.equal(result.requirements[0].cvEvidence, null);
});

test("removes vague-phrase findings that are not quoted from the CV", () => {
  const result = scoreCvFit(input, {
    ...validAiOutput,
    vaguePhrases: [
      {
        phrase: "world-class communicator",
        reason: "This claim needs a specific example.",
      },
      {
        phrase: "Customer service professional",
        reason: "This broad label should be supported by the strongest evidence.",
      },
    ],
  });

  assert.deepEqual(result.vaguePhrases.map((item) => item.phrase), [
    "Customer service professional",
  ]);
});

test("does not award completeness points for missing contact details", () => {
  const result = scoreCvFit(
    { ...input, cvText: input.cvText.replace(/jordan[^|]+\|\s*07123 456 789\s*\|/i, "") },
    validAiOutput,
  );
  const completeness = result.dimensions.find((item) => item.id === "completeness");

  assert.equal(result.checks.hasEmail, false);
  assert.equal(result.checks.hasPhone, false);
  assert.equal(completeness?.score, 6);
});
