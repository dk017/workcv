import assert from "node:assert/strict";
import test from "node:test";
import { analyseCvKeywordDensity, analyseCvReadability, cvWords } from "../lib/cv-text-analysis.ts";

test("tokenises common CV terms and technical skills", () => {
  assert.deepEqual(cvWords("Built APIs with C++, C# and .NET."), ["Built", "APIs", "with", "C++", "C#", "and", ".NET"]);
});

test("calculates readability and flags long or passive sentences", () => {
  const text = "Customer complaints were resolved within agreed timescales. " + Array.from({ length: 28 }, (_, index) => `word${index}`).join(" ") + ". Clear records supported the team.";
  const result = analyseCvReadability(text);
  assert.equal(result.sentenceCount, 3);
  assert.equal(result.longSentenceCount, 1);
  assert.equal(result.passiveSentenceCount, 1);
  assert.ok(result.fleschReadingEase >= 0 && result.fleschReadingEase <= 100);
});

test("handles empty readability input safely", () => {
  const result = analyseCvReadability("");
  assert.equal(result.wordCount, 0);
  assert.equal(result.sentenceCount, 0);
  assert.equal(result.fleschReadingEase, 0);
});

test("returns repeated terms, phrases and vague wording", () => {
  const result = analyseCvKeywordDensity("Managed customer service cases. Improved customer service records. Responsible for various tasks in customer service.");
  assert.deepEqual(
    result.repeatedTerms.slice(0, 2).map((item) => item.term).sort(),
    ["customer", "service"],
  );
  assert.ok(result.repeatedPhrases.some((item) => item.term === "customer service" && item.count === 3));
  assert.deepEqual(result.overusedPhrases, ["responsible for", "various tasks"]);
});
