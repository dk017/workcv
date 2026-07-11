"use client";

import { useEffect } from "react";

const storageKey = "workcv_first_touch";

export function AttributionCapture() {
  useEffect(() => {
    try {
      if (window.localStorage.getItem(storageKey)) return;
      const params = new URLSearchParams(window.location.search);
      const attribution = {
        landingPath: window.location.pathname,
        referrer: document.referrer || undefined,
        utmSource: params.get("utm_source") || undefined,
        utmMedium: params.get("utm_medium") || undefined,
        utmCampaign: params.get("utm_campaign") || undefined,
        utmTerm: params.get("utm_term") || undefined,
        utmContent: params.get("utm_content") || undefined,
      };
      window.localStorage.setItem(storageKey, JSON.stringify(attribution));
    } catch {
      // Attribution must never block the visitor journey.
    }
  }, []);

  return null;
}

export function readFirstTouchAttribution() {
  try {
    const value = window.localStorage.getItem(storageKey);
    return value ? JSON.parse(value) : undefined;
  } catch {
    return undefined;
  }
}
