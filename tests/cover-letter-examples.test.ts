import assert from "node:assert/strict";
import test from "node:test";

import { coverLetterExamples, exampleWordCount } from "../lib/cover-letter-examples.ts";

test("examples follow the UK sign-off rule", () => {
  for (const example of coverLetterExamples) {
    const named = /^Dear (Mr|Mrs|Ms|Miss|Dr) /.test(example.greeting);
    assert.equal(example.signOff, named ? "Yours sincerely," : "Yours faithfully,", example.slug);
  }
});

test("examples are complete, one-page letters without placeholders", () => {
  const slugs = new Set<string>();
  for (const example of coverLetterExamples) {
    assert.ok(!slugs.has(example.slug), `duplicate slug ${example.slug}`);
    slugs.add(example.slug);
    assert.ok(example.paragraphs.length >= 3 && example.paragraphs.length <= 5, example.slug);
    const words = exampleWordCount(example);
    assert.ok(words >= 120 && words <= 400, `${example.slug}: ${words} words`);
    assert.ok(!/\[[^\]]+\]/.test(example.paragraphs.join(" ")), `${example.slug} has a placeholder`);
    assert.ok(example.whyItWorks.length >= 2, example.slug);
  }
  assert.equal(coverLetterExamples.length, 10);
});
