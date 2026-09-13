import type { Metadata } from "next";
import { FileCheck2, ShieldCheck, Sparkles } from "lucide-react";

import { JobApplicationPack } from "@/components/job-application-pack";
import {
  FaqSection,
  MoneyPageCta,
  RelatedLinksSection,
  SectionLabel,
} from "@/components/marketing";
import { site } from "@/lib/site";

const path = "/tools/job-application-pack-uk";

export const metadata: Metadata = {
  title: "Free UK Job Application Pack Generator",
  description:
    "Turn a UK job advert and your real CV evidence into a reviewable application pack with requirements, bullets, cover letter and interview prompts.",
  alternates: { canonical: path },
  openGraph: {
    title: "Free UK Job Application Pack Generator",
    description:
      "Create a truthful, editable application plan from one vacancy and your own evidence.",
    url: path,
  },
};

const faqs = [
  {
    question: "What does the Job Application Pack include?",
    answer:
      "It reviews vacancy terms against your pasted evidence, then drafts requirements to review, five CV bullets, a short profile, a cover letter, eight interview questions and a thank-you email.",
  },
  {
    question: "Is the job application pack free?",
    answer:
      "Yes. You can try the first result without signing up or entering payment details. Fair-use limits apply to the generation service.",
  },
  {
    question: "Will it invent experience for my CV?",
    answer:
      "It is instructed to use only the advert and evidence you provide, and the result labels requirements that are not evidenced. Still check every sentence: generated drafts can make mistakes and must not be used to claim experience you do not have.",
  },
  {
    question: "What happens to the CV and job advert I paste?",
    answer:
      "The text is sent to the generation provider for this request and is not saved by WorkCV. Remove contact details and sensitive information that the application does not need.",
  },
  {
    question: "Can I move the result into my WorkCV CV?",
    answer:
      "Yes. The handoff carries the profile, found keywords and vacancy priorities into the editor. The cover letter, interview prompts and thank-you email remain separate drafts.",
  },
];

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "WorkCV UK Job Application Pack",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: `${site.url}${path}`,
  description: metadata.description,
  offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
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

export default function JobApplicationPackPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="quiet-grid border-b border-line bg-paper py-14 md:py-20">
        <div className="container-page">
          <div className="max-w-4xl">
            <SectionLabel>Free UK application tool</SectionLabel>
            <h1 className="font-display text-4xl font-semibold leading-[1.06] text-navy md:text-6xl">Build a job application pack from the vacancy and your real evidence.</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">Get one structured starting point for the CV, cover letter, interview and follow-up email. It is a draft to review—not a promise of an interview.</p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy">
              <span className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-gold" />Tailored to one advert</span>
              <span className="flex items-center gap-2"><FileCheck2 className="h-5 w-5 text-success" />Evidence-led</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#63788c]" />No signup</span>
            </div>
          </div>
          <div className="mt-10 rounded-lg border border-line-strong bg-surface p-5 shadow-soft md:p-7"><JobApplicationPack /></div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div><SectionLabel>Use it carefully</SectionLabel><h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">One vacancy. One evidence set. A clearer review.</h2></div>
          <div className="grid gap-5 text-base leading-8 text-muted"><p>The pack is designed to reduce the blank-page problem. It does not replace your judgement: remove unsupported wording, correct names and dates, and make the final documents sound like you.</p><p>Keep the advert open as you edit. If a requirement is marked not evidenced, treat that as a prompt to check your experience—not an invitation to add a skill you do not have.</p></div>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-16 md:py-20">
        <div className="container-page">
          <SectionLabel>What you receive</SectionLabel>
          <h2 className="max-w-4xl font-display text-4xl font-semibold text-navy md:text-5xl">Eight outputs, each tied to one vacancy.</h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted">The result is organised so you can review evidence before copying prose. It shows what the advert asks for, what your input supports and where a human decision is still needed.</p>
          <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["Requirement map", "Important duties and criteria, labelled by whether your evidence supports them."],
              ["CV profile", "A short role-focused draft to edit for tone, accuracy and seniority."],
              ["Five CV bullets", "Evidence-led starting points—not invented achievements or guaranteed ATS claims."],
              ["Keyword review", "Relevant vacancy language to use only where it accurately describes you."],
              ["Cover letter", "A concise draft connecting your evidence to the employer’s stated needs."],
              ["Eight questions", "Likely interview prompts with a focus and an answer-planning cue."],
              ["Follow-up email", "A short post-interview draft with role and employer context."],
              ["Editor handoff", "Carry the useful CV material into WorkCV, then review every field yourself."],
            ].map(([title, body]) => <article key={title} className="rounded-lg border border-line bg-white p-5"><h3 className="font-display text-xl font-semibold text-navy">{title}</h3><p className="mt-3 text-sm leading-7 text-muted">{body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="bg-surface py-16 md:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div><SectionLabel>Good input</SectionLabel><h2 className="font-display text-4xl font-semibold text-navy">Give it facts it can work with.</h2><ul className="mt-7 grid gap-3 text-sm leading-7 text-muted">{[
            "Paste the complete advert, including duties and essential criteria—not only the job title.",
            "Use evidence from your existing CV or notes: responsibilities, tools, scope and verified outcomes.",
            "Include your motivation only when it is genuine and specific to the role.",
            "Remove contact details, references and sensitive personal information before submitting.",
          ].map((item) => <li key={item} className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold" />{item}</li>)}</ul></div>
          <div className="rounded-lg border border-line-strong bg-white p-6 shadow-sm"><p className="text-sm font-bold uppercase tracking-[0.14em] text-gold-dark">Mini example</p><p className="mt-4 text-sm leading-7 text-muted"><strong className="text-navy">Advert asks:</strong> handle customer complaints, maintain accurate records and work across teams.</p><p className="mt-3 text-sm leading-7 text-muted"><strong className="text-navy">Useful evidence:</strong> “Resolved delivery queries by checking order records, coordinating with warehouse colleagues and updating customers until closure.”</p><p className="mt-3 text-sm leading-7 text-muted"><strong className="text-navy">Weak input:</strong> “Hard-working people person.” It gives the tool no situation, action, responsibility or outcome to use.</p></div>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-16 md:py-20">
        <div className="container-page"><SectionLabel>A five-step review</SectionLabel><h2 className="max-w-4xl font-display text-4xl font-semibold text-navy md:text-5xl">Do not paste the result straight into an application.</h2><ol className="mt-9 grid gap-5 md:grid-cols-5">{[
          ["1", "Check support", "Delete any statement your input does not prove."],
          ["2", "Correct facts", "Verify names, tools, dates, titles and every number."],
          ["3", "Restore your voice", "Replace generic wording with language you would actually use."],
          ["4", "Prioritise", "Keep the strongest evidence for this vacancy; remove repetition."],
          ["5", "Preview", "Check the final CV, letter and attachment names before submitting."],
        ].map(([number, title, body]) => <li key={number} className="rounded-lg border border-line bg-white p-5"><span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">{number}</span><h3 className="mt-4 font-display text-xl font-semibold text-navy">{title}</h3><p className="mt-2 text-sm leading-7 text-muted">{body}</p></li>)}</ol></div>
      </section>

      <MoneyPageCta heading="Turn the pack into a finished UK CV." body={`Build and preview the document behind your application, then pay ${site.price} once only if you download the PDF.`} trackingContext="job_application_pack_page" />
      <RelatedLinksSection title="Continue with the application." links={[["Prepare for a job interview", "/how-to-prepare-for-a-job-interview-uk"], ["Common interview questions", "/common-job-interview-questions-uk"], ["Cover letter generator", "/tools/cover-letter-generator-uk"], ["ATS score checker", "/tools/ats-score-checker"], ["No-subscription CV builder", "/cv-builder-no-subscription-uk"]]} />
      <FaqSection faqs={faqs} title="Job application pack questions." />
    </>
  );
}
