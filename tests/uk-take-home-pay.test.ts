import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateUkTakeHomePay,
  TakeHomePayError,
} from "../lib/uk-take-home-pay.ts";

const baseInput = {
  annualSalary: 35_000,
  annualBonus: 0,
  salarySacrificePension: 0,
  taxRegion: "rest-of-uk" as const,
  studentLoanPlan: "none" as const,
  hasPostgraduateLoan: false,
  hasBlindPersonsAllowance: false,
};

test("calculates 2026/27 rest-of-UK tax and employee NI", () => {
  const result = calculateUkTakeHomePay(baseInput);

  assert.equal(result.personalAllowance, 12_570);
  assert.equal(result.taxablePay, 22_430);
  assert.equal(result.incomeTax, 4_486);
  assert.equal(result.nationalInsurance, 1_794.4);
  assert.equal(result.takeHomePay, 28_719.6);
});

test("uses the six Scottish earned-income bands", () => {
  const result = calculateUkTakeHomePay({
    ...baseInput,
    annualSalary: 50_000,
    taxRegion: "scotland",
  });

  assert.equal(result.taxablePay, 37_430);
  assert.ok(Math.abs(result.incomeTax - 8_982.05) < 0.001);
});

test("supports an undergraduate plan and postgraduate loan together", () => {
  const result = calculateUkTakeHomePay({
    ...baseInput,
    studentLoanPlan: "plan-2",
    hasPostgraduateLoan: true,
  });

  assert.ok(Math.abs(result.studentLoan - 505.35) < 0.001);
  assert.equal(result.postgraduateLoan, 840);
});

test("salary sacrifice reduces taxable pay, NI and loan earnings", () => {
  const result = calculateUkTakeHomePay({
    ...baseInput,
    salarySacrificePension: 5_000,
    studentLoanPlan: "plan-5",
  });

  assert.equal(result.adjustedGrossPay, 30_000);
  assert.equal(result.incomeTax, 3_486);
  assert.equal(result.nationalInsurance, 1_394.4);
  assert.equal(result.studentLoan, 450);
  assert.equal(result.takeHomePay, 24_669.6);
});

test("tapers the standard allowance above £100,000 but retains blind allowance", () => {
  const result = calculateUkTakeHomePay({
    ...baseInput,
    annualSalary: 125_140,
    hasBlindPersonsAllowance: true,
  });

  assert.equal(result.personalAllowance, 3_250);
  assert.equal(result.taxablePay, 121_890);
});

test("rejects pension sacrifice above total gross pay", () => {
  assert.throws(
    () =>
      calculateUkTakeHomePay({
        ...baseInput,
        salarySacrificePension: 40_000,
      }),
    TakeHomePayError,
  );
});
