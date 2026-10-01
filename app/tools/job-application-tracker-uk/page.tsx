import type { Metadata } from "next";
import Link from "next/link";
import { BellRing, ClipboardList, Download, FileSpreadsheet, ShieldCheck, Wand2 } from "lucide-react";

import { JobApplicationTracker } from "@/components/job-application-tracker";
import { FaqSection, RelatedLinksSection, SectionLabel } from "@/components/marketing";
import { PassOffer } from "@/components/pass-offer";
import { TrackedLink } from "@/components/tracked-link";
import { analyticsPlacements } from "@/lib/analytics-placements";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Job Application Tracker UK – No Signup",
  description:
    "Track every job you apply for: status, follow-ups and closing dates. Free, no signup, saved in your browser. Export to Excel and tailor your CV for each role.",
  alternates: { canonical: "/tools/job-application-tracker-uk" },
  openGraph: {
    title: "Free Job Application Tracker for UK Job Seekers",
    description:
      "Keep every application, follow-up and closing date in one place. No signup, export to Excel, and a free spreadsheet template.",
    url: "/tools/job-application-tracker-uk",
  },
};

const templateHref = "/downloads/job-application-tracker-uk.xlsx";

const faqItems = [
  {
    question: "Is the job application tracker free?",
    answer:
      "Yes. The online tracker and the Excel template are free, with no signup, email or payment. WorkCV only charges if you later choose to download a CV built in the editor.",
  },
  {
    question: "Where are my job applications stored?",
    answer:
      "Only in the browser you use, on your own device. WorkCV does not receive the jobs you track. Clearing your browser data deletes them, so export a CSV now and then as a backup. Details are shared only if you choose “Tailor my CV for this job”, which passes that one job’s title, employer and advert to the tool you open.",
  },
  {
    question: "Can I use the tracker in Excel or Google Sheets?",
    answer:
      "Yes. Export a CSV from the online tracker and open it in Excel or Google Sheets, or download the free Excel template, which has the same columns and status drop-downs. Saving the template as CSV lets you import it back into the online tracker.",
  },
  {
    question: "What should I track for each job application?",
    answer:
      "At minimum: job title, employer, the date you applied, the closing date, its status and your next action with a date. Adding where you found the job, a contact name and the advert text makes follow-ups and tailoring much easier.",
  },
  {
    question: "Can I keep a record of my job search for Universal Credit?",
    answer:
      "GOV.UK says you can use your Universal Credit online journal to tell DWP what you are doing to find work, such as job applications, job interviews and training. The tracker’s printable log keeps those details in one place to refer to, but it is not an official DWP form. Follow what your work coach asks for.",
  },
  {
    question: "How many jobs should I apply for each week?",
    answer:
      "There is no single right number. A few well-tailored applications usually beat many identical ones. Use the tracker’s weekly count to set a realistic target, and spend the time saved on tailoring your CV and cover letter to each advert.",
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
  name: "WorkCV Job Application Tracker",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: `${site.url}/tools/job-application-tracker-uk`,
  description:
    "A free, browser-based job application tracker for UK job seekers with follow-up reminders, closing dates, CSV export and an Excel template.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
};

const columns = [
  ["Job title and employer", "The basics. Add the location if you are applying across several areas."],
  ["Status", "Saved, Applied, Interview, Offer, Unsuccessful or Withdrawn, so you can see where each application stands."],
  ["Date applied and closing date", "Closing dates stop you missing good roles; application dates tell you when to follow up."],
  ["Next action and date", "The single most useful column: chase a recruiter, prepare for an interview, or send a thank-you email."],
  ["Where you found it", "Indeed, Reed, NHS Jobs, an agency or a referral. Over time this shows which sources lead to interviews."],
  ["Job advert text", "Adverts are often taken down after the closing date. Keeping the text lets you tailor your CV and prepare for interview."],
];

export default function JobApplicationTrackerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />

      <section className="quiet-grid border-b border-line bg-paper py-12 md:py-16">
        <div className="container-page">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-navy">Free UK job search tool</p>
            <h1 className="font-display text-4xl font-semibold leading-[1.06] text-navy md:text-6xl">
              Free job application tracker for UK job seekers.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
              Keep every application, follow-up and closing date in one place, then tailor your CV for the jobs that
              matter.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy">
              <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-success" />No signup</span>
              <span className="flex items-center gap-2"><ClipboardList className="h-5 w-5 text-gold" />Saved only on this device</span>
              <span className="flex items-center gap-2"><FileSpreadsheet className="h-5 w-5 text-[#63788c]" />Export to Excel any time</span>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-line-strong bg-surface p-5 shadow-soft md:p-7">
            <JobApplicationTracker />
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page">
          <SectionLabel>What to track</SectionLabel>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
                Six details that make a job search manageable.
              </h2>
              <p className="mt-6 text-base leading-8 text-muted">
                When you apply for several jobs a week, it is easy to forget which version of your CV went where, or
                to miss the moment to follow up. These columns cover what you need without turning the tracker into a
                second job.
              </p>
            </div>
            <dl className="grid gap-4 sm:grid-cols-2">
              {columns.map(([title, body]) => (
                <div key={title} className="rounded-lg border border-line bg-paper p-5">
                  <dt className="font-bold text-navy">{title}</dt>
                  <dd className="mt-2 text-sm leading-6 text-muted">{body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-20">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <SectionLabel>A simple weekly routine</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">Ten minutes each week keeps it working.</h2>
            <ol className="mt-8 space-y-5">
              {[
                ["Clear follow-ups", "Start with anything marked overdue or due today. A short, polite email to the recruiter is usually enough."],
                ["Check closing dates", "Saved jobs closing in the next three days are flagged. Apply or remove them."],
                ["Tailor before you apply", "Match your CV and cover letter to the advert’s main requirements instead of sending the same version everywhere."],
                ["Close what’s finished", "Mark rejections as Unsuccessful. It keeps your active list honest and shows which sources are working."],
              ].map(([title, body], index) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-navy font-bold text-white">{index + 1}</span>
                  <div>
                    <h3 className="font-bold text-navy">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="space-y-5">
            <article className="rounded-lg border border-line bg-white p-6">
              <Wand2 className="h-6 w-6 text-gold" />
              <h3 className="mt-4 font-display text-2xl font-semibold text-navy">Tailor your CV for each job</h3>
              <p className="mt-3 text-sm leading-7 text-muted">
                The National Careers Service advises tailoring your CV to the job you are applying for. Use “Tailor my
                CV for this job” on any tracked job: it opens the free Job Application Pack with the role, employer and
                advert already filled in, and suggests CV points and a cover-letter draft from your real experience.
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
                <Link href="/tools/job-application-pack-uk" className="text-navy underline underline-offset-4">Job Application Pack</Link>
                <Link href="/tools/ats-score-checker" className="text-navy underline underline-offset-4">CV match checker</Link>
              </div>
            </article>
            <article className="rounded-lg border border-line bg-white p-6">
              <Download className="h-6 w-6 text-gold" />
              <h3 className="mt-4 font-display text-2xl font-semibold text-navy">Prefer a spreadsheet?</h3>
              <p className="mt-3 text-sm leading-7 text-muted">
                Download the free Excel template, which also works in Google Sheets. It has the same columns, status
                and source drop-downs, and highlights overdue follow-ups.
              </p>
              <TrackedLink
                href={templateHref}
                download
                placement={analyticsPlacements.trackerTemplateDownload}
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:border-navy"
              >
                <FileSpreadsheet className="h-4 w-4" /> Download the Excel template
              </TrackedLink>
            </article>
            <article className="rounded-lg border border-line bg-white p-6">
              <BellRing className="h-6 w-6 text-gold" />
              <h3 className="mt-4 font-display text-2xl font-semibold text-navy">Keeping a record for Universal Credit</h3>
              <p className="mt-3 text-sm leading-7 text-muted">
                GOV.UK says you can use your Universal Credit online journal to tell DWP what you are doing to find
                work, such as job applications, job interviews and training. Use “Print log” to keep your applications
                in one place to refer to; it is not an official DWP form.
              </p>
              <a
                href="https://www.gov.uk/guidance/manage-your-universal-credit-claim-after-you-apply"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-bold text-navy underline underline-offset-4"
              >
                GOV.UK: using your Universal Credit journal
              </a>
            </article>
          </div>
        </div>
      </section>

      <PassOffer audience="tailoring" trackingLabel={analyticsPlacements.trackerEditor} />

      <RelatedLinksSection
        title="More help with your job search."
        links={[
          ["Tailor a CV to a job advert", "/tools/job-application-pack-uk"],
          ["Check your CV against an advert", "/tools/ats-score-checker"],
          ["Cover letter examples", "/cover-letter-examples-uk"],
          ["What to do after redundancy", "/situations/made-redundant"],
        ]}
      />
      <FaqSection faqs={faqItems} title="Job application tracker questions." />
    </>
  );
}
