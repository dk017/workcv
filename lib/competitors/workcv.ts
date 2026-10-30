import { site } from "../site.ts";
import type { AlternativeOption, PlanOption } from "./types.ts";

export const comparisonCheckedDate = "30 October 2026";
export const comparisonCheckedIso = "2026-10-30";
export const comparisonPublishedIso = "2026-10-30";

/** WorkCV facts used in every comparison row. Keep in step with /pricing and /refund-policy. */
export const workcvFacts = {
  headline: `${site.price} once per CV and cover letter, or ${site.passPrice} for ${site.passDays} days`,
  billing: `One-time payments: ${site.price} per saved CV and letter, or a ${site.passPrice} Job Search Pass for ${site.passDays} days. Nothing renews.`,
  free: "Build and preview your CV and cover letter free, with no account. Downloading is the paid step.",
  formats: "PDF and an editable single-column Word (DOCX) file.",
  coverLetters: "Yes. Every saved CV has a matching cover letter in the same design, included in the price.",
  ai: "AI suggests CV bullets and a profile summary; nothing is applied until you approve it.",
  ats: "Free ATS checker with a five-part score and its method explained, plus a free job application tracker.",
  design: "Three UK layouts: single-column Classic, and Modern and Compact with a sidebar.",
  afterPaying: "Paid CVs and letters stay unlocked: edit and redownload them without paying again.",
  bestFor: "UK CVs and cover letters paid for once, with nothing to cancel.",
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
  bestFor: "UK CVs and cover letters without a subscription",
  price: `${site.price} once per CV and letter, or ${site.passPrice} for ${site.passDays} days`,
  why,
  tradeOff: "Three layouts rather than a large design library, and built only for UK CVs.",
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
