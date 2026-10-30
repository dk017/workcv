import { ExternalLink } from "lucide-react";

import { ComparisonTable } from "@/components/comparison-table";
import {
  Breadcrumbs,
  CheckedLine,
  FitList,
  JsonLd,
  PricingTable,
  RelatedComparisons,
  SourcesSection,
} from "@/components/compare/compare-ui";
import { ButtonLink, FaqSection, FinalCta, SectionLabel } from "@/components/marketing";
import { SampleCvProof } from "@/components/sample-cv-proof";
import {
  comparisonCheckedDate,
  comparisonRows,
  confidenceLabels,
  costRows,
  getCompetitor,
  gbp,
  type Competitor,
} from "@/lib/competitors";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/competitors/schema";
import { buildWorkCvProductSchema } from "@/lib/product-schema";
import { site } from "@/lib/site";

export function CompetitorVsPage({ competitor }: { competitor: Competitor }) {
  const { name, vs } = competitor;
  const heading = `WorkCV vs ${name}`;
  const crumbs: Array<[string, string]> = [
    ["Home", "/"],
    ["Compare CV builders", "/compare"],
    [heading, competitor.vsPath],
  ];
  const costs = costRows(competitor);
  const placement = `vs_${competitor.slug.replace(/-/g, "_")}`;
  const related: Array<[string, string]> = [
    [`${competitor.alt.subject ?? name} alternatives in the UK`, competitor.altPath],
    ...competitor.related.map((slug): [string, string] => {
      const other = getCompetitor(slug);
      return [`WorkCV vs ${other.name}`, other.vsPath];
    }),
    ["All UK CV builders compared", "/compare"],
    ["WorkCV pricing", "/pricing"],
  ];

  return (
    <>
      <JsonLd
        schemas={[
          articleSchema({
            path: competitor.vsPath,
            headline: vs.title,
            description: vs.description,
            about: ["WorkCV", name, "CV builder"],
          }),
          breadcrumbSchema(crumbs),
          faqSchema(vs.faqs),
          buildWorkCvProductSchema({
            description: `UK CV builder: build and preview free, then pay ${site.price} once to download your CV PDF. Compared with ${name}.`,
            url: `${site.url}${competitor.vsPath}`,
          }),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <section className="quiet-grid bg-paper py-16 md:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              UK CV builder comparison · checked {comparisonCheckedDate}
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">{heading}</h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-ink">{vs.answer}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/editor" trackingLabel={`${placement}_hero_editor`}>
                Build my UK CV
              </ButtonLink>
              <ButtonLink href="#compare" variant="secondary" trackingLabel={`${placement}_hero_compare`}>
                See the side-by-side table
              </ButtonLink>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[20px] border border-line bg-white p-6 shadow-soft">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{name}</p>
              <p className="mt-4 font-display text-2xl font-semibold leading-tight text-navy">
                {competitor.pricing.headline}
              </p>
              <p className="mt-4 text-sm leading-6 text-muted">{competitor.category}.</p>
            </div>
            <div className="rounded-[20px] border-2 border-navy bg-white p-6 shadow-soft">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">WorkCV</p>
              <p className="mt-4 font-display text-2xl font-semibold leading-tight text-navy">
                {site.price} once per saved CV
              </p>
              <p className="mt-4 text-sm leading-6 text-muted">
                UK CV builder. Build and preview free; no subscription.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="compare" className="bg-surface py-20" aria-labelledby="compare-heading">
        <div className="container-page">
          <SectionLabel>Side by side</SectionLabel>
          <h2 id="compare-heading" className="max-w-4xl font-display text-4xl font-semibold text-navy md:text-5xl">
            How do WorkCV and {name} compare?
          </h2>
          <ComparisonTable
            caption={`WorkCV vs ${name}, checked ${comparisonCheckedDate}`}
            headers={["Feature", name, "WorkCV"]}
            rows={comparisonRows(competitor)}
          />
          <div className="mt-5 max-w-4xl">
            <CheckedLine competitor={competitor} />
          </div>
        </div>
      </section>

      <section className="bg-paper py-20" aria-labelledby="price-heading">
        <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>Price</SectionLabel>
            <h2 id="price-heading" className="font-display text-4xl font-semibold text-navy md:text-5xl">
              How much does {name} cost in the UK?
            </h2>
            <p className="mt-6 text-base leading-7 text-muted">{competitor.summary}</p>
            <p className="mt-4 rounded-md border border-line bg-white p-4 text-sm leading-6 text-muted">
              <span className="font-bold text-navy">{confidenceLabels[competitor.pricing.confidence]}.</span>{" "}
              {competitor.pricing.note}
            </p>
          </div>
          <PricingTable competitor={competitor} />
        </div>
      </section>

      {costs ? (
        <section className="bg-surface py-20" aria-labelledby="cost-heading">
          <div className="container-page">
            <SectionLabel>Cost over time</SectionLabel>
            <h2 id="cost-heading" className="max-w-4xl font-display text-4xl font-semibold text-navy md:text-5xl">
              What does each cost if you need your CV for longer?
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-7 text-muted">
              Job searches rarely end in two weeks. This table uses {name}&apos;s cheapest published plan for each
              period, charged at the start of each billing period, and assumes you cancel at the end.
            </p>
            <div className="mt-8 overflow-x-auto rounded-xl border border-line bg-white">
              <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                <caption className="sr-only">
                  Total cost of {name} and WorkCV over time, checked {comparisonCheckedDate}
                </caption>
                <thead className="bg-navy text-white">
                  <tr>
                    <th scope="col" className="px-5 py-4 font-bold">How long you need it</th>
                    <th scope="col" className="px-5 py-4 font-bold">{name} (cheapest plan)</th>
                    <th scope="col" className="px-5 py-4 font-bold">WorkCV</th>
                  </tr>
                </thead>
                <tbody>
                  {costs.map((row) => (
                    <tr key={row.label} className="border-t border-line align-top">
                      <th scope="row" className="bg-paper p-5 font-bold text-navy">{row.label}</th>
                      <td className="p-5 leading-6 text-ink">
                        <span className="font-bold">{gbp(row.cost)}</span>
                        <span className="block text-xs text-muted">{row.plan}</span>
                      </td>
                      <td className="bg-greensoft p-5 font-bold text-navy">{site.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
              WorkCV&apos;s {site.price} unlocks one saved CV with no time limit; a second, different CV is another{" "}
              {site.price}. {name}&apos;s figures assume the plan renews as published until you cancel.
            </p>
          </div>
        </section>
      ) : null}

      <section className="bg-paper py-20" aria-labelledby="verdict-heading">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionLabel>Verdict</SectionLabel>
            <h2 id="verdict-heading" className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Should you choose WorkCV or {name}?
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-ink">
            {vs.verdict.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20" aria-labelledby="fit-heading">
        <div className="container-page">
          <h2 id="fit-heading" className="sr-only">
            When each one is the better choice
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <FitList title={`When ${name} is the better choice`} items={vs.competitorBetter} tone="neutral" />
            <FitList title="When WorkCV is the better choice" items={vs.workcvBetter} tone="workcv" />
          </div>
        </div>
      </section>

      <section className="bg-paper py-20" aria-labelledby="switch-heading">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionLabel>Switching</SectionLabel>
            <h2 id="switch-heading" className="font-display text-4xl font-semibold text-navy md:text-5xl">
              How do you switch from {name} to WorkCV?
            </h2>
            <p className="mt-6 text-base leading-7 text-muted">{competitor.switching.summary}</p>
            <a
              href={competitor.switching.href}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy underline decoration-line-strong underline-offset-4"
            >
              {competitor.switching.label}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <ol className="divide-y divide-line rounded-xl border border-line bg-white">
            {[
              ["Download your CV", `Save your latest CV from ${name} as a PDF or Word file while you still have access.`],
              ["Import it into WorkCV", "Open the WorkCV editor and choose Import CV. Check each section, because layouts do not always convert perfectly."],
              ["Preview, then pay once", `Fix anything that moved, preview the full PDF and pay ${site.price} only when you are happy.`],
              [`Cancel ${name} separately`, `Using WorkCV does not stop ${name} billing. Cancel through ${name}'s own account or support route.`],
            ].map(([title, body], index) => (
              <li key={title} className="grid gap-4 p-5 sm:grid-cols-[44px_1fr]">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-paper text-sm font-bold text-navy">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-navy">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <SampleCvProof variant="compact" trackingContext={`${placement}_sample`} />
      <FaqSection faqs={vs.faqs} title={`WorkCV vs ${name}: common questions`} />
      <SourcesSection competitor={competitor} />
      <RelatedComparisons links={related} />
      <FinalCta
        heading="One UK CV. One payment. Nothing to cancel."
        body={`Build and preview your CV free, then pay ${site.price} once to download the PDF. Edit and redownload it later without paying again.`}
        secondaryHref="/pricing"
        secondary="See WorkCV pricing"
        trackingContext={`${placement}_final`}
      />
    </>
  );
}
