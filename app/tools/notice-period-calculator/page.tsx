import type { Metadata } from "next";
import { CalendarCheck, FileSearch, Scale, ShieldCheck } from "lucide-react";

import { FaqSection, SectionLabel } from "@/components/marketing";
import { NoticePeriodCalculator } from "@/components/notice-period-calculator";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "UK Notice Period Calculator - Earliest Start Date",
  description:
    "Calculate your contractual end date, earliest new-job start date, latest resignation date and UK statutory notice from your job start date.",
  alternates: { canonical: "/tools/notice-period-calculator" },
  openGraph: {
    title: "UK Notice Period Calculator",
    description:
      "Check whether a target start date works and see the notice date, contract end date and statutory UK minimums.",
    url: "/tools/notice-period-calculator",
  },
};

const faqItems = [
  {
    question: "How much notice must I give when resigning in the UK?",
    answer:
      "An employee who has worked for at least one month normally must give at least one week’s notice. A contract, written statement or staff policy can require more. If you have worked for less than one month and no written term applies, Acas says there is no statutory minimum.",
  },
  {
    question: "When does a notice period start?",
    answer:
      "Unless the employment contract says otherwise, GOV.UK and Acas say it usually starts the day after notice is received. A one-week notice handed in on Monday therefore runs out the following Monday.",
  },
  {
    question: "Does one month mean four weeks?",
    answer:
      "No. This calculator treats a month as a calendar month, not 28 days. Official DWP guidance gives an example where notice on 14 June expires on 14 July and applies a special month-end rule: notice on 29 February expires on 31 March.",
  },
  {
    question: "Do weekends and bank holidays count? ",
    answer:
      "Notice stated in calendar days, weeks or months continues across weekends and bank holidays. If the contractual end date falls on a day you do not normally work, your final day physically worked may be earlier. Check contracts that use a specific working-day rule.",
  },
  {
    question: "Is statutory notice one week per year?",
    answer:
      "That rule applies to notice an employer gives an employee for dismissal or redundancy: one week after one month, then one week per complete year from two years, capped at 12 weeks. The employee’s statutory minimum when resigning stays at one week after one month, although a contract may require more.",
  },
  {
    question: "Can I leave before my calculated end date?",
    answer:
      "You can ask your employer to agree an earlier release and should get that agreement in writing. Acas warns that leaving early without agreement may breach the contract. Garden leave or payment in lieu of notice can also affect when you stop working or when employment ends.",
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
  name: "WorkCV UK Notice Period Calculator",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: `${site.url}/tools/notice-period-calculator`,
  description:
    "A browser-based UK resignation notice calculator for contract end dates, earliest start dates and statutory notice.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
};

export default function NoticePeriodCalculatorPage() {
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
              Free UK employment tool
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.06] text-navy md:text-6xl">
              Know exactly when you can start your next job.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              Check whether your target date allows enough notice. Get your
              minimum employment end date, earliest new start and the latest day
              to hand in notice.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy">
              <span className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-success" />
                Concrete dates
              </span>
              <span className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-gold" />
                Statutory rules separated
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#63788c]" />
                Private browser calculation
              </span>
            </div>
          </div>

          <div className="mt-10 rounded-lg border border-line-strong bg-surface p-5 shadow-soft md:p-7">
            <NoticePeriodCalculator />
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page">
          <SectionLabel>Three dates, three meanings</SectionLabel>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
                Contract end is not always the last day at your desk.
              </h2>
              <p className="mt-6 text-base leading-8 text-muted">
                A reliable answer separates the legal employment end date from
                the final day physically worked and the first date another job
                can begin.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                {
                  icon: FileSearch,
                  title: "Notice received",
                  body: "The contract may require writing. The default calculation assumes receipt today.",
                },
                {
                  icon: CalendarCheck,
                  title: "Employment ends",
                  body: "The calendar notice period expires on this date unless a different arrangement is agreed.",
                },
                {
                  icon: Scale,
                  title: "New role starts",
                  body: "Normally the following day, subject to garden leave, restrictive terms or another agreement.",
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
              Built from current official guidance.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-muted">
              GOV.UK and Acas confirm that resignation notice usually starts the
              day after it is received and that employees normally owe at least
              one week after one month’s service. GOV.UK separately sets the
              employer minimum at one week per complete year from two years,
              capped at 12 weeks.
            </p>
            <p className="mt-4 text-sm leading-7 text-muted">
              The DWP Decision Makers’ Guide supplies the date-counting examples
              used here, including Monday-to-Monday for one week and the special
              end-of-month treatment for calendar months. Contract wording and
              individual circumstances still take priority.
            </p>
            <p className="mt-4 text-sm font-bold text-navy">
              Research reviewed 28 June 2026.
            </p>
          </div>
          <div className="grid content-start gap-3 text-sm font-bold text-navy">
            <a
              href="https://www.gov.uk/handing-in-your-notice/giving-notice"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-line bg-white p-4 hover:border-navy"
            >
              GOV.UK: giving notice when resigning
            </a>
            <a
              href="https://www.acas.org.uk/notice-periods/when-the-notice-period-starts"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-line bg-white p-4 hover:border-navy"
            >
              Acas: when a notice period starts
            </a>
            <a
              href="https://www.gov.uk/redundancy-your-rights/notice-periods"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-line bg-white p-4 hover:border-navy"
            >
              GOV.UK: employer statutory notice
            </a>
            <a
              href="https://assets.publishing.service.gov.uk/media/67f8f87d04146682e61bc86a/dmg_chapter_26.pdf"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-line bg-white p-4 hover:border-navy"
            >
              DWP: official notice-expiry examples
            </a>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqItems} title="UK notice period questions." />
    </>
  );
}

