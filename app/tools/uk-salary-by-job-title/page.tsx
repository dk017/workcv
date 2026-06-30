import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, Database, Search, ShieldCheck } from "lucide-react";

import { UkSalaryChecker } from "@/components/uk-salary-checker";
import { FaqSection, SectionLabel } from "@/components/marketing";
import { onsSalarySource, salaryRoles } from "@/lib/uk-salary-data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "UK Salary by Job Title - ONS 2025 Pay Checker",
  description:
    "Search 60 common UK job titles and compare lower-quartile, median and upper-quartile annual pay from ONS ASHE 2025 data.",
  alternates: { canonical: "/tools/uk-salary-by-job-title" },
  openGraph: {
    title: "UK Salary by Job Title",
    description:
      "Search common UK roles and see transparent 25th percentile, median and 75th percentile annual salary benchmarks.",
    url: "/tools/uk-salary-by-job-title",
  },
};

const faqItems = [
  {
    question: "Where does the salary data come from?",
    answer:
      "For 59 occupations, WorkCV uses the Office for National Statistics Annual Survey of Hours and Earnings 2025 provisional Table 14.7a. Values are annual gross pay for UK full-time employee jobs. The graduate result uses separately labelled HESA, Institute of Student Employers and High Fliers benchmarks because graduate is not an occupation.",
  },
  {
    question: "What do lower quartile, median and upper quartile mean?",
    answer:
      "The lower quartile is the 25th percentile: 25% of jobs earned at or below it. The median is the middle value. The upper quartile is the 75th percentile: 25% earned above it. Together, the lower and upper quartiles describe the middle 50% rather than an absolute minimum and maximum.",
  },
  {
    question: "Are these current advertised salaries?",
    answer:
      "No. The ONS values describe actual annual gross pay in April 2025 and were published provisionally in October 2025. Advertised salaries can move faster and may target a particular experience level, location or specialism.",
  },
  {
    question: "Why might my salary be outside the displayed range?",
    answer:
      "Region, experience, qualifications, responsibilities, hours, sector, employer size, commission and specialism can all affect pay. A quarter of jobs in the ONS distribution earned below the lower quartile and a quarter earned above the upper quartile.",
  },
  {
    question: "Why does the ONS occupation differ from my job title?",
    answer:
      "Employers use many titles for similar work. ONS groups jobs by duties under SOC 2020. WorkCV shows the mapped ONS occupation and code so you can decide whether it is genuinely close to the role you mean.",
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
  name: "WorkCV UK Salary by Job Title",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: `${site.url}/tools/uk-salary-by-job-title`,
  description:
    "A searchable UK salary benchmark using ONS ASHE occupation-level earnings data.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
};

export default function UkSalaryByJobTitlePage() {
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
              Free UK salary tool
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.06] text-navy md:text-6xl">
              What does this job actually pay in the UK?
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              Search {salaryRoles.length} common roles to see the middle 50% and
              median annual pay, mapped to the latest published ONS occupation
              data.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy">
              <span className="flex items-center gap-2">
                <Database className="h-5 w-5 text-success" />
                ONS ASHE 2025
              </span>
              <span className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-gold" />
                25th, 50th and 75th percentiles
              </span>
              <span className="flex items-center gap-2">
                <Search className="h-5 w-5 text-[#63788c]" />
                Titles and aliases
              </span>
            </div>
          </div>

          <div className="mt-10 rounded-lg border border-line-strong bg-surface p-5 shadow-soft md:p-7">
            <UkSalaryChecker />
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <SectionLabel>Use the benchmark</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Compare the job, not just the title.
            </h2>
            <p className="mt-6 text-base leading-8 text-muted">
              A title can cover very different duties and levels. Start with the
              mapped occupation, then compare the vacancy&apos;s responsibilities,
              required experience, location and pay package.
            </p>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {[
              [
                "Check the occupation",
                "Read the displayed ONS occupation and SOC code. Search another title if the duties do not match the vacancy.",
              ],
              [
                "Position the level",
                "Lower-quartile pay can be a useful early-career reference; upper-quartile pay may reflect stronger experience or responsibility, but neither is a guaranteed level.",
              ],
              [
                "Adjust for context",
                "Compare local adverts and public-sector pay scales where relevant. London, scarce skills, shifts, commission and specialist credentials can materially change pay.",
              ],
            ].map(([title, body], index) => (
              <article key={title} className="grid gap-4 py-6 sm:grid-cols-[44px_1fr]">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper text-sm font-bold text-navy">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-semibold text-navy">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionLabel>Evidence checked</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Actual employee pay, with the limits visible.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-muted">
              ONS ASHE uses employer payroll responses from a 1% sample selected
              through PAYE records. The achieved 2025 sample was 174,000. ONS
              identifies the median as its preferred typical-pay measure because
              it is less affected by a small number of very high earners.
            </p>
            <p className="mt-4 text-sm leading-7 text-muted">
              These provisional annual figures refer to April 2025, full-time
              employee jobs and employees in the job for at least one year. They
              are not live vacancies, contractor rates or take-home pay.
            </p>
            <p className="mt-4 text-sm font-bold text-navy">
              Dataset reviewed 28 June 2026.
            </p>
          </div>
          <div className="grid content-start gap-3 text-sm font-bold text-navy">
            <a
              href={onsSalarySource.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-line bg-white p-4 hover:border-navy"
            >
              ONS ASHE Table 14: four-digit occupations
            </a>
            <a
              href="https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/bulletins/annualsurveyofhoursandearnings/latest"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-line bg-white p-4 hover:border-navy"
            >
              ONS Employee earnings in the UK: 2025
            </a>
            <a
              href="https://www.ons.gov.uk/methodology/classificationsandstandards/standardoccupationalclassificationsoc/soc2020"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-line bg-white p-4 hover:border-navy"
            >
              ONS Standard Occupational Classification 2020
            </a>
            <a
              href="https://sheffield.ac.uk/careers/employers/support/setting-appropriate-graduate-salary"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-line bg-white p-4 hover:border-navy"
            >
              University of Sheffield: graduate salary context
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-[#edf4f8] py-14">
        <div className="container-page grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold text-navy">
              Found the gross salary? Calculate what reaches your bank.
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Use current 2026/27 Income Tax, National Insurance, pension and
              student-loan thresholds.
            </p>
          </div>
          <Link
            href="/tools/salary-calculator"
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover"
          >
            Calculate take-home pay
          </Link>
        </div>
      </section>

      <FaqSection faqs={faqItems} title="UK salary benchmark questions." />
    </>
  );
}
