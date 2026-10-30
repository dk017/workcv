import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

import {
  CheckedLine,
  JsonLd,
  RelatedComparisons,
  SourcesSection,
} from "@/components/compare/compare-ui";
import { ButtonLink, FaqSection, FinalCta, SectionLabel } from "@/components/marketing";
import {
  comparisonCheckedDate,
  competitors,
  resolveAlternatives,
  type Competitor,
} from "@/lib/competitors";
import { articleSchema, faqSchema, itemListSchema } from "@/lib/competitors/schema";
import { site } from "@/lib/site";

export function CompetitorAlternativesPage({ competitor }: { competitor: Competitor }) {
  const { name, alt } = competitor;
  const subject = alt.subject ?? name;
  const heading = `${subject} alternatives UK`;
  const options = resolveAlternatives(competitor);
  const placement = `alt_${competitor.slug.replace(/-/g, "_")}`;
  const otherAlternatives = competitors
    .filter((item) => competitor.related.includes(item.slug))
    .map((item): [string, string] => [`${item.alt.subject ?? item.name} alternatives`, item.altPath]);
  const related: Array<[string, string]> = [
    [`WorkCV vs ${name}: full comparison`, competitor.vsPath],
    ...otherAlternatives,
    ["All UK CV builders compared", "/compare"],
    ["CV builder with no subscription", "/cv-builder-no-subscription-uk"],
  ];

  return (
    <>
      <JsonLd
        schemas={[
          articleSchema({
            path: competitor.altPath,
            headline: alt.title,
            description: alt.description,
            about: [name, "CV builder", "WorkCV"],
          }),
          itemListSchema(`${subject} alternatives in the UK`, options),
          faqSchema(alt.faqs),
        ]}
      />

      <section className="quiet-grid bg-paper py-16 md:py-24">
        <div className="container-page max-w-5xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
            {options.length} options compared · checked {comparisonCheckedDate}
          </p>
          <h1 className="font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">{heading}</h1>
          <p className="mt-7 max-w-3xl text-xl leading-8 text-ink">{alt.answer}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#options" trackingLabel={`${placement}_hero_options`}>
              See the alternatives
            </ButtonLink>
            <ButtonLink href="/editor" variant="secondary" trackingLabel={`${placement}_hero_editor`}>
              Try WorkCV
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-surface py-20" aria-labelledby="why-heading">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionLabel>Why switch</SectionLabel>
            <h2 id="why-heading" className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Why look for a {subject} alternative?
            </h2>
            <p className="mt-6 text-base leading-7 text-muted">{competitor.summary}</p>
            <p className="mt-4 rounded-md border border-line bg-paper p-4 text-sm leading-6 text-ink">
              <span className="font-bold text-navy">{name} pricing: </span>
              {competitor.pricing.headline}.
            </p>
            <div className="mt-4">
              <CheckedLine competitor={competitor} />
            </div>
          </div>
          <ul className="space-y-4">
            {alt.why.map((reason, index) => (
              <li key={reason} className="grid gap-4 rounded-xl border border-line bg-white p-5 sm:grid-cols-[44px_1fr]">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-paper text-sm font-bold text-navy">
                  {index + 1}
                </span>
                <p className="text-base leading-7 text-ink">{reason}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="options" className="bg-paper py-20" aria-labelledby="options-heading">
        <div className="container-page">
          <SectionLabel>The options</SectionLabel>
          <h2 id="options-heading" className="max-w-4xl font-display text-4xl font-semibold text-navy md:text-5xl">
            The best {subject} alternatives in the UK
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-7 text-muted">
            Listed in the order we would try them if leaving {name} for the reasons above. WorkCV and its free
            Word template are our own products; other free tools are included because for some people they are the
            better answer.
          </p>
          <ol className="mt-10 space-y-5">
            {options.map((option, index) => (
              <li
                key={option.name}
                className={`rounded-xl bg-white p-6 md:p-8 ${option.name === "WorkCV" ? "border-2 border-navy" : "border border-line"}`}
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                  <h3 className="font-display text-3xl font-semibold text-navy">
                    <span className="mr-3 text-gold">{index + 1}.</span>
                    {option.name}
                  </h3>
                  <p className="text-sm font-bold text-navy">{option.price}</p>
                </div>
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-muted">Best for: {option.bestFor}</p>
                <p className="mt-4 text-base leading-7 text-ink">{option.why}</p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  <span className="font-bold text-navy">Trade-off: </span>
                  {option.tradeOff}
                </p>
                <div className="mt-5">
                  {option.external ? (
                    <a
                      href={option.href}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-navy underline decoration-line-strong underline-offset-4"
                    >
                      {option.cta ?? `Visit ${option.name}`}
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                  ) : (
                    <Link
                      href={option.href}
                      className="inline-flex items-center gap-2 text-sm font-bold text-navy underline decoration-line-strong underline-offset-4"
                    >
                      {option.cta ??
                        (option.name === "WorkCV"
                          ? `Compare WorkCV with ${name}`
                          : `Compare ${option.name} with WorkCV`)}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-surface py-20" aria-labelledby="table-heading">
        <div className="container-page">
          <SectionLabel>At a glance</SectionLabel>
          <h2 id="table-heading" className="max-w-4xl font-display text-4xl font-semibold text-navy md:text-5xl">
            {subject} alternatives compared
          </h2>
          <div className="mt-10 overflow-x-auto rounded-xl border border-line bg-white">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <caption className="sr-only">
                {subject} alternatives compared, checked {comparisonCheckedDate}
              </caption>
              <thead className="bg-navy text-white">
                <tr>
                  <th scope="col" className="px-5 py-4 font-bold">Option</th>
                  <th scope="col" className="px-5 py-4 font-bold">Best for</th>
                  <th scope="col" className="px-5 py-4 font-bold">Price</th>
                  <th scope="col" className="px-5 py-4 font-bold">Watch out for</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-line align-top bg-paper">
                  <th scope="row" className="p-5 font-bold text-navy">{name} (what you are replacing)</th>
                  <td className="p-5 leading-6 text-ink">{competitor.asAlternative.bestFor}</td>
                  <td className="p-5 leading-6 text-ink">{competitor.asAlternative.price}</td>
                  <td className="p-5 leading-6 text-muted">{competitor.asAlternative.tradeOff}</td>
                </tr>
                {options.map((option) => (
                  <tr key={option.name} className={`border-t border-line align-top ${option.name === "WorkCV" ? "bg-greensoft" : ""}`}>
                    <th scope="row" className="p-5 font-bold text-navy">{option.name}</th>
                    <td className="p-5 leading-6 text-ink">{option.bestFor}</td>
                    <td className="p-5 leading-6 text-ink">{option.price}</td>
                    <td className="p-5 leading-6 text-muted">{option.tradeOff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-paper py-20" aria-labelledby="switch-heading">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionLabel>Before you switch</SectionLabel>
            <h2 id="switch-heading" className="font-display text-4xl font-semibold text-navy md:text-5xl">
              How do you switch from {name} without losing your CV?
            </h2>
          </div>
          <div className="rounded-xl border border-line bg-white p-6">
            <p className="text-base leading-7 text-ink">{competitor.switching.summary}</p>
            <a
              href={competitor.switching.href}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-navy underline decoration-line-strong underline-offset-4"
            >
              {competitor.switching.label}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            <p className="mt-5 border-t border-line pt-5 text-sm leading-6 text-muted">
              Moving to WorkCV? Use <span className="font-bold text-navy">Import CV</span> in the editor to bring
              your downloaded PDF or Word CV across (it asks for your email and a one-time code), preview it, and pay{" "}
              {site.price} once only when it looks right.
            </p>
          </div>
        </div>
      </section>

      <FaqSection faqs={alt.faqs} title={`${subject} alternatives: common questions`} />
      <SourcesSection competitor={competitor} />
      <RelatedComparisons links={related} />
      <FinalCta
        heading={`Switching from ${name}? Try one payment instead.`}
        body={`WorkCV is a UK CV builder: build and preview a CV and cover letter free, then pay ${site.price} once for both as PDF and Word. No subscription and nothing to cancel.`}
        secondaryHref={competitor.vsPath}
        secondary={`WorkCV vs ${name}`}
        trackingContext={`${placement}_final`}
      />
    </>
  );
}
