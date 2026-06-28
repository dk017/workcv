import type { Metadata } from "next";
import {
  Check,
  FileText,
  Scale,
  Search,
  ShieldCheck,
  Target,
} from "lucide-react";

import { AtsScoreChecker } from "@/components/ats-score-checker";
import { FaqSection, SectionLabel } from "@/components/marketing";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free ATS Score Checker UK - Match Your CV to a Job",
  description:
    "Paste a UK job description and your CV to check exact keyword coverage. See matched and missing skills, qualifications, job titles and action verbs.",
  alternates: { canonical: "/tools/ats-score-checker" },
  openGraph: {
    title: "Free UK ATS Keyword Match Checker",
    description:
      "Compare your CV with a job advert in your browser. Get a transparent keyword match score and a prioritised gap list.",
    url: "/tools/ats-score-checker",
  },
};

const faqItems = [
  {
    question: "Is this a real ATS score?",
    answer:
      "It is a transparent keyword-coverage estimate, not a score from an employer's applicant tracking system. ATS products and recruiter settings differ, so no public checker can guarantee the score or decision an employer will produce.",
  },
  {
    question: "How is the match percentage calculated?",
    answer:
      "The checker extracts recognised job titles, skills and tools, qualifications, certifications and action verbs from the advert. Terms near words such as essential, required or must, and terms repeated in the advert, receive more weight. It then checks for those terms and common word variations in your CV.",
  },
  {
    question: "Should I add every missing keyword?",
    answer:
      "No. Add a missing term only if it accurately describes your experience, qualification or skill. Where it is true, use it naturally in a bullet that shows what you did and the result. Never claim a qualification or capability you do not have.",
  },
  {
    question: "Does WorkCV save the text I paste?",
    answer:
      "No. This checker runs in your browser and does not upload or save either text input. Clearing the page removes the pasted content.",
  },
  {
    question: "Does this check whether my CV file can be parsed?",
    answer:
      "No. Pasted text cannot reveal layout or file-format problems. Follow the vacancy instructions and use a clean text-based file. If the employer requires DOCX, do not submit a PDF instead.",
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
  name: "WorkCV ATS Score Checker",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: `${site.url}/tools/ats-score-checker`,
  description:
    "A private browser-based tool that compares the keyword coverage of a CV with a job description.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "GBP",
  },
};

export default function AtsScoreCheckerPage() {
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
              Check how closely your CV matches the job advert.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              Get a transparent keyword match score, then see the job titles,
              skills, qualifications and action verbs found or missing. No
              account, upload or AI analysis.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-success" />
                Runs in your browser
              </span>
              <span className="flex items-center gap-2">
                <Target className="h-5 w-5 text-gold" />
                Job-specific result
              </span>
              <span className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-[#63788c]" />
                Scoring method explained
              </span>
            </div>
          </div>

          <div className="mt-10 rounded-lg border border-line-strong bg-surface p-5 shadow-soft md:p-7">
            <AtsScoreChecker />
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <SectionLabel>How to use the result</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Treat the score as a coverage check, not a pass mark.
            </h2>
            <p className="mt-6 text-base leading-8 text-muted">
              Employers configure recruitment systems differently, and people
              still assess the strength and truth of your evidence. This tool
              deliberately shows its inputs and outputs instead of claiming to
              predict an interview.
            </p>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {[
              {
                icon: Search,
                title: "Start with essential gaps",
                body: "Review terms marked Essential first. The checker assigns this label when a term appears near wording such as essential, required, must or proven.",
              },
              {
                icon: Check,
                title: "Add evidence, not a keyword list",
                body: "Where a missing term is true, connect it to a role, project, qualification or measurable result. Context helps the recruiter judge your actual capability.",
              },
              {
                icon: FileText,
                title: "Check the final file separately",
                body: "Pasted text cannot test parsing or layout. Follow the advert's file instructions and make sure the submitted PDF or DOCX contains selectable text.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="grid gap-4 py-6 sm:grid-cols-[48px_1fr]">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-paper text-navy">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-navy">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-muted">{item.body}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionLabel>Evidence checked</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-navy md:text-5xl">
              Why the checker focuses on these terms.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-muted">
              UK careers guidance recommends tailoring a CV to the job advert
              and naming relevant qualifications. Recruiter and ATS guidance
              also identifies job titles, skills, certifications and exact
              terminology as searchable information. The sources below support
              the method; WorkCV&apos;s score bands are guidance, not an industry
              standard.
            </p>
            <p className="mt-4 text-sm font-bold text-navy">
              Research reviewed 28 June 2026.
            </p>
          </div>
          <div className="grid content-start gap-3 text-sm font-bold text-navy">
            <a
              href="https://nationalcareers.service.gov.uk/careers-advice/cv-sections"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-line bg-white p-4 hover:border-navy"
            >
              National Careers Service: tailor your CV to the advert
            </a>
            <a
              href="https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/how-to-write-a-cv/"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-line bg-white p-4 hover:border-navy"
            >
              Prospects: ATS keywords, qualifications and file formats
            </a>
            <a
              href="https://careers.roche.com/global/en/resume-parsing-faq"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-line bg-white p-4 hover:border-navy"
            >
              Roche: what recruiters can search in parsed CVs
            </a>
            <a
              href="https://support.applicant-tracking.com/support/solutions/articles/3000034441-using-keywords-and-tags-to-organize-applicants-by-skill-experience"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-line bg-white p-4 hover:border-navy"
            >
              Applicant Tracking Software: job-level keyword searching
            </a>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqItems} title="ATS keyword checker questions." />
    </>
  );
}

