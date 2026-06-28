import assert from "node:assert/strict";
import test from "node:test";

import {
  getSalaryRole,
  salaryRoles,
  searchSalaryRoles,
} from "../lib/uk-salary-data.ts";

test("contains exactly 60 searchable roles", () => {
  assert.equal(salaryRoles.length, 60);
});

test("has unique slugs and unique ONS occupation codes", () => {
  const slugs = salaryRoles.map((role) => role.slug);
  const onsCodes = salaryRoles
    .filter((role) => role.sourceKind === "ons-ashe")
    .map((role) => role.socCode);

  assert.equal(new Set(slugs).size, slugs.length);
  assert.equal(new Set(onsCodes).size, onsCodes.length);
});

test("all salary ranges are ordered and contain positive whole pounds", () => {
  for (const role of salaryRoles) {
    assert.ok(role.low > 0, role.title);
    assert.ok(role.low <= role.median, role.title);
    assert.ok(role.median <= role.high, role.title);
    assert.equal(Number.isInteger(role.low), true, role.title);
    assert.equal(Number.isInteger(role.median), true, role.title);
    assert.equal(Number.isInteger(role.high), true, role.title);
    assert.ok(role.aliases.length > 0, role.title);
  }
});

test("maps common alternative titles to the intended occupation", () => {
  assert.equal(searchSalaryRoles("software developer", 1)[0]?.slug, "software-engineer");
  assert.equal(searchSalaryRoles("support worker", 1)[0]?.slug, "care-worker");
  assert.equal(searchSalaryRoles("lorry driver", 1)[0]?.slug, "hgv-driver");
  assert.equal(searchSalaryRoles("graduate", 1)[0]?.slug, "graduate-scheme");
});

test("returns multiple useful choices for broad searches", () => {
  const teacherResults = searchSalaryRoles("teacher", 8).map((role) => role.slug);
  assert.ok(teacherResults.includes("primary-school-teacher"));
  assert.ok(teacherResults.includes("secondary-school-teacher"));
});

test("preserves published ONS values for representative roles", () => {
  assert.deepEqual(
    getSalaryRole("software-engineer") &&
      (({ low, median, high, socCode }) => ({ low, median, high, socCode }))(
        getSalaryRole("software-engineer")!,
      ),
    { low: 42289, median: 56914, high: 75794, socCode: "2134" },
  );
  assert.deepEqual(
    getSalaryRole("warehouse-operative") &&
      (({ low, median, high, socCode }) => ({ low, median, high, socCode }))(
        getSalaryRole("warehouse-operative")!,
      ),
    { low: 24447, median: 27832, high: 33151, socCode: "9252" },
  );
});

