import type { Metadata } from "next";
import { CheckerWorkedExample } from "@/components/content-worked-examples";
import Link from "next/link";
import { CustomerAnswer, CustomerQuestionNav } from "@/components/customer-answer";
import { CvTextExample } from "@/components/cv-guide";
import { anonymisedCvExample } from "@/lib/customer-answer-examples";
import { customerQuestionHref } from "@/lib/customer-questions";
import { customerContentReview, displayReviewDate } from "@/lib/customer-content-review";
import {
  Check,
  FileText,
  Scale,
  Search,
  ShieldCheck,
  Target,
} from "lucide-react";

import { AtsScoreChecker } from "@/components/ats-score-checker";
import { FaqSection, FinalCta, RelatedLinksSection, SectionLabel } from "@/components/marketing";
import { commercialRoutes, site } from "@/lib/site";
import { analyticsPlacements } from "@/lib/analytics-placements";

export const metadata: Metadata = {
  title: "Free ATS CV Checker UK - Match Your CV to a Job",
  description:
    "See how clearly your CV communicates fit for a UK vacancy. Get a fixed-weight score, requirement evidence, keyword gaps and three priority improvements.",
  alternates: { canonical: "/tools/ats-score-checker" },
  openGraph: {
    title: "Free ATS CV Checker UK",
    description:
      "Compare your CV with a vacancy. Get an evidence-led fit assessment, transparent score and three priority improvements.",
    url: "/tools/ats-score-checker",
  },
};

const faqItems = [
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
      "WorkCV sends the submitted CV text and job advert to OpenAI for processing; it does not include your CV text in analytics. If you carry selected results into the editor, that draft and vacancy context can be saved to your account. Remove unnecessary personal details and read the privacy policy before submitting.",
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
               Free ATS CV checker: see how well your CV matches a UK job.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              Get a transparent five-part score, see which vacancy requirements
              are evidenced, and leave with three specific improvements. No
              account required.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-success" />
                Remove personal details first
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

      <CustomerQuestionNav ids={["Q11", "Q12", "Q21"]} />
      <section className="bg-paper py-16"><div className="container-page max-w-5xl space-y-14">
        <CustomerAnswer questionId="Q11">
          <p>The result has five explained dimensions: vacancy relevance (35 points), evidence and achievements (25), role clarity (20), readable content structure (10) and completeness (10). WorkCV calculates the result from its assessment; a different employer’s process can differ. Pasted text also cannot show the source file’s columns, fonts or reading order.</p>
          <p>Use the <Link className="font-semibold underline" href={customerQuestionHref("Q12")}>specific improvement steps</Link> and check the <Link className="font-semibold underline" href="/cv-word-or-pdf-uk">submitted file separately</Link>.</p>
        </CustomerAnswer>
        <CustomerAnswer questionId="Q12">
          <ol className="list-decimal space-y-2 pl-6"><li>Check essential gaps first. Alex’s fictional Birch Office Services vacancy names Sage as essential, but the supplied CV does not evidence it. Do not insert a false skill.</li><li>Make the supported Excel tracker and customer-email tasks prominent; add an outcome only if you know it.</li><li>Replace a generic profile with a factual retail-to-admin target while keeping the original retail title and dates.</li></ol>
          <p>The worked calculation below uses an editorial fixture and the current WorkCV scoring function. A live assessment can differ. <Link className="font-semibold underline" href="/tools/job-application-pack-uk">Review tailored edits in the application pack</Link> after you understand the evidence.</p>
        </CustomerAnswer>
        <CustomerAnswer questionId="Q21">
          <CvTextExample title="What an anonymised input can look like" text={anonymisedCvExample} />
          <p>Leave useful task evidence in place, but replace contact information and consider placeholder employer names for confidential material. A combination of remaining details can still identify someone, so placeholders are not a guarantee of anonymity. Do not include other people’s private contact details.</p>
          <p>For a check, the text you submit goes to WorkCV’s server and then to OpenAI for processing. The checker reads pasted text rather than the original file layout. Read our <Link className="font-semibold underline" href="/privacy">privacy policy</Link> before submitting personal data.</p>
        </CustomerAnswer>
        <p className="text-sm text-muted">Reviewed <time dateTime={customerContentReview["/tools/ats-score-checker"]}>{displayReviewDate(customerContentReview["/tools/ats-score-checker"])}</time>.</p>
      </div></section>
      <CheckerWorkedExample />
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

      <RelatedLinksSection
        title="Keep improving your CV."
        links={[
          ["Write stronger CV bullets", "/tools/cv-bullet-point-generator"],
          ["Check keyword balance", "/tools/cv-keyword-density-checker"],
          ["Use an ATS CV template", "/ats-cv-template-uk"],
          ["Read the UK CV guide", "/how-to-write-a-cv-uk"],
          ["Build without a subscription", commercialRoutes.moneyPage],
        ]}
      />
      <FaqSection faqs={faqItems} title="ATS CV checker questions." />
      <FinalCta
        heading="Turn the evidence you found into a clearer CV."
        body={`Carry your genuine experience into a guided UK CV, preview the pages, and pay ${site.price} only if you download the PDF.`}
        primaryHref="/editor?from=ats-checker"
        primary="Continue in the CV editor"
        secondaryHref={commercialRoutes.moneyPage}
        secondary="See the no-subscription builder"
        trackingContext={analyticsPlacements.atsFinal}
      />
    </>
  );
}
