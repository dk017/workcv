import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ExternalLink } from "lucide-react";

import { ButtonLink, FaqSection, FinalCta, SectionLabel } from "@/components/marketing";
import { ComparisonTable } from "@/components/comparison-table";
import { competitorPricing, competitorPricingCheckedDate } from "@/lib/competitor-pricing";
import { analyticsPlacements } from "@/lib/analytics-placements";
import { site } from "@/lib/site";

const slug = "/best-cv-builder-uk";

export const metadata: Metadata = {
  title: "Best CV Builder UK: How to Choose the Right One",
  description:
    "Compare the main UK CV builder choices by price, renewal terms, document needs and editing workflow. Use the checklist before you pay.",
  alternates: { canonical: slug },
  openGraph: {
    title: "Best CV Builder UK: How to Choose the Right One",
    description:
      "A practical UK buyer guide for comparing CV builders, templates, subscriptions and one-time PDF tools.",
    url: slug,
  },
};

const options = [
  {
    title: "One UK CV with no recurring bill",
    label: "WorkCV",
    body: `Build and preview free, then pay ${site.price} for the finished PDF. There is no monthly renewal in the standard download flow.`,
    href: "/pricing",
  },
  {
    title: "A wider document suite",
    label: "Resume.io or LiveCareer",
    body: "Compare the included documents, renewal cadence, export formats and cancellation route for the access period you need.",
    href: "/resume-io-alternative-uk",
  },
  {
    title: "Design-led editing",
    label: "Canva",
    body: "Check that the final layout stays readable, the export follows the vacancy instructions and important text is not hidden in graphics.",
    href: "/canva-cv-alternative-uk",
  },
  {
    title: "Template-led subscription access",
    label: "MyPerfectCV, Zety, Enhancv or CVMaker",
    body: "Compare the entry offer, renewal amount, access after cancellation and the steps needed to stop future charges.",
    href: "/myperfectcv-alternative-uk",
  },
  {
    title: "A free starting document",
    label: "Blank UK template",
    body: "Start with a blank Word template, tailor the content yourself and follow the employer's required file format.",
    href: "/tools/blank-cv-template-uk",
  },
];

const comparisonRows = [
  [
    "One CV and no recurring payment",
    "WorkCV",
    `${site.price} when you download; build and preview first`,
  ],
  [
    "A broader document platform",
    "Resume.io or LiveCareer",
    "Check the current bundle, renewal price and cancellation route",
  ],
  [
    "A design-first workspace",
    "Canva",
    "Check readability, export format and the employer's instructions",
  ],
  [
    "Template-led subscription access",
    "MyPerfectCV, Zety, Enhancv or CVMaker",
    "Compare the trial offer with the recurring price before paying",
  ],
  [
    "A free document to edit yourself",
    "Blank UK Word template",
    "Check the file type, headings and tailoring work yourself",
  ],
];

const faqs = [
  {
    question: "Is there one best CV builder in the UK?",
    answer:
      "No. The right choice depends on whether you need one CV, several documents, design control, a free starting point or ongoing access. Compare the total cost and output against the application you are preparing.",
  },
  {
    question: "What should I compare before paying?",
    answer:
      "Check the full access period, renewal amount, cancellation steps, export format, editability, privacy terms and whether the finished file follows the employer's instructions.",
  },
  {
    question: "Is WorkCV free?",
    answer: `You can build and preview a CV before paying. The standard WorkCV flow charges ${site.price} when you download the final PDF, with no monthly subscription or automatic renewal.`,
  },
  {
    question: "Can any CV builder guarantee ATS results or an interview?",
    answer:
      "No. Applicant systems and hiring decisions differ. A readable structure, accurate evidence and wording that matches the real vacancy matter more than a guarantee made by a template or builder.",
  },
];

const sourceLinks = [
  ["WorkCV pricing", "/pricing"],
  ["MyPerfectCV official pricing", "https://www.myperfectcv.co.uk/pricing"],
  ["Resume.io UK pricing", "https://resume.io/uk/pricing"],
  ["LiveCareer UK pricing", "https://www.livecareer.co.uk/pricing"],
  ["CVMaker UK costs", competitorPricing.cvMaker.source],
  ["Zety UK pricing", "https://zety.com/uk/pricing"],
  ["Canva CV maker", "https://www.canva.com/create/cv/"],
];

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "UK CV builder choices",
  itemListElement: options.map((option, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: option.label,
    url: `${site.url}${option.href}`,
  })),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: site.url },
    { "@type": "ListItem", position: 2, name: "Best CV builder UK", item: `${site.url}${slug}` },
  ],
};

export default function BestCvBuilderUkPage() {
  return (
    <>
      {[itemListSchema, faqSchema, breadcrumbSchema].map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <section className="quiet-grid bg-paper py-20 md:py-28">
        <div className="container-page">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
            <Link href="/" className="hover:text-navy">Home</Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <span aria-current="page" className="font-bold text-navy">Best CV builder UK</span>
          </nav>
          <div className="max-w-4xl">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              UK CV builder buyer guide
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              How to choose the best CV builder in the UK.
            </h1>
            <p className="mt-7 max-w-3xl text-xl leading-8 text-muted">
              There is no single best tool for every applicant. Start with the
              document you need, compare the full cost and renewal terms, then
              check the export and editing workflow against the vacancy.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/editor" trackingLabel={analyticsPlacements.bestBuilderHeroEditor}>
                Start a UK CV free
              </ButtonLink>
              <ButtonLink href="#compare" variant="secondary" trackingLabel={analyticsPlacements.bestBuilderPricing}>
                Compare the choices
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Quick answer</SectionLabel>
          <h2 className="max-w-4xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Choose around your application, not a universal ranking.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {options.map((option) => (
              <article key={option.label} className="rounded-xl border border-line bg-white p-6">
                <Check className="h-6 w-6 text-success" />
                <h3 className="mt-5 font-display text-2xl font-semibold text-navy">{option.title}</h3>
                <p className="mt-3 text-sm font-bold text-navy">{option.label}</p>
                <p className="mt-4 text-sm leading-7 text-muted">{option.body}</p>
                <Link href={option.href} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-navy underline underline-offset-4">
                  See the relevant option <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="compare" className="bg-paper py-24">
        <div className="container-page">
          <SectionLabel>Compare the choices</SectionLabel>
          <h2 className="max-w-4xl font-display text-4xl font-semibold text-navy md:text-5xl">
            The best shortlist depends on what you need to finish.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            This table gives a starting point for research. Prices that depend
            on provider terms were checked on official pages on {competitorPricingCheckedDate};
            verify the current total before paying.
          </p>
          <ComparisonTable
            caption={`UK CV builder options, checked ${competitorPricingCheckedDate}`}
            headers={["Your priority", "Shortlist", "Check before paying"]}
            rows={comparisonRows}
          />
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>Buyer checklist</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Five checks before you choose.
            </h2>
          </div>
          <ol className="grid gap-4">
            {[
              "Write down the exact document and file format the vacancy asks for.",
              "Compare the full cost for the period you need, including renewal.",
              "Check whether you can edit the document after exporting it.",
              "Read the cancellation, refund and data-retention terms.",
              "Open the final file and inspect every page before submitting it.",
            ].map((item, index) => (
              <li key={item} className="flex gap-4 rounded-xl border border-line bg-white p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                  {index + 1}
                </span>
                <span className="text-sm leading-7 text-ink">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page">
          <SectionLabel>Official sources</SectionLabel>
          <h2 className="max-w-4xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Check each provider&apos;s current terms yourself.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            WorkCV is independent from the providers below. Product names and
            trademarks belong to their respective owners. The comparison is a
            research aid, not a claim that one provider is right for everyone.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sourceLinks.map(([label, href]) =>
              href.startsWith("/") ? (
                <Link key={href} href={href} className="group rounded-xl border border-line bg-white p-5 font-bold text-navy transition hover:-translate-y-1 hover:border-navy">
                  {label}
                  <ArrowRight className="mt-4 h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              ) : (
                <a key={href} href={href} target="_blank" rel="nofollow noopener noreferrer" className="group rounded-xl border border-line bg-white p-5 font-bold text-navy transition hover:-translate-y-1 hover:border-navy">
                  {label}
                  <ExternalLink className="mt-4 h-4 w-4 transition group-hover:translate-x-1" />
                </a>
              ),
            )}
          </div>
        </div>
      </section>

      <FaqSection faqs={faqs} title="Questions before choosing a CV builder." />
      <FinalCta
        heading="Start with the CV you actually need."
        body={`Build and preview a UK CV free, then pay ${site.price} only when the final PDF is ready.`}
        primaryHref="/editor"
        primary="Start my CV free"
        secondaryHref="/pricing"
        secondary="See WorkCV pricing"
        trackingContext={analyticsPlacements.bestBuilderFinal}
      />
    </>
  );
}
