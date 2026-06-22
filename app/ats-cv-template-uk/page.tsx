import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileText,
  LayoutList,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  TextCursorInput,
} from "lucide-react";

import { CvDocument } from "@/components/cv-editor";
import { ButtonLink, FaqSection, FinalCta, SectionLabel } from "@/components/marketing";
import { buildWorkCvProductSchema } from "@/lib/product-schema";
import { getRoleCvTemplate } from "@/lib/role-cv-templates";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "ATS CV Template UK - Clean Applicant Tracking Format",
  description:
    "Edit an ATS-friendly UK CV template with standard headings, a clean single-column structure and honest job-specific wording. Preview before paying.",
  alternates: { canonical: "/ats-cv-template-uk" },
  openGraph: {
    title: "ATS-Friendly CV Template UK - Editable Example",
    description:
      "Use a clean, editable UK CV starting point and learn what ATS-friendly can—and cannot—promise.",
    url: "/ats-cv-template-uk",
  },
};

const editorHref = "/editor?template=classic&roleTemplate=general&new=1";
const atsCv = getRoleCvTemplate("general");

const faqItems = [
  {
    question: "What is an ATS-friendly CV template?",
    answer:
      "It is a restrained CV layout that keeps important information in ordinary text, uses familiar section headings and avoids unnecessary visual complexity. It can reduce formatting risk, but no template is compatible with every employer's system.",
  },
  {
    question: "Can this template guarantee that my CV passes an ATS?",
    answer:
      "No. Applicant tracking systems, employer settings and selection criteria differ. A template cannot guarantee parsing, ranking, an interview or a job offer. Your evidence and how closely it matches the role still matter.",
  },
  {
    question: "Should I upload a PDF or DOCX CV?",
    answer:
      "Follow the vacancy or application portal. Prospects notes that not every ATS accepts the same file formats. WorkCV exports PDF, so use another tool if an employer explicitly requires DOCX or another format.",
  },
  {
    question: "Should I copy keywords from the job advert?",
    answer:
      "Use the employer's terminology where it accurately describes your experience, qualification or skill. Do not paste hidden keywords, repeat terms unnaturally or claim evidence you do not have.",
  },
  {
    question: "Does an ATS-friendly CV still need to read well for people?",
    answer:
      "Yes. Recruiters and hiring managers still need to understand the CV. Clear dates, specific evidence, concise bullets and an obvious connection to the role matter to both processing and human review.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const productSchema = buildWorkCvProductSchema({
  description:
    "An editable, single-column UK CV template with standard headings, PDF preview and a one-time PDF unlock.",
  url: "/ats-cv-template-uk",
});

const principles = [
  {
    title: "Clear structure",
    body:
      "Use familiar sections: profile, key skills, work history, education and other relevant information.",
    icon: LayoutList,
  },
  {
    title: "Job advert language",
    body:
      "Match the real requirements in the advert. If the employer asks for Excel, safeguarding or stock control, use those terms where true.",
    icon: Search,
  },
  {
    title: "Readable formatting",
    body:
      "Avoid over-designed layouts, text boxes for core content, tiny fonts and decorative graphics that distract from the information.",
    icon: TextCursorInput,
  },
];

const goodBad = [
  [
    "Headings",
    "Creative labels such as 'My journey' or 'Where I have shined'",
    "Standard labels such as Profile, Key Skills, Work History and Education",
  ],
  [
    "Layout",
    "Two-column designs where dates, job titles and bullets are split apart",
    "A clean single-column flow with job title, employer, dates and bullets together",
  ],
  [
    "Keywords",
    "Stuffing a keyword list that does not match your experience",
    "Natural wording taken from the job advert and backed by real examples",
  ],
  [
    "Contact details",
    "Important details hidden only in a decorative header or footer",
    "Name, phone, email and location placed plainly near the top of the CV",
  ],
];

const templateSections = [
  [
    "Name and contact details",
    "Full name, phone, email, town/city or region, and LinkedIn or portfolio link if relevant.",
  ],
  [
    "Profile",
    "Three to five lines focused on the target role, key evidence and value you bring.",
  ],
  [
    "Key skills",
    "Six to ten skills that match the advert and can be proven elsewhere in the CV.",
  ],
  [
    "Work history",
    "Reverse chronological roles with job title, employer, dates and achievement-led bullet points.",
  ],
  [
    "Education and training",
    "Qualifications, certificates, licences, short courses and recent training relevant to the role.",
  ],
  [
    "Additional information",
    "Optional: driving licence, right to work statement where appropriate, languages, volunteering or systems.",
  ],
];

const checks = [
  "The CV can be understood without colour, icons or decorative layout",
  "Every key skill is backed by a role, project, qualification or example",
  "Dates follow one consistent format",
  "The application accepts PDF before you export",
  "The first page shows the target role, skills and most relevant experience",
  "The CV is tailored to one job family, not every job at once",
];

const relatedLinks = [
  ["CV personal statement UK", "/cv-personal-statement-uk"],
  ["Career change CV UK", "/career-change-cv-uk"],
  ["CV employment gap UK", "/cv-employment-gap-uk"],
  ["Templates", "/templates"],
  ["No-subscription CV builder", "/cv-builder-no-subscription-uk"],
];

export default function AtsCvTemplateUkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <section className="quiet-grid bg-paper py-20 md:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              Editable ATS-friendly CV template UK
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-navy md:text-7xl">
              An ATS-friendly CV template for UK applications.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
              Start with a clean single-column CV, replace the example with
              accurate evidence and tailor it to the vacancy. Preview every page
              before deciding whether to unlock the PDF.
            </p>
            <div className="mt-7 grid gap-3 text-sm font-bold text-navy sm:grid-cols-2">
              {[
                "Standard section headings",
                "Core content in ordinary text",
                "Editable Classic layout",
                "No claimed ATS score or guarantee",
              ].map((item) => (
                <div key={item} className="flex gap-2">
                  <Check className="h-5 w-5 shrink-0 text-success" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={editorHref}>Use the ATS-friendly template</ButtonLink>
              <ButtonLink href="#ats-checklist" variant="secondary">
                Check my approach
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-4 shadow-soft md:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-dark">
                  Editable example
                </p>
                <p className="mt-1 font-bold text-navy">Classic single-column CV</p>
              </div>
              <Link href={editorHref} className="inline-flex items-center gap-2 text-sm font-bold text-navy">
                Edit this CV <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="template-page-preview overflow-hidden rounded-lg border border-line bg-[#eef6f3] p-3">
              <div className="gallery-preview-document pointer-events-none mx-auto" style={{ width: 794 }}>
                <CvDocument cv={atsCv} compactPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-page grid gap-4 py-5 md:grid-cols-2">
          <div className="flex gap-3 text-sm leading-6 text-ink">
            <ShieldCheck className="h-5 w-5 shrink-0 text-gold" />
            <p><strong className="text-navy">No false promise:</strong> no template can guarantee parsing, ranking or an interview.</p>
          </div>
          <div className="flex gap-3 text-sm leading-6 text-ink">
            <FileText className="h-5 w-5 shrink-0 text-gold" />
            <p><strong className="text-navy">PDF only:</strong> check the application accepts PDF before paying for the WorkCV export.</p>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <SectionLabel>Principles</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            The best ATS CV template is boring in the right places.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            National Careers Service guidance uses familiar sections such as an
            introduction, work history and education. Prospects advises using
            job-description terms accurately, identifying qualifications by name
            and avoiding images, logos and graphics in ATS-focused applications.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {principles.map((principle) => {
              const Icon = principle.icon;
              return (
                <div key={principle.title} className="rounded-xl border border-line bg-white p-6">
                  <Icon className="h-7 w-7 text-gold" />
                  <h3 className="mt-5 font-display text-2xl font-semibold text-navy">
                    {principle.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted">{principle.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="ats-checklist" className="scroll-mt-16 bg-paper py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.86fr_1.14fr]">
          <div>
            <SectionLabel>Template structure</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Use sections that both humans and systems expect.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              This structure works for most UK job applications. Keep the order
              stable, then tailor the words inside each section to the job.
            </p>
          </div>

          <div className="divide-y divide-line rounded-xl border border-line bg-white">
            {templateSections.map(([title, body]) => (
              <div key={title} className="grid gap-3 p-5 sm:grid-cols-[190px_1fr]">
                <h3 className="font-display text-xl font-semibold text-navy">{title}</h3>
                <p className="text-sm leading-7 text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <SectionLabel>File format check</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              The vacancy decides the file format—not the template page.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Prospects warns that ATS compatibility differs and recommends
              checking the advert, application instructions or recruiter for the
              required format. WorkCV currently exports PDF only.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-xl border-2 border-navy bg-white p-6">
              <h3 className="font-display text-2xl font-semibold text-navy">The portal accepts PDF</h3>
              <p className="mt-4 text-sm leading-7 text-muted">Use the template, inspect every exported page and upload the PDF requested by the employer.</p>
            </article>
            <article className="rounded-xl border border-line bg-paper p-6">
              <h3 className="font-display text-2xl font-semibold text-navy">The portal requires DOCX</h3>
              <p className="mt-4 text-sm leading-7 text-muted">Do not purchase a WorkCV PDF for that application. Prepare a DOCX version using a tool that supports the required format.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1fr]">
          <div>
            <SectionLabel>Good vs risky</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Small formatting choices can change readability.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              The goal is not to remove all design. The goal is to make sure the
              design never hides the information the employer is trying to find.
            </p>
          </div>

          <div className="divide-y divide-line rounded-xl border border-line bg-white">
            {goodBad.map(([topic, risky, better]) => (
              <div key={topic} className="grid gap-4 p-5">
                <h3 className="font-display text-xl font-semibold text-navy">{topic}</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <p className="rounded-lg border border-line bg-paper p-4 text-sm leading-7 text-muted">
                    {risky}
                  </p>
                  <p className="rounded-lg border border-line bg-white p-4 text-sm font-bold leading-7 text-navy">
                    {better}
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
            <SectionLabel>Quality check</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Check the CV before you apply.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Before downloading, compare the vacancy with your CV like a
              recruiter searching for evidence. Check that each important term
              is accurate, supported and easy to find in ordinary text.
            </p>
            <div className="mt-8 grid gap-3">
              {checks.map((check) => (
                <div key={check} className="flex gap-3 rounded-xl border border-line bg-white p-4 text-sm font-bold text-navy">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  {check}
                </div>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-xl border border-line bg-white p-6">
            <SlidersHorizontal className="h-7 w-7 text-gold" />
            <h2 className="mt-5 font-display text-2xl font-semibold text-navy">
              Keyword rule
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Use the employer's words where they are accurate. Do not add skills
              you cannot prove. If the advert asks for customer complaints, stock
              rotation or Sage, your CV should show where you have used them.
            </p>
          </aside>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionLabel>Research checked</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Based on current UK CV and ATS guidance.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Last checked 22 June 2026. The advice separates verifiable
              formatting guidance from marketing claims made by ATS scoring
              tools. WorkCV does not assign a fictional universal ATS score.
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
            <a href="https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/how-to-write-a-cv" rel="noreferrer" target="_blank">
              Prospects: how to write a CV and ATS guidance
            </a>
            <a
              href="https://www.reed.co.uk/career-advice/ats-what-you-need-to-know/"
              rel="noreferrer"
              target="_blank"
            >
              Reed: ATS guidance for UK applicants
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

      <FaqSection faqs={faqItems} title="Questions about ATS-friendly UK CV templates." />
      <FinalCta
        heading="Start with the cleanest WorkCV structure."
        body={`Edit the Classic template, tailor it to the vacancy and preview every page. If the employer accepts PDF, unlock this saved CV once for ${site.price}.`}
        primaryHref={editorHref}
        primary="Use the ATS-friendly template"
        secondaryHref="/templates"
        secondary="Compare editable templates"
      />
    </>
  );
}
