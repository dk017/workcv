import { consumeToolRateLimit, type RateLimitResult } from "./tool-rate-limit.ts";
import { hashAnalyticsIdentifier } from "./funnel-events.ts";

const windowMs = 60_000;
const sessionLimit = 30;
const addressLimit = 120;

function clientAddress(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    headers.get("cf-connecting-ip")?.trim() ||
    headers.get("x-real-ip")?.trim() ||
    forwarded ||
    "unknown"
  ).slice(0, 128);
}

export type FunnelRateLimitResult = RateLimitResult & {
  scope: "session" | "address";
};

export function consumeFunnelRateLimit(
  headers: Headers,
  sessionHash: string,
  now = Date.now(),
): FunnelRateLimitResult {
  const addressHash = hashAnalyticsIdentifier(`funnel-rate:${clientAddress(headers)}`);
  const address = consumeToolRateLimit(`funnel-address:${addressHash}`, {
    limit: addressLimit,
    windowMs,
    now,
  });
  if (!address.allowed) return { ...address, scope: "address" };

  const session = consumeToolRateLimit(`funnel-session:${sessionHash}`, {
    limit: sessionLimit,
    windowMs,
    now,
  });
  return { ...session, scope: "session" };
}

export function funnelRateLimitHeaders(result: FunnelRateLimitResult) {
  return {
    "Cache-Control": "no-store",
    "Retry-After": String(result.retryAfterSeconds),
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1_000)),
  };
}
