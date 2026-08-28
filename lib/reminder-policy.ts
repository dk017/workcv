export function savedCvReminderEnabled(
  environment: Record<string, string | undefined> = process.env,
) {
  return (
    environment.SAVED_CV_REMINDER_ENABLED === "true" &&
    environment.SAVED_CV_REMINDER_LEGAL_APPROVED === "true"
  );
}
