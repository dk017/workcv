export type SignupAttribution = {
  landingPath?: string;
  referrer?: string;
  referrerHost?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  visitorId?: string;
  sessionId?: string;
  lastLandingPath?: string;
  lastReferrerHost?: string;
  lastUtmSource?: string;
  lastUtmMedium?: string;
  lastUtmCampaign?: string;
};

const limits: Record<keyof SignupAttribution, number> = {
  landingPath: 500,
  referrer: 1_000,
  referrerHost: 255,
  utmSource: 100,
  utmMedium: 100,
  utmCampaign: 200,
  utmTerm: 200,
  utmContent: 200,
  visitorId: 100,
  sessionId: 100,
  lastLandingPath: 500,
  lastReferrerHost: 255,
  lastUtmSource: 100,
  lastUtmMedium: 100,
  lastUtmCampaign: 200,
};

export function shouldReplaceLastTouch(
  previousCapturedAt: string | undefined,
  hasNonDirectTouch: boolean,
  now = Date.now(),
) {
  if (hasNonDirectTouch || !previousCapturedAt) return true;
  const capturedAt = Date.parse(previousCapturedAt);
  if (!Number.isFinite(capturedAt)) return true;
  return now - capturedAt > 30 * 24 * 60 * 60 * 1000;
}

export function sanitizeSignupAttribution(value: unknown): SignupAttribution {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const source = value as Record<string, unknown>;
  const result: SignupAttribution = {};
  for (const key of Object.keys(limits) as Array<keyof SignupAttribution>) {
    const raw = source[key];
    if (typeof raw !== "string") continue;
    const clean = raw.trim().replace(/[\u0000-\u001f\u007f]/g, "").slice(0, limits[key]);
    if (clean) result[key] = clean;
  }

  if (result.landingPath && !result.landingPath.startsWith("/")) {
    delete result.landingPath;
  }
  if (result.lastLandingPath && !result.lastLandingPath.startsWith("/")) {
    delete result.lastLandingPath;
  }
  if (result.referrer) {
    try {
      const url = new URL(result.referrer);
      if (url.protocol !== "http:" && url.protocol !== "https:") delete result.referrer;
    } catch {
      delete result.referrer;
    }
  }
  const identifierPattern = /^[a-zA-Z0-9_-]{16,100}$/;
  if (result.visitorId && !identifierPattern.test(result.visitorId)) {
    delete result.visitorId;
  }
  if (result.sessionId && !identifierPattern.test(result.sessionId)) {
    delete result.sessionId;
  }
  const hostnamePattern = /^(?:[a-z0-9](?:[a-z0-9-]{0,62})\.)+[a-z]{2,63}$/i;
  if (result.referrerHost && !hostnamePattern.test(result.referrerHost)) {
    delete result.referrerHost;
  }
  if (result.lastReferrerHost && !hostnamePattern.test(result.lastReferrerHost)) {
    delete result.lastReferrerHost;
  }
  return result;
}
