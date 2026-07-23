import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";

import {
  ComparisonTable,
  OfficialSourcesSection,
} from "@/components/comparison-table";
import {
  ButtonLink,
  FaqSection,
  FinalCta,
  SectionLabel,
} from "@/components/marketing";
import { buildWorkCvProductSchema } from "@/lib/product-schema";
import { site } from "@/lib/site";

export type FocusedAlternativeConfig = {
  brand: string;
  slug: string;
  checkedDate: string;
  kicker: string;
  heading: string;
  intro: string;
  competitorFit: string[];
  comparisonRows: string[][];
  cancellationHref: string;
  cancellationCopy: string;
  sources: Array<[string, string]>;
  faqs: Array<{ question: string; answer: string }>;
};

const workCvFit = [
  "One saved UK CV is the immediate job",
  "You want to inspect the whole preview before checkout",
  `${site.price} unlock for the selected saved CV`,
  "No monthly WorkCV subscription or automatic renewal",
  "Three clean layouts rather than a large design catalogue",
  "No need for built-in cover letters or application tracking",
];

export function FocusedAlternativePage({
  config,
}: {
  config: FocusedAlternativeConfig;
}) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
  const productSchema = buildWorkCvProductSchema({
    description: config.intro,
    url: `${site.url}${config.slug}`,
  });

  return (
    <>
      {[productSchema, faqSchema].map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <section className="quiet-grid bg-paper py-20 md:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              {config.kicker}
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              {config.heading}
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">{config.intro}</p>
            <div className="mt-8 grid gap-3 text-sm font-bold text-navy sm:grid-cols-2">
              {["Build and preview first", "No WorkCV renewal", "UK CV structure", `${site.price} saved-CV unlock`].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-success" />
                    {item}
                  </div>
                )
              )}
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/editor">Build my UK CV</ButtonLink>
              <ButtonLink href="#compare" variant="secondary">
                Compare both products
              </ButtonLink>
            </div>
          </div>
          <div className="rounded-[20px] border-2 border-navy bg-white p-8 shadow-soft">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-muted">
              WorkCV product truth
            </p>
            <div className="mt-5 font-display text-6xl font-semibold leading-none text-navy">
              {site.price}
            </div>
            <p className="mt-3 text-sm font-bold uppercase tracking-[0.14em] text-muted">
              unlock for the selected saved CV
            </p>
            <p className="mt-7 text-sm leading-7 text-muted">
              Email-code login is required. WorkCV currently does not include a
              cover-letter builder, AI writing, ATS scoring or application tracking.
            </p>
          </div>
        </div>
      </section>

      <section id="compare" className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Side-by-side comparison</SectionLabel>
          <h2 className="max-w-4xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Choose the billing model and feature set you actually need.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            {config.brand} details were checked {config.checkedDate}. Product
            features, regional prices and cancellation routes can change, so
            verify the official pages before paying.
          </p>
          <ComparisonTable
            caption={`${config.brand} vs WorkCV product comparison, checked ${config.checkedDate}`}
            headers={["Area", config.brand, "WorkCV"]}
            rows={config.comparisonRows}
          />
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <article className="rounded-xl border border-line bg-white p-7">
            <h2 className="font-display text-3xl font-semibold text-navy">
              Choose {config.brand} when the broader service matters.
            </h2>
            <ul className="mt-6 space-y-4">
              {config.competitorFit.map((item) => (
                <li key={item} className="flex gap-3 text-sm font-bold leading-6 text-navy">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-xl border-2 border-navy bg-white p-7 shadow-sm">
            <h2 className="font-display text-3xl font-semibold text-navy">
              Choose WorkCV when one UK CV is the job.
            </h2>
            <ul className="mt-6 space-y-4">
              {workCvFit.map((item) => (
                <li key={item} className="flex gap-3 text-sm font-bold leading-6 text-navy">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page rounded-xl border border-line bg-white p-7">
          <h2 className="font-display text-3xl font-semibold text-navy">
            Already paying for {config.brand}?
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-muted">{config.cancellationCopy}</p>
          <Link
            href={config.cancellationHref}
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy underline underline-offset-4"
          >
            Read the sourced cancellation guide
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <OfficialSourcesSection brand={config.brand} sources={config.sources} />
      <FaqSection faqs={config.faqs} title={`Questions about ${config.brand} alternatives.`} />
      <FinalCta
        heading="Build one UK CV without starting another monthly plan."
        body={`WorkCV costs ${site.price} to unlock the selected saved CV PDF. No monthly WorkCV subscription and no automatic renewal.`}
        primaryHref="/editor"
        primary="Build my UK CV"
        secondaryHref="/pricing"
        secondary="Compare pricing"
      />
    </>
  );
}
