import Link from "next/link";
import { Check, ChevronRight, ExternalLink } from "lucide-react";

import { SectionLabel } from "@/components/marketing";
import { comparisonCheckedDate, type Competitor } from "@/lib/competitors";

export function JsonLd({ schemas }: { schemas: object[] }) {
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

export function Breadcrumbs({ items }: { items: Array<[string, string]> }) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-line bg-surface">
      <ol className="container-page flex flex-wrap items-center gap-1 py-3 text-xs font-bold text-muted">
        {items.map(([label, href], index) => (
          <li key={href} className="flex items-center gap-1">
            {index > 0 ? <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /> : null}
            {index === items.length - 1 ? (
              <span aria-current="page" className="text-navy">
                {label}
              </span>
            ) : (
              <Link href={href} className="hover:text-navy hover:underline">
                {label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function CheckedLine({ competitor }: { competitor: Competitor }) {
  return (
    <p className="text-sm leading-6 text-muted">
      Prices and features checked {comparisonCheckedDate} against{" "}
      <a
        href={competitor.pricing.sourceUrl}
        target="_blank"
        rel="nofollow noopener noreferrer"
        className="font-bold text-navy underline decoration-line-strong underline-offset-4"
      >
        {competitor.name}&apos;s official pricing page
      </a>
      . Prices can change; the amount at checkout is the one that applies.
    </p>
  );
}

export function FitList({ title, items, tone }: { title: string; items: string[]; tone: "neutral" | "workcv" }) {
  return (
    <div className={`rounded-xl border p-6 ${tone === "workcv" ? "border-2 border-navy bg-white" : "border-line bg-paper"}`}>
      <h3 className="font-display text-2xl font-semibold text-navy">{title}</h3>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-ink">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SourcesSection({ competitor }: { competitor: Competitor }) {
  return (
    <section className="border-t border-line bg-surface py-20" aria-labelledby="sources-heading">
      <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionLabel>Sources and method</SectionLabel>
          <h2 id="sources-heading" className="font-display text-3xl font-semibold text-navy md:text-4xl">
            How we checked this comparison
          </h2>
          <p className="mt-5 text-base leading-7 text-muted">
            On {comparisonCheckedDate} we read {competitor.name}&apos;s official pricing, help and terms pages listed
            here. Where its own pages disagree, we show both figures. WorkCV makes one of the products compared,
            so read our wording as a vendor&apos;s view and check the sources before you buy.{" "}
            {competitor.owner ? `${competitor.name} is operated by ${competitor.owner}. ` : ""}
            {competitor.name} is not affiliated with WorkCV; trademarks belong to their owners.
          </p>
        </div>
        <ul className="grid content-start gap-3 sm:grid-cols-2">
          {competitor.sources.map(([label, href]) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="flex h-full items-center justify-between gap-3 rounded-md border border-line bg-white p-4 text-sm font-bold text-navy hover:border-navy"
              >
                {label}
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/refund-policy"
              className="flex h-full items-center justify-between gap-3 rounded-md border border-line bg-white p-4 text-sm font-bold text-navy hover:border-navy"
            >
              WorkCV refund policy
              <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}

export function RelatedComparisons({ links }: { links: Array<[string, string]> }) {
  return (
    <section className="bg-paper py-16" aria-labelledby="related-heading">
      <div className="container-page">
        <h2 id="related-heading" className="font-display text-3xl font-semibold text-navy">
          Related comparisons
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map(([label, href]) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex min-h-16 items-center justify-between gap-3 rounded-md border border-line bg-white p-4 text-sm font-bold text-navy hover:border-navy"
              >
                {label}
                <ChevronRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function PricingTable({ competitor }: { competitor: Competitor }) {
  return (
    <div className="self-start overflow-x-auto rounded-xl border border-line bg-white">
      <table className="w-full min-w-[520px] border-collapse text-left text-sm">
        <caption className="sr-only">
          {competitor.name} UK pricing, checked {comparisonCheckedDate}
        </caption>
        <tbody>
          {competitor.pricing.rows.map(([label, value]) => (
            <tr key={label} className="border-t border-line first:border-t-0 align-top">
              <th scope="row" className="w-2/5 bg-paper p-4 font-bold text-navy">
                {label}
              </th>
              <td className="p-4 leading-6 text-ink">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
