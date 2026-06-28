type RateLimitRecord = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  limit: number;
  windowMs: number;
  now?: number;
};

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

const records = new Map<string, RateLimitRecord>();
const maxRecords = 5_000;

function removeExpired(now: number) {
  records.forEach((record, key) => {
    if (record.resetAt <= now) records.delete(key);
  });
}

export function consumeToolRateLimit(
  key: string,
  { limit, windowMs, now = Date.now() }: RateLimitOptions,
): RateLimitResult {
  if (records.size >= maxRecords) removeExpired(now);
  if (records.size >= maxRecords) {
    const oldestKey = records.keys().next().value as string | undefined;
    if (oldestKey) records.delete(oldestKey);
  }

  const existing = records.get(key);
  const record =
    existing && existing.resetAt > now
      ? existing
      : { count: 0, resetAt: now + windowMs };

  const allowed = record.count < limit;
  if (allowed) record.count += 1;
  records.set(key, record);

  return {
    allowed,
    limit,
    remaining: Math.max(0, limit - record.count),
    resetAt: record.resetAt,
    retryAfterSeconds: Math.max(1, Math.ceil((record.resetAt - now) / 1_000)),
  };
}

export function clearToolRateLimitsForTests() {
  records.clear();
}
