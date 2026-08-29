export function isApprovedTestUser(
  userId: string,
  environment: Record<string, string | undefined> = process.env,
) {
  const configured = environment.WORKCV_TEST_USER_IDS || "";
  return configured
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .includes(userId);
}
