import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  FileText,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";

import { CvDocument } from "@/components/cv-editor";
import { ButtonLink, FinalCta, SectionLabel } from "@/components/marketing";
import { getRoleCvTemplate } from "@/lib/role-cv-templates";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "CV Examples UK - Editable Examples for UK Jobs",
  description:
    "Browse UK CV examples for customer service, engineering, driving, nursing, teaching, warehouse, graduate and care roles. Open an editable template and tailor it before download.",
  alternates: {
    canonical: "/cv-examples-uk",
  },
  openGraph: {
    title: "CV Examples UK - WorkCV",
    description:
      "Use UK CV examples as starting points, then edit the wording to match your own evidence before downloading.",
    url: "/cv-examples-uk",
  },
};

const examples = [
  {
    title: "Customer service CV example",
    href: "/cv-template-customer-service-uk",
    role: "customer-service" as const,
    body: "Best for adviser, assistant, contact-centre and support roles where complaint handling, CRM and calm communication matter.",
  },
  {
    title: "Engineer CV example",
    href: "/cv-template-engineer-uk",
    role: "engineer" as const,
    body: "Best for technical applicants who need to show discipline fit, tools, projects, safety and engineering judgement.",
  },
  {
    title: "Driver CV example",
    href: "/cv-template-driver-uk",
    role: "driver" as const,
    body: "Best for delivery, van, courier and transport roles where licence, route reliability and records matter.",
  },
  {
    title: "Nurse CV example",
    href: "/cv-template-nurse-uk",
    role: "nurse" as const,
    body: "Best for nursing applicants who need to show NMC status, safe practice, clinical evidence and setting fit.",
  },
];

const moreExamples = [
  ["Teacher CV example", "/cv-template-teacher-uk"],
  ["Warehouse CV example", "/cv-template-warehouse-uk"],
  ["Graduate CV example", "/cv-template-graduate-uk"],
  ["Care worker CV example", "/cv-template-care-worker-uk"],
  ["Professional CV template", "/professional-cv-template-uk"],
  ["ATS CV template", "/ats-cv-template-uk"],
];

const exampleRules = [
  {
    title: "Use examples for structure, not copying",
    body:
      "A CV example should show what evidence belongs where. Replace names, employers, dates, numbers and claims with your own accurate details.",
    icon: ClipboardCheck,
  },
  {
    title: "Tailor each example to one advert",
    body:
      "National Careers Service guidance recommends matching your CV to the job advert, essential criteria and company details.",
    icon: SearchCheck,
  },
  {
    title: "Keep UK personal details sensible",
    body:
      "For most UK CVs, avoid unnecessary personal details such as age, date of birth, marital status, nationality or photo-first layouts.",
    icon: ShieldCheck,
  },
];

const weakStrong = [
  [
    "Customer service",
    "Friendly person with excellent communication skills.",
    "Handled telephone, email and in-person enquiries, resolved routine complaints and updated CRM records accurately.",
  ],
  [
    "Engineering",
    "Worked on engineering projects.",
    "Updated CAD drawings, documented test results and worked with production colleagues to investigate recurring defects.",
  ],
  [
    "Driving",
    "Good driver and reliable worker.",
    "Completed multi-drop routes, recorded proof of delivery and reported vehicle defects before scheduled shifts.",
  ],
  [
    "Graduate",
    "Recent graduate looking for an opportunity.",
    "Business graduate with placement, Excel analysis and customer-research project experience relevant to entry-level analyst roles.",
  ],
];

const sourceNotes = [
  [
    "National Careers Service — CV sections",
    "Official guidance says a CV should be clear, easy to read, tailored to the job advert and built around your skills, achievements and experience.",
    "https://nationalcareers.service.gov.uk/careers-advice/cv-sections",
  ],
  [
    "Prospects — how to write a CV",
    "Prospects guidance covers reverse chronological CVs, tailoring, relevant experience, references and avoiding unnecessary photographs for most roles.",
    "https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/how-to-write-a-cv",
  ],
  [
    "GOV.UK — discrimination in recruitment",
    "Government guidance explains that employers must not discriminate during recruitment, supporting a careful approach to personal details.",
    "https://www.gov.uk/employer-preventing-discrimination/recruitment",
  ],
];

export default function CvExamplesUkPage() {
  return (
    <>
      <section className="quiet-grid bg-paper py-20 md:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              CV examples UK
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              Start from a UK CV example, then make every claim yours.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              Browse role-specific CV examples, open the closest editable
              template and replace the sample wording with accurate evidence
              from your own work, study or training.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/cv-builder-no-subscription-uk">Open CV builder</ButtonLink>
              <ButtonLink href="#examples" variant="secondary">Browse examples</ButtonLink>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {examples.slice(0, 4).map((example) => (
              <Link
                key={example.href}
                href={example.href}
                className="group rounded-xl border border-line bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-navy"
              >
                <div className="template-page-preview overflow-hidden rounded-lg border border-line bg-[#eef6f3] p-2">
                  <div className="gallery-preview-document pointer-events-none mx-auto" style={{ width: 794 }}>
                    <CvDocument cv={getRoleCvTemplate(example.role)} compactPreview />
                  </div>
                </div>
                <h2 className="mt-4 font-display text-2xl font-semibold text-navy">{example.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{example.body}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-navy">
                  Open editable example <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>How to use CV examples</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            The best CV examples help you write honestly, not sound generic.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {exampleRules.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-xl border border-line bg-white p-6">
                  <Icon className="h-7 w-7 text-gold" />
                  <h3 className="mt-5 font-display text-2xl font-semibold text-navy">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted">{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="examples" className="bg-paper py-24">
        <div className="container-page">
          <SectionLabel>Editable role examples</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Choose the closest example, then tailor it to the advert.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {moreExamples.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="group flex min-h-24 items-center justify-between gap-4 rounded-xl border border-line bg-white p-5 text-navy shadow-sm transition hover:-translate-y-1 hover:border-navy"
              >
                <span className="font-bold">{label}</span>
                <ArrowRight className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Example wording</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Move from vague claims to evidence.
          </h2>
          <div className="mt-10 overflow-hidden rounded-xl border border-line bg-white">
            <div className="hidden grid-cols-[160px_1fr_1fr] gap-5 bg-navy px-6 py-4 text-sm font-bold text-white md:grid">
              <span>Role</span>
              <span>Too vague</span>
              <span>Stronger direction</span>
            </div>
            {weakStrong.map(([role, weak, strong]) => (
              <div
                key={role}
                className="grid gap-4 border-t border-line px-6 py-5 first:border-t-0 md:grid-cols-[160px_1fr_1fr] md:gap-5"
              >
                <h3 className="font-display text-xl font-semibold text-navy">{role}</h3>
                <p className="text-sm leading-7 text-muted">{weak}</p>
                <p className="text-sm leading-7 text-ink">{strong}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted">
            These are writing directions, not claims to copy. Replace every
            detail with facts you can explain in an interview.
          </p>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>Research checked</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Based on current UK CV guidance.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Last checked 23 June 2026. The page uses National Careers
              Service, Prospects and GOV.UK guidance for CV structure,
              tailoring and personal details.
            </p>
          </div>
          <div className="grid gap-4">
            {sourceNotes.map(([title, body, href]) => (
              <a key={`${title}-${href}`} href={href} rel="noreferrer" target="_blank" className="group rounded-xl border border-line bg-white p-5 transition hover:-translate-y-1 hover:border-navy">
                <h3 className="font-display text-xl font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{body}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-navy">
                  Open source <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page rounded-xl border border-line bg-white p-6 sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div className="flex gap-4">
            <FileText className="h-8 w-8 shrink-0 text-gold" />
            <div>
              <h2 className="font-display text-2xl font-semibold text-navy">
                Ready to turn an example into your CV?
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Build first, preview the result, then pay {site.price} only
                when the PDF is ready.
              </p>
            </div>
          </div>
          <div className="mt-6 shrink-0 sm:mt-0">
            <ButtonLink href="/editor?template=classic&roleTemplate=general&new=1">
              Start my CV
            </ButtonLink>
          </div>
        </div>
      </section>

      <FinalCta
        heading="Use examples as a starting point, not a script."
        body={`Choose a UK CV example, edit it around your own evidence, then pay ${site.price} only when you download the finished PDF.`}
        primaryHref="/cv-builder-no-subscription-uk"
        primary="Open CV builder"
        secondaryHref="/templates"
        secondary="Compare templates"
      />
    </>
  );
}
