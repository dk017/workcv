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
  title: "CV Builder Pricing UK - GBP 4.99 Once",
  description:
    "Compare UK CV builder costs. WorkCV is GBP 4.99 when you download your PDF, with no monthly subscription or automatic renewal.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "CV Builder Pricing UK - WorkCV",
    description:
      "Build your CV first. Pay GBP 4.99 when you download. Compare WorkCV with UK CV builder trial and renewal pricing.",
    url: "/pricing",
  },
};

const checkedDate = "12 June 2026";

const competitors = [
  {
    builder: "MyPerfectCV",
    entry: "GBP 2.95 for 14 days",
    renewal: "GBP 16.95 every 4 weeks",
    ongoing: "Approx. GBP 220.35 over 52 weeks",
    cancellation: "Yes",
    source: "https://www.myperfectcv.co.uk/pricing",
  },
  {
    builder: "Resume.io UK",
    entry: "GBP 2.95 for 7 days",
    renewal: "GBP 20.95 every 4 weeks",
    ongoing: "Approx. GBP 272.35 over 52 weeks",
    cancellation: "Yes",
    source: "https://resume.io/uk/pricing",
  },
  {
    builder: "LiveCareer UK",
    entry: "GBP 1.95 for 14 days",
    renewal: "GBP 19.85 every 4 weeks",
    ongoing: "Approx. GBP 258.05 over 52 weeks",
    cancellation: "Yes",
    source: "https://www.livecareer.co.uk/pricing",
  },
  {
    builder: "CVMaker UK",
    entry: "GBP 0.99 for 7 days",
    renewal: "GBP 19.99 per month",
    ongoing: "Approx. GBP 239.88 over 12 months",
    cancellation: "Yes",
    source: "https://www.cvmaker.uk/help/what-are-the-costs-of-cvmaker-uk",
  },
  {
    builder: "WorkCV",
    entry: "Free to build",
    renewal: "GBP 4.99 when you download",
    ongoing: "No monthly renewal",
    cancellation: "No",
    source: "/cv-builder-no-subscription-uk",
    featured: true,
  },
];

const included = [
  "Guided UK CV editor",
  "Clean CV templates",
  "Live preview before paying",
  "PDF download for GBP 4.99",
  "No monthly CV builder subscription",
  "No automatic renewal",
];

const pricingFaqs = [
  {
    question: "How much does WorkCV cost in the UK?",
    answer:
      "WorkCV costs GBP 4.99 when you download your final CV as a PDF. You can build and preview your CV before paying.",
  },
  {
    question: "Is WorkCV a subscription?",
    answer:
      "No. WorkCV does not use a monthly subscription for the standard CV download flow. There is no automatic renewal and no CV builder plan to cancel later.",
  },
  {
    question: "When do I pay?",
    answer:
      "You pay when you are ready to download the final PDF version of your CV. You can use the editor and preview before that point.",
  },
  {
    question: "How much does MyPerfectCV cost?",
    answer:
      "On its official pricing page checked 12 June 2026, MyPerfectCV listed a 14-day premium plan at GBP 2.95 that automatically renews at GBP 16.95 every 4 weeks.",
  },
  {
    question: "How much does Resume.io cost in the UK?",
    answer:
      "On its UK pricing page checked 12 June 2026, Resume.io listed a 7-day trial at GBP 2.95 that auto-renews to GBP 20.95 billed every 4 weeks.",
  },
  {
    question: "Do I need to pay monthly for a CV builder?",
    answer:
      "No. If you only need one CV PDF, you can use a no-subscription model like WorkCV and pay once when you download. Subscription CV builders may suit people who need ongoing access to a larger career platform.",
  },
];

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "WorkCV",
  description:
    "UK CV builder with a GBP 4.99 PDF download price and no monthly subscription in the standard download flow.",
  brand: {
    "@type": "Brand",
    name: "WorkCV",
  },
  offers: {
    "@type": "Offer",
    price: "4.99",
    priceCurrency: "GBP",
    availability: "https://schema.org/InStock",
    url: `${site.url}/pricing`,
    description: "One-time CV PDF download price. No monthly subscription.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: pricingFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function PricingPage() {
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
              CV builder pricing UK
            </p>
            <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              GBP 4.99 when your CV is ready.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              Build your CV first, preview the result, then pay {site.price} to
              download the final PDF. No monthly subscription, no automatic
              renewal, and no cancellation step after you finish.
            </p>
            <div className="mt-8 grid gap-3 text-sm font-bold text-navy sm:grid-cols-2">
              {[
                "Free to build before paying",
                "Pay only at PDF download",
                "No recurring billing",
                "Always priced in GBP",
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
                Compare prices
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-[20px] border-2 border-navy bg-white p-8 shadow-soft">
            <h2 className="font-display text-3xl font-semibold text-navy">WorkCV</h2>
            <div className="mt-6 font-display text-6xl font-semibold leading-none text-navy">
              GBP 4.99
            </div>
            <p className="mt-3 text-sm font-bold uppercase tracking-[0.14em] text-muted">
              one-time PDF download price
            </p>
            <ul className="mt-7 space-y-3">
              {included.slice(0, 4).map((item) => (
                <li key={item} className="flex gap-3 text-sm font-bold text-navy">
                  <Check className="h-5 w-5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-7 leading-7 text-muted">
              Built for people who need one strong UK CV, not another monthly
              account to remember cancelling.
            </p>
            <div className="mt-8">
              <ButtonLink href="/editor">Start building</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-page grid gap-4 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "GBP 4.99 PDF download",
            "No monthly plan",
            "No automatic renewal",
            "Nothing to cancel",
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
          <SectionLabel>Compare pricing</SectionLabel>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <h2 className="max-w-4xl font-display text-4xl font-semibold text-navy md:text-5xl">
                The trial price is not the full cost.
              </h2>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
                Several UK CV builders advertise a low trial price, then renew
                every month or every 4 weeks unless cancelled. WorkCV uses a
                narrower model: build the CV, pay once for the PDF, and move on.
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
            <div className="hidden grid-cols-[1fr_1fr_1.1fr_1.15fr_0.8fr_0.6fr] bg-navy px-5 py-4 text-sm font-bold text-white lg:grid">
              <span>Builder</span>
              <span>Entry price</span>
              <span>Then</span>
              <span>Approx. ongoing cost</span>
              <span>Cancel needed</span>
              <span>Source</span>
            </div>
            {competitors.map((row) => (
              <div
                key={row.builder}
                className={`grid gap-4 border-t border-line p-5 text-sm lg:grid-cols-[1fr_1fr_1.1fr_1.15fr_0.8fr_0.6fr] ${
                  row.featured ? "bg-greensoft font-bold text-navy" : "text-ink"
                }`}
              >
                <PricingCell label="Builder">{row.builder}</PricingCell>
                <PricingCell label="Entry price">{row.entry}</PricingCell>
                <PricingCell label="Then">{row.renewal}</PricingCell>
                <PricingCell label="Approx. ongoing cost">{row.ongoing}</PricingCell>
                <PricingCell label="Cancel needed">{row.cancellation}</PricingCell>
                <PricingCell label="Source">
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
                      Details <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </PricingCell>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">
            Ongoing cost estimates show the renewal amount repeated over roughly
            a year. They do not include any free/basic plan or annual discount
            option competitors may also offer.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/editor">Build my CV</ButtonLink>
            <ButtonLink href="/cv-builder-no-subscription-uk" variant="secondary">
              Why no subscription?
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionLabel>What is included</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Everything needed to finish a practical UK CV.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              WorkCV is intentionally focused. It is not trying to be a broad
              career subscription platform. It helps you create a clear CV,
              check the preview, and download the finished PDF.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {included.map((item) => (
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
              When a subscription might make sense
            </h2>
            <p className="mt-4 leading-7 text-muted">
              If you need ongoing access to many career tools, cover letters,
              repeated downloads, job tracking, or expert writing services, a
              larger subscription product may be useful.
            </p>
          </div>
          <div className="rounded-xl border-2 border-navy bg-white p-6 shadow-sm">
            <h2 className="font-display text-3xl font-semibold text-navy">
              When WorkCV is the better fit
            </h2>
            <p className="mt-4 leading-7 text-muted">
              If you mainly need one clean UK CV PDF for applications, a
              one-time download price is simpler and easier to understand.
            </p>
            <div className="mt-6">
              <ButtonLink href="/editor">Create my CV</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <FaqSection faqs={pricingFaqs} title="Common questions about CV builder costs." />
      <FinalCta
        heading="Pay once. Download your CV. Done."
        body={`Build free first. Pay ${site.price} only when you want the final PDF. No subscription and no automatic renewal.`}
        secondaryHref="/cv-builder-no-subscription-uk"
        secondary="No-subscription details"
      />
    </>
  );
}

function PricingCell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="mb-1 block text-xs font-bold uppercase tracking-[0.12em] text-muted lg:hidden">
        {label}
      </span>
      {children}
    </div>
  );
}
