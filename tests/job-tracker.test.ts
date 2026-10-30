import assert from "node:assert/strict";
import test from "node:test";

import {
  buildJobPackPrefill,
  csvToJobs,
  isSafeHttpUrl,
  jobUrgency,
  jobsToCsv,
  maxTrackedJobs,
  mergeImportedJobs,
  parseCsv,
  parseTrackerState,
  readJobPackPrefill,
  serializeTrackerState,
  sortJobs,
  summarizeJobs,
  type TrackedJob,
} from "../lib/job-tracker.ts";

let counter = 0;
const makeId = () => `id-${++counter}`;

function job(overrides: Partial<TrackedJob> = {}): TrackedJob {
  return { id: makeId(), role: "Care Assistant", employer: "Oak House", status: "applied", createdAt: 1, updatedAt: 1, ...overrides };
}

test("stored state survives bad JSON, invalid entries and the job limit", () => {
  assert.deepEqual(parseTrackerState(null), { jobs: [], dropped: 0 });
  assert.deepEqual(parseTrackerState("{not json"), { jobs: [], dropped: 0 });
  const mixed = JSON.stringify({ version: 1, jobs: [job(), { role: "" }, "junk", job({ status: "bogus" as never })] });
  const parsed = parseTrackerState(mixed);
  assert.equal(parsed.jobs.length, 1);
  assert.equal(parsed.dropped, 3);
  const many = Array.from({ length: maxTrackedJobs + 5 }, () => job());
  assert.equal(parseTrackerState(serializeTrackerState(many)).jobs.length, maxTrackedJobs);
});

test("only http and https links are treated as safe", () => {
  assert.equal(isSafeHttpUrl("https://www.reed.co.uk/jobs/123"), true);
  assert.equal(isSafeHttpUrl("javascript:alert(1)"), false);
  assert.equal(isSafeHttpUrl("not a url"), false);
  assert.equal(isSafeHttpUrl(undefined), false);
});

test("urgency flags overdue follow-ups and saved jobs closing soon, not finished ones", () => {
  const today = "2026-10-01";
  assert.equal(jobUrgency(job({ nextActionDate: "2026-09-29" }), today)?.label, "Follow-up 2 days overdue");
  assert.equal(jobUrgency(job({ nextActionDate: "2026-10-01" }), today)?.kind, "due");
  assert.equal(jobUrgency(job({ status: "saved", closingDate: "2026-10-03" }), today)?.label, "Closes in 2 days");
  assert.equal(jobUrgency(job({ status: "saved", closingDate: "2026-10-10" }), today), null);
  assert.equal(jobUrgency(job({ status: "unsuccessful", nextActionDate: "2026-09-01" }), today), null);
});

test("summary counts this week's applications from Monday", () => {
  // 1 October 2026 is a Thursday; the week started on Monday 28 September.
  const jobs = [
    job({ appliedDate: "2026-09-28" }),
    job({ appliedDate: "2026-09-27" }),
    job({ status: "interview", appliedDate: "2026-09-20" }),
    job({ status: "unsuccessful" }),
    job({ nextActionDate: "2026-09-30" }),
  ];
  assert.deepEqual(summarizeJobs(jobs, "2026-10-01"), { total: 5, appliedThisWeek: 1, active: 4, interviews: 1, followUpsDue: 1 });
});

test("most urgent jobs sort first", () => {
  const later = job({ role: "Later", nextActionDate: "2026-10-20" });
  const overdue = job({ role: "Overdue", nextActionDate: "2026-09-25" });
  const none = job({ role: "None", updatedAt: 5 });
  assert.deepEqual(sortJobs([none, later, overdue], "2026-10-01").map((item) => item.role), ["Overdue", "Later", "None"]);
});

test("CSV export escapes text, guards formulas and round-trips", () => {
  const original = [
    job({ role: "Warehouse Operative", employer: '=HYPERLINK("x")', notes: 'Said "call back", Monday\nafter 2pm', salary: "£12.60 an hour", appliedDate: "2026-09-29" }),
  ];
  const csv = jobsToCsv(original);
  assert.ok(csv.startsWith("﻿Job title,Employer,Status"));
  assert.ok(csv.includes(`"'=HYPERLINK(""x"")"`), "formula cell must be neutralised");
  const back = csvToJobs(csv, makeId, 9);
  assert.equal(back.error, "");
  assert.equal(back.jobs.length, 1);
  const [roundTrip] = back.jobs;
  assert.equal(roundTrip.employer, '=HYPERLINK("x")');
  assert.equal(roundTrip.notes, 'Said "call back", Monday\nafter 2pm');
  assert.equal(roundTrip.salary, "£12.60 an hour");
  assert.equal(roundTrip.status, "applied");
  assert.equal(roundTrip.appliedDate, "2026-09-29");
});

test("CSV import accepts UK dates and loose status words, and skips unusable rows", () => {
  const csv = "Company,Position,Status,Date applied\nTesco,Store Assistant,Rejected,03/09/2026\n,Missing employer,Applied,\nNHS,Nurse,interview stage,31/02/2026\n";
  const result = csvToJobs(csv, makeId);
  assert.equal(result.error, "");
  assert.equal(result.skipped, 1);
  assert.deepEqual(result.jobs.map((item) => [item.employer, item.status, item.appliedDate]), [
    ["Tesco", "unsuccessful", "2026-09-03"],
    ["NHS", "interview", undefined],
  ]);
  assert.match(csvToJobs("Notes\nhello\n", makeId).error, /Job title/);
  assert.deepEqual(parseCsv('a,"b,c"\r\n'), [["a", "b,c"]]);
});

test("importing the same jobs again skips duplicates", () => {
  const existing = [job({ role: "Picker", employer: "Tesco", appliedDate: "2026-09-29" })];
  const incoming = [
    job({ role: " picker ", employer: "TESCO", appliedDate: "2026-09-29" }),
    job({ role: "Picker", employer: "Tesco", appliedDate: "2026-09-30" }),
    job({ role: "Driver", employer: "DPD" }),
    job({ role: "Driver", employer: "DPD" }),
  ];
  const result = mergeImportedJobs(existing, incoming);
  assert.equal(result.added.length, 2);
  assert.equal(result.duplicates, 2);
  assert.equal(result.overLimit, 0);
});

test("a tracked job hands its role, employer and advert to the Job Application Pack", () => {
  const prefill = buildJobPackPrefill(job({ role: "Delivery Driver", employer: "DPD", advertText: "Multi-drop routes" }));
  assert.deepEqual(prefill, { targetRole: "Delivery Driver", company: "DPD", jobDescription: "Multi-drop routes" });
  assert.deepEqual(readJobPackPrefill(JSON.stringify(prefill)), prefill);
  assert.equal(readJobPackPrefill("nope"), null);
  assert.equal(readJobPackPrefill(JSON.stringify({ company: "x" })), null);
});


test("demo rows retain their label after reload, so they cannot inflate real-job milestones", () => {
  const rows = [job({ isExample: true }), job({ isExample: true }), job()];
  const restored = parseTrackerState(serializeTrackerState(rows)).jobs;
  assert.equal(restored.filter(row => !row.isExample).length, 1);
  assert.equal(restored.filter(row => row.isExample).length, 2);
  const imported = csvToJobs(jobsToCsv(rows), makeId).jobs;
  assert.equal(imported.filter(row => row.isExample).length, 2);
});
