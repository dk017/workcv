import { sanitizeSameOriginPath } from "./public-paths.ts";

const storageKey = "workcv_cta_handoff_v1";
const maxAgeMs = 30 * 60 * 1_000;
const placementPattern = /^[a-z0-9_]{3,80}$/;

type CtaHandoff = {
  placement: string;
  destination: string;
  createdAt: number;
};

export function rememberCtaHandoff(
  placement: string,
  destinationInput: string,
  now = Date.now(),
) {
  if (typeof window === "undefined" || !placementPattern.test(placement)) return;
  const destination = sanitizeSameOriginPath(destinationInput);
  if (!destination || !["/editor", "/login"].includes(destination)) return;
  const handoff: CtaHandoff = { placement, destination, createdAt: now };
  window.sessionStorage.setItem(storageKey, JSON.stringify(handoff));
}

export function readRecentCtaPlacement(destinationInput: string, now = Date.now()) {
  if (typeof window === "undefined") return undefined;
  const destination = sanitizeSameOriginPath(destinationInput);
  try {
    const raw = window.sessionStorage.getItem(storageKey);
    if (!raw) return undefined;
    const handoff = JSON.parse(raw) as Partial<CtaHandoff>;
    const valid =
      typeof handoff.placement === "string" &&
      placementPattern.test(handoff.placement) &&
      typeof handoff.destination === "string" &&
      sanitizeSameOriginPath(handoff.destination) === destination &&
      typeof handoff.createdAt === "number" &&
      now >= handoff.createdAt &&
      now - handoff.createdAt <= maxAgeMs;
    window.sessionStorage.removeItem(storageKey);
    return valid ? handoff.placement : undefined;
  } catch {
    window.sessionStorage.removeItem(storageKey);
    return undefined;
  }
}
