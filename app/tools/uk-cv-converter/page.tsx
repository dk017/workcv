import type { Metadata } from "next";

import { CareerToolPage } from "@/components/career-tool-page";

const path = "/tools/uk-cv-converter";
export const metadata: Metadata = {
  title: "Free Resume to UK CV Converter - UK Format Tool",
  description: "Convert pasted resume text into a clearer UK CV structure. Rename common headings, apply safe UK spelling and flag unnecessary personal details for review.",
  alternates: { canonical: path },
  openGraph: { title: "Free Resume to UK CV Converter", description: "Adapt your existing resume wording and structure for a UK application.", url: path },
};

export default function UkCvConverterPage() {
  return <CareerToolPage path={path} tool="converter" eyebrow="Resume to UK CV converter" title="Adapt an existing resume for a UK application without rewriting your history." intro="Paste your existing resume and get a clearer UK structure, safer section headings, UK spelling suggestions and a review list for unnecessary personal details." description="The converter changes presentation, not your qualifications or work history. Keep official job titles and awards accurate, and follow the vacancy's requested file format and eligibility questions separately." howItHelps="Keep the facts, then make the document easier to read in the UK." links={[["How to convert an overseas resume", "/convert-resume-to-uk-cv"], ["Word or PDF guidance", "/cv-word-or-pdf-uk"], ["Open the converted CV", "/editor?template=classic&new=1"]]} faqs={[{ question: "Does this make my experience UK experience?", answer: "No. It changes presentation and flags common personal-detail lines. It does not relabel employers, qualifications or locations." }, { question: "What personal details should I review?", answer: "Age, date of birth, marital status, nationality, passport or National Insurance numbers, photographs and full address details are not normally needed on a standard UK CV." }, { question: "Should I change my qualification name?", answer: "Keep the qualification as awarded. Add a plain-language explanation only when you can do so accurately, and use formal comparison services when an employer requires one." }]} />;
}
