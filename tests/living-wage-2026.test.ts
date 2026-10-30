import assert from "node:assert/strict";
import test from "node:test";
import { calculateLivingWage2026, statutoryWageFor } from "../lib/living-wage-2026.ts";

test("selects statutory rates by age", () => {
  assert.equal(statutoryWageFor({ age: 21, apprentice: false, firstApprenticeshipYear: false }).rate, 12.71);
  assert.equal(statutoryWageFor({ age: 20, apprentice: false, firstApprenticeshipYear: false }).rate, 10.85);
  assert.equal(statutoryWageFor({ age: 17, apprentice: false, firstApprenticeshipYear: false }).rate, 8);
});

test("uses apprentice rate only when eligibility conditions apply", () => {
  assert.equal(statutoryWageFor({ age: 22, apprentice: true, firstApprenticeshipYear: true }).rate, 8);
  assert.equal(statutoryWageFor({ age: 22, apprentice: true, firstApprenticeshipYear: false }).rate, 12.71);
  assert.equal(statutoryWageFor({ age: 18, apprentice: true, firstApprenticeshipYear: false }).rate, 8);
});

test("converts annual salary to an effective hourly rate", () => {
  const result = calculateLivingWage2026({ payType: "annual", pay: 26000, paidHoursPerWeek: 40, paidWeeksPerYear: 52, age: 25, apprentice: false, firstApprenticeshipYear: false, location: "rest-uk" });
  assert.equal(result.effectiveHourlyPay, 12.5);
  assert.equal(result.meetsStatutoryRate, false);
  assert.equal(result.statutoryDifferencePerHour, -0.21);
});

test("separates statutory and voluntary London rates", () => {
  const result = calculateLivingWage2026({ payType: "hourly", pay: 13.5, paidHoursPerWeek: 37.5, paidWeeksPerYear: 52, age: 30, apprentice: false, firstApprenticeshipYear: false, location: "london" });
  assert.equal(result.meetsStatutoryRate, true);
  assert.equal(result.meetsRealLivingWage, false);
  assert.equal(result.realLivingWageRate, 15.45);
});

test("uses Real Living Wage 2026-27 outside London", () => {
  const result = calculateLivingWage2026({ payType: "hourly", pay: 13.5, paidHoursPerWeek: 37.5, paidWeeksPerYear: 52, age: 30, apprentice: false, firstApprenticeshipYear: false, location: "rest-uk" });
  assert.equal(result.realLivingWageRate, 14.1);
  assert.equal(result.realLivingDifferencePerHour, -0.6);
});

test("applies April 2027 statutory rates when selected", () => {
  assert.equal(statutoryWageFor({ age: 21, apprentice: false, firstApprenticeshipYear: false, period: "april-2027" }).rate, 13.21);
  assert.equal(statutoryWageFor({ age: 19, apprentice: false, firstApprenticeshipYear: false, period: "april-2027" }).rate, 11.27);
  assert.equal(statutoryWageFor({ age: 17, apprentice: false, firstApprenticeshipYear: false, period: "april-2027" }).rate, 8.31);
  assert.equal(statutoryWageFor({ age: 25, apprentice: true, firstApprenticeshipYear: true, period: "april-2027" }).rate, 8.31);
  const result = calculateLivingWage2026({ payType: "hourly", pay: 12.71, paidHoursPerWeek: 37.5, paidWeeksPerYear: 52, age: 30, apprentice: false, firstApprenticeshipYear: false, location: "rest-uk", period: "april-2027" });
  assert.equal(result.meetsStatutoryRate, false);
  assert.equal(result.statutoryDifferencePerHour, -0.5);
});

test("rejects invalid hours and age", () => {
  assert.throws(() => calculateLivingWage2026({ payType: "hourly", pay: 12, paidHoursPerWeek: 0, paidWeeksPerYear: 52, age: 25, apprentice: false, firstApprenticeshipYear: false, location: "rest-uk" }), /Paid hours/);
});
