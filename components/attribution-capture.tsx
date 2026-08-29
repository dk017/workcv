"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { shouldReplaceLastTouch } from "@/lib/attribution";
import { isPublicMeasurementPath } from "@/lib/public-paths";

const storageKey = "workcv_first_touch";
const lastTouchKey = "workcv_last_touch";
const visitorKey = "workcv_visitor_id";
const sessionKey = "workcv_session_id";
const landingTrackedKey = "workcv_landing_tracked";

type TouchAttribution = {
  landingPath: string;
  capturedAt?: string;
  referrerHost?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
};

type FunnelMetadata = {
  destination?: string;
  placement?: string;
};

function randomId() {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi && typeof cryptoApi.randomUUID === "function") {
    return cryptoApi.randomUUID();
  }
  if (cryptoApi) {
    const bytes = cryptoApi.getRandomValues(new Uint8Array(24));
    return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
  }
  throw new Error("Secure browser randomness is unavailable");
}

function referrerHost() {
  try {
    if (!document.referrer) return undefined;
    const host = new URL(document.referrer).hostname.toLowerCase();
    return host === window.location.hostname.toLowerCase() ? undefined : host;
  } catch {
    return undefined;
  }
}

function currentTouch(): TouchAttribution {
  const params = new URLSearchParams(window.location.search);
  return {
    landingPath: window.location.pathname,
    capturedAt: new Date().toISOString(),
    referrerHost: referrerHost(),
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
    utmTerm: params.get("utm_term") || undefined,
    utmContent: params.get("utm_content") || undefined,
  };
}

function readStoredTouch(key: string): TouchAttribution | undefined {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as TouchAttribution) : undefined;
  } catch {
    return undefined;
  }
}

function ensureTrackingContext() {
  let visitorId = window.localStorage.getItem(visitorKey);
  if (!visitorId) {
    visitorId = randomId();
    window.localStorage.setItem(visitorKey, visitorId);
  }
  let sessionId = window.sessionStorage.getItem(sessionKey);
  if (!sessionId) {
    sessionId = randomId();
    window.sessionStorage.setItem(sessionKey, sessionId);
  }

  const touch = currentTouch();
  if (!window.localStorage.getItem(storageKey)) {
    window.localStorage.setItem(storageKey, JSON.stringify(touch));
  }
  const previousLastTouch = readStoredTouch(lastTouchKey);
  if (
    shouldReplaceLastTouch(
      previousLastTouch?.capturedAt,
      Boolean(touch.utmSource || touch.referrerHost),
    )
  ) {
    window.localStorage.setItem(lastTouchKey, JSON.stringify(touch));
  }
  return { visitorId, sessionId };
}

function deviceClass() {
  if (window.innerWidth < 640) return "mobile";
  if (window.innerWidth < 1024) return "tablet";
  return "desktop";
}

export function trackFunnelEvent(
  eventName: "landing_view" | "marketing_cta_clicked" | "login_started",
  metadata: FunnelMetadata = {},
) {
  try {
    const { visitorId, sessionId } = ensureTrackingContext();
    const touch = readStoredTouch(lastTouchKey) || currentTouch();
    if (process.env.NEXT_PUBLIC_WORKCV_FUNNEL_ENABLED !== "true") return;
    void fetch("/api/events/funnel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: randomId(),
        visitorId,
        sessionId,
        eventName,
        path: window.location.pathname,
        source: touch.utmSource,
        medium: touch.utmMedium,
        campaign: touch.utmCampaign,
        referrerHost: touch.referrerHost,
        deviceClass: deviceClass(),
        metadata,
      }),
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Measurement must never interrupt the visitor journey.
  }
}

export function AttributionCapture() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      ensureTrackingContext();
      if (!isPublicMeasurementPath(pathname)) return;
      if (window.sessionStorage.getItem(landingTrackedKey)) return;
      window.sessionStorage.setItem(landingTrackedKey, "1");
      trackFunnelEvent("landing_view");
    } catch {
      // Attribution must never block the visitor journey.
    }
  }, [pathname]);

  return null;
}

export function readFirstTouchAttribution() {
  try {
    const { visitorId, sessionId } = ensureTrackingContext();
    const first = readStoredTouch(storageKey);
    const last = readStoredTouch(lastTouchKey);
    if (!first) return undefined;
    return {
      ...first,
      visitorId,
      sessionId,
      lastLandingPath: last?.landingPath,
      lastReferrerHost: last?.referrerHost,
      lastUtmSource: last?.utmSource,
      lastUtmMedium: last?.utmMedium,
      lastUtmCampaign: last?.utmCampaign,
    };
  } catch {
    return undefined;
  }
}
