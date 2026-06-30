import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, Scale, ShieldCheck } from "lucide-react";

import { FaqSection, SectionLabel } from "@/components/marketing";
import { RedundancyPayCalculator } from "@/components/redundancy-pay-calculator";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Redundancy Pay Calculator UK 2026",
  description:
    "Estimate statutory redundancy pay using current 2026 weekly caps, age bands and the 20-year service limit for Great Britain and Northern Ireland.",
  alternates: { canonical: "/tools/redundancy-pay-calculator" },
  openGraph: {
    title: "UK Redundancy Pay Calculator 2026",
    description:
      "Calculate statutory redundancy weeks and pay with a year-by-year breakdown using current UK limits.",
    url: "/tools/redundancy-pay-calculator",
  },
};

const faqItems = [
  {
    question: "Who normally qualifies for statutory redundancy pay?",
    answer:
      "You normally need employee status and at least 2 complete years of continuous service with the employer. Some workers are excluded, and refusing suitable alternative employment without good reason can affect entitlement.",
  },
  {
    question: "What is the maximum weekly pay for redundancy in 2026?",
    answer:
      "For employment ending on or after 6 April 2026, the Great Britain cap is GBP 751 and the maximum statutory payment is GBP 22,530. Northern Ireland currently uses GBP 783, giving a maximum of GBP 23,490.",
  },
  {
    question: "How do the redundancy age bands work?",
    answer:
      "Each complete service year earns half a week's pay if that full year began under age 22, one week from age 22 to 40, or one and a half weeks from age 41. The calculator counts backwards from the employment end date and uses at most the latest 20 complete years.",
  },
  {
    question: "Is redundancy pay tax free?",
    answer:
      "Up to GBP 30,000 of qualifying statutory redundancy and other eligible termination payments can usually be exempt from Income Tax. Notice pay, holiday pay, wages and some other elements are taxable separately, so the treatment of the whole package needs to be checked.",
  },
  {
    question: "What does the enhanced estimate mean?",
    answer:
      "It is only a comparison scenario for an employer scheme that uses the statutory age-and-service week count. Employer formulas vary and may use different service rules, caps, actual pay or fixed additions. Your written scheme determines the real contractual amount.",
  },
];

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "WorkCV UK Redundancy Pay Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  url: `${site.url}/tools/redundancy-pay-calculator`,
  description:
    "A browser-based statutory redundancy pay estimator using current 2026 UK age bands, service limits and weekly pay caps.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function RedundancyPayCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="quiet-grid border-b border-line bg-paper py-14 md:py-20">
        <div className="container-page">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              Free UK redundancy tool
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.06] text-navy md:text-6xl">
              Redundancy pay calculator UK 2026.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              Estimate statutory redundancy pay from your age, complete service
              years and gross weekly pay. See every counted year and compare an
              employer-enhanced scenario without confusing it with the legal
              minimum.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy">
              <span className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-success" />
                £751 GB cap
              </span>
              <span className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-gold" />
                £783 Northern Ireland cap
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#63788c]" />
                Private browser calculation
              </span>
            </div>
          </div>

          <div className="mt-10 rounded-lg border border-line-strong bg-surface p-5 shadow-soft md:p-7">
            <RedundancyPayCalculator />
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>How the calculation works</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Complete years, age bands and a weekly cap.
            </h2>
            <p className="mt-6 text-base leading-8 text-muted">
              Statutory redundancy pay normally starts after 2 complete years
              of continuous employment. Each full service year is worth half a
              week of pay when the whole year began below age 22, one week from
              age 22 to 40, or one and a half weeks from age 41. Only the latest
              20 complete years can count.
            </p>
            <p className="mt-4 text-base leading-8 text-muted">
              Weekly pay is gross pay before tax. Where hours or pay vary,
              official guidance generally uses an average over the relevant
              12-week period and can include guaranteed overtime or contractual
              commission. Family-related leave and payment in lieu of notice
              can require special treatment, so the dates and weekly pay on an
              employer calculation may differ from a simple payslip figure.
            </p>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {[
              [
                "Confirm continuous service",
                "Use the legally relevant employment end date. Statutory notice can sometimes extend the date used when employment ends immediately.",
              ],
              [
                "Use the correct weekly pay",
                "Enter normal gross weekly pay or the applicable 12-week average. The calculator then applies the current regional cap.",
              ],
              [
                "Separate statutory and enhanced pay",
                "The legal minimum has a fixed formula. An employer scheme can be more generous but only its written terms show the real calculation.",
              ],
            ].map(([title, body], index) => (
              <article key={title} className="grid gap-4 py-6 sm:grid-cols-[44px_1fr]">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-paper text-sm font-bold text-navy">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-semibold text-navy">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionLabel>Current legal limits</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Updated for employment ending from 6 April 2026.
            </h2>
            <p className="mt-6 text-base leading-8 text-muted">
              GOV.UK and Acas confirm a £751 weekly cap and £22,530 maximum
              statutory payment in England, Scotland and Wales. Northern
              Ireland&apos;s official nidirect guidance uses £783 per week. The
              amount changes each April, so an earlier employment end date may
              require the cap for that earlier year.
            </p>
            <p className="mt-4 text-sm leading-7 text-muted">
              This tool is an estimate, not legal advice. Eligibility can be
              affected by employment status, suitable alternative work, early
              departure, insolvency, exclusions and the date produced by
              statutory notice rules.
            </p>
            <p className="mt-4 text-sm font-bold text-navy">
              Rules reviewed 30 June 2026.
            </p>
          </div>
          <div className="grid content-start gap-3 text-sm font-bold text-navy">
            {[
              ["GOV.UK: statutory redundancy pay", "https://www.gov.uk/redundancy-your-rights/redundancy-pay"],
              ["Acas: redundancy pay and special cases", "https://www.acas.org.uk/your-rights-during-redundancy/redundancy-pay"],
              ["nidirect: Northern Ireland redundancy pay", "https://www.nidirect.gov.uk/articles/redundancy-pay"],
              ["GOV.UK: tax on termination payments", "https://www.gov.uk/termination-payments-and-tax-when-you-leave-a-job"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-line bg-white p-4 hover:border-navy"
              >
                {label}
              </a>
            ))}
            <Link
              href="/situations/made-redundant"
              className="rounded-md border border-line bg-white p-4 hover:border-navy"
            >
              What to do after being made redundant
            </Link>
            <Link
              href="/tools/notice-period-calculator"
              className="rounded-md border border-line bg-white p-4 hover:border-navy"
            >
              Calculate your statutory notice dates
            </Link>
            <Link
              href="/cv-employment-gap-uk"
              className="rounded-md border border-line bg-white p-4 hover:border-navy"
            >
              Explain an employment gap on your CV
            </Link>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqItems} title="UK redundancy pay questions." />
    </>
  );
}
