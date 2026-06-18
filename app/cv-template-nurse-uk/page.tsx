import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ClipboardCheck,
  FileText,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import { CvDocument } from "@/components/cv-editor";
import { ButtonLink, FinalCta, SectionLabel } from "@/components/marketing";
import { site } from "@/lib/site";
import { getRoleCvTemplate } from "@/lib/role-cv-templates";

export const metadata: Metadata = {
  title: "Nurse CV Template UK - NMC-Ready Example",
  description:
    "Use a UK nurse CV template with NMC-focused sections, clinical bullet examples, NHS/private care guidance, and an editable CV draft.",
};

const editorHref = "/editor?template=classic&roleTemplate=nurse&new=1";
const nurseCv = getRoleCvTemplate("nurse");

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What should a nurse CV include in the UK?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "A UK nurse CV should include contact details, NMC registration status if applicable, a focused profile, clinical skills, recent nursing experience or placements, education, CPD, mandatory training and evidence matched to the job description.",
      },
    },
    {
      "@type": "Question",
      name: "Should I put my NMC PIN on my CV?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Many nursing applicants state that they are NMC registered and may include their PIN if comfortable. If you prefer not to show the full PIN on a public CV upload, make your registration status clear and provide details during the employer's checks.",
      },
    },
    {
      "@type": "Question",
      name: "How long should a nurse CV be?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "The Royal College of Nursing recommends keeping a CV ideally to no more than two sides of A4. For newly qualified nurses, one to two pages is usually enough if the evidence is focused.",
      },
    },
  ],
};

const recruiterChecks = [
  {
    title: "Registration and readiness",
    body:
      "Make NMC status, field of practice, right-to-work context where needed, mandatory training and availability easy to find.",
    icon: BadgeCheck,
  },
  {
    title: "Safe clinical practice",
    body:
      "Show assessment, care planning, observations, escalation, medicines, infection prevention and safeguarding with specific examples.",
    icon: ShieldCheck,
  },
  {
    title: "Setting fit",
    body:
      "Name the wards, community settings, care homes, clinics or specialties you know, instead of using vague healthcare language.",
    icon: Stethoscope,
  },
  {
    title: "Communication under pressure",
    body:
      "Evidence handovers, MDT work, patient and family communication, record keeping, consent, dignity and difficult conversations.",
    icon: HeartPulse,
  },
];

const structure = [
  [
    "Header",
    "Name, location, phone, email, LinkedIn if useful, target role and NMC registration status. Avoid date of birth, marital status, nationality and photo-first layouts.",
  ],
  [
    "Profile",
    "Four focused lines: field of nursing, setting, strongest clinical evidence, and the kind of role you are applying for.",
  ],
  [
    "Key clinical skills",
    "Use six to ten skills from the advert: medicines, NEWS2, wound care, discharge planning, safeguarding, EPR systems, venepuncture or specialty skills.",
  ],
  [
    "Experience",
    "Most recent first. Include ward or service type, patient group, acuity, systems, responsibilities, outcomes and MDT collaboration.",
  ],
  [
    "Education and CPD",
    "Include nursing degree or route, placements for newly qualified nurses, revalidation evidence, mandatory training and current specialist courses.",
  ],
];

const bulletExamples = [
  {
    setting: "Acute ward",
    bullets: [
      "Monitored observations for medical patients, escalated deterioration promptly and documented actions in electronic patient records.",
      "Supported discharge planning by coordinating with pharmacy, physiotherapy, occupational therapy and community services.",
    ],
  },
  {
    setting: "Care home",
    bullets: [
      "Led safe medicines rounds, completed care-plan reviews and communicated changes in residents' needs to GPs and relatives.",
      "Supported infection prevention, falls risk reviews, pressure-area care and person-centred end-of-life planning.",
    ],
  },
  {
    setting: "Newly qualified nurse",
    bullets: [
      "Completed supervised placements across acute, community and elderly care settings, building evidence against NMC practice standards.",
      "Prepared structured handovers, contributed to ward rounds and developed confidence prioritising care under supervision.",
    ],
  },
  {
    setting: "Community nursing",
    bullets: [
      "Managed allocated visits, completed wound assessments, updated care records and escalated concerns to senior clinicians.",
      "Built trust with patients and carers while supporting independence, dignity and safe care at home.",
    ],
  },
];

const mistakes = [
  "Opening with only 'compassionate and caring' without clinical evidence.",
  "Hiding NMC registration status, field of practice or current training.",
  "Listing duties without showing setting, patient group, acuity or outcomes.",
  "Using one generic CV for NHS, private hospital, care home and community roles.",
  "Forgetting CPD, mandatory training, revalidation evidence and current systems experience.",
];

const sourceNotes = [
  [
    "NHS Health Careers",
    "Adult nurses assess needs, plan and deliver care, evaluate results, work with MDTs and usually start at NHS Band 5.",
    "https://www.healthcareers.nhs.uk/explore-roles/nursing/roles-nursing/adult-nurse",
  ],
  [
    "NMC Code",
    "The Code is structured around prioritising people, practising effectively, preserving safety and promoting professionalism and trust.",
    "https://www.nmc.org.uk/standards/code/",
  ],
  [
    "RCN CV writing",
    "RCN guidance recommends tailoring every CV, using specific context, action words and ideally keeping the CV to no more than two A4 pages.",
    "https://www.rcn.org.uk/Professional-Development/Your-career/CV-writing",
  ],
  [
    "NMC register data",
    "The NMC reported 860,801 nurses, midwives and nursing associates on the Register on 30 September 2025, with slower growth than the prior year.",
    "https://www.nmc.org.uk/about-us/reports-and-accounts/registration-statistics/",
  ],
];

const relatedLinks = [
  ["ATS CV template UK", "/ats-cv-template-uk"],
  ["CV personal statement UK", "/cv-personal-statement-uk"],
  ["Career change CV", "/career-change-cv-uk"],
  ["Return to work CV", "/return-to-work-cv-uk"],
  ["No-subscription CV builder", "/cv-builder-no-subscription-uk"],
];

export default function NurseCvTemplateUkPage() {
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
              Nurse CV template UK
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              Build a nurse CV around safe practice, not generic care words.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              Start with an editable UK nurse CV template that already includes
              NMC-focused sections, clinical evidence, CPD, ward experience and
              recruiter-friendly wording you can adapt before downloading.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={editorHref}>Use nurse CV template</ButtonLink>
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
                  Registered Nurse CV
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
                <CvDocument cv={nurseCv} compactPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Recruiter scan</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            A strong nurse CV answers four questions fast.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            Nursing employers are not only checking whether you are caring. They
            are checking whether you can practise safely, document clearly,
            prioritise under pressure and fit the setting they are hiring for.
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
              Put registration, clinical fit and recent practice near the top.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              The safest structure is still readable and chronological, but the
              first half page should quickly prove that you match the job
              description and person specification.
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
            Use clinical evidence that matches the setting.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            Copying generic bullets weakens a nursing CV. Adapt the examples
            below around the ward, patient group, acuity, systems and employer
            criteria in the advert.
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
            <SectionLabel>NHS and private roles</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Tune the same CV differently for each nursing advert.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              NHS applications often mirror essential and desirable criteria.
              Private hospitals, care homes and agencies may put more weight on
              setting fit, shift readiness, specialist skills and immediate
              confidence with documentation and medicines processes.
            </p>
            <div className="mt-8 rounded-xl border border-line bg-white p-6">
              <h3 className="font-display text-2xl font-semibold text-navy">
                Before you apply, check the advert for:
              </h3>
              <ul className="mt-5 space-y-4">
                {[
                  "Band, specialty, patient group and shift pattern",
                  "Essential criteria, values and person specification wording",
                  "Medication, safeguarding, EPR and escalation requirements",
                  "Required courses, induction expectations and pre-employment checks",
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
              Built from current UK nursing and CV guidance.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Last checked 17 June 2026. This page uses official NHS Health
              Careers role guidance, NMC professional standards, RCN CV-writing
              advice and NMC register workforce data.
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
        heading="Start with a nurse CV that already knows the role."
        body={`Use the editable nurse template, adapt it to the advert, then pay ${site.price} only when you download the final PDF.`}
        secondaryHref="/ats-cv-template-uk"
        secondary="Check ATS format"
      />
    </>
  );
}
