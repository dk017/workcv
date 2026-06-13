import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileText,
  KeyRound,
  Lock,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { ButtonLink, FinalCta, SectionLabel } from "@/components/marketing";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Right to Work CV UK - What to Include",
  description:
    "Should you mention right to work on a UK CV? Learn when to include it, what not to share, and how to keep your CV clear and safe.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Should I put right to work on my CV in the UK?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "You can mention your right to work briefly if it helps remove uncertainty, for example if you are applying from outside the UK or want to clarify that sponsorship is not required. You do not need to put private document details on your CV.",
      },
    },
    {
      "@type": "Question",
      name: "Should I put my share code on my CV?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "No. Do not put a right to work share code on a public CV. A share code should be given only when an employer needs to carry out the official check.",
      },
    },
    {
      "@type": "Question",
      name: "Where should right to work go on a CV?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "If you include it, keep it short near contact details or in an Additional information section. Use plain wording such as 'Right to work in the UK' or 'No visa sponsorship required' only if accurate.",
      },
    },
  ],
};

const includeRules = [
  {
    title: "Include it when it removes doubt",
    body:
      "Useful if you are applying internationally, have a non-UK education history, or the advert asks about sponsorship.",
    icon: UserCheck,
  },
  {
    title: "Keep it short",
    body:
      "One clear line is enough. The CV is not the place for passport numbers, share codes or long immigration explanations.",
    icon: FileText,
  },
  {
    title: "Be accurate",
    body:
      "Only state what is true now. If permission is time-limited or role-limited, do not imply unrestricted work rights.",
    icon: ShieldCheck,
  },
];

const wordingExamples = [
  [
    "British or Irish citizen",
    "Right to work in the UK.",
    "No need to add passport details or nationality unless it is relevant and you choose to.",
  ],
  [
    "No sponsorship needed",
    "Right to work in the UK. No visa sponsorship required.",
    "Use only if accurate. This can help where employers screen for sponsorship requirements.",
  ],
  [
    "Limited permission",
    "Right to work in the UK; details available for employer checks.",
    "Avoid oversharing dates or document numbers on the CV. Be ready to explain accurately during hiring.",
  ],
  [
    "Applying from overseas",
    "Eligible to work in the UK from [month/year], subject to employer right to work checks.",
    "Use cautious wording if your right to work starts later or depends on a process.",
  ],
];

const dontShare = [
  "Passport number",
  "National Insurance number",
  "Right to work share code",
  "BRP, eVisa or Home Office reference numbers",
  "Full immigration history",
  "Scans or photos of identity documents",
];

const relatedLinks = [
  ["ATS CV template UK", "/ats-cv-template-uk"],
  ["CV personal statement UK", "/cv-personal-statement-uk"],
  ["CV no experience UK", "/cv-no-experience-uk"],
  ["CV employment gap UK", "/cv-employment-gap-uk"],
  ["No-subscription CV builder", "/cv-builder-no-subscription-uk"],
];

export default function RightToWorkCvUkPage() {
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
              Right to work CV UK
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              Mention right to work only when it helps.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              A UK employer must check right to work before employment, but your
              CV should not expose private document details. Use a short, accurate
              line only when it removes uncertainty for the role.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/editor">Build my UK CV</ButtonLink>
              <ButtonLink href="/ats-cv-template-uk" variant="secondary">
                ATS-friendly format
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-white p-6 shadow-soft">
            <Lock className="h-7 w-7 text-gold" />
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              Safety rule
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-navy">
              Never put a share code on a public CV.
            </h2>
            <p className="mt-5 text-sm leading-7 text-muted">
              A share code is for an employer check, not for a PDF that may be
              uploaded to job boards, recruiters, email chains or databases.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>When to include it</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Right to work is a hiring check, not a CV headline.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            GOV.UK says employers must check that a job applicant is allowed to
            work in the UK before employing them. The CV does not need to perform
            that check. It only needs to reduce avoidable uncertainty where right
            to work or sponsorship could affect screening.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {includeRules.map((rule) => {
              const Icon = rule.icon;
              return (
                <div key={rule.title} className="rounded-xl border border-line bg-white p-6">
                  <Icon className="h-7 w-7 text-gold" />
                  <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
                    {rule.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted">{rule.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.86fr_1.14fr]">
          <div>
            <SectionLabel>Wording examples</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Short CV lines for common situations.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              These are not legal advice. Use wording only if it is accurate for
              your current position, and check official guidance if you are not
              sure what you can prove.
            </p>
          </div>

          <div className="divide-y divide-line rounded-xl border border-line bg-white">
            {wordingExamples.map(([label, wording, note]) => (
              <div key={label} className="grid gap-3 p-5 sm:grid-cols-[190px_1fr]">
                <h3 className="font-display text-xl font-semibold text-navy">{label}</h3>
                <div>
                  <p className="text-sm font-bold leading-7 text-navy">{wording}</p>
                  <p className="mt-2 text-sm leading-7 text-muted">{note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionLabel>Do not include</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Keep identity and immigration details off the CV.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              GOV.UK provides official services for proving and checking right
              to work. Your CV should not become an identity document. Keep the
              PDF focused on suitability for the role.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {dontShare.map((item) => (
                <div key={item} className="flex gap-3 rounded-xl border border-line bg-white p-4 text-sm font-bold text-navy">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-xl border border-line bg-white p-6">
            <KeyRound className="h-7 w-7 text-gold" />
            <h2 className="mt-5 font-display text-2xl font-semibold text-navy">
              Share codes expire
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Citizens Advice says right to work share codes are valid for 90
              days. That is another reason not to place one on a static CV file.
            </p>
          </aside>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionLabel>Research checked</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Based on official UK right to work guidance.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Last checked 13 June 2026. This page uses GOV.UK guidance on
              employer right to work checks, GOV.UK share code checking, GOV.UK
              proof of right to work, and Citizens Advice guidance on proving
              your right to work. It is CV-writing guidance, not immigration
              legal advice.
            </p>
          </div>

          <div className="grid gap-3 rounded-xl border border-line bg-white p-6 text-sm font-bold text-navy">
            <a
              href="https://www.gov.uk/check-job-applicant-right-to-work"
              rel="noreferrer"
              target="_blank"
            >
              GOV.UK checking a job applicant's right to work
            </a>
            <a href="https://www.gov.uk/view-right-to-work" rel="noreferrer" target="_blank">
              GOV.UK check using a share code
            </a>
            <a href="https://www.gov.uk/prove-right-to-work" rel="noreferrer" target="_blank">
              GOV.UK prove your right to work
            </a>
            <a
              href="https://www.citizensadvice.org.uk/work/right-to-work-in-the-uk/check-how-to-prove-your-right-to-work-in-the-uk/"
              rel="noreferrer"
              target="_blank"
            >
              Citizens Advice proving right to work
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
        heading="Build a UK CV that gives enough information, not too much."
        body={`Use clear sections, keep private details private, and pay ${site.price} only when you download.`}
        secondaryHref="/ats-cv-template-uk"
        secondary="ATS-friendly format"
      />
    </>
  );
}
