import assert from "node:assert/strict";
import test from "node:test";

import {
  CV_MAX_EXPERIENCE_ITEMS,
  CvValidationError,
  parseCvData,
  repairCvData,
} from "../lib/cv-schema.ts";
import { createBlankCv } from "../lib/editor-data.ts";

test("repairs null entries and wrong legacy field types without crashing", () => {
  const repaired = repairCvData({
    ...createBlankCv(),
    fullName: null,
    skills: ["not", "a", "string"],
    experience: [null, { id: 12, role: "Engineer", company: "Acme" }],
    education: [undefined],
  });

  assert.equal(repaired.fullName, "");
  assert.equal(repaired.skills, "");
  assert.equal(repaired.experience.length, 1);
  assert.equal(repaired.experience[0].role, "Engineer");
  assert.equal(repaired.education.length, 1);
});

test("strict parsing rejects wrong types", () => {
  assert.throws(
    () => parseCvData({ ...createBlankCv(), profile: null }),
    CvValidationError,
  );
});

test("strict parsing rejects oversized fields", () => {
  assert.throws(
    () => parseCvData({ ...createBlankCv(), fullName: "x".repeat(161) }),
    CvValidationError,
  );
});

test("strict parsing rejects excessive arrays", () => {
  const base = createBlankCv();
  assert.throws(
    () =>
      parseCvData({
        ...base,
        experience: Array.from(
          { length: CV_MAX_EXPERIENCE_ITEMS + 1 },
          (_, index) => ({ ...base.experience[0], id: `exp-${index}` }),
        ),
      }),
    CvValidationError,
  );
});

test("legacy repair replaces duplicate IDs", () => {
  const base = createBlankCv();
  const repaired = repairCvData({
    ...base,
    experience: [
      { ...base.experience[0], id: "duplicate" },
      { ...base.experience[0], id: "duplicate" },
    ],
  });

  assert.notEqual(repaired.experience[0].id, repaired.experience[1].id);
});
