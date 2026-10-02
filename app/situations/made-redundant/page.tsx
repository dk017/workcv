import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ButtonLink, FaqSection, FinalCta, SectionLabel } from "@/components/marketing";
import { PassOffer } from "@/components/pass-offer";
import { RedundancyChecklist, type ChecklistPhase } from "@/components/redundancy-checklist";
import { analyticsPlacements } from "@/lib/analytics-placements";
import { redundancyRules } from "@/lib/redundancy-pay-calculator";
import { commercialRoutes, site } from "@/lib/site";

const checkedDate = "1 October 2026";
const weeklyCap = redundancyRules.greatBritainWeeklyCap;
// Statutory pay counts at most 20 years at 1.5 weeks each.
const maxStatutoryPay = weeklyCap * 30;
const gbp = (value: number) => `£${value.toLocaleString("en-GB")}`;

export const metadata: Metadata = {
  title: "Made Redundant? What to Do Next (UK Checklist)",
  description:
    `What to do when you're made redundant in the UK: a step-by-step checklist for redundancy pay, notice, tax, benefits and getting back into work, with free calculators.`,
  alternates: { canonical: "/situations/made-redundant" },
  openGraph: {
    title: "Made Redundant? What to Do Next: UK Checklist",
    description:
      "Work through redundancy pay, notice, tax, benefits and your job search in order, from today to day 90.",
    url: "/situations/made-redundant",
  },
};

const phases: ChecklistPhase[] = [
  {
    id: "now",
    when: "Now",
    title: "Get the facts in writing",
    items: [
      { id: "now-documents", text: "Keep your redundancy notice, consultation notes, contract and the employer's pay calculation. Acas says an employer must explain in writing how statutory redundancy pay was worked out." },
      { id: "now-consultation", text: "Check you were consulted about why your role is at risk and the alternatives. If 20 or more people are being made redundant at the same time, collective consultation rules apply." },
      { id: "now-alternative", text: "Ask about suitable alternative jobs. If you accept one, you have the right to a 4-week trial period, and turning down a suitable offer unreasonably can cost your statutory redundancy pay." },
    ],
  },
  {
    id: "this-week",
    when: "This week",
    title: "Check the money",
    items: [
      { id: "week-statutory", text: `Work out statutory redundancy pay. You normally need 2 years' service; weekly pay is capped at ${gbp(weeklyCap)} and the maximum is ${gbp(maxStatutoryPay)} (redundancies from 6 April 2026).`, href: "/tools/redundancy-pay-calculator", linkLabel: "Use the redundancy pay calculator" },
      { id: "week-notice", text: "Check your notice: at least one week if employed 1 month to 2 years, one week per year from 2 to 12 years, and 12 weeks after 12 years. Your contract can give more, never less.", href: "/tools/notice-period-calculator", linkLabel: "Check your notice dates" },
      { id: "week-items", text: "Ask for an itemised breakdown. Redundancy pay, notice pay or pay in lieu of notice, unused holiday, wages and bonuses are separate items." },
      { id: "week-tax", text: "Check the tax. Statutory redundancy pay under £30,000 is not taxable; notice pay, holiday pay and wages are taxed through payroll as normal." },
    ],
  },
  {
    id: "before-last-day",
    when: "Before your last day",
    title: "Use your notice period",
    items: [
      { id: "last-time-off", text: "If you'll have 2 years' continuous service by the end of your notice, you can take reasonable time off to look for work or arrange training. Your employer has to pay up to 40% of one week's pay for it." },
      { id: "last-rapid-response", text: "Contact the Jobcentre Plus Rapid Response Service for help with CVs, job search, training and some costs. You can use it during your notice and up to 13 weeks after.", href: "https://www.gov.uk/redundancy-your-rights/get-help-finding-a-new-job", linkLabel: "GOV.UK: Rapid Response Service", external: true },
      { id: "last-evidence", text: "Write down your projects, systems, results and responsibilities while they are fresh, and ask for a reference." },
    ],
  },
  {
    id: "first-30-days",
    when: "First 30 days",
    title: "Sort out support and deadlines",
    items: [
      { id: "month-jsa", text: "Check New Style Jobseeker's Allowance. It usually needs Class 1 National Insurance contributions from the last 2 to 3 years, and your savings don't affect it.", href: "https://www.gov.uk/jobseekers-allowance/eligibility", linkLabel: "GOV.UK: New Style JSA eligibility", external: true },
      { id: "month-uc", text: "Check Universal Credit. You need £16,000 or less in money, savings and investments. If you already get it, report the job loss and declare any redundancy pay.", href: "https://www.gov.uk/universal-credit/eligibility", linkLabel: "GOV.UK: Universal Credit eligibility", external: true },
      { id: "month-budget", text: "Plan your budget around your final pay and any new salary.", href: "/tools/take-home-pay-calculator-uk", linkLabel: "Use the take-home pay calculator" },
      { id: "month-deadline", text: "If statutory redundancy pay hasn't been paid, act quickly: you have 6 months from the date your job ends to apply for it. Get advice from Acas if anything looks wrong.", href: "https://www.acas.org.uk/redundancy", linkLabel: "Acas: redundancy advice", external: true },
    ],
  },
  {
    id: "days-30-90",
    when: "Days 30 to 90",
    title: "Get back into applications",
    items: [
      { id: "jobs-cv", text: "Update your CV with recent evidence. End the role with its normal month and year; there's no need to explain the redundancy on the CV.", href: "/cv-examples-uk", linkLabel: "See UK CV examples" },
      { id: "jobs-track", text: "Track every application, follow-up and closing date in one place.", href: "/tools/job-application-tracker-uk", linkLabel: "Free job application tracker" },
      { id: "jobs-tailor", text: "Tailor your CV to each advert's main requirements instead of sending one version everywhere.", href: "/tools/job-application-pack-uk", linkLabel: "Tailor a CV to a job advert" },
      { id: "jobs-answer", text: "Prepare one short, neutral answer for interviews, such as \"my role was made redundant following a restructure\", then move on to what you can offer." },
    ],
  },
];

const faqs = [
  {
    question: "What should I do first when I'm made redundant?",
    answer:
      "Get the decision, your notice dates and the redundancy pay calculation in writing, and keep your contract and consultation notes. Then check your redundancy pay, notice pay, holiday pay and tax, and look at what support you may be able to claim.",
  },
  {
    question: "How much redundancy pay will I get?",
    answer: `With 2 or more years' service you normally get half a week's pay for each full year under 22, one week's pay for each year from 22 to 40, and one and a half weeks' pay for each year from 41. Service is capped at 20 years. For redundancies from 6 April 2026, weekly pay is capped at ${gbp(weeklyCap)} and the maximum statutory payment is ${gbp(maxStatutoryPay)}. Your employer may pay more under an enhanced scheme.`,
  },
  {
    question: "Is redundancy pay taxed?",
    answer:
      "Statutory redundancy pay under £30,000 is not taxable. Other parts of a leaving package, such as notice pay, holiday pay, wages and bonuses, are taxed through payroll in the normal way, so check each line of your final payslip.",
  },
  {
    question: "Can I claim Universal Credit or Jobseeker's Allowance after redundancy?",
    answer:
      "Possibly. New Style Jobseeker's Allowance usually depends on Class 1 National Insurance contributions from the last 2 to 3 years and isn't affected by savings. Universal Credit depends on your household, and you need £16,000 or less in money, savings and investments. You may be able to get both at the same time.",
  },
  {
    question: "Can I take time off to look for work during my notice period?",
    answer:
      "Yes, if you'll have 2 years' continuous service by the end of your notice period. You can take a reasonable amount of time off to look for work or arrange training, and your employer has to pay you for up to 40% of one week's pay in total.",
  },
  {
    question: "How long do I have to claim redundancy pay?",
    answer:
      "GOV.UK says you have 6 months from the date your job ends to apply for statutory redundancy pay. If your employer hasn't paid it or you disagree with the amount, contact Acas early.",
  },
  {
    question: "What do I put on my CV after redundancy?",
    answer:
      "List the role with its normal start and end dates and focus on what you achieved. You don't need to explain the redundancy on your CV. If an application asks why you left, a short line such as \"role made redundant following a restructure\" is enough.",
  },
];

const sources: Array<[string, string]> = [
  ["GOV.UK: statutory redundancy pay", "https://www.gov.uk/redundancy-your-rights/redundancy-pay"],
  ["GOV.UK: tax on redundancy pay", "https://www.gov.uk/redundancy-your-rights/tax-and-national-insurance"],
  ["GOV.UK: notice periods", "https://www.gov.uk/redundancy-your-rights/notice-periods"],
  ["GOV.UK: redundancy rights guide", "https://www.gov.uk/redundancy-your-rights/print"],
  ["GOV.UK: finding work and claiming benefits", "https://www.gov.uk/guidance/redundancy-help-finding-work-and-claiming-benefits"],
  ["GOV.UK: Universal Credit eligibility", "https://www.gov.uk/universal-credit/eligibility"],
  ["GOV.UK: New Style JSA eligibility", "https://www.gov.uk/jobseekers-allowance/eligibility"],
  ["Acas: redundancy", "https://www.acas.org.uk/redundancy"],
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Made Redundant? What to Do Next (UK Checklist)",
  datePublished: "2026-06-30",
  dateModified: "2026-10-01",
  author: { "@type": "Organization", name: "WorkCV Editorial Team", url: site.url },
  publisher: { "@type": "Organization", name: site.name, url: site.url },
  mainEntityOfPage: `${site.url}/situations/made-redundant`,
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function MadeRedundantPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="quiet-grid border-b border-line bg-paper py-14 md:py-20">
        <div className="container-page">
          <div className="mb-8 flex flex-wrap items-center gap-2 text-sm font-bold text-muted">
            <Link href="/" className="hover:text-navy">Home</Link>
            <span>/</span>
            <span className="text-navy">Made redundant</span>
          </div>
          <div className="max-w-4xl">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">UK redundancy checklist</p>
            <h1 className="font-display text-4xl font-semibold leading-[1.04] text-navy md:text-6xl">
              Made redundant? What to do next, step by step.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              A checklist from today to day 90: what you&apos;re owed, what to check before your last day, what
              support you can claim and how to get back into applications. Tick items off as you go.
            </p>
            <p className="mt-5 text-sm font-bold text-navy">Facts checked against GOV.UK and Acas · {checkedDate}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#checklist">Start the checklist</ButtonLink>
              <ButtonLink href="/tools/redundancy-pay-calculator" variant="secondary">Calculate redundancy pay</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface" aria-label="Key numbers">
        <div className="container-page grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["2 years", "service needed for statutory redundancy pay"],
            [gbp(weeklyCap), "weekly pay cap from 6 April 2026"],
            [gbp(maxStatutoryPay), "maximum statutory redundancy pay"],
            ["£30,000", "statutory redundancy pay below this isn't taxable"],
            ["6 months", "from your job ending to apply for statutory pay"],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="font-display text-3xl font-semibold text-navy">{value}</p>
              <p className="mt-1 text-sm leading-5 text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="checklist" className="scroll-mt-16 bg-surface py-16 md:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SectionLabel>Your checklist</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">From today to day 90.</h2>
            <p className="mt-6 text-base leading-8 text-muted">
              Your exact rights depend on your contract, length of service and where you work in the UK. Use your
              employer&apos;s documents alongside the official guidance linked here, and get advice quickly if a
              payment or the process looks wrong, because deadlines apply.
            </p>
            <nav aria-label="Checklist stages" className="mt-6 space-y-2 text-sm font-bold">
              {phases.map((phase) => (
                <a key={phase.id} href={`#${phase.id}`} className="flex items-center gap-2 text-navy hover:underline">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" /> {phase.when}: {phase.title}
                </a>
              ))}
            </nav>
            <p className="mt-6 text-xs leading-5 text-muted">Ticks are saved only in this browser.</p>
          </div>
          <RedundancyChecklist phases={phases} />
        </div>
      </section>

      <section className="border-y border-line bg-paper py-20">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <SectionLabel>Check the money</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Don&apos;t treat the final payment as one lump sum.
            </h2>
            <p className="mt-6 text-base leading-8 text-muted">
              Your leaving package can include statutory or enhanced redundancy pay, notice pay or pay in lieu of
              notice, unused holiday, wages and bonuses. Statutory redundancy pay under £30,000 is not taxable, but
              the other items are taxed through payroll. Ask for an itemised calculation and compare statutory pay with
              any enhanced amount in your contract.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/tools/redundancy-pay-calculator">Check statutory pay</ButtonLink>
              <ButtonLink href="/tools/notice-period-calculator" variant="secondary">Check notice dates</ButtonLink>
            </div>
          </div>
          <div>
            <SectionLabel>Your next application</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Redundancy doesn&apos;t need a defensive CV.
            </h2>
            <p className="mt-6 text-base leading-8 text-muted">
              End the role with its normal month and year and use the space for responsibilities and results. If an
              application asks why you left, &ldquo;role made redundant following a restructure&rdquo; is usually
              enough; then return to what you can deliver in the next job.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy">
              <Link href="/cv-employment-gap-uk" className="inline-flex items-center gap-2">Employment gap guidance <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/cv-personal-statement-uk" className="inline-flex items-center gap-2">Personal statement examples <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/tools/ats-score-checker" className="inline-flex items-center gap-2">ATS CV checker <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/tools/job-application-tracker-uk" className="inline-flex items-center gap-2">Track your applications <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-12"><div className="container-page max-w-5xl"><h2 className="font-display text-3xl font-semibold text-navy">A manageable week of applications</h2><p className="mt-5 leading-8">Once you have dealt with the urgent items in the checklist, choose a pace that fits your circumstances. This is an example routine, not a required number of applications.</p><ol className="mt-5 grid gap-4 md:grid-cols-3">{[["Start of the week", "Save suitable vacancies and closing dates in the free tracker. Check essential requirements before choosing the next application."],["Your application session", "Choose two or three real examples from your previous work. Tailor the profile, relevant bullets and matching letter for one advert."],["End of the week", "Record what you sent, review follow-ups and keep a backup of your tracker. Use any employer feedback to improve the next application."]].map(([heading,body])=><li key={heading} className="rounded-lg border border-line bg-white p-5"><h3 className="font-bold">{heading}</h3><p className="mt-3 leading-7">{body}</p></li>)}</ol><div className="mt-6 flex flex-wrap gap-5 font-bold underline"><Link href="/tools/job-application-tracker-uk">Start the free tracker</Link><Link href="/tailor-cv-to-job-description-uk">Follow the worked tailoring guide</Link><Link href="/cv-examples-uk">Choose a relevant CV example</Link></div></div></section>
      <PassOffer audience="redundancy" trackingLabel={analyticsPlacements.passRedundancyGuide} />

      <section className="bg-surface py-20">
        <div className="container-page">
          <SectionLabel>Official help</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sources.map(([label, href]) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-20 items-center justify-between gap-4 rounded-md border border-line bg-white p-5 text-sm font-bold text-navy hover:border-navy"
              >
                {label}
                <ArrowRight className="h-4 w-4 shrink-0" />
              </a>
            ))}
          </div>
          <p className="mt-5 text-sm font-bold text-muted">Guidance checked {checkedDate}. Figures apply in Great Britain; Northern Ireland has its own rates.</p>
        </div>
      </section>

      <FaqSection faqs={faqs} title="Redundancy questions." />
      <FinalCta
        heading="Put the next application back under your control."
        body={`Build and preview your UK CV free. Pay ${site.price} once for the CV and a matching cover letter as PDF and Word, with no subscription.`}
        primaryHref={commercialRoutes.moneyPage}
        primary="Build my next-role CV"
        secondaryHref="/tools/redundancy-pay-calculator"
        secondary="Check redundancy pay"
      />
    </>
  );
}
