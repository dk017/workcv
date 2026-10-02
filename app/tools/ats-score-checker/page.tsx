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
import { PassOffer } from "@/components/pass-offer";

export const metadata: Metadata = {
  title: "Free ATS CV Checker UK – Upload Your CV for an Instant Check",
  description:
    "Upload your CV as a PDF or Word file for a free ATS readability check in your browser, or add a job advert to see which keywords and requirements it evidences. No signup.",
  alternates: { canonical: "/tools/ats-score-checker" },
  openGraph: {
    title: "Free ATS CV Checker UK",
    description:
      "Upload a PDF or Word CV for an instant readability check, then add a job advert for a keyword and requirement match.",
    url: "/tools/ats-score-checker",
  },
};

const faqItems = [
  {
    question: "Is this ATS CV checker free?",
    answer:
      "Yes. Both checks are free and need no account. The CV-only check runs in your browser. If you add a job advert, the match assessment runs on WorkCV's server using OpenAI.",
  },
  {
    question: "Can I upload my CV as a PDF or Word file?",
    answer:
      "Yes. Upload a PDF (up to 10 pages) or a Word .docx file up to 5 MB. The file is read in your browser and is not uploaded. Scanned or image-only CVs cannot be read because no OCR is used, so export a fresh copy from Word or your CV builder.",
  },
  {
    question: "Do I need a job description to check my CV?",
    answer:
      "No. Without an advert you get a CV readability check: readable text, length, contact details, section headings, dates, bullet points, UK personal details and, for PDFs, likely two-column layouts. Add an advert to see which requirements and keywords your CV evidences.",
  },
  {
    question: "What is a good ATS score?",
    answer:
      "There is no universal ATS score. Employers set up their recruitment systems differently, and people still read the CV. Use WorkCV's scores as a checklist: fix anything marked Fix, then make sure the advert's essential criteria are clearly evidenced.",
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
      "The CV-only check runs in your browser and sends nothing. For a match with a job advert, WorkCV sends the CV text and advert to OpenAI for processing; it does not include your CV text in analytics. If you carry selected results into the editor, that draft and vacancy context can be saved to your account. Remove unnecessary personal details and read the privacy policy before submitting.",
  },
  {
    question: "Does this inspect my CV file layout?",
    answer:
      "Partly. When you upload a PDF, the check flags pages with little selectable text and likely two-column layouts. It cannot judge images, tables or how a specific employer's system reads your file, and pasted text shows no layout at all. Follow the vacancy instructions; if the employer asks for DOCX, do not send a PDF.",
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
  name: "WorkCV ATS CV Checker",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: `${site.url}/tools/ats-score-checker`,
  description:
    "A free UK ATS CV checker: upload a PDF or Word CV for a browser-based readability check, or add a job advert for an evidence-led keyword and requirement match.",
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
               Free ATS CV checker: upload your CV and see how it reads.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              Upload a PDF or Word CV for an instant readability check in your
              browser. Add a job advert to see which requirements and keywords
              your CV evidences, with three specific improvements. No account
              required.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-success" />
                File read in your browser
              </span>
              <span className="flex items-center gap-2">
                <Target className="h-5 w-5 text-gold" />
                Job advert optional
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
          <p>The result has five explained dimensions: vacancy relevance (35 points), evidence and achievements (25), role clarity (20), readable content structure (10) and completeness (10). WorkCV calculates the result from its assessment; a different employer’s process can differ. When you upload a PDF, the check also flags likely two-column layouts; pasted text cannot show columns, fonts or reading order.</p>
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
      <section className="bg-paper py-20">
        <div className="container-page">
          <SectionLabel>What it checks</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
            Two checks: how your CV reads, and how it matches a job.
          </h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <article className="rounded-lg border border-line bg-white p-6">
              <h3 className="font-display text-2xl font-semibold text-navy">CV only: free, in your browser</h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-muted">
                {[
                  "The text can be selected, not trapped in an image",
                  "Length suits a CV of up to two pages",
                  "An email address and phone number are in the main text",
                  "Plain headings: Profile, Experience, Education, Skills",
                  "Dates for each role, in one consistent format",
                  "Bullet points for duties and achievements",
                  "No date of birth, age, marital status or nationality",
                  "PDFs: likely two-column layouts flagged",
                ].map((item) => (
                  <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />{item}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-lg border border-line bg-white p-6">
              <h3 className="font-display text-2xl font-semibold text-navy">With a job advert: match assessment</h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-muted">
                {[
                  "Which essential requirements your CV evidences",
                  "Advert keywords found and missing, including word variations",
                  "Whether your CV reads as the role being advertised",
                  "A five-part score with the method explained",
                  "Your three highest-impact fixes",
                ].map((item) => (
                  <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />{item}</li>
                ))}
              </ul>
            </article>
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h3 className="font-display text-3xl font-semibold text-navy">Is my CV ATS-friendly?</h3>
              <p className="mt-4 text-base leading-8 text-muted">
                Recruitment systems vary, so no tool can promise a pass. These habits make a CV easier for both systems
                and people to read. The National Careers Service also says UK CVs should leave out your age, date of
                birth, marital status and nationality.
              </p>
            </div>
            <ol className="list-decimal space-y-3 pl-5 text-sm leading-7 text-ink">
              <li>Send the file type the advert asks for, exported from Word or a CV builder, not a scan.</li>
              <li>Use one column, with plain section headings and simple bullet points.</li>
              <li>Keep contact details in the main text rather than in a header image.</li>
              <li>Write job titles, employers and dates on one clear line for each role.</li>
              <li>Mirror the advert&apos;s wording only where it truthfully describes your experience.</li>
            </ol>
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

      <RelatedLinksSection
        title="Keep improving your CV."
        links={[
          ["Tailor your CV: two worked applications", "/tailor-cv-to-job-description-uk"],
          ["Write stronger CV bullets", "/tools/cv-bullet-point-generator"],
          ["Track your job applications", "/tools/job-application-tracker-uk"],
          ["Check keyword balance", "/tools/cv-keyword-density-checker"],
          ["Use an ATS CV template", "/ats-cv-template-uk"],
          ["Read the UK CV guide", "/how-to-write-a-cv-uk"],
          ["Build without a subscription", commercialRoutes.moneyPage],
        ]}
      />
      <PassOffer audience="tailoring" trackingLabel={analyticsPlacements.passAtsChecker} />
      <FaqSection faqs={faqItems} title="ATS CV checker questions." />
      <FinalCta
        heading="Turn the evidence you found into a clearer CV."
        body={`Carry your genuine experience into a guided UK CV, preview the pages, and pay ${site.price} once for the CV and a matching cover letter as PDF and Word.`}
        primaryHref="/editor?from=ats-checker"
        primary="Continue in the CV editor"
        secondaryHref={commercialRoutes.moneyPage}
        secondary="See the no-subscription builder"
        trackingContext={analyticsPlacements.atsFinal}
      />
    </>
  );
}
