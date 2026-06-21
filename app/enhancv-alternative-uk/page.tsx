import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ExternalLink,
  FileText,
  LayoutTemplate,
  ShieldCheck,
  Wand2,
} from "lucide-react";

import {
  ButtonLink,
  FaqSection,
  FinalCta,
  SectionLabel,
} from "@/components/marketing";
import { buildWorkCvProductSchema } from "@/lib/product-schema";
import { site } from "@/lib/site";

const checkedDate = "21 June 2026";

export const metadata: Metadata = {
  title: "Enhancv Alternative UK - No Subscription CV Builder",
  description:
    "Compare Enhancv with WorkCV for UK applications. See verified differences in subscriptions, AI tools, cover letters, templates and the £4.99 saved-CV PDF unlock.",
  alternates: {
    canonical: "/enhancv-alternative-uk",
  },
  openGraph: {
    title: "Enhancv Alternative UK - WorkCV",
    description:
      "An evidence-based comparison between Enhancv's broader subscription platform and WorkCV's focused no-subscription UK CV builder.",
    url: "/enhancv-alternative-uk",
  },
};

const comparisonRows = [
  ["Primary focus", "Global resume and career-tool platform", "Focused UK CV builder"],
  ["Free access", "Seven-day free plan with limits and Enhancv branding", "Build and preview before payment"],
  ["Paid model", "Pro subscription", `${site.price} unlock for the selected saved CV`],
  ["Renewal", "Monthly, quarterly or semiannual plans renew automatically unless cancelled", "No monthly plan or automatic renewal"],
  ["Documents", "Multiple resumes and cover letters on Pro", "One saved CV per payment; no cover-letter builder currently"],
  ["AI tools", "Content suggestions, ATS check, tailoring, feedback and generators", "No AI scoring or interview guarantee"],
  ["Job-search tools", "Application tracking and additional career features", "CV editor, saved document and PDF access"],
  ["Templates", "Broad resume template and design catalogue", "Classic, modern and compact UK CV layouts"],
  ["PDF access", "PDF download; edit access changes when Pro expires", "PDF access linked to the paid saved CV"],
  ["Best fit", "Ongoing resume optimisation and broader job-search tools", "A straightforward UK CV without recurring billing"],
];

const enhancvStrengths = [
  "Multiple resumes and cover letters on Pro",
  "AI-assisted resume feedback and content suggestions",
  "ATS check and job-description tailoring tools",
  "Application tracking and interview-preparation features",
  "Translation and a wider design/template catalogue",
  "More control for people maintaining many applications",
];

const workCvStrengths = [
  "UK CV terminology and section guidance",
  "Build and inspect the preview before checkout",
  `${site.price} payment linked to the selected saved CV`,
  "No monthly WorkCV subscription",
  "No automatic renewal or cancellation task",
  "A narrower interface with fewer product decisions",
];

const pricingFacts = [
  {
    title: "Enhancv Free",
    body:
      "Enhancv's official pricing page describes a seven-day free plan with all resume templates, basic sections, Enhancv branding and a maximum of 12 section items.",
  },
  {
    title: "Enhancv Pro",
    body:
      "Enhancv's official help centre says Pro is sold as monthly, quarterly and semiannual subscriptions. Each period renews automatically unless the user cancels before the next billing date.",
  },
  {
    title: "Regional price",
    body:
      "Enhancv says prices may vary by region, currency and tax, with the final amount shown after billing details. We could not verify a stable UK-localised amount, so this page does not quote one.",
  },
  {
    title: "WorkCV",
    body: `WorkCV lets you build and preview first. ${site.price} unlocks PDF access for the selected saved CV, without starting a monthly subscription or automatic renewal.`,
  },
];

const faqItems = [
  {
    question: "What is a good Enhancv alternative in the UK?",
    answer:
      `WorkCV may suit someone who needs a focused UK CV and does not want a recurring resume-platform subscription. It costs ${site.price} to unlock PDF access for the selected saved CV. Enhancv may suit users who want multiple resumes, cover letters, AI feedback and broader job-search tools.`,
  },
  {
    question: "How is WorkCV different from Enhancv?",
    answer:
      "Enhancv is a broader resume platform with AI tools, cover letters, ATS checking, application tracking and renewable Pro plans. WorkCV is narrower: it provides a saved UK CV editor, three layouts and a no-subscription PDF unlock for one saved CV.",
  },
  {
    question: "How much does Enhancv cost in the UK?",
    answer:
      "Enhancv says prices can vary by region, currency and tax, and that the final price appears after billing details. Check Enhancv's official pricing or checkout page for the current amount. This comparison does not publish an unverified GBP figure.",
  },
  {
    question: "Does Enhancv have a free plan?",
    answer:
      "Enhancv's official pricing page describes a seven-day free plan with limits, basic sections and Enhancv branding. Check the live pricing page because plan details can change.",
  },
  {
    question: "Does Enhancv renew automatically?",
    answer:
      "Enhancv's official Pro plan help says monthly, quarterly and semiannual subscriptions renew automatically for another billing period unless cancelled before the next billing date.",
  },
  {
    question: "Does WorkCV include AI feedback or ATS scoring?",
    answer:
      "No. WorkCV currently provides clear layouts, guided CV fields and a live preview. It does not claim to score, optimise or guarantee ATS performance.",
  },
  {
    question: "Does WorkCV include cover letters?",
    answer:
      "Not in the current version. Enhancv Pro includes resumes and cover letters, while WorkCV is currently focused on creating and downloading one saved UK CV.",
  },
  {
    question: "How do I cancel Enhancv if I already subscribe?",
    answer:
      "Enhancv's official help directs users to the Billing page, then through Cancel Subscription, a survey and final confirmation. Use the separate WorkCV cancellation guide for sourced steps and links.",
  },
];

const sources = [
  ["Enhancv pricing", "https://enhancv.com/pricing/"],
  [
    "Understanding Enhancv Pro plans",
    "https://help.enhancv.com/en/articles/1195346-understanding-the-enhancv-pro-plans",
  ],
  [
    "Enhancv cancellation help",
    "https://help.enhancv.com/en/articles/2794038-how-do-i-cancel-my-plan-and-stop-future-charges",
  ],
  ["Enhancv features", "https://enhancv.com/features/"],
  ["Enhancv terms", "https://enhancv.com/terms/"],
];

const productSchema = buildWorkCvProductSchema({
  description:
    "Focused UK CV builder positioned as a no-subscription alternative for people who do not need a broader renewable resume platform.",
  url: `${site.url}/enhancv-alternative-uk`,
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

export default function EnhancvAlternativeUkPage() {
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
              Enhancv alternative UK
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              Choose the smaller tool when you only need the CV.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              Enhancv combines resume design, AI feedback, cover letters and
              job-search tools in renewable Pro plans. WorkCV is narrower: build
              a UK CV, preview it, and pay {site.price} to unlock the selected
              saved CV without starting a monthly subscription.
            </p>
            <div className="mt-8 grid gap-3 text-sm font-bold text-navy sm:grid-cols-2">
              {[
                "Current official sources checked",
                "No invented UK price",
                "Product limitations disclosed",
                "Direct editor route",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="h-5 w-5 shrink-0 text-success" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/editor">Build my UK CV</ButtonLink>
              <ButtonLink href="#compare" variant="secondary">
                Compare both products
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-[20px] border-2 border-navy bg-white p-8 shadow-soft">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-muted">
              WorkCV product truth
            </p>
            <div className="mt-5 font-display text-6xl font-semibold leading-none text-navy">
              {site.price}
            </div>
            <p className="mt-3 text-sm font-bold uppercase tracking-[0.14em] text-muted">
              unlock for the selected saved CV
            </p>
            <ul className="mt-7 space-y-3">
              {workCvStrengths.slice(0, 4).map((item) => (
                <li key={item} className="flex gap-3 text-sm font-bold text-navy">
                  <Check className="h-5 w-5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-7 text-sm leading-6 text-muted">
              Email-code login is required. WorkCV currently does not include
              cover letters, AI writing, ATS scoring or application tracking.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-page grid gap-4 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {["Checked 21 June 2026", "Official Enhancv sources", "No renewal with WorkCV", "Independent comparison"].map(
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
          <SectionLabel>Side-by-side comparison</SectionLabel>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
                Enhancv offers more. WorkCV deliberately charges for less.
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                The relevant question is not which product has the longest
                feature list. It is whether you need ongoing optimisation tools
                or one practical UK CV without recurring billing.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-paper p-5">
              <p className="text-sm leading-7 text-muted">
                Enhancv information checked {checkedDate}. Enhancv can change
                plans, features and regional prices. Verify the final amount and
                renewal terms on its official checkout before paying.
              </p>
            </div>
          </div>

          <div className="mt-10 overflow-hidden rounded-xl border border-line bg-white">
            <div className="hidden grid-cols-[0.75fr_1fr_1fr] bg-navy px-5 py-4 text-sm font-bold text-white md:grid">
              <span>Area</span>
              <span>Enhancv</span>
              <span>WorkCV</span>
            </div>
            {comparisonRows.map(([area, enhancv, workcv]) => (
              <div
                key={area}
                className="grid grid-cols-1 border-t border-line text-sm md:grid-cols-[0.75fr_1fr_1fr]"
              >
                <div className="bg-paper p-5 font-bold text-navy">{area}</div>
                <div className="p-5 leading-7 text-muted">{enhancv}</div>
                <div className="bg-greensoft p-5 font-bold leading-7 text-navy">{workcv}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page">
          <SectionLabel>Pricing without guesswork</SectionLabel>
          <h2 className="max-w-4xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Why this page does not publish an Enhancv GBP price.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            Enhancv's help centre explicitly says prices may vary by currency,
            region and tax, and that the final price appears after billing
            details. A stale converted number would make this comparison less
            useful, not more useful.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {pricingFacts.map((fact) => (
              <article key={fact.title} className="rounded-xl border border-line bg-white p-6">
                <h3 className="font-display text-2xl font-semibold text-navy">{fact.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted">{fact.body}</p>
              </article>
            ))}
          </div>
          <a
            href="https://enhancv.com/pricing/"
            rel="nofollow noopener noreferrer"
            target="_blank"
            className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-navy underline decoration-line-strong underline-offset-4"
          >
            Check Enhancv's current regional price
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <article className="rounded-xl border border-line bg-paper p-7">
            <Wand2 className="h-7 w-7 text-gold" />
            <h2 className="mt-5 font-display text-3xl font-semibold text-navy">
              Choose Enhancv when you need the wider platform.
            </h2>
            <ul className="mt-6 space-y-4">
              {enhancvStrengths.map((item) => (
                <li key={item} className="flex gap-3 text-sm font-bold leading-6 text-navy">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-xl border-2 border-navy bg-white p-7 shadow-sm">
            <LayoutTemplate className="h-7 w-7 text-gold" />
            <h2 className="mt-5 font-display text-3xl font-semibold text-navy">
              Choose WorkCV when one UK CV is the job.
            </h2>
            <ul className="mt-6 space-y-4">
              {workCvStrengths.map((item) => (
                <li key={item} className="flex gap-3 text-sm font-bold leading-6 text-navy">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <ButtonLink href="/editor">Create my UK CV</ButtonLink>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div className="rounded-xl border border-line bg-surface p-6">
            <FileText className="h-7 w-7 text-gold" />
            <h2 className="mt-5 font-display text-3xl font-semibold text-navy">
              Already paying for Enhancv?
            </h2>
            <p className="mt-4 leading-7 text-muted">
              Switching products does not cancel an existing Enhancv plan.
              Follow Enhancv's Billing-page process and keep the confirmation
              before the next renewal date.
            </p>
            <Link
              href="/cancel-enhancv-uk"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy underline decoration-line-strong underline-offset-4"
            >
              Read the sourced cancellation guide
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-xl border-2 border-navy bg-white p-6 shadow-sm">
            <h2 className="font-display text-3xl font-semibold text-navy">
              Need to rebuild the document?
            </h2>
            <p className="mt-4 leading-7 text-muted">
              WorkCV can import an existing PDF or DOCX CV into editable fields.
              Review every imported section before checkout because automated
              extraction can require corrections.
            </p>
            <div className="mt-6">
              <ButtonLink href="/editor">Open the CV editor</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Official sources</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Check Enhancv's current terms before deciding.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            This is an independent comparison. Enhancv is not affiliated with
            WorkCV. Product names and trademarks belong to their respective
            owners.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sources.map(([label, href]) => (
              <a
                key={href}
                href={href}
                rel="nofollow noopener noreferrer"
                target="_blank"
                className="group flex min-h-24 items-center justify-between gap-4 rounded-xl border border-line bg-white p-5 text-navy transition hover:-translate-y-1 hover:border-navy"
              >
                <span className="font-bold">{label}</span>
                <ExternalLink className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" />
              </a>
            ))}
            <Link
              href="/pricing"
              className="group flex min-h-24 items-center justify-between gap-4 rounded-xl border border-line bg-white p-5 text-navy transition hover:-translate-y-1 hover:border-navy"
            >
              <span className="font-bold">WorkCV pricing details</span>
              <ArrowRight className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqItems} title="Questions about Enhancv alternatives in the UK." />
      <FinalCta
        heading="Use the wider platform when you need it. Pay for one CV when you do not."
        body={`WorkCV costs ${site.price} to unlock the selected saved CV PDF. No monthly WorkCV subscription and no automatic renewal.`}
        primaryHref="/editor"
        primary="Build my UK CV"
        secondaryHref="/cancel-enhancv-uk"
        secondary="Cancel an existing Enhancv plan"
      />
    </>
  );
}
