import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ExternalLink, ShieldCheck } from "lucide-react";

import {
  ButtonLink,
  FaqSection,
  FinalCta,
  SectionLabel,
} from "@/components/marketing";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "CV Builder Scams UK? Avoid Trial Renewal Charges",
  description:
    "Learn how low-cost CV builder trials can become recurring charges, what to check before paying, and how WorkCV's one-time price differs.",
  alternates: {
    canonical: "/cv-builder-scams-uk",
  },
  openGraph: {
    title: "CV Builder Scams UK? Understand Trial Renewal Charges",
    description:
      "A factual UK guide to CV builder introductory prices, automatic renewals, cancellation evidence, and one-time alternatives.",
    url: "/cv-builder-scams-uk",
  },
};

const checkedDate = "29 June 2026";

const faqItems = [
  {
    question: "Are CV builders scams?",
    answer:
      "A low introductory price followed by an automatic renewal is not by itself a scam when the subscription terms are clearly disclosed. The practical risk is overlooking the renewal amount or date before paying.",
  },
  {
    question: "Why did my CV builder charge me again?",
    answer:
      "Some CV builders sell short introductory access that automatically becomes a recurring subscription unless you cancel. Check the receipt, checkout terms, account billing page, and card statement for the renewal frequency.",
  },
  {
    question: "Is WorkCV a recurring subscription?",
    answer:
      `No. WorkCV charges ${site.priceGbp} once to unlock one saved CV. There is no trial conversion or automatic renewal, and later edits and PDF downloads for that saved CV remain unlocked.`,
  },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "CV Builder Scams UK? How Trial Renewal Charges Work",
  description:
    "A factual UK guide to CV builder introductory prices, automatic renewals, cancellation evidence, and one-time alternatives.",
  datePublished: "2026-06-29",
  dateModified: "2026-06-29",
  author: {
    "@type": "Organization",
    name: site.name,
    url: site.url,
  },
  publisher: {
    "@type": "Organization",
    name: site.name,
    url: site.url,
  },
  mainEntityOfPage: `${site.url}/cv-builder-scams-uk`,
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function CvBuilderScamsUkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <article>
        <section className="quiet-grid bg-paper py-16 md:py-24">
          <div className="container-page">
            <div className="mb-8 flex flex-wrap items-center gap-2 text-sm font-bold text-muted">
              <Link href="/" className="hover:text-navy">Home</Link>
              <span>/</span>
              <span className="text-navy">CV builder charges UK</span>
            </div>
            <div className="max-w-4xl">
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
                Checked {checkedDate}
              </p>
              <h1 className="font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
                CV builder scams UK? Understand the charge before you pay.
              </h1>
              <p className="mt-7 max-w-3xl text-xl leading-8 text-muted">
                Searching for “CV builder scams UK” often starts with an
                unexpected renewal. Here is how the common introductory-price
                model works, what current official prices show, and how to
                avoid paying for access you no longer need.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-line bg-surface">
          <div className="container-page grid gap-4 py-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Check the renewal price",
              "Check the billing frequency",
              "Save cancellation proof",
              "Review your card statement",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-bold text-navy">
                <ShieldCheck className="h-5 w-5 shrink-0 text-success" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-paper py-20">
          <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="max-w-3xl space-y-10">
              <section>
                <SectionLabel>The pattern</SectionLabel>
                <h2 className="font-display text-4xl font-semibold text-navy">
                  A cheap first payment can start a recurring plan.
                </h2>
                <div className="mt-6 space-y-5 text-lg leading-8 text-muted">
                  <p>
                    Many CV builders let you write a CV before asking for
                    payment. At download, a small payment can buy seven or 14
                    days of premium access. Unless cancelled, that access then
                    renews at a much higher recurring price. The important
                    numbers are therefore the trial length, the renewal amount,
                    and whether billing is monthly or every four weeks.
                  </p>
                  <p>
                    This model is not automatically fraudulent. The providers
                    below publish subscription terms on official pages. The
                    problem arises when a shopper notices the introductory
                    price but misses what happens next. Government research
                    published in April 2026 estimated that 3.6 million unwanted
                    UK subscriptions resulted from free or discounted trial
                    rollovers, with £1.6 billion spent annually on unwanted
                    subscriptions overall.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="font-display text-4xl font-semibold text-navy">
                  What current CV builder prices show.
                </h2>
                <p className="mt-6 text-lg leading-8 text-muted">
                  Official pages checked {checkedDate} listed MyPerfectCV at
                  GBP 2.95 for 14 days, then GBP 16.95 every four weeks;
                  LiveCareer UK at GBP 1.95 for 14 days, then GBP 19.85 every
                  four weeks; Resume.io UK at GBP 2.95 for seven days, then GBP
                  20.95 every four weeks; and CVMaker UK at GBP 0.99 for seven
                  days, then GBP 19.99 per month. Prices can change, so verify
                  the checkout yourself before entering card details.
                </p>
                <p className="mt-5 text-lg leading-8 text-muted">
                  Before checkout, calculate the first year&apos;s cost rather
                  than only today&apos;s payment. A small starting price looks
                  different when up to thirteen four-week renewals are
                  included.
                </p>
              </section>

              <section>
                <h2 className="font-display text-4xl font-semibold text-navy">
                  UK subscription protections are changing.
                </h2>
                <div className="mt-6 space-y-5 text-lg leading-8 text-muted">
                  <p>
                    In April 2026, the UK government announced planned rules
                    intended to make subscription terms and cancellation
                    clearer. The measures include reminders before discounted
                    trials end, a straightforward way to cancel, and a new
                    cooling-off period after certain renewals. The government
                    estimated the changes could save consumers around GBP 400
                    million each year.
                  </p>
                  <p>
                    Those subscription-contract provisions are not a reason to
                    ignore today&apos;s checkout terms. Government guidance
                    says they are expected to come into force no earlier than
                    autumn 2026, with implementation details still being
                    developed when this guide was checked. Until they apply,
                    the safest approach is practical: read the renewal summary,
                    note the end of any trial, cancel through the provider&apos;s
                    stated route, and retain proof. A legitimate subscription
                    can still be poor value for someone who only wanted one CV
                    download, even when its terms were disclosed.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="font-display text-4xl font-semibold text-navy">
                  Before paying, answer four questions.
                </h2>
                <ol className="mt-6 space-y-4">
                  {[
                    "Is this a one-time purchase, a trial, or a subscription?",
                    "What exact amount is taken after the introductory period?",
                    "Does it renew monthly or every four weeks?",
                    "Where do I cancel, and will I receive written confirmation?",
                  ].map((item, index) => (
                    <li key={item} className="flex gap-4 text-lg leading-8 text-muted">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-navy text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
                <p className="mt-6 text-lg leading-8 text-muted">
                  Save a screenshot of the checkout terms and the receipt. If
                  you cancel, keep the confirmation email or support
                  transcript. If a recurring card payment continues, contact
                  the provider first and ask your card issuer to stop future
                  payments. Cancelling a payment does not remove any genuine
                  contractual amount you still owe.
                </p>
              </section>

              <section>
                <h2 className="font-display text-4xl font-semibold text-navy">
                  A simpler alternative: one saved CV, one payment.
                </h2>
                <p className="mt-6 text-lg leading-8 text-muted">
                  WorkCV uses a narrower model. Build and preview first, then
                  pay {site.price} once to unlock that saved CV. There is no
                  trial conversion, subscription, or automatic renewal. You can
                  return to the same CV, edit it, and download the updated PDF
                  without paying again. A separate new CV has its own one-time
                  unlock.
                </p>
                <div className="mt-8">
                  <ButtonLink href="/editor">Build my CV for {site.priceGbp}</ButtonLink>
                </div>
              </section>
            </div>

            <aside className="h-fit rounded-xl border border-line bg-surface p-6 lg:sticky lg:top-24">
              <h2 className="font-display text-2xl font-semibold text-navy">
                Verify the sources
              </h2>
              <div className="mt-5 space-y-4">
                {[
                  ["UK government subscription research", "https://www.gov.uk/government/consultations/consultation-on-the-implementation-of-the-new-subscription-contracts-regime/consultation-on-the-implementation-of-the-new-subscription-contracts-regime-web-accessible-version"],
                  ["MoneyHelper payment guidance", "https://www.moneyhelper.org.uk/en/everyday-money/banking/direct-debits-and-standing-orders"],
                  ["MyPerfectCV pricing", "https://www.myperfectcv.co.uk/pricing"],
                  ["LiveCareer UK pricing", "https://www.livecareer.co.uk/pricing"],
                  ["Resume.io UK pricing", "https://resume.io/uk/pricing"],
                  ["CVMaker UK pricing", "https://www.cvmaker.uk/help/what-are-the-costs-of-cvmaker-uk"],
                ].map(([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="flex items-start justify-between gap-3 text-sm font-bold leading-6 text-navy underline decoration-line-strong underline-offset-4"
                  >
                    {label}
                    <ExternalLink className="mt-1 h-4 w-4 shrink-0" />
                  </a>
                ))}
              </div>
              <Link
                href="/pricing"
                className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-navy"
              >
                Compare all prices
                <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          </div>
        </section>
      </article>

      <FaqSection faqs={faqItems} title="Questions about CV builder charges." />
      <FinalCta
        heading="Build your CV without starting a subscription."
        body={`Build and preview first. Pay ${site.price} once for this saved CV, with no trial conversion or automatic renewal.`}
        secondaryHref="/pricing"
        secondary="See pricing guarantee"
      />
    </>
  );
}
