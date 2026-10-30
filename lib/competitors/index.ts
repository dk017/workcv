import { canva } from "./canva.ts";
import { cvGenius } from "./cv-genius.ts";
import { cvmaker } from "./cvmaker.ts";
import { enhancv } from "./enhancv.ts";
import { flowcv } from "./flowcv.ts";
import { kickresume } from "./kickresume.ts";
import { livecareer } from "./livecareer.ts";
import { myperfectcv } from "./myperfectcv.ts";
import { novoresume } from "./novoresume.ts";
import { resumeIo } from "./resume-io.ts";
import { standoutCv } from "./standout-cv.ts";
import { zety } from "./zety.ts";
import type { AlternativeOption, Competitor } from "./types.ts";
import { cheapestPlan, costHorizons, workcvFacts, workcvRowLabels } from "./workcv.ts";

export * from "./types.ts";
export * from "./workcv.ts";

/** Ordered roughly by UK search interest; the hub and footer use this order. */
export const competitors: Competitor[] = [
  myperfectcv,
  zety,
  resumeIo,
  livecareer,
  canva,
  cvmaker,
  enhancv,
  kickresume,
  novoresume,
  standoutCv,
  cvGenius,
  flowcv,
];

export function getCompetitor(slug: string): Competitor {
  const competitor = competitors.find((item) => item.slug === slug);
  if (!competitor) throw new Error(`Unknown competitor: ${slug}`);
  return competitor;
}

export function resolveAlternatives(competitor: Competitor): AlternativeOption[] {
  return competitor.alt.options.map((option) => {
    if (!("slug" in option)) return option;
    const other = getCompetitor(option.slug);
    return {
      name: other.name,
      bestFor: other.asAlternative.bestFor,
      price: other.asAlternative.price,
      why: option.why,
      tradeOff: other.asAlternative.tradeOff,
      href: other.vsPath,
    };
  });
}

export function comparisonRows(competitor: Competitor): string[][] {
  return workcvRowLabels.map(([label, key]) => [
    label,
    key === "headline" ? competitor.pricing.headline : competitor.facts[key],
    workcvFacts[key],
  ]);
}

/** Cost rows only for brands whose GBP prices are published on their own UK page. */
export function costRows(competitor: Competitor) {
  const plans = competitor.pricing.plans;
  if (!plans || competitor.pricing.confidence !== "uk-page") return null;
  return costHorizons.map((horizon) => {
    const best = cheapestPlan(plans, horizon.days);
    return { label: horizon.label, cost: best.cost, plan: best.plan.label };
  });
}

export const confidenceLabels: Record<Competitor["pricing"]["confidence"], string> = {
  "uk-page": "GBP prices from the official UK pricing page",
  "uk-page-conflict": "Official pages show different GBP prices; both are listed",
  regional: "Official pages quote US dollars or euros; UK checkout may differ",
  unconfirmed: "Current prices not visible on the official pages we could check",
};
