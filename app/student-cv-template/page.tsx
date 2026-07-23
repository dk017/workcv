import type { Metadata } from "next";

import {
  EarlyCareerCvPage,
  type EarlyCareerPageConfig,
} from "@/components/early-career-cv-page";
import { site } from "@/lib/site";

const slug = "/student-cv-template";

export const metadata: Metadata = {
  title: "Student CV Template UK - Part-Time Job Example",
  description:
    "Use an editable UK student CV template for part-time jobs, placements and internships, with education, volunteering, society and project examples.",
  alternates: { canonical: slug },
  openGraph: {
    title: "Student CV Template UK - WorkCV",
    description:
      "An education-first student CV with truthful examples for part-time work, projects, societies and volunteering.",
    url: slug,
  },
};

const config: EarlyCareerPageConfig = {
  slug,
  roleTemplate: "student",
  kicker: "Student CV template UK",
  heading: "Build a student CV from education, projects and real responsibilities.",
  intro:
    "Start with an education-led UK student CV for part-time jobs, placements and internships. Use coursework, volunteering, societies and paid work without pretending you have graduate-level experience.",
  exampleTitle: "Student CV",
  scanTitle: "Make limited experience feel specific, not empty.",
  scanIntro:
    "Recruiters can use evidence from study and life outside paid employment when it shows the same behaviour the vacancy needs.",
  recruiterChecks: [
    ["Availability", "State term-time, evening, weekend or holiday availability only when it helps the vacancy."],
    ["Relevant study", "Name useful modules, projects, tools and outcomes instead of listing a course title alone."],
    ["Real responsibility", "Use societies, volunteering, sport and caring commitments when they show reliability or teamwork."],
    ["Practical evidence", "Show what you organised, produced, explained, improved or completed and who it helped."],
  ],
  structure: [
    ["Header", "Name, town or city, phone and a professional email address. Add LinkedIn only when it is useful and current."],
    ["Profile", "Three or four lines connecting your course, strongest evidence, target role and relevant availability."],
    ["Education", "Put current study first. Add relevant modules, projects or expected completion dates without predicting grades."],
    ["Experience", "Include paid work, volunteering, societies, projects and positions of responsibility with clear labels."],
    ["Skills", "Use advert language for genuine tools and behaviours, then evidence each important skill elsewhere."],
  ],
  bulletExamples: [
    {
      title: "Course project",
      bullets: [
        "Worked in a four-person team to analyse survey data in Excel and present three service recommendations to a local charity.",
        "Set weekly tasks, combined research from four contributors and submitted the final report two days before the deadline.",
      ],
    },
    {
      title: "Part-time or voluntary work",
      bullets: [
        "Welcomed customers, answered routine queries and organised donated stock during a reliable weekly shop shift.",
        "Recorded event registrations accurately and sent joining instructions to more than 60 student attendees.",
      ],
    },
  ],
  mistakes: [
    "Opening with generic claims such as hardworking and motivated without evidence.",
    "Hiding relevant projects inside a long module list.",
    "Describing unpaid activity as paid employment.",
    "Including every grade or school detail when it does not help the vacancy.",
    "Using a decorative multi-column design that makes dates and headings hard to scan.",
  ],
  sourceNotes: [
    ["National Careers Service CV guidance", "Official guidance on contact details, introduction, education, work history and tailoring.", "https://nationalcareers.service.gov.uk/careers-advice/cv-sections"],
    ["UCAS student CV guidance", "Advice on presenting education, transferable skills, extracurricular activity and part-time experience.", "https://www.ucas.com/careers-advice/getting-job/how-write-cv"],
    ["Barclays LifeSkills CV tips", "Practical early-career guidance on skills, achievements and adapting a CV to the role.", "https://barclayslifeskills.com/i-want-to-prepare-for-an-interview/school/cv-tips/"],
  ],
  faqs: [
    { question: "What should a UK student CV include?", answer: "Include contact details, a focused profile, current education, relevant modules or projects, paid work, volunteering, societies, achievements and genuine skills matched to the vacancy." },
    { question: "Should education come before work experience on a student CV?", answer: "Usually, when your course and projects are your strongest evidence. Put relevant paid or placement experience first if it is more useful for the vacancy." },
    { question: "Can a student CV include volunteering and societies?", answer: "Yes. Label them accurately and describe responsibilities, tools and outcomes that show the behaviours the employer needs." },
    { question: "How long should a student CV be?", answer: "One complete page often works, but two readable pages are acceptable when you have relevant placements, projects or employment. Do not add filler to reach a target length." },
  ],
  relatedLinks: [
    ["Graduate CV template", "/cv-template-graduate-uk"],
    ["CV with no experience", "/cv-no-experience-uk"],
    ["School leaver CV example", "/school-leaver-cv-example"],
    ["ATS CV template", "/ats-cv-template-uk"],
  ],
  finalHeading: "Start with a student CV that gives education useful context.",
  finalBody: `Edit the student draft with your real course, projects and responsibilities, then pay ${site.price} only when you download the final PDF.`,
  primaryLabel: "Use student CV template",
};

export default function StudentCvTemplatePage() {
  return <EarlyCareerCvPage config={config} />;
}
