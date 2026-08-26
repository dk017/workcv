import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Download, FileText, ShieldCheck } from "lucide-react";

import { FaqSection, RelatedLinksSection, SectionLabel } from "@/components/marketing";
import { site } from "@/lib/site";

const path = "/tools/blank-cv-template-uk";

export const metadata: Metadata = {
  title: "Free CV Template UK Download - Editable Word | WorkCV",
  description:
    "Download a free editable CV template for UK jobs as a Word document. No signup, payment or subscription; tailor it before you apply.",
  alternates: { canonical: path },
  openGraph: {
    title: "Free Editable CV Template UK - Word Download",
    description:
      "Download a clean, single-column UK CV template in Word format and tailor it to the job advert.",
    url: path,
  },
};

const faqs = [
  {
    question: "Is the blank CV template really free?",
    answer:
      "Yes. The editable Word document downloads directly with no signup, email gate, payment or subscription. The separate online builder is a different product flow: it is free to build and preview, then charges the one-time PDF price shown before download.",
  },
  {
    question: "What format is the free CV template?",
    answer:
      "It is a genuine .docx document for Microsoft Word and compatible editors. Keep the Word file as your editable master and export a PDF when the employer asks for one.",
  },
  {
    question: "Is this CV template ATS-friendly?",
    answer:
      "It uses one column, standard headings and ordinary text rather than tables, text boxes, icons or graphics. That avoids common parsing problems, but no template can guarantee how every applicant tracking system will read a file.",
  },
  {
    question: "What should I remove before sending the CV?",
    answer:
      "Replace every grey instruction, delete unused sections, check your contact details and tailor the profile, skills and evidence to the vacancy. Never leave sample prompts in the final document.",
  },
  {
    question: "How do I save the Word CV as a PDF?",
    answer:
      "In Word, use File, Save As or Export, choose PDF, then open the PDF and check page breaks, dates, links, spacing and the filename before you apply.",
  },
];

const roleLinks = [
  ["Customer service CV example", "/cv-template-customer-service-uk"],
  ["Care worker CV example", "/cv-template-care-worker-uk"],
  ["Warehouse CV example", "/cv-template-warehouse-uk"],
  ["Nurse CV example", "/cv-template-nurse-uk"],
  ["Graduate CV example", "/cv-template-graduate-uk"],
  ["Engineer CV example", "/cv-template-engineer-uk"],
  ["Career change CV guide", "/career-change-cv-uk"],
  ["Return-to-work CV guide", "/return-to-work-cv-uk"],
] as Array<[string, string]>;

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "WorkCV Free Blank UK CV Template",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Microsoft Word compatible",
    url: `${site.url}${path}`,
    fileFormat: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
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

export default function BlankCvTemplatePage() {
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
            <SectionLabel>Free Word download</SectionLabel>
            <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.06] text-navy md:text-6xl">
              Free UK CV template to download and edit.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              Start with a clean, single-column UK CV template in Microsoft Word.
              It is genuinely free to download: no account, email gate, payment,
              watermark or subscription.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/api/tools/blank-cv-template"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-navy px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-navy-hover"
              >
                <Download className="h-4 w-4" />
                Download free Word template
              </a>
              <Link
                href="/editor?new=1"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-line-strong bg-white px-6 py-3 text-sm font-bold text-navy transition hover:-translate-y-0.5"
              >
                Build online instead <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gold" />
                Editable .docx
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-success" />
                Direct download
              </span>
            </div>
          </div>

          <div className="border border-line-strong bg-white p-7 shadow-soft">
            <p className="text-center font-display text-2xl font-semibold text-navy">
              YOUR NAME
            </p>
            <p className="mt-2 text-center text-xs text-muted">
              Town · Phone · Email · LinkedIn
            </p>
            {["PERSONAL PROFILE", "KEY SKILLS", "WORK EXPERIENCE", "EDUCATION"].map(
              (heading) => (
                <div key={heading} className="mt-6">
                  <p className="border-b border-navy pb-1 text-xs font-bold text-navy">
                    {heading}
                  </p>
                  <div className="mt-3 grid gap-2">
                    <span className="h-2 w-full bg-line" />
                    <span className="h-2 w-5/6 bg-line" />
                    <span className="h-2 w-3/4 bg-line" />
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>What is inside</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              A useful structure, deliberately plain.
            </h2>
            <p className="mt-6 text-base leading-8 text-muted">
              The document keeps content in the body, uses recognisable UK CV
              headings and gives you prompts for evidence-led bullets. There are
              no sidebars, skill charts, photos or decorative blocks to fight with.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              "Contact details",
              "Personal profile",
              "Key skills",
              "Work experience",
              "Education and qualifications",
              "Additional information",
              "References line",
              "Evidence-led bullet prompts",
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

      <section className="border-y border-line bg-paper py-20">
        <div className="container-page">
          <SectionLabel>Use it well</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Turn a blank page into evidence in three passes.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["1", "Replace prompts", "Add your own contact details, profile, dates, employers, qualifications and skills. Delete every instruction you do not need."],
              ["2", "Tailor to the advert", "Use the vacancy's language where it is accurate, then prove each important skill with a responsibility, result, project or training example."],
              ["3", "Inspect the final file", "Keep the DOCX master, export the requested format and check page breaks, links, dates, spacing and the filename before applying."],
            ].map(([number, title, body]) => (
              <div key={number} className="rounded-xl border border-line bg-white p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-navy text-sm font-bold text-white">
                  {number}
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">{body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm font-bold text-navy">
            Template reviewed 26 August 2026. The file is a starting point, not a
            guarantee of an interview or ATS compatibility.
          </p>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>Free template or guided builder?</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Choose the workflow that fits this application.
            </h2>
            <p className="mt-6 text-base leading-8 text-muted">
              Download the template when you want a free Word file and are happy
              to format it yourself. Use the online builder when you want guided
              sections, a live preview and a finished PDF without managing layout
              manually.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-white p-6">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-navy">
                Free Word template
              </p>
              <p className="mt-4 text-sm leading-7 text-muted">
                Direct .docx download, no signup and no payment. You edit, tailor
                and export the document yourself.
              </p>
              <Link
                href="/tools/cv-template-word-uk"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-navy underline decoration-gold decoration-2 underline-offset-4"
              >
                Read the Word editing guide <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-xl border-2 border-navy bg-white p-6">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-navy">
                Guided online builder
              </p>
              <p className="mt-4 text-sm leading-7 text-muted">
                Build and preview first, then pay {site.price} once when you want
                the finished PDF. There is no monthly builder plan in the standard
                download flow.
              </p>
              <Link
                href="/cv-builder-no-subscription-uk"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-navy underline decoration-gold decoration-2 underline-offset-4"
              >
                See the no-subscription flow <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-20">
        <div className="container-page">
          <SectionLabel>Tailor by target role</SectionLabel>
          <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
            Start blank, then borrow the right evidence.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted">
            These examples show the details recruiters usually need to see for
            different UK roles. Use them for ideas, not copy-and-paste claims.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {roleLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="group flex min-h-20 items-center justify-between gap-3 rounded-md border border-line bg-white p-4 text-sm font-bold text-navy hover:border-navy"
              >
                {label}
                <ArrowRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-paper py-16">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <SectionLabel>UK formatting check</SectionLabel>
            <h2 className="font-display text-3xl font-semibold text-navy">
              Check the essentials before you send it.
            </h2>
            <p className="mt-4 max-w-3xl leading-7 text-muted">
              Keep the layout readable, use reverse-chronological experience,
              remove unnecessary personal details and tailor the first half of the
              page to the vacancy. The National Careers Service has a useful guide
              to the sections employers expect.
            </p>
          </div>
          <a
            href="https://nationalcareers.service.gov.uk/careers-advice/cv-sections"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-line-strong bg-white px-5 text-sm font-bold text-navy hover:border-navy"
          >
            Read official CV guidance
          </a>
        </div>
      </section>

      <RelatedLinksSection
        title="More ways to improve the application."
        links={[
          ["How to edit a CV in Word", "/tools/cv-template-word-uk"],
          ["CV personal statement examples", "/cv-personal-statement-uk"],
          ["Compare WorkCV templates", "/templates"],
          ["How to write a UK CV", "/how-to-write-a-cv-uk"],
        ]}
      />
      <FaqSection faqs={faqs} title="Free UK CV template questions." />
    </>
  );
}
