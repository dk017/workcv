export const checkoutPlanIntentKey = "workcv-plan-intent";
type Plan = "cv" | "pass";
type IntentStorage = Pick<Storage, "getItem" | "setItem">;
// Explicit links win, including when browser storage is blocked.
export function readCheckoutPlanIntent(search: string, storage?: IntentStorage): Plan {
  const requested = new URLSearchParams(search).get("plan");
  if (requested === "cv" || requested === "pass") {
    try { storage?.setItem(checkoutPlanIntentKey, requested); } catch { /* Optional persistence. */ }
    return requested;
  }
  try { if (storage?.getItem(checkoutPlanIntentKey) === "pass") return "pass"; } catch { /* Optional persistence. */ }
  return "cv";
}
