import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Check,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Laptop,
  Lightbulb,
  Users,
} from "lucide-react";

import { CvDocument } from "@/components/cv-editor";
import { ButtonLink, FinalCta, SectionLabel } from "@/components/marketing";
import { getRoleCvTemplate } from "@/lib/role-cv-templates";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Graduate CV Template UK - Scheme and Entry-Level Example",
  description:
    "Use a UK graduate CV template with degree, internship, placement, project, part-time work and transferable skill examples you can edit.",
};

const editorHref = "/editor?template=classic&roleTemplate=graduate&new=1";
const graduateCv = getRoleCvTemplate("graduate");

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What should a graduate CV include in the UK?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "A UK graduate CV should include contact details, a focused profile, education, relevant modules, dissertation or projects, internships or placements, part-time work, volunteering, skills, achievements and evidence matched to the graduate role.",
      },
    },
    {
      "@type": "Question",
      name: "Should education come before experience on a graduate CV?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Education can come near the top if your degree, modules, dissertation or academic projects are your strongest evidence. Put relevant internships, placements or sector work first if they prove the role fit more directly.",
      },
    },
    {
      "@type": "Question",
      name: "How long should a graduate CV be?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Most graduate CVs should be one or two pages. Keep the CV concise, focus on evidence for the role and remove old or unrelated detail if it does not help the application.",
      },
    },
  ],
};

const recruiterChecks = [
  {
    title: "Role fit",
    body:
      "Make the target role obvious: analyst, marketing assistant, software graduate, finance trainee, operations coordinator or another clear direction.",
    icon: Briefcase,
  },
  {
    title: "Evidence beyond the degree",
    body:
      "Use placements, internships, projects, societies, volunteering and part-time work to prove behaviour, judgement and delivery.",
    icon: ClipboardCheck,
  },
  {
    title: "Tools and skills",
    body:
      "Name useful tools and methods: Excel, SQL, Python, Figma, CRM, research, presentations, data analysis or lab techniques where relevant.",
    icon: Laptop,
  },
  {
    title: "Commercial awareness",
    body:
      "Show you understand the employer's sector, customers, constraints and why your evidence matters for the role.",
    icon: Lightbulb,
  },
];

const structure = [
  [
    "Header",
    "Name, city, phone, email, LinkedIn or portfolio. Avoid date of birth, photo, nationality and long address blocks.",
  ],
  [
    "Profile",
    "Three to four lines naming your degree, target role, strongest evidence and the value you bring as an early-career candidate.",
  ],
  [
    "Education",
    "Include degree, university, dates, grade or expected grade, relevant modules, dissertation, projects and academic achievements.",
  ],
  [
    "Experience",
    "Add internships, placements, part-time jobs, volunteering, societies and projects. Translate each into role-relevant evidence.",
  ],
  [
    "Skills",
    "List concrete skills from the advert: tools, languages, analysis, writing, stakeholder communication, research, organisation or technical methods.",
  ],
];

const bulletExamples = [
  {
    setting: "Graduate scheme",
    bullets: [
      "Completed a final-year group project analysing customer retention data and presented recommendations to an academic panel.",
      "Balanced coursework, part-time work and society responsibilities, building evidence of organisation and deadline management.",
    ],
  },
  {
    setting: "Internship or placement",
    bullets: [
      "Mapped an onboarding process, interviewed team members and identified handover issues that slowed customer response times.",
      "Prepared weekly reporting slides using Excel data, summarising trends clearly for a non-technical operations audience.",
    ],
  },
  {
    setting: "Part-time work",
    bullets: [
      "Handled customer queries, stock checks and payment tasks accurately while working 12 to 16 hours per week during term time.",
      "Trained new starters on daily routines, product locations and service standards during busy trading periods.",
    ],
  },
  {
    setting: "No internship",
    bullets: [
      "Built a portfolio project using public data to compare sector trends, document assumptions and explain findings in a short report.",
      "Led a society event team, coordinating venue booking, promotion, budgeting and volunteer rotas for 80 attendees.",
    ],
  },
];

const mistakes = [
  "Relying on the degree title alone instead of showing evidence.",
  "Using the same CV for graduate schemes, SMEs, internships and entry-level jobs.",
  "Listing modules without explaining which skills or methods they prove.",
  "Hiding part-time work when it shows reliability, customer contact or responsibility.",
  "Using AI-polished wording that sounds impressive but does not match real experience.",
];

const sourceNotes = [
  [
    "Prospects CV guidance",
    "Prospects recommends CVs are usually no longer than two A4 pages, with relevant education, work experience, skills and tailored evidence.",
    "https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/how-to-write-a-cv/",
  ],
  [
    "National Careers Service",
    "UK CV guidance covers contact details, profile, education, work history, skills and references, with recent history first where relevant.",
    "https://nationalcareers.service.gov.uk/careers-advice/cv-sections",
  ],
  [
    "Graduate Outcomes",
    "HESA's Graduate Outcomes survey contacts graduates around 15 months after qualification to understand employment and further study outcomes.",
    "https://www.hesa.ac.uk/innovation/outcomes",
  ],
  [
    "Graduate job market",
    "Recent reporting on ISE and Indeed data shows graduate applications are highly competitive, making tailored evidence more important.",
    "https://www.theguardian.com/money/2025/jun/25/uk-university-graduates-toughest-job-market-rise-of-ai",
  ],
];

const relatedLinks = [
  ["Student CV template", "/student-cv-template"],
  ["CV no experience UK", "/cv-no-experience-uk"],
  ["ATS CV template UK", "/ats-cv-template-uk"],
  ["CV personal statement UK", "/cv-personal-statement-uk"],
  ["No-subscription CV builder", "/cv-builder-no-subscription-uk"],
];

export default function GraduateCvTemplateUkPage() {
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
              Graduate CV template UK
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              Build a graduate CV that proves more than your degree title.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              Start with an editable graduate CV template for UK schemes,
              internships and entry-level roles. The draft helps you turn
              modules, projects, placements, part-time work and societies into
              evidence employers can shortlist.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={editorHref}>Use graduate CV template</ButtonLink>
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
                  Graduate Business Analyst CV
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
                <CvDocument cv={graduateCv} compactPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Graduate recruiter scan</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            A strong graduate CV answers the evidence question fast.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            Employers already know you studied. They need to see what you can
            do with that learning, how you work with people and whether your
            evidence matches the role.
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
              Put the strongest proof first, even if it is not a full-time job.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Graduate CVs work best when they connect education, projects,
              internships and part-time work to the employer's criteria. The
              order should reflect your strongest evidence.
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
            Turn student experience into job evidence.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            A graduate CV does not need inflated language. It needs clear
            examples of analysis, communication, responsibility, technical
            tools and delivery.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {bulletExamples.map((example) => (
              <article key={example.setting} className="rounded-xl border border-line bg-white p-6">
                <ClipboardCheck className="h-7 w-7 text-gold" />
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
            <SectionLabel>Schemes, SMEs and internships</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Tune the CV to the route you are applying for.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              A graduate scheme may screen for competencies, values and online
              assessment fit. An SME may care more about immediate tools,
              initiative and practical delivery. Your CV should make the match
              obvious without becoming generic.
            </p>
            <div className="mt-8 rounded-xl border border-line bg-white p-6">
              <h3 className="font-display text-2xl font-semibold text-navy">
                Before you apply, check the advert for:
              </h3>
              <ul className="mt-5 space-y-4">
                {[
                  "Degree subject, grade, UCAS points or module requirements",
                  "Competencies such as analysis, teamwork, leadership or customer focus",
                  "Tools, languages, systems, portfolios or technical tests",
                  "Assessment centre, video interview, AI policy or ATS instructions",
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
              Built from current UK graduate and CV guidance.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Last checked 17 June 2026. This page uses Prospects CV guidance,
              National Careers Service CV guidance, HESA Graduate Outcomes
              context and recent reporting on the competitive UK graduate market.
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
        heading="Start with a graduate CV that already knows the market."
        body={`Use the editable graduate template, adapt it to the role, then pay ${site.price} only when you download the final PDF.`}
        secondaryHref="/ats-cv-template-uk"
        secondary="Check ATS format"
      />
    </>
  );
}
