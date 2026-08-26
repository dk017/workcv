import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Download, FileText, ShieldCheck } from "lucide-react";

import {
  FaqSection,
  FinalCta,
  RelatedLinksSection,
  SectionLabel,
} from "@/components/marketing";
import { site } from "@/lib/site";

const path = "/tools/cv-template-word-uk";

export const metadata: Metadata = {
  title: "How to Edit a CV Template in Word UK | WorkCV",
  description:
    "Learn how to edit a UK CV template in Microsoft Word: replace prompts, keep styles consistent, fix page breaks and export a clean PDF.",
  alternates: { canonical: path },
  openGraph: {
    title: "How to Edit a CV Template in Word - UK Guide",
    description:
      "A practical guide to editing, checking and exporting a UK CV template in Microsoft Word.",
    url: path,
  },
};

const faqs = [
  {
    question: "How do I edit a CV template in Microsoft Word?",
    answer:
      "Open the DOCX, replace every placeholder with your own details, remove sections you do not need, then use Word's styles and paragraph controls to keep headings, bullets and spacing consistent.",
  },
  {
    question: "How do I stop a Word CV template moving onto a new page?",
    answer:
      "Check paragraph spacing, line spacing and page breaks first. Keep headings with the next paragraph where appropriate, shorten long bullets and avoid adding manual spaces or repeated empty lines.",
  },
  {
    question: "Should I send the CV as a Word document or PDF?",
    answer:
      "Follow the employer's instructions. If no format is specified, PDF usually preserves the layout more consistently, while the DOCX remains useful as your editable master.",
  },
  {
    question: "Can I edit the free WorkCV CV template in Google Docs?",
    answer:
      "Most modern editors can open the DOCX, including Google Docs and LibreOffice. Formatting can vary slightly, so inspect the final document and exported PDF before applying.",
  },
  {
    question: "Is the Word CV template free?",
    answer:
      "Yes. The blank DOCX template downloads directly with no signup, payment, watermark or subscription. The guided online builder is a separate flow: it is free to build and preview, then charges the one-time PDF price shown before download.",
  },
];

const howToSteps = [
  {
    name: "Replace the prompts",
    text: "Add your contact details, profile, skills, work history, education and evidence. Delete every instruction and unused section.",
  },
  {
    name: "Keep formatting consistent",
    text: "Use one heading style, one body style and consistent bullet indentation. Avoid text boxes, tables, icons and decorative graphics.",
  },
  {
    name: "Export and inspect",
    text: "Save the DOCX master, export the requested format and check page breaks, dates, links, spacing and filename on the final file.",
  },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to edit a CV template in Microsoft Word",
    description: metadata.description,
    totalTime: "PT30M",
    step: howToSteps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      url: `${site.url}${path}#step-${index + 1}`,
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  },
];

export default function CvTemplateWordUkPage() {
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <section className="quiet-grid border-b border-line bg-paper py-14 md:py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[1fr_0.76fr]">
          <div>
            <SectionLabel>Word editing guide</SectionLabel>
            <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.06] text-navy md:text-6xl">
              How to edit a CV template in Microsoft Word.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              Download a free UK DOCX, then follow a practical editing workflow:
              replace the prompts, keep styles and spacing stable, and export a
              clean final file for the employer's requested format.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/tools/blank-cv-template-uk"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-navy px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-navy-hover"
              >
                <Download className="h-4 w-4" />
                Download the free DOCX
              </Link>
              <Link
                href="/editor?new=1"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-line-strong bg-white px-6 py-3 text-sm font-bold text-navy transition hover:-translate-y-0.5"
              >
                Use the guided builder <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gold" />
                Microsoft Word compatible
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-success" />
                PDF export checklist
              </span>
            </div>
          </div>

          <div className="border border-line-strong bg-white p-7 shadow-soft">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
              The safe edit order
            </p>
            <div className="mt-6 space-y-5">
              {howToSteps.map((step, index) => (
                <div key={step.name} className="flex gap-4">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-navy text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-display text-xl font-semibold text-navy">
                      {step.name}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page">
          <SectionLabel>Edit in three passes</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Change the content first. Polish the layout second.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {howToSteps.map((step, index) => (
              <div
                id={`step-${index + 1}`}
                key={step.name}
                className="rounded-xl border border-line bg-white p-6"
              >
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-navy">
                  Pass {index + 1}
                </p>
                <h3 className="mt-4 font-display text-2xl font-semibold text-navy">
                  {step.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>Keep the layout stable</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Word settings that prevent avoidable drift.
            </h2>
            <p className="mt-6 text-base leading-8 text-muted">
              A polished CV is easier to scan when the structure stays quiet. Use
              Word's paragraph and style controls instead of manually pushing text
              around with spaces or empty lines.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              "Use one column and standard headings",
              "Keep heading and body styles consistent",
              "Set bullet indentation once, then reuse it",
              "Avoid tables, text boxes, icons and skill bars",
              "Keep dates aligned with a consistent format",
              "Use page breaks deliberately, never repeated blank lines",
              "Check links, spelling and UK date conventions",
              "Keep the filename professional and recognisable",
            ].map((item) => (
              <li
                key={item}
                className="flex gap-3 border-t border-line pt-4 text-sm font-bold text-navy"
              >
                <Check className="h-5 w-5 shrink-0 text-success" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <SectionLabel>Export without surprises</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Inspect the file a recruiter will actually open.
            </h2>
            <ol className="mt-8 divide-y divide-line rounded-xl border border-line bg-white">
              {[
                "Save the editable DOCX as your master copy.",
                "Export or Save As PDF using the employer's requested filename.",
                "Open the exported file and check every page at normal zoom.",
                "Check page breaks, dates, links, bullets, whitespace and contact details.",
                "Send only the final version and keep the master for the next application.",
              ].map((item, index) => (
                <li key={item} className="flex gap-4 p-5 text-sm leading-7 text-muted">
                  <span className="font-bold text-navy">{index + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl border border-line-strong bg-white p-7 shadow-soft">
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-navy">
              Want the layout handled?
            </p>
            <h3 className="mt-4 font-display text-3xl font-semibold text-navy">
              Build online, preview first, pay once for the PDF.
            </h3>
            <p className="mt-4 text-sm leading-7 text-muted">
              WorkCV's guided builder is free to start. The one-time {site.price}{" "}
              PDF price is shown before download; there is no monthly builder plan
              in the standard flow.
            </p>
            <Link
              href="/cv-builder-no-subscription-uk"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy underline decoration-gold decoration-2 underline-offset-4"
            >
              See the no-subscription builder <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <RelatedLinksSection
        title="Continue with the right UK CV guidance."
        links={[
          ["Download the blank Word template", "/tools/blank-cv-template-uk"],
          ["CV personal statement examples", "/cv-personal-statement-uk"],
          ["Role-specific CV examples", "/templates"],
          ["How to write a UK CV", "/how-to-write-a-cv-uk"],
        ]}
      />
      <FaqSection faqs={faqs} title="Editing a CV template in Word: common questions." />
      <FinalCta
        heading="Start with a clean CV file."
        body="Download the free DOCX or open the guided builder when you want previewed formatting and a one-time PDF download."
        primaryHref="/tools/blank-cv-template-uk"
        primary="Download free Word template"
        secondaryHref="/editor?new=1"
        secondary="Build online"
      />
    </>
  );
}
