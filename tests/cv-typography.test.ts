import assert from "node:assert/strict";
import test from "node:test";

import { getCvNameTypography } from "../lib/cv-typography.ts";

test("modern names shrink to fit the sidebar without splitting ordinary words", () => {
  const shortName = getCvNameTypography("Alex Morgan", "modern");
  const longerName = getCvNameTypography("Dhineshkumar R", "modern");

  assert.equal(shortName.previewPx, 28);
  assert.ok(longerName.previewPx < shortName.previewPx);
  assert.equal(longerName.emergencyBreak, false);
});

test("extreme unbroken names retain an emergency overflow fallback", () => {
  const typography = getCvNameTypography("ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMN", "modern");

  assert.equal(typography.previewPx, 21);
  assert.equal(typography.emergencyBreak, true);
});

test("classic and compact templates use print-aligned maximum name sizes", () => {
  assert.deepEqual(getCvNameTypography("Alex Morgan", "classic"), {
    previewPx: 38,
    printPt: 28,
    emergencyBreak: false,
  });
  assert.deepEqual(getCvNameTypography("Alex Morgan", "compact"), {
    previewPx: 27,
    printPt: 20,
    emergencyBreak: false,
  });
});
