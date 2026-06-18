import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  FileText,
  HeartHandshake,
  Home,
  ShieldCheck,
} from "lucide-react";

import { CvDocument } from "@/components/cv-editor";
import { ButtonLink, FinalCta, SectionLabel } from "@/components/marketing";
import { getRoleCvTemplate } from "@/lib/role-cv-templates";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Care Worker CV Template UK - Care Assistant Example",
  description:
    "Use an editable UK care worker CV template with person-centred care, safeguarding, home care, care home, records and training examples.",
};

const editorHref = "/editor?template=classic&roleTemplate=care-worker&new=1";
const careWorkerCv = getRoleCvTemplate("care-worker");

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What should a care worker CV include in the UK?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "A UK care worker CV should show person-centred support, dignity, safeguarding, communication, accurate records, safe working, reliability and relevant training. Tailor the evidence to home care, residential care, supported living or the specific service in the advert.",
      },
    },
    {
      "@type": "Question",
      name: "Can I apply for a care worker job with no experience?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Many employers train applicants with the right values and personal qualities. Use volunteering, unpaid caring responsibilities, customer service or community work to evidence patience, respect, reliability, communication and following procedures without describing informal care as paid employment.",
      },
    },
    {
      "@type": "Question",
      name: "Should I put the Care Certificate on my CV?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes, if you have completed it. State the completion date and employer or training provider. If it is in progress, label it accurately. The Care Certificate standards were updated in March 2025 and now contain 16 standards.",
      },
    },
  ],
};

const recruiterChecks = [
  {
    title: "Dignity and choice",
    body:
      "Show how you respect privacy, preferences, consent, routines and independence rather than listing personal care as a task alone.",
    icon: HeartHandshake,
  },
  {
    title: "Safety and escalation",
    body:
      "Evidence safeguarding awareness, safe moving and handling, infection prevention and prompt reporting of changes or concerns.",
    icon: ShieldCheck,
  },
  {
    title: "Records and handovers",
    body:
      "Name care notes, food and fluid records, incident reporting, visit logs and concise handovers where these were part of your role.",
    icon: ClipboardCheck,
  },
  {
    title: "Setting and reliability",
    body:
      "Make care-home, home-care, supported-living or community experience clear, together with shifts, travel and dependable attendance.",
    icon: Home,
  },
];

const structure = [
  [
    "Header",
    "Name, town or city, phone and email. Add a driving licence and access to a vehicle only when true and relevant to community visits.",
  ],
  [
    "Profile",
    "Three to four lines covering your care setting, people supported, strongest practical evidence, training and person-centred approach.",
  ],
  [
    "Key skills",
    "Use precise advert language such as personal care, safeguarding, care plans, moving and handling, dementia support, records or medication support.",
  ],
  [
    "Experience",
    "Describe what you supported, how you protected dignity and safety, what you recorded, and when you reported or escalated concerns.",
  ],
  [
    "Training",
    "List completed or in-progress training accurately: Care Certificate, Adult Care qualifications, safeguarding, moving and handling, infection prevention or specialist courses.",
  ],
];

const bulletExamples = [
  {
    setting: "Residential care",
    bullets: [
      "Supported residents with washing, dressing, continence care and mobility while following individual care plans, preferences and privacy needs.",
      "Recorded food and fluid intake, care delivered and wellbeing changes, then shared clear updates during handover.",
    ],
  },
  {
    setting: "Domiciliary care",
    bullets: [
      "Completed scheduled home visits independently, supporting personal care, meals, hydration and household routines without taking over tasks clients could do safely.",
      "Reported changes in mobility, appetite, mood or skin condition through the service's agreed escalation process.",
    ],
  },
  {
    setting: "Dementia support",
    bullets: [
      "Used calm explanations, familiar routines and meaningful activities to reduce distress and help residents remain involved in daily choices.",
      "Shared observations about communication, sleep, appetite and behaviour with senior staff to support care-plan reviews.",
    ],
  },
  {
    setting: "No paid care experience",
    bullets: [
      "Volunteered weekly at a community lunch club, welcoming older visitors, preparing refreshments and listening respectfully to individual needs.",
      "Balanced family caring responsibilities with work and appointments, building patience, organisation and confidence communicating with services.",
    ],
  },
];

const mistakes = [
  "Using only words such as caring, kind and compassionate without practical evidence.",
  "Claiming medication, clinical observation or moving-and-handling duties beyond your training and authorisation.",
  "Listing personal care without showing dignity, consent, choice and independence.",
  "Leaving out records, handovers, safeguarding and examples of reporting concerns.",
  "Sending one generic CV to home-care, residential, supported-living and specialist services.",
];

const sourceNotes = [
  [
    "National Careers Service",
    "The official role profile covers personal care, food, activities, observations, reporting concerns, care records, home visits, shifts and enhanced background checks.",
    "https://nationalcareers.service.gov.uk/job-profiles/care-worker",
  ],
  [
    "Skills for Care role profile",
    "Sector guidance highlights initiative, communication, following procedures, care-plan writing, personal care, activities, appointments and condition monitoring.",
    "https://www.skillsforcare.org.uk/Careers-in-care/Job-roles/Roles/Care-worker.aspx",
  ],
  [
    "2025 Care Certificate",
    "The standards were updated in March 2025. There are now 16, including a new learning disability and autism awareness standard.",
    "https://www.skillsforcare.org.uk/Developing-your-workforce/Care-Certificate/Care-Certificate-standards.aspx",
  ],
  [
    "CQC fundamental standards",
    "CQC's standards cover person-centred care, dignity, consent, safety, safeguarding, food and drink, suitable staff, training and supervision.",
    "https://www.cqc.org.uk/about-us/fundamental-standards",
  ],
  [
    "Adult social care workforce 2025",
    "Skills for Care reported 1.6 million filled posts, 111,000 vacancies and a 7% vacancy rate in England in 2024/25, alongside continuing recruitment and qualification challenges.",
    "https://www.skillsforcare.org.uk/news-and-events/news/latest-social-care-sector-and-workforce-data-published",
  ],
];

const relatedLinks = [
  ["CV no experience UK", "/cv-no-experience-uk"],
  ["Return to work CV", "/return-to-work-cv-uk"],
  ["Employment gap CV", "/cv-employment-gap-uk"],
  ["Right to work CV", "/right-to-work-cv-uk"],
  ["No-subscription CV builder", "/cv-builder-no-subscription-uk"],
];

export default function CareWorkerCvTemplateUkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="quiet-grid bg-paper py-20 md:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="min-w-0">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              Care worker CV template UK
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              Show safe, person-centred care with evidence employers can trust.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              Start with an editable care worker CV for care homes, home care
              and community support. The draft turns daily care, records,
              safeguarding, training and reliability into clear shortlist evidence.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={editorHref}>Use care worker CV template</ButtonLink>
              <ButtonLink href="#example" variant="secondary">
                See example
              </ButtonLink>
            </div>
          </div>

          <div
            id="example"
            className="min-w-0 overflow-hidden rounded-xl border border-line bg-white p-4 shadow-soft"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
                  Editable draft
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-navy">
                  Care Worker CV
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
              <div className="gallery-preview-document pointer-events-none mx-auto" style={{ width: 794 }}>
                <CvDocument cv={careWorkerCv} compactPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Care recruiter scan</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Values matter, but evidence makes them credible.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            A useful care CV connects compassion to actions: protecting dignity,
            following plans, noticing change, documenting support and speaking up.
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
              Make safe practice easy to find.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Put relevant care evidence before generic employment detail. Use
              the job advert and service type to decide which duties, training
              and availability deserve the most space.
            </p>
            <div className="mt-8"><ButtonLink href={editorHref}>Start with this structure</ButtonLink></div>
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
            Write about support, judgement and reporting, not a list of chores.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            Adapt these examples to what you genuinely did. Never add clinical,
            medication or equipment responsibilities you were not trained and authorised to perform.
          </p>
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
            <SectionLabel>Tailor by care setting</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              A home-care CV should not read like a care-home CV.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Home care often needs independent visits, travel, punctuality and
              accurate mobile records. Residential care may emphasise teamwork,
              handovers, shared routines and activities. Supported living may
              focus more on choice, community participation and life skills.
            </p>
            <div className="mt-8 rounded-xl border border-line bg-white p-6">
              <h3 className="font-display text-2xl font-semibold text-navy">Check the advert for:</h3>
              <ul className="mt-5 space-y-4">
                {[
                  "People supported, service type and any specialist needs",
                  "Driving, travel, sleep-in, weekend or night-shift requirements",
                  "Care Certificate, Adult Care qualification and mandatory training",
                  "Digital care systems, record keeping and medication-support expectations",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-bold text-navy">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />{item}
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
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />{mistake}
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
              Built from current UK care-sector guidance.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Last checked 18 June 2026. The template reflects current role
              guidance, the March 2025 Care Certificate update, CQC fundamental
              standards and Skills for Care's 2024/25 workforce data.
            </p>
          </div>
          <div className="grid gap-4">
            {sourceNotes.map(([title, body, href]) => (
              <a key={href} href={href} rel="noreferrer" target="_blank" className="group rounded-xl border border-line bg-white p-5 transition hover:-translate-y-1 hover:border-navy">
                <h3 className="font-display text-xl font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{body}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-navy">
                  Open source<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
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
                {label}<ArrowRight className="mt-4 h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FinalCta
        heading="Start with a care worker CV grounded in real practice."
        body={`Edit the care-worker draft for your setting and experience, then pay ${site.price} only when you download the final PDF.`}
        secondaryHref="/cv-no-experience-uk"
        secondary="Build without care experience"
      />
    </>
  );
}
