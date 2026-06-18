import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  ClipboardList,
  FileText,
  GraduationCap,
  Presentation,
  ShieldCheck,
} from "lucide-react";

import { CvDocument } from "@/components/cv-editor";
import { ButtonLink, FinalCta, SectionLabel } from "@/components/marketing";
import { getRoleCvTemplate } from "@/lib/role-cv-templates";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Teacher CV Template UK - QTS and Classroom Example",
  description:
    "Use a UK teacher CV template with QTS, classroom impact, safeguarding, assessment, behaviour and curriculum examples you can edit.",
};

const editorHref = "/editor?template=classic&roleTemplate=teacher&new=1";
const teacherCv = getRoleCvTemplate("teacher");

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What should a teacher CV include in the UK?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "A UK teacher CV should include contact details, QTS or training route, phase and subject, a focused profile, classroom experience, safeguarding awareness, behaviour management, assessment evidence, education and relevant CPD.",
      },
    },
    {
      "@type": "Question",
      name: "Should I mention Teachers' Standards on my CV?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes, where relevant. Do not simply list the Teachers' Standards. Show evidence through lesson planning, pupil progress, assessment, adaptive teaching, behaviour routines, safeguarding and professional conduct.",
      },
    },
    {
      "@type": "Question",
      name: "How long should a teacher CV be?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Most teacher CVs should be one to two pages. Early career teachers can use placements and training evidence, while experienced teachers should prioritise recent classroom impact and role-specific evidence.",
      },
    },
  ],
};

const recruiterChecks = [
  {
    title: "QTS and route",
    body:
      "Make your QTS, PGCE, school direct, apprenticeship, ECT status or overseas route clear before the reader hunts for it.",
    icon: GraduationCap,
  },
  {
    title: "Classroom impact",
    body:
      "Show phase, subject, year groups, class profile, assessment practice, progress evidence and how you respond to misconceptions.",
    icon: Presentation,
  },
  {
    title: "Behaviour and safeguarding",
    body:
      "Evidence routines, relationships, safe learning environments, pastoral awareness and appropriate escalation.",
    icon: ShieldCheck,
  },
  {
    title: "Adaptive teaching",
    body:
      "Show how you support mixed attainment, SEND, EAL, disadvantaged pupils and pupils needing challenge.",
    icon: BookOpenCheck,
  },
];

const structure = [
  [
    "Header",
    "Name, location, phone, email, target role, subject or phase, QTS or training status. Keep personal details professional and concise.",
  ],
  [
    "Profile",
    "Four focused lines covering subject or phase, classroom context, teaching strengths and the role you are targeting.",
  ],
  [
    "Teaching evidence",
    "Highlight lesson planning, curriculum sequencing, assessment, behaviour routines, safeguarding, SEND support and parent communication.",
  ],
  [
    "Experience",
    "Most recent first. Include school type, key stages, subjects, class profile, responsibilities, outcomes and collaboration.",
  ],
  [
    "Education and CPD",
    "Show QTS route, PGCE or degree, placements, ECT induction, safeguarding training, curriculum CPD and subject knowledge enhancement where relevant.",
  ],
];

const bulletExamples = [
  {
    setting: "Secondary teacher",
    bullets: [
      "Planned and delivered KS3 and GCSE lessons using modelled examples, retrieval practice and checks for understanding.",
      "Used assessment data and pupil work to identify misconceptions, adapt sequencing and prepare targeted revision tasks.",
    ],
  },
  {
    setting: "Primary teacher",
    bullets: [
      "Delivered broad curriculum lessons across core and foundation subjects, adapting tasks for pupils with varied starting points.",
      "Used formative assessment, phonics evidence and book reviews to plan next steps and support pupil progress.",
    ],
  },
  {
    setting: "ECT or trainee teacher",
    bullets: [
      "Built evidence against the Teachers' Standards through mentored planning, observed lessons, reflection and pupil assessment.",
      "Developed consistent classroom routines, clear explanations and scaffolded tasks across two contrasting school placements.",
    ],
  },
  {
    setting: "SEND or pastoral focus",
    bullets: [
      "Worked with SENCO, teaching assistants and pastoral staff to adapt learning, support behaviour plans and reduce barriers to participation.",
      "Communicated with parents and carers professionally, keeping records accurate and escalating safeguarding concerns through school policy.",
    ],
  },
];

const mistakes = [
  "Saying 'passionate teacher' without classroom evidence.",
  "Hiding QTS, ECT status, subject specialism or key stage experience.",
  "Listing responsibilities without showing pupil progress, assessment or adaptation.",
  "Using one generic CV for primary, secondary, SEND, supply and independent school roles.",
  "Forgetting safeguarding, behaviour routines, parent communication and CPD.",
];

const sourceNotes = [
  [
    "Teachers' Standards",
    "GOV.UK says the standards set minimum requirements for teachers' practice and conduct in England.",
    "https://www.gov.uk/government/publications/teachers-standards",
  ],
  [
    "National Careers Service",
    "Secondary teachers teach 11 to 16, or up to 19 in schools with sixth forms, and need QTS for most primary and secondary schools in England.",
    "https://nationalcareers.service.gov.uk/job-profiles/secondary-school-teacher",
  ],
  [
    "Get Into Teaching",
    "Official guidance covers teaching routes, QTS, PGCE, school placements, subject knowledge enhancement and changing career into teaching.",
    "https://getintoteaching.education.gov.uk/life-as-a-teacher",
  ],
  [
    "School workforce data",
    "The 2024 school workforce release reported 2,200 teacher vacancies in November 2024, down from a 2023 peak but still a meaningful hiring signal.",
    "https://explore-education-statistics.service.gov.uk/find-statistics/school-workforce-in-england/2024",
  ],
];

const relatedLinks = [
  ["Career change CV", "/career-change-cv-uk"],
  ["Return to work CV", "/return-to-work-cv-uk"],
  ["CV personal statement UK", "/cv-personal-statement-uk"],
  ["ATS CV template UK", "/ats-cv-template-uk"],
  ["No-subscription CV builder", "/cv-builder-no-subscription-uk"],
];

export default function TeacherCvTemplateUkPage() {
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
              Teacher CV template UK
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              Build a teacher CV around classroom evidence, not vague passion.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              Start with an editable UK teacher CV template shaped around QTS,
              key stages, subject knowledge, assessment, behaviour, safeguarding
              and the classroom evidence schools actually scan for.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={editorHref}>Use teacher CV template</ButtonLink>
              <ButtonLink href="#example" variant="secondary">
                See example
              </ButtonLink>
            </div>
          </div>

          <div id="example" className="rounded-xl border border-line bg-white p-4 shadow-soft">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
                  Editable draft
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-navy">
                  Secondary Teacher CV
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
                <CvDocument cv={teacherCv} compactPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>School scan</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            A strong teacher CV makes the shortlist questions easy.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            Schools need to see whether you can teach the phase or subject,
            manage a classroom, meet professional standards, keep pupils safe
            and help different learners make progress.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {recruiterChecks.map((item) => {
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
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>Template structure</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Lead with phase, subject, standards evidence and recent teaching.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              The best teacher CV is specific enough for the vacancy. A Year 5
              teacher, GCSE maths teacher, SEND teacher and supply teacher
              should not sound interchangeable.
            </p>
            <div className="mt-8">
              <ButtonLink href={editorHref}>Start with this structure</ButtonLink>
            </div>
          </div>

          <div className="divide-y divide-line rounded-xl border border-line bg-white">
            {structure.map(([title, body]) => (
              <div key={title} className="grid gap-3 p-5 sm:grid-cols-[170px_1fr]">
                <h3 className="font-display text-xl font-semibold text-navy">{title}</h3>
                <p className="text-sm leading-7 text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Bullet examples</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Show the teaching work behind the job title.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            Replace generic responsibility lists with evidence of planning,
            assessment, adaptation, behaviour, safeguarding and collaboration.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {bulletExamples.map((example) => (
              <article key={example.setting} className="rounded-xl border border-line bg-white p-6">
                <ClipboardList className="h-7 w-7 text-gold" />
                <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
                  {example.setting}
                </h3>
                <ul className="mt-5 space-y-3">
                  {example.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-sm leading-7 text-ink">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionLabel>Primary, secondary and SEND</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Tune the same CV to the school, phase and advert.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              A school CV should echo the vacancy without copying it blindly.
              Pull out the key stage, curriculum need, class profile, behaviour
              context, safeguarding responsibilities and any specialist subject
              or SEND requirement.
            </p>
            <div className="mt-8 rounded-xl border border-line bg-white p-6">
              <h3 className="font-display text-2xl font-semibold text-navy">
                Before you apply, check the advert for:
              </h3>
              <ul className="mt-5 space-y-4">
                {[
                  "Phase, key stage, subject and exam board where relevant",
                  "QTS, ECT, PGCE, subject knowledge or overseas qualification requirements",
                  "Behaviour, safeguarding, SEND, EAL and pastoral responsibilities",
                  "Assessment, curriculum, intervention and parent communication expectations",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-bold text-navy">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
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
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>Research checked</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Built from current UK teaching and workforce guidance.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Last checked 17 June 2026. This page uses GOV.UK Teachers'
              Standards, National Careers Service role guidance, Get Into
              Teaching route guidance and official school workforce data.
            </p>
          </div>

          <div className="grid gap-4">
            {sourceNotes.map(([title, body, href]) => (
              <a
                key={href}
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
        heading="Start with a teacher CV that already knows the classroom."
        body={`Use the editable teacher template, adapt it to the vacancy, then pay ${site.price} only when you download the final PDF.`}
        secondaryHref="/career-change-cv-uk"
        secondary="Career change guidance"
      />
    </>
  );
}
