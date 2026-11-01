import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ComparisonTable } from "@/components/comparison-table";
import { ButtonLink, FaqSection, SectionLabel } from "@/components/marketing";
import { alternativeBrands, alternativeOptions, type AlternativeBrand } from "@/lib/cv-builder-alternatives";
import { site } from "@/lib/site";

// A list of real options for someone leaving one CV builder. WorkCV is one
// entry, labelled as ours; the head-to-head lives on the WorkCV vs page.

function OptionLink({ href, children }: { href: string; children: React.ReactNode }) {
  const className = "inline-flex items-center gap-2 text-sm font-bold text-navy underline underline-offset-4";
  return href.startsWith("http")
    ? <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}<ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
    : <Link href={href} className={className}>{children}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>;
}

export function CvBuilderAlternativesPage({ page }: { page: AlternativeBrand }) {
  const { brand } = page;
  const faqs = [
    ...page.faqs,
    { question: `Does switching cancel my ${brand} plan?`, answer: `No. Cancel with ${brand} directly and keep the confirmation. The steps are on our WorkCV vs ${brand} page.` },
    { question: "Why is WorkCV on this list?", answer: `WorkCV publishes this page and is one of the options, marked as ours. The other options are not affiliated with WorkCV, and several are free.` },
  ];
  const schemas = [
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
    { "@context": "https://schema.org", "@type": "ItemList", name: `${brand} alternatives`, itemListElement: alternativeOptions.map((option, i) => ({ "@type": "ListItem", position: i + 1, name: option.name })) },
  ];
  const others = alternativeBrands.filter((item) => item.path !== page.path);

  return (
    <>
      {schemas.map((schema, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />)}

      <section className="quiet-grid bg-paper py-16 md:py-24">
        <div className="container-page max-w-4xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">{brand} alternatives · UK</p>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] text-navy md:text-6xl">{brand} alternatives for UK job seekers</h1>
          <div className="mt-8 rounded-xl border-2 border-navy bg-white p-6 shadow-soft md:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-success">Short answer</p>
            <p className="mt-3 text-lg leading-8 text-ink">
              For a free download, use the GOV.UK CV builder, FlowCV&apos;s free plan or a Word template. For a UK CV and matching cover
              letter paid once, WorkCV costs {site.price} with nothing to renew. {page.siblings ? `${page.siblings} are run by the same company and charge the same way, so switching to them changes little.` : ""}
            </p>
            <p className="mt-5 text-sm leading-6 text-muted">
              WorkCV publishes this page and is one of the options below, marked as ours. Details checked on each provider&apos;s own pages; dates are shown with each option.
            </p>
          </div>
        </div>
      </section>

      <div className="container-page max-w-5xl space-y-16 py-16">
        <section className="space-y-5">
          <h2 className="font-display text-3xl font-semibold text-navy md:text-4xl">Why people look for an alternative to {brand}</h2>
          <p className="max-w-3xl text-lg leading-8 text-ink">{page.whyLeave}</p>
          <ComparisonTable caption={`Which ${brand} alternative to start with`} headers={["Your situation", "Start with"]} rows={page.quickPicks} />
        </section>

        <section className="space-y-6">
          <SectionLabel>The options</SectionLabel>
          <h2 className="font-display text-3xl font-semibold text-navy md:text-4xl">{alternativeOptions.length} alternatives to {brand}, and the catch with each</h2>
          <ol className="space-y-5">
            {alternativeOptions.map((option, i) => (
              <li key={option.id} id={option.id} className={`rounded-xl bg-white p-6 md:p-8 ${option.ours ? "border-2 border-navy" : "border border-line"}`}>
                <div className="flex flex-wrap items-baseline gap-3">
                  <h3 className="font-display text-2xl font-semibold text-navy">{i + 1}. {option.name}</h3>
                  {option.ours ? <span className="rounded-full bg-navy px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">Ours</span> : null}
                </div>
                <dl className="mt-5 grid gap-4 text-sm leading-7 md:grid-cols-2">
                  <div><dt className="font-bold text-navy">Cost</dt><dd className="text-ink">{option.cost}</dd></div>
                  <div><dt className="font-bold text-navy">Best for</dt><dd className="text-ink">{option.bestFor}</dd></div>
                  <div><dt className="font-bold text-navy">What you get</dt><dd className="text-ink">{option.gives}</dd></div>
                  <div><dt className="font-bold text-navy">The catch</dt><dd className="text-ink">{option.watch}</dd></div>
                </dl>
                <p className="mt-4 text-sm leading-7 text-muted"><strong className="text-navy">Compared with {brand}:</strong> {option.contrast(page)}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <OptionLink href={option.href}>{option.hrefLabel}</OptionLink>
                  <span className="text-xs text-muted">Checked {option.checked}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-xl border border-gold bg-gold-tint/40 p-6 md:p-8">
          <h2 className="font-display text-2xl font-semibold text-navy">{page.sameModel.heading}</h2>
          <p className="mt-3 leading-7 text-ink">{page.sameModel.body}</p>
        </section>

        <section className="space-y-5">
          <h2 className="font-display text-3xl font-semibold text-navy md:text-4xl">Moving away from {brand}</h2>
          <ol className="list-decimal space-y-3 pl-6 text-lg leading-8 text-ink">
            <li>Get your content out. {page.exportTip}</li>
            <li>Rebuild in the new tool and check it against the <Link href="/uk-cv-format" className="font-bold text-navy underline">UK CV format</Link>: British spelling, month-and-year dates, no photo or date of birth.</li>
            <li>Cancel your {brand} plan before the next renewal and keep the confirmation. <Link href={`${page.vsPath}#cancel`} className="font-bold text-navy underline">How to cancel {brand}</Link>.</li>
          </ol>
          <p className="leading-7 text-muted">
            Weighing up just WorkCV and {brand}? <Link href={page.vsPath} className="font-bold text-navy underline">WorkCV vs {brand}</Link> compares prices over time, downloads and renewal side by side.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/editor?template=classic&new=1" trackingLabel="alternatives_editor">Build and preview in WorkCV free</ButtonLink>
            <ButtonLink href="/tools/blank-cv-template-uk" variant="secondary" trackingLabel="alternatives_word_template">Get the free Word CV</ButtonLink>
          </div>
        </section>
      </div>

      <FaqSection faqs={faqs} title={`${brand} alternatives: common questions.`} />

      <section className="bg-paper py-14">
        <div className="container-page">
          <h2 className="font-display text-3xl font-semibold text-navy">Leaving a different CV builder?</h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {others.map((item) => (
              <li key={item.path}>
                <Link href={item.path} className="inline-flex items-center gap-2 rounded-md border border-line-strong bg-white px-4 py-3 text-sm font-bold text-navy hover:border-navy">
                  {item.brand} alternatives
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-6 text-muted">Product names belong to their owners. None of the providers listed is affiliated with WorkCV.</p>
        </div>
      </section>
    </>
  );
}
