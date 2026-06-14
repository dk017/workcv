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
  title: "Resume.io Alternative UK - No Subscription CV Builder",
  description:
    "Looking for a Resume.io alternative in the UK? Compare Resume.io's 7-day trial and renewal pricing with WorkCV's GBP 4.99 PDF download model.",
  alternates: {
    canonical: "/resume-io-alternative-uk",
  },
  openGraph: {
    title: "Resume.io Alternative UK - WorkCV",
    description:
      "A focused UK CV builder for people who want one CV PDF without a monthly CV builder subscription.",
    url: "/resume-io-alternative-uk",
  },
};

const comparisonRows = [
  ["Entry model", "GBP 2.95 for 7 days", "Free to build"],
  ["Renewal", "GBP 20.95 every 4 weeks", "No monthly renewal"],
  ["Download access", "Trial includes download formats", "GBP 4.99 when ready"],
  ["Cancellation", "Needed before renewal", "Nothing to cancel"],
  ["Cover letters", "Included in trial/premium tools", "Not included in this version"],
  ["Best fit", "Broader CV and cover-letter platform", "One finished UK CV PDF"],
];

const benefits = [
  "Build and preview before paying",
  "GBP 4.99 PDF download",
  "No monthly CV builder subscription",
  "No automatic renewal",
  "UK-focused CV sections",
  "Clean templates for applications",
];

const faqItems = [
  {
    question: "What is a good Resume.io alternative in the UK?",
    answer:
      "If you want to avoid monthly renewal, WorkCV is a focused UK alternative. You build and preview first, then pay GBP 4.99 when you download the finished CV PDF.",
  },
  {
    question: "How is WorkCV different from Resume.io?",
    answer:
      "Resume.io is a broader CV/resume and cover-letter platform with a 7-day trial that can renew. WorkCV focuses on one UK CV PDF download with no monthly CV builder subscription.",
  },
  {
    question: "How much does Resume.io cost in the UK?",
    answer:
      "On the UK pricing page checked 13 June 2026, Resume.io listed a 7-day trial at GBP 2.95 that auto-renews to GBP 20.95 billed every 4 weeks.",
  },
  {
    question: "Does WorkCV include cover letters?",
    answer:
      "Not in this version. WorkCV is currently focused on helping UK job seekers create and download a clear CV PDF.",
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
  url: `${site.url}/resume-io-alternative-uk`,
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

export default function ResumeIoAlternativeUkPage() {
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
              Resume.io alternative UK
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              A Resume.io alternative without monthly CV billing.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              Resume.io may suit people who want broader CV, resume, and
              cover-letter tools. If you only need one UK CV PDF, WorkCV keeps
              the model simpler: build first, pay {site.price} when you download.
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
              {benefits.slice(0, 4).map((item) => (
                <li key={item} className="flex gap-3 text-sm font-bold text-navy">
                  <Check className="h-5 w-5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-7 text-sm leading-6 text-muted">
              Best for job seekers who need a finished UK CV PDF and do not want
              a recurring CV builder plan.
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
                Pick the model that matches the job.
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                Resume.io gives broad trial access to CV tools, templates,
                cover letters, and download formats. WorkCV is intentionally
                narrower: one UK CV workflow and one clear PDF download price.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-paper p-5">
              <p className="text-sm leading-6 text-muted">
                Resume.io UK pricing checked {checkedDate} from its official
                pricing page. Pricing and product details can change.
              </p>
              <a
                href="https://resume.io/uk/pricing"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-navy underline decoration-line-strong underline-offset-4"
                rel="nofollow noopener noreferrer"
                target="_blank"
              >
                Check official Resume.io UK pricing
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="mt-10 overflow-hidden rounded-xl border border-line bg-white">
            <div className="grid grid-cols-[0.8fr_1fr_1fr] bg-navy px-5 py-4 text-sm font-bold text-white">
              <span>Area</span>
              <span>Resume.io UK</span>
              <span>WorkCV</span>
            </div>
            {comparisonRows.map(([area, resumeIo, workcv]) => (
              <div
                key={area}
                className="grid grid-cols-1 border-t border-line text-sm md:grid-cols-[0.8fr_1fr_1fr]"
              >
                <div className="bg-paper p-5 font-bold text-navy">{area}</div>
                <div className="p-5 text-muted">{resumeIo}</div>
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
              A focused CV builder for UK applications.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              WorkCV is built around a simple use case: create a readable UK CV,
              preview it, and download the PDF when it is ready. No recurring
              CV builder account is needed.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((item) => (
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
              Already subscribed to Resume.io?
            </h2>
            <p className="mt-4 leading-7 text-muted">
              Use the official cancellation form and complete the email
              confirmation step before relying on cancellation being complete.
            </p>
            <Link
              href="/cancel-resume-io-uk"
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

      <FaqSection faqs={faqItems} title="Questions about Resume.io alternatives." />
      <FinalCta
        heading="Build your CV without the monthly renewal."
        body={`WorkCV is ${site.price} when you download your PDF. No monthly CV builder subscription and no automatic renewal.`}
        secondaryHref="/pricing"
        secondary="Compare pricing"
      />
    </>
  );
}
