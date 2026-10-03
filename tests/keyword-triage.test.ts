import assert from "node:assert/strict";
import test from "node:test";

import { analyseAtsKeywords } from "../lib/ats-keyword-checker.ts";
import { parseCvData } from "../lib/cv-schema.ts";
import { createBlankCv } from "../lib/editor-data.ts";
import { addSkillLine, addSkippedKeyword, buildKeywordTriage, canAddToSkills, displayKeyword } from "../lib/keyword-triage.ts";

const advert =
  "Customer Service Advisor. Essential: experience using Salesforce and Microsoft Excel to manage customer records. " +
  "You will resolve complaints, answer calls and keep accurate records. A full UK driving licence is desirable. " +
  "Salesforce experience is essential; Excel skills are needed daily.";

test("queues missing skills and qualifications, most important first, without action verbs", () => {
  const triage = buildKeywordTriage(analyseAtsKeywords(advert, "Customer service\nCash handling"));
  assert.ok(triage.queue.length > 0);
  assert.ok(triage.queue.every((keyword) => keyword.category !== "Action verb"));
  assert.ok(triage.found.every((keyword) => keyword.category !== "Action verb"));
  for (let index = 1; index < triage.queue.length; index += 1) {
    assert.ok(triage.queue[index - 1].weight >= triage.queue[index].weight);
  }
  assert.equal(triage.total, triage.found.length + triage.queue.length + triage.skipped.length);
});

test("a skill added to the CV moves from the queue to found", () => {
  const before = buildKeywordTriage(analyseAtsKeywords(advert, "Customer service"));
  const salesforce = before.queue.find((keyword) => keyword.term.toLowerCase() === "salesforce");
  assert.ok(salesforce, "Salesforce should be a missing keyword");
  assert.ok(canAddToSkills(salesforce));

  const after = buildKeywordTriage(analyseAtsKeywords(advert, addSkillLine("Customer service", salesforce.term)));
  assert.ok(after.found.some((keyword) => keyword.term === salesforce.term));
  assert.ok(!after.queue.some((keyword) => keyword.term === salesforce.term));
});

test("skipped keywords leave the queue but stay listed, case-insensitively", () => {
  const analysis = analyseAtsKeywords(advert, "Customer service");
  const first = buildKeywordTriage(analysis).queue[0];
  const triage = buildKeywordTriage(analysis, [first.term.toUpperCase()]);
  assert.ok(!triage.queue.some((keyword) => keyword.term === first.term));
  assert.ok(triage.skipped.some((keyword) => keyword.term === first.term));
});

test("skill and skip helpers do not duplicate entries", () => {
  assert.equal(addSkillLine("Excel\n\nTeamwork", "excel"), "Excel\nTeamwork");
  assert.equal(addSkillLine("", "Salesforce"), "Salesforce");
  assert.deepEqual(addSkippedKeyword(["Salesforce"], "salesforce"), ["Salesforce"]);
  assert.deepEqual(addSkippedKeyword(undefined, "Excel"), ["Excel"]);
});

test("job titles cannot be added as skills", () => {
  assert.equal(canAddToSkills({ category: "Job title" }), false);
  assert.equal(canAddToSkills({ category: "Qualification" }), true);
});

test("saved CVs accept skipped keywords on the targeting record", () => {
  const cv = createBlankCv();
  cv.targeting = { role: "Advisor", jobDescription: advert, priorities: [], skippedKeywords: ["Salesforce"] };
  assert.deepEqual(parseCvData(cv).targeting?.skippedKeywords, ["Salesforce"]);
});

test("lower-case analyser terms are shown and saved in sentence case", () => {
  assert.equal(displayKeyword("excel"), "Excel");
  assert.equal(displayKeyword("driving licence"), "Driving licence");
  assert.equal(displayKeyword("NVQ"), "NVQ");
  assert.equal(addSkillLine("Teamwork", "salesforce"), "Teamwork\nSalesforce");
});
