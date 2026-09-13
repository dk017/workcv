import type { Metadata } from "next";

import { CareerGuidePage } from "@/components/career-guide-page";

const path = "/common-job-interview-questions-uk";

export const metadata: Metadata = {
  title: "Common Job Interview Questions UK",
  description:
    "Plan truthful answers to common UK job-interview questions, from motivation and strengths to competency and role-specific prompts.",
  alternates: { canonical: path },
  openGraph: {
    title: "Common Job Interview Questions in the UK",
    description:
      "Use answer prompts to prepare evidence for general, competency and role-specific interview questions.",
    url: path,
  },
};

const faqs = [
  { question: "What are the most common job interview questions?", answer: "Common questions ask about your interest in the role, relevant experience, strengths, a challenge you handled, teamwork, priorities and what you would like to ask the employer. The exact mix depends on the vacancy." },
  { question: "How should I answer a competency question?", answer: "Choose one real example and explain the context, your responsibility, the action you took and the result or learning. Keep the focus on your contribution and do not exaggerate the outcome." },
  { question: "Should I memorise interview answers?", answer: "Memorise the evidence and structure, not a script. A fully memorised answer can sound unnatural and may not answer the question that was actually asked." },
  { question: "What if I do not have the experience a question asks for?", answer: "Say what you do have, use a related example if it genuinely transfers and explain how you would approach the missing part. Never claim experience you do not have." },
];

export default function InterviewQuestionsPage() {
  return <CareerGuidePage path={path} eyebrow="Common interview questions UK" title="Common job interview questions—and how to plan your evidence." intro="Prepare around question types instead of memorising a script. Build a small bank of real examples that you can adapt to the employer and role." answer="The strongest answer is specific, truthful and relevant to the vacancy. Plan the evidence behind your answer, then listen carefully and adapt it to the question you are asked." actionHref="/tools/job-application-pack-uk" actionLabel="Generate question prompts" actionPlacement="interview_questions_pack" reviewDate="2026-09-13" sections={[
    { title: "General and motivation questions", body: "These test whether you understand the role and can explain why it makes sense for you. Keep the answer grounded in the vacancy and your own motivation.", points: ["Tell me about yourself", "Why do you want this role?", "Why do you want to work here?", "What are your strengths and what are you developing?"] },
    { title: "Competency and STAR questions", body: "These ask for evidence from a past situation. Choose examples that show the behaviours the role needs, then describe your own action clearly.", points: ["Tell me about a time you solved a problem", "Describe a time you worked under pressure", "Give an example of teamwork or disagreement", "Tell me about an improvement you made"] },
    { title: "Role-specific questions", body: "Use the advert to predict the practical topics. A customer service role may ask about complaints; a driver role may ask about safety; a technical role may ask how you test or troubleshoot.", points: ["Match each essential requirement to one honest example", "Explain your method before claiming an outcome", "Say when your experience is adjacent rather than identical"] },
    { title: "Follow-up and probing questions", body: "Interviewers may ask what you personally did, why you chose that approach, what happened next or what you would change. Prepare the detail behind each example.", points: ["What was your specific responsibility?", "How did you measure or recognise the result?", "What did you learn?", "What would you do differently now?"] },
    { title: "Questions you can ask the employer", body: "Use the closing question to understand success in the role and the next stage. Choose questions that show thoughtful preparation, not questions answered plainly in the advert.", points: ["What would success look like in the first few months?", "How is the team organised around this role?", "What are the next steps in the process?"] },
  ]} relatedLinks={[["Prepare for an interview", "/how-to-prepare-for-a-job-interview-uk"], ["Job Application Pack", "/tools/job-application-pack-uk"], ["Cover letter generator", "/tools/cover-letter-generator-uk"], ["Use the CV editor", "/editor?template=classic&new=1"], ["Build a no-subscription CV", "/cv-builder-no-subscription-uk"]]} faqs={faqs} />;
}
