import type { Metadata } from "next";
import Link from "next/link";

import { SectionLabel } from "@/components/marketing";

export const metadata: Metadata = {
  title: "WorkCV Job Keyword Highlighter for Chrome",
  description:
    "Highlight CV-relevant skills, qualifications and wording on the UK job page you choose.",
  alternates: { canonical: "/chrome/job-keyword-highlighter" },
};

export default function ChromeExtensionPage() {
  return (
    <>
      <section className="quiet-grid border-b border-line bg-paper py-14 md:py-20">
        <div className="container-page max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
            Free Chrome extension
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-navy md:text-6xl">
            See the language a job advert is asking for.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            Scan the job page you are reading, highlight skills and
            qualifications, and review repeated wording before tailoring your CV.
            Analysis stays in your browser.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="inline-flex min-h-12 items-center rounded-md bg-navy px-5 text-sm font-bold text-white">
              Chrome Web Store listing in preparation
            </span>
            <Link
              href="/chrome/job-keyword-highlighter/privacy"
              className="inline-flex min-h-12 items-center rounded-md border border-line-strong bg-white px-5 text-sm font-bold text-navy hover:border-navy"
            >
              Privacy policy
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>One focused job</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy">
              Scan only when you ask.
            </h2>
            <p className="mt-5 text-base leading-8 text-muted">
              The extension uses active-tab access and packaged local code. It
              does not monitor other tabs, create an account, upload page text or
              keep a history of the jobs you view.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Skills and tools", "Excel, customer service, Power BI, safeguarding, project management and more."],
              ["UK qualifications", "GCSE, NVQ, DBS, NMC, QTS, CIPD, AAT and other common signals."],
              ["Ways of working", "Analytical, organised, collaborative, proactive and related wording."],
              ["Action verbs", "Words that reveal how the employer describes responsibility and outcomes."],
            ].map(([title, body]) => (
              <article key={title} className="rounded-lg border border-line bg-paper p-5">
                <h3 className="font-display text-xl font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-20">
        <div className="container-page max-w-3xl">
          <SectionLabel>Use keywords honestly</SectionLabel>
          <p className="mt-5 text-base leading-8 text-muted">
            A highlighted term is a prompt, not permission to claim experience
            you do not have. Use the advert’s language where it accurately
            describes your real work, qualifications or outcomes.
          </p>
          <Link href="/tools/ats-score-checker" className="mt-6 inline-block font-bold text-navy underline">
            Compare your CV with a job advert
          </Link>
        </div>
      </section>
    </>
  );
}
