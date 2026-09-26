import assert from "node:assert/strict";
import test from "node:test";

import mammoth from "mammoth";

import {
  coverLetterChecks,
  coverLetterGreeting,
  coverLetterPlainText,
  coverLetterSignOff,
  coverLetterSubject,
  createCoverLetter,
  formatUkLetterDate,
  hasCoverLetterContent,
  splitLetterText,
} from "../lib/cover-letter-document.ts";
import { renderCoverLetterDocx } from "../lib/cover-letter-docx.ts";
import { parseCvData, repairCvData } from "../lib/cv-schema.ts";
import { sampleCv, type CoverLetter, type CvData } from "../lib/editor-data.ts";

function withLetter(patch: Partial<CoverLetter>): CvData {
  return { ...sampleCv, coverLetter: { ...createCoverLetter(sampleCv), employer: "Birch Office Services", ...patch } };
}

const body = [
  "I am applying for the Customer Service Assistant role at Birch Office Services, advertised on Indeed.",
  "At North Street Books I handle customer queries in person and by phone and resolve most of them myself.",
  "I also keep till and stock records accurate during busy periods.",
  "Thank you for considering my application. I am available for interview at short notice.",
];

test("named reader gets 'Yours sincerely'; unnamed reader gets 'Yours faithfully'", () => {
  const named = withLetter({ recipientName: "Ms Shah" }).coverLetter!;
  assert.equal(coverLetterGreeting(named), "Dear Ms Shah,");
  assert.equal(coverLetterSignOff(named), "Yours sincerely,");

  const unnamed = withLetter({ recipientName: " " }).coverLetter!;
  assert.equal(coverLetterGreeting(unnamed), "Dear Hiring Manager,");
  assert.equal(coverLetterSignOff(unnamed), "Yours faithfully,");
  assert.equal(coverLetterGreeting({ ...unnamed, greeting: "sir-madam" }), "Dear Sir or Madam,");
});

test("new letters start from the CV's target role with four guided paragraphs", () => {
  const letter = createCoverLetter({ ...sampleCv, targeting: { role: "Office Administrator", jobDescription: "", priorities: [] } });
  assert.equal(letter.jobTitle, "Office Administrator");
  assert.equal(letter.paragraphs.length, 4);
  assert.equal(letter.includeDate, true);
  assert.equal(hasCoverLetterContent({ ...sampleCv, coverLetter: letter }), false);
});

test("subject line and UK date format", () => {
  assert.equal(coverLetterSubject(withLetter({ jobTitle: "Receptionist", reference: "R-12" }).coverLetter!), "Re: Receptionist (ref. R-12)");
  assert.equal(coverLetterSubject(withLetter({ jobTitle: "" }).coverLetter!), "");
  assert.equal(formatUkLetterDate(new Date("2026-09-26T12:00:00Z")), "26 September 2026");
});

test("checks flag leftover prompts and a missing employer name", () => {
  const cv = withLetter({ paragraphs: ["I am applying to [employer] for this role."] });
  const messages = coverLetterChecks(cv).map((check) => check.message).join(" ");
  assert.match(messages, /bracketed/);
  assert.match(messages, /Birch Office Services/);

  const complete = withLetter({ jobTitle: "Customer Service Assistant", paragraphs: body });
  assert.equal(coverLetterChecks(complete).filter((check) => check.severity === "fix").length, 0);
});

test("plain-text copy is ready to paste into a form or email", () => {
  const text = coverLetterPlainText(withLetter({ recipientName: "Ms Shah", paragraphs: body }));
  assert.ok(text.startsWith("Dear Ms Shah,\n\nI am applying"));
  assert.ok(text.endsWith(`Yours sincerely,\n${sampleCv.fullName}`));
  assert.ok(!text.includes(sampleCv.email), "the address block is left out of pasted text");
});

test("application-pack letters split into body paragraphs only", () => {
  const paragraphs = splitLetterText(`Dear Sir or Madam,\n\nFirst paragraph\ncontinues here.\n\nSecond paragraph.\n\nYours faithfully,\n${sampleCv.fullName}`, sampleCv.fullName);
  assert.deepEqual(paragraphs, ["First paragraph continues here.", "Second paragraph."]);
});

test("schema accepts a valid letter, rejects unknown keys and repair drops invalid letters", () => {
  const valid = withLetter({ paragraphs: body });
  assert.deepEqual(parseCvData(valid).coverLetter, valid.coverLetter);
  assert.throws(() => parseCvData({ ...valid, coverLetter: { ...valid.coverLetter, extra: true } }));
  assert.throws(() => parseCvData({ ...valid, coverLetter: { ...valid.coverLetter, paragraphs: Array(7).fill("x") } }));
  const repaired = repairCvData({ ...valid, coverLetter: { paragraphs: "not an array" } });
  assert.equal(repaired.coverLetter, undefined);
  assert.equal(repaired.fullName, sampleCv.fullName);
});

test("Word letter shares the CV header and contains the letter", async () => {
  const buffer = await renderCoverLetterDocx(
    withLetter({ jobTitle: "Customer Service Assistant", reference: "CS-14", recipientName: "Ms Shah", employerAddress: "1 High Street\nLeeds", paragraphs: body }),
    new Date("2026-09-26T12:00:00Z"),
  );
  const { value } = await mammoth.extractRawText({ buffer });
  for (const expected of [
    sampleCv.fullName,
    sampleCv.email,
    "26 September 2026",
    "Ms Shah",
    "1 High Street",
    "Re: Customer Service Assistant (ref. CS-14)",
    "Dear Ms Shah,",
    body[1],
    "Yours sincerely,",
  ]) {
    assert.ok(value.includes(expected), `missing ${expected}`);
  }
  assert.ok(value.indexOf("Dear Ms Shah,") < value.indexOf(body[0]));
});

test("date can be switched off", async () => {
  const buffer = await renderCoverLetterDocx(withLetter({ includeDate: false, paragraphs: body }), new Date("2026-09-26T12:00:00Z"));
  const { value } = await mammoth.extractRawText({ buffer });
  assert.ok(!value.includes("26 September 2026"));
});
