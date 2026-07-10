import assert from "node:assert/strict";
import test from "node:test";

import { analyseCvGaps } from "../lib/cv-gap-detector.ts";

const completeCv = `
Amira Khan
amira@example.com | 07700 900123

PERSONAL PROFILE
Customer service team leader with experience improving complaint handling.

KEY SKILLS
- Salesforce
- Team coaching
- Complaint resolution

WORK EXPERIENCE
Customer Service Team Leader | Northstar Retail | January 2022 - Present
- Led eight advisers and coached four new starters.
- Reduced overdue complaints by 18% through a triage process.
- Reviewed service quality and escalated complex cases.

EDUCATION AND QUALIFICATIONS
Level 3 Diploma in Customer Service | City College | 2021
`;

test("finds the core sections and evidence in a complete CV", () => {
  const result = analyseCvGaps(completeCv);
  assert.equal(result.essentialsFound, result.essentialsTotal);
  assert.equal(result.checks.find((check) => check.id === "achievements")?.status, "present");
});

test("flags missing contact methods and sections", () => {
  const result = analyseCvGaps("Sam Taylor\nA short paragraph about looking for work.");
  assert.equal(result.checks.find((check) => check.id === "contact")?.status, "missing");
  assert.equal(result.checks.find((check) => check.id === "education")?.status, "missing");
});

test("warns about personal details UK guidance says to omit", () => {
  const result = analyseCvGaps(`${completeCv}\nDate of birth: 12 January 1990`);
  assert.equal(result.checks.find((check) => check.id === "sensitive")?.status, "caution");
});
