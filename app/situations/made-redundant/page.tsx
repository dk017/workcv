import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Briefcase,
  CalendarCheck,
  Check,
  FileText,
  Scale,
} from "lucide-react";

import { ButtonLink, FinalCta, SectionLabel } from "@/components/marketing";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Made Redundant UK: What to Do Next",
  description:
    "A practical UK checklist after redundancy: check pay and notice, keep evidence, review benefit support, update your CV and start applying.",
  alternates: { canonical: "/situations/made-redundant" },
  openGraph: {
    title: "Made Redundant? A Practical UK Next-Steps Guide",
    description:
      "Work through redundancy pay, final pay, benefits and your return to job applications in a clear order.",
    url: "/situations/made-redundant",
  },
};

const steps = [
  {
    title: "Get the decision and calculation in writing",
    body:
      "Keep the redundancy notice, consultation records, selection information, employment contract and the employer's pay calculation. Acas says an employer must explain in writing how statutory redundancy pay was worked out.",
    icon: FileText,
  },
  {
    title: "Separate redundancy pay from final pay",
    body:
      "Your leaving package can contain different items: statutory or enhanced redundancy pay, wages, notice pay, holiday pay, bonuses and expenses. They do not all receive the same tax treatment. Check each line rather than judging only the total.",
    icon: Banknote,
  },
  {
    title: "Check the dates and notice period",
    body:
      "Confirm when employment legally ends, whether you work notice, receive garden leave or receive payment in lieu. Statutory notice can sometimes change the service date used for redundancy calculations.",
    icon: CalendarCheck,
  },
  {
    title: "Review support before cash runs down",
    body:
      "GOV.UK says New Style Jobseeker's Allowance can depend on National Insurance contributions, while Universal Credit depends on household circumstances and capital. Check eligibility early instead of assuming redundancy pay rules out support.",
    icon: Scale,
  },
  {
    title: "Turn the role into current CV evidence",
    body:
      "Capture projects, systems, customers, responsibilities and measurable outcomes while details are fresh. Redundancy is a business decision, not a performance gap; your CV can state the end date without defending it.",
    icon: Briefcase,
  },
] as const;

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Made Redundant UK: What to Do Next",
  datePublished: "2026-06-30",
  dateModified: "2026-06-30",
  author: { "@type": "Organization", name: site.name, url: site.url },
  publisher: { "@type": "Organization", name: site.name, url: site.url },
  mainEntityOfPage: `${site.url}/situations/made-redundant`,
};

export default function MadeRedundantPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <section className="quiet-grid border-b border-line bg-paper py-16 md:py-24">
        <div className="container-page">
          <div className="mb-8 flex flex-wrap items-center gap-2 text-sm font-bold text-muted">
            <Link href="/" className="hover:text-navy">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-navy">Tools</Link>
            <span>/</span>
            <span className="text-navy">Made redundant</span>
          </div>
          <div className="max-w-4xl">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              UK redundancy next steps
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              Made redundant? Work through the facts first.
            </h1>
            <p className="mt-7 max-w-3xl text-xl leading-8 text-muted">
              Separate what you are owed, what support may be available and
              what your next application needs. This checklist gives each task
              a clear place instead of treating redundancy as one large problem.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/tools/redundancy-pay-calculator">
                Calculate redundancy pay
              </ButtonLink>
              <ButtonLink href="/editor?new=1" variant="secondary">
                Update my CV
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface">
        <div className="container-page grid gap-4 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Save written evidence",
            "Check every payment",
            "Review support early",
            "Start the CV while details are fresh",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm font-bold text-navy">
              <Check className="h-5 w-5 shrink-0 text-success" />
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <SectionLabel>First-week checklist</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Five tasks that produce concrete answers.
            </h2>
            <p className="mt-6 text-base leading-8 text-muted">
              The exact rights depend on employment status, service, contract,
              consultation and jurisdiction. Use the documents from your
              employer alongside official guidance, and seek advice promptly if
              the process or payment appears wrong because claim deadlines apply.
            </p>
          </div>
          <ol className="divide-y divide-line border-y border-line">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="grid gap-4 py-6 sm:grid-cols-[48px_1fr]">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-navy text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-success">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-semibold text-navy">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted">{step.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-20">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <SectionLabel>Check the money</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Do not treat the final payment as one tax-free lump sum.
            </h2>
            <p className="mt-6 text-base leading-8 text-muted">
              Up to £30,000 of qualifying redundancy and eligible termination
              payments can usually fall within the Income Tax exemption.
              Payment in lieu of notice, holiday pay, wages and some benefits
              are handled separately through payroll. Ask for an itemised
              calculation and compare statutory redundancy against any enhanced
              contractual amount.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/tools/redundancy-pay-calculator">
                Check statutory pay
              </ButtonLink>
              <ButtonLink href="/tools/notice-period-calculator" variant="secondary">
                Check notice dates
              </ButtonLink>
            </div>
          </div>
          <div>
            <SectionLabel>Rebuild the application</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Redundancy does not need a defensive CV explanation.
            </h2>
            <p className="mt-6 text-base leading-8 text-muted">
              End the role with its normal month and year. Use the space for
              responsibilities and evidence rather than a long explanation of
              the employer&apos;s decision. If an application asks why you left,
              “role made redundant following restructuring” is usually enough;
              then return to what you can deliver in the next role.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy">
              <Link href="/cv-employment-gap-uk" className="inline-flex items-center gap-2">
                Employment gap guidance <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/tools/ats-score-checker" className="inline-flex items-center gap-2">
                Target the next vacancy <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page">
          <SectionLabel>Official help</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["GOV.UK redundancy rights", "https://www.gov.uk/redundancy-your-rights"],
              ["Acas redundancy guidance", "https://www.acas.org.uk/redundancy"],
              ["GOV.UK benefits and work support", "https://www.gov.uk/guidance/redundancy-help-finding-work-and-claiming-benefits"],
              ["Acas final pay and holiday", "https://www.acas.org.uk/final-pay-when-someone-leaves-a-job"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-24 items-center justify-between gap-4 rounded-md border border-line bg-white p-5 text-sm font-bold text-navy hover:border-navy"
              >
                {label}
                <ArrowRight className="h-4 w-4 shrink-0" />
              </a>
            ))}
          </div>
          <p className="mt-5 text-sm font-bold text-muted">
            Guidance reviewed 30 June 2026.
          </p>
        </div>
      </section>

      <FinalCta
        heading="Put the next application back under your control."
        body={`Build and preview your UK CV free. Pay ${site.price} once only when this saved CV is ready to download.`}
        secondaryHref="/tools/redundancy-pay-calculator"
        secondary="Check redundancy pay"
      />
    </>
  );
}
