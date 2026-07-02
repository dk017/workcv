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
  title: "Free AI CV Fit Checker UK - Match Your CV to a Job",
  description:
    "See how clearly your CV communicates fit for a UK vacancy. Get a fixed-weight score, requirement evidence, keyword gaps and three priority improvements.",
  alternates: { canonical: "/tools/ats-score-checker" },
  openGraph: {
    title: "Free UK AI CV Fit Checker",
    description:
      "Compare your CV with a vacancy. Get an evidence-led fit assessment, transparent score and three priority improvements.",
    url: "/tools/ats-score-checker",
  },
};

const faqItems = [
  {
    question: "Is this a real employer ATS score?",
    answer:
      "No. It is a fixed-weight WorkCV assessment of how clearly your supplied CV communicates fit for one vacancy. Employer systems, configurations and human decisions differ, so it does not predict an interview or reproduce a particular ATS.",
  },
  {
    question: "How is the match percentage calculated?",
    answer:
      "The application awards up to 35 points for vacancy relevance, 25 for evidence and achievements, 20 for role clarity, 10 for ATS-readable content structure and 10 for completeness. AI supplies bounded classifications and exact evidence snippets; application code calculates the score.",
  },
  {
    question: "Should I add every missing keyword?",
    answer:
      "No. Add a missing term only if it accurately describes your experience, qualification or skill. Where it is true, use it naturally in a bullet that shows what you did and the result. Never claim a qualification or capability you do not have.",
  },
  {
    question: "Does WorkCV save the text I paste?",
    answer:
      "WorkCV sends the text securely to OpenAI to generate the assessment but does not save the text or include its contents in analytics. OpenAI API data is not used for model training by default. If you choose to carry the result into the editor, the resulting CV draft and vacancy context are saved to your WorkCV account.",
  },
  {
    question: "Does this inspect my CV file layout?",
    answer:
      "No. Pasted text cannot reveal columns, images, tables or file-format problems. Follow the vacancy instructions and use a clean text-based file. If the employer requires DOCX, do not submit a PDF instead.",
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
  name: "WorkCV AI CV Fit Checker",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: `${site.url}/tools/ats-score-checker`,
  description:
    "An evidence-led tool that assesses how clearly a UK CV communicates fit for a job description.",
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
              Will your CV make your fit clear for this vacancy?
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              Get a transparent five-part score, see which vacancy requirements
              are evidenced, and leave with three specific improvements. No
              account required.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-success" />
                No CV text saved
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
              Treat the score as a clarity diagnostic, not a pass mark.
            </h2>
            <p className="mt-6 text-base leading-8 text-muted">
              Employers configure recruitment systems differently, and people
              still assess the truth and strength of your evidence. This tool
              combines transparent checks with one structured AI review instead
              of claiming to predict an interview.
            </p>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {[
              {
                icon: Search,
                title: "Start with the three priorities",
                body: "They identify the highest-impact issues across relevance, evidence, role clarity, structure and completeness. Address only those supported by your real experience.",
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
              Why the assessment focuses on relevance and evidence.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-muted">
              UK careers guidance recommends tailoring a CV to the job advert,
              giving evidence of achievements and naming relevant qualifications.
              Recruiter and ATS guidance also identifies job titles, skills,
              certifications and exact terminology as searchable information.
              WorkCV&apos;s weights and score bands are guidance, not an industry
              standard.
            </p>
            <p className="mt-4 text-sm font-bold text-navy">
              Research reviewed 2 July 2026.
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

      <FaqSection faqs={faqItems} title="AI CV fit checker questions." />
    </>
  );
}
