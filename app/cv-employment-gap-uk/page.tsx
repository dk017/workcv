import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarRange,
  Check,
  ClipboardCheck,
  Eye,
  FileText,
  Shield,
} from "lucide-react";

import { ButtonLink, FinalCta, SectionLabel } from "@/components/marketing";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "CV Employment Gap UK - How to Explain Gaps",
  description:
    "Worried about a gap in your CV? Learn how to explain employment gaps in a UK CV with clear wording examples and a no-subscription CV builder.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I explain an employment gap on a UK CV?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Explain the gap briefly and honestly if the dates need context, then move back to relevant skills, recent activity and evidence for the role. A short neutral line is usually better than a long personal explanation.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to explain every short gap?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "No. Short gaps of a few weeks or months often do not need a separate explanation on the CV. Focus on gaps that make the timeline confusing or that an employer is likely to ask about.",
      },
    },
    {
      "@type": "Question",
      name: "Should I put health or family details on my CV?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "You can keep the reason brief and neutral. You do not normally need to include private medical or family details on a CV unless you choose to share them or need adjustments later in recruitment.",
      },
    },
  ],
};

const decisionCards = [
  {
    title: "Leave it alone",
    body:
      "A short gap between jobs may not need a line at all, especially if your month-and-year dates already make the timeline easy to follow.",
    icon: Eye,
  },
  {
    title: "Add one neutral line",
    body:
      "Use this when a longer gap would otherwise raise questions. Keep it factual: career break, study, caring, redundancy, travel or health recovery.",
    icon: CalendarRange,
  },
  {
    title: "Move evidence above dates",
    body:
      "If the gap is long, put profile, key skills and recent activity before work history so the recruiter sees current relevance first.",
    icon: ClipboardCheck,
  },
];

const gapExamples = [
  [
    "Redundancy",
    "Career break following redundancy, 2025-2026. Used the period for job search, sector research and online learning; now targeting administration roles.",
  ],
  [
    "Caring responsibilities",
    "Career break for family caring responsibilities, 2023-2026. Now ready to return to paid work and applying for customer support roles.",
  ],
  [
    "Health recovery",
    "Career break for health reasons, 2024-2026. Now ready to return to work and applying for part-time roles aligned with recent training.",
  ],
  [
    "Study or retraining",
    "Study break, 2025-2026. Completed online bookkeeping training and refreshed Excel skills while preparing for finance assistant roles.",
  ],
  [
    "Travel",
    "Planned travel break, 2025-2026. Now returned to the UK and available for full-time hospitality management roles.",
  ],
  [
    "Parenting",
    "Career break for childcare, 2021-2026. Now available for school-hours administration roles with recent Microsoft 365 refresher training.",
  ],
];

const topHalf = [
  "A specific profile naming the role you want",
  "Four to six skills copied from the job advert and backed by evidence",
  "Recent course, certificate, volunteering or project work",
  "A concise career-break line if the dates need context",
  "Previous achievements rewritten for the role you want now",
];

const mistakes = [
  "Writing a long personal explanation before the recruiter sees your skills.",
  "Hiding dates so aggressively that the CV looks harder to trust.",
  "Using vague wording such as 'personal reasons' without any readiness signal.",
  "Putting recent learning below old education where it is easy to miss.",
  "Apologising for the gap instead of showing what you can do now.",
];

const relatedLinks = [
  ["Redundancy pay calculator", "/tools/redundancy-pay-calculator"],
  ["Return to work CV UK", "/return-to-work-cv-uk"],
  ["Career change CV UK", "/career-change-cv-uk"],
  ["CV with no experience UK", "/cv-no-experience-uk"],
  ["Pricing", "/pricing"],
];

export default function CvEmploymentGapUkPage() {
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
              CV employment gap UK
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              Explain the gap once. Then prove you are ready.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              Employment gaps can feel bigger to you than they look to a
              recruiter. A strong UK CV gives enough context to make the timeline
              clear, then puts the focus back on skills, evidence and fit.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/editor">Build my CV with a gap</ButtonLink>
              <ButtonLink href="/return-to-work-cv-uk" variant="secondary">
                Return-to-work guide
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-white p-6 shadow-soft">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
              Quick rule
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-navy">
              Do not make the gap the headline of your CV.
            </h2>
            <p className="mt-5 text-sm leading-7 text-muted">
              The gap needs context, not a spotlight. Put the explanation where
              it belongs in the timeline and use the top half of the CV to show
              why the application is worth reading.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Decision guide</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Should you mention the employment gap?
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            National Careers Service guidance defines employment gaps as times
            when you were not employed and gives advice on explaining them when
            applying for jobs. The practical question is how much context the CV
            needs for the reader to trust the timeline.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {decisionCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="rounded-xl border border-line bg-white p-6">
                  <Icon className="h-7 w-7 text-gold" />
                  <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
                    {card.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted">{card.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <SectionLabel>Wording examples</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Short examples for common CV gaps.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              These are deliberately brief. Edit the wording so it is accurate
              for your circumstances, then follow it with recent, role-relevant
              evidence.
            </p>
          </div>

          <div className="divide-y divide-line rounded-xl border border-line bg-white">
            {gapExamples.map(([reason, wording]) => (
              <div key={reason} className="grid gap-3 p-5 sm:grid-cols-[170px_1fr]">
                <h3 className="font-display text-xl font-semibold text-navy">{reason}</h3>
                <p className="text-sm leading-7 text-muted">{wording}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionLabel>CV order</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              What to put above your work history.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              If your dates are the weakest part of the CV, do not open with
              them. Open with relevance. Then keep the work history honest and
              easy to scan.
            </p>
            <div className="mt-8 grid gap-3">
              {topHalf.map((item) => (
                <div key={item} className="flex gap-3 rounded-xl border border-line bg-white p-4 text-sm font-bold text-navy">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-xl border border-line bg-white p-6">
            <Shield className="h-7 w-7 text-gold" />
            <h2 className="mt-5 font-display text-2xl font-semibold text-navy">
              Privacy and fairness
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              UK recruitment guidance from Acas and GOV.UK says employers must
              follow discrimination law when advertising, interviewing and
              deciding who to hire. On the CV, keep private health, family or
              pregnancy details brief unless you choose to share them.
            </p>
          </aside>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1fr]">
          <div>
            <SectionLabel>What to avoid</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Common mistakes that make a gap feel bigger.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Most weak gap explanations are either too vague or too detailed.
              The better middle ground is clear, short and forward-looking.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-white p-6">
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
      </section>

      <section className="bg-surface py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionLabel>Research checked</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Based on official UK careers and recruitment guidance.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Last checked 13 June 2026. This guidance uses National Careers
              Service advice on employment gaps and CV sections, Acas guidance
              on recruitment discrimination law, and GOV.UK recruitment
              discrimination guidance.
            </p>
          </div>

          <div className="grid gap-3 rounded-xl border border-line bg-white p-6 text-sm font-bold text-navy">
            <a
              href="https://nationalcareers.service.gov.uk/careers-advice/explain-gaps-in-work-history/"
              rel="noreferrer"
              target="_blank"
            >
              National Careers Service employment gaps
            </a>
            <a
              href="https://nationalcareers.service.gov.uk/careers-advice/cv-sections"
              rel="noreferrer"
              target="_blank"
            >
              National Careers Service CV sections
            </a>
            <a
              href="https://www.acas.org.uk/recruitment/follow-discrimination-law"
              rel="noreferrer"
              target="_blank"
            >
              Acas recruitment discrimination guidance
            </a>
            <a
              href="https://www.gov.uk/employer-preventing-discrimination/recruitment"
              rel="noreferrer"
              target="_blank"
            >
              GOV.UK recruitment discrimination guidance
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
        heading="Build a CV that explains the gap and moves on."
        body={`WorkCV helps you structure the timeline, highlight current evidence and pay ${site.price} only when you download.`}
        secondaryHref="/return-to-work-cv-uk"
        secondary="Return-to-work CV guide"
      />
    </>
  );
}
