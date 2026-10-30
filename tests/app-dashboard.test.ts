import assert from "node:assert/strict";
import test from "node:test";

import { cvDisplayTitle } from "../lib/cv-label.ts";
import { isPublicMeasurementPath } from "../lib/public-paths.ts";
import { greetingFor, timeAgo } from "../lib/relative-time.ts";

test("CVs are named after the job and the employer, not the person", () => {
  assert.equal(cvDisplayTitle({ targetRole: " Team Leader ", coverLetter: undefined }), "Team Leader");
  assert.equal(cvDisplayTitle({ targetRole: "", coverLetter: undefined }), "Untitled CV");
  const letter = { jobTitle: "", employer: "Northstar Services", reference: "", recipientName: "", greeting: "hiring-manager" as const, employerAddress: "", includeDate: false, paragraphs: [] };
  assert.equal(cvDisplayTitle({ targetRole: "Team Leader", coverLetter: letter }), "Team Leader · Northstar Services");
});

test("edit times read naturally and count days in UK time", () => {
  const now = new Date("2026-10-09T15:00:00Z"); // 16:00 in London
  assert.equal(timeAgo("2026-10-09T14:59:40Z", now), "just now");
  assert.equal(timeAgo("2026-10-09T14:59:00Z", now), "1 minute ago");
  assert.equal(timeAgo("2026-10-09T12:00:00Z", now), "3 hours ago");
  // 23:30 UTC on the 8th is already the 9th in London.
  assert.equal(timeAgo("2026-10-08T23:30:00Z", now), "16 hours ago");
  assert.equal(timeAgo("2026-10-08T09:00:00Z", now), "yesterday");
  assert.equal(timeAgo("2026-10-05T09:00:00Z", now), "4 days ago");
  assert.equal(timeAgo("2026-09-20T09:00:00Z", now), "on 20 Sept");
  assert.equal(timeAgo("2025-09-20T09:00:00Z", now), "on 20 Sept 2025");
});

test("the greeting follows the time of day in London", () => {
  assert.equal(greetingFor(new Date("2026-10-09T07:00:00Z")), "Good morning");
  assert.equal(greetingFor(new Date("2026-10-09T13:00:00Z")), "Good afternoon");
  assert.equal(greetingFor(new Date("2026-10-09T18:30:00Z")), "Good evening");
});

test("signed-in pages are left out of public measurement", () => {
  for (const path of ["/my-cvs", "/my-cvs/tracker", "/account"]) assert.equal(isPublicMeasurementPath(path), false, path);
  assert.equal(isPublicMeasurementPath("/tools/job-application-tracker-uk"), true);
});
