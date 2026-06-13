import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, FileText, Search, Shuffle, Target } from "lucide-react";

import { ButtonLink, FinalCta, SectionLabel } from "@/components/marketing";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Career Change CV UK - Template and Examples",
  description:
    "Writing a UK CV for a career change? Learn how to position transferable skills, explain your move, and build a focused CV without a subscription.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I write a CV for a career change in the UK?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Start with the target role, write a short profile that connects your previous experience to the new job, then prioritise transferable achievements, relevant training and evidence from the job advert.",
      },
    },
    {
      "@type": "Question",
      name: "Should I hide my old career on a career change CV?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "No. Keep your work history honest, but reframe older roles around skills and outcomes that matter for the new role instead of listing every unrelated task.",
      },
    },
    {
      "@type": "Question",
      name: "Is a skills-based CV better for changing career?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Sometimes. A hybrid CV usually works best: a short skills summary near the top, followed by a clear reverse-chronological work history so recruiters can still understand your timeline.",
      },
    },
  ],
};

const bridgeSteps = [
  {
    title: "Name the role you want",
    body:
      "Do not make the recruiter guess. Use the target role in your profile and make the first screen of the CV point towards that next job.",
    icon: Target,
  },
  {
    title: "Map evidence from the advert",
    body:
      "National Careers Service guidance says to use the job description, essential criteria and company details when tailoring your CV.",
    icon: Search,
  },
  {
    title: "Translate old duties into new value",
    body:
      "Replace task lists with outcomes: customers helped, processes improved, people trained, problems solved, systems used, targets met.",
    icon: Shuffle,
  },
];

const cvSections = [
  [
    "Profile",
    "Three or four lines that explain your direction, relevant strengths, and why your previous experience is useful in the new role.",
  ],
  [
    "Transferable skills",
    "Six to eight skills pulled from the job advert, each backed elsewhere in the CV by a role, result, course, project, or responsibility.",
  ],
  [
    "Selected achievements",
    "Optional, but useful if your old job title does not obviously match the new field. Use measurable examples where possible.",
  ],
  [
    "Work history",
    "Keep dates and employers clear. Reword bullets so they show communication, planning, analysis, service, leadership, or technical evidence.",
  ],
  [
    "Training and projects",
    "Add recent courses, certificates, portfolio projects, volunteering, shadowing, or self-directed learning that proves the move is active.",
  ],
];

const examples = [
  {
    from: "Retail supervisor to office administrator",
    profile:
      "Organised retail supervisor moving into office administration, with five years of experience coordinating rotas, handling customer records, resolving queries and keeping daily operations on track.",
    bullets: [
      "Managed weekly schedules for a 12-person team while balancing holiday cover and peak trading periods.",
      "Handled customer issues, refunds and order queries with accurate written records.",
      "Used Excel trackers to monitor stock, deliveries and daily sales figures.",
    ],
  },
  {
    from: "Hospitality to customer support",
    profile:
      "Customer-focused hospitality professional retraining for customer support roles, with strong experience handling fast-paced queries, calming difficult situations and working to service standards.",
    bullets: [
      "Resolved customer complaints calmly during busy service periods while protecting repeat business.",
      "Trained new team members on booking systems, service standards and escalation steps.",
      "Handled payments, booking changes and written customer messages with attention to detail.",
    ],
  },
  {
    from: "Teaching assistant to HR assistant",
    profile:
      "Teaching assistant moving into HR support, bringing experience with confidential records, safeguarding processes, staff communication and structured administrative work.",
    bullets: [
      "Maintained sensitive pupil records and followed strict confidentiality procedures.",
      "Coordinated communication between teachers, parents and external support teams.",
      "Prepared reports, attendance notes and classroom resources to deadline.",
    ],
  },
];

const mistakes = [
  "Opening with a vague profile such as 'looking for a new challenge'.",
  "Listing every old responsibility instead of selecting evidence for the new role.",
  "Putting training at the bottom when it is the main proof of your career change.",
  "Using a pure skills CV that hides dates and makes the timeline look unclear.",
  "Apologising for the move instead of explaining the practical link.",
];

const relatedLinks = [
  ["CV with no experience UK", "/cv-with-no-experience"],
  ["Student CV template", "/student-cv-template"],
  ["School leaver CV example", "/school-leaver-cv-example"],
  ["No-subscription CV builder", "/cv-builder-no-subscription-uk"],
  ["Pricing", "/pricing"],
];

export default function CareerChangeCvUkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="quiet-grid bg-paper py-20 md:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              Career change CV UK
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              Change career without making your CV look junior.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              A career change CV needs to bridge what you have done with what you
              want next. WorkCV helps you turn previous roles into relevant UK CV
              evidence, then download for {site.price} when ready.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/editor">Build my career change CV</ButtonLink>
              <ButtonLink href="/pricing" variant="secondary">
                See pricing
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-white p-6 shadow-soft">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
              The page-one test
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-navy">
              Can a recruiter see the bridge in 20 seconds?
            </h2>
            <div className="mt-6 space-y-4">
              {[
                "Target role is clear near the top",
                "Profile explains the move without over-explaining",
                "Transferable achievements are specific",
                "Recent training or projects are visible",
                "Work history is honest and easy to scan",
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
          <SectionLabel>Strategy</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Your CV is not a confession. It is a relevance document.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            The mistake many career changers make is trying to explain every
            detail of the past. A stronger CV starts with the target role, then
            selects only the evidence that helps the recruiter believe the move.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {bridgeSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="rounded-xl border border-line bg-white p-6">
                  <Icon className="h-7 w-7 text-gold" />
                  <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted">{step.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>CV structure</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Best UK CV structure for a career change.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              A hybrid CV usually works better than a fully skills-based CV. You
              can lift relevant skills near the top, while keeping dates and
              employers clear enough for recruiters and ATS systems.
            </p>
          </div>

          <div className="divide-y divide-line rounded-xl border border-line bg-white">
            {cvSections.map(([title, body]) => (
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
          <SectionLabel>Examples</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Career change CV profile and bullet examples.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            These examples are not scripts to copy word-for-word. Use them to see
            how old experience can be translated into new-role evidence.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {examples.map((example) => (
              <article key={example.from} className="rounded-xl border border-line bg-white p-6">
                <FileText className="h-7 w-7 text-gold" />
                <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
                  {example.from}
                </h3>
                <p className="mt-4 text-sm leading-7 text-muted">{example.profile}</p>
                <ul className="mt-5 space-y-3">
                  {example.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2 text-sm leading-6 text-ink">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
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
            <SectionLabel>What to avoid</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Do not make the career change sound like a weakness.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Recruiters do not need a long backstory. They need a reason to
              believe you understand the new role and already have useful evidence.
            </p>
            <div className="mt-8 rounded-xl border border-line bg-white p-6">
              <ul className="space-y-4">
                {mistakes.map((mistake) => (
                  <li key={mistake} className="flex gap-3 text-sm font-bold text-navy">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="h-fit rounded-xl border border-line bg-white p-6">
            <h2 className="font-display text-2xl font-semibold text-navy">
              Research checked
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Last checked 13 June 2026. National Careers Service guidance says
              to tailor your CV to the job advert, include new skills and
              achievements, and keep each section up to date. GOV.UK Skills for
              Careers points career changers towards skills assessments, courses
              and career ideas.
            </p>
            <div className="mt-5 grid gap-3 text-sm font-bold text-navy">
              <a
                href="https://nationalcareers.service.gov.uk/careers-advice/cv-sections"
                rel="noreferrer"
                target="_blank"
              >
                National Careers Service CV guidance
              </a>
              <a
                href="https://www.skillsforcareers.education.gov.uk/pages/common/career-ideas"
                rel="noreferrer"
                target="_blank"
              >
                GOV.UK Skills for Careers
              </a>
            </div>
          </aside>
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
        heading="Build a CV that makes the career change make sense."
        body={`Log in with an email code, save your CV, and pay ${site.price} only when you download the final PDF.`}
        secondaryHref="/cv-builder-no-subscription-uk"
        secondary="How pricing works"
      />
    </>
  );
}
