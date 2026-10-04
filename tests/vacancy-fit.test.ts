import assert from "node:assert/strict";
import test from "node:test";

import { analyseAtsKeywords } from "../lib/ats-keyword-checker.ts";
import type { CvFitHandoff } from "../lib/cv-fit-handoff.ts";
import { parseCvData } from "../lib/cv-schema.ts";
import { calculateCvReadiness } from "../lib/cv-readiness.ts";
import { createBlankCv, type CvData } from "../lib/editor-data.ts";
import { buildVacancyTriage, effectiveTargetRole, matchProgress, targetingFromFitHandoff, vaguePhraseItems } from "../lib/vacancy-fit.ts";

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

// What the checker returned for the weak CV, trimmed to the hand-off shape.
const checkedCvText = `Sam Patel
Profile
Hard working and passionate person looking for a new challenge. I am a team player with excellent communication skills and a good eye for detail.
Experience
Sales Assistant, Corner Store, 2021 to now
- Responsible for helping customers
- Dealt with customer complaints
Warehouse Operative, FastParcel, March 2019 to 12/2020
- Picked and packed orders
Skills
Customer service, teamwork, cash handling, time keeping, Microsoft Word`;

const handoff: CvFitHandoff = {
  version: 1,
  createdAt: Date.now(),
  cvText: checkedCvText,
  jobDescription: advert,
  targetRole: "Customer Service Advisor",
  source: "cv-fit-assessment",
  priorities: [
    { category: "evidence", title: "Show CRM experience", action: "Add any exact CRM systems used, if applicable." },
    { category: "evidence", title: "Evidence Excel use", action: "Include a factual example of using Excel if that experience exists." },
    { category: "evidence", title: "Strengthen written communication evidence", action: "Replace the general claim with an example." },
  ],
  requirements: [
    { requirement: "Previous customer service experience, including complaint handling", status: "supported", explanation: "Complaint handling is evidenced." },
    { requirement: "Experience using a CRM system such as Salesforce or Zendesk", status: "not-evidenced", explanation: "No CRM system is mentioned anywhere in the CV." },
    { requirement: "Good Microsoft Excel skills", status: "not-evidenced", explanation: "The skills section lists Microsoft Word, but not Excel." },
    { requirement: "Excellent written communication", status: "partly-supported", explanation: "The CV claims communication skills but not written communication." },
    { requirement: "Answer customer calls and emails, log cases and follow up with customers", status: "not-evidenced", explanation: "No calls, emails or case logging are mentioned." },
    { requirement: "Log cases and resolve issues quickly with the sales team", status: "not-evidenced", explanation: "No case logging is mentioned." },
  ],
  vaguePhrases: [
    { phrase: "Hard working and passionate person looking for a new challenge.", reason: "Generic; does not show relevant evidence." },
    { phrase: "Responsible for helping customers", reason: "Vague about what was actually done." },
    { phrase: "Something the user already removed", reason: "Not in the CV any more." },
  ],
};

function weakCv(): CvData {
  const cv = createBlankCv();
  cv.fullName = "Sam Patel";
  cv.email = "sam.patel@example.test";
  cv.profile = "Hard working and passionate person looking for a new challenge. I am a team player with excellent communication skills and a good eye for detail.";
  cv.skills = "Customer service\nTeamwork\nCash handling\nTime keeping\nMicrosoft Word";
  cv.experience = [
    { ...cv.experience[0], id: "role-a", role: "Sales Assistant", company: "Corner Store", start: "2021", end: "Present", bullets: "Responsible for helping customers\nDealt with customer complaints" },
    { ...cv.experience[0], id: "role-b", role: "Warehouse Operative", company: "FastParcel", start: "March 2019", end: "12/2020", bullets: "Picked and packed orders" },
  ];
  cv.targeting = targetingFromFitHandoff(handoff);
  return cv;
}

const evidence = (cv: CvData) => [cv.profile, cv.skills, ...cv.experience.flatMap((item) => [item.role, item.company, item.bullets])].join("\n");
const triage = (cv: CvData) => buildVacancyTriage(analyseAtsKeywords(cv.targeting!.jobDescription, evidence(cv)), cv.targeting!, evidence(cv));

test("hand-off keeps unmet requirements and vague phrases, and remembers the evidenced ones", () => {
  const targeting = targetingFromFitHandoff(handoff);
  assert.equal(targeting.role, "Customer Service Advisor");
  assert.deepEqual(targeting.requirements?.map((item) => item.status), ["not-evidenced", "not-evidenced", "partly-supported", "not-evidenced", "not-evidenced"]);
  assert.deepEqual(targeting.evidencedRequirements, ["Previous customer service experience, including complaint handling"]);
  assert.equal(targeting.vaguePhrases?.length, 3);
});

test("hand-off output is accepted by the strict save schema, even when the model is verbose", () => {
  const verbose: CvFitHandoff = {
    ...handoff,
    requirements: Array.from({ length: 12 }, (_, index) => ({ requirement: `Requirement ${index} ${"x".repeat(400)}`, status: "not-evidenced" as const, explanation: "y".repeat(600) })),
    vaguePhrases: Array.from({ length: 9 }, (_, index) => ({ phrase: `Phrase ${index} ${"z".repeat(400)}`, reason: "w".repeat(500) })),
  };
  const cv = createBlankCv();
  cv.targeting = targetingFromFitHandoff(verbose);
  const parsed = parseCvData(cv);
  assert.equal(parsed.targeting?.requirements?.length, 8);
  assert.equal(parsed.targeting?.vaguePhrases?.length, 5);
  assert.ok((parsed.targeting?.requirements?.[0].requirement.length ?? 0) <= 180);
});

test("an older hand-off without requirements still works", () => {
  const { requirements: _r, vaguePhrases: _v, ...legacy } = handoff;
  const targeting = targetingFromFitHandoff(legacy);
  assert.equal(targeting.requirements, undefined);
  assert.equal(targeting.vaguePhrases, undefined);
  const cv = createBlankCv();
  cv.targeting = targeting;
  assert.doesNotThrow(() => parseCvData(cv));
});

test("unmet requirements are asked first, not-evidenced before partly evidenced", () => {
  const result = triage(weakCv());
  assert.deepEqual(result.requirements.queue.map((item) => item.status), ["not-evidenced", "not-evidenced", "not-evidenced", "not-evidenced", "partly-supported"]);
  assert.match(result.requirements.queue[0].requirement, /CRM system/);
});

test("keywords inside requirements are not asked separately; the rest still are", () => {
  const result = triage(weakCv());
  const asked = result.queue.map((keyword) => keyword.term);
  for (const term of ["crm", "salesforce", "excel", "complaint handling"]) {
    assert.ok(!asked.includes(term), `${term} is covered by a requirement and should not be asked again`);
  }
  assert.ok(result.covered.some((keyword) => keyword.term === "crm"));
  assert.ok(result.covered.some((keyword) => keyword.term === "excel"));
  // The driving licence is in no requirement, so it is still a keyword question.
  assert.ok(asked.includes("driving licence"));
});

test("a requirement the checker judged evidenced is never asked, even if the dictionary disagrees", () => {
  const cv = weakCv();
  const before = analyseAtsKeywords(cv.targeting!.jobDescription, evidence(cv));
  assert.ok(before.missing.some((keyword) => keyword.term === "complaint handling"), "the dictionary alone would ask about complaint handling");
  const result = triage(cv);
  assert.ok(!result.queue.some((keyword) => keyword.term === "complaint handling"));
  assert.ok(result.found.some((keyword) => keyword.term === "complaint handling"), "it counts as found");
  assert.ok(!result.requirements.queue.some((item) => /complaint handling/.test(item.requirement)));
});

test("skipping or answering a requirement removes it from the queue", () => {
  const cv = weakCv();
  const first = triage(cv).requirements.queue[0].requirement;

  cv.targeting!.skippedKeywords = [first];
  const skipped = triage(cv);
  assert.ok(!skipped.requirements.queue.some((item) => item.requirement === first));
  assert.equal(skipped.requirements.skipped[0].requirement, first);

  cv.targeting!.skippedKeywords = [];
  cv.targeting!.answeredRequirements = [first];
  const answered = triage(cv);
  assert.ok(!answered.requirements.queue.some((item) => item.requirement === first));
  assert.equal(answered.requirements.answered[0].requirement, first);
});

test("a requirement is treated as answered once the CV contains all its skill keywords", () => {
  const cv = weakCv();
  const excel = "Good Microsoft Excel skills";
  assert.ok(triage(cv).requirements.queue.some((item) => item.requirement === excel));
  cv.skills += "\nExcel";
  assert.ok(!triage(cv).requirements.queue.some((item) => item.requirement === excel));
  assert.ok(triage(cv).requirements.answered.some((item) => item.requirement === excel));

  // CRM needs both CRM and Salesforce (the dictionary terms in it); Salesforce alone is not enough.
  const crm = "Experience using a CRM system such as Salesforce or Zendesk";
  cv.skills += "\nSalesforce";
  assert.ok(triage(cv).requirements.queue.some((item) => item.requirement === crm));
  cv.skills += "\nCRM";
  assert.ok(!triage(cv).requirements.queue.some((item) => item.requirement === crm));
});

test("requirements without any dictionary keyword stay until the user answers them", () => {
  const cv = weakCv();
  cv.skills += "\nEmails\nCalls";
  assert.ok(triage(cv).requirements.queue.some((item) => /calls and emails/.test(item.requirement)));
});

test("vague phrases are located in the profile or a bullet, and drop out once edited", () => {
  const cv = weakCv();
  const items = vaguePhraseItems(cv);
  assert.equal(items.length, 2, "the phrase the user already removed is not listed");
  assert.deepEqual(items[0].where, { kind: "profile" });
  assert.deepEqual(items[1].where, { kind: "bullet", roleId: "role-a", index: 0, roleTitle: "Sales Assistant" });

  cv.experience[0].bullets = "Served 40 customers a day at the till\nDealt with customer complaints";
  assert.equal(vaguePhraseItems(cv).length, 1);
  cv.profile = "Retail assistant with three years of customer-facing experience.";
  assert.equal(vaguePhraseItems(cv).length, 0);
});

test("the vacancy title is not the headline, but AI features still know the role", () => {
  const cv = weakCv();
  assert.equal(cv.targetRole, "");
  assert.equal(effectiveTargetRole(cv), "Customer Service Advisor");
  cv.targetRole = "Sales Assistant";
  assert.equal(effectiveTargetRole(cv), "Sales Assistant", "the user's own headline wins");
  assert.equal(effectiveTargetRole(createBlankCv()), "");
});

test("the editor asks for a headline and explains that the advert is for another title", () => {
  const issue = calculateCvReadiness(weakCv()).issues.find((item) => item.id === "target-role");
  assert.ok(issue);
  assert.match(issue.message, /Customer Service Advisor/);
  assert.match(issue.message, /only if it matches/i);

  const plain = calculateCvReadiness(createBlankCv()).issues.find((item) => item.id === "target-role");
  assert.equal(plain?.message, "Add a specific target role so the CV has a clear direction.");
});

test("watch terms are only the skill keywords that were missing from the CV when the checker ran", () => {
  const byName = Object.fromEntries((targetingFromFitHandoff(handoff).requirements ?? []).map((item) => [item.requirement, item.watch]));
  assert.deepEqual(byName["Good Microsoft Excel skills"], ["excel"]);
  assert.deepEqual([...(byName["Experience using a CRM system such as Salesforce or Zendesk"] ?? [])].sort(), ["crm", "salesforce"]);
  // "communication" and "sales" were already in the CV when the checker still called these unmet.
  assert.deepEqual(byName["Excellent written communication"], []);
  assert.deepEqual(byName["Log cases and resolve issues quickly with the sales team"], []);
});

test("incidental words already in the CV never make an unmet requirement disappear (found in a live run)", () => {
  const result = triage(weakCv());
  const queued = result.requirements.queue.map((item) => item.requirement);
  assert.ok(queued.includes("Excellent written communication"), "the checker saw 'communication' and still judged it partly evidenced");
  assert.ok(queued.includes("Log cases and resolve issues quickly with the sales team"), "'sales' in 'sales team' is not evidence of logging cases");
  assert.equal(result.requirements.answered.length, 0);
});

test("without the CV text there is no baseline, so nothing is dismissed automatically", () => {
  const { cvText: _cv, ...noText } = handoff;
  const cv = weakCv();
  cv.targeting = targetingFromFitHandoff(noText);
  cv.skills += ["", "Excel", "CRM", "Salesforce"].join(String.fromCharCode(10));
  assert.equal(triage(cv).requirements.answered.length, 0);
  assert.ok(triage(cv).requirements.queue.some((item) => item.requirement === "Good Microsoft Excel skills"));
});

test("progress counts move as the user fixes things, and need no AI", () => {
  const cv = weakCv();
  const before = matchProgress(cv, triage(cv));
  assert.equal(before.bulletsWithResults.total, 3);
  assert.equal(before.bulletsWithResults.count, 0);
  assert.equal(before.flaggedBullets, 3);
  assert.equal(before.requirements?.total, 5);
  assert.equal(before.requirements?.handled, 0);

  // A bullet with a real result, and a skill added: three counts move at once.
  cv.experience[1].bullets += ["", "Reduced picking errors by 15% using a handheld scanner"].join(String.fromCharCode(10));
  cv.skills += ["", "Excel"].join(String.fromCharCode(10));
  const after = matchProgress(cv, triage(cv));
  assert.equal(after.bulletsWithResults.count, 1);
  assert.equal(after.bulletsWithResults.total, 4);
  assert.equal(after.requirements?.handled, 1, "adding Excel answers the Excel requirement");
  assert.ok(after.keywords.found > before.keywords.found);

  // Skipping is not progress.
  cv.targeting!.skippedKeywords = ["Experience using a CRM system such as Salesforce or Zendesk"];
  assert.equal(matchProgress(cv, triage(cv)).requirements?.handled, 1);
});

test("progress has no requirement count when there is no checker data", () => {
  const cv = weakCv();
  cv.targeting = { role: "Customer Service Advisor", jobDescription: advert, priorities: [] };
  assert.equal(matchProgress(cv, triage(cv)).requirements, null);
});
