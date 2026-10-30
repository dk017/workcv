import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { JsonLd } from "@/components/compare/compare-ui";
import { ButtonLink, FaqSection, FinalCta, SectionLabel } from "@/components/marketing";
import { comparisonCheckedDate, comparisonCheckedIso, competitors, workcvFacts } from "@/lib/competitors";
import { faqSchema } from "@/lib/competitors/schema";
import { withAgentMetadata } from "@/lib/agent-metadata";
import { site } from "@/lib/site";

const path = "/compare";
const title = "Compare UK CV Builders 2026: Prices, Renewals, Free Plans";
const description =
  "Every major UK CV builder side by side: MyPerfectCV, Zety, Resume.io, LiveCareer, Canva, FlowCV and more. Real prices, renewals and free options, October 2026.";

export const metadata: Metadata = withAgentMetadata(path, {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article", modifiedTime: comparisonCheckedIso },
});

const faqs = [
  {
    question: "Which CV builders let you download a CV PDF for free in the UK?",
    answer:
      "FlowCV's free plan includes unlimited watermark-free PDF downloads for one saved CV, Kickresume's free plan downloads PDF or Word if you use only free design options, and Canva's free plan exports PDF from free templates. Barclays LifeSkills exports a free Word CV. Checked 30 October 2026.",
  },
  {
    question: "Which UK CV builders have no subscription?",
    answer:
      "WorkCV charges £7.99 once per saved CV and cover letter, or £24.99 for a 90-day Job Search Pass, and neither renews. Novorésumé sells a one-off Pro Pass for a month that does not renew. Free plans from FlowCV, Kickresume and Canva have nothing to cancel. MyPerfectCV, LiveCareer, Zety, Resume.io and CVmaker all renew automatically after a short trial.",
  },
  {
    question: "Why do so many CV builders cost £1.95 or £2.95 at first?",
    answer:
      "That is an introductory price for 7 or 14 days of access. If you do not cancel, it becomes a recurring charge: for example £16.95 every 4 weeks at MyPerfectCV, £19.85 at LiveCareer and £20.95 at Resume.io, on their UK pricing pages checked 30 October 2026.",
  },
  {
    question: "What is the cheapest way to make one CV for UK jobs?",
    answer:
      "A free tool costs nothing: WorkCV's blank Word CV template, FlowCV's free plan or Barclays LifeSkills. If you want a guided UK CV builder, WorkCV costs £7.99 once. A trial-based builder is cheaper only if you finish and cancel inside its 7- or 14-day window.",
  },
  {
    question: "How were these CV builders compared?",
    answer:
      "We read each brand's official pricing, help and terms pages on 30 October 2026 and recorded GBP prices where published. Where a brand's own pages disagree or only quote US dollars, the comparison says so. WorkCV is one of the products compared.",
  },
];

export default function ComparePage() {
  return (
    <>
      <JsonLd
        schemas={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: title,
            description,
            url: `${site.url}${path}`,
            dateModified: comparisonCheckedIso,
            inLanguage: "en-GB",
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: competitors.length,
              itemListElement: competitors.map((competitor, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: `WorkCV vs ${competitor.name}`,
                url: `${site.url}${competitor.vsPath}`,
              })),
            },
          },
          faqSchema(faqs),
        ]}
      />

      <section className="quiet-grid bg-paper py-16 md:py-24">
        <div className="container-page max-w-5xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
            {competitors.length + 1} CV builders · prices checked {comparisonCheckedDate}
          </p>
          <h1 className="font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
            Compare UK CV builders
          </h1>
          <p className="mt-7 max-w-3xl text-xl leading-8 text-ink">
            Most UK CV builders start at £1.95 to £2.95 and then renew every four weeks at £16.95 to £20.95 unless
            you cancel. A few are genuinely free, and WorkCV charges £7.99 once per CV and cover letter. This page lists what each one
            really costs, what you get free and what to watch out for, with links to a full comparison of each.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#table" trackingLabel="compare_hub_table">
              See the table
            </ButtonLink>
            <ButtonLink href="/editor" variant="secondary" trackingLabel="compare_hub_editor">
              Try WorkCV
            </ButtonLink>
          </div>
        </div>
      </section>

      <section id="table" className="bg-surface py-20" aria-labelledby="table-heading">
        <div className="container-page">
          <SectionLabel>All builders</SectionLabel>
          <h2 id="table-heading" className="max-w-4xl font-display text-4xl font-semibold text-navy md:text-5xl">
            What does each UK CV builder cost?
          </h2>
          <div className="mt-10 overflow-x-auto rounded-xl border border-line bg-white">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <caption className="sr-only">UK CV builder prices and free options, checked {comparisonCheckedDate}</caption>
              <thead className="bg-navy text-white">
                <tr>
                  <th scope="col" className="px-5 py-4 font-bold">Builder</th>
                  <th scope="col" className="px-5 py-4 font-bold">Price</th>
                  <th scope="col" className="px-5 py-4 font-bold">Best for</th>
                  <th scope="col" className="px-5 py-4 font-bold">Watch out for</th>
                  <th scope="col" className="px-5 py-4 font-bold">Compare</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-line bg-greensoft align-top">
                  <th scope="row" className="p-5 font-bold text-navy">WorkCV</th>
                  <td className="p-5 leading-6 text-ink">{workcvFacts.headline}</td>
                  <td className="p-5 leading-6 text-ink">{workcvFacts.bestFor}</td>
                  <td className="p-5 leading-6 text-muted">Three layouts rather than a large design library; UK CVs only.</td>
                  <td className="p-5 leading-6">
                    <Link href="/pricing" className="font-bold text-navy underline underline-offset-4">Pricing</Link>
                  </td>
                </tr>
                {competitors.map((competitor) => (
                  <tr key={competitor.slug} className="border-t border-line align-top">
                    <th scope="row" className="p-5 font-bold text-navy">{competitor.name}</th>
                    <td className="p-5 leading-6 text-ink">{competitor.pricing.headline}</td>
                    <td className="p-5 leading-6 text-ink">{competitor.asAlternative.bestFor}</td>
                    <td className="p-5 leading-6 text-muted">{competitor.asAlternative.tradeOff}</td>
                    <td className="p-5 leading-6">
                      <Link href={competitor.vsPath} className="font-bold text-navy underline underline-offset-4">
                        vs WorkCV
                      </Link>
                      <span className="text-muted"> · </span>
                      <Link href={competitor.altPath} className="font-bold text-navy underline underline-offset-4">
                        Alternatives
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-muted">
            Prices from each brand&apos;s official pages on {comparisonCheckedDate}. Some brands quote US dollars or
            show conflicting figures; each comparison page explains which. Always check the price at checkout.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20" aria-labelledby="pages-heading">
        <div className="container-page">
          <SectionLabel>Full comparisons</SectionLabel>
          <h2 id="pages-heading" className="max-w-4xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Head-to-head comparisons and alternatives
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {competitors.map((competitor) => (
              <li key={competitor.slug} className="rounded-xl border border-line bg-white p-6">
                <h3 className="font-display text-2xl font-semibold text-navy">{competitor.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{competitor.category}</p>
                <div className="mt-5 grid gap-2 text-sm font-bold text-navy">
                  <Link href={competitor.vsPath} className="group inline-flex items-center gap-2 hover:underline">
                    WorkCV vs {competitor.name}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                  <Link href={competitor.altPath} className="group inline-flex items-center gap-2 hover:underline">
                    {competitor.alt.subject ?? competitor.name} alternatives
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold text-navy">
            {[
              ["How to choose a CV builder", "/best-cv-builder-uk"],
              ["MyPerfectCV vs LiveCareer", "/myperfectcv-vs-livecareer-uk"],
              ["Zety vs MyPerfectCV", "/zety-vs-myperfectcv-uk"],
              ["Why CV builders charge after a trial", "/cv-builder-scams-uk"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="rounded-md border border-line-strong bg-white px-4 py-3 hover:border-navy">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FaqSection faqs={faqs} title="UK CV builder questions" />
      <FinalCta
        heading="Need one UK CV, not another subscription?"
        body={`Build and preview your CV and cover letter free, then pay ${site.price} once to download both as PDF and Word. Nothing renews.`}
        secondaryHref="/cv-builder-no-subscription-uk"
        secondary="Why no subscription"
        trackingContext="compare_hub_final"
      />
    </>
  );
}
