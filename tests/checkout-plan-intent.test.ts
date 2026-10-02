import assert from "node:assert/strict";
import test from "node:test";
import { readCheckoutPlanIntent, checkoutPlanIntentKey } from "../lib/checkout-plan-intent.ts";
test("explicit plans survive blocked storage and single-CV choice overrides remembered Pass", () => {
  const blocked = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); } };
  assert.equal(readCheckoutPlanIntent("?plan=pass", blocked), "pass");
  assert.equal(readCheckoutPlanIntent("?plan=cv", blocked), "cv");
  assert.equal(readCheckoutPlanIntent("", blocked), "cv");
  let value = "pass";
  const storage = { getItem: () => value, setItem(key: string, next: string) { assert.equal(key, checkoutPlanIntentKey); value = next; } };
  assert.equal(readCheckoutPlanIntent("", storage), "pass");
  assert.equal(readCheckoutPlanIntent("?plan=cv", storage), "cv");
  assert.equal(value, "cv");
  assert.equal(readCheckoutPlanIntent("?plan=anything", storage), "cv");
  assert.equal(readCheckoutPlanIntent("?plan=pass"), "pass");
});
