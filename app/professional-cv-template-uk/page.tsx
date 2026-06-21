import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Check,
  FileCheck2,
  FileText,
  SearchCheck,
  ShieldCheck,
  Target,
} from "lucide-react";

import { CvDocument } from "@/components/cv-editor";
import { ButtonLink, FinalCta, SectionLabel } from "@/components/marketing";
import { getRoleCvTemplate } from "@/lib/role-cv-templates";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Professional CV Template UK - Editable Example",
  description:
    "Use an editable professional CV template for UK jobs. Follow a clear structure, tailor your evidence and build a recruiter-readable PDF.",
  alternates: {
    canonical: "/professional-cv-template-uk",
  },
  openGraph: {
    title: "Professional CV Template UK - WorkCV",
    description:
      "Use an editable UK CV example with clear sections, evidence-led wording and current UK careers guidance.",
    url: "/professional-cv-template-uk",
  },
};

const editorHref = "/editor?template=classic&roleTemplate=general&new=1";
const professionalCv = getRoleCvTemplate("general");

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What should a professional CV include in the UK?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "A professional UK CV should include current contact details, a focused introduction, relevant skills, recent-first work history, education and reference information. Tailor each section to the job description and criteria.",
      },
    },
    {
      "@type": "Question",
      name: "What makes a CV look professional?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Professional presentation comes from clear headings, consistent dates, readable formatting, accurate information and specific evidence. Decorative graphics cannot replace relevant skills and achievements.",
      },
    },
    {
      "@type": "Question",
      name: "Should a UK CV include a photo or date of birth?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "For most UK applications, do not include a photo, age, date of birth, marital status or nationality. Prospects notes that a photograph may be relevant for acting or modelling applications, while National Careers Service guidance says not to include the listed personal details.",
      },
    },
  ],
};

const professionalSignals = [
  {
    title: "Clear target",
    body:
      "Make the role or job family obvious, then prioritise evidence that matches the advert rather than describing every task you have done.",
    icon: Target,
  },
  {
    title: "Specific evidence",
    body:
      "Replace broad claims such as 'excellent communicator' with concise examples of customers, projects, systems, responsibilities or outcomes.",
    icon: SearchCheck,
  },
  {
    title: "Consistent structure",
    body:
      "Use familiar headings, recent-first roles, consistent dates and enough white space for a recruiter to find information quickly.",
    icon: FileCheck2,
  },
  {
    title: "Accurate details",
    body:
      "Check names, dates, qualifications, contact information and any numbers before sending. Do not inflate responsibilities or results.",
    icon: ShieldCheck,
  },
];

const structure = [
  [
    "Name and contact",
    "Full name, phone, professional email, town or region, and LinkedIn or portfolio only when relevant. A full postal address is usually unnecessary.",
  ],
  [
    "Professional profile",
    "Three to five lines covering your current level, relevant field, strongest evidence and the type of role you are targeting.",
  ],
  [
    "Key skills",
    "Select concrete skills from the advert that you can support in your work history, education, projects or training.",
  ],
  [
    "Work history",
    "List the most recent role first. Give job title, employer, location, dates and focused bullets showing responsibilities and contribution.",
  ],
  [
    "Education and training",
    "Include relevant qualifications, certifications and recent training. Experienced candidates can usually place this after work history.",
  ],
  [
    "References",
    "You can state that references are available on request. Do not publish referees' contact details on a general CV.",
  ],
];

const weakStrong = [
  [
    "Profile",
    "Hard-working professional with excellent skills looking for a new challenge.",
    "Customer service adviser with three years of experience handling telephone and retail enquiries, complaint resolution and accurate CRM updates.",
  ],
  [
    "Responsibility",
    "Responsible for helping customers.",
    "Handled in-person, telephone and email enquiries, explained next steps clearly and recorded agreed actions in the CRM.",
  ],
  [
    "Teamwork",
    "Worked well as part of a team.",
    "Coordinated with sales, dispatch and support colleagues to resolve order problems without asking customers to repeat information.",
  ],
  [
    "Accuracy",
    "Good attention to detail.",
    "Checked customer details, delivery status and case notes before closing enquiries or handing work to another team.",
  ],
];

const mistakes = [
  "Using one generic profile for unrelated jobs.",
  "Listing personality words without evidence from work, study or projects.",
  "Copying the full job description into every role.",
  "Using inconsistent dates, unexplained abbreviations or dense paragraphs.",
  "Including age, date of birth, marital status, nationality or a photo by default.",
  "Publishing referee names, phone numbers or email addresses on the CV.",
  "Adding numbers or achievements that you cannot explain accurately in an interview.",
];

const sourceNotes = [
  [
    "National Careers Service — CV sections",
    "Official guidance says a CV should cover contact details, an introduction, education, work history and references, and should be tailored to the job.",
    "https://nationalcareers.service.gov.uk/careers-advice/cv-sections",
  ],
  [
    "Prospects — how to write a CV",
    "Current UK careers guidance covers reverse chronology, tailoring, relevant experience and why photographs are normally unnecessary outside roles such as acting or modelling.",
    "https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/how-to-write-a-cv",
  ],
  [
    "GOV.UK — discrimination in recruitment",
    "Government guidance explains that employers must not discriminate during recruitment and limits when date of birth should be requested.",
    "https://www.gov.uk/employer-preventing-discrimination/recruitment",
  ],
];

const relatedLinks = [
  ["How to write a CV UK", "/how-to-write-a-cv-uk"],
  ["ATS CV template UK", "/ats-cv-template-uk"],
  ["CV personal statement UK", "/cv-personal-statement-uk"],
  ["Career change CV UK", "/career-change-cv-uk"],
  ["No-subscription CV builder", "/cv-builder-no-subscription-uk"],
];

export default function ProfessionalCvTemplateUkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="quiet-grid bg-paper py-20 md:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              Professional CV template UK
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              Professional means relevant, clear and easy to verify.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              Log in by email code, start with an editable UK CV example,
              replace the sample wording with your own evidence and tailor the
              final version to one job. Clean presentation supports the
              content; it does not replace it.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={editorHref}>Use professional CV template</ButtonLink>
              <ButtonLink href="#example" variant="secondary">
                See editable example
              </ButtonLink>
            </div>
          </div>

          <div id="example" className="rounded-xl border border-line bg-white p-4 shadow-soft">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
                  Editable example
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-navy">
                  Professional UK CV
                </h2>
              </div>
              <Link
                href={editorHref}
                className="inline-flex min-h-10 items-center gap-2 rounded-md bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover"
              >
                Edit
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="template-page-preview overflow-hidden rounded-lg border border-line bg-[#eef6f3] p-3">
              <div
                className="gallery-preview-document pointer-events-none mx-auto"
                style={{ width: 794 }}
              >
                <CvDocument cv={professionalCv} compactPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Professional standard</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Four signals matter more than decoration.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            A polished CV should help a recruiter understand your fit without
            guessing. That comes from structure, evidence and accuracy rather
            than icons, rating bars or elaborate graphics.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {professionalSignals.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-xl border border-line bg-white p-6">
                  <Icon className="h-7 w-7 text-gold" />
                  <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted">{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <SectionLabel>Copy-ready structure</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Use the order that puts your strongest evidence first.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              The National Careers Service lists the expected sections and
              recommends education first for early-career applicants, while
              experienced candidates can lead with work history.
            </p>
            <div className="mt-8">
              <ButtonLink href={editorHref}>Start with this structure</ButtonLink>
            </div>
          </div>
          <div className="divide-y divide-line rounded-xl border border-line bg-white">
            {structure.map(([title, body]) => (
              <div key={title} className="grid gap-3 p-5 sm:grid-cols-[190px_1fr]">
                <h3 className="font-display text-xl font-semibold text-navy">{title}</h3>
                <p className="text-sm leading-7 text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Wording examples</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Replace vague claims with evidence a recruiter can question.
          </h2>
          <div className="mt-10 overflow-hidden rounded-xl border border-line bg-white">
            <div className="hidden grid-cols-[150px_1fr_1fr] gap-5 bg-navy px-6 py-4 text-sm font-bold text-white md:grid">
              <span>Section</span>
              <span>Too vague</span>
              <span>Stronger direction</span>
            </div>
            {weakStrong.map(([section, weak, strong]) => (
              <div
                key={section}
                className="grid gap-4 border-t border-line px-6 py-5 first:border-t-0 md:grid-cols-[150px_1fr_1fr] md:gap-5"
              >
                <h3 className="font-display text-xl font-semibold text-navy">{section}</h3>
                <p className="text-sm leading-7 text-muted">{weak}</p>
                <p className="text-sm leading-7 text-ink">{strong}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted">
            These are examples of structure, not claims to copy. Replace every
            detail with information that is accurate for your own work.
          </p>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionLabel>Final review</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Professional does not mean impersonal or inflated.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Use direct language, but keep it recognisably yours. If a claim
              would be difficult to explain in an interview, rewrite it with
              accurate context.
            </p>
            <div className="mt-8 rounded-xl border border-line bg-white p-6">
              <Briefcase className="h-7 w-7 text-gold" />
              <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
                Tailor before every application
              </h3>
              <p className="mt-4 text-sm leading-7 text-muted">
                Read the job description, essential criteria and employer
                information. Move the most relevant evidence forward and remove
                content that does not help this application.
              </p>
            </div>
          </div>
          <aside className="h-fit rounded-xl border border-line bg-white p-6">
            <FileText className="h-7 w-7 text-gold" />
            <h2 className="mt-5 font-display text-2xl font-semibold text-navy">
              What to avoid
            </h2>
            <ul className="mt-5 space-y-4">
              {mistakes.map((mistake) => (
                <li key={mistake} className="flex gap-3 text-sm leading-6 text-ink">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  {mistake}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <SectionLabel>Research checked</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Based on current UK careers guidance.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Last checked 21 June 2026. The page avoids unsupported success
              claims and uses National Careers Service, GOV.UK and Prospects
              guidance for CV sections, tailoring and personal information.
            </p>
          </div>
          <div className="grid gap-4">
            {sourceNotes.map(([title, body, href]) => (
              <a
                key={`${title}-${href}`}
                href={href}
                rel="noreferrer"
                target="_blank"
                className="group rounded-xl border border-line bg-white p-5 transition hover:-translate-y-1 hover:border-navy"
              >
                <h3 className="font-display text-xl font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{body}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-navy">
                  Open source
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-page">
          <SectionLabel>Related guidance</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {relatedLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="group rounded-xl border border-line bg-white p-5 text-sm font-bold text-navy transition hover:-translate-y-1 hover:border-navy"
              >
                {label}
                <ArrowRight className="mt-4 h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FinalCta
        heading="Build a professional CV from evidence you can stand behind."
        body={`Log in by email code, replace the editable example with your own details, then pay ${site.price} to unlock the selected saved CV PDF.`}
        primaryHref={editorHref}
        primary="Use professional CV template"
        secondaryHref="/how-to-write-a-cv-uk"
        secondary="Read the CV guide"
      />
    </>
  );
}
