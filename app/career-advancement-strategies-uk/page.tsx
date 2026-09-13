import type { Metadata } from "next";

import { CareerGuidePage } from "@/components/career-guide-page";

const path = "/career-advancement-strategies-uk";

export const metadata: Metadata = {
  title: "Career Advancement Strategies UK",
  description:
    "Practical UK career advancement strategies: turn a progression goal into evidence, achievements and language for your next CV.",
  alternates: { canonical: path },
  openGraph: {
    title: "Career Advancement Strategies for the UK",
    description:
      "Turn a career progression goal into stronger evidence and a clearer target-role CV.",
    url: path,
  },
};

const faqs = [
  { question: "What is the best career advancement strategy?", answer: "Start with a specific target role, identify the evidence it needs and build that evidence deliberately through work, projects, feedback, learning or responsibility. The right mix depends on the role and your current position." },
  { question: "How do I show progression on a CV?", answer: "Show scope, ownership, complexity and outcomes where you can support them. Use clear examples rather than relying on a more senior job title or generic claims about leadership." },
  { question: "Do I need a promotion before applying for a more senior role?", answer: "Not always. Transferable responsibility, projects, acting-up work and measurable contributions can be relevant, but describe the level of responsibility accurately and do not imply a title you did not hold." },
  { question: "How can WorkCV help with career progression?", answer: "Use the bullet-point generator and transferable-skills translator to organise real evidence, then build a CV that makes the target role and strongest examples easy to review." },
];

export default function CareerAdvancementPage() {
  return <CareerGuidePage path={path} eyebrow="Career progression UK" title="Career advancement strategies: turn the next role into an evidence plan." intro="Progression becomes easier to act on when the target role is specific, the evidence is visible and the CV language reflects what you can already support." answer="Choose the next role first, work backwards to its responsibilities and create a truthful evidence plan. Then present the strongest examples in language that makes your scope and contribution easy to understand." actionHref="/tools/cv-bullet-point-generator" actionLabel="Strengthen my CV bullets" actionPlacement="career_advancement_bullets" reviewDate="2026-09-13" sections={[
    { title: "Define the next role", body: "A vague aim such as 'move up' is hard to measure. Choose a target title or family of roles and collect several real adverts to see the recurring responsibilities.", points: ["Write the target role in plain language", "Compare responsibilities across more than one advert", "Separate essential requirements from preferences"] },
    { title: "Map your existing evidence", body: "List work that shows ownership, judgement, scale, improvement, communication or technical depth. Evidence can come from a current role, project, volunteering or study when it is relevant.", points: ["Record the situation and your specific action", "Capture outcomes without inventing numbers", "Note feedback, scope or complexity you can verify"] },
    { title: "Close one useful gap at a time", body: "Choose a small number of gaps that matter for the target role. Seek a project, stretch responsibility, learning opportunity or conversation that can create genuine evidence.", points: ["Prioritise gaps repeated across target adverts", "Prefer practice and ownership over collecting labels", "Keep a short record of what you did and learned"] },
    { title: "Rewrite achievements for the target role", body: "Your CV should make the connection visible. Use a specific action, the relevant context and the result or learning; do not copy a vacancy or inflate your level.", points: ["Lead with the action you personally took", "Use the employer's wording only where accurate", "Put stronger target-role evidence earlier"] },
    { title: "Use conversations as evidence checks", body: "Ask managers, mentors or recruiters what the target role actually values. Treat their feedback as a way to test your assumptions, not as a guarantee of progression.", points: ["Ask which evidence would make you credible", "Request feedback on one specific example", "Update the plan when the role or market changes"] },
  ]} relatedLinks={[["CV bullet point generator", "/tools/cv-bullet-point-generator"], ["Transferable skills translator", "/tools/transferable-skills-translator-uk"], ["Job Application Pack", "/tools/job-application-pack-uk"], ["Build a no-subscription CV", "/cv-builder-no-subscription-uk"]]} faqs={faqs} />;
}
