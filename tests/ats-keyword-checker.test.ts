import assert from "node:assert/strict";
import test from "node:test";

import { analyseAtsKeywords } from "../lib/ats-keyword-checker.ts";

const jobDescription = `
Customer Service Advisor
We require proven customer service and complaint resolution experience with strong communication skills.
The successful candidate must have experience using Salesforce CRM and Microsoft Excel.
You will manage customer complaints, resolve queries and achieve key performance indicators.
`;

test("extracts and matches the requested keyword categories", () => {
  const result = analyseAtsKeywords(
    jobDescription,
    `
Customer Service Advisor with three years of customer service experience.
Managed complaints, resolved queries and achieved monthly targets.
Used Salesforce CRM and Excel every day and communicated with internal teams.
`,
  );

  assert.ok(result.score >= 70);
  assert.equal(result.verdict, "Strong coverage");
  assert.ok(result.found.some((keyword) => keyword.term === "customer service advisor"));
  assert.ok(result.found.some((keyword) => keyword.term === "salesforce"));
  assert.ok(result.found.some((keyword) => keyword.term === "manage"));
  assert.ok(result.found.some((keyword) => keyword.term === "complaint handling"));
});

test("matches common action-verb inflections", () => {
  const result = analyseAtsKeywords(
    "The role requires someone to manage projects, lead teams and improve reporting.",
    "Managed projects, led a team and improved monthly reporting for senior managers.",
  );

  assert.ok(result.found.some((keyword) => keyword.term === "manage"));
  assert.ok(result.found.some((keyword) => keyword.term === "lead"));
  assert.ok(result.found.some((keyword) => keyword.term === "improve"));
});

test("weights missing essential requirements and returns a low score", () => {
  const result = analyseAtsKeywords(
    "A PRINCE2 qualification is essential. Must have project management, risk management and stakeholder management experience.",
    "Retail assistant experienced in customer service, cash handling and stock control.",
  );

  assert.equal(result.verdict, "Low coverage");
  assert.ok(result.missing.some((keyword) => keyword.term === "PRINCE2"));
  assert.ok(result.essentialTotal >= 4);
});

test("does not return a false score when no recognised terms are present", () => {
  const result = analyseAtsKeywords(
    "Bring curiosity and care to an unusual role in our friendly organisation.",
    "A short unrelated profile.",
  );

  assert.equal(result.score, 0);
  assert.equal(result.totalKeywords, 0);
});

test("treats acronym and full-form variants as one requirement", () => {
  const result = analyseAtsKeywords(
    "You must achieve key performance indicators (KPIs) and report results.",
    "Achieved every KPI and reported monthly results.",
  );

  const performanceTerms = result.found.filter(
    (keyword) => keyword.term === "key performance indicators",
  );
  assert.equal(performanceTerms.length, 1);
});
