import assert from "node:assert/strict";
import test from "node:test";

import { calculateCvReadiness } from "../lib/cv-readiness.ts";
import { createBlankCv } from "../lib/editor-data.ts";

test("blank CV is not download ready", () => {
  const result = calculateCvReadiness(createBlankCv());
  assert.equal(result.ready, false);
  assert.equal(result.nextSection, "profile");
});

test("minimum valid CV is ready with education instead of experience", () => {
  const cv = createBlankCv();
  cv.fullName = "Alex Morgan";
  cv.email = "alex@example.co.uk";
  cv.profile =
    "Reliable graduate with strong analytical skills and clear written communication.";
  cv.skills = "Analysis\nWriting\nTeamwork";
  cv.education[0] = {
    ...cv.education[0],
    qualification: "BA History",
    institution: "University of York",
    start: "2022",
  };

  assert.equal(calculateCvReadiness(cv).ready, true);
});

test("partially populated entries block readiness", () => {
  const cv = createBlankCv();
  cv.fullName = "Alex Morgan";
  cv.phone = "07123456789";
  cv.profile =
    "Reliable candidate with practical experience and clear communication skills.";
  cv.skills = "Service\nOrganisation\nTeamwork";
  cv.experience[0].role = "Assistant";

  const result = calculateCvReadiness(cv);
  assert.equal(result.ready, false);
  assert.ok(result.issues.some((issue) => issue.section === "experience"));
});
