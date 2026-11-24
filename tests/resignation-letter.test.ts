import assert from "node:assert/strict";
import test from "node:test";

import { buildResignation, type ResignationInput } from "../lib/resignation-letter.ts";

const base: ResignationInput = {
  name: "Alex Morgan",
  managerName: "Priya Shah",
  jobTitle: "Customer Service Adviser",
  employer: "Northline Energy",
  letterDate: "2026-12-01",
  employmentStartDate: "2023-03-06",
  contractualPeriod: { amount: 4, unit: "weeks" },
  thanks: true,
  askHolidayPay: true,
  offerHandover: true,
};

test("a contractual notice period sets the last day, counted from the day after the letter", () => {
  const result = buildResignation(base);
  assert.ok(result.ok);
  assert.equal(result.lastDay, "2026-12-29");
  assert.match(result.letter, /^1 December 2026\n\nDear Priya Shah,/);
  assert.match(result.letter, /My notice period is 4 weeks, so I understand my last day of employment will be 29 December 2026\./);
  assert.match(result.letter, /Yours sincerely,\n\nAlex Morgan$/);
  assert.match(result.emailBody, /Kind regards,\nAlex Morgan$/);
  assert.equal(result.emailSubject, "Resignation: Alex Morgan, Customer Service Adviser");
});

test("calendar months follow the notice calculator's month rule", () => {
  const result = buildResignation({ ...base, letterDate: "2026-01-31", contractualPeriod: { amount: 1, unit: "months" } });
  assert.ok(result.ok);
  assert.equal(result.lastDay, "2026-02-28");
});

test("without a contract period, the statutory week applies and the letter asks the employer to check", () => {
  const result = buildResignation({ ...base, contractualPeriod: null });
  assert.ok(result.ok);
  assert.equal(result.lastDay, "2026-12-08");
  assert.match(result.letter, /I am giving 1 week's notice/);
  assert.match(result.letter, /if my contract requires a different notice period/);
});

test("a contract shorter than the statutory week is overridden by the statutory minimum", () => {
  const result = buildResignation({ ...base, contractualPeriod: { amount: 3, unit: "days" } });
  assert.ok(result.ok);
  assert.equal(result.lastDay, "2026-12-08");
  assert.equal(result.noticeSource, "statutory");
});

test("under a month's service with no contract period, no minimum notice applies", () => {
  const result = buildResignation({ ...base, employmentStartDate: "2026-11-20", contractualPeriod: null });
  assert.ok(result.ok);
  assert.equal(result.noticeSource, "none");
  assert.match(result.letter, /less than a month/);
});

test("a later preferred last day is used; an earlier one is refused with advice", () => {
  const later = buildResignation({ ...base, preferredLastDay: "2027-01-08" });
  assert.ok(later.ok);
  assert.equal(later.lastDay, "2027-01-08");
  assert.match(later.letter, /I would like my last day of employment to be 8 January 2027/);
  const earlier = buildResignation({ ...base, preferredLastDay: "2026-12-10" });
  assert.equal(earlier.ok, false);
  assert.match(earlier.ok ? "" : earlier.error, /ask your employer to agree it/);
});

test("optional lines can be switched off, and blanks become placeholders", () => {
  const result = buildResignation({ ...base, name: "", managerName: "", employer: "", thanks: false, askHolidayPay: false, offerHandover: false });
  assert.ok(result.ok);
  assert.doesNotMatch(result.letter, /Thank you|accrued holiday|hand over/);
  assert.match(result.letter, /Dear \[manager's name\],/);
  assert.match(result.letter, /at \[employer\]\./);
  assert.match(result.letter, /\[Your name\]$/);
});

test("a start date after the letter date is an error, not a letter", () => {
  const result = buildResignation({ ...base, employmentStartDate: "2027-01-01" });
  assert.equal(result.ok, false);
});
