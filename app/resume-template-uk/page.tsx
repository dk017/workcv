import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, FileCheck2, FileText, LayoutTemplate, ShieldCheck } from "lucide-react";

import { CvDocument } from "@/components/cv-editor";
import { ButtonLink, FaqSection, FinalCta, SectionLabel } from "@/components/marketing";
import { buildWorkCvProductSchema } from "@/lib/product-schema";
import { getRoleCvTemplate } from "@/lib/role-cv-templates";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume Template UK - Editable UK CV Example",
  description:
    "Use an editable UK resume template with a clear CV structure. Replace the example, preview every page and pay once only if you choose to download.",
  alternates: { canonical: "/resume-template-uk" },
  openGraph: {
    title: "Resume Template UK - Editable WorkCV Example",
    description: "Start with a UK-ready CV structure, tailor the sample and preview the result before paying.",
    url: "/resume-template-uk",
  },
};

const editorHref = "/editor?template=classic&roleTemplate=general&new=1";
const resumeCv = getRoleCvTemplate("general");

const faqs = [
  { question: "Is this a resume or a CV template?", answer: "It is a UK job-application CV template. People searching for a resume template in the UK often need the same document, but UK employers usually use the term CV. Always follow the wording and requirements in the advert." },
  { question: "Can I edit the example?", answer: "Yes. Open the example in the editor and replace every field with your own accurate information. The sample is a starting structure, not wording to submit unchanged." },
  { question: "Is the PDF download free?", answer: `You can start, edit and preview the CV before paying. Downloading the selected saved CV as a PDF costs ${site.price}. It is a one-time purchase for that CV, not a subscription.` },
  { question: "How long should a UK resume be?", answer: "Many standard UK CVs fit within two A4 pages, but there is no useful reason to pad a shorter CV or compress a specialist one. Follow the employer's instructions and include only relevant evidence." },
  { question: "Should I add a photo or date of birth?", answer: "For most UK applications, leave out a photo, age, date of birth, marital status and nationality unless the role or application process has a legitimate, explicit reason to request something different." },
];

const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };
const productSchema = buildWorkCvProductSchema({ description: "An editable UK CV and resume template with one-time PDF purchase and no subscription.", url: "/resume-template-uk" });

const sections = [
  ["Contact details", "Name, phone, professional email and town or region. Add LinkedIn or a portfolio only when relevant."],
  ["Focused profile", "A short introduction connecting your current experience, strongest evidence and target role."],
  ["Relevant skills", "Concrete capabilities reflected in the advert and supported elsewhere in your CV."],
  ["Work history", "Recent roles first, with consistent dates and concise bullets that show what you did and contributed."],
  ["Education and training", "Relevant qualifications, certifications and recent training, ordered for your career stage."],
  ["References", "Follow the employer's instructions; a brief available-on-request line is usually enough for the general CV."],
];

export default function ResumeTemplateUkPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      <section className="bg-surface py-16 md:py-24">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <SectionLabel>Resume template UK</SectionLabel>
            <h1 className="font-display text-5xl font-semibold leading-[0.98] text-navy md:text-7xl">A UK resume template should work like a clear, focused CV.</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted md:text-xl">UK employers usually call it a CV. Start with the editable example, replace every sample with your own evidence and preview every page before you decide whether to pay {site.price} for this saved CV&apos;s PDF.</p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {["Editable UK structure", "Three document layouts", "Preview before payment", "No subscription or renewal"].map((item) => <li key={item} className="flex items-center gap-2 text-sm font-bold text-navy"><Check className="h-5 w-5 text-green" />{item}</li>)}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><ButtonLink href={editorHref}>Use this template</ButtonLink><ButtonLink href="/cv-vs-resume-uk" variant="secondary">CV or resume?</ButtonLink></div>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-4 shadow-sm md:p-6">
            <div className="mb-4 flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-dark">Editable example</p><p className="mt-1 font-bold text-navy">Classic UK CV</p></div><Link href={editorHref} className="inline-flex items-center gap-2 text-sm font-bold text-navy">Open in editor <ArrowRight className="h-4 w-4" /></Link></div>
            <div className="template-page-preview overflow-hidden rounded-lg border border-line bg-[#eef6f3] p-3"><div className="gallery-preview-document pointer-events-none mx-auto" style={{ width: 794 }}><CvDocument cv={resumeCv} compactPreview /></div></div>
          </div>
        </div>
      </section>

      <section className="bg-paper py-20 md:py-24">
        <div className="container-page">
          <SectionLabel>UK CV structure</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">A useful template organises evidence. It does not invent it.</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">National Careers Service guidance covers contact details, an introduction, education, work history and references. Adapt the order and emphasis to your experience and the role.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{sections.map(([title, body]) => <article key={title} className="rounded-xl border border-line bg-white p-5"><FileText className="h-6 w-6 text-gold" /><h3 className="mt-4 font-display text-2xl font-semibold text-navy">{title}</h3><p className="mt-3 text-sm leading-7 text-muted">{body}</p></article>)}</div>
        </div>
      </section>

      <section className="bg-surface py-20 md:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div><SectionLabel>Use the sample properly</SectionLabel><h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">Turn the layout into your application.</h2><p className="mt-5 text-lg leading-8 text-muted">A polished sample can still produce a weak CV when its wording is copied. The value comes from replacing it with accurate, job-relevant evidence.</p></div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {[
              ["1", "Read the advert", "Mark the responsibilities, skills, qualifications and evidence the employer repeats."],
              ["2", "Replace every sample", "Use your real employers, dates, education, tools and outcomes. Delete sections that add no value."],
              ["3", "Choose the clearest layout", "Classic, Modern and Compact change presentation, not the truth or relevance of the content."],
              ["4", "Check the exported pages", "Proofread names, dates, contact details, spacing and page breaks before sending the PDF."],
            ].map(([number, title, body]) => <li key={number} className="list-none rounded-xl border border-line bg-paper p-6"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">{number}</span><h3 className="mt-4 font-display text-2xl font-semibold text-navy">{title}</h3><p className="mt-3 text-sm leading-7 text-muted">{body}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="bg-paper py-20 md:py-24">
        <div className="container-page">
          <SectionLabel>UK, not imported by default</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">Keep the terminology flexible and the application local.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              [LayoutTemplate, "Call it what the employer calls it", "WorkCV uses CV because that is standard UK wording. If an employer asks for a resume, match its terminology and instructions."],
              [FileCheck2, "Use common guidance as a guide", "Two pages is common for standard applications, not a reason to pad, shrink or cut essential specialist evidence."],
              [ShieldCheck, "Leave out unnecessary personal data", "For most UK jobs, omit a photo, age, date of birth, marital status and nationality unless there is a legitimate explicit requirement."],
            ].map(([Icon, title, body]) => { const ItemIcon = Icon as typeof LayoutTemplate; return <article key={title as string} className="rounded-xl border border-line bg-white p-6"><ItemIcon className="h-7 w-7 text-gold" /><h3 className="mt-5 font-display text-2xl font-semibold text-navy">{title as string}</h3><p className="mt-3 text-sm leading-7 text-muted">{body as string}</p></article>; })}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl border-2 border-navy bg-paper p-7"><p className="text-sm font-bold uppercase tracking-[0.14em] text-gold-dark">What WorkCV provides</p><ul className="mt-6 space-y-4">{["An editable UK CV starting point", "Classic, Modern and Compact layouts", "A preview of every generated page", `A ${site.price} one-time PDF unlock for the selected saved CV`].map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-ink"><Check className="h-5 w-5 shrink-0 text-green" />{item}</li>)}</ul></div>
          <div className="rounded-xl border border-line bg-paper p-7"><p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">What a template cannot promise</p><ul className="mt-6 space-y-4">{["A job interview or offer", "A universal format for every employer", "Automatic tailoring without your judgement", "A substitute for checking the exported PDF"].map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-muted"><Check className="h-5 w-5 shrink-0 text-muted" />{item}</li>)}</ul></div>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-page"><SectionLabel>Sources checked</SectionLabel><h2 className="font-display text-4xl font-semibold text-navy">Current UK guidance behind the template.</h2><div className="mt-8 grid gap-4 md:grid-cols-3">{[["Prospects: How to write a CV", "https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/how-to-write-a-cv"], ["National Careers Service: CV sections", "https://nationalcareers.service.gov.uk/careers-advice/cv-sections"], ["GOV.UK: Recruitment and discrimination", "https://www.gov.uk/employer-preventing-discrimination/recruitment"]].map(([label, href]) => <a key={href} href={href} target="_blank" rel="nofollow noopener noreferrer" className="group flex items-center justify-between gap-4 rounded-xl border border-line bg-white p-5 font-bold text-navy transition hover:border-navy">{label}<ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" /></a>)}</div></div>
      </section>

      <section className="bg-surface py-20"><div className="container-page"><SectionLabel>Related guides</SectionLabel><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[["CV vs resume UK", "/cv-vs-resume-uk"], ["No-subscription resume builder", "/resume-builder-uk-no-subscription"], ["Professional CV template", "/professional-cv-template-uk"]].map(([label, href]) => <Link key={href} href={href} className="group flex min-h-24 items-center justify-between gap-4 rounded-xl border border-line bg-paper p-5 font-bold text-navy transition hover:-translate-y-1 hover:border-navy">{label}<ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" /></Link>)}</div></div></section>

      <FaqSection faqs={faqs} title="Questions about UK resume templates." />
      <FinalCta heading="Start with the structure. Make every line yours." body={`Edit and preview the CV before paying. If the selected saved CV is ready, unlock its PDF once for ${site.price}—with no subscription or automatic renewal.`} primaryHref={editorHref} primary="Use this template" secondaryHref="/cv-vs-resume-uk" secondary="Read CV vs resume" />
    </>
  );
}
