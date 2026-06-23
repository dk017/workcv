import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  Cog,
  FileText,
  Ruler,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";

import { CvDocument } from "@/components/cv-editor";
import { ButtonLink, FinalCta, SectionLabel } from "@/components/marketing";
import { getRoleCvTemplate } from "@/lib/role-cv-templates";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Engineer CV Template UK - Editable Example",
  description:
    "Use an editable engineer CV template for UK engineering jobs. Build a clear CV around discipline fit, technical tools, projects, safety and measurable engineering evidence.",
  alternates: {
    canonical: "/cv-template-engineer-uk",
  },
  openGraph: {
    title: "Engineer CV Template UK - WorkCV",
    description:
      "Start with an editable UK engineer CV example and tailor it to mechanical, civil, electrical or manufacturing roles.",
    url: "/cv-template-engineer-uk",
  },
};

const editorHref = "/editor?template=classic&roleTemplate=engineer&new=1";
const engineerCv = getRoleCvTemplate("engineer");

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What should an engineer CV include in the UK?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "An engineer CV should include contact details, a focused profile, discipline-specific technical skills, recent-first engineering experience, projects, education, training, software tools and professional registration progress where relevant.",
      },
    },
    {
      "@type": "Question",
      name: "How do I tailor an engineering CV?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Match the engineering discipline, tools, standards, safety requirements and project evidence in the advert. A civil, mechanical, electrical and software-heavy engineering CV should not use identical evidence.",
      },
    },
    {
      "@type": "Question",
      name: "Should I include engineering projects on my CV?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes, include projects when they prove relevant technical decisions, tools, calculations, testing, documentation, stakeholder work or delivery outcomes. Keep project claims accurate and easy to explain.",
      },
    },
  ],
};

const recruiterChecks = [
  {
    title: "Discipline fit",
    body:
      "Make the engineering discipline clear: mechanical, civil, electrical, manufacturing, design, process, quality or another specialism.",
    icon: Cog,
  },
  {
    title: "Technical evidence",
    body:
      "Show tools, drawings, calculations, testing, analysis, documentation, standards or systems you have actually used.",
    icon: Ruler,
  },
  {
    title: "Safety and judgement",
    body:
      "Engineering recruiters look for safe decisions, risk awareness, traceability and practical judgement, not only software keywords.",
    icon: ShieldCheck,
  },
  {
    title: "Project outcomes",
    body:
      "Use accurate numbers where you have them: reliability, defects, cost, downtime, delivery dates, quality checks or design iterations.",
    icon: SearchCheck,
  },
];

const structure = [
  ["Header", "Name, location, phone, email, LinkedIn and portfolio only when useful. Keep the target engineering role obvious."],
  ["Profile", "Four focused lines: discipline, level, strongest technical evidence and the kind of engineering role you are applying for."],
  ["Technical skills", "Group tools and methods clearly: CAD, calculations, testing, quality tools, coding, standards, safety, documentation or project tools."],
  ["Experience", "Most recent first. Include employer, sector, products or projects, technical responsibilities, collaboration and outcomes."],
  ["Projects", "Use a project section if it proves relevant design, analysis, testing, build, site, maintenance or improvement evidence."],
  ["Education and registration", "Include degrees, apprenticeships, HNC/HND, training, licences and EngTech/IEng/CEng progress only when accurate."],
];

const bulletExamples = [
  {
    setting: "Mechanical or manufacturing",
    bullets: [
      "Updated assembly drawings after production feedback, checking tolerances, part numbers and manufacturing constraints before release.",
      "Analysed recurring defects with quality and production colleagues, documenting root cause, corrective action and follow-up checks.",
    ],
  },
  {
    setting: "Civil or site engineering",
    bullets: [
      "Supported site documentation, method statements, inspection records and progress updates while following health and safety requirements.",
      "Coordinated with subcontractors and supervisors to clarify drawings, record issues and keep technical queries moving.",
    ],
  },
  {
    setting: "Electrical or controls",
    bullets: [
      "Supported panel documentation, test records and fault finding under senior engineer review, keeping changes traceable.",
      "Worked with maintenance and production teams to investigate downtime patterns and propose practical reliability improvements.",
    ],
  },
  {
    setting: "Graduate engineer",
    bullets: [
      "Completed rotations across design, production, quality and maintenance, building practical understanding of engineering constraints.",
      "Presented final-year project results with assumptions, calculations, limitations and recommended next steps clearly documented.",
    ],
  },
];

const mistakes = [
  "Using a generic engineering CV without naming the discipline or sector.",
  "Listing software tools without showing what you used them to produce.",
  "Hiding projects, test work, drawings, standards, calculations or documentation.",
  "Claiming chartered, incorporated or technician status inaccurately.",
  "Using unsupported numbers or outcomes that cannot be explained in an interview.",
  "Forgetting safety, risk, quality, traceability and stakeholder communication.",
];

const sourceNotes = [
  [
    "National Careers Service — civil engineer",
    "The role profile covers planning, designing and managing construction projects, with routes through university, apprenticeships and work experience.",
    "https://nationalcareers.service.gov.uk/job-profiles/civil-engineer",
  ],
  [
    "National Careers Service — mechanical engineer",
    "The role profile covers designing, building and improving mechanical systems, with technical knowledge, problem solving and project work.",
    "https://nationalcareers.service.gov.uk/job-profiles/mechanical-engineer",
  ],
  [
    "Engineering Council — UK-SPEC",
    "UK-SPEC defines professional engineering competence and commitment for EngTech, IEng and CEng registration.",
    "https://www.engc.org.uk/standards-guidance/standards/uk-spec/",
  ],
];

const relatedLinks = [
  ["Professional CV builder", "/cv-builder-no-subscription-uk"],
  ["ATS CV template UK", "/ats-cv-template-uk"],
  ["Professional CV template", "/professional-cv-template-uk"],
  ["Customer service CV template", "/cv-template-customer-service-uk"],
  ["Editable UK CV templates", "/templates"],
];

export default function EngineerCvTemplateUkPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="quiet-grid bg-paper py-20 md:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              Engineer CV template UK
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              Build an engineer CV around proof, tools and safe decisions.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              Start with an editable UK engineer CV example, then tailor it to
              your discipline, tools, project evidence and registration path.
              Preview every page before paying for the PDF.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={editorHref}>Use engineer CV template</ButtonLink>
              <ButtonLink href="#example" variant="secondary">See example</ButtonLink>
            </div>
          </div>

          <div id="example" className="rounded-xl border border-line bg-white p-4 shadow-soft">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">Editable draft</p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-navy">Mechanical Engineer CV</h2>
              </div>
              <Link href={editorHref} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover">
                Edit <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="template-page-preview overflow-hidden rounded-lg border border-line bg-[#eef6f3] p-3">
              <div className="gallery-preview-document pointer-events-none mx-auto" style={{ width: 794 }}>
                <CvDocument cv={engineerCv} compactPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Recruiter scan</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            An engineering CV must prove the kind of engineer you are.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            “Engineer” is too broad by itself. The page, profile and first few
            bullets should quickly show the discipline, tools, project context
            and level of responsibility.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {recruiterChecks.map((item) => {
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

      <section className="bg-paper py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>Template structure</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Put discipline, tools and project evidence where recruiters can find them.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Use the order below as a practical base. Move education higher for
              graduate roles and project evidence higher when it is stronger
              than short work experience.
            </p>
            <div className="mt-8">
              <ButtonLink href={editorHref}>Start with this structure</ButtonLink>
            </div>
          </div>
          <div className="divide-y divide-line rounded-xl border border-line bg-white">
            {structure.map(([title, body]) => (
              <div key={title} className="grid gap-3 p-5 sm:grid-cols-[180px_1fr]">
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
            Adapt the evidence by discipline.
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {bulletExamples.map((example) => (
              <article key={example.setting} className="rounded-xl border border-line bg-white p-6">
                <ClipboardCheck className="h-7 w-7 text-gold" />
                <h3 className="mt-5 font-display text-2xl font-semibold text-navy">{example.setting}</h3>
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
            <SectionLabel>Tailoring checklist</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Match the advert before you download.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Before applying, check whether the employer needs design, site,
              maintenance, process, quality, controls, software-heavy or project
              delivery evidence. Then move the relevant proof forward.
            </p>
            <div className="mt-8 rounded-xl border border-line bg-white p-6">
              <h3 className="font-display text-2xl font-semibold text-navy">Check for:</h3>
              <ul className="mt-5 space-y-4">
                {[
                  "Discipline, sector, product, site or project type",
                  "Tools, standards, calculations, testing or documentation",
                  "Safety, risk, quality, compliance and traceability",
                  "Professional registration, licence or training expectations",
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
            <h2 className="mt-5 font-display text-2xl font-semibold text-navy">What to avoid</h2>
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
              Built from current UK engineering role guidance.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Last checked 23 June 2026. This page uses National Careers
              Service engineering role profiles and Engineering Council UK-SPEC
              professional registration guidance.
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

      <section className="bg-paper py-20">
        <div className="container-page">
          <SectionLabel>Related guidance</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {relatedLinks.map(([label, href]) => (
              <Link key={href} href={href} className="group rounded-xl border border-line bg-white p-5 text-sm font-bold text-navy transition hover:-translate-y-1 hover:border-navy">
                {label}
                <ArrowRight className="mt-4 h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FinalCta
        heading="Start with an engineer CV that shows real technical evidence."
        body={`Use the editable engineer template, tailor it to the advert, then pay ${site.price} only when you download the final PDF.`}
        primaryHref={editorHref}
        primary="Use engineer CV template"
        secondaryHref="/ats-cv-template-uk"
        secondary="Check ATS format"
      />
    </>
  );
}
