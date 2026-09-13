import type { Metadata } from "next";

import { CareerGuidePage } from "@/components/career-guide-page";

const path = "/how-to-prepare-for-a-job-interview-uk";

export const metadata: Metadata = {
  title: "How to Prepare for a Job Interview UK",
  description:
    "A practical UK job-interview preparation checklist: use the advert, your CV and truthful STAR examples to prepare with confidence.",
  alternates: { canonical: path },
  openGraph: {
    title: "How to Prepare for a Job Interview in the UK",
    description:
      "Prepare with the job advert, your CV and evidence-led answer prompts.",
    url: path,
  },
};

const faqs = [
  { question: "How far in advance should I prepare for an interview?", answer: "Start as soon as you receive the invitation. Even a short preparation session can identify the vacancy priorities, your strongest evidence and the practical details you need to confirm." },
  { question: "What should I take to a job interview?", answer: "Follow the employer's instructions. Have the advert, your submitted CV, the invitation, practical travel or video-call details and a short list of questions ready. Do not bring documents the employer has not requested." },
  { question: "What is a STAR answer?", answer: "STAR is a simple structure: Situation, Task, Action and Result. Use it as a prompt for a real example, not as a reason to invent a dramatic story or force every answer into the same formula." },
  { question: "Can WorkCV prepare my interview answers?", answer: "The Job Application Pack can turn one vacancy and your evidence into likely questions and answer prompts. Use those prompts to prepare your own truthful examples." },
];

export default function InterviewPrepPage() {
  return <CareerGuidePage path={path} eyebrow="Interview preparation UK" title="How to prepare for a job interview in the UK." intro="Read the vacancy like a checklist, connect it to your CV and practise a few truthful examples before the conversation." answer="Good interview preparation means knowing what the employer needs, choosing evidence you can explain clearly and planning the practical details so you can focus on the discussion." actionHref="/tools/job-application-pack-uk" actionLabel="Build an application pack" actionPlacement="interview_guide_pack" reviewDate="2026-09-13" sections={[
    { title: "Start with the job advert", body: "Highlight the responsibilities, essential requirements and repeated language. Separate what the role asks for from what you genuinely know or have done.", points: ["Write down the three most important duties", "Mark each requirement as evidenced, partly evidenced or needing a question", "Note any format, location, shift or preparation instructions"] },
    { title: "Re-read the CV you sent", body: "Interview questions often begin with your application. Be ready to explain the choices, dates, responsibilities and outcomes in your CV without adding details that are not true.", points: ["Choose two or three examples you can describe in detail", "Check every number, job title and qualification", "Prepare a short explanation for a change, gap or unusual transition"] },
    { title: "Practise evidence-led answers", body: "Use Situation, Task, Action and Result to keep examples focused. The action is usually the part that shows how you think and work; the result can be qualitative when there is no measured number.", points: ["Use a real example rather than a hypothetical promise", "Say what you personally did, not only what the team did", "Finish with what changed or what you learned"] },
    { title: "Prepare your questions and logistics", body: "A calm interview plan includes questions that help you understand the role and a check of the practical details. Avoid questions that the advert or employer has already answered clearly.", points: ["Prepare two or three role-relevant questions", "Confirm time, place, format and names", "Allow time to arrive or test the video call"] },
    { title: "Keep the final document aligned", body: "If your CV and interview examples tell different stories, the mismatch creates avoidable doubt. Update the CV only with evidence you can defend and keep the submitted version available.", points: ["Use the same target role language where it is accurate", "Do not add a keyword without supporting evidence", "Review the final PDF before sending"] },
  ]} relatedLinks={[["Common interview questions", "/common-job-interview-questions-uk"], ["Thank-you email template", "/thank-you-email-after-interview-uk"], ["Job Application Pack", "/tools/job-application-pack-uk"], ["Build a no-subscription CV", "/cv-builder-no-subscription-uk"]]} faqs={faqs} />;
}
