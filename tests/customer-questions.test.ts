import assert from "node:assert/strict";
import test from "node:test";
import { existsSync } from "node:fs";
import { customerQuestions, customerQuestionHref } from "../lib/customer-questions.ts";
import { customerContentReview } from "../lib/customer-content-review.ts";
import { firstCvExample, noMetricsExamples } from "../lib/customer-answer-examples.ts";
import { analyticsPlacements } from "../lib/analytics-placements.ts";
import { site } from "../lib/site.ts";

test("every researched question has one existing canonical owner and distinct anchor", () => {
  const ids = Array.from({ length: 24 }, (_, i) => `Q${String(i + 1).padStart(2, "0")}`);
  assert.deepEqual(Object.keys(customerQuestions), ids);
  const targets = new Set<string>();
  for (const id of ids) {
    const question = customerQuestions[id as keyof typeof customerQuestions];
    assert.equal(question.id, id);
    assert.ok(existsSync(`app${question.ownerPath}/page.tsx`), question.ownerPath);
    assert.match(question.anchor, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(question.question.length > 20 && question.answer.length > 80, id);
    const target = customerQuestionHref(question.id);
    assert.equal(target, `${question.ownerPath}#${question.anchor}`);
    assert.ok(!targets.has(target), target);
    targets.add(target);
  }
});

test("commercial answers reflect the configured price and saved-document entitlement", () => {
  for (const id of ["Q01", "Q02", "Q03", "Q08"] as const) {
    assert.ok(customerQuestions[id].answer.includes(site.price), id);
  }
  assert.match(customerQuestions.Q05.answer, /same saved CV/);
  assert.match(customerQuestions.Q06.answer, /separate new saved CV/);
  assert.match(customerQuestions.Q24.answer, /Do not pay again/);
  assert.match(customerQuestions.Q02.answer, /free to download without an account/);
});

test("new illustrative examples keep claims supportable", () => {
  assert.match(firstCvExample, /PROJECTS AND RESPONSIBILITIES/);
  assert.match(firstCvExample, /VOLUNTEERING/);
  assert.doesNotMatch(firstCvExample, /Sage|DBS|guaranteed/i);
  assert.equal(noMetricsExamples.length, 3);
  for (const example of noMetricsExamples) {
    assert.ok(example.knownFacts.length && example.improved.length > example.original.length);
    assert.doesNotMatch(example.improved, /\d+%|revenue|guaranteed/i);
  }
});

test("reviewed routes and scoped placements remain explicit", () => {
  const ownerPaths = new Set(Object.values(customerQuestions).map(q => q.ownerPath));
  for (const path of [...Array.from(ownerPaths), "/tools/blank-cv-template-uk", "/tools/first-job-cv-wizard-uk", "/privacy"]) {
    assert.match(customerContentReview[path as keyof typeof customerContentReview], /^\d{4}-\d{2}-\d{2}$/);
  }
  assert.equal(Object.keys(customerContentReview).length, 18);
  const placements = Object.entries(analyticsPlacements).filter(([key]) => key.startsWith("customerQ"));
  assert.equal(placements.length, 8);
  assert.equal(new Set(placements.map(([, value]) => value)).size, placements.length);
  for (const [, value] of placements) assert.match(value, /^[a-z0-9_]{3,80}$/);
});
