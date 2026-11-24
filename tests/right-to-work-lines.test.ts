import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { rightToWorkSituations } from "../lib/right-to-work-lines.ts";

test("right to work lines are short and never ask for private document details", () => {
  assert.equal(new Set(rightToWorkSituations.map((item) => item.id)).size, rightToWorkSituations.length);
  for (const item of rightToWorkSituations) {
    assert.ok(item.line.length <= 100, item.id);
    assert.doesNotMatch(item.line, /share code|passport|BRP|National Insurance/i, item.id);
  }
  assert.equal(rightToWorkSituations.filter((item) => item.needsSponsor).length, 1);
});

test("the right to work guide's picker and wording table use the same lines", () => {
  const page = readFileSync(new URL("../app/right-to-work-cv-uk/page.tsx", import.meta.url), "utf8");
  assert.match(page, /<RightToWorkLinePicker \/>/);
  assert.match(page, /const wordingExamples = rightToWorkSituations\.map/);
});
