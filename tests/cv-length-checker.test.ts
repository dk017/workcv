import assert from "node:assert/strict";
import test from "node:test";

import {
  analyseCvLength,
  countCvWords,
} from "../lib/cv-length-checker.ts";

function words(count: number) {
  return Array.from({ length: count }, (_, index) => `word${index + 1}`).join(" ");
}

test("counts words while ignoring empty whitespace and bullet symbols", () => {
  assert.equal(countCvWords("  Profile\n\n- Customer service\n- CRM  "), 4);
  assert.equal(countCvWords(""), 0);
});

test("returns too short below 300 words", () => {
  const result = analyseCvLength(words(299));
  assert.equal(result.verdict, "Too short");
  assert.equal(result.differenceFromRange, 1);
  assert.equal(result.estimatedPages, 0.7);
});

test("includes both 300 and 800 words in the good range", () => {
  assert.equal(analyseCvLength(words(300)).verdict, "Good length");
  assert.equal(analyseCvLength(words(800)).verdict, "Good length");
});

test("returns too long above 800 words", () => {
  const result = analyseCvLength(words(801));
  assert.equal(result.verdict, "Too long");
  assert.equal(result.differenceFromRange, 1);
  assert.equal(result.estimatedPages, 2);
});

test("counts paragraphs, bullets and dense paragraphs", () => {
  const denseParagraph = words(81);
  const result = analyseCvLength(
    `Profile\n${denseParagraph}\n\nExperience\n- First achievement\n- Second achievement`,
  );

  assert.equal(result.paragraphs, 2);
  assert.equal(result.bulletPoints, 2);
  assert.equal(result.longParagraphs, 1);
});

