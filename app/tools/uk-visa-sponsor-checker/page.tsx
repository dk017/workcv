import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Building2, PoundSterling, RefreshCw } from "lucide-react";

import { FaqSection, SectionLabel } from "@/components/marketing";
import { PassOffer } from "@/components/pass-offer";
import { SponsorChecker } from "@/components/sponsor-check";
import { analyticsPlacements } from "@/lib/analytics-placements";
import { site } from "@/lib/site";

const path = "/tools/uk-visa-sponsor-checker";

export const metadata: Metadata = {
  title: "UK Visa Sponsor Checker - Is an Employer Licensed?",
  description: "Check whether a UK employer holds a licence to sponsor Skilled Worker and other work visas. Searches the Home Office register of licensed sponsors, refreshed daily.",
  alternates: { canonical: path },
  openGraph: {
    title: "UK Visa Sponsor Checker - WorkCV",
    description: "Search the Home Office register of licensed sponsors by employer name.",
    url: path,
  },
};

const faqs = [
  {
    question: "How do I know if a UK company can sponsor my visa?",
    answer: "Only employers on the Home Office register of licensed sponsors can sponsor a Skilled Worker or other work visa. Search the employer's name here or on GOV.UK. The job itself must also be eligible and meet the salary rules.",
  },
  {
    question: "Does being on the register mean the job will be sponsored?",
    answer: "No. A licence shows the employer is allowed to sponsor workers. Whether it sponsors a particular role is the employer's decision, and the role must be an eligible occupation paid at least the required salary. Check the advert or ask the employer.",
  },
  {
    question: "Why can't I find a company I know sponsors visas?",
    answer: "The register lists legal names, such as 'Google (UK) Limited', which can differ from the brand in a job advert. Try the legal name, often shown in a website's footer. Recruitment agencies may also advertise jobs for a different, licensed employer.",
  },
  {
    question: "What do A rating and B rating mean?",
    answer: "Most sponsors hold an A rating. A B rating means the Home Office has downgraded the licence because the employer did not meet its sponsor duties, and it must follow an action plan. GOV.UK says a B-rated sponsor cannot issue new certificates of sponsorship until it is upgraded, except to extend the stay of workers it already employs.",
  },
  {
    question: "How up to date is this checker?",
    answer: "WorkCV reads the register published on GOV.UK, which the Home Office updates most working days, and checks for a new file every 12 hours. Each result shows the date of the register it used.",
  },
  {
    question: "Is this immigration advice?",
    answer: "No. This tool searches public information. Whether you can be sponsored depends on your own circumstances; for advice, use an adviser regulated by the Immigration Advice Authority or a solicitor.",
  },
];

const schemas = [
  { "@context": "https://schema.org", "@type": "WebApplication", name: "WorkCV UK Visa Sponsor Checker", applicationCategory: "BusinessApplication", operatingSystem: "Any", url: `${site.url}${path}`, offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" } },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
];

const checks = [
  { icon: Building2, title: "1. Is the employer licensed?", body: "This checker answers this one. Only licensed sponsors can sponsor a work visa." },
  { icon: BadgeCheck, title: "2. Can the job be sponsored?", body: "The role must be an eligible occupation, usually a higher-skilled, degree-level job." },
  { icon: PoundSterling, title: "3. Does the pay meet the rules?", body: "Usually at least £41,700 a year or the occupation's going rate, whichever is higher." },
];

export default function UkVisaSponsorCheckerPage() {
  return (
    <>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <section className="quiet-grid border-b border-line bg-paper py-14 md:py-20">
        <div className="container-page">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-navy">Home Office register, refreshed daily</p>
            <h1 className="font-display text-4xl font-semibold leading-[1.06] text-navy md:text-6xl">UK visa sponsor checker.</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              Check whether an employer holds a licence to sponsor Skilled Worker and other work visas before you spend time on an
              application. Search by company name; results come straight from the Home Office register of licensed sponsors.
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm font-bold text-navy">
              <RefreshCw className="h-4 w-4 text-success" aria-hidden="true" />
              Free, no sign-up. Only the name you type is sent to WorkCV.
            </p>
          </div>
          <div className="mt-10 max-w-4xl rounded-lg border border-line-strong bg-surface p-5 shadow-soft md:p-7">
            <SponsorChecker />
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page">
          <SectionLabel>Before you apply</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">A licence is only the first of three checks.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {checks.map(({ icon: Icon, title, body }) => (
              <article key={title} className="rounded-xl border border-line bg-white p-6">
                <Icon className="h-7 w-7 text-gold" aria-hidden="true" />
                <h3 className="mt-5 font-display text-2xl font-semibold text-navy">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{body}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-7 text-muted">
            For the job and salary rules, see{" "}
            <a href="https://www.gov.uk/skilled-worker-visa/your-job" target="_blank" rel="noreferrer" className="font-bold text-navy underline underline-offset-4">GOV.UK: Skilled Worker visa, your job</a>{" "}
            and the{" "}
            <a href="https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations" target="_blank" rel="noreferrer" className="font-bold text-navy underline underline-offset-4">eligible occupations and going rates</a>.
            For how to mention sponsorship on your CV, read the{" "}
            <Link href="/right-to-work-cv-uk#sponsorship" className="font-bold text-navy underline underline-offset-4">right to work CV guide</Link>.
          </p>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <SectionLabel>Sources and limits</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">What the register can and cannot tell you.</h2>
            <p className="mt-6 text-base leading-8 text-muted">
              The register lists each licensed organisation&apos;s name, town, licence type and rating, and the visa routes it can
              sponsor. It does not say which jobs an employer sponsors or how many people. WorkCV matches names approximately,
              so always check the registered name and town are the employer you mean.
            </p>
            <p className="mt-4 text-base leading-8 text-muted">
              This is public information, not immigration advice. For advice on your own situation, use an adviser regulated by
              the Immigration Advice Authority or a solicitor.
            </p>
          </div>
          <div className="grid content-start gap-3 text-sm font-bold text-navy">
            <a href="https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers" target="_blank" rel="noreferrer" className="rounded-md border border-line bg-white p-4 hover:border-navy">GOV.UK: register of licensed sponsors (workers)</a>
            <a href="https://www.gov.uk/find-an-immigration-adviser" target="_blank" rel="noreferrer" className="rounded-md border border-line bg-white p-4 hover:border-navy">GOV.UK: find a regulated immigration adviser</a>
            <Link href="/tools/job-application-tracker-uk" className="rounded-md border border-line bg-white p-4 hover:border-navy">Track applications and check each employer</Link>
            <Link href="/convert-resume-to-uk-cv" className="rounded-md border border-line bg-white p-4 hover:border-navy">Convert a resume to a UK CV</Link>
          </div>
        </div>
      </section>

      <PassOffer audience="sponsorship" trackingLabel={analyticsPlacements.passSponsorChecker} />
      <FaqSection faqs={faqs} title="Visa sponsor checker questions." />
    </>
  );
}
