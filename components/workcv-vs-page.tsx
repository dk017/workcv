import Link from "next/link";
import { ArrowRight, Building2, Check } from "lucide-react";

import { ComparisonTable } from "@/components/comparison-table";
import { ButtonLink, FaqSection, FinalCta, SectionLabel } from "@/components/marketing";
import { PassOffer } from "@/components/pass-offer";
import { analyticsPlacements } from "@/lib/analytics-placements";
import { costOverDays, formatMinor } from "@/lib/competitor-plans";
import { site } from "@/lib/site";
import { workcvVsBrands, type WorkcvVsBrand } from "@/lib/workcv-vs";

// One competitor against WorkCV, answer first, with a dated "how to cancel"
// section for visitors redirected from the old cancellation guides.

const workCvChoose = [
  "You need a finished UK CV and cover letter, not an ongoing membership",
  `You want to pay ${site.price} once for one CV and its matching letter, as PDF and Word`,
  `You are applying for several jobs: ${site.passPrice} once covers ${site.passDays} days of CVs and letters`,
  "You never want to remember to cancel anything",
  "You are happy with three clean UK layouts rather than dozens of designs",
];

const workCvFaqs = (brand: string) => [
  { question: `What does WorkCV's ${site.price} include?`, answer: `One saved CV and its matching cover letter, each downloadable as PDF and editable Word. You can keep editing and re-downloading that pair. A separate CV needs another purchase, or the ${site.passPrice} Job Search Pass, which covers any number of CVs and letters for ${site.passDays} days. Neither renews.` },
  { question: `Will WorkCV cancel my ${brand} subscription?`, answer: `No. Cancel directly with ${brand} using the steps on this page, and keep the confirmation. Buying WorkCV doesn't change another provider's billing.` },
  { question: "Who wrote this comparison?", answer: `WorkCV, which sells the WorkCV plans described here. ${brand} is not affiliated with WorkCV. Prices and steps link to ${brand}'s own pages, with the date we checked them.` },
];

function costRows(page: WorkcvVsBrand) {
  const trial = page.pricing.trial!;
  const money = (days: number) => formatMinor(costOverDays(trial, days), trial.currency);
  return [
    ["First payment", formatMinor(trial.entryMinor, trial.currency), `${site.price} for one CV and letter, or ${site.passPrice} for the Pass`],
    ["Total after 4 weeks if not cancelled", money(28), "No further charge"],
    ["Total after 90 days if not cancelled", money(90), "No further charge"],
    ["Other plans", page.pricing.otherPlans, "None; nothing renews"],
  ];
}

export function WorkcvVsPage({ page }: { page: WorkcvVsBrand }) {
  const { brand, pricing, cancel } = page;
  const faqs = [...page.faqs, ...workCvFaqs(brand)];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };
  const others = workcvVsBrands.filter((item) => item.path !== page.path);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />

      <section className="quiet-grid bg-paper py-16 md:py-24">
        <div className="container-page max-w-4xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">WorkCV vs {brand} · UK comparison</p>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] text-navy md:text-6xl">WorkCV vs {brand}</h1>
          <div className="mt-8 rounded-xl border-2 border-navy bg-white p-6 shadow-soft md:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-success">Short answer</p>
            <div className="mt-3 space-y-4 text-lg leading-8 text-ink">
              {page.shortAnswer.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <p className="mt-5 text-sm leading-6 text-muted">
              {brand} prices checked {pricing.checked} on its official pages. WorkCV publishes this comparison and sells the WorkCV
              plans in it; we say where {brand} is the better fit.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/editor?template=classic&new=1" trackingLabel="workcv_vs_hero_editor">Try WorkCV free</ButtonLink>
            <ButtonLink href="#cancel" variant="secondary" trackingLabel="workcv_vs_jump_cancel">How to cancel {brand}</ButtonLink>
          </div>
        </div>
      </section>

      {page.operatorNote ? (
        <section className="bg-surface py-14">
          <div className="container-page max-w-4xl">
            <div className="flex gap-4 rounded-xl border border-gold bg-gold-tint/40 p-6">
              <Building2 className="mt-1 h-6 w-6 shrink-0 text-navy" aria-hidden="true" />
              <div>
                <h2 className="font-display text-2xl font-semibold text-navy">Who runs {brand}</h2>
                <p className="mt-3 leading-7 text-muted">{brand}&apos;s terms of use name {page.operatorNote}</p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section id="cost" className="bg-paper py-20">
        <div className="container-page">
          <SectionLabel>Cost</SectionLabel>
          <h2 className="max-w-4xl font-display text-4xl font-semibold text-navy md:text-5xl">What you pay with each.</h2>
          {pricing.trial ? (
            <>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
                {brand}&apos;s trial renews automatically. These totals assume it is never cancelled, using the renewal terms {brand} publishes. {pricing.note}
              </p>
              <ComparisonTable caption={`Cost over time: ${brand} and WorkCV`} headers={["", brand, "WorkCV"]} rows={costRows(page)} />
              <blockquote className="mt-6 rounded-lg border border-line bg-white p-5 text-sm leading-6 text-muted">
                <span className="font-bold text-navy">{brand}&apos;s renewal terms:</span> &ldquo;{pricing.trial.renewalWording}&rdquo;
              </blockquote>
            </>
          ) : (
            <div className="mt-5 max-w-3xl space-y-4 text-lg leading-8 text-muted">
              <p>{pricing.otherPlans} {pricing.note}</p>
              <p>WorkCV: {site.price} once for one CV and its matching letter, or {site.passPrice} once for {site.passDays} days of applications. Nothing renews.</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page">
          <SectionLabel>Side by side</SectionLabel>
          <h2 className="max-w-4xl font-display text-4xl font-semibold text-navy md:text-5xl">WorkCV and {brand} compared.</h2>
          <ComparisonTable caption={`${brand} vs WorkCV, checked ${pricing.checked}`} headers={["Area", brand, "WorkCV"]} rows={page.rows} />
          <p className="mt-6 max-w-3xl leading-7 text-muted"><strong className="text-navy">{brand} free plan:</strong> {pricing.freePlan}</p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          {[
            { title: `Choose ${brand} if`, items: page.chooseBrand, highlight: false },
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

      <section id="cancel" className="scroll-mt-24 bg-surface py-20">
        <div className="container-page max-w-4xl">
          <SectionLabel>Already subscribed?</SectionLabel>
          <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">How to cancel {brand} in the UK</h2>
          <ol className="mt-8 list-decimal space-y-3 pl-6 text-lg leading-8 text-ink">
            {cancel.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
          <p className="mt-6 leading-7 text-muted">{cancel.afterCancelling}</p>
          {cancel.statement ? <p className="mt-3 leading-7 text-muted">On your statement, {brand} charges may show as {cancel.statement}.</p> : null}
          <p className="mt-3 leading-7 text-muted">
            If you have cancelled and a recurring card payment still goes out, your card provider must stop it when you ask. See the{" "}
            <a href="https://www.fca.org.uk/consumers/recurring-card-payments" target="_blank" rel="noopener noreferrer" className="font-bold text-navy underline">FCA guide to recurring card payments</a>.
          </p>
          <p className="mt-6 text-sm leading-6 text-muted">
            Steps checked {cancel.checked} against {brand}&apos;s own pages:{" "}
            {cancel.sources.map(([label, href], i) => (
              <span key={href}>{i > 0 ? ", " : ""}<a href={href} target="_blank" rel="nofollow noopener noreferrer" className="font-bold text-navy underline">{label}</a></span>
            ))}
            . Account screens change, so follow what your account shows if it differs.
          </p>
        </div>
      </section>

      <section className="bg-paper py-14">
        <div className="container-page">
          <h2 className="font-display text-3xl font-semibold text-navy">Compare further</h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {[[`${brand} alternatives for UK job seekers`, page.alternativeHref], ["CV builder without a subscription", "/cv-builder-no-subscription-uk"], ...others.map((item): [string, string] => [`WorkCV vs ${item.brand}`, item.path])].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="inline-flex items-center gap-2 rounded-md border border-line-strong bg-white px-4 py-3 text-sm font-bold text-navy hover:border-navy">
                  {label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-6 text-muted">
            {brand} is not affiliated with WorkCV; product names belong to their owners. Check{" "}
            <a href={pricing.source} target="_blank" rel="nofollow noopener noreferrer" className="font-bold text-navy underline">{brand}&apos;s current pricing</a>{" "}
            before you pay.
          </p>
        </div>
      </section>

      <PassOffer audience="switching" trackingLabel={analyticsPlacements.passSwitchingComparison} />
      <FaqSection faqs={faqs} title={`WorkCV vs ${brand}: common questions.`} />
      <FinalCta
        heading="Want a UK CV without a renewing trial?"
        body={`Build and preview free. Pay ${site.price} once to download one CV and its matching cover letter, or ${site.passPrice} once for ${site.passDays} days of applications. Nothing renews.`}
        primaryHref="/editor?template=classic&new=1"
        primary="Build my UK CV"
        secondaryHref="/pricing"
        secondary="Compare WorkCV plans"
        trackingContext="workcv_vs_final_cta"
      />
    </>
  );
}
