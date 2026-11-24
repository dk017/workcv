import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, FileText, ShieldCheck } from "lucide-react";

import { ButtonLink, FaqSection, RelatedLinksSection, SectionLabel } from "@/components/marketing";
import { ResignationLetterGenerator } from "@/components/resignation-letter-generator";
import { analyticsPlacements } from "@/lib/analytics-placements";
import { customerContentReview, displayReviewDate } from "@/lib/customer-content-review";
import { commercialRoutes, site } from "@/lib/site";
import { withAgentMetadata } from "@/lib/agent-metadata";

const path = "/tools/resignation-letter-generator-uk";
const reviewed = customerContentReview[path];

export const metadata: Metadata = withAgentMetadata(path, {
  title: "Resignation Letter Generator UK: Free, With Your Last Day",
  description:
    "Write a UK resignation letter or email in a minute. Works out your last day from your contract or the legal minimum notice. Free, no signup, Word download.",
  alternates: { canonical: path },
  openGraph: {
    title: "Free UK Resignation Letter Generator",
    description: "A resignation letter and email with the correct last day, worked out from your notice period.",
    url: path,
  },
});

const faqs = [
  {
    question: "How much notice do I have to give when I resign?",
    answer:
      "Check your contract or written statement first: it can require more than the legal minimum. If you have worked for your employer for a month or more, Acas says you must give at least 1 week's notice. With less than a month's service, no minimum applies unless your written terms say otherwise.",
  },
  {
    question: "When does my notice period start?",
    answer:
      "Unless your contract says otherwise, notice usually starts the day after you hand it in. So 1 week's notice given on a Monday runs until the following Monday. Months are calendar months, not four weeks.",
  },
  {
    question: "Do I have to resign in writing?",
    answer:
      "No, but Acas recommends it. A letter or email records when you gave notice and how long it is, which helps avoid disputes. Ask your employer to confirm in writing that they have received it.",
  },
  {
    question: "Do I have to give a reason for resigning?",
    answer:
      "No. A short reason can keep things friendly, but you can leave it out. The generator includes one only if you type it.",
  },
  {
    question: "Can I leave before my notice period ends?",
    answer:
      "Only if your employer agrees. You can ask to leave early, to be paid instead of working your notice (payment in lieu of notice), or to go on garden leave, but your employer does not have to say yes. Get any agreement in writing.",
  },
  {
    question: "Can I take back my resignation?",
    answer:
      "Tell your employer straight away if you change your mind. Acas says they do not have to accept it, but should consider it seriously, especially if you changed your mind quickly.",
  },
  {
    question: "Can I resign by email?",
    answer:
      "Yes, unless your contract sets out a particular way to resign. The generator writes an email version with a subject line. Keep a copy of what you send.",
  },
];

const schemas = [
  { "@context": "https://schema.org", "@type": "WebApplication", name: "WorkCV Resignation Letter Generator UK", applicationCategory: "BusinessApplication", operatingSystem: "Any", url: `${site.url}${path}`, offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" } },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
];

const sources = [
  ["Acas: how to resign", "https://www.acas.org.uk/how-to-resign"],
  ["Acas: resignation letter template", "https://www.acas.org.uk/resignation-letter-template"],
  ["GOV.UK: handing in your notice", "https://www.gov.uk/handing-in-your-notice"],
];

export default function Page() {
  return (
    <>
      {schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}

      <section className="quiet-grid border-b border-line bg-paper py-14 md:py-20">
        <div className="container-page">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-navy">Free UK tool</p>
            <h1 className="font-display text-4xl font-semibold leading-[1.06] text-navy md:text-6xl">Resignation letter generator, with your last day worked out.</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              Fill in a few details and get a polite UK resignation letter and email. Your last day is worked out from the
              notice period in your contract, or the legal minimum if your contract does not say.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy">
              <span className="flex items-center gap-2"><CalendarCheck className="h-5 w-5 text-gold" />Correct last day</span>
              <span className="flex items-center gap-2"><FileText className="h-5 w-5 text-success" />Letter, email or Word</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#63788c]" />No signup, nothing sent</span>
            </div>
          </div>
          <div className="mt-10 rounded-lg border border-line-strong bg-surface p-5 shadow-soft md:p-7">
            <ResignationLetterGenerator />
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>What to include</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">Three facts, said plainly.</h2>
            <p className="mt-6 text-base leading-8 text-muted">
              Acas says to tell your manager or HR that you are resigning, how much notice you are giving and the date you
              want to be your last day. Everything else is optional. Keep the letter short and polite.
            </p>
          </div>
          <ol className="divide-y divide-line border-y border-line">
            {[
              ["That you are resigning", "Name your job title and the employer, so there is no doubt what you are leaving."],
              ["Your notice period", "The length in your contract, or the legal minimum of 1 week if you have worked there for a month or more."],
              ["Your last day", "Counted from the day after you hand the letter in. Ask your employer to tell you if they work it out differently."],
            ].map(([title, body], index) => (
              <li key={title} className="grid gap-4 py-5 sm:grid-cols-[44px_1fr]">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-paper text-sm font-bold text-navy">{index + 1}</span>
                <div>
                  <h3 className="font-display text-2xl font-semibold text-navy">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-20">
        <div className="container-page max-w-4xl">
          <SectionLabel>Example</SectionLabel>
          <h2 className="font-display text-3xl font-semibold text-navy md:text-4xl">A resignation letter with 4 weeks&apos; notice</h2>
          <p className="mt-4 leading-7 text-muted">
            Fictional example. Alex hands the letter in on Tuesday 1 December 2026. The contract says 4 weeks, so notice
            starts on 2 December and the last day is Tuesday 29 December.
          </p>
          <div className="mt-6 space-y-4 rounded-xl border border-line bg-white p-6 leading-7 text-ink">
            <p>1 December 2026</p>
            <p>Dear Priya Shah,</p>
            <p>Please accept this as formal notice of my resignation from my position as Customer Service Adviser at Northline Energy.</p>
            <p>My notice period is 4 weeks, so I understand my last day of employment will be 29 December 2026. Please let me know if you calculate it differently.</p>
            <p>I will do everything I can to hand over my work smoothly before I leave. Please let me know what you need from me.</p>
            <p>Please could you confirm how much accrued holiday I have left, and what I will be paid in my final salary.</p>
            <p>Thank you for the support and opportunities I have had during my time at Northline Energy.</p>
            <p>Yours sincerely,<br />Alex Morgan</p>
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <SectionLabel>Before you hand it in</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">Check your contract first.</h2>
            <ul className="mt-6 list-disc space-y-3 pl-6 text-base leading-8 text-muted">
              <li>Find the notice period and any rules on how to resign, such as who to send it to.</li>
              <li>Look for restrictive covenants that limit what you can do during or after your notice.</li>
              <li>Ask about holiday you have built up: whether you can take it during your notice, or will be paid for it.</li>
              <li>Ask your employer to confirm in writing that they have received your resignation, and when your P45 will arrive.</li>
            </ul>
          </div>
          <aside className="h-fit rounded-xl border border-gold bg-gold-tint/40 p-6">
            <h3 className="font-display text-2xl font-semibold text-navy">Feel you have no choice but to resign?</h3>
            <p className="mt-3 leading-7 text-ink">
              Do not use a standard letter. If you are resigning because of how your employer has treated you, it can affect
              what notice you give and your rights. Get advice first, for example from the Acas helpline.
            </p>
            <p className="mt-4 text-sm leading-6 text-muted">This page is general information, not legal advice.</p>
          </aside>
        </div>
      </section>

      <section className="border-y border-line bg-[#edf4f8] py-14">
        <div className="container-page grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold text-navy">Moving on? Get your CV ready for the next role.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              Add the job you are leaving while the details are fresh. Build and preview free; pay {site.price} once for the CV
              and a matching cover letter as PDF and Word, with nothing to cancel.
            </p>
          </div>
          <ButtonLink href={commercialRoutes.moneyPage} trackingLabel={analyticsPlacements.resignationMoney}>
            Update my CV
          </ButtonLink>
        </div>
      </section>

      <section className="bg-paper py-16">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <SectionLabel>Sources</SectionLabel>
            <p className="text-base leading-8 text-muted">
              Notice rules and letter content follow Acas and GOV.UK guidance. The last-day calculation uses the same rules as
              WorkCV&apos;s <Link href="/tools/notice-period-calculator" className="font-bold text-navy underline underline-offset-4">notice period calculator</Link>.
            </p>
            {reviewed ? <p className="mt-4 text-sm font-bold text-navy">Reviewed <time dateTime={reviewed}>{displayReviewDate(reviewed)}</time>.</p> : null}
          </div>
          <div className="grid content-start gap-3 text-sm font-bold text-navy">
            {sources.map(([label, href]) => (
              <a key={href} href={href} target="_blank" rel="noreferrer" className="rounded-md border border-line bg-white p-4 hover:border-navy">{label}</a>
            ))}
          </div>
        </div>
      </section>

      <FaqSection faqs={faqs} title="Resignation letter questions." />
      <RelatedLinksSection
        title="Planning your move."
        links={[
          ["Work out your notice and start date", "/tools/notice-period-calculator"],
          ["Track the jobs you apply for", "/tools/job-application-tracker-uk"],
          ["Check your CV against a job advert", "/tools/ats-score-checker"],
          ["Build a UK CV with no subscription", "/cv-builder-no-subscription-uk"],
        ]}
      />
    </>
  );
}
