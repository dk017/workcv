import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CalendarCheck,
  Check,
  FileText,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

import { ButtonLink, FinalCta, SectionLabel } from "@/components/marketing";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Return to Work CV UK - Career Break Template",
  description:
    "Returning to work after a career break? Build a UK CV that explains the gap clearly, shows current skills, and helps you apply with confidence.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I write a CV after a career break in the UK?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Use a clear UK CV structure: profile, key skills, recent training or volunteering, work history and education. Explain the break briefly if it helps the employer understand your timeline, then move quickly to your current readiness and relevant evidence.",
      },
    },
    {
      "@type": "Question",
      name: "Should I mention a career break on my CV?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "If the break creates an obvious gap in your dates, mention it briefly and neutrally. You do not need to give private medical or family details on the CV.",
      },
    },
    {
      "@type": "Question",
      name: "What skills should I show when returning to work?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Prioritise skills from the job advert, then back them with evidence from previous work, volunteering, caring responsibilities, courses, projects, digital tools or recent practice.",
      },
    },
  ],
};

const returnerProfiles = [
  {
    title: "Returning after childcare",
    line:
      "Experienced administrator returning to work after a planned childcare career break, with strong organisation, diary coordination, customer communication and record-keeping skills.",
  },
  {
    title: "Returning after caring responsibilities",
    line:
      "Reliable customer service professional returning to paid work after a family caring break, bringing calm communication, problem solving, scheduling and confidential information handling.",
  },
  {
    title: "Returning after health recovery",
    line:
      "Detail-focused office assistant returning to work after a health-related career break, now ready for part-time administrative roles with recent Excel refresher training and strong written communication.",
  },
];

const cvStructure = [
  {
    title: "Profile",
    body:
      "Use four lines to say what role you are applying for, what experience you bring, and that you are ready to return. Keep the reason for the break brief.",
    icon: Briefcase,
  },
  {
    title: "Key skills",
    body:
      "Pull skills from the job advert. For returners, this section helps employers see relevance before they reach older dates.",
    icon: ShieldCheck,
  },
  {
    title: "Recent activity",
    body:
      "Show courses, certificates, volunteering, freelancing, community work, portfolio projects or digital refreshers completed during or after the break.",
    icon: GraduationCap,
  },
  {
    title: "Work history",
    body:
      "Keep previous roles clear and honest. Use achievement-led bullets rather than long lists of every old responsibility.",
    icon: CalendarCheck,
  },
];

const breakWording = [
  [
    "Parent returning after childcare",
    "Career break for childcare, 2021-2025. Now available for office administration roles and recently refreshed Excel and customer-record skills.",
  ],
  [
    "Carer returning to paid work",
    "Career break for family caring responsibilities, 2022-2026. Maintained strong organisation, scheduling and communication skills and now ready to return to customer support work.",
  ],
  [
    "Health-related break",
    "Career break for health reasons, 2023-2025. Now ready to return to work and applying for part-time administrative roles aligned with recent training.",
  ],
  [
    "Redundancy or long job search",
    "Career break following redundancy, 2024-2026. Used the period for job search, online learning and sector research; now targeting operations assistant roles.",
  ],
];

const evidenceIdeas = [
  "Recent course, certificate, webinar, bootcamp or online learning",
  "Volunteering, school/community work, committee work or charity support",
  "Digital tools refreshed: Excel, Google Workspace, Teams, CRM, booking systems",
  "Previous achievements that still match the target role",
  "Transferable skills from caring, parenting or household coordination",
  "Flexible-work readiness: hours, commute, hybrid setup or part-time preference",
];

const relatedLinks = [
  ["Career change CV UK", "/career-change-cv-uk"],
  ["CV with no experience UK", "/cv-with-no-experience"],
  ["Student CV template", "/student-cv-template"],
  ["No-subscription CV builder", "/cv-builder-no-subscription-uk"],
  ["Pricing", "/pricing"],
];

export default function ReturnToWorkCvUkPage() {
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
              Return to work CV UK
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              Make the break clear. Make your value clearer.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              A return-to-work CV should not apologise for time away. It should
              explain the timeline calmly, show current skills, and help the
              recruiter see why you are ready now.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/editor">Build my return-to-work CV</ButtonLink>
              <ButtonLink href="/career-change-cv-uk" variant="secondary">
                Career change guide
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-white p-6 shadow-soft">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
              What the CV must prove
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-navy">
              You are not your gap. You are the evidence around it.
            </h2>
            <div className="mt-6 space-y-4">
              {[
                "The break is explained briefly and neutrally",
                "The target role is obvious near the top",
                "Recent learning or activity is visible",
                "Older experience is translated into current value",
                "Private details are not overshared",
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
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionLabel>Positioning</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              The strongest returner CV is calm, direct and current.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              National Careers Service guidance treats employment gaps as normal
              parts of a work history that may need explaining. The key is not to
              over-explain the break. Use the top half of the CV to prove
              readiness for the role you want now.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {cvStructure.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.title} className="rounded-xl border border-line bg-white p-6">
                  <Icon className="h-7 w-7 text-gold" />
                  <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
                    {section.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted">{section.body}</p>
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
            Return-to-work CV profile examples.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            Use these as structure, not as copy to paste. The best version will
            match the role, the hours, the sector and the evidence you can prove.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {returnerProfiles.map((profile) => (
              <article key={profile.title} className="rounded-xl border border-line bg-white p-6">
                <FileText className="h-7 w-7 text-gold" />
                <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
                  {profile.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-muted">{profile.line}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>Career break wording</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              How to explain the gap without making it the whole CV.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Put a short career-break line in the work history if the dates need
              context. You do not need to include private medical, family or
              pregnancy details. Keep it factual, then move back to skills,
              training and availability.
            </p>
          </div>

          <div className="divide-y divide-line rounded-xl border border-line bg-white">
            {breakWording.map(([label, copy]) => (
              <div key={label} className="grid gap-3 p-5 sm:grid-cols-[210px_1fr]">
                <h3 className="font-display text-xl font-semibold text-navy">{label}</h3>
                <p className="text-sm leading-7 text-muted">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionLabel>Evidence</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Add proof that your skills are still active.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              GOV.UK Skills for Careers and the National Careers Service both
              point adults towards skills, training and career guidance. For a
              returner CV, recent activity is useful because it reassures an
              employer that you are not relying only on old job titles.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {evidenceIdeas.map((idea) => (
                <div key={idea} className="flex gap-3 rounded-xl border border-line bg-white p-4 text-sm font-bold text-navy">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  {idea}
                </div>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-xl border border-line bg-white p-6">
            <h2 className="font-display text-2xl font-semibold text-navy">
              Research checked
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Last checked 13 June 2026. This page uses official UK guidance
              from National Careers Service on employment gaps and skills,
              GOV.UK guidance for employers supporting returners, GOV.UK Skills
              for Careers, and Acas/GOV.UK recruitment discrimination guidance.
            </p>
            <div className="mt-5 grid gap-3 text-sm font-bold text-navy">
              <a
                href="https://nationalcareers.service.gov.uk/careers-advice/explain-gaps-in-work-history/"
                rel="noreferrer"
                target="_blank"
              >
                National Careers Service employment gaps
              </a>
              <a
                href="https://nationalcareers.service.gov.uk/careers-advice/identifying-skills-and-upskilling/"
                rel="noreferrer"
                target="_blank"
              >
                National Careers Service skills guidance
              </a>
              <a
                href="https://www.gov.uk/government/publications/employer-guidance-helping-people-return-to-work/employer-guidance-helping-people-return-to-work"
                rel="noreferrer"
                target="_blank"
              >
                GOV.UK employer returner guidance
              </a>
              <a
                href="https://www.acas.org.uk/recruitment/follow-discrimination-law"
                rel="noreferrer"
                target="_blank"
              >
                Acas recruitment discrimination guidance
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
        heading="Build a return-to-work CV that feels current."
        body={`Start with your experience, add recent evidence, and pay ${site.price} only when you download the final PDF.`}
        secondaryHref="/cv-builder-no-subscription-uk"
        secondary="How pricing works"
      />
    </>
  );
}
