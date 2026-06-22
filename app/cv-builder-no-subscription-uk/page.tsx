import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ExternalLink,
  FileText,
  ShieldCheck,
} from "lucide-react";

import {
  ButtonLink,
  CvPreview,
  FaqSection,
  FinalCta,
  SectionLabel,
} from "@/components/marketing";
import { buildWorkCvProductSchema } from "@/lib/product-schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "CV Builder UK and Online CV Maker - Pay Once",
  description:
    `Use a professional UK CV builder and online CV maker. Edit and preview your CV, then pay ${site.priceGbp} once for its PDF with no subscription.`,
  alternates: {
    canonical: "/cv-builder-no-subscription-uk",
  },
  openGraph: {
    title: "Professional CV Builder UK - WorkCV",
    description:
      `Build your CV first. Pay ${site.priceGbp} when you download. No monthly subscription and no automatic renewal.`,
    url: "/cv-builder-no-subscription-uk",
  },
};

const checkedDate = "12 June 2026";

const comparisonRows = [
  {
    builder: "MyPerfectCV",
    entry: "GBP 2.95 for 14 days",
    renewal: "GBP 16.95 every 4 weeks",
    annualised: "GBP 220.35 over 52 weeks",
    source: "https://www.myperfectcv.co.uk/pricing",
  },
  {
    builder: "Resume.io UK",
    entry: "GBP 2.95 for 7 days",
    renewal: "GBP 20.95 every 4 weeks",
    annualised: "GBP 272.35 over 52 weeks",
    source: "https://resume.io/uk/pricing",
  },
  {
    builder: "CVMaker UK",
    entry: "GBP 0.99 for 7 days",
    renewal: "GBP 19.99 per month",
    annualised: "GBP 239.88 over 12 months",
    source: "https://www.cvmaker.uk/help/what-are-the-costs-of-cvmaker-uk",
  },
  {
    builder: "WorkCV",
    entry: "Free to build",
    renewal: `${site.priceGbp} when you download`,
    annualised: "No monthly renewal",
    source: "/pricing",
    featured: true,
  },
];

const modelSteps = [
  {
    title: "Build before paying",
    body: "Start the CV, add your details, and check the structure before you decide whether to download.",
  },
  {
    title: "Use a UK-focused structure",
    body: "WorkCV keeps the standard sections practical: contact details, profile, experience, education, skills, and references guidance.",
  },
  {
    title: "Pay when the PDF is ready",
    body: `The standard WorkCV flow charges ${site.price} when you download the final CV as a PDF.`,
  },
  {
    title: "No renewal to manage",
    body: "There is no monthly CV builder subscription in the standard download flow, so there is no recurring CV-builder plan to cancel.",
  },
];

const internalLinks = [
  ["Compare CV builder prices", "/pricing"],
  ["Editable UK CV templates", "/templates"],
  ["MyPerfectCV alternative UK", "/myperfectcv-alternative"],
  ["CVMaker UK alternative", "/cvmaker-alternative"],
  ["LiveCareer alternative UK", "/livecareer-alternative"],
  ["UK resume builder without subscription", "/resume-builder-uk-no-subscription"],
  ["Student CV template UK", "/student-cv-template"],
  ["CV with no experience", "/cv-with-no-experience"],
  ["School leaver CV example", "/school-leaver-cv-example"],
];

const faqItems = [
  {
    question: "Is WorkCV a subscription?",
    answer:
      `No. WorkCV does not use a monthly subscription for the standard CV download flow. You build first and pay ${site.priceGbp} when you download your final PDF.`,
  },
  {
    question: "How much does WorkCV cost in the UK?",
    answer:
      `WorkCV costs ${site.priceGbp} when you download your finished CV as a PDF. You can build your CV before paying.`,
  },
  {
    question: "Can I build a CV without paying monthly?",
    answer:
      "Yes. WorkCV is designed for people who want one finished UK CV without a recurring monthly CV builder plan.",
  },
  {
    question: "Why do many CV builders use subscriptions?",
    answer:
      "Many CV builders offer low trial prices that renew into a paid plan unless cancelled. That model can suit people who need ongoing access, but it may be more than you need for one CV download.",
  },
  {
    question: "Is there a completely free CV builder in the UK?",
    answer:
      "Yes, some organisations offer free CV tools. WorkCV is different: it is a paid PDF download product with a clear one-time download price and no monthly CV builder subscription.",
  },
  {
    question: "Does WorkCV follow UK CV expectations?",
    answer:
      "WorkCV is built around common UK CV expectations, including a clear profile, recent experience first where relevant, education, skills, and avoiding unnecessary personal details such as date of birth or nationality.",
  },
];

const productSchema = buildWorkCvProductSchema({
  description:
    "UK CV builder with a one-time PDF download price and no monthly subscription in the standard download flow.",
  url: `${site.url}/cv-builder-no-subscription-uk`,
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

export default function NoSubscriptionUkPage() {
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
        <div className="container-page grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              Professional CV builder UK · No subscription
            </p>
            <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              A professional UK CV builder, without the subscription.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              Use the online CV maker to organise your experience, choose a
              practical UK template and preview every page. Pay {site.price}{" "}
              only when this saved CV is ready to download as a PDF.
            </p>
            <div className="mt-8 grid gap-3 text-sm font-bold text-navy sm:grid-cols-2">
              {[
                "Free to build before paying",
                `${site.price} PDF download`,
                "No automatic renewal",
                "Built for UK CV expectations",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="h-5 w-5 shrink-0 text-success" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/editor?template=classic&new=1">Build my CV</ButtonLink>
              <ButtonLink href="#compare" variant="secondary">
                Compare costs
              </ButtonLink>
            </div>
          </div>
          <CvPreview />
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-page grid gap-4 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Pay once per PDF download",
            "No monthly CV plan",
            "No automatic renewal",
            "Prices in GBP",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm font-bold text-navy">
              <ShieldCheck className="h-5 w-5 shrink-0 text-success" />
              {item}
            </div>
          ))}
        </div>
      </section>

      <section id="compare" className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Cost comparison</SectionLabel>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
                Check the renewal price, not just the trial price.
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                Some CV builders advertise a low trial price, then renew into a
                paid plan every month or every 4 weeks unless cancelled. If you
                only need one finished CV, that renewal model can be an
                expensive fit.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-paper p-5">
              <p className="text-sm leading-6 text-muted">
                Competitor prices checked {checkedDate} from official pricing
                or help pages. Pricing can change, so verify on the official
                site before making a payment decision.
              </p>
            </div>
          </div>

          <div className="mt-10 overflow-hidden rounded-xl border border-line bg-white">
            <div className="hidden grid-cols-[1.1fr_1fr_1.1fr_1fr_0.5fr] bg-navy px-5 py-4 text-sm font-bold text-white md:grid">
              <span>Builder</span>
              <span>Entry price</span>
              <span>Then</span>
              <span>Approx. ongoing cost</span>
              <span>Source</span>
            </div>
            {comparisonRows.map((row) => (
              <div
                key={row.builder}
                className={`grid gap-4 border-t border-line p-5 text-sm md:grid-cols-[1.1fr_1fr_1.1fr_1fr_0.5fr] ${
                  row.featured ? "bg-greensoft font-bold text-navy" : "text-ink"
                }`}
              >
                <div>
                  <span className="mb-1 block text-xs font-bold uppercase tracking-[0.12em] text-muted md:hidden">
                    Builder
                  </span>
                  {row.builder}
                </div>
                <div>
                  <span className="mb-1 block text-xs font-bold uppercase tracking-[0.12em] text-muted md:hidden">
                    Entry price
                  </span>
                  {row.entry}
                </div>
                <div>
                  <span className="mb-1 block text-xs font-bold uppercase tracking-[0.12em] text-muted md:hidden">
                    Then
                  </span>
                  {row.renewal}
                </div>
                <div>
                  <span className="mb-1 block text-xs font-bold uppercase tracking-[0.12em] text-muted md:hidden">
                    Approx. ongoing cost
                  </span>
                  {row.annualised}
                </div>
                <div>
                  <span className="mb-1 block text-xs font-bold uppercase tracking-[0.12em] text-muted md:hidden">
                    Source
                  </span>
                  {row.source.startsWith("http") ? (
                    <a
                      href={row.source}
                      className="inline-flex items-center gap-1 font-bold text-navy underline decoration-line-strong underline-offset-4"
                      rel="nofollow noopener noreferrer"
                      target="_blank"
                    >
                      Check <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <Link
                      href={row.source}
                      className="inline-flex items-center gap-1 font-bold text-navy underline decoration-line-strong underline-offset-4"
                    >
                      Check <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <ButtonLink href="/editor?template=classic&new=1">Start building my CV</ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>How WorkCV works</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              A simpler model for people who need one strong CV.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              A subscription can make sense if you need a broad career platform
              for months. WorkCV is narrower by design: finish a clear UK CV,
              download the PDF, and avoid recurring CV-builder billing.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {modelSteps.map((step, index) => (
              <div key={step.title} className="rounded-xl border border-line bg-white p-6">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md bg-navy text-sm font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="font-display text-2xl font-semibold text-navy">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionLabel>UK CV standards</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              The structure should fit UK applications, not just look polished.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              The National Careers Service says a CV should include contact
              details, an introduction, education, work history, and references
              guidance. It also advises against including age, date of birth,
              marital status, or nationality.
            </p>
            <a
              href="https://nationalcareers.service.gov.uk/careers-advice/cv-sections"
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-navy underline decoration-line-strong underline-offset-4"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              Read the National Careers Service CV guidance
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="rounded-xl border border-line bg-paper p-6">
            <h3 className="font-display text-3xl font-semibold text-navy">
              WorkCV keeps those basics visible.
            </h3>
            <ul className="mt-6 space-y-4">
              {[
                "Clear contact and profile sections",
                "Recent experience first where it fits the candidate",
                "Education can come earlier for students and early-career users",
                "References handled without exposing someone else's contact details",
                "No photo-first or unnecessary personal-detail assumptions",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm font-bold leading-6 text-navy">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page">
          <SectionLabel>Choose your next step</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Compare, preview, or start building.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {internalLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="group flex min-h-24 items-center justify-between gap-4 rounded-xl border border-line bg-white p-5 text-navy shadow-sm transition hover:-translate-y-1 hover:border-navy"
              >
                <span className="font-bold">{label}</span>
                <ArrowRight className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
          <div className="mt-10 rounded-xl border border-line bg-white p-6 sm:flex sm:items-center sm:justify-between sm:gap-8">
            <div className="flex gap-4">
              <FileText className="h-8 w-8 shrink-0 text-gold" />
              <div>
                <h3 className="font-display text-2xl font-semibold text-navy">
                  Ready to write the CV now?
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Start with the editor, then pay only when your PDF is ready to
                  download.
                </p>
              </div>
            </div>
            <div className="mt-6 shrink-0 sm:mt-0">
              <ButtonLink href="/editor?template=classic&new=1">Build my CV</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <FaqSection
        faqs={faqItems}
        title="Questions about no-subscription CV builders."
      />
      <FinalCta
        heading={`Build free. Pay ${site.priceGbp} when you download.`}
        body="No monthly CV builder subscription, no automatic renewal, and no cancellation step after you finish your CV."
        primaryHref="/editor?template=classic&new=1"
        primary="Build my CV"
        secondaryHref="/pricing"
        secondary="Compare pricing"
      />
    </>
  );
}
