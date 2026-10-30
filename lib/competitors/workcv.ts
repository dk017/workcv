import { site } from "../site.ts";
import type { AlternativeOption, PlanOption } from "./types.ts";

export const comparisonCheckedDate = "30 October 2026";
export const comparisonCheckedIso = "2026-10-30";
export const comparisonPublishedIso = "2026-10-30";

/** WorkCV facts used in every comparison row. Keep in step with /pricing and /refund-policy. */
export const workcvFacts = {
  headline: `${site.price} once for one saved CV`,
  billing: "One-time payment. No subscription and no automatic renewal.",
  free: "Build and preview the whole CV free. The PDF download is the paid step.",
  formats: "PDF. A separate free Word (.docx) CV template is available without sign-up.",
  coverLetters:
    "Not in the CV editor. A free cover letter template and generator are separate tools on the site.",
  ai: "No AI writing. AI is only used to read an existing CV you choose to import.",
  ats: "No score inside the editor. A free ATS keyword checker is a separate tool.",
  design: "Three single-column UK layouts (Classic, Modern, Compact).",
  afterPaying: "The paid CV stays unlocked: edit and redownload it without paying again.",
  bestFor: "One finished UK CV without another subscription.",
} as const;

export const workcvRowLabels = [
  ["What you pay", "headline"],
  ["How billing works", "billing"],
  ["Free option", "free"],
  ["Download formats", "formats"],
  ["Cover letters", "coverLetters"],
  ["AI writing help", "ai"],
  ["CV or ATS checking", "ats"],
  ["Templates and design", "design"],
  ["After you stop paying", "afterPaying"],
  ["Best for", "bestFor"],
] as const;

/** Time horizons used for the "what it costs if you need it for longer" table. */
export const costHorizons = [
  { label: "2 weeks, then cancel", days: 14 },
  { label: "1 month (4 weeks)", days: 28 },
  { label: "3 months (13 weeks)", days: 91 },
  { label: "1 year (52 weeks)", days: 364 },
] as const;

export function planCost(plan: PlanOption, days: number) {
  if (plan.first) {
    const remaining = Math.max(0, days - plan.first.days);
    return plan.first.price + Math.ceil(remaining / plan.days) * plan.price;
  }
  return Math.ceil(days / plan.days) * plan.price;
}

/** Cheapest listed plan that covers `days` of access. */
export function cheapestPlan(plans: PlanOption[], days: number) {
  return plans
    .map((plan) => ({ plan, cost: Math.round(planCost(plan, days) * 100) / 100 }))
    .sort((a, b) => a.cost - b.cost)[0];
}

export const gbp = (value: number) =>
  value.toLocaleString("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2 });

/* Shared alternative options. Each alternatives page picks the ones that fit its brand. */
export const workcvOption = (vsPath: string, why: string): AlternativeOption => ({
  name: "WorkCV",
  bestFor: "One finished UK CV without a subscription",
  price: `${site.price} once per saved CV`,
  why,
  tradeOff: "No cover letters, AI writing or ATS score inside the editor; PDF download only.",
  href: vsPath,
});

export const blankTemplateOption: AlternativeOption = {
  name: "WorkCV free Word CV template",
  bestFor: "Writing the CV yourself in Word or Google Docs",
  price: "Free .docx download, no sign-up",
  why: "A single-column UK CV template you edit in your own word processor, so there is no account or payment at all.",
  tradeOff: "No guided editor or preview; you handle layout and PDF export yourself.",
  href: "/tools/blank-cv-template-uk",
  cta: "Get the free Word CV template",
};

export const barclaysOption: AlternativeOption = {
  name: "Barclays LifeSkills CV builder",
  bestFor: "A free guided CV with a Word download",
  price: "Free (free LifeSkills account)",
  why: "A free step-by-step builder from Barclays' employability programme that exports your CV as a Word document you can keep editing.",
  tradeOff: "Basic design, and you need a LifeSkills account; aimed at school leavers and early-career job seekers as well as adults.",
  href: "https://barclayslifeskills.com/i-want-help-applying-for-jobs/school/cv-builder/",
  external: true,
};
