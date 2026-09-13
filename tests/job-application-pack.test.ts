import assert from "node:assert/strict";
import test from "node:test";

import { jobApplicationPackInputSchema } from "../lib/job-application-pack.ts";

const baseInput = {
  fullName: "Amira Khan",
  targetRole: "Customer Service Team Leader",
  jobDescription: "Lead the customer service team, coach colleagues and improve service quality. ".repeat(4),
  cvText: "Led customer service advisers, coached new starters, reviewed service reports and improved complaint handling through a clear triage process. ".repeat(5),
};

test("the application pack accepts omitted or blank optional motivation", () => {
  const omitted = jobApplicationPackInputSchema.safeParse(baseInput);
  assert.equal(omitted.success, true);
  if (omitted.success) assert.equal(omitted.data.motivation, "");

  const blank = jobApplicationPackInputSchema.safeParse({ ...baseInput, motivation: "   " });
  assert.equal(blank.success, true);
  if (blank.success) assert.equal(blank.data.motivation, "");
});
