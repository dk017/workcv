import type { Metadata } from "next";
import { FileCheck2, ShieldCheck, Sparkles } from "lucide-react";

import { CoverLetterGenerator } from "@/components/cover-letter-generator";
import { FaqSection, RelatedLinksSection, SectionLabel } from "@/components/marketing";
import { site } from "@/lib/site";

const path = "/tools/cover-letter-generator-uk";

export const metadata: Metadata = {
  title: "Free UK Cover Letter Generator - No Signup",
  description:
    "Generate a tailored UK cover letter from the job advert and your real experience. Free to use with no signup or subscription.",
  alternates: { canonical: path },
  openGraph: {
    title: "Free UK Cover Letter Generator",
    description:
      "Turn a job advert and your real evidence into a tailored four-paragraph UK cover letter.",
    url: path,
  },
};

const faqs = [
  {
    question: "Is this UK cover letter generator free?",
    answer:
      "Yes. You can generate a limited number of cover-letter drafts without creating an account or entering payment details.",
  },
  {
    question: "How long should a UK cover letter be?",
    answer:
      "The National Careers Service describes a cover letter as a short letter, usually three to five paragraphs. This tool produces four focused body paragraphs and keeps the draft suitable for a one-page letter in normal formatting.",
  },
  {
    question: "Should I write a new cover letter for every application?",
    answer:
      "Yes. Tailor the letter to the employer and role. Use the job description to choose relevant evidence, but do not copy it or claim experience you do not have.",
  },
  {
    question: "Will the generator invent experience?",
    answer:
      "The generator is instructed to use only your supplied evidence and checks for invented numeric claims. AI can still make mistakes, so verify every sentence against your CV before sending it.",
  },
  {
    question: "What happens to the information I paste?",
    answer:
      "WorkCV sends the form fields to the OpenAI API to create the draft and does not save them. Avoid entering sensitive personal data that the letter does not need.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "WorkCV UK Cover Letter Generator",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: `${site.url}${path}`,
  offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
};

export default function CoverLetterGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="quiet-grid border-b border-line bg-paper py-14 md:py-20">
        <div className="container-page">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-navy">Free UK application tool</p>
            <h1 className="font-display text-4xl font-semibold leading-[1.06] text-navy md:text-6xl">Free UK cover letter generator.</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">Paste the job description and add evidence from your CV. Get a tailored four-paragraph draft that connects what you have done to what this employer needs.</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy">
              <span className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-gold" />Tailored to the advert</span>
              <span className="flex items-center gap-2"><FileCheck2 className="h-5 w-5 text-success" />Evidence-led</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#63788c]" />No signup</span>
            </div>
          </div>
          <div className="mt-10 rounded-lg border border-line-strong bg-surface p-5 shadow-soft md:p-7"><CoverLetterGenerator /></div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>What makes it useful</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">A letter should add the connection your CV cannot.</h2>
            <p className="mt-6 text-base leading-8 text-muted">The National Careers Service recommends tailoring every letter, matching the employer&apos;s language, highlighting relevant evidence and supporting claims with facts. The generator follows that structure and leaves the final judgement with you.</p>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {[
              ["Open with intent", "Name the exact role and employer, then give a genuine reason for applying."],
              ["Connect evidence", "Use two focused paragraphs to link your strongest real examples to the vacancy."],
              ["Close professionally", "Summarise the fit, invite discussion and use the correct UK sign-off."],
            ].map(([title, body], index) => <article key={title} className="grid gap-4 py-6 sm:grid-cols-[44px_1fr]"><span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-paper text-sm font-bold text-navy">{index + 1}</span><div><h3 className="font-display text-2xl font-semibold text-navy">{title}</h3><p className="mt-2 text-sm leading-7 text-muted">{body}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div><SectionLabel>Guidance checked</SectionLabel><h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">Built around current UK careers guidance.</h2><p className="mt-6 text-base leading-8 text-muted">The draft uses the National Careers Service&apos;s three-to-five-paragraph structure, role-specific evidence and UK sign-off convention. It deliberately does not invent company research or candidate achievements.</p><p className="mt-4 text-sm font-bold text-navy">Research reviewed 10 July 2026.</p></div>
          <div className="grid content-start gap-3 text-sm font-bold text-navy"><a href="https://nationalcareers.service.gov.uk/careers-advice/covering-letter" target="_blank" rel="noreferrer" className="rounded-md border border-line bg-white p-4 hover:border-navy">National Careers Service: how to write a cover letter</a><a href="https://developers.openai.com/api/docs/guides/structured-outputs" target="_blank" rel="noreferrer" className="rounded-md border border-line bg-white p-4 hover:border-navy">OpenAI: structured model outputs</a></div>
        </div>
      </section>

      <RelatedLinksSection title="Use a matching structure." links={[["Open the UK cover letter template", "/tools/cover-letter-template-uk"]]} />
      <FaqSection faqs={faqs} title="UK cover letter questions." />
    </>
  );
}
