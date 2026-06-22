import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, FileText, Globe2, GraduationCap, SearchCheck } from "lucide-react";

import { ButtonLink, FaqSection, FinalCta, SectionLabel } from "@/components/marketing";

export const metadata: Metadata = {
  title: "CV vs Resume UK - Difference and Which to Use",
  description:
    "Understand CV vs resume terminology in the UK, when the documents differ, and which format to send for UK, international and academic applications.",
  alternates: { canonical: "/cv-vs-resume-uk" },
  openGraph: {
    title: "CV vs Resume UK - Which Should You Send?",
    description:
      "A practical UK guide to CV, resume and academic CV terminology, with clear application scenarios.",
    url: "/cv-vs-resume-uk",
  },
};

const faqs = [
  {
    question: "Are a CV and a resume the same in the UK?",
    answer:
      "For ordinary job applications, they often refer to the same kind of document. UK employers usually call it a CV, while resume or résumé is more common in the US and Canada. The advert's instructions should take priority over the general convention.",
  },
  {
    question: "What if a UK job advert asks for a resume?",
    answer:
      "Use the employer's wording and follow any stated page, file or content requirements. If none are given, a concise UK-style CV tailored to the role is normally a sensible response, but ask the recruiter when the request is genuinely ambiguous.",
  },
  {
    question: "Does a UK CV have to be two pages?",
    answer:
      "No fixed page count suits every candidate. Two A4 pages is common guidance for many applicants, but a school leaver may need less and academic, medical or senior applications may require more. Relevance and the employer's instructions matter more than filling a target length.",
  },
  {
    question: "Is an academic CV different from a job CV?",
    answer:
      "Yes. An academic CV may include publications, research, teaching, grants, conferences and professional activity, and can be longer than a standard job CV. Follow the institution's application guidance.",
  },
  {
    question: "Should my filename say CV or resume?",
    answer:
      "Either term can work, but match the employer's wording where possible. Use a clear filename such as Firstname-Lastname-CV.pdf or Firstname-Lastname-Resume.pdf rather than CV-final-new.pdf.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const comparison = [
  ["Usual context", "UK job applications", "US, Canadian or internationally worded applications", "University, research and specialist academic applications"],
  ["Typical focus", "Relevant work, skills, education and evidence for the role", "Concise, targeted evidence for a specific role", "Fuller record of research, teaching, publications and academic activity"],
  ["Length", "Often up to two A4 pages, with exceptions", "Usually concise; follow the employer's limit", "Can run beyond two pages when the record requires it"],
  ["Best rule", "Tailor it to the person specification", "Follow the employer's regional and application instructions", "Follow the institution and discipline's requirements"],
];

const scenarios = [
  ["A UK vacancy asks for a CV", "Send a tailored UK CV. Mirror the role's language, include relevant evidence and use a clear PDF filename."],
  ["A UK vacancy asks for a resume", "Do not panic or simply change the heading. Check the requested content and length, then use the employer's terminology."],
  ["An international employer is hiring in the UK", "Read the advert and application portal closely. The organisation may use resume globally while still expecting UK-relevant evidence."],
  ["A university or research post asks for a CV", "Treat this as a specialist document. Include the academic evidence requested rather than forcing it into a standard two-page job CV."],
];

export default function CvVsResumeUkPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-surface py-16 md:py-24">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <SectionLabel>CV vs resume UK</SectionLabel>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[0.98] text-navy md:text-7xl">
              In the UK, the document is usually called a CV.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted md:text-xl">
              For most jobs, CV and resume describe the same practical task: present the evidence that makes you relevant. The important difference is context. Follow the employer&apos;s wording, requirements and market—not a rigid internet rule.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/resume-builder-uk-no-subscription">Build the right document</ButtonLink>
              <ButtonLink href="/resume-template-uk" variant="secondary">See a UK resume template</ButtonLink>
            </div>
          </div>

          <aside className="rounded-2xl border border-line bg-paper p-7 shadow-sm md:p-9">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold-dark">The quick answer</p>
            <div className="mt-6 space-y-5">
              {[
                ["UK jobs", "Use CV unless the employer asks for something else."],
                ["US or Canadian context", "Resume is the more familiar term."],
                ["Academic roles", "An academic CV is a different, often longer record."],
                ["Every application", "The advert's instructions override general convention."],
              ].map(([title, body]) => (
                <div key={title} className="flex gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-green" />
                  <p className="text-sm leading-6 text-muted"><strong className="block text-navy">{title}</strong>{body}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-paper py-20 md:py-24">
        <div className="container-page">
          <SectionLabel>What the terms mean</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">Similar purpose. Different conventions.</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
            Prospects explains that CV means curriculum vitae and that countries such as the USA and Canada commonly use the term résumé. That does not mean every document bearing either name follows one universal format.
          </p>
          <div className="mt-10 hidden overflow-x-auto rounded-xl border border-line md:block">
            <table className="min-w-[760px] w-full border-collapse text-left">
              <thead className="bg-navy text-white">
                <tr><th className="p-4">Question</th><th className="p-4">UK job CV</th><th className="p-4">US-style resume</th><th className="p-4">Academic CV</th></tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row[0]} className="border-t border-line align-top">
                    {row.map((cell, index) => <td key={cell} className={`p-4 text-sm leading-6 ${index === 0 ? "font-bold text-navy" : "text-muted"}`}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 grid gap-4 md:hidden">
            {[
              ["UK job CV", comparison.map((row) => [row[0], row[1]])],
              ["US-style resume", comparison.map((row) => [row[0], row[2]])],
              ["Academic CV", comparison.map((row) => [row[0], row[3]])],
            ].map(([title, rows]) => (
              <article key={title as string} className="rounded-xl border border-line bg-white p-5">
                <h3 className="font-display text-2xl font-semibold text-navy">{title as string}</h3>
                <dl className="mt-5 space-y-4">
                  {(rows as string[][]).map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs font-bold uppercase tracking-[0.12em] text-gold-dark">{label}</dt>
                      <dd className="mt-1 text-sm leading-6 text-muted">{value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20 md:py-24">
        <div className="container-page">
          <SectionLabel>Choose by context</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">Use the advert as your source of truth.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {scenarios.map(([title, body], index) => {
              const Icon = [FileText, SearchCheck, Globe2, GraduationCap][index];
              return <article key={title} className="rounded-xl border border-line bg-paper p-6"><Icon className="h-7 w-7 text-gold" /><h3 className="mt-5 font-display text-2xl font-semibold text-navy">{title}</h3><p className="mt-3 text-sm leading-7 text-muted">{body}</p></article>;
            })}
          </div>
        </div>
      </section>

      <section className="bg-paper py-20 md:py-24">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-line bg-white p-7">
            <h2 className="font-display text-3xl font-semibold text-navy">Do not write to an arbitrary page count.</h2>
            <p className="mt-4 leading-7 text-muted">Prospects commonly recommends no more than two A4 pages for a standard CV, while recognising exceptions. Cut irrelevant material first; do not shrink readable type or add filler merely to hit two pages.</p>
          </div>
          <div className="rounded-xl border border-line bg-white p-7">
            <h2 className="font-display text-3xl font-semibold text-navy">Make the file easy to identify.</h2>
            <p className="mt-4 leading-7 text-muted">Use your name, the requested document term and PDF format: <strong className="text-navy">Amelia-Clarke-CV.pdf</strong>. Before sending, open the exported file and check every page, date and contact detail.</p>
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page">
          <SectionLabel>Sources checked</SectionLabel>
          <h2 className="font-display text-4xl font-semibold text-navy">Current UK guidance behind this page.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Prospects: How to write a CV", "https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/how-to-write-a-cv"],
              ["National Careers Service: CV sections", "https://nationalcareers.service.gov.uk/careers-advice/cv-sections"],
              ["GOV.UK: Recruitment and discrimination", "https://www.gov.uk/employer-preventing-discrimination/recruitment"],
            ].map(([label, href]) => <a key={href} href={href} target="_blank" rel="nofollow noopener noreferrer" className="group flex items-center justify-between gap-4 rounded-xl border border-line bg-paper p-5 font-bold text-navy transition hover:border-navy">{label}<ArrowRight className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" /></a>)}
          </div>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-page">
          <SectionLabel>Next step</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[["UK resume template", "/resume-template-uk"], ["No-subscription resume builder", "/resume-builder-uk-no-subscription"], ["How to write a UK CV", "/how-to-write-a-cv-uk"]].map(([label, href]) => <Link key={href} href={href} className="group flex min-h-24 items-center justify-between gap-4 rounded-xl border border-line bg-white p-5 font-bold text-navy transition hover:-translate-y-1 hover:border-navy">{label}<ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" /></Link>)}
          </div>
        </div>
      </section>

      <FaqSection faqs={faqs} title="Questions about CV and resume terminology in the UK." />
      <FinalCta heading="Call it a CV or resume. Build it for the job." body="Start with a UK-ready structure, tailor the evidence and preview the document before deciding whether to unlock its PDF." primaryHref="/resume-builder-uk-no-subscription" primary="Build my document" secondaryHref="/resume-template-uk" secondary="View the template" />
    </>
  );
}
