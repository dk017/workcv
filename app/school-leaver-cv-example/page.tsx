import type { Metadata } from "next";

import {
  EarlyCareerCvPage,
  type EarlyCareerPageConfig,
} from "@/components/early-career-cv-page";
import { site } from "@/lib/site";

const slug = "/school-leaver-cv-example";

export const metadata: Metadata = {
  title: "School Leaver CV Example UK - First Job Template",
  description:
    "Use an editable UK school leaver CV example for first jobs and apprenticeships, with GCSE, project, volunteering and DofE evidence.",
  alternates: { canonical: slug },
  openGraph: {
    title: "School Leaver CV Example UK - WorkCV",
    description:
      "An education-first school leaver CV for first jobs and apprenticeships, without fabricated employment.",
    url: slug,
  },
};

const config: EarlyCareerPageConfig = {
  slug,
  roleTemplate: "school-leaver",
  kicker: "School leaver CV example",
  heading: "Build a first CV from school, volunteering and what you have actually done.",
  intro:
    "Start with an honest education-first CV for a first job or apprenticeship. Bring forward GCSEs, school projects, volunteering, clubs and DofE evidence without inventing an employer or job title.",
  exampleTitle: "School Leaver CV",
  scanTitle: "Employers need signs of readiness, not a fictional work history.",
  scanIntro:
    "Specific examples of turning up, following instructions, helping people and finishing tasks can demonstrate entry-level potential.",
  recruiterChecks: [
    ["English and maths", "Show confirmed GCSE subjects or results clearly when the apprenticeship or job asks for them."],
    ["Reliability", "Use attendance, regular volunteering, clubs or caring responsibilities only where you can explain the commitment honestly."],
    ["Basic tools", "Name Word, PowerPoint, email or spreadsheets when you have used them in school or a project."],
    ["Target role", "Match the profile and evidence to the actual first job or apprenticeship instead of saying you will do anything."],
  ],
  structure: [
    ["Header", "Name, town or city, phone and a sensible email address. Leave out a photo, date of birth and full street address."],
    ["Profile", "Three or four lines naming the target, strongest school or community evidence and practical availability."],
    ["Education", "List school, GCSE subjects and confirmed grades accurately, followed by relevant projects or awards."],
    ["Experience", "Use volunteering, work experience, enterprise projects, clubs and responsibilities with honest section labels."],
    ["Skills", "Choose specific tools and behaviours from the advert and connect them to real examples."],
  ],
  bulletExamples: [
    {
      title: "School enterprise project",
      bullets: [
        "Tracked costs and sales in a shared spreadsheet for a six-person fundraising project, checking entries against receipts.",
        "Helped prepare signs, price lists and a rota, then spoke with pupils, staff and visitors during the event.",
      ],
    },
    {
      title: "Volunteering or DofE",
      bullets: [
        "Sorted food-bank donations by category and use-by date while following hygiene and storage instructions.",
        "Planned equipment and timings with a supervised expedition team, adapting the route when conditions changed.",
      ],
    },
  ],
  mistakes: [
    "Inventing paid work or making informal help sound like employment.",
    "Predicting GCSE grades instead of labelling them as expected or using confirmed results.",
    "Listing hobbies without explaining relevant commitment or responsibility.",
    "Adding private details such as a date of birth, photo or full street address.",
    "Sending the same vague profile to unrelated jobs and apprenticeships.",
  ],
  sourceNotes: [
    ["National Careers Service CV guidance", "Official structure and tailoring guidance, including what personal information to leave out.", "https://nationalcareers.service.gov.uk/careers-advice/cv-sections"],
    ["UCAS CV guidance", "Advice on using education, achievements, volunteering and extracurricular activities when experience is limited.", "https://www.ucas.com/careers-advice/getting-job/how-write-cv"],
    ["Barclays LifeSkills CV tips", "Entry-level exercises for identifying skills and presenting school or community evidence.", "https://barclayslifeskills.com/i-want-to-prepare-for-an-interview/school/cv-tips/"],
  ],
  faqs: [
    { question: "What should a school leaver put on a CV?", answer: "Include contact details, a focused profile, education and GCSEs, school projects, work experience, volunteering, clubs, awards and genuine skills relevant to the role." },
    { question: "Can I make a CV with no paid work experience?", answer: "Yes. Use accurately labelled school, volunteering, community and personal-responsibility evidence. Do not invent employers or paid duties." },
    { question: "Should I include GCSE grades?", answer: "Include confirmed grades when the employer asks for them or they strengthen the application. Label predicted or expected results accurately and never present them as confirmed." },
    { question: "How long should a school leaver CV be?", answer: "A clear one-page CV is often enough. Use a second page only when you have relevant work experience, qualifications, projects or responsibilities that genuinely help the application." },
  ],
  relatedLinks: [
    ["Student CV template", "/student-cv-template"],
    ["CV with no experience", "/cv-no-experience-uk"],
    ["Warehouse CV template", "/cv-template-warehouse-uk"],
    ["How to write a CV", "/how-to-write-a-cv-uk"],
  ],
  finalHeading: "Start with a truthful first CV, then tailor it to the vacancy.",
  finalBody: `Replace the example with your real subjects, projects and responsibilities, then pay ${site.price} only when you download the final PDF.`,
  primaryLabel: "Use school leaver CV template",
};

export default function SchoolLeaverCvExamplePage() {
  return <EarlyCareerCvPage config={config} />;
}
