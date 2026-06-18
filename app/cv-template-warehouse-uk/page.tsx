import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Check,
  ClipboardCheck,
  FileText,
  ScanLine,
  ShieldCheck,
  Warehouse,
} from "lucide-react";

import { CvDocument } from "@/components/cv-editor";
import { ButtonLink, FinalCta, SectionLabel } from "@/components/marketing";
import { getRoleCvTemplate } from "@/lib/role-cv-templates";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Warehouse CV Template UK - Operative, Picker and Packer",
  description:
    "Use a UK warehouse CV template with picking, packing, goods-in, dispatch, scanner, manual handling and shift-work examples you can edit.",
};

const editorHref = "/editor?template=classic&roleTemplate=warehouse&new=1";
const warehouseCv = getRoleCvTemplate("warehouse");

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What should a warehouse CV include in the UK?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "A UK warehouse CV should include contact details, a short profile, picking and packing experience, goods-in or dispatch work, scanner or WMS use, manual handling awareness, shift availability, reliability and any forklift, PPT or health and safety training.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need qualifications for a warehouse operative job?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Many warehouse roles are open to direct applicants. Some employers may ask for GCSEs in English and maths, IT basics or previous warehouse, storage or delivery experience. Forklift training can help, but employers often train staff after probation.",
      },
    },
    {
      "@type": "Question",
      name: "How do I write a warehouse CV with no experience?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Show transferable evidence: reliability, punctuality, teamwork, physical work, following instructions, attention to detail, basic computer or handheld-device use, customer orders, stock handling, volunteering or shift work.",
      },
    },
  ],
};

const recruiterChecks = [
  {
    title: "Accuracy at pace",
    body:
      "Show picking, packing, labelling, checking codes, meeting shift targets and keeping errors low during busy periods.",
    icon: ScanLine,
  },
  {
    title: "Safe movement",
    body:
      "Evidence manual handling awareness, PPE, pallet safety, pedestrian routes, housekeeping and safe use of equipment.",
    icon: ShieldCheck,
  },
  {
    title: "Stock flow",
    body:
      "Name goods-in, putaway, replenishment, returns, cycle counts, dispatch, loading or unloading instead of saying only warehouse duties.",
    icon: Boxes,
  },
  {
    title: "Shift reliability",
    body:
      "Make availability, attendance, overtime flexibility, teamwork and peak-period experience easy for agencies and employers to spot.",
    icon: Warehouse,
  },
];

const structure = [
  [
    "Header",
    "Name, location, phone, email, target role and availability if useful. Add forklift or PPT licences only if they are current and relevant.",
  ],
  [
    "Profile",
    "Three to four lines covering warehouse setting, strongest tasks, scanner or WMS confidence, safety awareness and shift fit.",
  ],
  [
    "Key skills",
    "Use advert language: picking, packing, goods-in, dispatch, WMS, stock rotation, manual handling, palletising, loading or returns.",
  ],
  [
    "Experience",
    "Most recent first. Include warehouse type, pace, equipment, product type, accuracy, safety and teamwork evidence.",
  ],
  [
    "Training",
    "List manual handling, forklift, PPT, first aid, fire safety, food safety, COSHH, IOSH or apprenticeship training where relevant.",
  ],
];

const bulletExamples = [
  {
    setting: "Picker and packer",
    bullets: [
      "Picked customer orders with handheld scanners, checking product codes, quantities and locations before packing.",
      "Packed fragile and high-volume items carefully, applied correct labels and prepared parcels for courier collection.",
    ],
  },
  {
    setting: "Goods-in and stock",
    bullets: [
      "Received deliveries, checked paperwork, reported missing or damaged items and moved stock to assigned locations.",
      "Supported cycle counts and stock rotation, helping the team keep inventory records accurate.",
    ],
  },
  {
    setting: "Forklift or PPT support",
    bullets: [
      "Moved pallets safely in line with site rules, keeping pedestrian routes clear and reporting equipment concerns quickly.",
      "Loaded and unloaded vehicles under supervision, checking load stability, labels and dispatch paperwork.",
    ],
  },
  {
    setting: "Entry-level warehouse",
    bullets: [
      "Worked reliably on early and late shifts, following instructions, meeting start times and supporting team targets.",
      "Kept work areas clean, followed PPE rules and helped colleagues complete packing, sorting and stock tasks.",
    ],
  },
];

const mistakes = [
  "Writing only 'hard worker' without proving pace, accuracy or reliability.",
  "Leaving out scanner, WMS, stock, dispatch or equipment experience.",
  "Mentioning forklift skills without saying whether training or licences are current.",
  "Ignoring safety, manual handling, housekeeping and pedestrian-route awareness.",
  "Using the same CV for agency temp work, permanent roles and supervisor-track vacancies.",
];

const sourceNotes = [
  [
    "National Careers Service",
    "Warehouse workers load and unload deliveries, move goods to storage, pack dispatch orders and may progress to team leader or warehouse manager.",
    "https://nationalcareers.service.gov.uk/job-profiles/warehouse-worker",
  ],
  [
    "HSE manual handling",
    "HSE says manual handling includes lifting, putting down, pushing, pulling, carrying or moving loads, and employers must reduce injury risk.",
    "https://www.hse.gov.uk/msd/manual-handling/index.htm",
  ],
  [
    "HSE workplace transport",
    "HSE workplace transport guidance covers traffic routes, separating people and vehicles, lift trucks, inspection checks and safety signs.",
    "https://www.hse.gov.uk/workplacetransport/",
  ],
  [
    "Generation Logistics",
    "The sector campaign highlights logistics pathways from entry-level roles through graduate programmes and major employers.",
    "https://generationlogistics.org/",
  ],
];

const relatedLinks = [
  ["CV no experience UK", "/cv-no-experience-uk"],
  ["School leaver CV", "/school-leaver-cv-example"],
  ["ATS CV template UK", "/ats-cv-template-uk"],
  ["Right to work CV", "/right-to-work-cv-uk"],
  ["No-subscription CV builder", "/cv-builder-no-subscription-uk"],
];

export default function WarehouseCvTemplateUkPage() {
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
              Warehouse CV template UK
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              Build a warehouse CV that proves pace, accuracy and safety.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              Start with an editable warehouse CV template for UK operative,
              picker, packer, goods-in and dispatch roles. The draft already
              includes scanner use, stock handling, manual handling and shift
              reliability examples you can adapt.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={editorHref}>Use warehouse CV template</ButtonLink>
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
                  Warehouse Operative CV
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
                <CvDocument cv={warehouseCv} compactPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Employer scan</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            A strong warehouse CV answers four practical questions.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            Warehouse recruiters usually need evidence that you can turn up,
            follow safe systems, keep products moving and stay accurate when the
            shift gets busy.
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
              Put shift fit, stock tasks and safety evidence near the top.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Warehouse CVs do not need heavy wording. They need clear proof of
              the tasks, tools, checks and safe working habits the advert asks
              for.
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
            Replace generic labour claims with task evidence.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            The best bullets show what moved, how you checked it, what tools you
            used and how you kept the work safe and accurate.
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
            <SectionLabel>Agency, seasonal and permanent roles</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Tune the CV to the shift, site and product flow.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              A warehouse CV for Christmas peak, a chilled food site, an e-commerce
              fulfilment centre and a forklift-heavy goods-in role should not
              read the same. Match the advert's product type, equipment, hours
              and pace.
            </p>
            <div className="mt-8 rounded-xl border border-line bg-white p-6">
              <h3 className="font-display text-2xl font-semibold text-navy">
                Before you apply, check the advert for:
              </h3>
              <ul className="mt-5 space-y-4">
                {[
                  "Shift pattern, location, start date and overtime expectations",
                  "Picking, packing, goods-in, dispatch, returns or inventory tasks",
                  "Scanner, WMS, forklift, PPT, loading or manual handling requirements",
                  "Temperature-controlled, food, retail, parcel, manufacturing or e-commerce setting",
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
              Built from current UK warehouse and safety guidance.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Last checked 17 June 2026. This page uses National Careers Service
              role guidance, HSE manual handling and workplace transport guidance,
              and Generation Logistics career information.
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
        heading="Start with a warehouse CV that already knows the shift."
        body={`Use the editable warehouse template, adapt it to the vacancy, then pay ${site.price} only when you download the final PDF.`}
        secondaryHref="/cv-no-experience-uk"
        secondary="No-experience CV help"
      />
    </>
  );
}
