import assert from "node:assert/strict";
import test from "node:test";

import {
  addCalendarMonths,
  calculateNoticeEndDate,
  calculateNoticePeriod,
  completedServiceMonths,
  statutoryNoticeForService,
} from "../lib/notice-period-calculator.ts";

test("one week received on Monday expires the following Monday", () => {
  assert.equal(
    calculateNoticeEndDate("2026-06-01", { amount: 1, unit: "weeks" }),
    "2026-06-08",
  );
});

test("calendar months preserve an end-of-month notice date", () => {
  assert.equal(addCalendarMonths("2024-02-29", 1), "2024-03-31");
  assert.equal(addCalendarMonths("2026-01-31", 1), "2026-02-28");
  assert.equal(addCalendarMonths("2026-06-14", 1), "2026-07-14");
});

test("calculates complete calendar months of service", () => {
  assert.equal(completedServiceMonths("2026-05-28", "2026-06-27"), 0);
  assert.equal(completedServiceMonths("2026-05-28", "2026-06-28"), 1);
  assert.equal(completedServiceMonths("2020-08-15", "2026-06-28"), 70);
});

test("separates employee and employer statutory notice", () => {
  assert.deepEqual(statutoryNoticeForService(0), {
    employeeWeeks: 0,
    employerWeeks: 0,
  });
  assert.deepEqual(statutoryNoticeForService(70), {
    employeeWeeks: 1,
    employerWeeks: 5,
  });
  assert.deepEqual(statutoryNoticeForService(240), {
    employeeWeeks: 1,
    employerWeeks: 12,
  });
});

test("returns a concrete target assessment and latest notice date", () => {
  const result = calculateNoticePeriod({
    employmentStartDate: "2020-01-01",
    contractualPeriod: { amount: 1, unit: "months" },
    targetKind: "new-start",
    targetDate: "2026-08-01",
    noticeGivenDate: "2026-06-28",
  });

  assert.equal(result.minimumEmploymentEndDate, "2026-07-28");
  assert.equal(result.earliestNewStartDate, "2026-07-29");
  assert.equal(result.targetEmploymentEndDate, "2026-07-31");
  assert.equal(result.latestNoticeDate, "2026-06-30");
  assert.equal(result.daysMargin, 3);
  assert.equal(result.targetMet, true);
  assert.equal(result.employerStatutoryNoticeWeeks, 6);
});

test("flags a target that is earlier than the minimum contract end", () => {
  const result = calculateNoticePeriod({
    employmentStartDate: "2020-01-01",
    contractualPeriod: { amount: 1, unit: "months" },
    targetKind: "new-start",
    targetDate: "2026-07-20",
    noticeGivenDate: "2026-06-28",
  });

  assert.equal(result.targetMet, false);
  assert.equal(result.daysMargin, -9);
  assert.equal(result.latestNoticeDate, "2026-06-19");
});

test("statutory resignation notice overrides a shorter custom contract period", () => {
  const result = calculateNoticePeriod({
    employmentStartDate: "2025-01-01",
    contractualPeriod: { amount: 3, unit: "days" },
    targetKind: "last-day",
    targetDate: "2026-07-10",
    noticeGivenDate: "2026-06-28",
  });

  assert.equal(result.effectiveNoticeSource, "statutory");
  assert.equal(result.minimumEmploymentEndDate, "2026-07-05");
});

test("allows same-day termination when under one month and contract is silent", () => {
  const result = calculateNoticePeriod({
    employmentStartDate: "2026-06-15",
    contractualPeriod: null,
    targetKind: "last-day",
    targetDate: "2026-07-01",
    noticeGivenDate: "2026-06-28",
  });

  assert.equal(result.employeeStatutoryNoticeWeeks, 0);
  assert.equal(result.minimumEmploymentEndDate, "2026-06-28");
  assert.equal(result.earliestNewStartDate, "2026-06-29");
  assert.equal(result.effectiveNoticeSource, "none");
});

