import assert from "node:assert/strict";
import test from "node:test";

import { analyticsPlacements } from "../lib/analytics-placements.ts";
import { underTenCvBuilderAnswer } from "../lib/price-copy.ts";
import { isApprovedTestUser } from "../lib/test-orders.ts";

test("commercial CTA placements are stable and unique", () => {
  const values = Object.values(analyticsPlacements);
  assert.equal(new Set(values).size, values.length);
  for (const value of values) assert.match(value, /^[a-z0-9_]{3,80}$/);
});

test("price answer remains truthful on both sides of the £10 boundary", () => {
  assert.match(underTenCvBuilderAnswer(9.99, "£9.99"), /^Yes\./);
  assert.match(underTenCvBuilderAnswer(10, "£10.00"), /^No\./);
  assert.match(underTenCvBuilderAnswer(12, "£12.00"), /£12\.00/);
});

test("test-order classification comes only from the server allowlist", () => {
  const environment = { WORKCV_TEST_USER_IDS: "operator-1, operator-2" };
  assert.equal(isApprovedTestUser("operator-2", environment), true);
  assert.equal(isApprovedTestUser("customer-1", environment), false);
});
