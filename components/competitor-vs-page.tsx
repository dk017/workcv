import Link from "next/link";
import { ArrowRight, Building2, Check } from "lucide-react";

import { ComparisonTable } from "@/components/comparison-table";
import { ButtonLink, FaqSection, FinalCta, SectionLabel } from "@/components/marketing";
import { PassOffer } from "@/components/pass-offer";
import { analyticsPlacements } from "@/lib/analytics-placements";
import { costOverDays, formatMinor, type CompetitorPlans } from "@/lib/competitor-plans";
import { site } from "@/lib/site";

// "Brand A vs Brand B" pages: an independent comparison of two competitors,
// with WorkCV as a clearly labelled third option. Prices and costs come from
// lib/competitor-plans.ts so every figure traces back to a checked source.

export type CompetitorVsConfig = {
  slug: string;
  a: CompetitorPlans;
  b: CompetitorPlans;
  heading: string;
  /** Answer first: two or three short paragraphs. */
  shortAnswer: string[];
  /** Shown when both brands name the same operator in their terms: what that means for the reader. */
  sameOperatorNote?: string;
  /** Rows of [area, A, B, WorkCV]. */
  featureRows: string[][];
  chooseA: string[];
  chooseB: string[];
  cancelGuides: { a: string; b: string };
  faqs: Array<{ question: string; answer: string }>;
};

const workCvChoose = [
  "You need a finished UK CV and cover letter, not an ongoing membership",
  `You want to pay ${site.price} once for one CV and its matching letter, as PDF and Word`,
  `You are applying for several jobs: ${site.passPrice} once covers ${site.passDays} days of CVs and letters`,
  "You never want to remember to cancel anything",
  "You are happy with three clean UK layouts rather than dozens of designs",
];

function costRows(a: CompetitorPlans, b: CompetitorPlans) {
  const money = (plan: CompetitorPlans, days: number) => formatMinor(costOverDays(plan.trial, days), plan.trial.currency);
  const annual = (plan: CompetitorPlans) => (plan.annual ? `${formatMinor(plan.annual.totalMinor, plan.annual.currency)} a year, renews yearly` : "No annual plan listed");
  return [
    ["First payment", formatMinor(a.trial.entryMinor, a.trial.currency), formatMinor(b.trial.entryMinor, b.trial.currency), `${site.price} for one CV, or ${site.passPrice} for the Pass`],
    ["Total after 4 weeks if not cancelled", money(a, 28), money(b, 28), `${site.price} or ${site.passPrice}; no further charge`],
    ["Total after 12 weeks if not cancelled", money(a, 84), money(b, 84), `${site.price} or ${site.passPrice}; no further charge`],
    ["Annual option", annual(a), annual(b), "None needed; nothing renews"],
  ];
}

export function CompetitorVsPage({ config }: { config: CompetitorVsConfig }) {
  const { a, b } = config;
  const sameOperator = a.operator === b.operator;
  const checked = a.checked === b.checked ? a.checked : `${a.checked} (${a.brand}) and ${b.checked} (${b.brand})`;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
  const usdNote = [a, b]
    .filter((plan) => plan.trial.currency === "USD")
    .map((plan) => `${plan.brand} amounts are in US dollars: ${plan.priceScope}.`)
    .join(" ");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="quiet-grid bg-paper py-16 md:py-24">
        <div className="container-page max-w-4xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
            {a.brand} vs {b.brand} · UK comparison
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] text-navy md:text-6xl">{config.heading}</h1>
          <div className="mt-8 rounded-xl border-2 border-navy bg-white p-6 shadow-soft md:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-success">Short answer</p>
            <div className="mt-3 space-y-4 text-lg leading-8 text-ink">
              {config.shortAnswer.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-muted">
              Prices and terms checked on {checked} from each provider&apos;s official pages. WorkCV is a third option and a
              competitor to both; we show where each one is the better fit.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#cost" variant="secondary" trackingLabel="vs_jump_cost">See the cost over time</ButtonLink>
            <ButtonLink href="/editor" trackingLabel="vs_hero_editor">Try WorkCV free</ButtonLink>
          </div>
        </div>
      </section>

      {sameOperator && config.sameOperatorNote ? (
        <section className="bg-surface py-14">
          <div className="container-page max-w-4xl">
            <div className="flex gap-4 rounded-xl border border-gold bg-gold-tint/40 p-6">
              <Building2 className="mt-1 h-6 w-6 shrink-0 text-navy" aria-hidden="true" />
              <div>
                <h2 className="font-display text-2xl font-semibold text-navy">Both are run by the same company</h2>
                <p className="mt-3 leading-7 text-muted">
                  The terms of use for both {a.brand} and {b.brand} name <strong className="text-navy">{a.operator}</strong> as
                  the company you contract with. {config.sameOperatorNote}
                </p>
                <p className="mt-3 text-sm text-muted">
                  Sources:{" "}
                  <a href={a.operatorSource} target="_blank" rel="nofollow noopener noreferrer" className="font-bold text-navy underline">
                    {a.brand} terms of use
                  </a>{" "}
                  and{" "}
                  <a href={b.operatorSource} target="_blank" rel="nofollow noopener noreferrer" className="font-bold text-navy underline">
                    {b.brand} terms of use
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section id="cost" className="bg-paper py-20">
        <div className="container-page">
          <SectionLabel>Cost over time</SectionLabel>
          <h2 className="max-w-4xl font-display text-4xl font-semibold text-navy md:text-5xl">
            What you pay if you forget to cancel.
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
            Both trials renew automatically. These totals assume the trial is never cancelled, using the renewal terms each
            provider publishes. {usdNote}
          </p>
          <ComparisonTable
            caption={`Cost over time: ${a.brand}, ${b.brand} and WorkCV`}
            headers={["", a.brand, b.brand, "WorkCV"]}
            rows={costRows(a, b)}
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[a, b].map((plan) => (
              <blockquote key={plan.brand} className="rounded-lg border border-line bg-white p-5 text-sm leading-6 text-muted">
                <span className="font-bold text-navy">{plan.brand}&apos;s renewal wording:</span> &ldquo;{plan.trial.renewalWording}&rdquo;
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page">
          <SectionLabel>Side by side</SectionLabel>
          <h2 className="max-w-4xl font-display text-4xl font-semibold text-navy md:text-5xl">
            {a.brand}, {b.brand} and WorkCV compared.
          </h2>
          <ComparisonTable
            caption={`${a.brand} vs ${b.brand} vs WorkCV, checked ${checked}`}
            headers={["Area", a.brand, b.brand, "WorkCV"]}
            rows={config.featureRows}
          />
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-page">
          <SectionLabel>Free plans</SectionLabel>
          <h2 className="max-w-4xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Is {a.brand} free? Is {b.brand} free?
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[a, b].map((plan) => (
              <article key={plan.brand} className="rounded-xl border border-line bg-white p-6">
                <h3 className="font-display text-2xl font-semibold text-navy">{plan.brand}</h3>
                <p className="mt-3 leading-7 text-muted">{plan.freePlan}</p>
              </article>
            ))}
            <article className="rounded-xl border-2 border-navy bg-white p-6">
              <h3 className="font-display text-2xl font-semibold text-navy">WorkCV</h3>
              <p className="mt-3 leading-7 text-muted">
                Building, editing and previewing are free. Downloading a finished CV costs {site.price} once. A{" "}
                <Link href="/tools/blank-cv-template-uk" className="font-bold text-navy underline">free blank Word CV template</Link>{" "}
                and the <Link href="/tools/ats-score-checker" className="font-bold text-navy underline">ATS CV checker</Link> need no payment.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page grid gap-6 lg:grid-cols-3">
          {[
            { title: `Choose ${a.brand} if`, items: config.chooseA, highlight: false },
            { title: `Choose ${b.brand} if`, items: config.chooseB, highlight: false },
            { title: "Choose WorkCV if", items: workCvChoose, highlight: true },
          ].map((column) => (
            <article key={column.title} className={`rounded-xl bg-white p-7 ${column.highlight ? "border-2 border-navy shadow-sm" : "border border-line"}`}>
              <h2 className="font-display text-3xl font-semibold text-navy">{column.title}</h2>
              <ul className="mt-6 space-y-4">
                {column.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-bold leading-6 text-navy">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-paper py-16">
        <div className="container-page grid gap-5 md:grid-cols-2">
          {[
            [a.brand, config.cancelGuides.a],
            [b.brand, config.cancelGuides.b],
          ].map(([brand, href]) => (
            <Link key={href} href={href} className="flex items-center justify-between gap-4 rounded-xl border border-line bg-white p-6 font-bold text-navy hover:border-navy">
              Already on a {brand} trial? How to cancel {brand} in the UK
              <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container-page max-w-4xl">
          <SectionLabel>Official sources</SectionLabel>
          <p className="leading-7 text-muted">
            This is an independent comparison. Neither {a.brand} nor {b.brand} is affiliated with WorkCV, and product names belong
            to their owners. Plans, regional prices and terms change, so check the official pages before you pay.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              [`${a.brand} pricing`, a.pricingSource],
              [`${a.brand} terms of use`, a.operatorSource],
              [`${b.brand} pricing`, b.pricingSource],
              [`${b.brand} terms of use`, b.operatorSource],
            ].map(([label, href]) => (
              <li key={href}>
                <a href={href} target="_blank" rel="nofollow noopener noreferrer" className="block rounded-lg border border-line bg-white p-4 font-bold text-navy hover:border-navy">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <PassOffer audience="switching" trackingLabel={analyticsPlacements.passSwitchingComparison} />
      <FaqSection faqs={config.faqs} title={`${a.brand} vs ${b.brand}: common questions.`} />
      <FinalCta
        heading="Want a UK CV without a renewing trial?"
        body={`Build and preview free. Pay ${site.price} once to download one CV and its matching cover letter, or ${site.passPrice} once for ${site.passDays} days of applications. Nothing renews.`}
        primaryHref="/editor"
        primary="Build my UK CV"
        secondaryHref="/pricing"
        secondary="Compare WorkCV plans"
        trackingContext="vs_final_cta"
      />
    </>
  );
}

/** Links from alternative and cancellation pages to the head-to-head comparisons. */
export function ComparisonLinks({ heading, links }: { heading: string; links: Array<[string, string]> }) {
  return (
    <section className="bg-paper py-14">
      <div className="container-page">
        <h2 className="font-display text-3xl font-semibold text-navy">{heading}</h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {links.map(([label, href]) => (
            <li key={href}>
              <Link href={href} className="inline-flex items-center gap-2 rounded-md border border-line-strong bg-white px-4 py-3 text-sm font-bold text-navy hover:border-navy">
                {label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
