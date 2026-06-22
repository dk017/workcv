import type { GenericPageConfig } from "@/components/generic-page";

import { site } from "@/lib/site";

export const pages = {
  cvBuilderUk: {
    title: "UK CV builder",
    description:
      `Build a UK-ready CV free, then pay ${site.priceGbp} when you download the final PDF.`,
    label: "CV builder UK",
    heading: "A UK CV builder for finishing one strong CV.",
    intro:
      `WorkCV gives you a guided structure, clean templates, and a simple one-time download price. Build free, then pay ${site.priceGbp} when your PDF is ready.`,
    sectionTitle: "Keep the structure focused on what UK employers expect.",
    sectionBody:
      "The standard flow avoids unnecessary personal details and keeps your profile, recent experience, education, and skills easy to scan.",
    points: [
      "No photo-first assumptions",
      "No date of birth or nationality in the standard flow",
      "Recent experience first",
      "Clean PDF output for real applications",
    ],
  },
  cvTemplateUk: {
    title: "UK CV templates",
    description:
      "Clean UK CV templates designed for practical job applications and readable PDF output.",
    label: "UK CV templates",
    heading: "Clean templates for UK job applications.",
    intro:
      "Choose a practical layout that helps recruiters scan your experience quickly without making the CV feel overdesigned.",
    sectionTitle: "Readable templates beat flashy templates.",
    sectionBody:
      "WorkCV templates prioritise hierarchy, spacing, and section order so your experience is easy to understand on screen or in a PDF.",
    points: [
      "Professional template",
      "Early-career template",
      "Student template",
      "No-experience structure",
    ],
  },
  noSubscription: {
    title: "CV builder with no subscription",
    description:
      `Build your CV free and pay ${site.priceGbp} once when you download. No subscription.`,
    label: "No subscription",
    heading: "Build your CV without a monthly plan.",
    intro:
      "WorkCV is for people who need one strong CV, not another recurring account to remember cancelling.",
    sectionTitle: "Pay once when the CV is ready.",
    sectionBody:
      `You can work on your CV before paying. The standard flow charges ${site.priceGbp} only when you download the final PDF.`,
    points: [
      "Free to build",
      `${site.priceGbp} to download`,
      "No automatic renewal",
      "Nothing to cancel later",
    ],
  },
  noExperience: {
    title: "CV with no experience UK",
    description:
      "Guidance for building a UK CV when you have little or no work experience.",
    label: "No experience CV",
    heading: "Build a UK CV even without formal experience.",
    intro:
      "Use education, projects, volunteering, responsibilities, and skills to create a clear first CV for UK applications.",
    sectionTitle: "Early CVs need structure, not filler.",
    sectionBody:
      "For first jobs and early applications, WorkCV helps you bring useful evidence forward without pretending you have experience you do not have.",
    points: [
      "Education can come before work history",
      "Projects and volunteering can be included",
      "Skills stay specific and practical",
      "References can be handled clearly",
    ],
  },
  student: {
    title: "Student CV template UK",
    description:
      "A practical UK student CV template for part-time jobs, placements, and early applications.",
    label: "Student CV",
    heading: "A student CV template built for UK applications.",
    intro:
      "Create a clear student CV that highlights education, transferable skills, part-time work, projects, and achievements.",
    sectionTitle: "A student CV should be easy to scan.",
    sectionBody:
      "WorkCV keeps student CVs focused on relevant evidence and avoids unnecessary sections that make the page feel padded.",
    points: [
      "Education-led layout",
      "Part-time work support",
      "Project and achievement sections",
      "Clean one-page-friendly structure",
    ],
  },
  schoolLeaver: {
    title: "School leaver CV example",
    description:
      "A UK school leaver CV example and structure for first job applications.",
    label: "School leaver CV",
    heading: "A clear school leaver CV for first applications.",
    intro:
      "Turn school experience, achievements, responsibilities, and interests into a practical CV structure for UK employers.",
    sectionTitle: "First CVs should feel honest and organised.",
    sectionBody:
      "WorkCV helps school leavers create a CV that is concise, relevant, and easy for employers to understand.",
    points: [
      "Education-first structure",
      "Achievements and responsibilities",
      "Transferable skills",
      "Simple references guidance",
    ],
  },
  myperfectcv: {
    title: "MyPerfectCV alternative UK",
    description:
      "Compare WorkCV with MyPerfectCV if you want a UK CV builder with no subscription.",
    label: "MyPerfectCV alternative",
    heading: "A simpler MyPerfectCV alternative for one UK CV.",
    intro:
      `If you only need one finished CV, WorkCV keeps the model simple: build free, pay ${site.priceGbp} to download, no subscription.`,
    sectionTitle: "Compare the billing model before you start.",
    sectionBody:
      "Many CV builders use trial pricing that renews. WorkCV is deliberately narrower: one UK CV flow, one clear PDF download price.",
    points: [
      "Free to build",
      `${site.priceGbp} final PDF`,
      "No automatic renewal",
      "No cancellation needed",
    ],
  },
  livecareer: {
    title: "LiveCareer alternative UK",
    description:
      `Compare WorkCV with LiveCareer UK for a one-time ${site.priceGbp} CV download model.`,
    label: "LiveCareer alternative UK",
    heading: "A LiveCareer alternative without monthly CV billing.",
    intro:
      "WorkCV is built for users who want one strong UK CV and a clear one-time download price.",
    sectionTitle: "Pick the model that matches the job.",
    sectionBody:
      "If you want a broad career platform, a subscription may make sense. If you want one CV PDF, a one-time model is simpler.",
    points: [
      "UK-ready CV structure",
      "Build before paying",
      `${site.priceGbp} when downloading`,
      "No recurring billing",
    ],
  },
  cvmaker: {
    title: "CVMaker UK alternative",
    description:
      "Compare WorkCV with CVMaker UK for a simpler no-subscription UK CV builder.",
    label: "CVMaker UK alternative",
    heading: "A CVMaker UK alternative with one clear price.",
    intro:
      `Build your CV free in WorkCV, then pay ${site.priceGbp} only when you download the final PDF.`,
    sectionTitle: "Avoid paying for more platform than you need.",
    sectionBody:
      "WorkCV focuses on a clean UK CV and a finished PDF rather than a larger recurring-plan workflow.",
    points: [
      "Clear GBP pricing",
      "No subscription",
      "No automatic renewal",
      "Saved CV after login",
    ],
  },
} satisfies Record<string, GenericPageConfig>;
