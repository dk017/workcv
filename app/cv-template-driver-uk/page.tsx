import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  FileText,
  MapPinned,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { CvDocument } from "@/components/cv-editor";
import { ButtonLink, FinalCta, SectionLabel } from "@/components/marketing";
import { getRoleCvTemplate } from "@/lib/role-cv-templates";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Driver CV Template UK - Editable Example",
  description:
    "Use an editable driver CV template for UK delivery, van and HGV roles. Build a clear CV around licence, route, safety, customer and delivery-record evidence.",
  alternates: {
    canonical: "/cv-template-driver-uk",
  },
  openGraph: {
    title: "Driver CV Template UK - WorkCV",
    description:
      "Start with an editable UK driver CV example and tailor it to delivery, van, courier or HGV roles.",
    url: "/cv-template-driver-uk",
  },
};

const editorHref = "/editor?template=classic&roleTemplate=driver&new=1";
const driverCv = getRoleCvTemplate("driver");

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What should a driver CV include in the UK?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "A UK driver CV should include contact details, licence categories relevant to the role, a focused profile, driving and delivery skills, recent-first work history, vehicle checks, route experience, customer communication, training and references guidance.",
      },
    },
    {
      "@type": "Question",
      name: "Should I put my driving licence on my CV?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes, include the licence category required for the role if you hold it. For HGV, passenger, ADR, CPC or specialist driving roles, include relevant qualifications accurately and keep details current.",
      },
    },
    {
      "@type": "Question",
      name: "How do I make a delivery driver CV stronger?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Show route type, delivery volume where accurate, vehicle checks, proof-of-delivery records, customer communication, safe manual handling, punctuality and how you dealt with delays or failed deliveries.",
      },
    },
  ],
};

const recruiterChecks = [
  {
    title: "Licence fit",
    body:
      "Make the right licence category, CPC or specialist training easy to find when the advert requires it.",
    icon: Truck,
  },
  {
    title: "Route reliability",
    body:
      "Show multi-drop, long-distance, local routes, route apps, timekeeping and how you handled delays.",
    icon: MapPinned,
  },
  {
    title: "Safe working",
    body:
      "Mention vehicle checks, defect reporting, safe loading, manual handling, tachograph or site rules where relevant.",
    icon: ShieldCheck,
  },
  {
    title: "Delivery records",
    body:
      "Proof of delivery, scanner use, failed-attempt notes and customer handovers matter for many driver roles.",
    icon: PackageCheck,
  },
];

const structure = [
  ["Header", "Name, town or region, phone and professional email. Add licence category near the top if it is central to the role."],
  ["Profile", "Three to five lines covering vehicle/route type, reliability, safety awareness and the kind of driver role you want."],
  ["Key skills", "Use advert terms you can prove: multi-drop, van, HGV, route planning, POD records, manual handling, vehicle checks or customer communication."],
  ["Experience", "Most recent first. Include route area, vehicle type, delivery volume if accurate, systems used, safety checks and customer-facing duties."],
  ["Licences and training", "Include UK licence categories, Driver CPC, tachograph, ADR, forklift, manual handling or first aid only when accurate and current."],
];

const bulletExamples = [
  {
    setting: "Delivery driver",
    bullets: [
      "Completed multi-drop delivery routes, checking parcels, addresses and delivery instructions before leaving the depot.",
      "Recorded proof of delivery, failed attempts and customer notes accurately using handheld scanner systems.",
    ],
  },
  {
    setting: "Van or courier role",
    bullets: [
      "Planned local routes using delivery apps, adjusted for delays and communicated access issues promptly.",
      "Kept vehicle clean, completed basic checks and reported defects before starting scheduled routes.",
    ],
  },
  {
    setting: "HGV-focused role",
    bullets: [
      "Followed site safety rules, loading requirements and route paperwork while maintaining accurate delivery records.",
      "Used tachograph and Driver CPC knowledge where required; replace this example only with training you actually hold.",
    ],
  },
  {
    setting: "Driver assistant",
    bullets: [
      "Loaded goods safely, checked labels and supported two-person deliveries with careful customer handovers.",
      "Helped with returns, warehouse dispatch and stock checks during quieter delivery periods.",
    ],
  },
];

const mistakes = [
  "Hiding the licence category or specialist training the advert asks for.",
  "Saying only 'good driver' without route, vehicle, safety or delivery evidence.",
  "Claiming HGV, CPC, ADR or tachograph experience inaccurately.",
  "Forgetting vehicle checks, defect reporting, proof-of-delivery records or customer handovers.",
  "Using made-up delivery volumes or punctuality claims.",
  "Sending a courier-style CV unchanged to HGV, transport or warehouse-driver roles.",
];

const sourceNotes = [
  [
    "National Careers Service — delivery van driver",
    "The role profile covers collecting and delivering goods, planning routes, loading, paperwork and customer interaction.",
    "https://nationalcareers.service.gov.uk/job-profiles/delivery-van-driver",
  ],
  [
    "National Careers Service — HGV driver",
    "The role profile covers transporting goods, vehicle checks, delivery paperwork, route planning and legal driving requirements.",
    "https://nationalcareers.service.gov.uk/job-profiles/large-goods-vehicle-driver",
  ],
  [
    "GOV.UK — driving licence categories",
    "GOV.UK lists licence categories and the vehicles each category allows a person to drive.",
    "https://www.gov.uk/driving-licence-categories",
  ],
];

const relatedLinks = [
  ["Professional CV builder", "/cv-builder-no-subscription-uk"],
  ["ATS CV template UK", "/ats-cv-template-uk"],
  ["Warehouse CV template", "/cv-template-warehouse-uk"],
  ["Customer service CV template", "/cv-template-customer-service-uk"],
  ["Editable UK CV templates", "/templates"],
];

export default function DriverCvTemplateUkPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="quiet-grid bg-paper py-20 md:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              Driver CV template UK
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              Build a driver CV around licence, reliability and safe delivery.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              Start with an editable UK driver CV example for delivery, van,
              courier and transport roles. Replace the sample wording with your
              own route, vehicle, licence and customer evidence before paying
              for the PDF.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={editorHref}>Use driver CV template</ButtonLink>
              <ButtonLink href="#example" variant="secondary">See example</ButtonLink>
            </div>
          </div>

          <div id="example" className="rounded-xl border border-line bg-white p-4 shadow-soft">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">Editable draft</p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-navy">Delivery Driver CV</h2>
              </div>
              <Link href={editorHref} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover">
                Edit <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="template-page-preview overflow-hidden rounded-lg border border-line bg-[#eef6f3] p-3">
              <div className="gallery-preview-document pointer-events-none mx-auto" style={{ width: 794 }}>
                <CvDocument cv={driverCv} compactPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Recruiter scan</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            A strong driver CV makes the practical checks obvious.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            Employers need to know whether you can legally drive the vehicle,
            follow safety procedures, complete records and deal with customers
            without creating avoidable problems.
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
              Put licence, route and safety evidence before generic work history.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Use this structure as a base, then tailor the details to the
              vehicle type, route pattern and employer requirements in the
              advert.
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
            Show the route, record and safety context.
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
              Match the driver role before you download.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              A supermarket delivery CV, courier CV and HGV CV should not read
              the same. Move the relevant licence, vehicle, route and safety
              details forward.
            </p>
            <div className="mt-8 rounded-xl border border-line bg-white p-6">
              <h3 className="font-display text-2xl font-semibold text-navy">Check the advert for:</h3>
              <ul className="mt-5 space-y-4">
                {[
                  "Required licence category, CPC, tachograph or specialist training",
                  "Vehicle type, route area, shifts and manual handling expectations",
                  "Scanner, POD, app, paperwork or customer handover process",
                  "Safety checks, loading rules, defect reporting and site procedures",
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
              Built from current UK driving role guidance.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Last checked 23 June 2026. This page uses National Careers
              Service delivery and HGV driver role profiles, plus GOV.UK
              driving licence category guidance.
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
        heading="Start with a driver CV that makes the practical checks clear."
        body={`Use the editable driver template, tailor it to the advert, then pay ${site.price} only when you download the final PDF.`}
        primaryHref={editorHref}
        primary="Use driver CV template"
        secondaryHref="/cv-template-warehouse-uk"
        secondary="See warehouse CV"
      />
    </>
  );
}
