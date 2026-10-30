import assert from "node:assert/strict";
import test from "node:test";

import {
  competitors,
  comparisonRows,
  costRows,
  getCompetitor,
  resolveAlternatives,
} from "../lib/competitors/index.ts";
import { competitorNav } from "../lib/competitors/nav.ts";

const titleSuffix = " | WorkCV";
const pages = competitors.flatMap((competitor) => [
  { competitor, kind: "vs", path: competitor.vsPath, ...competitor.vs },
  { competitor, kind: "alt", path: competitor.altPath, ...competitor.alt },
]);

test("covers twelve competitors with unique slugs and paths", () => {
  assert.equal(competitors.length, 12);
  assert.equal(new Set(competitors.map((item) => item.slug)).size, 12);
  assert.equal(new Set(pages.map((page) => page.path)).size, 24);
  for (const page of pages) assert.match(page.path, /^\/[a-z0-9-]+$/);
});

test("titles fit search results and are unique", () => {
  for (const page of pages) {
    assert.ok(page.title.length + titleSuffix.length <= 70, `${page.path} title too long: ${page.title}`);
    assert.ok(page.title.length <= 62, `${page.path} title over 62 characters`);
    assert.ok(page.title.includes(page.competitor.name), `${page.path} title must name ${page.competitor.name}`);
    assert.ok(page.title.includes("2026"), `${page.path} title should carry the year`);
  }
  assert.equal(new Set(pages.map((page) => page.title)).size, pages.length);
});

test("descriptions are unique and 110 to 160 characters", () => {
  for (const page of pages) {
    assert.ok(
      page.description.length >= 110 && page.description.length <= 160,
      `${page.path} description is ${page.description.length} characters`,
    );
  }
  assert.equal(new Set(pages.map((page) => page.description)).size, pages.length);
});

test("answers lead with both names and stay quotable", () => {
  for (const page of pages) {
    const words = page.answer.split(/\s+/).length;
    assert.ok(words >= 35 && words <= 80, `${page.path} answer is ${words} words`);
    assert.ok(page.answer.includes(page.competitor.name), `${page.path} answer must name the competitor`);
    assert.ok(page.answer.includes("WorkCV"), `${page.path} answer must name WorkCV`);
  }
});

test("FAQs are substantial and never repeated across pages", () => {
  const questions = pages.flatMap((page) => page.faqs.map((faq) => faq.question));
  assert.equal(new Set(questions).size, questions.length, "duplicate FAQ question across pages");
  for (const page of pages) {
    assert.ok(page.faqs.length >= 4, `${page.path} needs at least four FAQs`);
    for (const faq of page.faqs) {
      assert.match(faq.question, /\?$/);
      assert.ok(faq.answer.length >= 80, `${page.path} answer too thin: ${faq.question}`);
    }
  }
});

test("vs pages give honest fit lists for both products", () => {
  for (const competitor of competitors) {
    assert.ok(competitor.vs.competitorBetter.length >= 4, `${competitor.slug} needs reasons to choose it`);
    assert.ok(competitor.vs.workcvBetter.length >= 4);
    assert.ok(competitor.vs.verdict.length >= 3);
  }
});

test("alternatives resolve, include WorkCV and never list the brand itself", () => {
  for (const competitor of competitors) {
    const options = resolveAlternatives(competitor);
    assert.ok(options.length >= 5 && options.length <= 6, `${competitor.slug} has ${options.length} options`);
    assert.ok(options.some((option) => option.name === "WorkCV"));
    assert.ok(options.every((option) => option.name !== competitor.name));
    assert.equal(new Set(options.map((option) => option.name)).size, options.length);
    for (const option of options) {
      if (option.external) assert.match(option.href, /^https:\/\//);
      else assert.match(option.href, /^\/[a-z0-9/-]+$/);
    }
  }
});

test("related comparisons exist and are not self-links", () => {
  for (const competitor of competitors) {
    for (const slug of competitor.related) {
      assert.notEqual(slug, competitor.slug);
      getCompetitor(slug);
    }
  }
});

test("sources are official https links", () => {
  for (const competitor of competitors) {
    assert.match(competitor.pricing.sourceUrl, /^https:\/\//);
    assert.ok(competitor.sources.length >= 3);
    for (const [, href] of competitor.sources) assert.match(href, /^https:\/\//);
    assert.match(competitor.switching.href, /^https:\/\//);
  }
});

test("comparison rows cover ten areas", () => {
  for (const competitor of competitors) {
    const rows = comparisonRows(competitor);
    assert.equal(rows.length, 10);
    for (const row of rows) for (const cell of row) assert.ok(cell.length > 2);
  }
});

test("cost table maths matches the published plans", () => {
  const rows = costRows(getCompetitor("myperfectcv"));
  assert.deepEqual(rows?.map((row) => row.cost), [2.95, 19.9, 53.8, 59.4]);
  assert.deepEqual(costRows(getCompetitor("livecareer"))?.map((row) => row.cost), [1.95, 21.8, 61.5, 83.4]);
  assert.equal(costRows(getCompetitor("zety")), null, "Zety quotes US dollars to UK visitors");
  assert.deepEqual(costRows(getCompetitor("resume-io"))?.map((row) => row.cost), [23.9, 23.9, 49.95, 199.8]);
  assert.equal(costRows(getCompetitor("cvmaker")), null, "conflicting prices must not be modelled");
  assert.equal(costRows(getCompetitor("kickresume")), null, "regional prices must not be modelled");
});

test("copy never calls the WorkCV PDF free or claims AI writing", () => {
  const text = JSON.stringify(competitors);
  assert.doesNotMatch(text, /WorkCV(?:'s)? (?:PDF|download) is free/i);
  assert.doesNotMatch(text, /WorkCV (?:has|includes|offers) AI writing/i);
  assert.doesNotMatch(text, /guarantee(?:d)? interviews?/i);
});

test("client navigation list matches the comparison data", () => {
  assert.deepEqual(
    competitorNav.map(({ slug, name, altLabel, vsPath, altPath }) => ({ slug, name, altLabel, vsPath, altPath })),
    competitors.map((competitor) => ({
      slug: competitor.slug,
      name: competitor.name,
      altLabel: competitor.alt.subject ?? competitor.name,
      vsPath: competitor.vsPath,
      altPath: competitor.altPath,
    })),
  );
});

test("prices agree with the plan data used by the brand-vs-brand pages", async () => {
  const { competitorPlans } = await import("../lib/competitor-plans.ts");
  const money = (minor: number, currency: "GBP" | "USD") => `${currency === "GBP" ? "£" : "$"}${(minor / 100).toFixed(2).replace(/\.00$/, "")}`;
  const pairs = [
    ["myperfectcv", competitorPlans.myPerfectCv],
    ["livecareer", competitorPlans.liveCareer],
    ["zety", competitorPlans.zety],
    ["kickresume", competitorPlans.kickresume],
  ] as const;
  for (const [slug, plans] of pairs) {
    const text = JSON.stringify(getCompetitor(slug).pricing);
    for (const minor of [plans.trial.entryMinor, plans.trial.renewalMinor, plans.annual.totalMinor]) {
      assert.ok(text.includes(money(minor, plans.trial.currency)), `${slug} pricing should mention ${money(minor, plans.trial.currency)}`);
    }
  }
});
