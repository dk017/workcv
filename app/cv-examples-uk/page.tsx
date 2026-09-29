import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  FileText,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";

import { CvDocument } from "@/components/cv-editor";
import { ButtonLink, FaqSection, FinalCta, SectionLabel } from "@/components/marketing";
import { getRoleCvTemplate } from "@/lib/role-cv-templates";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "UK CV Examples: 11 Samples by Job and Career Stage",
  description:
    "11 UK CV examples for customer service, nursing, teaching, care, engineering, driving, warehouse, graduate, student and school leaver roles, with notes on why each works. Edit any example free.",
  alternates: {
    canonical: "/cv-examples-uk",
  },
  openGraph: {
    title: "UK CV Examples: 11 Samples by Job and Career Stage",
    description:
      "Use UK CV examples as starting points, then edit the wording to match your own evidence before downloading.",
    url: "/cv-examples-uk",
  },
};

const examples = [
  {
    title: "Customer service CV example",
    href: "/cv-template-customer-service-uk",
    role: "customer-service" as const,
    body: "Best for adviser, assistant, contact-centre and support roles where complaint handling, CRM and calm communication matter.",
  },
  {
    title: "Engineer CV example",
    href: "/cv-template-engineer-uk",
    role: "engineer" as const,
    body: "Best for technical applicants who need to show discipline fit, tools, projects, safety and engineering judgement.",
  },
  {
    title: "Driver CV example",
    href: "/cv-template-driver-uk",
    role: "driver" as const,
    body: "Best for delivery, van, courier and transport roles where licence, route reliability and records matter.",
  },
  {
    title: "Nurse CV example",
    href: "/cv-template-nurse-uk",
    role: "nurse" as const,
    body: "Best for nursing applicants who need to show NMC status, safe practice, clinical evidence and setting fit.",
  },
];

type GalleryItem = {
  role: "general" | "customer-service" | "nurse" | "teacher" | "care-worker" | "engineer" | "driver" | "warehouse" | "graduate" | "student" | "school-leaver";
  title: string;
  forWho: string;
  href: string;
  letterHref?: string;
  why: string[];
};

const gallery: GalleryItem[] = [
  { role: "general", title: "Customer service adviser", forWho: "The standard chronological UK CV", href: "/professional-cv-template-uk", letterHref: "/cover-letter-examples-uk#customer-service", why: ["Recent roles first with dates, employer and location on one line.", "Bullets describe what was done and the result, not personality claims."] },
  { role: "customer-service", title: "Contact centre adviser", forWho: "Phone, email and complaint-handling roles", href: "/cv-template-customer-service-uk", letterHref: "/cover-letter-examples-uk#customer-service", why: ["Shows CRM accuracy and complaint resolution, which adverts usually list.", "Retail and volunteering are kept brief under the main role."] },
  { role: "nurse", title: "Registered nurse", forWho: "NHS and private ward roles", href: "/cv-template-nurse-uk", letterHref: "/cover-letter-examples-uk#nurse", why: ["NMC registration and revalidation are visible near the top.", "Clinical skills such as NEWS2 and medicines administration are named precisely."] },
  { role: "teacher", title: "Secondary teacher", forWho: "QTS holders and early career teachers", href: "/cv-template-teacher-uk", letterHref: "/cover-letter-examples-uk#teacher", why: ["QTS and Key Stage focus stated up front.", "Includes adaptive teaching, SEND and safeguarding evidence."] },
  { role: "care-worker", title: "Care worker", forWho: "Residential and home care", href: "/cv-template-care-worker-uk", letterHref: "/cover-letter-examples-uk#care-worker", why: ["Person-centred care and dignity described through real tasks.", "Safeguarding, moving and handling and care notes all covered."] },
  { role: "engineer", title: "Mechanical engineer", forWho: "Design, test and manufacturing roles", href: "/cv-template-engineer-uk", letterHref: "/cover-letter-examples-uk#graduate-engineer", why: ["Technical tools and methods named, such as CAD and root cause analysis.", "Graduate trainee experience kept to show progression."] },
  { role: "driver", title: "Delivery driver", forWho: "Multi-drop, van and courier roles", href: "/cv-template-driver-uk", letterHref: "/cover-letter-examples-uk#delivery-driver", why: ["Licence and vehicle checks listed where screeners look first.", "Proof-of-delivery records show reliability without big claims."] },
  { role: "warehouse", title: "Warehouse operative", forWho: "Picking, packing, goods-in and dispatch", href: "/cv-template-warehouse-uk", letterHref: "/cover-letter-examples-uk#warehouse-operative", why: ["Scanner and stock-check experience match typical adverts.", "Safe manual handling included as a skill, not an afterthought."] },
  { role: "graduate", title: "Graduate business analyst", forWho: "Recent graduates with placements", href: "/cv-template-graduate-uk", letterHref: "/cover-letter-examples-uk#internship", why: ["Placement and final-year project count as real experience.", "Excel, SQL and research skills are backed up by projects."] },
  { role: "student", title: "Student part-time job", forWho: "Students applying for retail or hospitality", href: "/student-cv-template", letterHref: "/cover-letter-examples-uk#part-time-student", why: ["Volunteering and society roles fill a short work history honestly.", "One page, focused on availability and customer skills."] },
  { role: "school-leaver", title: "School leaver", forWho: "Apprenticeships and first jobs", href: "/school-leaver-cv-example", letterHref: "/cover-letter-examples-uk#apprenticeship", why: ["GCSE coursework, enterprise projects and volunteering as evidence.", "Skills like organisation are tied to a specific example."] },
];

const cvTypes = [
  ["Chronological CV", "The standard UK CV: most recent role first. Right for most applicants with a work history.", "/professional-cv-template-uk"],
  ["Skills-based CV", "Leads with skills and evidence. Useful for a career change or when your recent job is less relevant.", "/career-change-cv-uk"],
  ["Returning after a break", "Explains a career break briefly and focuses on current, relevant skills.", "/return-to-work-cv-uk"],
  ["No work experience", "Uses education, projects, volunteering and responsibilities as evidence.", "/cv-no-experience-uk"],
  ["Graduate CV", "Degree, projects and placements first; work history second.", "/cv-template-graduate-uk"],
  ["ATS-friendly CV", "A simple single-column layout that applicant tracking systems read cleanly.", "/ats-cv-template-uk"],
];

const faqs = [
  { question: "What does a good UK CV look like?", answer: "A clear one- or two-page A4 document with your contact details, a short profile, recent-first work history with evidence-led bullet points, education and relevant skills. It leaves out a photo, date of birth and marital status for most UK jobs." },
  { question: "Which CV format should I use?", answer: "Most UK applicants should use a reverse chronological CV. A skills-based CV can help if you are changing career or your most recent job is not relevant to the role." },
  { question: "Can I copy a CV example?", answer: "Use the structure, not the wording. Replace every name, employer, date and claim with your own accurate details, and tailor it to the job advert. Examples on this page are fictional." },
  { question: "How long should a UK CV be?", answer: "Two A4 pages for most people and one page for many school leavers, students and graduates. See our CV length guide for measured word counts per page." },
  { question: "Are these CV examples free?", answer: `Yes. You can read every example and open any of them in the WorkCV editor to edit and preview free. Downloading your finished CV and a matching cover letter as PDF and Word costs ${site.price} once, with no subscription.` },
];

const exampleRules = [
  {
    title: "Use examples for structure, not copying",
    body:
      "A CV example should show what evidence belongs where. Replace names, employers, dates, numbers and claims with your own accurate details.",
    icon: ClipboardCheck,
  },
  {
    title: "Tailor each example to one advert",
    body:
      "National Careers Service guidance recommends matching your CV to the job advert, essential criteria and company details.",
    icon: SearchCheck,
  },
  {
    title: "Keep UK personal details sensible",
    body:
      "For most UK CVs, avoid unnecessary personal details such as age, date of birth, marital status, nationality or photo-first layouts.",
    icon: ShieldCheck,
  },
];

const weakStrong = [
  [
    "Customer service",
    "Friendly person with excellent communication skills.",
    "Handled telephone, email and in-person enquiries, resolved routine complaints and updated CRM records accurately.",
  ],
  [
    "Engineering",
    "Worked on engineering projects.",
    "Updated CAD drawings, documented test results and worked with production colleagues to investigate recurring defects.",
  ],
  [
    "Driving",
    "Good driver and reliable worker.",
    "Completed multi-drop routes, recorded proof of delivery and reported vehicle defects before scheduled shifts.",
  ],
  [
    "Graduate",
    "Recent graduate looking for an opportunity.",
    "Business graduate with placement, Excel analysis and customer-research project experience relevant to entry-level analyst roles.",
  ],
];

const sourceNotes = [
  [
    "National Careers Service — CV sections",
    "Official guidance says a CV should be clear, easy to read, tailored to the job advert and built around your skills, achievements and experience.",
    "https://nationalcareers.service.gov.uk/careers-advice/cv-sections",
  ],
  [
    "Prospects — how to write a CV",
    "Prospects guidance covers reverse chronological CVs, tailoring, relevant experience, references and avoiding unnecessary photographs for most roles.",
    "https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/how-to-write-a-cv",
  ],
  [
    "GOV.UK — discrimination in recruitment",
    "Government guidance explains that employers must not discriminate during recruitment, supporting a careful approach to personal details.",
    "https://www.gov.uk/employer-preventing-discrimination/recruitment",
  ],
];

export default function CvExamplesUkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
          }),
        }}
      />
      <section className="quiet-grid bg-paper py-20 md:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              CV examples UK
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              UK CV examples you can open and edit free.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              Eleven complete UK CV examples by job and career stage, each with
              notes on why it works. Open the closest one in the editor, replace
              the sample wording with your own evidence and preview it free.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/editor?template=classic&roleTemplate=general&new=1">
                Edit a CV example
              </ButtonLink>
              <ButtonLink href="#examples" variant="secondary">Browse examples</ButtonLink>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy">
              <Link href="/how-to-write-a-cv-uk" className="underline underline-offset-4">
                Read the UK CV writing guide
              </Link>
              <Link href="/how-long-should-a-cv-be-uk" className="underline underline-offset-4">
                How long should a CV be?
              </Link>
              <Link
                href="/cv-builder-no-subscription-uk"
                className="underline underline-offset-4"
              >
                How the no-subscription builder works
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {examples.slice(0, 4).map((example) => (
              <Link
                key={example.href}
                href={example.href}
                className="group rounded-xl border border-line bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-navy"
              >
                <div className="template-page-preview overflow-hidden rounded-lg border border-line bg-[#eef6f3] p-2">
                  <div className="gallery-preview-document pointer-events-none mx-auto" style={{ width: 794 }}>
                    <CvDocument cv={getRoleCvTemplate(example.role)} compactPreview />
                  </div>
                </div>
                <h2 className="mt-4 font-display text-2xl font-semibold text-navy">{example.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{example.body}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-navy">
                  Open editable example <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>How to use CV examples</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            The best CV examples help you write honestly, not sound generic.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {exampleRules.map((item) => {
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

      <section id="examples" className="bg-paper py-24">
        <div className="container-page">
          <SectionLabel>All UK CV examples</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Choose the closest example, then tailor it to the advert.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item) => (
              <article key={item.role} className="flex flex-col rounded-xl border border-line bg-white p-5 shadow-sm">
                <h3 className="font-display text-2xl font-semibold text-navy">{item.title}</h3>
                <p className="mt-1 text-sm font-bold text-muted">{item.forWho}</p>
                <ul className="mt-4 flex-1 space-y-2 text-sm leading-6 text-muted">
                  {item.why.map((point) => (
                    <li key={point} className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-success" />{point}</li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-bold text-navy">
                  <Link href={`/editor?template=classic&roleTemplate=${item.role}&new=1`} className="underline underline-offset-4">Edit this example free</Link>
                  <Link href={item.href} className="underline underline-offset-4">See full example</Link>
                  {item.letterHref ? <Link href={item.letterHref} className="underline underline-offset-4">Cover letter example</Link> : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="cv-types" className="bg-surface py-20">
        <div className="container-page">
          <SectionLabel>CV examples by type</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">Which kind of CV do you need?</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cvTypes.map(([title, body, href]) => (
              <Link key={title} href={href} className="group rounded-xl border border-line bg-white p-5 transition hover:-translate-y-1 hover:border-navy">
                <h3 className="font-display text-xl font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
                <ArrowRight className="mt-4 h-4 w-4 text-navy transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Example wording</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Move from vague claims to evidence.
          </h2>
          <div className="mt-10 overflow-hidden rounded-xl border border-line bg-white">
            <div className="hidden grid-cols-[160px_1fr_1fr] gap-5 bg-navy px-6 py-4 text-sm font-bold text-white md:grid">
              <span>Role</span>
              <span>Too vague</span>
              <span>Stronger direction</span>
            </div>
            {weakStrong.map(([role, weak, strong]) => (
              <div
                key={role}
                className="grid gap-4 border-t border-line px-6 py-5 first:border-t-0 md:grid-cols-[160px_1fr_1fr] md:gap-5"
              >
                <h3 className="font-display text-xl font-semibold text-navy">{role}</h3>
                <p className="text-sm leading-7 text-muted">{weak}</p>
                <p className="text-sm leading-7 text-ink">{strong}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted">
            These are writing directions, not claims to copy. Replace every
            detail with facts you can explain in an interview.
          </p>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionLabel>Research checked</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Based on current UK CV guidance.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Last checked 23 June 2026. The page uses National Careers
              Service, Prospects and GOV.UK guidance for CV structure,
              tailoring and personal details.
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

      <section className="bg-surface py-20">
        <div className="container-page rounded-xl border border-line bg-white p-6 sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div className="flex gap-4">
            <FileText className="h-8 w-8 shrink-0 text-gold" />
            <div>
              <h2 className="font-display text-2xl font-semibold text-navy">
                Ready to turn an example into your CV?
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Build first, preview the result, then pay {site.price} only
                when the PDF is ready.
              </p>
            </div>
          </div>
          <div className="mt-6 shrink-0 sm:mt-0">
            <ButtonLink href="/editor?template=classic&roleTemplate=general&new=1">
              Start my CV
            </ButtonLink>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqs} title="UK CV example questions." />
      <FinalCta
        heading="Use examples as a starting point, not a script."
        body={`Choose a UK CV example, edit it around your own evidence, then pay ${site.price} once to download your CV and a matching cover letter as PDF and Word.`}
        primaryHref="/editor?template=classic&roleTemplate=general&new=1"
        primary="Edit a CV example"
        secondaryHref="/templates"
        secondary="Compare templates"
      />
    </>
  );
}
