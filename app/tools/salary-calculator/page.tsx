import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, Landmark, ShieldCheck, WalletCards } from "lucide-react";

import { FaqSection, SectionLabel } from "@/components/marketing";
import { SalaryCalculator } from "@/components/salary-calculator";
import { site } from "@/lib/site";
import { takeHomePayRules } from "@/lib/uk-take-home-pay";

export const metadata: Metadata = {
  title: "UK Take-Home Pay Calculator 2026/27",
  description:
    "Calculate salary after Income Tax, National Insurance, student loans and salary-sacrifice pension using current UK 2026/27 rates.",
  alternates: { canonical: "/tools/salary-calculator" },
  openGraph: {
    title: "UK Take-Home Pay Calculator 2026/27",
    description:
      "Estimate annual, monthly and weekly take-home pay with current UK and Scottish tax bands.",
    url: "/tools/salary-calculator",
  },
};

const faqItems = [
  {
    question: "How accurate is this UK take-home pay calculator?",
    answer:
      "It is an annual estimate using published 2026/27 Income Tax, employee National Insurance and student-loan thresholds. Your payslip can differ because PAYE works by pay period and depends on your tax code, previous earnings, benefits, NI category and payroll rounding.",
  },
  {
    question: "Does the calculator support Scottish Income Tax?",
    answer:
      "Yes. Choose Scotland to apply the 2026/27 starter, basic, intermediate, higher, advanced and top rates to earned income. National Insurance and student-loan rules remain UK-wide.",
  },
  {
    question: "How is pension included?",
    answer:
      "The pension field models salary sacrifice, where contractual gross pay is exchanged before Income Tax and National Insurance. Net-pay and relief-at-source pension arrangements work differently and should not be entered as salary sacrifice.",
  },
  {
    question: "Can I have a student loan and Postgraduate Loan together?",
    answer:
      "Yes. Select Plan 1, 2, 4 or 5 and separately tick Postgraduate Loan. The estimate applies 9% above the selected undergraduate-plan threshold and 6% above the postgraduate threshold.",
  },
  {
    question: "Does a bonus affect student-loan deductions?",
    answer:
      "Yes. GOV.UK says repayment income includes bonuses and overtime before tax and other deductions. A large one-off payment can trigger a deduction in that pay period even if annual income later finishes below the annual threshold.",
  },
];

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "WorkCV UK Take-Home Pay Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  url: `${site.url}/tools/salary-calculator`,
  description:
    "A browser-based UK salary after tax estimator using 2026/27 Income Tax, National Insurance and student-loan thresholds.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function SalaryCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="quiet-grid border-b border-line bg-paper py-14 md:py-20">
        <div className="container-page">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              Free UK salary after tax tool
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.06] text-navy md:text-6xl">
              UK take-home pay calculator for 2026/27.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              See what reaches your bank account after Income Tax, employee
              National Insurance, student loans and salary-sacrifice pension.
              Switch between annual, monthly and weekly results.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy">
              <span className="flex items-center gap-2">
                <Landmark className="h-5 w-5 text-success" />
                Current {takeHomePayRules.taxYear} rates
              </span>
              <span className="flex items-center gap-2">
                <WalletCards className="h-5 w-5 text-gold" />
                Scotland included
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#63788c]" />
                Private browser calculation
              </span>
            </div>
          </div>

          <div className="mt-10 rounded-lg border border-line-strong bg-surface p-5 shadow-soft md:p-7">
            <SalaryCalculator />
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>Read your result</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Salary after tax is more than one percentage.
            </h2>
            <p className="mt-6 text-base leading-8 text-muted">
              The calculator starts with salary and bonus, then applies the
              deductions that commonly change an employee&apos;s banked pay. It
              models the standard Personal Allowance of £12,570 and its taper
              above £100,000 adjusted income. Blind Person&apos;s Allowance can be
              added where eligible.
            </p>
            <p className="mt-4 text-base leading-8 text-muted">
              Employee National Insurance is estimated at 8% between £12,570
              and £50,270, then 2% above that level. The Scotland option changes
              earned-income tax bands but not NI. Student-loan deductions use
              the current threshold for the selected plan, with Postgraduate
              Loan available as a separate simultaneous deduction.
            </p>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {[
              [
                "Use annual expected income",
                "Include taxable bonus and overtime expected between 6 April 2026 and 5 April 2027, not a monthly figure.",
              ],
              [
                "Check the pension method",
                "Only enter pension exchanged through salary sacrifice. A payslip or benefits portal should state whether salary sacrifice applies.",
              ],
              [
                "Treat the answer as an estimate",
                "Tax codes, benefits, multiple jobs, irregular payroll and prior pay can change the amount deducted in an individual month.",
              ],
            ].map(([title, body], index) => (
              <article key={title} className="grid gap-4 py-6 sm:grid-cols-[44px_1fr]">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-paper text-sm font-bold text-navy">
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
            <SectionLabel>Official 2026/27 sources</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Current thresholds, with assumptions visible.
            </h2>
            <p className="mt-6 text-base leading-8 text-muted">
              HMRC publishes the PAYE bands, employee NI thresholds and student
              loan levels used by employers. GOV.UK separately publishes the
              Scottish earned-income bands and confirms the £3,250 Blind
              Person&apos;s Allowance.
            </p>
            <p className="mt-4 text-sm leading-7 text-muted">
              This is not payroll software and does not calculate employer NI,
              benefits in kind, tax-code adjustments, dividends, savings,
              Marriage Allowance, multiple employments or self-employed tax.
            </p>
            <p className="mt-4 text-sm font-bold text-navy">
              Rules reviewed 30 June 2026.
            </p>
          </div>
          <div className="grid content-start gap-3 text-sm font-bold text-navy">
            {[
              ["HMRC: 2026/27 PAYE and NI thresholds", "https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027"],
              ["GOV.UK: current Income Tax rates", "https://www.gov.uk/income-tax-rates"],
              ["GOV.UK: Scottish Income Tax", "https://www.gov.uk/scottish-income-tax"],
              ["GOV.UK: student-loan thresholds", "https://www.gov.uk/repaying-your-student-loan/when-you-start-repaying"],
              ["GOV.UK: Blind Person's Allowance", "https://www.gov.uk/blind-persons-allowance/what-youll-get"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-line bg-white p-4 hover:border-navy"
              >
                {label}
              </a>
            ))}
            <Link
              href="/tools/uk-salary-by-job-title"
              className="rounded-md border border-line bg-white p-4 hover:border-navy"
            >
              Compare gross salary by job title
            </Link>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqItems} title="UK take-home pay questions." />
    </>
  );
}
