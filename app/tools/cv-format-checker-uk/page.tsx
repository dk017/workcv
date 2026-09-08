import type { Metadata } from "next";

import { CareerToolPage } from "@/components/career-tool-page";

const path = "/tools/cv-format-checker-uk";
export const metadata: Metadata = {
  title: "Free CV Format Checker UK - Check ATS Text Structure",
  description: "Check the text structure of a UK CV for clear headings, dates, bullets, contact details and common ATS warning signals. Free and private in your browser.",
  alternates: { canonical: path },
  openGraph: { title: "Free UK CV Format Checker", description: "Check your pasted CV for clear, scannable text structure before you apply.", url: path },
};

export default function CvFormatCheckerPage() {
  return <CareerToolPage path={path} tool="format" eyebrow="Free CV format checker UK" title="Check whether your CV text is clear before an ATS or recruiter sees it." intro="Paste selectable text from your CV and get a practical check for section headings, dates, contact details, evidence and common parsing warnings. Then carry the source into a clean editable CV." description="Pasted text cannot show every visual file problem, so the result tells you what to inspect in your real PDF or DOCX as well as what the text already communicates." howItHelps="A quick text check catches small structure problems before they become an application problem." links={[["Check vacancy match", "/tools/ats-score-checker"], ["Shorten a CV", "/tools/cv-shortener-uk"], ["Open the existing CV converter", "/tools/uk-cv-converter"]]} faqs={[{ question: "Does this check the actual ATS used by an employer?", answer: "No. It checks pasted text for common structure and parsing signals. Employer systems differ, and the actual file still needs a visual and text review." }, { question: "Can I upload a PDF?", answer: "The free checker uses selectable pasted text so it can run privately in your browser. You can use WorkCV's authenticated editor import flow for a PDF or DOCX, then review the extracted fields." }, { question: "What should a UK CV include?", answer: "A clear profile, relevant experience or projects, education or qualifications, skills, dates and reachable contact details are common starting points. Tailor the final structure to the vacancy." }]} />;
}
