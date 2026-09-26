import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, FileText, Mail, ShieldCheck } from "lucide-react";

import { ButtonLink, FaqSection, SectionLabel } from "@/components/marketing";
import { analyticsPlacements } from "@/lib/analytics-placements";
import { coverLetterExamples, exampleWordCount } from "@/lib/cover-letter-examples";
import { site } from "@/lib/site";

const path = "/cover-letter-examples-uk";
const reviewed = "26 September 2026";

export const metadata: Metadata = {
  title: "Cover Letter Examples UK: 10 Samples by Role (2026)",
  description:
    "10 UK cover letter examples for customer service, retail, teaching, care, internships, engineering, law, finance, apprenticeships and student jobs, with notes on why each works.",
  alternates: { canonical: path },
  openGraph: {
    title: "Cover Letter Examples UK: 10 Samples by Role",
    description: "Realistic UK cover letter examples by role, with the correct greeting, sign-off and structure.",
    url: path,
  },
};

const faqs = [
  {
    question: "How long should a UK cover letter be?",
    answer: "Keep it to one A4 page: usually three to five short paragraphs, roughly 250 to 400 words. The examples on this page are 120 to 180 words because they are mostly entry-level roles; for experienced roles, add detail only when it is relevant evidence.",
  },
  {
    question: "Should I write Yours sincerely or Yours faithfully?",
    answer: "Use Yours sincerely when you greet a named person, such as Dear Ms Patel. Use Yours faithfully when you do not know the name, such as Dear Sir or Madam or Dear Hiring Manager.",
  },
  {
    question: "Can I copy one of these cover letter examples?",
    answer: "Use the structure and reasoning, not the wording. The people and employers are fictional. Replace every detail with your own truthful experience and tailor the letter to the job advert.",
  },
  {
    question: "Do I need a cover letter if the application form does not ask for one?",
    answer: "If an employer only asks for a CV, a short cover letter is usually worth sending. If an online form already asks why you want the role and what you offer, you may not need a separate letter. Follow the advert's instructions.",
  },
  {
    question: "Should the cover letter match my CV?",
    answer: "Yes. Use the same name, contact details, job titles and dates, and ideally the same font and design. The National Careers Service recommends matching your CV's font and size.",
  },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Cover Letter Examples UK: 10 Samples by Role",
    description: metadata.description,
    datePublished: "2026-09-26",
    dateModified: "2026-09-26",
    author: { "@type": "Organization", name: "WorkCV Editorial Team", url: site.url },
    publisher: { "@type": "Organization", name: "WorkCV", url: site.url },
    mainEntityOfPage: `${site.url}${path}`,
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

const rules = [
  ["One A4 page", "Three to five short paragraphs. Recruiters prefer brief, relevant letters."],
  ["Name the role first", "Say which job you are applying for and where you saw it in the first sentence."],
  ["Evidence, not adjectives", "Show one or two real examples that match the advert's main requirements."],
  ["Sincerely or faithfully", "Named reader: Yours sincerely. No name: Yours faithfully."],
  ["Match your CV", "Same details, job titles and dates, ideally in the same font and design."],
] as const;

export default function CoverLetterExamplesPage() {
  return (
    <>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <section className="quiet-grid border-b border-line bg-paper py-14 md:py-20">
        <div className="container-page">
          <div className="max-w-4xl">
            <SectionLabel>UK cover letter examples</SectionLabel>
            <h1 className="font-display text-4xl font-semibold leading-[1.06] text-navy md:text-6xl">
              Cover letter examples UK: 10 samples by role.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              Realistic UK cover letters for common jobs, from customer service and retail to teaching, law and
              apprenticeships. Each example uses UK conventions and explains why it works, so you can adapt the
              reasoning to your own application.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy">
              <span className="flex items-center gap-2"><Mail className="h-5 w-5 text-gold" />10 role examples</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-success" />UK greeting and sign-off</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#63788c]" />Reviewed {reviewed}</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/editor?new=1" trackingLabel={analyticsPlacements.coverLetterExamplesHero}>
                Write my CV and cover letter
              </ButtonLink>
              <ButtonLink href="/tools/cover-letter-template-uk" variant="secondary" trackingLabel={analyticsPlacements.coverLetterExamplesTemplate}>
                Free Word template
              </ButtonLink>
            </div>
          </div>
          <nav aria-label="Examples on this page" className="mt-10 flex flex-wrap gap-2">
            {coverLetterExamples.map((example) => (
              <a key={example.slug} href={`#${example.slug}`} className="rounded-md border border-line-strong bg-white px-3 py-2 text-sm font-bold text-navy hover:border-navy">
                {example.role}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container-page">
          <SectionLabel>Before you start</SectionLabel>
          <h2 className="font-display text-3xl font-semibold text-navy md:text-4xl">Five UK cover letter rules every example follows.</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {rules.map(([title, body]) => (
              <li key={title} className="rounded-lg border border-line bg-white p-5">
                <h3 className="font-bold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {coverLetterExamples.map((example, index) => (
        <section key={example.slug} id={example.slug} className={`scroll-mt-24 border-t border-line py-16 ${index % 2 ? "bg-surface" : "bg-paper"}`}>
          <div className="container-page grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <SectionLabel>Example {index + 1}</SectionLabel>
              <h2 className="font-display text-3xl font-semibold text-navy md:text-4xl">{example.role} cover letter example</h2>
              <p className="mt-4 leading-7 text-muted">
                <strong className="text-navy">Scenario (fictional):</strong> {example.context}
              </p>
              <article className="mt-6 space-y-4 rounded-xl border border-line bg-white p-6 leading-7 text-ink shadow-sm md:p-8" aria-label={`${example.role} cover letter`}>
                <p>{example.greeting}</p>
                {example.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                <p>
                  {example.signOff}
                  <br />
                  {example.name}
                </p>
              </article>
              <p className="mt-3 text-xs text-muted">{exampleWordCount(example)} words in the body.</p>
            </div>
            <aside className="content-start space-y-6 lg:pt-16">
              <div className="rounded-lg border border-line bg-white p-5">
                <h3 className="font-bold text-navy">Why this works</h3>
                <ul className="mt-3 space-y-3 text-sm leading-6 text-muted">
                  {example.whyItWorks.map((point) => (
                    <li key={point} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />{point}</li>
                  ))}
                </ul>
              </div>
              {index % 3 === 0 && (
                <div className="rounded-lg border border-gold bg-gold-tint p-5">
                  <p className="font-bold text-navy">Make your own version</p>
                  <p className="mt-2 text-sm leading-6 text-navy">
                    WorkCV guides you through the same four paragraphs and gives the letter your CV&apos;s design. Build
                    and preview free, then download your CV and matching letter as PDF and Word for {site.price} once.
                  </p>
                  <div className="mt-4">
                    <ButtonLink href="/editor?new=1" trackingLabel={analyticsPlacements.coverLetterExamplesInline}>Start my CV and letter</ButtonLink>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>
      ))}

      <section className="border-t border-line bg-surface py-16">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <SectionLabel>Adapting an example</SectionLabel>
            <h2 className="font-display text-3xl font-semibold text-navy md:text-4xl">Turn an example into your letter in four steps.</h2>
            <ol className="mt-6 list-decimal space-y-3 pl-6 leading-7 text-muted">
              <li>Underline the two or three requirements the advert repeats or lists as essential.</li>
              <li>For each, pick one real thing you did and what happened as a result. Use it instead of the example&apos;s evidence.</li>
              <li>Rewrite the opening with the exact job title, where you saw it and your genuine reason for applying.</li>
              <li>Check the greeting and sign-off, remove anything you cannot back up, and read it against your CV.</li>
            </ol>
            <p className="mt-6 text-sm font-bold text-navy">Guidance reviewed {reviewed}.</p>
          </div>
          <div className="grid content-start gap-3 text-sm font-bold text-navy">
            <a href="https://nationalcareers.service.gov.uk/careers-advice/covering-letter" target="_blank" rel="noreferrer" className="rounded-md border border-line bg-white p-4 hover:border-navy">National Careers Service: covering letters</a>
            <a href="https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/cover-letters" target="_blank" rel="noreferrer" className="rounded-md border border-line bg-white p-4 hover:border-navy">Prospects: cover letters</a>
            <Link href="/tools/cover-letter-template-uk" className="rounded-md border border-line bg-white p-4 hover:border-navy">Free UK cover letter template (Word)</Link>
            <Link href="/tools/cover-letter-generator-uk" className="rounded-md border border-line bg-white p-4 hover:border-navy">Draft a tailored cover letter</Link>
            <Link href="/cv-examples-uk" className="rounded-md border border-line bg-white p-4 hover:border-navy">UK CV examples</Link>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqs} title="UK cover letter example questions." />

      <section className="border-t border-line bg-navy py-16 text-white">
        <div className="container-page max-w-4xl">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">Send a CV and cover letter that match.</h2>
          <p className="mt-4 leading-7 text-white/85">
            Build your CV, then write your letter in the Cover letter tab with the same header and design. Preview both
            free. Pay {site.price} once to download the CV and letter as PDF and Word, with no subscription.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <ButtonLink href="/editor?new=1" variant="secondary" trackingLabel={analyticsPlacements.coverLetterExamplesFinal}>Start my CV and letter</ButtonLink>
            <span className="flex items-center gap-2 text-sm font-bold text-white/85"><FileText className="h-4 w-4" />PDF and Word included</span>
          </div>
        </div>
      </section>
    </>
  );
}
