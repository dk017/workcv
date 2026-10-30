// WORKCV_TEST_USER_IDS is a server-only, comma-separated list of operator
// accounts. Each entry is either an internal user ID or a sign-in email
// address (matched case-insensitively). Orders from these accounts are
// flagged as tests and excluded from revenue reports.
export function testUserAllowlist(environment: Record<string, string | undefined> = process.env) {
  const entries = (environment.WORKCV_TEST_USER_IDS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return {
    ids: entries.filter((value) => !value.includes("@")),
    emails: entries.filter((value) => value.includes("@")).map((value) => value.toLowerCase()),
  };
}

export function isApprovedTestUser(
  user: { id: string; email?: string | null },
  environment: Record<string, string | undefined> = process.env,
) {
  const { ids, emails } = testUserAllowlist(environment);
  return ids.includes(user.id) || Boolean(user.email && emails.includes(user.email.trim().toLowerCase()));
}
