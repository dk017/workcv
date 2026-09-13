import type { Metadata } from "next";

import { CareerGuidePage } from "@/components/career-guide-page";

const path = "/software-testing-strategies-uk";

export const metadata: Metadata = {
  title: "Software Testing Strategies for a UK CV",
  description:
    "Career-focused software testing strategies for a UK CV: explain test coverage, defects, automation, collaboration and outcomes clearly.",
  alternates: { canonical: path },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Software Testing Strategies for a UK CV",
    description:
      "Show software testing methods and evidence clearly when applying for testing or QA roles.",
    url: path,
  },
};

const faqs = [
  { question: "How should I describe software testing on a CV?", answer: "Name the testing context, your method, the tools or environments you genuinely used, how you reported or prioritised defects and what changed as a result. Keep the description specific to your actual work." },
  { question: "Should I list every testing tool I have seen?", answer: "No. Prioritise tools and methods you can explain in an interview. A shorter, evidenced list is more useful than a long keyword inventory with no context." },
  { question: "What is the difference between manual and automated testing on a CV?", answer: "Manual testing describes checks performed by a person; automated testing uses scripts or tools to repeat checks. Explain what you personally did, the scope and how the work fitted the wider delivery process." },
  { question: "Can I use this page as a software testing reference manual?", answer: "No. This page is career and application guidance. Use your team's engineering standards and authoritative technical documentation for testing decisions." },
];

export default function SoftwareTestingPage() {
  return <CareerGuidePage path={path} eyebrow="Testing careers UK" title="Software testing strategies: show the work behind the test result." intro="For a testing or QA application, a list of tools is not enough. Explain the test approach, the evidence you found and how you worked with others to improve confidence in the release." answer="Describe testing as a chain of decisions: what you tested, why that coverage mattered, how you found or reported defects, and what the team did with the evidence. Keep every method and outcome tied to work you actually completed." actionHref="/tools/cv-bullet-point-generator" actionLabel="Write testing CV bullets" actionPlacement="software_testing_bullets" reviewDate="2026-09-13" sections={[
    { title: "Name the testing context", body: "Give enough context for a recruiter to understand the product, team or delivery stage without exposing confidential information. A short context line makes the method meaningful.", points: ["State the product or workflow in safe, general terms", "Explain whether the work was feature, regression, integration or exploratory testing when accurate", "Mention the delivery context you can discuss"] },
    { title: "Explain the strategy, not just the label", body: "Terms such as regression, risk-based or exploratory testing are useful only when the bullet explains what you did. Show the choice, scope or priority behind the method.", points: ["Describe how you selected scenarios or priorities", "Connect coverage to a user, business or technical risk", "Avoid listing a method you cannot explain"] },
    { title: "Make defect reporting visible", body: "Defect work shows observation, communication and judgement. Explain how you reproduced, described, prioritised or followed up an issue, using only outcomes you can support.", points: ["Name the evidence that made the issue reproducible", "Describe collaboration with developers or product colleagues", "State what changed only when you know the outcome"] },
    { title: "Show automation with boundaries", body: "If you used automated checks, explain what they covered and how you maintained or interpreted them. Do not imply that automation replaced judgement or covered more than it did.", points: ["Name the language, framework or tool you genuinely used", "Explain the check or workflow rather than the brand alone", "Mention failures, maintenance or reporting when relevant"] },
    { title: "Connect testing to outcomes", body: "Outcomes can be a fixed defect, clearer release confidence, faster feedback or a lesson for the team. Use a number only when it came from your real evidence.", points: ["Keep supplied measures exact", "Use a qualitative result when no number exists", "Prepare to explain the example in an interview"] },
  ]} relatedLinks={[["Career advancement strategies", "/career-advancement-strategies-uk"], ["CV bullet point generator", "/tools/cv-bullet-point-generator"], ["ATS score checker", "/tools/ats-score-checker"], ["Build a no-subscription CV", "/cv-builder-no-subscription-uk"]]} faqs={faqs} />;
}
