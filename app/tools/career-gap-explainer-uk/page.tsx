import type { Metadata } from "next";

import { CareerToolPage } from "@/components/career-tool-page";

const path = "/tools/career-gap-explainer-uk";
export const metadata: Metadata = {
  title: "Employment Gap CV Explainer UK - Free Career Break Tool",
  description: "Write a brief, factual employment-gap line for a UK CV and a readiness sentence for your profile. Free private browser tool with no signup.",
  alternates: { canonical: path },
  openGraph: { title: "Free UK Employment Gap CV Explainer", description: "Give an employment gap context without making it the headline of your CV.", url: path },
};

export default function CareerGapExplainerPage() {
  return <CareerToolPage path={path} tool="gap" eyebrow="Employment gap CV explainer UK" title="Explain an employment gap once, then bring the focus back to your current fit." intro="Add a neutral reason, dates and any recent learning or activity. The tool creates a short timeline line and a separate profile sentence you can edit before using." description="A gap does not need an apology or private disclosure. The useful aim is a clear timeline, an honest readiness signal and evidence that is relevant to the role you want now." howItHelps="Give the timeline context without letting it dominate the CV." links={[["Employment gap guidance", "/cv-employment-gap-uk"], ["Return-to-work CV guide", "/return-to-work-cv-uk"], ["Add the wording to my CV", "/editor?template=classic&new=1"]]} faqs={[{ question: "Do I have to explain every gap?", answer: "No. A short gap may be clear from month-and-year dates. Add a brief line when a longer gap needs context or when it helps show current readiness." }, { question: "Do I need to share medical or family details?", answer: "No. Keep the wording to the level of detail you are comfortable sharing. You can use a neutral label and focus on current preparation." }, { question: "What should I do after writing the gap line?", answer: "Place it in the timeline, bring recent skills and evidence higher on the CV, tailor the document to the vacancy and check the final file." }]} />;
}
