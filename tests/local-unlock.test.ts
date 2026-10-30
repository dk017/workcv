import assert from "node:assert/strict";
import test from "node:test";

import { localUnlockEnabled } from "../lib/local-unlock.ts";

test("free local downloads only work in development, and only when switched on", () => {
  assert.equal(localUnlockEnabled({ NODE_ENV: "development", WORKCV_LOCAL_UNLOCK: "1" }), true);
  assert.equal(localUnlockEnabled({ NODE_ENV: "development" }), false);
  assert.equal(localUnlockEnabled({ NODE_ENV: "development", WORKCV_LOCAL_UNLOCK: "true" }), false);
  // A production build never unlocks, even if the variable leaks into its environment.
  assert.equal(localUnlockEnabled({ NODE_ENV: "production", WORKCV_LOCAL_UNLOCK: "1" }), false);
});
