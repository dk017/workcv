export const AUTH_LIMITS = {
  codeRequestsPerEmailPerHour: 5,
  codeRequestsPerIpPerHour: 20,
  failedVerificationsPerEmailPer15Minutes: 8,
  failedVerificationsPerIpPer15Minutes: 30,
  attemptsPerCode: 5,
  lockoutMinutes: 15,
} as const;

export function exceedsAuthLimit(
  kind: "request" | "verify",
  emailCount: number,
  ipCount: number,
) {
  if (kind === "request") {
    return (
      emailCount >= AUTH_LIMITS.codeRequestsPerEmailPerHour ||
      ipCount >= AUTH_LIMITS.codeRequestsPerIpPerHour
    );
  }
  return (
    emailCount >= AUTH_LIMITS.failedVerificationsPerEmailPer15Minutes ||
    ipCount >= AUTH_LIMITS.failedVerificationsPerIpPer15Minutes
  );
}
