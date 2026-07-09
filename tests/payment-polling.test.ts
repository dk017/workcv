import assert from "node:assert/strict";
import test from "node:test";

import { pollPaymentStatus } from "../lib/payment-polling.ts";

test("payment polling unlocks after a delayed webhook", async () => {
  let attempts = 0;
  const states: string[] = [];
  const result = await pollPaymentStatus(
    async () => {
      attempts += 1;
      return { paid: attempts === 3 };
    },
    {
      maxDurationMs: 100,
      delaysMs: [10],
      sleep: async () => {},
      onPending: () => states.push("pending"),
    },
  );

  assert.equal(result, "paid");
  assert.equal(attempts, 3);
  assert.deepEqual(states, ["pending", "pending"]);
});

test("payment polling ends in pending after its bounded window", async () => {
  let attempts = 0;
  const result = await pollPaymentStatus(
    async () => {
      attempts += 1;
      return { paid: false };
    },
    { maxDurationMs: 25, delaysMs: [10], sleep: async () => {} },
  );

  assert.equal(result, "pending");
  assert.equal(attempts, 4);
});

test("payment polling resolves failed and cancelled states", async () => {
  assert.equal(
    await pollPaymentStatus(async () => ({ paid: false, status: "failed" })),
    "failed",
  );
  assert.equal(
    await pollPaymentStatus(async () => ({ paid: false, status: "cancelled" })),
    "cancelled",
  );
});
