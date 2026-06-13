import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardList,
  FileText,
  PencilLine,
  Search,
  Sparkles,
  Target,
} from "lucide-react";

import { ButtonLink, FinalCta, SectionLabel } from "@/components/marketing";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "CV Personal Statement UK - Examples and Template",
  description:
    "Write a stronger UK CV personal statement with a simple formula, examples for common situations, and a no-subscription CV builder.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a CV personal statement in the UK?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "A CV personal statement, also called a CV profile or introduction, is a short opening section near the top of your CV. It summarises who you are, the role you want, relevant strengths and evidence that makes the recruiter keep reading.",
      },
    },
    {
      "@type": "Question",
      name: "How long should a UK CV personal statement be?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Keep it short. Three to five lines is usually enough for a UK CV. It should be easy to scan and should not repeat your whole work history.",
      },
    },
    {
      "@type": "Question",
      name: "Should I write my CV personal statement in first person?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Either first person without 'I' or neutral third-person wording can work. The important point is clarity: avoid vague claims and match the statement to the job advert.",
      },
    },
  ],
};

const formulaSteps = [
  {
    title: "Target",
    body:
      "Name the role, sector or type of work you want. A statement that could fit any job rarely helps a recruiter.",
    icon: Target,
  },
  {
    title: "Evidence",
    body:
      "Add one or two proof points: years of experience, sectors, systems, qualifications, outcomes, responsibilities or recent training.",
    icon: ClipboardList,
  },
  {
    title: "Fit",
    body:
      "Close with the value you bring to that role: service, accuracy, leadership, care, speed, organisation, reliability or technical skill.",
    icon: Search,
  },
];

const examples = [
  {
    title: "Career changer",
    statement:
      "Organised retail supervisor moving into office administration, with five years of experience coordinating rotas, handling customer records and resolving high-volume queries. Confident using Excel trackers, written communication and calm problem solving to keep daily operations running smoothly.",
  },
  {
    title: "Returning to work",
    statement:
      "Experienced customer service professional returning to paid work after a planned career break, bringing strong communication, scheduling and problem-solving skills. Recently refreshed Microsoft 365 knowledge and now seeking a part-time customer support role.",
  },
  {
    title: "No experience",
    statement:
      "Reliable school leaver looking for an entry-level retail role, with strong attendance, customer-facing volunteering experience and confidence handling busy environments. Keen to build practical experience and contribute to a supportive store team.",
  },
  {
    title: "Administration",
    statement:
      "Detail-focused administrator with experience managing inboxes, updating records, booking appointments and supporting customers by phone and email. Known for accuracy, clear communication and keeping routine office tasks moving to deadline.",
  },
  {
    title: "Warehouse and logistics",
    statement:
      "Practical warehouse operative with experience in picking, packing, stock checks and safe manual handling. Brings reliable attendance, attention to detail and confidence working to daily targets in fast-paced environments.",
  },
  {
    title: "Professional role",
    statement:
      "Commercially aware project coordinator with experience supporting cross-functional teams, tracking actions and preparing stakeholder updates. Strong organiser who turns moving parts into clear plans, deadlines and progress reporting.",
  },
];

const beforeAfter = [
  [
    "Too vague",
    "I am a hard-working person looking for a new challenge.",
    "Customer-focused retail assistant with two years of till, stock and complaint-handling experience, now seeking a full-time customer service role.",
  ],
  [
    "Too long",
    "I have worked in many different jobs over the years and have developed lots of useful skills that I believe would make me suitable for a wide range of roles.",
    "Adaptable team member with experience across hospitality and retail, bringing strong customer service, cash handling and shift coordination skills.",
  ],
  [
    "Too self-focused",
    "I want a role where I can learn, grow and develop my confidence.",
    "Entry-level office assistant with strong written communication, Excel basics and volunteering experience, ready to support accurate records and daily admin tasks.",
  ],
];

const checklist = [
  "Mentions the role or sector you are applying for",
  "Uses evidence instead of soft claims",
  "Includes keywords from the job advert naturally",
  "Fits in three to five lines on the page",
  "Does not repeat every job in your work history",
  "Sounds like a real person, not generic AI copy",
];

const relatedLinks = [
  ["Career change CV UK", "/career-change-cv-uk"],
  ["Return to work CV UK", "/return-to-work-cv-uk"],
  ["CV employment gap UK", "/cv-employment-gap-uk"],
  ["CV with no experience UK", "/cv-with-no-experience"],
  ["No-subscription CV builder", "/cv-builder-no-subscription-uk"],
];

export default function CvPersonalStatementUkPage() {
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
              CV personal statement UK
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              Write the first paragraph recruiters actually need.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              A UK CV personal statement should not be a life story. It should
              quickly show the role you want, the evidence you bring, and why the
              rest of the CV is worth reading.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/editor">Build my CV statement</ButtonLink>
              <ButtonLink href="/templates" variant="secondary">
                See templates
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-white p-6 shadow-soft">
            <Sparkles className="h-7 w-7 text-gold" />
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              The simple rule
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-navy">
              Specific beats impressive.
            </h2>
            <p className="mt-5 text-sm leading-7 text-muted">
              Recruiters do not need adjectives like passionate, dynamic or
              motivated unless the CV proves them. Use job-relevant facts, tools,
              settings and outcomes instead.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Formula</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Use a three-part statement: target, evidence, fit.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            National Careers Service guidance says a CV should include an
            introduction. Prospects describes a CV personal profile as a concise
            statement near the top that highlights relevant attributes,
            achievements, skills and career aims. Keep it tailored to the job.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {formulaSteps.map((step) => {
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
        <div className="container-page">
          <SectionLabel>Examples</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            UK CV personal statement examples.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            Do not copy these word-for-word. Use them to see the level of
            specificity and length that works, then rewrite them around the job
            advert and your real evidence.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {examples.map((example) => (
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
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>Before and after</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Replace vague claims with proof.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Most weak CV statements are not badly written. They are too broad.
              The fix is to add a target role and concrete evidence.
            </p>
          </div>

          <div className="divide-y divide-line rounded-xl border border-line bg-white">
            {beforeAfter.map(([label, weak, strong]) => (
              <div key={label} className="grid gap-4 p-5">
                <h3 className="font-display text-xl font-semibold text-navy">{label}</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <p className="rounded-lg border border-line bg-paper p-4 text-sm leading-7 text-muted">
                    {weak}
                  </p>
                  <p className="rounded-lg border border-line bg-white p-4 text-sm font-bold leading-7 text-navy">
                    {strong}
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
            <SectionLabel>Checklist</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Check your personal statement before downloading.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              The statement should earn its space at the top of the CV. If it
              does not add focus, shorten it or replace it with a stronger skills
              summary.
            </p>
            <div className="mt-8 grid gap-3">
              {checklist.map((item) => (
                <div key={item} className="flex gap-3 rounded-xl border border-line bg-white p-4 text-sm font-bold text-navy">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-xl border border-line bg-white p-6">
            <PencilLine className="h-7 w-7 text-gold" />
            <h2 className="mt-5 font-display text-2xl font-semibold text-navy">
              AI writing note
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              AI can help you edit and tighten the wording, but the statement
              still needs your real experience. Generic AI copy is easy to spot
              because it sounds polished while saying very little.
            </p>
          </aside>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionLabel>Research checked</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Based on current UK CV guidance.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Last checked 13 June 2026. This page uses National Careers Service
              guidance on CV introductions and Prospects guidance on CV personal
              profiles, including tailoring the statement to the opportunity and
              keeping it brief.
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
              href="https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/writing-a-personal-statement-for-your-cv/"
              rel="noreferrer"
              target="_blank"
            >
              Prospects CV personal statement guidance
            </a>
            <a
              href="https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/how-to-write-a-cv/"
              rel="noreferrer"
              target="_blank"
            >
              Prospects how to write a CV
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
        heading="Write the opening, then build the full CV around it."
        body={`Start with a guided UK CV structure and pay ${site.price} only when the final PDF is ready.`}
        secondaryHref="/pricing"
        secondary="See pricing"
      />
    </>
  );
}
