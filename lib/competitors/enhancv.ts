import { barclaysOption, blankTemplateOption, workcvOption } from "./workcv.ts";
import type { Competitor } from "./types.ts";

const vsPath = "/workcv-vs-enhancv";

export const enhancv: Competitor = {
  slug: "enhancv",
  name: "Enhancv",
  domain: "enhancv.com",
  homepage: "https://enhancv.com/",
  summary:
    "A design-led AI resume and CV builder with ATS checking and tailoring tools, sold as monthly, quarterly or six-monthly Pro plans.",
  category: "Subscription AI resume builder",
  vsPath,
  altPath: "/enhancv-alternative-uk",
  pricing: {
    headline: "Pro from about £13 to £25 a month; 7-day free plan",
    rows: [
      ["Pro monthly", "£24.59 a month"],
      ["Pro quarterly", "£48.98 every 3 months (about £16.33 a month)"],
      ["Pro semi-annual", "£77.96 every 6 months (about £12.99 a month)"],
      ["Free plan", "7 days, Enhancv branding, limited sections, no card needed"],
    ],
    confidence: "uk-page-conflict",
    note: "These are the plan prices in the structured data of Enhancv's UK pricing page; some visible figures differ. Enhancv says taxes and currency can vary by region and the final price shows at checkout.",
    sourceUrl: "https://enhancv.com/uk/pricing/",
  },
  facts: {
    billing: "Pro renews monthly, quarterly or every six months until cancelled.",
    free: "7-day free plan with Enhancv branding and limited sections; no card required.",
    formats: "PDF or TXT. No Word (DOCX) export of your finished CV.",
    coverLetters: "Yes. Resumes and cover letters on Pro.",
    ai: "Yes. AI content suggestions, tailoring and feedback.",
    ats: "Yes. ATS check and job-description tailoring on Pro.",
    design: "Modern, design-led layouts in A4 or US Letter, with icons and colour.",
    afterPaying: "Downloads stop when Pro ends; Enhancv says you can still download, but not edit, after a plan expires.",
    bestFor: "Design-led CVs with AI feedback and ATS tailoring.",
  },
  switching: {
    summary:
      "Download your CV as a PDF while Pro is active. Enhancv's plans renew at the end of each period until you cancel, so cancel before the renewal date in your account settings and keep the confirmation.",
    href: "https://help.enhancv.com/en/articles/1195346-understanding-the-enhancv-pro-plans",
    label: "Enhancv: understanding Pro plans",
  },
  sources: [
    ["Enhancv UK pricing", "https://enhancv.com/uk/pricing/"],
    ["Enhancv Pro plans (help)", "https://help.enhancv.com/en/articles/1195346-understanding-the-enhancv-pro-plans"],
    ["Enhancv free version (help)", "https://help.enhancv.com/en/articles/1208865-what-is-included-in-the-free-version"],
  ],
  vs: {
    title: "WorkCV vs Enhancv 2026: UK CV Builder Comparison",
    description:
      "Enhancv Pro costs about £13–£25 a month with AI and ATS tools but no Word export. WorkCV is £7.99 once, PDF and Word included. Compare price and fit.",
    answer:
      "Enhancv is the better choice if you want design-led layouts, AI feedback and ATS tailoring, and you are happy with a Pro subscription. WorkCV is the better choice if you want a UK-style CV and cover letter for £7.99 once. WorkCV's download includes an editable Word file; Enhancv exports PDF or TXT only.",
    verdict: [
      "Enhancv is a premium AI resume platform: content suggestions, ATS checks against a job description, tailoring and polished layouts with icons and colour. Pro costs £24.59 a month, or less per month on quarterly and six-monthly plans, and renews until you cancel.",
      "WorkCV is a focused UK CV builder with three layouts and a one-off £7.99 payment per saved CV and cover letter, downloaded as PDF and Word. It adds AI suggestions you approve and a free ATS checker, but it is not trying to compete on design.",
      "If you are applying for competitive roles and will use AI feedback and tailoring every week, Enhancv's tools justify a subscription. If you need a conventional UK CV and want to pay once, WorkCV costs less and leaves nothing to cancel.",
    ],
    competitorBetter: [
      "You want AI feedback and ATS tailoring against each job advert",
      "You want a modern, visually distinctive CV",
      "You want A4 and US Letter versions for UK and US applications",
      "You will use the tools for several months and the semi-annual plan suits you",
    ],
    workcvBetter: [
      "You want a conventional UK CV, not a designed resume",
      "You want to pay once rather than monthly",
      "You want the CV to stay editable without an active plan",
      "You need an editable Word file as well as a PDF",
    ],
    faqs: [
      {
        question: "How much does Enhancv cost in the UK?",
        answer:
          "Enhancv's UK pricing page lists Pro at £24.59 a month, £48.98 every 3 months or £77.96 every 6 months, with a 7-day free plan. Some visible figures on the page differ and Enhancv says the final price shows at checkout. Checked 30 October 2026.",
      },
      {
        question: "Can Enhancv export a Word CV?",
        answer:
          "No. Enhancv exports your CV as PDF or TXT; its pricing FAQ says it avoids Word because formatting can change. WorkCV includes an editable single-column Word file alongside the PDF.",
      },
      {
        question: "Is the Enhancv free plan really free?",
        answer:
          "Yes, for 7 days and with no card, according to Enhancv's help centre. Free documents carry Enhancv branding and a limit on sections.",
      },
      {
        question: "Does WorkCV check my CV against a job advert like Enhancv?",
        answer:
          "Yes, with a free tool. WorkCV's ATS checker reads your CV and, with a job advert, gives a five-part score with its method explained. It is WorkCV's own assessment, not an employer's system, and it does not guarantee an interview.",
      },
      {
        question: "Which is better for UK applications, Enhancv or WorkCV?",
        answer:
          "Enhancv is better for design and AI tailoring. WorkCV is better for a plain UK CV structure at a one-off price. For most UK employers, a clear single-column CV is perfectly acceptable.",
      },
    ],
  },
  alt: {
    title: "Enhancv Alternatives UK 2026: Cheaper and Word-Friendly",
    description:
      "Enhancv Pro renews monthly and exports PDF or TXT only. Compare 6 UK alternatives with Word downloads, free plans or a £7.99 one-off price.",
    answer:
      "If you want something cheaper than Enhancv Pro, WorkCV is £7.99 once per UK CV and cover letter, including an editable Word file, and FlowCV's free plan downloads PDFs. Kickresume's free plan and Barclays LifeSkills also give you a free Word document.",
    why: [
      "Pro is a renewing subscription, at £24.59 a month on the monthly plan.",
      "Your finished CV exports as PDF or TXT, not Word.",
      "The free plan lasts 7 days and adds Enhancv branding.",
    ],
    options: [
      workcvOption(vsPath, "A UK CV and cover letter for £7.99 once, as PDF and Word. Both stay editable without a plan."),
      { slug: "kickresume", why: "Free downloads in PDF or Word on free options, and AI tools on Premium." },
      { slug: "flowcv", why: "Design-led templates with free, watermark-free PDF downloads." },
      { slug: "resume-io", why: "Polished templates with PDF and Word export on its paid plan." },
      blankTemplateOption,
      barclaysOption,
    ],
    faqs: [
      {
        question: "What is a cheaper alternative to Enhancv?",
        answer:
          "FlowCV's free plan, Kickresume's free plan and WorkCV's free Word template cost nothing. For a guided UK CV without a subscription, WorkCV costs £7.99 once, compared with Enhancv Pro at £24.59 a month on the monthly plan.",
      },
      {
        question: "Which Enhancv alternative exports Word?",
        answer:
          "WorkCV's £7.99 download includes an editable Word file, Kickresume's free plan downloads PDF or Word, Barclays LifeSkills exports Word, and Resume.io exports Word on paid plans.",
      },
      {
        question: "Is there an Enhancv alternative with AI and ATS tools?",
        answer:
          "WorkCV's editor suggests bullets and a profile summary you approve, and its ATS checker is free. Kickresume Premium and Zety include broader AI writing tools.",
      },
      {
        question: "Will I lose my Enhancv CV if I cancel?",
        answer:
          "Download a PDF before your plan ends. Enhancv says you can still download, but not edit, after a plan expires. WorkCV can import that PDF so you can keep editing.",
      },
      {
        question: "Does Enhancv renew automatically?",
        answer:
          "Yes. Pro plans renew at the end of each monthly, quarterly or six-monthly period until you cancel.",
      },
    ],
  },
  asAlternative: {
    bestFor: "Design-led CVs with AI feedback and ATS tailoring",
    price: "Pro £24.59 a month, or less on longer plans",
    tradeOff: "Renewing subscription; PDF or TXT only, no Word export.",
  },
  related: ["kickresume", "resume-io", "canva"],
};
