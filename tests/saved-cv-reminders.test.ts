import assert from "node:assert/strict";
import test from "node:test";

import { savedCvReminderEnabled } from "../lib/reminder-policy.ts";

test("saved CV reminders stay disabled until both safety flags are approved", () => {
  assert.equal(savedCvReminderEnabled({}), false);
  assert.equal(savedCvReminderEnabled({ SAVED_CV_REMINDER_ENABLED: "true" }), false);
  assert.equal(
    savedCvReminderEnabled({
      SAVED_CV_REMINDER_ENABLED: "true",
      SAVED_CV_REMINDER_LEGAL_APPROVED: "true",
    }),
    true,
  );
});
