import Link from "next/link";
import { PassOfferView } from "@/components/pass-offer-view";
import { Check } from "lucide-react";

import { ButtonLink } from "@/components/marketing";
import { buildLoginHref } from "@/lib/safe-redirect";
import { site } from "@/lib/site";

export type PassAudience = "switching" | "redundancy" | "sponsorship" | "tailoring";

// The editor reads plan=pass and opens checkout with the Job Search Pass selected.
export const passStartHref = buildLoginHref("/editor?plan=pass");

const copy: Record<PassAudience, { eyebrow: string; heading: string; body: string }> = {
  switching: {
    eyebrow: "Leaving a subscription CV builder?",
    heading: "Unlimited CVs, without the monthly charge.",
    body: `The Job Search Pass gives you unlimited UK CVs and matching cover letters for ${site.passDays} days, as PDF and Word, for ${site.passPrice} once. It never renews, so there is nothing to cancel.`,
  },
  redundancy: {
    eyebrow: "Applying for jobs after redundancy?",
    heading: "A tailored CV and cover letter for every application.",
    body: `If you're applying for lots of roles, the Job Search Pass gives you unlimited UK CVs and matching cover letters for ${site.passDays} days, for ${site.passPrice} once. Nothing renews and nothing needs cancelling.`,
  },
  sponsorship: {
    eyebrow: "Applying to lots of sponsoring employers?",
    heading: "Tailor your CV and cover letter for each one.",
    body: `The National Careers Service advises tailoring your CV to each job. The Job Search Pass gives you unlimited UK CVs and matching cover letters for ${site.passDays} days, for ${site.passPrice} once, so each application can fit the role.`,
  },
  tailoring: {
    eyebrow: "Checking your CV against several adverts?",
    heading: "Make a tailored version for each job.",
    body: `Duplicate your CV for each advert and adjust it to match. The Job Search Pass gives you unlimited UK CVs and matching cover letters for ${site.passDays} days, for ${site.passPrice} once, with no subscription.`,
  },
};

const features = [
  `Unlimited CVs and cover letters for ${site.passDays} days`,
  "Duplicate your CV for each job in one click",
  "PDF and editable Word downloads",
  "One payment, never renews",
];

export function PassOffer({ audience, trackingLabel }: { audience: PassAudience; trackingLabel: string }) {
  const { eyebrow, heading, body } = copy[audience];
  return (
    <section aria-labelledby={`pass-offer-${audience}`} className="border-y border-line bg-paper py-16">
      <div className="container-page">
        <div className="grid gap-8 rounded-xl border-2 border-gold bg-white p-6 shadow-soft md:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-success">{eyebrow}</p>
            <h2 id={`pass-offer-${audience}`} className="font-display text-3xl font-semibold leading-tight text-navy md:text-4xl">
              {heading}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{body}</p>

          </div>
          <div>
            <PassOfferView placement={trackingLabel}><div className="flex flex-wrap items-baseline gap-3">
              <span className="font-display text-5xl font-semibold leading-none text-navy">{site.passPrice}</span>
              <span className="text-sm font-bold uppercase tracking-[0.14em] text-muted">once · {site.passDays} days</span>
            </div></PassOfferView>
            <ul className="mt-5 space-y-2">
              {features.map((item) => (
                <li key={item} className="flex gap-2 text-sm font-bold text-navy">
                  <Check className="h-5 w-5 shrink-0 text-success" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <ButtonLink href={passStartHref} trackingLabel={trackingLabel}>
                Start with the Job Search Pass
              </ButtonLink>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">
              Covered CVs stay editable and downloadable after the 90 days. You can also keep editing one saved CV and letter for {site.price} once. Build and preview free first.{" "}
              <Link href="/pricing#job-search-pass" className="font-bold text-navy underline underline-offset-4">
                Compare plans
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
