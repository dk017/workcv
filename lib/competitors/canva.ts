import { barclaysOption, blankTemplateOption, workcvOption } from "./workcv.ts";
import type { Competitor } from "./types.ts";

const vsPath = "/workcv-vs-canva";

export const canva: Competitor = {
  slug: "canva",
  name: "Canva",
  domain: "canva.com",
  homepage: "https://www.canva.com/create/cv/",
  summary:
    "A general online design tool with free CV templates that export to PDF, JPG or PNG, plus a paid Pro plan.",
  category: "Design tool with CV templates",
  vsPath,
  altPath: "/canva-cv-alternative-uk",
  pricing: {
    headline: "Free plan; Canva Pro priced per country",
    rows: [
      ["Canva Free", "Free CV templates and PDF download"],
      ["Canva Pro (US price)", "US$12 a month billed yearly, or US$18 monthly"],
      ["UK price", "Set per country on canva.com/pricing"],
      ["Premium elements", "Watermarked on the free plan unless bought or upgraded"],
    ],
    confidence: "regional",
    note: "Canva's help centre lists US prices and says other regions are shown on its pricing page, so the UK amount may differ.",
    sourceUrl: "https://www.canva.com/help/upgrade-to-canva-pro-or-business/",
  },
  facts: {
    billing: "Free, or Canva Pro billed monthly or yearly.",
    free: "Free CV templates using free elements download as PDF at no cost.",
    formats: "PDF, JPG or PNG. No Word export of a CV.",
    coverLetters: "Cover letter templates, designed by hand like the CV.",
    ai: "AI design and writing tools, mostly on Pro.",
    ats: "None. Layout is free-form design.",
    design: "Over a million templates in total; free-form drag-and-drop design.",
    afterPaying: "Designs stay in your account; premium elements need Pro or purchase.",
    bestFor: "Visual or creative CVs where design matters.",
  },
  switching: {
    summary:
      "Your Canva designs stay in your account on the free plan. Download your CV as a PDF, copy the text into a single-column builder or Word template if you need an ATS-friendly version, and only cancel Pro if you no longer use it for other designs.",
    href: "https://www.canva.com/help/upgrade-to-canva-pro-or-business/",
    label: "Canva Pro help",
  },
  sources: [
    ["Canva CV maker", "https://www.canva.com/create/cv/"],
    ["Canva Pro", "https://www.canva.com/pro/"],
    ["Canva Pro and Business help", "https://www.canva.com/help/upgrade-to-canva-pro-or-business/"],
  ],
  vs: {
    title: "WorkCV vs Canva for CVs 2026: Design vs UK Structure",
    description:
      "Canva's CV templates are free and highly designed; WorkCV is a £7.99 one-off UK CV builder with a cover letter and Word file. Which is better for applications?",
    answer:
      "Canva is the better choice for a visual or creative CV and costs nothing if you use free elements. WorkCV is the better choice for a conventional UK CV that applicant tracking systems and application forms read cleanly, at £7.99 once. Many people use Canva for a portfolio and a plain CV for applications.",
    verdict: [
      "Canva is a design tool, not a CV builder. Its CV templates are free, endlessly customisable and export to PDF, but they place text in boxes, columns and graphics that you arrange by hand. Nothing guides the content or checks UK conventions.",
      "WorkCV is the opposite: a guided UK structure, three layouts and a live preview, with little design freedom. You pay £7.99 once to download the CV and its matching cover letter as PDF and Word, and they stay editable.",
      "For creative roles where a visual CV is expected, Canva is the stronger tool and it is free. For most UK applications, where your CV may be parsed by software or pasted into a form, a single-column layout is the safer default.",
    ],
    competitorBetter: [
      "You are applying for design, marketing or creative roles",
      "You want complete control over layout, colour and graphics",
      "You want a free PDF and will avoid premium elements",
      "You already pay for Canva Pro",
    ],
    workcvBetter: [
      "You want guidance on what a UK CV should include",
      "You want a single-column layout that parses cleanly",
      "You do not want to fiddle with text boxes and spacing",
      "You want a professional, conventional look for most employers",
    ],
    faqs: [
      {
        question: "Is Canva good for a UK CV?",
        answer:
          "Canva is good for visually designed CVs. For roles where applications go through an applicant tracking system, a simple single-column CV without text boxes or graphics is usually safer, because complex layouts can be read out of order.",
      },
      {
        question: "Is Canva free for CVs?",
        answer:
          "Yes, if you use free templates and free elements. Canva Free lets you download a CV as PDF, JPG or PNG. Premium elements are watermarked unless you upgrade or buy them.",
      },
      {
        question: "Can I download a Canva CV in Word?",
        answer:
          "No. Canva exports PDF, JPG and PNG, not Word. WorkCV's £7.99 download includes an editable single-column Word file as well as the PDF.",
      },
      {
        question: "Why pay £7.99 for WorkCV when Canva is free?",
        answer:
          "You pay for guidance and structure rather than design: UK CV sections, prompts, a single-column Classic layout, a matching cover letter and a Word file. If you are confident writing and laying out a CV yourself, Canva or a free Word template costs nothing.",
      },
      {
        question: "How much is Canva Pro in the UK?",
        answer:
          "Canva sets Pro prices per country on its pricing page. Its help centre lists US$12 a month billed yearly or US$18 monthly in the US. Checked 30 October 2026.",
      },
    ],
  },
  alt: {
    subject: "Canva CV",
    title: "Canva CV Alternatives UK 2026: ATS-Friendly Options",
    description:
      "Need a simpler, ATS-friendly alternative to a Canva CV? Compare 6 UK options, from free Word templates to a £7.99 guided CV builder, checked October 2026.",
    answer:
      "The best Canva CV alternative for UK job applications is a single-column builder or template. WorkCV guides a UK CV for £7.99 once; WorkCV's blank Word template and Barclays LifeSkills are free. If you still want design freedom for free, FlowCV's free plan downloads designed PDFs.",
    why: [
      "Free-form layouts with columns and text boxes can be read out of order by applicant tracking systems.",
      "Canva has no CV guidance, so content and UK conventions are up to you.",
      "There is no Word export when an employer asks for an editable file.",
    ],
    options: [
      workcvOption(vsPath, "Guided UK CV sections, a single-column Classic layout and a matching cover letter; £7.99 once."),
      blankTemplateOption,
      { slug: "flowcv", why: "Structured templates with design options and free watermark-free PDF downloads." },
      { slug: "kickresume", why: "Designed templates with structured sections; free PDF or Word on free options." },
      barclaysOption,
      { slug: "standout-cv", why: "A UK CV builder with structured sections and UK examples." },
    ],
    faqs: [
      {
        question: "What is better than Canva for a CV?",
        answer:
          "For most UK applications, a dedicated CV builder or a single-column Word template is better than a design tool, because it structures the content and parses cleanly. WorkCV (£7.99 once), FlowCV (free) and WorkCV's free Word template are good options.",
      },
      {
        question: "Are Canva CVs ATS-friendly?",
        answer:
          "Some are, many are not. Columns, text boxes, icons and images can confuse applicant tracking systems. If you use Canva, choose a simple single-column template and test by copying the PDF text into a plain document.",
      },
      {
        question: "Is there a free alternative to Canva for CVs?",
        answer:
          "Yes. FlowCV's free plan, Kickresume's free plan, Barclays LifeSkills and WorkCV's blank Word template are all free.",
      },
      {
        question: "Can I convert my Canva CV to WorkCV?",
        answer:
          "Download your Canva CV as a PDF and use Import CV in the WorkCV editor; importing asks for your email and a one-time code. Check the imported sections, because text from multi-column designs can arrive out of order.",
      },
    ],
  },
  asAlternative: {
    bestFor: "Visual or creative CVs",
    price: "Free; Canva Pro priced per country",
    tradeOff: "Free-form layouts can parse poorly; no Word export.",
  },
  related: ["flowcv", "kickresume", "enhancv"],
};
