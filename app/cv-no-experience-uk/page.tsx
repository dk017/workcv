import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  ClipboardList,
  FileText,
  GraduationCap,
  HeartHandshake,
  Search,
} from "lucide-react";

import { ButtonLink, FinalCta, SectionLabel } from "@/components/marketing";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "CV No Experience UK - First Job CV Template",
  description:
    "Write a UK CV with no work experience. Learn what to include, how to show transferable skills, and build a first-job CV without a subscription.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I write a CV with no experience in the UK?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Start with a short profile, then show education, skills, projects, volunteering, school responsibilities, clubs, caring responsibilities, training and any part-time or unpaid work. Match the evidence to the job advert.",
      },
    },
    {
      "@type": "Question",
      name: "What can I put on a CV if I have never had a job?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "You can include school or college projects, coursework, volunteering, clubs, sports teams, family responsibilities, online courses, certificates, languages, digital skills and examples of reliability or teamwork.",
      },
    },
    {
      "@type": "Question",
      name: "Should a no-experience CV be one page or two pages?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "For a first job CV, one page is often enough if your experience is limited. Use two pages only if you have enough relevant education, projects, volunteering or responsibilities to justify the space.",
      },
    },
  ],
};

const evidenceSources = [
  {
    title: "Education",
    body:
      "Relevant subjects, coursework, grades, practical assignments, group projects, presentations and deadlines.",
    icon: GraduationCap,
  },
  {
    title: "Volunteering",
    body:
      "Charity shops, community events, school support, sports coaching, religious groups or local projects.",
    icon: HeartHandshake,
  },
  {
    title: "Responsibilities",
    body:
      "Helping family, caring, organising transport, budgeting, mentoring younger pupils or running club activities.",
    icon: ClipboardList,
  },
  {
    title: "Self-directed learning",
    body:
      "Online courses, certificates, portfolio projects, coding practice, language learning or digital tools.",
    icon: BookOpen,
  },
];

const profileExamples = [
  {
    title: "Retail first job",
    statement:
      "Reliable school leaver looking for a first retail role, with strong attendance, confident communication and experience helping at school events. Comfortable working in busy environments and keen to build customer service and stock-handling experience.",
  },
  {
    title: "Apprenticeship",
    statement:
      "Practical and punctual college student seeking an apprenticeship, with strong problem-solving skills, hands-on coursework and a careful approach to health and safety. Interested in learning on the job and building long-term trade experience.",
  },
  {
    title: "Office/admin first role",
    statement:
      "Organised entry-level candidate with good written communication, Microsoft Office basics and experience completing coursework to deadline. Looking for a junior admin role where accuracy, reliability and willingness to learn matter.",
  },
  {
    title: "Hospitality",
    statement:
      "Friendly and dependable first-job applicant with experience supporting school events, working in teams and communicating clearly with different age groups. Available for flexible shifts and ready to learn fast in a busy hospitality setting.",
  },
];

const sections = [
  [
    "Profile",
    "Three to five lines that name the type of role and give evidence of reliability, communication, learning ability or practical skills.",
  ],
  [
    "Key skills",
    "Six to eight skills from the job advert, such as customer service, teamwork, timekeeping, IT, organisation or manual handling.",
  ],
  [
    "Education",
    "Put this higher than work history if school, college, university or training is your strongest evidence.",
  ],
  [
    "Projects and activities",
    "Add coursework, volunteering, societies, clubs, sports, community work, caring responsibilities or self-directed learning.",
  ],
  [
    "Work history",
    "If you have none, do not fake it. If you have unpaid, casual, family business or volunteering work, label it honestly.",
  ],
];

const translateExamples = [
  [
    "Group coursework",
    "Worked with four classmates to plan, research and present a business studies project to deadline.",
  ],
  [
    "Sports team",
    "Built teamwork, reliability and communication through weekly training and weekend fixtures.",
  ],
  [
    "Helping at home",
    "Managed routine responsibilities, followed instructions and kept tasks organised around school deadlines.",
  ],
  [
    "Online course",
    "Completed a beginner Excel course covering data entry, formatting and simple formulas.",
  ],
];

const relatedLinks = [
  ["Student CV template", "/student-cv-template"],
  ["School leaver CV example", "/school-leaver-cv-example"],
  ["CV personal statement UK", "/cv-personal-statement-uk"],
  ["ATS CV template UK", "/ats-cv-template-uk"],
  ["No-subscription CV builder", "/cv-builder-no-subscription-uk"],
];

export default function CvNoExperienceUkPage() {
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
              CV no experience UK
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              You still have evidence. It just is not paid work yet.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              A no-experience CV should not look empty. It should turn school,
              projects, volunteering, responsibilities and transferable skills
              into proof that you can learn, show up and do the job.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/editor">Build my first CV</ButtonLink>
              <ButtonLink href="/school-leaver-cv-example" variant="secondary">
                School leaver example
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-white p-6 shadow-soft">
            <Search className="h-7 w-7 text-gold" />
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              Recruiter question
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-navy">
              Can this person prove the basics?
            </h2>
            <div className="mt-6 space-y-4">
              {[
                "Turns up reliably",
                "Communicates clearly",
                "Learns instructions",
                "Works with other people",
                "Has interest in this type of job",
              ].map((item) => (
                <div key={item} className="flex gap-3 text-sm font-bold text-navy">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Evidence</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            What to include when you have no work experience.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            National Careers Service guidance says volunteering can help you
            gain skills and experience that look useful on a CV. Oxford Careers
            also recommends using an Experience section rather than only
            Employment, because experience can include volunteering, student
            roles, internships, paid work and more.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {evidenceSources.map((source) => {
              const Icon = source.icon;
              return (
                <div key={source.title} className="rounded-xl border border-line bg-white p-6">
                  <Icon className="h-7 w-7 text-gold" />
                  <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
                    {source.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted">{source.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page">
          <SectionLabel>Examples</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Personal statement examples for a first CV.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            Use these to understand the pattern: target role, useful traits,
            real evidence, and willingness to learn. Rewrite the wording around
            your own situation and the job advert.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {profileExamples.map((example) => (
              <article key={example.title} className="rounded-xl border border-line bg-white p-6">
                <FileText className="h-7 w-7 text-gold" />
                <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
                  {example.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-muted">{example.statement}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.86fr_1.14fr]">
          <div>
            <SectionLabel>CV structure</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Put your strongest evidence before an empty work history.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              If paid work is not your strongest section, do not lead with it.
              Open with the parts that show fit for the job.
            </p>
          </div>

          <div className="divide-y divide-line rounded-xl border border-line bg-white">
            {sections.map(([title, body]) => (
              <div key={title} className="grid gap-3 p-5 sm:grid-cols-[170px_1fr]">
                <h3 className="font-display text-xl font-semibold text-navy">{title}</h3>
                <p className="text-sm leading-7 text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1fr]">
          <div>
            <SectionLabel>Translate experience</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Turn ordinary activities into job evidence.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Do not exaggerate. Translate honestly. Employers know a first-job
              applicant is still learning, but they need signs of reliability,
              communication and practical judgement.
            </p>
          </div>

          <div className="divide-y divide-line rounded-xl border border-line bg-white">
            {translateExamples.map(([source, evidence]) => (
              <div key={source} className="grid gap-3 p-5 sm:grid-cols-[170px_1fr]">
                <h3 className="font-display text-xl font-semibold text-navy">{source}</h3>
                <p className="text-sm leading-7 text-muted">{evidence}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionLabel>Research checked</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Based on UK first-job and CV guidance.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Last checked 13 June 2026. This page uses National Careers Service
              guidance on CV sections and post-18 volunteering, Prospects
              guidance for 16-year-old CVs, and Oxford Careers guidance on using
              Experience sections for early-career candidates.
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
            <a
              href="https://nationalcareers.service.gov.uk/careers-advice/career-choices-at-18"
              rel="noreferrer"
              target="_blank"
            >
              National Careers Service post-18 options
            </a>
            <a
              href="https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/example-cvs/school-leaver-cv-example/"
              rel="noreferrer"
              target="_blank"
            >
              Prospects school leaver CV example
            </a>
            <a href="https://www.careers.ox.ac.uk/cvs" rel="noreferrer" target="_blank">
              Oxford Careers CV guidance
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
        heading="Build a first CV that does not feel empty."
        body={`Start with guided sections, preview your CV, and pay ${site.price} only when you download.`}
        secondaryHref="/ats-cv-template-uk"
        secondary="ATS-friendly format"
      />
    </>
  );
}
