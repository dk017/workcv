import type {
  BrowserSignupAttribution,
  PersistedSignupAttribution,
} from "./attribution.ts";
import { sanitizeSignupAttribution } from "./attribution.ts";
import { hashAnalyticsIdentifier } from "./funnel-events.ts";

const hashPattern = /^[a-f0-9]{64}$/;

function withoutBrowserIdentifiers(
  value: BrowserSignupAttribution,
): Omit<BrowserSignupAttribution, "visitorId" | "sessionId"> {
  const { visitorId: _visitorId, sessionId: _sessionId, ...safe } = value;
  return safe;
}

export function preparePersistedSignupAttribution(
  input: unknown,
): PersistedSignupAttribution {
  const browser = sanitizeSignupAttribution(input);
  return {
    ...withoutBrowserIdentifiers(browser),
    ...(browser.visitorId
      ? { visitorHash: hashAnalyticsIdentifier(browser.visitorId) }
      : {}),
    ...(browser.sessionId
      ? { sessionHash: hashAnalyticsIdentifier(browser.sessionId) }
      : {}),
  };
}

export function sanitizePersistedSignupAttribution(
  input: unknown,
): PersistedSignupAttribution {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const source = input as Record<string, unknown>;
  const safe = withoutBrowserIdentifiers(sanitizeSignupAttribution(source));
  const visitorHash =
    typeof source.visitorHash === "string" && hashPattern.test(source.visitorHash)
      ? source.visitorHash
      : undefined;
  const sessionHash =
    typeof source.sessionHash === "string" && hashPattern.test(source.sessionHash)
      ? source.sessionHash
      : undefined;
  return {
    ...safe,
    ...(visitorHash ? { visitorHash } : {}),
    ...(sessionHash ? { sessionHash } : {}),
  };
}
