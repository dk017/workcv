import type { Metadata } from "next";

import { CareerToolPage } from "@/components/career-tool-page";

const path = "/tools/cv-shortener-uk";
export const metadata: Metadata = {
  title: "Free CV Shortener UK - Cut Your CV to Two Pages",
  description: "Get a browser-based suggested shorter CV draft. Remove repetition while keeping headings, dates and evidence for a UK job application.",
  alternates: { canonical: path },
  openGraph: { title: "Free UK CV Shortener", description: "Tighten a long CV while preserving the evidence that matters to the vacancy.", url: path },
};

export default function CvShortenerPage() {
  return <CareerToolPage path={path} tool="shorten" eyebrow="Free CV shortener UK" title="Cut the repetition while keeping the evidence." intro="Paste a long CV, choose a target text range and edit the suggested shorter version. The tool protects headings, dates and stronger evidence signals, then lets you preview a clean draft." description="Two pages is a useful target for many standard applications, but it is not a universal rule. The final page count depends on the actual template, font, spacing and employer instructions." howItHelps="Make a shorter CV feel more focused, not more cramped." links={[["Two-page CV worked example", "/shorten-cv-to-two-pages"], ["Check CV word count", "/tools/cv-word-count-checker"], ["Open the shorter CV in the editor", "/editor?template=classic&new=1"]]} faqs={[{ question: "Will the tool guarantee a two-page CV?", answer: "No. It suggests text edits and reports word counts. Preview the actual PDF or DOCX to confirm the rendered page count." }, { question: "Does it delete important information?", answer: "It uses simple text signals and the output is editable. Review every suggested deletion and restore any evidence the vacancy requires." }, { question: "Should every CV be two pages?", answer: "No. One page may suit early-career applicants, while academic or specialist applications can require more. Follow the employer's instructions and keep relevant evidence." }]} />;
}
