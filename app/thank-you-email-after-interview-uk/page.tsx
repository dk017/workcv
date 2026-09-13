import type { Metadata } from "next";

import { CareerGuidePage } from "@/components/career-guide-page";

const path = "/thank-you-email-after-interview-uk";

export const metadata: Metadata = {
  title: "Thank You Email After Interview UK Template",
  description:
    "Use a concise UK thank-you email after an interview: structure, copyable template, tone guidance and what not to claim.",
  alternates: { canonical: path },
  openGraph: {
    title: "Thank-You Email After an Interview UK",
    description:
      "A practical, editable thank-you email structure for UK job interviews.",
    url: path,
  },
};

const faqs = [
  { question: "Should I send a thank-you email after an interview?", answer: "A short, professional follow-up can be appropriate when you have a useful detail to acknowledge or want to confirm your continued interest. Follow any instructions from the employer and do not send repeated messages." },
  { question: "When should I send a thank-you email?", answer: "Send it while the conversation is still fresh and within the timeframe that makes sense for the process. If the interviewer gave a specific update date, respect that rather than chasing too early." },
  { question: "What should a thank-you email say?", answer: "Thank the interviewer, name the role, refer briefly to a genuine discussion point, confirm your interest and offer to provide anything requested. Keep it short and accurate." },
  { question: "Can I use the same email after every interview?", answer: "Use the same structure if helpful, but tailor the role, employer and discussion detail. A generic message can look careless, while invented enthusiasm is worse than a concise factual note." },
];

export default function ThankYouEmailPage() {
  return <CareerGuidePage path={path} eyebrow="Post-interview follow-up UK" title="Thank-you email after an interview: a concise UK template." intro="A good follow-up is brief, specific and accurate. Thank the interviewer, refer to the conversation and leave the next step with the employer." answer="Send a short message that names the role, thanks the interviewer and confirms genuine interest. Use a real detail from the conversation; do not use it to introduce new claims or pressure the employer." actionHref="/tools/job-application-pack-uk" actionLabel="Draft the follow-up with a pack" actionPlacement="thank_you_guide_pack" reviewDate="2026-09-13" template={{ title: "Copy and adapt this email", body: "Subject: Thank you for discussing the [exact role] role\n\nDear [interviewer name],\n\nThank you for taking the time to speak with me about the [exact role] role at [employer]. I appreciated learning more about [genuine detail from the conversation].\n\nOur discussion confirmed my interest in the role, particularly [specific responsibility or aspect you discussed]. Please let me know if you need any further information from me.\n\nKind regards,\n[Your name]", alternatives: ["If you met a panel, address the message to the named contact and mention the wider team only if that reflects the conversation.", "If the interview revealed a genuine correction or missing document, address that directly and briefly rather than adding a long explanation."] }} sections={[
    { title: "Send it for a reason", body: "A follow-up should close the loop professionally or add a relevant detail. It is not a substitute for a strong application and it cannot repair an inaccurate answer by itself.", points: ["Thank the interviewer for their time", "Refer to one real discussion point", "Follow the process instructions you were given"] },
    { title: "Use a clear subject line", body: "Make the message easy to identify. Include the exact role and a simple purpose, rather than a vague subject such as 'Following up' or 'Great meeting'.", points: ["Thank you — [exact role] interview", "Thank you for discussing [exact role]", "Keep the employer's spelling and role title"] },
    { title: "Keep the body short", body: "Three compact paragraphs are usually enough: thanks, a genuine detail and a professional close. Avoid repeating your whole CV or adding claims that did not come up.", points: ["Name the role and employer", "Mention what you learned or valued", "Offer further information without demanding an update"] },
    { title: "Check tone and accuracy", body: "Read it once as the recipient. Correct names, dates and role titles, remove over-familiar language and make sure the message sounds like a follow-up—not a sales pitch.", points: ["Do not claim the interview went perfectly", "Do not promise outcomes you cannot control", "Do not send multiple nudges when the employer gave a timeline"] },
  ]} relatedLinks={[["Prepare for an interview", "/how-to-prepare-for-a-job-interview-uk"], ["Common interview questions", "/common-job-interview-questions-uk"], ["Job Application Pack", "/tools/job-application-pack-uk"], ["Build a no-subscription CV", "/cv-builder-no-subscription-uk"]]} faqs={faqs} />;
}
