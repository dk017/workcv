import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ExternalLink, ShieldCheck } from "lucide-react";

import {
  ComparisonTable,
  OfficialSourcesSection,
} from "@/components/comparison-table";
import {
  ButtonLink,
  FaqSection,
  FinalCta,
  SectionLabel,
} from "@/components/marketing";
import {
  competitorPricing,
  competitorPricingCheckedDate,
} from "@/lib/competitor-pricing";
import { buildWorkCvProductSchema } from "@/lib/product-schema";
import { site } from "@/lib/site";
import { PassOffer } from "@/components/pass-offer";
import { ComparisonLinks } from "@/components/competitor-vs-page";
import { competitorPlans, formatMinor } from "@/lib/competitor-plans";
import { analyticsPlacements } from "@/lib/analytics-placements";

const checkedDate = competitorPricingCheckedDate;

export const metadata: Metadata = {
  title: "Best MyPerfectCV Alternative UK - No Subscription",
  description:
    `Looking for a MyPerfectCV alternative in the UK? Compare MyPerfectCV's trial-to-renewal pricing with WorkCV's ${site.priceGbp} PDF download model.`,
  alternates: {
    canonical: "/myperfectcv-alternative-uk",
  },
  openGraph: {
    title: "MyPerfectCV Alternative UK - WorkCV",
    description:
      "A focused UK CV and cover letter builder for people who want to pay once, without a monthly CV builder subscription.",
    url: "/myperfectcv-alternative-uk",
  },
};

const comparisonRows = [
  ["Entry model", competitorPricing.myPerfectCv.entry, "Free to build"],
  ["Renewal", competitorPricing.myPerfectCv.renewal, "No monthly renewal"],
  ["PDF download", "Included with premium access", `${site.priceGbp} when ready`],
  ["Cancellation", "Needed to stop renewal", "Nothing to cancel"],
  ["Cover letters", "Included in premium tools", "Matching cover letter included with each CV"],
  ["Best fit", "Ongoing CV and cover-letter access", "A finished UK CV and cover letter, PDF and Word"],
];

const workCvBenefits = [
  "Build and preview before paying",
  `${site.priceGbp} PDF download`,
  "No monthly CV builder subscription",
  "No automatic renewal",
  "UK-focused CV structure",
  "Clean, practical templates",
];

const mpcv = competitorPlans.myPerfectCv;

const faqItems = [
  {
    question: "Is MyPerfectCV free?",
    answer: `Partly. ${mpcv.freePlan} The 14-day trial costs ${formatMinor(mpcv.trial.entryMinor, "GBP")}, then renews at ${formatMinor(mpcv.trial.renewalMinor, "GBP")} every four weeks unless you cancel (checked ${mpcv.checked}).`,
  },
  {
    question: "Is MyPerfectCV the same company as Zety and LiveCareer?",
    answer: `Yes. The terms of use for MyPerfectCV, Zety and LiveCareer all name ${mpcv.operator} as the company you contract with (checked ${mpcv.checked}).`,
  },
  {
    question: "What is a good MyPerfectCV alternative in the UK?",
    answer:
      `If you want a CV builder without monthly renewal, WorkCV is a focused alternative. You build first and pay ${site.priceGbp} when you download your finished CV as a PDF.`,
  },
  {
    question: "How is WorkCV different from MyPerfectCV?",
    answer:
      "MyPerfectCV offers broader CV and cover-letter tools with premium access that can renew. WorkCV is narrower: it focuses on UK CVs with matching cover letters, paid once, with no monthly CV builder subscription.",
  },
  {
    question: "How much does MyPerfectCV cost?",
    answer:
      `On the official pricing page checked ${checkedDate}, MyPerfectCV listed ${competitorPricing.myPerfectCv.entry}, followed by automatic renewal at ${competitorPricing.myPerfectCv.renewal}.`,
  },
  {
    question: "Does WorkCV include cover letters?",
    answer:
      "Yes. Each saved CV includes a matching cover letter, and both download as PDF and editable Word for the same one-time payment.",
  },
  {
    question: "Do I need to cancel WorkCV?",
    answer:
      "No. WorkCV does not use a monthly subscription in the standard CV download flow, so there is no automatic renewal to cancel.",
  },
];

const productSchema = buildWorkCvProductSchema({
  description:
    "UK CV and cover letter builder positioned as a no-subscription alternative for people who want to pay once.",
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
              MyPerfectCV is a renewable CV platform. WorkCV unlocks one saved CV.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              MyPerfectCV combines CV and cover-letter tools with account support
              and renewable access. WorkCV is narrower: build one UK CV, inspect
              it, then pay {site.price} once for that CV and its matching cover letter.
            </p>
            <div className="mt-8 grid gap-3 text-sm font-bold text-navy sm:grid-cols-2">
              {[
                "No monthly subscription",
                "No automatic renewal",
                "Free to build before paying",
                `${site.priceGbp} PDF download`,
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
                Compare options
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-[20px] border-2 border-navy bg-white p-8 shadow-soft">
            <h2 className="font-display text-3xl font-semibold text-navy">
              WorkCV at a glance
            </h2>
            <div className="mt-6 font-display text-6xl font-semibold leading-none text-navy">
              {site.priceGbp}
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
              Best for job seekers who need a finished CV and cover letter and do not want a
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
                or just a finished UK CV and cover letter.
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

          <ComparisonTable
            caption={`MyPerfectCV vs WorkCV pricing, checked ${checkedDate}`}
            headers={["Area", "MyPerfectCV", "WorkCV"]}
            rows={comparisonRows}
          />
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

      <OfficialSourcesSection
        brand="MyPerfectCV"
        sources={[
          ["MyPerfectCV pricing", "https://www.myperfectcv.co.uk/pricing"],
          ["MyPerfectCV FAQ", "https://www.myperfectcv.co.uk/faq"],
          ["MyPerfectCV contact", "https://www.myperfectcv.co.uk/contact-us"],
          ["MyPerfectCV terms", "https://www.myperfectcv.co.uk/terms-of-use"],
        ]}
      />
      <ComparisonLinks
        heading="Comparing MyPerfectCV with another builder?"
        links={[["MyPerfectCV vs LiveCareer", "/myperfectcv-vs-livecareer-uk"], ["Zety vs MyPerfectCV", "/zety-vs-myperfectcv-uk"]]}
      />
      <PassOffer audience="switching" trackingLabel={analyticsPlacements.passSwitchingAlternative} />
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
