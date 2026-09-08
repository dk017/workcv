import type { Metadata } from "next";

import { CareerToolPage } from "@/components/career-tool-page";

const path = "/tools/transferable-skills-translator-uk";
export const metadata: Metadata = {
  title: "Transferable Skills Translator UK - Career Change CV Tool",
  description: "Translate real responsibilities into transferable CV skills for a UK career change. Free browser tool with editable wording and no signup.",
  alternates: { canonical: path },
  openGraph: { title: "Free Transferable Skills Translator UK", description: "Find the skills your previous experience can prove for a new role.", url: path },
};

export default function TransferableSkillsTranslatorPage() {
  return <CareerToolPage path={path} tool="transferable" eyebrow="Transferable skills translator UK" title="Make your previous experience make sense for the role you want next." intro="Describe what you actually did and choose a target role if you have one. The translator maps practical responsibilities to clear, evidence-led CV language." description="Career changes are often a translation problem. This tool gives you a starting vocabulary while keeping the source experience visible, so you can remove anything that is not true or relevant." howItHelps="Translate responsibilities into evidence a new industry can recognise." links={[["Career-change CV guide", "/career-change-cv-uk"], ["Check your vacancy match", "/tools/ats-score-checker"], ["Open a career-change CV", "/editor?template=classic&new=1"]]} faqs={[{ question: "Does it decide which career I should choose?", answer: "No. It identifies possible transferable strengths from the experience you describe. Research the target role and its requirements separately." }, { question: "Can I use suggested wording if I have not done the task?", answer: "No. Keep only statements you can support with a real example, qualification or result." }, { question: "What makes a career-change CV credible?", answer: "A clear target role, a short bridge in the profile, relevant transferable achievements and honest dates and job titles." }]} />;
}
