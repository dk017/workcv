import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, FileText, Ruler, Scissors } from "lucide-react";

import { CvLengthChecker } from "@/components/cv-length-checker";
import { ButtonLink, FaqSection, SectionLabel } from "@/components/marketing";
import { analyticsPlacements } from "@/lib/analytics-placements";
import { cvLengthMeasurement } from "@/lib/cv-length-measurements";
import { site } from "@/lib/site";

const path = "/how-long-should-a-cv-be-uk";
const reviewed = "29 September 2026";

export const metadata: Metadata = {
  title: "How Long Should a CV Be? UK Pages and Word Count",
  description:
    "Two A4 pages for most UK CVs, one for school leavers and many graduates. Measured word counts per page, a free length check and how to cut to two pages.",
  alternates: { canonical: path },
  openGraph: {
    title: "How Long Should a CV Be in the UK?",
    description: "Pages and word counts by career stage, measured in real CV layouts, with a free length check.",
    url: path,
  },
};

const byStage = [
  ["School leaver or student", "1 page", "about 250–350", "Education, part-time work, volunteering and skills with an example for each."],
  ["Graduate or early career", "1–2 pages", "about 300–700", "Degree, projects and placements first; one page if your work history is short."],
  ["Most experienced applicants", "2 pages", "about 500–800", "Recent roles in detail; older roles summarised in a line or two."],
  ["Senior roles with long histories", "2, sometimes 3 pages", "up to about 1,000", "Only where the extra page is relevant evidence, not a longer list of duties."],
  ["Academic and some medical roles", "Longer, as the employer asks", "varies", "Publications, research or clinical detail in the format the application requests."],
];

const cuts = [
  ["Summarise older roles", "Prospects suggests summarising detail from more than ten years ago. Keep the title, employer and dates, and cut the bullets."],
  ["Keep each role short", "The National Careers Service suggests describing what you did in each role in about two to three lines. Cut repeated duties and keep the detail for recent, relevant jobs."],
  ["Remove personal details", "Leave out age, date of birth, marital status, nationality and a photo. UK guidance says not to include them."],
  ["Drop \"References available on request\"", "Employers ask for referees when they need them. The line takes space and adds nothing."],
  ["Merge thin sections", "Short hobby, language or IT sections can become one line in Skills or Additional information."],
  ["Tighten, don't shrink", "Cut words before shrinking the font or margins. Very small text and cramped margins make a CV harder to read, especially on screen."],
];

const faqs = [
  {
    question: "Is a one-page CV acceptable in the UK?",
    answer: "Yes, especially for school leavers, students and graduates with little work history. Two pages is the usual length for experienced applicants, so don't cut relevant evidence just to fit one page.",
  },
  {
    question: "Can a UK CV be three pages?",
    answer: "Sometimes. Prospects says a three-page CV might be needed for high-level roles with extensive experience, and academic CVs are often longer. For most applicants, a third page means some older or less relevant detail can be summarised.",
  },
  {
    question: "How many words should a two-page CV be?",
    answer: `In our measurements of real CV layouts, a third page started at about ${cvLengthMeasurement.designs[2].thirdPageFrom}–${cvLengthMeasurement.designs[0].thirdPageFrom} words, depending on the design. Around 500–800 words is a practical target for two pages at a readable font size.`,
  },
  {
    question: "Does CV length matter for applicant tracking systems?",
    answer: "Length alone is not usually the issue. What matters is that the file can be read (a text-based PDF or Word file) and that your CV clearly evidences what the advert asks for. Follow any length or format limits the application gives.",
  },
  {
    question: "How far back should a CV go?",
    answer: "Give the most detail to recent, relevant roles. Summarise older jobs, for example those from more than ten years ago, in a line with the title, employer and dates, unless they are directly relevant to the job.",
  },
  {
    question: "How long should a CV personal statement and cover letter be?",
    answer: "A personal statement is usually three to five lines. A cover letter should fit on one A4 page, typically three to five short paragraphs.",
  },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How long should a CV be in the UK?",
    description: metadata.description,
    datePublished: "2026-09-29",
    dateModified: "2026-09-29",
    author: { "@type": "Organization", name: "WorkCV Editorial Team", url: site.url },
    publisher: { "@type": "Organization", name: "WorkCV", url: site.url },
    mainEntityOfPage: `${site.url}${path}`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  },
];

export default function HowLongShouldACvBePage() {
  return (
    <>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <section className="quiet-grid border-b border-line bg-paper py-14 md:py-20">
        <div className="container-page max-w-4xl">
          <SectionLabel>CV length UK</SectionLabel>
          <h1 className="font-display text-4xl font-semibold leading-[1.06] text-navy md:text-6xl">How long should a CV be in the UK?</h1>
          <div className="mt-8 rounded-xl border-2 border-navy bg-white p-6 md:p-8">
            <p className="text-lg leading-8 text-navy">
              <strong>Two A4 pages for most people.</strong> One page is fine for school leavers, students and many
              graduates. Three pages only suits some senior, academic or medical roles with a lot of relevant evidence.
            </p>
            <p className="mt-3 text-base leading-7 text-muted">
              In real CV layouts, that is roughly up to 300–360 words for one page and 700–840 words for two at a
              readable font size. Relevance matters more than hitting a number.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-navy">
            <span className="flex items-center gap-2"><Ruler className="h-5 w-5 text-gold" />Measured in real layouts</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-success" />Free length check below</span>
            <span className="flex items-center gap-2"><FileText className="h-5 w-5 text-[#63788c]" />Reviewed {reviewed}</span>
          </div>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container-page max-w-5xl">
          <SectionLabel>By career stage</SectionLabel>
          <h2 className="font-display text-3xl font-semibold text-navy md:text-4xl">CV length for your situation.</h2>
          <div className="mt-8 overflow-x-auto rounded-xl border border-line bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-paper text-navy">
                <tr>
                  <th scope="col" className="p-4">You are</th>
                  <th scope="col" className="p-4">Pages</th>
                  <th scope="col" className="p-4">Words</th>
                  <th scope="col" className="p-4">Focus on</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {byStage.map(([stage, pages, words, focus]) => (
                  <tr key={stage}>
                    <th scope="row" className="p-4 font-bold text-navy">{stage}</th>
                    <td className="p-4 font-bold text-navy">{pages}</td>
                    <td className="p-4 text-muted">{words}</td>
                    <td className="p-4 leading-6 text-muted">{focus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">
            Prospects recommends no more than two A4 pages for most CVs while noting that one size doesn&apos;t fit all,
            and that three pages might be needed for high-level roles. Always follow any limit in the job advert.
          </p>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-16">
        <div className="container-page grid max-w-5xl gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionLabel>Our measurements</SectionLabel>
            <h2 className="font-display text-3xl font-semibold text-navy md:text-4xl">How many words fit on a page?</h2>
            <p className="mt-4 leading-7 text-muted">
              Word-count advice varies a lot, so we measured it. We printed fictional CVs of increasing length to A4 in
              three standard CV designs and counted the words from each PDF.
            </p>
            <p className="mt-4 text-sm leading-6 text-muted">
              Method: {cvLengthMeasurement.method} Measured {cvLengthMeasurement.measuredOn}. Your numbers will vary
              with font, spacing and how many short lines (dates, headings) your CV has.
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-line bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-navy">
                <tr>
                  <th scope="col" className="p-4">Design</th>
                  <th scope="col" className="p-4">Fits on 1 page</th>
                  <th scope="col" className="p-4">Fits on 2 pages</th>
                  <th scope="col" className="p-4">Third page from</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {cvLengthMeasurement.designs.map((design) => (
                  <tr key={design.name}>
                    <th scope="row" className="p-4 font-bold text-navy">{design.name}</th>
                    <td className="p-4 text-muted">up to ~{design.onePageMax} words</td>
                    <td className="p-4 text-muted">up to ~{design.twoPageMax} words</td>
                    <td className="p-4 text-muted">~{design.thirdPageFrom} words</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="check-length" className="bg-surface py-16">
        <div className="container-page max-w-5xl">
          <SectionLabel>Check your CV</SectionLabel>
          <h2 className="font-display text-3xl font-semibold text-navy md:text-4xl">Paste your CV to check its length.</h2>
          <p className="mt-3 leading-7 text-muted">Free, no signup. Your text is checked in your browser.</p>
          <div className="mt-6 rounded-lg border border-line-strong bg-white p-5 shadow-soft md:p-7">
            <CvLengthChecker />
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper py-16">
        <div className="container-page max-w-5xl">
          <SectionLabel>Too long?</SectionLabel>
          <h2 className="font-display text-3xl font-semibold text-navy md:text-4xl">Six ways to cut a CV to two pages.</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-2">
            {cuts.map(([title, body], index) => (
              <li key={title} className="flex gap-4 rounded-lg border border-line bg-white p-5">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gold-tint text-sm font-bold text-navy">{index + 1}</span>
                <div>
                  <h3 className="font-bold text-navy">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/shorten-cv-to-two-pages" variant="secondary" trackingLabel={analyticsPlacements.cvLengthGuideShorten}>
              See a worked two-page edit
            </ButtonLink>
            <Link href="/tools/cv-shortener-uk" className="inline-flex min-h-12 items-center gap-2 px-2 text-sm font-bold text-navy underline">
              <Scissors className="h-4 w-4" /> Try the CV shortener
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container-page grid max-w-5xl gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <SectionLabel>Sources</SectionLabel>
            <h2 className="font-display text-3xl font-semibold text-navy">What UK guidance says.</h2>
            <ul className="mt-6 space-y-3 leading-7 text-muted">
              <li><strong className="text-navy">Prospects:</strong> keep most CVs to no more than two A4 pages; three may suit high-level roles; summarise detail from more than ten years ago.</li>
              <li><strong className="text-navy">National Careers Service:</strong> be clear and to the point, describe each role in about two to three lines, and leave out age, date of birth, marital status and nationality.</li>
            </ul>
            <p className="mt-6 text-sm font-bold text-navy">Guidance reviewed {reviewed}.</p>
          </div>
          <div className="grid content-start gap-3 text-sm font-bold text-navy">
            <a href="https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/how-to-write-a-cv" target="_blank" rel="noreferrer" className="rounded-md border border-line bg-white p-4 hover:border-navy">Prospects: how to write a CV</a>
            <a href="https://nationalcareers.service.gov.uk/careers-advice/cv-sections" target="_blank" rel="noreferrer" className="rounded-md border border-line bg-white p-4 hover:border-navy">National Careers Service: CV sections</a>
            <Link href="/professional-cv-template-uk" className="rounded-md border border-line bg-white p-4 hover:border-navy">UK CV template</Link>
            <Link href="/cv-personal-statement-uk" className="rounded-md border border-line bg-white p-4 hover:border-navy">CV personal statement examples</Link>
            <Link href="/cover-letter-examples-uk" className="rounded-md border border-line bg-white p-4 hover:border-navy">Cover letter examples</Link>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqs} title="CV length questions." />

      <section className="border-t border-line bg-navy py-16 text-white">
        <div className="container-page max-w-4xl">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">See your page count as you write.</h2>
          <p className="mt-4 leading-7 text-white/85">
            WorkCV&apos;s editor shows a live preview of every A4 page and warns you if your CV runs past two pages, with
            a one-click Compact design. Build and preview free; pay {site.price} once to download your CV and a matching
            cover letter as PDF and Word.
          </p>
          <div className="mt-6">
            <ButtonLink href="/editor?new=1" variant="secondary" trackingLabel={analyticsPlacements.cvLengthGuideEditor}>Start my CV</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
