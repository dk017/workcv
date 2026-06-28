import type { Metadata } from "next";
import {
  Briefcase,
  FileCheck2,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";

import { FaqSection, SectionLabel } from "@/components/marketing";
import { PersonalStatementGenerator } from "@/components/personal-statement-generator";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free UK CV Personal Statement Generator",
  description:
    "Generate a tailored 3–4 sentence UK CV personal statement from your background, target role and real skills or achievements.",
  alternates: { canonical: "/tools/personal-statement-generator" },
  openGraph: {
    title: "Free UK CV Personal Statement Generator",
    description:
      "Turn your real experience and achievements into a concise, targeted UK CV profile.",
    url: "/tools/personal-statement-generator",
  },
};

const faqItems = [
  {
    question: "How long should a UK CV personal statement be?",
    answer:
      "The National Careers Service describes it as a few short lines, while Prospects recommends no more than 150 words. This generator deliberately produces 3–4 sentences and 50–100 words so the profile stays easy to scan and leaves room for evidence elsewhere in the CV.",
  },
  {
    question: "Should a CV personal statement use first or third person?",
    answer:
      "Either can work if the voice stays consistent, but concise UK CV profiles often use implied first person, such as “Customer service adviser with three years’ experience”. WorkCV avoids personal pronouns so it does not switch between “I” and “he” or “she”.",
  },
  {
    question: "Will the generator invent experience or achievements?",
    answer:
      "It is instructed to use only the details you provide, and WorkCV rejects outputs that introduce new numeric claims. You must still check every statement before using it because AI can make mistakes and cannot verify your employment history.",
  },
  {
    question: "Should I use the same personal statement for every job?",
    answer:
      "No. The National Careers Service and Prospects both advise tailoring a CV to the vacancy. Use the exact target role and prioritise skills or achievements that match that advert.",
  },
  {
    question: "How is my information handled?",
    answer:
      "WorkCV sends the three form fields to the OpenAI API and does not save them. OpenAI does not use API inputs or outputs to train its models by default, but may retain API data for up to 30 days for abuse monitoring unless a qualifying zero-retention arrangement applies.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "WorkCV UK Personal Statement Generator",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: `${site.url}/tools/personal-statement-generator`,
  description:
    "A free tool that generates a concise, evidence-led personal statement for a UK CV.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
};

export default function PersonalStatementGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />

      <section className="quiet-grid border-b border-line bg-paper py-14 md:py-20">
        <div className="container-page">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              Free UK CV tool
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.06] text-navy md:text-6xl">
              Write a personal statement built around your evidence.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              Add your background, target role and strongest real examples.
              WorkCV turns them into a concise UK CV profile without generic
              “passionate professional” filler.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy">
              <span className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-success" />
                3–4 sentences
              </span>
              <span className="flex items-center gap-2">
                <ScanSearch className="h-5 w-5 text-gold" />
                Evidence-led
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#63788c]" />
                No account required
              </span>
            </div>
          </div>

          <div className="mt-10 rounded-lg border border-line-strong bg-surface p-5 shadow-soft md:p-7">
            <PersonalStatementGenerator />
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page">
          <SectionLabel>What earns the space</SectionLabel>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
                A profile is useful only when it is specific.
              </h2>
              <p className="mt-6 text-base leading-8 text-muted">
                The top of a CV should quickly connect your relevant background
                to the vacancy. Unsupported adjectives do not make that case;
                a role, a skill and a concrete result can.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                {
                  icon: Briefcase,
                  title: "Identify",
                  body: "State the professional, educational or transferable background that matters for this role.",
                },
                {
                  icon: FileCheck2,
                  title: "Prove",
                  body: "Use supplied tools, responsibilities or measured achievements instead of broad claims.",
                },
                {
                  icon: ScanSearch,
                  title: "Target",
                  body: "Name the vacancy and show how the evidence supports the value you can bring to it.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="border-t-2 border-navy pt-5">
                    <Icon className="h-6 w-6 text-gold" />
                    <h3 className="mt-4 font-display text-2xl font-semibold text-navy">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted">{item.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionLabel>Evidence checked</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              The guidance behind the generator.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-muted">
              The National Careers Service advises a few short lines that make
              you sound right for the job and recommends tailoring the CV to the
              advert. Prospects says the profile should be concise, no longer
              than 150 words, backed by evidence and free from clichés or empty
              claims.
            </p>
            <p className="mt-4 text-sm leading-7 text-muted">
              Prospects also warns that AI text can sound generic or insincere.
              Treat the result as an edited first draft: verify every claim,
              restore your natural voice and tailor it for each application.
            </p>
            <p className="mt-4 text-sm font-bold text-navy">
              Research reviewed 28 June 2026.
            </p>
          </div>
          <div className="grid content-start gap-3 text-sm font-bold text-navy">
            <a
              href="https://nationalcareers.service.gov.uk/careers-advice/cv-sections"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-line bg-white p-4 hover:border-navy"
            >
              National Careers Service: CV introduction and tailoring
            </a>
            <a
              href="https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/writing-a-personal-statement-for-your-cv/"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-line bg-white p-4 hover:border-navy"
            >
              Prospects: personal statement content, length and AI use
            </a>
            <a
              href="https://platform.openai.com/docs/guides/your-data"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-line bg-white p-4 hover:border-navy"
            >
              OpenAI: API data controls and retention
            </a>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqItems} title="UK CV personal statement questions." />
    </>
  );
}
