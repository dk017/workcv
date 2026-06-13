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
import { site } from "@/lib/site";

const checkedDate = "13 June 2026";

export const metadata: Metadata = {
  title: "Canva CV Alternative UK - CV Builder for Applications",
  description:
    "Looking for a Canva CV alternative in the UK? Compare Canva's design-led CV templates with WorkCV's UK CV builder and £4.99 PDF download.",
  alternates: {
    canonical: "/canva-cv-alternative-uk",
  },
  openGraph: {
    title: "Canva CV Alternative UK - WorkCV",
    description:
      "A focused UK CV builder for people who want recruiter-readable structure instead of starting from a graphic design canvas.",
    url: "/canva-cv-alternative-uk",
  },
};

const comparisonRows = [
  ["Main purpose", "General design platform with CV/resume templates", "Focused UK CV builder"],
  ["Best strength", "Visual design freedom", "CV structure and application flow"],
  ["Starting point", "Choose and edit a design template", "Fill guided UK CV sections"],
  ["Formatting control", "Flexible canvas editing", "Consistent recruiter-readable layout"],
  ["ATS caution", "Depends heavily on template choice and layout", "Clean CV sections by default"],
  ["Payment model", "Canva Free plus optional paid design plans", "Free to build, £4.99 PDF download"],
  ["Best fit", "Creative visual CVs and broader design work", "One practical UK CV PDF"],
];

const benefits = [
  "UK CV sections already structured",
  "No canvas formatting from scratch",
  "Clean templates for job applications",
  "Build and preview before paying",
  "£4.99 PDF download",
  "No monthly CV builder subscription",
];

const useCanvaWhen = [
  "You are applying for a creative role where visual portfolio style matters",
  "You already use Canva and want matching design assets",
  "You need posters, social posts, presentations or broader design work",
  "You want maximum control over colour, spacing, icons and graphic layout",
];

const useWorkCvWhen = [
  "You want a straightforward UK CV for job applications",
  "You do not want to choose from hundreds of design options",
  "You prefer guided sections over manual canvas editing",
  "You want a clean PDF download without a recurring CV-builder subscription",
];

const faqItems = [
  {
    question: "What is a good Canva CV alternative in the UK?",
    answer:
      "If you want a focused UK CV builder rather than a general design tool, WorkCV is a practical alternative. You build and preview your CV first, then pay £4.99 when you download the PDF.",
  },
  {
    question: "Is Canva good for CVs?",
    answer:
      "Canva can be good for visually polished CVs, especially creative roles. For standard UK job applications, choose simple layouts and avoid designs where graphics, columns or icons make the CV harder to scan.",
  },
  {
    question: "How is WorkCV different from Canva?",
    answer:
      "Canva starts from a flexible design canvas. WorkCV starts from guided UK CV sections and consistent templates, so the focus stays on content, structure and recruiter readability.",
  },
  {
    question: "Does WorkCV have Canva-style design editing?",
    answer:
      "No. WorkCV is intentionally less open-ended. It gives you clean CV templates and guided fields rather than a full graphic design editor.",
  },
  {
    question: "Do I need to cancel WorkCV?",
    answer:
      "No. WorkCV does not use a monthly subscription in the standard CV download flow, so there is no automatic renewal to cancel.",
  },
];

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "WorkCV",
  description:
    "UK CV builder positioned as a focused alternative to design-led CV template tools.",
  brand: {
    "@type": "Brand",
    name: "WorkCV",
  },
  offers: {
    "@type": "Offer",
    price: "4.99",
    priceCurrency: "GBP",
    availability: "https://schema.org/InStock",
    url: `${site.url}/canva-cv-alternative-uk`,
    description: "One-time CV PDF download price. No monthly subscription.",
  },
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

export default function CanvaCvAlternativeUkPage() {
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
              Canva CV alternative UK
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              A Canva CV alternative built for applications, not design projects.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              Canva is excellent when you want design freedom. WorkCV is for the
              different job: building a clean UK CV quickly, with guided sections,
              recruiter-readable templates and a simple {site.price} PDF download.
            </p>
            <div className="mt-8 grid gap-3 text-sm font-bold text-navy sm:grid-cols-2">
              {[
                "Guided UK CV sections",
                "Clean application templates",
                "Free to build before paying",
                "£4.99 PDF download",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="h-5 w-5 shrink-0 text-success" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/editor">Build my CV for £4.99</ButtonLink>
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
              £4.99
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
              Best for job seekers who want a practical UK CV without designing
              every visual detail themselves.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-page grid gap-4 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {["Guided sections", "Clean PDF", "No renewal", "UK CV structure"].map(
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
                Canva starts with design. WorkCV starts with the CV.
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                Canva's official CV and resume pages highlight free editable
                templates, visual customisation and downloads. WorkCV removes
                most design decisions so you can focus on the words employers
                need to see.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-paper p-5">
              <p className="text-sm leading-6 text-muted">
                Canva feature information checked {checkedDate} from official
                Canva CV, resume and pricing pages. Canva products and plan
                details can change.
              </p>
              <a
                href="https://www.canva.com/create/cv/"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-navy underline decoration-line-strong underline-offset-4"
                rel="nofollow noopener noreferrer"
                target="_blank"
              >
                Check official Canva CV maker
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="mt-10 overflow-hidden rounded-xl border border-line bg-white">
            <div className="grid grid-cols-[0.8fr_1fr_1fr] bg-navy px-5 py-4 text-sm font-bold text-white">
              <span>Area</span>
              <span>Canva</span>
              <span>WorkCV</span>
            </div>
            {comparisonRows.map(([area, canva, workcv]) => (
              <div
                key={area}
                className="grid grid-cols-1 border-t border-line text-sm md:grid-cols-[0.8fr_1fr_1fr]"
              >
                <div className="bg-paper p-5 font-bold text-navy">{area}</div>
                <div className="p-5 text-muted">{canva}</div>
                <div className="bg-greensoft p-5 font-bold text-navy">{workcv}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div className="rounded-xl border border-line bg-white p-6">
            <LayoutTemplate className="h-7 w-7 text-gold" />
            <h2 className="mt-5 font-display text-3xl font-semibold text-navy">
              Use Canva when design is the point.
            </h2>
            <ul className="mt-6 space-y-4">
              {useCanvaWhen.map((item) => (
                <li key={item} className="flex gap-3 text-sm font-bold leading-6 text-navy">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border-2 border-navy bg-white p-6 shadow-sm">
            <FileText className="h-7 w-7 text-gold" />
            <h2 className="mt-5 font-display text-3xl font-semibold text-navy">
              Use WorkCV when the CV is the point.
            </h2>
            <ul className="mt-6 space-y-4">
              {useWorkCvWhen.map((item) => (
                <li key={item} className="flex gap-3 text-sm font-bold leading-6 text-navy">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionLabel>Why WorkCV</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Less design freedom can be a feature.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              For many UK job applications, the goal is not to create the most
              distinctive document. It is to make your experience, skills,
              education and contact details easy to read, easy to scan and easy
              to download.
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

      <section className="bg-paper py-24">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div className="rounded-xl border border-line bg-paper p-6">
            <Wand2 className="h-7 w-7 text-gold" />
            <h2 className="mt-5 font-display text-3xl font-semibold text-navy">
              Already made a CV in Canva?
            </h2>
            <p className="mt-4 leading-7 text-muted">
              You can still use the content. Copy the useful sections into
              WorkCV, simplify the layout, and turn it into a cleaner application
              CV.
            </p>
            <Link
              href="/ats-cv-template-uk"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy underline decoration-line-strong underline-offset-4"
            >
              Read the ATS-friendly format guide
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-xl border-2 border-navy bg-white p-6 shadow-sm">
            <h2 className="font-display text-3xl font-semibold text-navy">
              Ready to build around content first?
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

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Official sources</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Verify Canva's latest CV and pricing details.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Canva CV maker", "https://www.canva.com/create/cv/"],
              ["Canva resume builder", "https://www.canva.com/create/resumes/"],
              ["Canva resume templates", "https://www.canva.com/resumes/templates/"],
              ["Canva UK pricing", "https://www.canva.com/en_gb/pricing/"],
              ["Canva Pro", "https://www.canva.com/pro/"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="group flex min-h-24 items-center justify-between gap-4 rounded-xl border border-line bg-white p-5 text-navy shadow-sm transition hover:-translate-y-1 hover:border-navy"
                rel="nofollow noopener noreferrer"
                target="_blank"
              >
                <span className="font-bold">{label}</span>
                <ExternalLink className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" />
              </a>
            ))}
            <Link
              href="/pricing"
              className="group flex min-h-24 items-center justify-between gap-4 rounded-xl border border-line bg-white p-5 text-navy shadow-sm transition hover:-translate-y-1 hover:border-navy"
            >
              <span className="font-bold">Compare CV builder pricing</span>
              <ArrowRight className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqItems} title="Questions about Canva CV alternatives." />
      <FinalCta
        heading="Build a CV for applications, not a design board."
        body={`WorkCV is ${site.price} when you download your PDF. No monthly CV builder subscription and no automatic renewal.`}
        secondaryHref="/ats-cv-template-uk"
        secondary="ATS-friendly format"
      />
    </>
  );
}
