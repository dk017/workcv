import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ExternalLink, ShieldCheck } from "lucide-react";

import {
  ButtonLink,
  FaqSection,
  FinalCta,
  SectionLabel,
} from "@/components/marketing";
import { buildWorkCvProductSchema } from "@/lib/product-schema";
import { site } from "@/lib/site";

const checkedDate = "13 June 2026";

export const metadata: Metadata = {
  title: "Best MyPerfectCV Alternative UK - No Subscription",
  description:
    "Looking for a MyPerfectCV alternative in the UK? Compare MyPerfectCV's trial-to-renewal pricing with WorkCV's GBP 4.99 PDF download model.",
  alternates: {
    canonical: "/myperfectcv-alternative-uk",
  },
  openGraph: {
    title: "MyPerfectCV Alternative UK - WorkCV",
    description:
      "A focused UK CV builder for people who want one CV PDF without a monthly CV builder subscription.",
    url: "/myperfectcv-alternative-uk",
  },
};

const comparisonRows = [
  ["Entry model", "GBP 2.95 for 14 days", "Free to build"],
  ["Renewal", "GBP 16.95 every 4 weeks", "No monthly renewal"],
  ["PDF download", "Included with premium access", "GBP 4.99 when ready"],
  ["Cancellation", "Needed to stop renewal", "Nothing to cancel"],
  ["Cover letters", "Included in premium tools", "Not included in this version"],
  ["Best fit", "Ongoing CV and cover-letter access", "One finished UK CV PDF"],
];

const workCvBenefits = [
  "Build and preview before paying",
  "GBP 4.99 PDF download",
  "No monthly CV builder subscription",
  "No automatic renewal",
  "UK-focused CV structure",
  "Clean, practical templates",
];

const faqItems = [
  {
    question: "What is a good MyPerfectCV alternative in the UK?",
    answer:
      "If you want a CV builder without monthly renewal, WorkCV is a focused alternative. You build first and pay GBP 4.99 when you download your finished CV as a PDF.",
  },
  {
    question: "How is WorkCV different from MyPerfectCV?",
    answer:
      "MyPerfectCV offers broader CV and cover-letter tools with premium access that can renew. WorkCV is narrower: it focuses on one UK CV PDF download with no monthly CV builder subscription.",
  },
  {
    question: "How much does MyPerfectCV cost?",
    answer:
      "On the official pricing page checked 13 June 2026, MyPerfectCV listed GBP 2.95 for 14 days, then automatic renewal at GBP 16.95 every 4 weeks.",
  },
  {
    question: "Does WorkCV include cover letters?",
    answer:
      "Not in this version. WorkCV is currently focused on helping you build and download a clean UK CV PDF.",
  },
  {
    question: "Do I need to cancel WorkCV?",
    answer:
      "No. WorkCV does not use a monthly subscription in the standard CV download flow, so there is no automatic renewal to cancel.",
  },
];

const productSchema = buildWorkCvProductSchema({
  description:
    "UK CV builder positioned as a no-subscription alternative for people who need one finished CV PDF.",
  url: `${site.url}/myperfectcv-alternative-uk`,
});

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

export default function MyPerfectCvAlternativeUkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="quiet-grid bg-paper py-20 md:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              MyPerfectCV alternative UK
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              A MyPerfectCV alternative without monthly CV billing.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              MyPerfectCV may suit people who need ongoing CV and cover-letter
              tools. If you only need one clean UK CV PDF, WorkCV keeps the
              pricing simpler: build first, pay {site.price} when you download.
            </p>
            <div className="mt-8 grid gap-3 text-sm font-bold text-navy sm:grid-cols-2">
              {[
                "No monthly subscription",
                "No automatic renewal",
                "Free to build before paying",
                "GBP 4.99 PDF download",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="h-5 w-5 shrink-0 text-success" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/editor">Build my CV for GBP 4.99</ButtonLink>
              <ButtonLink href="#compare" variant="secondary">
                Compare options
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-[20px] border-2 border-navy bg-white p-8 shadow-soft">
            <h2 className="font-display text-3xl font-semibold text-navy">
              WorkCV at a glance
            </h2>
            <div className="mt-6 font-display text-6xl font-semibold leading-none text-navy">
              GBP 4.99
            </div>
            <p className="mt-3 text-sm font-bold uppercase tracking-[0.14em] text-muted">
              when you download your PDF
            </p>
            <ul className="mt-7 space-y-3">
              {workCvBenefits.slice(0, 4).map((item) => (
                <li key={item} className="flex gap-3 text-sm font-bold text-navy">
                  <Check className="h-5 w-5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-7 text-sm leading-6 text-muted">
              Best for job seekers who need a finished CV PDF and do not want a
              recurring CV builder plan.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-page grid gap-4 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {["Build first", "Pay at download", "No renewal", "UK CV structure"].map(
            (item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-bold text-navy">
                <ShieldCheck className="h-5 w-5 shrink-0 text-success" />
                {item}
              </div>
            )
          )}
        </div>
      </section>

      <section id="compare" className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Comparison</SectionLabel>
          <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
            <div>
              <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
                Choose based on how much access you actually need.
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                The question is not whether MyPerfectCV has more features. It
                does. The question is whether you need a broader premium toolset
                or just one finished UK CV PDF.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-paper p-5">
              <p className="text-sm leading-6 text-muted">
                MyPerfectCV pricing checked {checkedDate} from its official
                pricing page. Pricing and product features can change.
              </p>
              <a
                href="https://www.myperfectcv.co.uk/pricing"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-navy underline decoration-line-strong underline-offset-4"
                rel="nofollow noopener noreferrer"
                target="_blank"
              >
                Check official MyPerfectCV pricing
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="mt-10 overflow-hidden rounded-xl border border-line bg-white">
            <div className="grid grid-cols-[0.8fr_1fr_1fr] bg-navy px-5 py-4 text-sm font-bold text-white">
              <span>Area</span>
              <span>MyPerfectCV</span>
              <span>WorkCV</span>
            </div>
            {comparisonRows.map(([area, myperfectcv, workcv]) => (
              <div
                key={area}
                className="grid grid-cols-1 border-t border-line text-sm md:grid-cols-[0.8fr_1fr_1fr]"
              >
                <div className="bg-paper p-5 font-bold text-navy">{area}</div>
                <div className="p-5 text-muted">{myperfectcv}</div>
                <div className="bg-greensoft p-5 font-bold text-navy">{workcv}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionLabel>Why WorkCV</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Built for the one-CV job search moment.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              If you are updating your CV for applications this week, you may
              not need a recurring career platform. WorkCV keeps the workflow
              focused on writing, previewing, and downloading a practical UK CV.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {workCvBenefits.map((item) => (
              <div key={item} className="rounded-xl border border-line bg-white p-5">
                <Check className="h-5 w-5 text-success" />
                <p className="mt-4 text-sm font-bold leading-6 text-navy">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div className="rounded-xl border border-line bg-paper p-6">
            <h2 className="font-display text-3xl font-semibold text-navy">
              Already subscribed to MyPerfectCV?
            </h2>
            <p className="mt-4 leading-7 text-muted">
              Cancel through the official MyPerfectCV process first, then keep
              the cancellation confirmation for your records.
            </p>
            <Link
              href="/cancel-myperfectcv-uk"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy underline decoration-line-strong underline-offset-4"
            >
              Read the cancellation guide
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-xl border-2 border-navy bg-white p-6 shadow-sm">
            <h2 className="font-display text-3xl font-semibold text-navy">
              Ready to build without a renewal?
            </h2>
            <p className="mt-4 leading-7 text-muted">
              Start with WorkCV, preview your CV, and pay only when the PDF is
              ready to download.
            </p>
            <div className="mt-6">
              <ButtonLink href="/editor">Create my CV</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqItems} title="Questions about MyPerfectCV alternatives." />
      <FinalCta
        heading="Build your CV without the monthly renewal."
        body={`WorkCV is ${site.price} when you download your PDF. No monthly CV builder subscription and no automatic renewal.`}
        secondaryHref="/pricing"
        secondary="Compare pricing"
      />
    </>
  );
}
