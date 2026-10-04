import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { competitorPlans, costOverDays, formatMinor } from "../lib/competitor-plans.ts";

const read = (path: string) => readFileSync(path, "utf8");
const comparisonPages = ["/myperfectcv-vs-livecareer-uk", "/zety-vs-myperfectcv-uk", "/kickresume-alternative-uk"];

test("cost over time counts the trial and each renewal before the cut-off", () => {
  const mpcv = competitorPlans.myPerfectCv.trial;
  assert.equal(costOverDays(mpcv, 0), 0);
  assert.equal(costOverDays(mpcv, 14), 295, "renewal falls on day 14, so it is not yet charged within 14 days");
  assert.equal(costOverDays(mpcv, 15), 295 + 1695);
  assert.equal(costOverDays(mpcv, 28), 295 + 1695);
  // Renewals on days 14, 42 and 70.
  assert.equal(costOverDays(mpcv, 84), 295 + 3 * 1695);
  assert.equal(costOverDays(competitorPlans.liveCareer.trial, 84), 195 + 3 * 1985);
  // Kickresume's monthly plan has no trial: charges on days 0, 30 and 60.
  assert.equal(costOverDays(competitorPlans.kickresume.trial, 84), 3 * 900);
});

test("money is formatted in the plan's own currency", () => {
  assert.equal(formatMinor(5380, "GBP"), "£53.80");
  assert.equal(formatMinor(2595, "USD"), "$25.95");
});

test("every plan is sourced, dated and quotes its renewal terms", () => {
  for (const plans of Object.values(competitorPlans)) {
    assert.match(plans.checked, /^\d{1,2} [A-Z][a-z]+ 20\d\d$/);
    assert.match(plans.pricingSource, /^https:\/\//);
    assert.match(plans.operatorSource, /^https:\/\//);
    assert.match(plans.trial.renewalWording, /renew|automatically/i);
    // A pound sign must never sit next to a figure taken from a dollar page.
    if (plans.trial.currency === "USD") assert.doesNotMatch(plans.trial.renewalWording, /£/);
  }
});

test("Bold-run brands are labelled with the operator named in their terms", () => {
  for (const key of ["myPerfectCv", "liveCareer", "zety"] as const) assert.equal(competitorPlans[key].operator, "BOLD LLC");
});

test("comparison pages are registered and linked", () => {
  const sitemap = read("app/sitemap.ts");
  const breadcrumbs = read("components/site-breadcrumbs.tsx");
  const bestBuilder = read("app/best-cv-builder-uk/page.tsx");
  for (const path of comparisonPages) {
    assert.match(sitemap, new RegExp(`path: "${path}"`));
    assert.match(breadcrumbs, new RegExp(`"${path}"`));
    assert.match(bestBuilder, new RegExp(`"${path}"`));
  }
});

test("comparison copy takes prices from the plan data and never quotes a pound price for Zety", () => {
  const zetyVs = read("app/zety-vs-myperfectcv-uk/page.tsx");
  const mpcvVs = read("app/myperfectcv-vs-livecareer-uk/page.tsx");
  for (const source of [zetyVs, mpcvVs]) {
    assert.doesNotMatch(source, /£\d/, "prices must come from competitorPlans, not typed by hand");
    assert.match(source, /competitorPlans\./);
  }
  assert.match(zetyVs, /usd\(a\.trial/);
});

test("WorkCV feature claims on alternative pages match the current product", () => {
  const template = read("components/focused-alternative-page.tsx");
  for (const source of [template, read("app/livecareer-alternative/page.tsx"), read("app/cvmaker-alternative/page.tsx"), read("app/enhancv-alternative-uk/page.tsx")]) {
    assert.doesNotMatch(source, /No application tracking|does not include a\s+cover-letter builder|no cover-letter builder/);
  }
});
