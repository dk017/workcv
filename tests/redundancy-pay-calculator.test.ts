import assert from "node:assert/strict";
import test from "node:test";

import {
  ageOnDate,
  calculateRedundancyPay,
  completedYearsBetween,
} from "../lib/redundancy-pay-calculator.ts";

test("calculates age and complete service years on anniversaries", () => {
  assert.equal(ageOnDate("1981-06-30", "2026-06-30"), 45);
  assert.equal(completedYearsBetween("2011-06-30", "2026-06-30"), 15);
  assert.equal(completedYearsBetween("2011-07-01", "2026-06-30"), 14);
});

test("applies age multipliers to each full service year", () => {
  const result = calculateRedundancyPay({
    dateOfBirth: "1981-06-30",
    employmentStartDate: "2011-06-30",
    redundancyDate: "2026-06-30",
    grossWeeklyPay: 600,
    jurisdiction: "great-britain",
  });

  assert.equal(result.completedServiceYears, 15);
  assert.equal(result.statutoryWeeks, 17);
  assert.equal(result.statutoryPay, 10_200);
  assert.deepEqual(
    result.serviceYears.reduce(
      (counts, year) => {
        counts[year.multiplier] = (counts[year.multiplier] ?? 0) + 1;
        return counts;
      },
      {} as Record<number, number>,
    ),
    { 1: 11, 1.5: 4 },
  );
});

test("uses one week for a year that started at age 40", () => {
  const result = calculateRedundancyPay({
    dateOfBirth: "1985-06-30",
    employmentStartDate: "2025-06-30",
    redundancyDate: "2026-06-30",
    grossWeeklyPay: 500,
    jurisdiction: "great-britain",
  });

  assert.equal(result.eligible, false);
  assert.equal(result.statutoryPay, 0);
});

test("caps service at the latest 20 full years and weekly pay by region", () => {
  const result = calculateRedundancyPay({
    dateOfBirth: "1965-06-30",
    employmentStartDate: "1996-06-30",
    redundancyDate: "2026-06-30",
    grossWeeklyPay: 1_000,
    jurisdiction: "great-britain",
  });

  assert.equal(result.countedServiceYears, 20);
  assert.equal(result.ignoredServiceYears, 10);
  assert.equal(result.weeklyPayUsed, 751);
  assert.equal(result.statutoryWeeks, 30);
  assert.equal(result.statutoryPay, 22_530);
});

test("uses the current Northern Ireland weekly cap", () => {
  const result = calculateRedundancyPay({
    dateOfBirth: "1965-06-30",
    employmentStartDate: "2006-06-30",
    redundancyDate: "2026-06-30",
    grossWeeklyPay: 1_000,
    jurisdiction: "northern-ireland",
  });

  assert.equal(result.weeklyPayUsed, 783);
  assert.equal(result.statutoryPay, 23_490);
});

test("keeps an enhanced scenario separate from the statutory result", () => {
  const result = calculateRedundancyPay({
    dateOfBirth: "1981-06-30",
    employmentStartDate: "2011-06-30",
    redundancyDate: "2026-06-30",
    grossWeeklyPay: 900,
    jurisdiction: "great-britain",
    enhancedMultiplier: 1.5,
    enhancedUsesActualWeeklyPay: true,
  });

  assert.equal(result.statutoryPay, 17 * 751);
  assert.equal(result.enhancedEstimate, 17 * 900 * 1.5);
});
