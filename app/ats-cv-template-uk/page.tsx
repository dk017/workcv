import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileText,
  LayoutList,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  TextCursorInput,
} from "lucide-react";

import { ButtonLink, FinalCta, SectionLabel } from "@/components/marketing";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "ATS CV Template UK - Clean Applicant Tracking Format",
  description:
    "Build an ATS-friendly UK CV with a clean structure, standard headings, job advert keywords and a recruiter-readable PDF. No subscription.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is an ATS CV template?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "An ATS CV template is a clean CV layout designed to be easy for applicant tracking systems and recruiters to read. It uses standard sections, simple formatting, clear dates and role-relevant keywords.",
      },
    },
    {
      "@type": "Question",
      name: "Do UK employers use ATS software?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Many larger employers and recruitment teams use applicant tracking systems to manage applications. A clean, readable CV is still important because recruiters also review CVs manually.",
      },
    },
    {
      "@type": "Question",
      name: "Can an ATS-friendly CV guarantee interviews?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "No CV template can guarantee interviews. The goal is to make your CV easy to parse, easy to scan and closely matched to the job advert.",
      },
    },
  ],
};

const principles = [
  {
    title: "Clear structure",
    body:
      "Use familiar sections: profile, key skills, work history, education and other relevant information.",
    icon: LayoutList,
  },
  {
    title: "Job advert language",
    body:
      "Match the real requirements in the advert. If the employer asks for Excel, safeguarding or stock control, use those terms where true.",
    icon: Search,
  },
  {
    title: "Readable formatting",
    body:
      "Avoid over-designed layouts, text boxes for core content, tiny fonts and decorative graphics that distract from the information.",
    icon: TextCursorInput,
  },
];

const goodBad = [
  [
    "Headings",
    "Creative labels such as 'My journey' or 'Where I have shined'",
    "Standard labels such as Profile, Key Skills, Work History and Education",
  ],
  [
    "Layout",
    "Two-column designs where dates, job titles and bullets are split apart",
    "A clean single-column flow with job title, employer, dates and bullets together",
  ],
  [
    "Keywords",
    "Stuffing a keyword list that does not match your experience",
    "Natural wording taken from the job advert and backed by real examples",
  ],
  [
    "Contact details",
    "Important details hidden only in a decorative header or footer",
    "Name, phone, email and location placed plainly near the top of the CV",
  ],
];

const templateSections = [
  [
    "Name and contact details",
    "Full name, phone, email, town/city or region, and LinkedIn or portfolio link if relevant.",
  ],
  [
    "Profile",
    "Three to five lines focused on the target role, key evidence and value you bring.",
  ],
  [
    "Key skills",
    "Six to ten skills that match the advert and can be proven elsewhere in the CV.",
  ],
  [
    "Work history",
    "Reverse chronological roles with job title, employer, dates and achievement-led bullet points.",
  ],
  [
    "Education and training",
    "Qualifications, certificates, licences, short courses and recent training relevant to the role.",
  ],
  [
    "Additional information",
    "Optional: driving licence, right to work statement where appropriate, languages, volunteering or systems.",
  ],
];

const checks = [
  "The CV can be understood without colour, icons or decorative layout",
  "Every key skill is backed by a role, project, qualification or example",
  "Dates follow one consistent format",
  "The file exports cleanly as a PDF",
  "The first page shows the target role, skills and most relevant experience",
  "The CV is tailored to one job family, not every job at once",
];

const relatedLinks = [
  ["CV personal statement UK", "/cv-personal-statement-uk"],
  ["Career change CV UK", "/career-change-cv-uk"],
  ["CV employment gap UK", "/cv-employment-gap-uk"],
  ["Templates", "/templates"],
  ["No-subscription CV builder", "/cv-builder-no-subscription-uk"],
];

export default function AtsCvTemplateUkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="quiet-grid bg-paper py-20 md:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[1fr_0.82fr]">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              ATS CV template UK
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              Build a CV that software can read and recruiters can trust.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              An ATS-friendly CV is not about tricking a system. It is about
              making the right information easy to find: clear headings, clean
              formatting, relevant keywords and honest evidence.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/editor">Build an ATS-friendly CV</ButtonLink>
              <ButtonLink href="/templates" variant="secondary">
                View templates
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-white p-6 shadow-soft">
            <ShieldCheck className="h-7 w-7 text-gold" />
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              No false promises
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-navy">
              ATS-safe does not mean interview-guaranteed.
            </h2>
            <p className="mt-5 text-sm leading-7 text-muted">
              The template can make your CV easier to read and parse. The
              interview still depends on fit, evidence, timing and the strength
              of other applicants.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Principles</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            The best ATS CV template is boring in the right places.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            National Careers Service guidance lists the core CV sections a
            recruiter expects. Oxford Careers notes that CVs should make it easy
            for both readers and applicant tracking systems to find relevant
            skills and experience. That means clarity beats decoration.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {principles.map((principle) => {
              const Icon = principle.icon;
              return (
                <div key={principle.title} className="rounded-xl border border-line bg-white p-6">
                  <Icon className="h-7 w-7 text-gold" />
                  <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
                    {principle.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted">{principle.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.86fr_1.14fr]">
          <div>
            <SectionLabel>Template structure</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Use sections that both humans and systems expect.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              This structure works for most UK job applications. Keep the order
              stable, then tailor the words inside each section to the job.
            </p>
          </div>

          <div className="divide-y divide-line rounded-xl border border-line bg-white">
            {templateSections.map(([title, body]) => (
              <div key={title} className="grid gap-3 p-5 sm:grid-cols-[190px_1fr]">
                <h3 className="font-display text-xl font-semibold text-navy">{title}</h3>
                <p className="text-sm leading-7 text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1fr]">
          <div>
            <SectionLabel>Good vs risky</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Small formatting choices can change readability.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              The goal is not to remove all design. The goal is to make sure the
              design never hides the information the employer is trying to find.
            </p>
          </div>

          <div className="divide-y divide-line rounded-xl border border-line bg-white">
            {goodBad.map(([topic, risky, better]) => (
              <div key={topic} className="grid gap-4 p-5">
                <h3 className="font-display text-xl font-semibold text-navy">{topic}</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <p className="rounded-lg border border-line bg-paper p-4 text-sm leading-7 text-muted">
                    {risky}
                  </p>
                  <p className="rounded-lg border border-line bg-white p-4 text-sm font-bold leading-7 text-navy">
                    {better}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionLabel>Quality check</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Check the CV before you apply.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              JobHelp guidance on applicant filters focuses on making your CV
              relevant and easy to process. Before downloading, review the CV
              like a recruiter searching for exact evidence.
            </p>
            <div className="mt-8 grid gap-3">
              {checks.map((check) => (
                <div key={check} className="flex gap-3 rounded-xl border border-line bg-white p-4 text-sm font-bold text-navy">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  {check}
                </div>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-xl border border-line bg-white p-6">
            <SlidersHorizontal className="h-7 w-7 text-gold" />
            <h2 className="mt-5 font-display text-2xl font-semibold text-navy">
              Keyword rule
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Use the employer's words where they are accurate. Do not add skills
              you cannot prove. If the advert asks for customer complaints, stock
              rotation or Sage, your CV should show where you have used them.
            </p>
          </aside>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionLabel>Research checked</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Based on UK CV guidance and applicant-filter advice.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Last checked 13 June 2026. This page uses National Careers Service
              CV section guidance, Oxford Careers guidance on readability for
              recruiters and ATS, and JobHelp advice on application filters.
            </p>
          </div>

          <div className="grid gap-3 rounded-xl border border-line bg-white p-6 text-sm font-bold text-navy">
            <a
              href="https://nationalcareers.service.gov.uk/careers-advice/cv-sections"
              rel="noreferrer"
              target="_blank"
            >
              National Careers Service CV sections
            </a>
            <a href="https://www.careers.ox.ac.uk/cvs" rel="noreferrer" target="_blank">
              Oxford Careers CV guidance
            </a>
            <a
              href="https://jobhelp.campaign.gov.uk/improve-your-chances-of-getting-a-job/cv-job-applications-interviews/make-your-cv-stand-out/getting-through-application-filters-applicant-tracking-systems/"
              rel="noreferrer"
              target="_blank"
            >
              JobHelp applicant filter guidance
            </a>
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
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
        heading="Build a clean UK CV without fighting the template."
        body={`Use an ATS-friendly structure, preview your CV, and pay ${site.price} only when you download the PDF.`}
        secondaryHref="/templates"
        secondary="View templates"
      />
    </>
  );
}
