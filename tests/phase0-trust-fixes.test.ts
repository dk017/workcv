import assert from "node:assert/strict";
import test from "node:test";

import { analyseAtsKeywords } from "../lib/ats-keyword-checker.ts";
import { scoreCvFit } from "../lib/cv-fit-assessment.ts";
import { seniorityLabel, stripWrappingQuotes } from "../lib/cv-fit-labels.ts";
import { calculateCvReadiness } from "../lib/cv-readiness.ts";
import { createBlankCv } from "../lib/editor-data.ts";
import { formatKeyword } from "../lib/keyword-format.ts";
import { addSkillLine } from "../lib/keyword-triage.ts";

// The advert and CV used when these defects were found (2026-10-04).
const advert = `Customer Service Advisor - Bradford

We are looking for a Customer Service Advisor to join our busy contact team. You will answer customer calls and emails, resolve complaints, and keep accurate records in our CRM.

Essential:
- Previous customer service experience, including complaint handling
- Experience using a CRM system such as Salesforce or Zendesk
- Good Microsoft Excel skills
- Excellent written communication
- A full UK driving licence is desirable
- Ability to meet performance targets and KPIs

You will log cases, follow up with customers, and work with the sales team to resolve issues quickly.`;

const cv = `SAM PATEL
sam.patel@example.test  07700 900123  Bradford

Profile
Hard working and passionate person looking for a new challenge.

Work experience
Sales Assistant - Corner Store - 2021 to now
- Dealt with customer complaints

Skills
Customer service, teamwork, cash handling, Microsoft Word`;

const byTerm = (analysis: ReturnType<typeof analyseAtsKeywords>, term: string) =>
  [...analysis.found, ...analysis.missing].find((keyword) => keyword.term.toLowerCase() === term);

test("keywords are shown and saved with proper casing, not just a capital first letter", () => {
  assert.equal(formatKeyword("crm"), "CRM");
  assert.equal(formatKeyword("sql"), "SQL");
  assert.equal(formatKeyword("seo"), "SEO");
  assert.equal(formatKeyword("nhs"), "NHS");
  assert.equal(formatKeyword("javascript"), "JavaScript");
  assert.equal(formatKeyword("typescript"), "TypeScript");
  assert.equal(formatKeyword("power bi"), "Power BI");
  assert.equal(formatKeyword("hr advisor"), "HR advisor");
  assert.equal(formatKeyword("excel"), "Excel");
  assert.equal(formatKeyword("customer service"), "Customer service");
  assert.equal(formatKeyword("key performance indicators"), "Key performance indicators");
  // Already-cased terms are left alone.
  assert.equal(formatKeyword("NVQ"), "NVQ");
  assert.equal(formatKeyword("PRINCE2"), "PRINCE2");
  assert.equal(formatKeyword("DBS check"), "DBS check");
  assert.equal(addSkillLine("Teamwork", "crm"), "Teamwork\nCRM");
  assert.equal(addSkillLine("Teamwork\nSQL", "sql"), "Teamwork\nSQL");
});

test("every dictionary skill term formats without breaking acronyms", () => {
  const sample = analyseAtsKeywords(
    "Experience with CRM, SQL, SEO, NHS, JavaScript, TypeScript, Power BI, Salesforce, Excel and Python required.",
    "",
  );
  const shown = [...sample.found, ...sample.missing].map((keyword) => formatKeyword(keyword.term));
  for (const expected of ["CRM", "SQL", "SEO", "NHS", "JavaScript", "TypeScript", "Power BI", "Salesforce", "Excel", "Python"]) {
    assert.ok(shown.includes(expected), `${expected} should appear in ${shown.join(", ")}`);
  }
  for (const wrong of ["Crm", "Sql", "Seo", "Nhs", "Javascript", "Typescript"]) {
    assert.ok(!shown.includes(wrong), `${wrong} must not appear`);
  }
});

test("an optional requirement is not labelled Essential, even if it mentions a licence", () => {
  const analysis = analyseAtsKeywords(advert, cv);
  assert.equal(byTerm(analysis, "driving licence")?.importance, "Relevant");
});

test("an Essential: heading applies to the bullets under it", () => {
  const analysis = analyseAtsKeywords(advert, cv);
  assert.equal(byTerm(analysis, "crm")?.importance, "Essential");
  assert.equal(byTerm(analysis, "salesforce")?.importance, "Essential");
  assert.equal(byTerm(analysis, "excel")?.importance, "Essential");
});

test("a Desirable: heading and 'is a plus' wording make requirements optional", () => {
  const analysis = analyseAtsKeywords(
    `Care Assistant

Essential:
- NVQ level 2 in health and social care
- Experience in a care setting

Desirable:
- Experience using Salesforce
- A full driving licence

Experience with Excel is a plus.`,
    "",
  );
  assert.equal(byTerm(analysis, "nvq")?.importance, "Essential");
  assert.equal(byTerm(analysis, "salesforce")?.importance, "Relevant");
  assert.equal(byTerm(analysis, "driving licence")?.importance, "Relevant");
  assert.equal(byTerm(analysis, "excel")?.importance, "Relevant");
});

test("a list ends at a blank line followed by ordinary text", () => {
  const analysis = analyseAtsKeywords(
    `Essential:
- Experience using Salesforce

You will also use Excel in your daily work and work with the sales team.`,
    "",
  );
  assert.equal(byTerm(analysis, "salesforce")?.importance, "Essential");
  assert.notEqual(byTerm(analysis, "excel")?.importance, "Essential");
});

test("the 'driving' in 'driving licence' is not the action verb drive", () => {
  const analysis = analyseAtsKeywords("A full UK driving licence is required for this role.", "Hold a full driving licence.");
  assert.equal(byTerm(analysis, "drive"), undefined);
  assert.equal(byTerm(analysis, "driving licence")?.found, true);
  // The verb still counts when it is used as a verb.
  const verb = analyseAtsKeywords("You will drive improvements across the team.", "Drove improvements across the team.");
  assert.equal(byTerm(verb, "drive")?.found, true);
});

test("'support worker' does not also count as the verb support", () => {
  const analysis = analyseAtsKeywords("We are hiring a support worker. Experience as a support worker is required.", "");
  assert.equal(byTerm(analysis, "support"), undefined);
  assert.ok(byTerm(analysis, "support worker"));
});

test("verb-plus-noun variants still count as the verb", () => {
  const analysis = analyseAtsKeywords(
    "You will manage customer complaints and resolve queries.",
    "Managed complaints and resolved queries every day.",
  );
  assert.equal(byTerm(analysis, "manage")?.found, true);
  assert.equal(byTerm(analysis, "resolve")?.found, true);
});

test("fit assessment text: no doubled level, no nested quote marks", () => {
  assert.equal(seniorityLabel("mid-level"), "mid-level");
  assert.equal(seniorityLabel("entry"), "entry level");
  assert.equal(seniorityLabel("senior"), "senior level");
  assert.equal(seniorityLabel("unclear"), "an unclear level");
  assert.equal(stripWrappingQuotes('"three years of experience"'), "three years of experience");
  assert.equal(stripWrappingQuotes("“Dealt with customer complaints”"), "Dealt with customer complaints");
  assert.equal(stripWrappingQuotes("no quotes here"), "no quotes here");

  const fitCv = "Sam Patel\nsam@example.test 07700 900123\nProfile\nWorker.\nExperience\n- Dealt with customer complaints and handled cash\nSkills\nTeamwork\nEducation\nGCSEs ".repeat(3);
  const result = scoreCvFit(
    { jobDescription: advert.repeat(1) + " ".repeat(10), cvText: fitCv },
    {
      targetRole: "Customer Service Advisor",
      communicatedRole: "Sales Assistant",
      seniority: "mid-level",
      roleClarity: "partly-clear",
      evidenceQuality: "mixed",
      requirements: [
        { requirement: "Complaint handling", status: "supported", cvEvidence: '"Dealt with customer complaints and handled cash"', explanation: "States complaint handling." },
        { requirement: "CRM", status: "not-evidenced", cvEvidence: null, explanation: "No CRM mentioned." },
        { requirement: "Excel", status: "not-evidenced", cvEvidence: null, explanation: "No Excel mentioned." },
      ],
      vaguePhrases: [{ phrase: '"Dealt with customer complaints"', reason: "Does not say how many or what the outcome was." }],
      priorities: [
        { category: "evidence", title: "Show CRM use", action: "Add the CRM systems you have used, if any." },
        { category: "evidence", title: "Show Excel use", action: "Add a real example of using Excel, if any." },
        { category: "role-clarity", title: "Clarify role", action: "Make the current role title obvious." },
      ],
    },
  );
  assert.equal(result.requirements[0].cvEvidence, "Dealt with customer complaints and handled cash");
  assert.equal(result.requirements[0].status, "supported", "stripping quotes must not break verbatim verification");
  assert.equal(result.vaguePhrases[0]?.phrase, "Dealt with customer complaints");
  const roleClarity = result.dimensions.find((dimension) => dimension.id === "role-clarity");
  assert.ok(roleClarity?.explanation.includes("at mid-level."));
  assert.ok(!/level level/.test(roleClarity?.explanation ?? ""));
});

test("editor flags mixed date formats, and only when both formats are present", () => {
  const mixed = createBlankCv();
  mixed.experience[0] = { ...mixed.experience[0], role: "Operative", company: "FastParcel", start: "March 2019", end: "12/2020", bullets: "Packed orders" };
  const flagged = calculateCvReadiness(mixed).issues.find((issue) => issue.id === "dates-format");
  assert.ok(flagged);
  assert.equal(flagged.severity, "improve");
  assert.equal(flagged.section, "experience");
  assert.match(flagged.message, /March 2019 and 12\/2020/);

  const consistent = createBlankCv();
  consistent.experience[0] = { ...consistent.experience[0], role: "Operative", company: "FastParcel", start: "Mar 2019", end: "Dec 2020", bullets: "Packed orders" };
  assert.equal(calculateCvReadiness(consistent).issues.some((issue) => issue.id === "dates-format"), false);

  const yearsOnly = createBlankCv();
  yearsOnly.experience[0] = { ...yearsOnly.experience[0], role: "Operative", company: "FastParcel", start: "2019", end: "Present", bullets: "Packed orders" };
  assert.equal(calculateCvReadiness(yearsOnly).issues.some((issue) => issue.id === "dates-format"), false);
});

test("a keyword at the end of a sentence or bullet is still found", () => {
  const job = "Experience using Salesforce and Excel is essential. Customer service experience is required.";
  for (const text of [
    "Updated records in Salesforce.",
    "Built reports in Excel.",
    "Strong customer service.",
    "- Dealt with customer service, Salesforce, Excel.",
    "Used Salesforce... and Excel!",
  ]) {
    const found = analyseAtsKeywords(job, text).found.map((keyword) => keyword.term);
    const expected = ["salesforce", "excel", "customer service"].filter((term) => text.toLowerCase().includes(term));
    for (const term of expected) assert.ok(found.includes(term), `"${term}" should be found in ${JSON.stringify(text)}; found ${found.join(", ") || "nothing"}`);
  }
});
