import assert from "node:assert/strict";
import test from "node:test";

import mammoth from "mammoth";

import { cvDownloadFilename, renderCvDocx } from "../lib/cv-docx.ts";
import { createBlankCv, sampleCv, type CvData } from "../lib/editor-data.ts";

async function docxText(cv: CvData) {
  const buffer = await renderCvDocx(cv);
  assert.equal(buffer.subarray(0, 2).toString("latin1"), "PK", "DOCX must be a zip package");
  return (await mammoth.extractRawText({ buffer })).value;
}

test("exports every filled section of the saved CV", async () => {
  const text = await docxText(sampleCv);
  for (const expected of [
    sampleCv.fullName,
    sampleCv.targetRole,
    sampleCv.email,
    sampleCv.experience[0].role,
    sampleCv.experience[0].company,
    sampleCv.education[0].qualification,
    sampleCv.skills.split("\n")[0],
    "PROFILE",
    "EXPERIENCE",
    "EDUCATION",
    "SKILLS",
  ]) {
    assert.ok(text.includes(expected), `missing ${expected}`);
  }
});

test("follows the saved section order", async () => {
  const text = await docxText({ ...sampleCv, layoutPreset: "education-first" });
  assert.ok(text.indexOf("EDUCATION") < text.indexOf("EXPERIENCE"));
  const standard = await docxText(sampleCv);
  assert.ok(standard.indexOf("EXPERIENCE") < standard.indexOf("EDUCATION"));
});

test("includes filled additional sections and skips empty ones", async () => {
  const text = await docxText({
    ...sampleCv,
    additionalSections: { certifications: "First Aid at Work", languages: "  " },
  });
  assert.ok(text.includes("CERTIFICATIONS"));
  assert.ok(text.includes("First Aid at Work"));
  assert.ok(!text.includes("LANGUAGES"));
});

test("omits editor placeholders and empty entries", async () => {
  const text = await docxText({ ...createBlankCv(), fullName: "Sam Patel" });
  assert.ok(text.includes("Sam Patel"));
  for (const heading of ["EXPERIENCE", "EDUCATION", "PROFILE", "SKILLS"]) {
    assert.ok(!text.includes(heading), `unexpected ${heading}`);
  }
});

test("strips characters that would corrupt the Word file", async () => {
  const text = await docxText({ ...sampleCv, profile: "Clear\u0000 profile\u000B text" });
  assert.ok(text.includes("Clear profile text"));
});

test("builds safe download filenames", () => {
  assert.equal(cvDownloadFilename("Emily O'Neil", "docx"), "emily-o-neil-cv.docx");
  assert.equal(cvDownloadFilename("", "pdf"), "workcv-cv.pdf");
});
