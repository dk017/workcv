// No development fallback: a signed-in customer is never implicitly an admin.
export function isAnalyticsAdminEmail(email: string | null | undefined, configured = process.env.ANALYTICS_ADMIN_EMAILS || "") {
  if (!email) return false;
  return configured.split(",").map(value => value.trim().toLowerCase()).filter(Boolean).includes(email.trim().toLowerCase());
}

export const analyticsRanges = ["24h", "7d", "30d"] as const;
export type AnalyticsRange = typeof analyticsRanges[number];
export const analyticsViews = ["overview", "live", "acquisition", "conversion", "checkout", "pass", "activity"] as const;
export type AnalyticsView = typeof analyticsViews[number];
export function parseAnalyticsRange(value: unknown): AnalyticsRange {
  return analyticsRanges.includes(value as AnalyticsRange) ? value as AnalyticsRange : "7d";
}
export function parseAnalyticsView(value: unknown): AnalyticsView {
  return analyticsViews.includes(value as AnalyticsView) ? value as AnalyticsView : "overview";
}
