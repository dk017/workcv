import crypto from "node:crypto";

import { isPublicMeasurementPath, sanitizeSameOriginPath } from "./public-paths.ts";

export { isPublicMeasurementPath, sanitizeSameOriginPath } from "./public-paths.ts";

export const publicFunnelEventNames = [
  "landing_view",
  "marketing_cta_clicked",
  "login_started",
] as const;

export type PublicFunnelEventName = (typeof publicFunnelEventNames)[number];

export type SanitizedFunnelEvent = {
  eventId: string;
  visitorId: string;
  sessionId: string;
  eventName: PublicFunnelEventName;
  path: string;
  source?: string;
  medium?: string;
  campaign?: string;
  referrerHost?: string;
  deviceClass: "mobile" | "tablet" | "desktop";
  metadata: Record<string, string | number | boolean>;
};

const publicEvents = new Set<string>(publicFunnelEventNames);
const identifierPattern = /^[a-zA-Z0-9_-]{16,100}$/;
const controlCharacterPattern = /[\u0000-\u001f\u007f]/;

function cleanString(value: unknown, limit: number) {
  if (typeof value !== "string") return undefined;
  const clean = value.trim().replace(controlCharacterPattern, "").slice(0, limit);
  return clean || undefined;
}

export function sanitizeReferrerHost(value: unknown) {
  const clean = cleanString(value, 255)?.toLowerCase();
  if (!clean) return undefined;
  const withoutPort = clean.replace(/:\d+$/, "");
  if (!/^(?:[a-z0-9](?:[a-z0-9-]{0,62})\.)+[a-z]{2,63}$/.test(withoutPort)) {
    return undefined;
  }
  return withoutPort;
}

export function normalizeTrafficSource(sourceInput?: string, referrerHostInput?: string) {
  const source = (sourceInput || "").trim().toLowerCase();
  const host = (referrerHostInput || "").trim().toLowerCase();
  const value = `${source} ${host}`;

  if (/chatgpt|openai/.test(value)) return "chatgpt";
  if (/claude|anthropic/.test(value)) return "claude";
  if (/gemini|bard\.google/.test(value)) return "gemini";
  if (/perplexity/.test(value)) return "perplexity";
  if (/copilot/.test(value)) return "copilot";
  if (/bing\.com|(^|\s)bing(\s|$)/.test(value)) return "bing";
  if (/google/.test(value)) return "google";
  if (source) return source.replace(/[^a-z0-9._-]/g, "_").slice(0, 80);
  if (host) return "referral";
  return "direct_or_unknown";
}

export function hashAnalyticsIdentifier(value: string) {
  const secret =
    process.env.ANALYTICS_HASH_SECRET ||
    process.env.AUTH_SESSION_SECRET ||
    (process.env.NODE_ENV === "production" ? "" : "dev-workcv-analytics-secret");
  if (!secret) throw new Error("ANALYTICS_HASH_SECRET or AUTH_SESSION_SECRET is required");
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function funnelEventDedupeValue(
  eventName: PublicFunnelEventName,
  eventId: string,
  sessionId: string,
) {
  return eventName === "landing_view" ? `landing_view:${sessionId}` : eventId;
}

export function sanitizeFunnelEvent(value: unknown): SanitizedFunnelEvent | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const eventId = cleanString(input.eventId, 100);
  const visitorId = cleanString(input.visitorId, 100);
  const sessionId = cleanString(input.sessionId, 100);
  const eventName = cleanString(input.eventName, 50);
  const path = sanitizeSameOriginPath(input.path);
  const deviceClass = cleanString(input.deviceClass, 20);

  if (
    !eventId ||
    !visitorId ||
    !sessionId ||
    !identifierPattern.test(eventId) ||
    !identifierPattern.test(visitorId) ||
    !identifierPattern.test(sessionId) ||
    !eventName ||
    !publicEvents.has(eventName) ||
    !path ||
    !deviceClass ||
    !["mobile", "tablet", "desktop"].includes(deviceClass)
  ) {
    return null;
  }

  if (eventName === "landing_view" && !isPublicMeasurementPath(path)) {
    return null;
  }

  const metadataInput =
    input.metadata && typeof input.metadata === "object" && !Array.isArray(input.metadata)
      ? (input.metadata as Record<string, unknown>)
      : {};
  const allowedMetadata = new Set(["destination", "placement"]);
  const metadataEntries: Array<[string, string | number | boolean]> = [];
  for (const [key, item] of Object.entries(metadataInput)) {
    if (!allowedMetadata.has(key)) continue;
    if (key === "destination") {
      const destination = sanitizeSameOriginPath(item);
      if (destination) metadataEntries.push([key, destination]);
      continue;
    }
    if (
      key === "placement" &&
      typeof item === "string" &&
      /^[a-z0-9_]{3,80}$/.test(item)
    ) {
      metadataEntries.push([key, item]);
    }
  }
  const metadata = Object.fromEntries(metadataEntries);

  return {
    eventId,
    visitorId,
    sessionId,
    eventName: eventName as PublicFunnelEventName,
    path,
    source: cleanString(input.source, 100),
    medium: cleanString(input.medium, 100),
    campaign: cleanString(input.campaign, 200),
    referrerHost: sanitizeReferrerHost(input.referrerHost),
    deviceClass: deviceClass as SanitizedFunnelEvent["deviceClass"],
    metadata,
  };
}
