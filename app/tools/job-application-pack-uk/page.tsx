import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck2, ShieldCheck, Sparkles } from "lucide-react";
import { CustomerAnswer, CustomerQuestionNav } from "@/components/customer-answer";
import { GuideTable } from "@/components/cv-guide";
import { customerQuestionHref } from "@/lib/customer-questions";
import { customerContentReview, displayReviewDate } from "@/lib/customer-content-review";

import { TailoringDemo } from "@/components/tailoring-demo";
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
  title: "Tailor Your CV to a Job Description: Free UK Tool",
  description:
    "Paste your CV and a job advert to draft a tailored profile, CV bullets and cover letter. Review the evidence and copy the results free. Fair-use limits apply.",
  alternates: { canonical: path },
  openGraph: {
    title: "Tailor Your CV to a Job Description: Free UK Tool",
    description:
      "Create a truthful, editable application plan from one vacancy and your own evidence.",
    url: path,
  },
};

const faqs = [
  {
    question: "Does Job Search Pass cover several tailored applications?",
    answer: `Job Search Pass costs ${site.passPrice} once and covers existing documents and new documents created during ${site.passDays} days, with no renewal. Covered documents stay editable and downloadable afterwards. New documents after expiry need a purchase. One saved CV and matching letter costs ${site.price} once and can be edited and reused for other applications; Pass is useful for keeping separate saved versions. Neither option promises unlimited AI generation or an interview.`,
  },
  {
    question: "Does this rewrite my entire CV automatically?",
    answer: "No. It drafts a profile, five bullets and a letter alongside an evidence review. Your existing roles, dates, qualifications and omitted sections still need review. When you continue to the editor, check the import and assign each suggested bullet to the role where it actually happened.",
  },
  {
    question: "What does the Job Application Pack include?",
    answer:
      "It reviews vacancy terms against your pasted evidence, then drafts requirements to review, five CV bullets, a short profile, a cover letter, eight interview questions and a thank-you email.",
  },
  {
    question: "Is the job application pack free?",
    answer:
      "Yes. Generating, editing and copying the text is free without signup or payment details. Fair-use limits apply. Saving in the editor requires email-code login; personalised PDF and Word downloads are paid.",
  },
  {
    question: "Will it invent experience for my CV?",
    answer:
      "It is instructed to use your CV and motivation as candidate evidence, with the advert used for relevance, and the result labels requirements that are not evidenced. Still check every sentence: generated drafts can make mistakes and must not be used to claim experience you do not have.",
  },
  {
    question: "What happens to the CV and job advert I paste?",
    answer:
      "The text you submit is sent through WorkCV to OpenAI to generate the result. Remove contact details and sensitive information that the review does not need; read WorkCV's privacy policy before submitting personal data.",
  },
  {
    question: "Can I move the result into my WorkCV CV?",
    answer:
      "Yes. The handoff imports your original CV and carries the suggested profile, vacancy priorities and complete pack into a new saved CV. In the Experience tab, review and apply bullets to the correct role. Your original text, cover letter, evidence review, interview prompts and thank-you email remain available as notes, separate from the CV PDF.",
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
  offers: { "@type": "Offer", name: "Free draft text generation, editing and copying; fair-use limits apply", price: "0", priceCurrency: "GBP" },
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
            <h1 className="font-display text-4xl font-semibold leading-[1.06] text-navy md:text-6xl">Tailor your CV and cover letter to a job description.</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">Paste your CV and one job advert. Review the evidence map, edit a tailored profile, five bullets and a matching cover letter, then copy the text free. No signup is needed; fair-use limits apply. This provides wording to review, not a complete rewritten CV.</p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy">
              <span className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-gold" />Tailored to one advert</span>
              <span className="flex items-center gap-2"><FileCheck2 className="h-5 w-5 text-success" />Evidence-led</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#63788c]" />No signup</span>
            </div>
          </div>
          <div className="mt-10 rounded-lg border border-line-strong bg-surface p-5 shadow-soft md:p-7"><JobApplicationPack /></div>
        </div>
      </section>

      <TailoringDemo />
      <CustomerQuestionNav ids={["Q10", "Q13"]} />
      <section className="bg-surface py-16"><div className="container-page max-w-5xl space-y-14">
        <CustomerAnswer questionId="Q10">
          <ol className="list-decimal space-y-2 pl-6"><li>Keep a factual master CV that you can return to.</li><li>Highlight one vacancy’s essential requirements.</li><li>Match each requirement to a real bullet, project or qualification; mark gaps honestly.</li><li>Edit the target role, profile, skill order and a few relevant bullets without changing job titles or dates.</li><li>Review the final CV and requested file format before applying.</li></ol>
          <p>The editor imports your original CV and keeps its source text for comparison. Your complete pack remains available in the Experience tab: review bullets before adding them to a selected role, edit the cover letter, and keep evidence and interview notes separately from the PDF. Original skills are not replaced by a keyword list. The <Link className="font-semibold underline" href={customerQuestionHref("Q13")}>advert-language example</Link> shows how to choose terms. For a longer application statement, use the free <Link className="font-semibold underline" href="/tools/supporting-statement-planner-uk">supporting-statement planner</Link>.</p>
        </CustomerAnswer>
        <CustomerAnswer questionId="Q13">
          <p>The following fictional Birch Office Services vacancy asks for Excel records, customer email replies, scheduling and Sage. Alex Morgan’s existing retail CV supports the first three; it does not supply Sage evidence.</p>
          <GuideTable caption="Fictional vacancy requirements against Alex Morgan's actual example CV" headings={["Advert term", "Real CV evidence", "Truthful next edit"]} rows={[
            ["Excel records", "Updated the Excel delivery tracker and checked discrepancies against delivery notes before escalating them.", "Place that bullet near the relevant admin evidence; do not claim advanced Excel or an error reduction."],
            ["Customer email replies", "Replied to customer order enquiries by email, recording the agreed next step in the order log.", "Use customer enquiries, email and order-log language in this real work context."],
            ["Scheduling", "Coordinated the weekly rota for a 12-person team, recording approved holiday and arranging cover with the manager.", "Connect rota coordination to scheduling while keeping the actual retail supervisor title."],
            ["Sage, marked essential", "No Sage evidence supplied in this CV.", "Ask whether you have genuine omitted evidence. If not, leave Sage out and decide whether this vacancy fits."],
          ]} />
          <p>A stronger Excel bullet names the tracker and the check performed. Repeating “Excel” in a skills list without an example adds less value. The <Link className="font-semibold underline" href={customerQuestionHref("Q11")}>WorkCV match checker</Link> can identify evidence gaps, but its result is not an employer score.</p>
        </CustomerAnswer>
        <p className="text-sm text-muted">Reviewed <time dateTime={customerContentReview[path]}>{displayReviewDate(customerContentReview[path])}</time>.</p>
      </div></section>

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

      <MoneyPageCta heading="Turn the pack into a finished UK CV." body={`Copy the draft text free. PDF and editable Word exports cost ${site.price} once for one saved CV and matching letter, or ${site.passPrice} once for Job Search Pass with ${site.passDays} days of new documents. Covered documents remain editable and downloadable afterwards. No renewal.`} trackingContext="job_application_pack_page" />
      <RelatedLinksSection title="Continue with the application." links={[["How to tailor a CV with evidence", "/tailor-cv-to-job-description-uk"], ["Track your job applications", "/tools/job-application-tracker-uk"], ["Prepare for a job interview", "/how-to-prepare-for-a-job-interview-uk"], ["Common interview questions", "/common-job-interview-questions-uk"], ["Cover letter generator", "/tools/cover-letter-generator-uk"], ["ATS CV checker", "/tools/ats-score-checker"], ["No-subscription CV builder", "/cv-builder-no-subscription-uk"]]} />
      <FaqSection faqs={faqs} title="Job application pack questions." />
    </>
  );
}
