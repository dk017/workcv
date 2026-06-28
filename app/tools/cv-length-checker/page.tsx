import type { Metadata } from "next";
import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Ruler,
  ShieldCheck,
} from "lucide-react";

import { CvLengthChecker } from "@/components/cv-length-checker";
import { FaqSection, SectionLabel } from "@/components/marketing";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free CV Length Checker UK - Word and Page Estimate",
  description:
    "Paste your CV to count its words, estimate A4 pages and get a UK-focused Too Short, Good Length or Too Long verdict with practical editing steps.",
  alternates: { canonical: "/tools/cv-length-checker" },
  openGraph: {
    title: "Free UK CV Length Checker",
    description:
      "Count your CV words, estimate its A4 page length and get practical UK-focused editing guidance.",
    url: "/tools/cv-length-checker",
  },
};

const faqItems = [
  {
    question: "How long should a UK CV be?",
    answer:
      "One or two complete A4 pages is a practical general range. Two pages is common for experienced applicants, while one page can work for school leavers, students, recent graduates or anyone with limited relevant experience. Follow a specific employer instruction when one is provided.",
  },
  {
    question: "How many words should a two-page CV contain?",
    answer:
      "There is no official word limit. Reed says most two-page CVs fall between roughly 700 and 1,000 words. WorkCV uses 300 to 800 words as a concise general guide and estimates one page per 400 words, but layout choices can substantially change the actual page count.",
  },
  {
    question: "Is a one-page CV too short in the UK?",
    answer:
      "Not automatically. A complete, relevant one-page CV can suit a school leaver, student, recent graduate or applicant with limited experience. It can also suit sectors that explicitly prefer one page. Do not pad a CV merely to reach two pages.",
  },
  {
    question: "Can a CV be longer than two pages?",
    answer:
      "Sometimes. Academic, research, medical and some senior specialist CVs may need additional sections such as publications, teaching, grants or clinical work. General commercial applications usually benefit from tighter editing unless the employer requests more detail.",
  },
  {
    question: "Does WorkCV save the CV text I paste?",
    answer:
      "No. The length calculation runs in your browser. The pasted text is not uploaded or saved by this tool.",
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

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "WorkCV UK CV Length Checker",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: `${site.url}/tools/cv-length-checker`,
  description:
    "A private browser-based tool that counts CV words, estimates A4 pages and provides UK-focused length guidance.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
};

export default function CvLengthCheckerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />

      <section className="quiet-grid border-b border-line bg-paper py-14 md:py-20">
        <div className="container-page">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-navy">
              Free UK CV tool
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.06] text-navy md:text-6xl">
              Is your CV too short, too long or ready to send?
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              Paste your CV to get its exact word count, an estimated A4 page
              length and a practical editing plan based on current UK guidance.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-success" />
                Runs in your browser
              </span>
              <span className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-gold" />
                Word and page estimate
              </span>
              <span className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[#63788c]" />
                Result-specific actions
              </span>
            </div>
          </div>

          <div className="mt-10 rounded-lg border border-line-strong bg-surface p-5 shadow-soft md:p-7">
            <CvLengthChecker />
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page">
          <SectionLabel>Interpret the number</SectionLabel>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
                Relevance decides the right length.
              </h2>
              <p className="mt-6 text-base leading-8 text-muted">
                A word count can identify an unusually thin or dense draft, but
                it cannot decide whether the content earns its place. Use the
                result as an editing trigger, then judge each line against the
                vacancy.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                {
                  icon: GraduationCap,
                  title: "Early career",
                  body: "A complete one-page CV can work for school leavers, students and recent graduates with limited experience.",
                },
                {
                  icon: Briefcase,
                  title: "Most professionals",
                  body: "Two pages is the common UK standard, with the strongest and most relevant evidence on page one.",
                },
                {
                  icon: BookOpen,
                  title: "Specialist exceptions",
                  body: "Academic, research and some medical CVs can run longer because publications and specialist sections add necessary detail.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="border-t-2 border-navy pt-5">
                    <Icon className="h-6 w-6 text-gold" />
                    <h3 className="mt-4 font-display text-2xl font-semibold text-navy">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted">{item.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionLabel>Evidence checked</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              The guidance behind the result.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-muted">
              The University of Edinburgh calls two pages standard for UK CVs.
              Reed reports that 91% of recruiters in its survey selected two
              pages as ideal and says most two-page CVs contain roughly 700 to
              1,000 words. The University of Reading advises one or two complete
              pages and identifies longer academic CVs as an exception.
            </p>
            <p className="mt-4 text-sm leading-7 text-muted">
              WorkCV&apos;s 300–800 word bands and 400-word page estimate are
              editorial guidance, not official limits. Formatting and employer
              requirements take priority.
            </p>
            <p className="mt-4 text-sm font-bold text-navy">
              Research reviewed 28 June 2026.
            </p>
          </div>
          <div className="grid content-start gap-3 text-sm font-bold text-navy">
            <a
              href="https://careers.ed.ac.uk/cvs-and-applications/building-your-cv"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-line bg-white p-4 hover:border-navy"
            >
              University of Edinburgh: UK CV length
            </a>
            <a
              href="https://www.reed.co.uk/career-advice/how-long-should-a-cv-be/"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-line bg-white p-4 hover:border-navy"
            >
              Reed: recruiter survey and typical word range
            </a>
            <a
              href="https://www.reading.ac.uk/essentials/Careers/Applications-and-interviews/Applications/CV-Overview"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-line bg-white p-4 hover:border-navy"
            >
              University of Reading: one, two and academic CVs
            </a>
            <a
              href="https://www.nottingham.ac.uk/careers/students/applications/cvs/checklist.aspx"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-line bg-white p-4 hover:border-navy"
            >
              University of Nottingham: student CV checklist
            </a>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqItems} title="UK CV length questions." />
    </>
  );
}
