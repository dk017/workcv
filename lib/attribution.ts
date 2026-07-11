export type SignupAttribution = {
  landingPath?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
};

const limits: Record<keyof SignupAttribution, number> = {
  landingPath: 500,
  referrer: 1_000,
  utmSource: 100,
  utmMedium: 100,
  utmCampaign: 200,
  utmTerm: 200,
  utmContent: 200,
};

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
  if (result.referrer) {
    try {
      const url = new URL(result.referrer);
      if (url.protocol !== "http:" && url.protocol !== "https:") delete result.referrer;
    } catch {
      delete result.referrer;
    }
  }
  return result;
}
