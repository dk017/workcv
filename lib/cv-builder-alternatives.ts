// "<Brand> alternatives" pages: several real options for someone leaving a
// competitor, free ones included, with WorkCV disclosed as ours. The one-to-one
// price and cancellation comparison lives on the WorkCV vs pages (workcv-vs.ts);
// these pages link there once instead of repeating it.

import { workcvVsPage } from "./workcv-vs.ts";
import { site } from "./site.ts";

export type AlternativeBrand = {
  path: string;
  brand: string;
  vsPath: string;
  title: string;
  description: string;
  /** What the brand's free plan gives you, in a few words, for contrasts. */
  freeDownload: string;
  /** How its paid plan renews, in a few words. */
  renewal: string;
  whyLeave: string;
  /** Builders that look different but work the same way. */
  sameModel: { heading: string; body: string };
  /** Sister brands run by the same company, named in the short answer. */
  siblings?: string;
  quickPicks: string[][];
  exportTip: string;
  faqs: Array<{ question: string; answer: string }>;
};

export type AlternativeOption = {
  id: string;
  name: string;
  ours?: boolean;
  cost: string;
  gives: string;
  watch: string;
  bestFor: string;
  href: string;
  hrefLabel: string;
  checked: string;
  contrast: (b: AlternativeBrand) => string;
};

export const alternativeOptions: AlternativeOption[] = [
  {
    id: "workcv", name: "WorkCV", ours: true,
    cost: `${site.price} once for one CV and matching letter; ${site.passPrice} once for ${site.passDays} days of applications`,
    gives: "A UK-format CV and cover letter, downloadable as PDF and editable Word. Build and preview free; no account to start.",
    watch: "Three layouts and no human review service. A separate CV needs another purchase unless you buy the Pass.",
    bestFor: "A finished UK CV with a fixed price and nothing to cancel.",
    href: "/cv-builder-no-subscription-uk", hrefLabel: "How WorkCV's pricing works", checked: "1 November 2026",
    contrast: (b) => `Unlike ${b.brand}, the price doesn't change after a trial: nothing renews.`,
  },
  {
    id: "govuk", name: "GOV.UK CV builder",
    cost: "Free",
    gives: "A government CV builder linked from the National Careers Service. You can build and download a CV without an account; signing in lets you save, upload or keep editing.",
    watch: "Its page doesn't say which file format you get, so open the download and check it before you send it.",
    bestFor: "A plain, free CV when design doesn't matter.",
    href: "https://www.jobs.service.gov.uk/cv", hrefLabel: "GOV.UK CV builder", checked: "1 November 2026",
    contrast: (b) => `It's free to download, where ${b.brand}'s free plan gives you ${b.freeDownload}.`,
  },
  {
    id: "flowcv", name: "FlowCV",
    cost: "Free plan; Pro $5 a month or $60 a year, renewing automatically",
    gives: "Unlimited PDF downloads with no watermark on the free plan, plus a range of designs.",
    watch: "Priced in US dollars and built for resumes generally: switch to UK spelling and remove anything a UK CV leaves out, such as a photo or date of birth.",
    bestFor: "A free, well-designed PDF if you're happy to apply UK conventions yourself.",
    href: "https://flowcv.com/pricing", hrefLabel: "FlowCV pricing", checked: "1 November 2026",
    contrast: (b) => `Its free PDF download is the main difference from ${b.brand}, whose free plan gives you ${b.freeDownload}.`,
  },
  {
    id: "template", name: "A free Word or Google Docs template",
    cost: "Free",
    gives: "WorkCV's blank UK CV in Word needs no account. Google Docs has CV templates if you have a Google account.",
    watch: "You do all the formatting, and layouts can shift when the file is opened elsewhere. Export a PDF unless the employer asks for Word.",
    bestFor: "Full control and no account with a CV builder at all.",
    href: "/tools/blank-cv-template-uk", hrefLabel: "Free blank Word CV", checked: "1 November 2026",
    contrast: (b) => `No subscription or trial to manage, unlike ${b.brand}'s ${b.renewal}.`,
  },
  {
    id: "kickresume", name: "Kickresume",
    cost: "Free plan; premium shown as $9 for one month, $18 for three months or $48 for a year",
    gives: "Four basic CV templates and four matching cover-letter templates, with unlimited downloads, on the free plan.",
    watch: "Its pricing page says \"Pay $9 once\", but its terms (checked 4 October 2026) say paid plans renew automatically. Check the checkout wording.",
    bestFor: "A free CV and matching cover letter from a small set of designs.",
    href: "/kickresume-alternative-uk", hrefLabel: "Is Kickresume free?", checked: "1 November 2026",
    contrast: (b) => `Its free plan includes downloads, which ${b.brand}'s free plan limits to ${b.freeDownload}.`,
  },
  {
    id: "canva", name: "Canva",
    cost: "Canva Free, with optional paid plans",
    gives: "Full design freedom on a general design tool, with many CV templates.",
    watch: "Some templates and elements need a paid plan. Multi-column and graphic-heavy layouts can be read out of order by recruitment software.",
    bestFor: "Creative roles where the look of the CV is part of the application.",
    href: "/canva-cv-alternative-uk", hrefLabel: "Canva vs WorkCV for CVs", checked: "13 June 2026",
    contrast: (b) => `More design freedom than ${b.brand}, but none of its CV-specific guidance.`,
  },
  {
    id: "careers", name: "A careers adviser",
    cost: "Free",
    gives: "University and college careers services usually check CVs for students, and often for graduates. In England, the National Careers Service offers free advice from careers advisers.",
    watch: "Advice, not a tool: you still need a template or builder to produce the document.",
    bestFor: "A second opinion on content before you apply.",
    href: "https://nationalcareers.service.gov.uk/", hrefLabel: "National Careers Service", checked: "1 November 2026",
    contrast: (b) => `A person reviews your content, which ${b.brand}'s templates can't do.`,
  },
];

const boldSame = (others: string) => ({
  heading: `Why ${others} aren't really alternatives`,
  body: `Their terms of use name the same company, BOLD LLC, and their plans follow the same pattern: build free, then a low first payment for downloads that renews every four weeks until you cancel. Switching between them changes the templates, not the way you pay.`,
});

const vs = (path: string) => workcvVsPage(path);

export const alternativeBrands: AlternativeBrand[] = [
  {
    path: "/myperfectcv-alternative-uk", brand: "MyPerfectCV", vsPath: vs("/workcv-vs-myperfectcv-uk").path,
    title: "MyPerfectCV Alternatives UK: Free and Pay-Once Options",
    description: "Seven MyPerfectCV alternatives for UK job seekers, including free ones: what each costs, what you can download and the catch with each.",
    freeDownload: "a plain-text (TXT) download only", renewal: "£16.95 every four weeks after the trial",
    whyLeave: "MyPerfectCV lets you build a CV free, but PDF and Word downloads need a paid plan: £2.95 for 14 days, then £16.95 every four weeks until you cancel (checked 4 October 2026). Most people looking for an alternative want a proper download without that renewal.",
    sameModel: boldSame("Zety and LiveCareer"),
    siblings: "Zety and LiveCareer",
    quickPicks: [
      ["You want it free and plain", "GOV.UK CV builder"],
      ["You want a free, designed PDF", "FlowCV or Kickresume's free plan"],
      ["You want a UK CV and letter, paid once", "WorkCV"],
      ["You want total control", "A Word or Google Docs template"],
    ],
    exportTip: "MyPerfectCV's free download is plain text, which is enough to copy your content into another tool.",
    faqs: [
      { question: "Is there a free alternative to MyPerfectCV?", answer: "Yes. The GOV.UK CV builder is free and lets you download without an account, FlowCV's free plan includes unlimited PDF downloads, and a Word or Google Docs template costs nothing." },
      { question: "Are Zety and LiveCareer alternatives to MyPerfectCV?", answer: "Not in the way most people mean. All three name BOLD LLC in their terms and use the same trial-then-renewal model." },
    ],
  },
  {
    path: "/zety-alternative-uk", brand: "Zety", vsPath: vs("/workcv-vs-zety-uk").path,
    title: "Zety Alternatives UK: Free and Pay-Once CV Builders",
    description: "Seven Zety alternatives for UK job seekers, including free ones: what each costs, what you can download, and which suit a UK-format CV.",
    freeDownload: "a plain-text (TXT) download only", renewal: "four-weekly renewal after the trial",
    whyLeave: "Zety is free to build in, but PDF and Word downloads need its Pro package, a 14-day trial that renews every four weeks. When we checked on 4 October 2026, Zety's UK pricing address showed US-dollar prices, so UK users can't easily see what they'll pay in pounds.",
    sameModel: boldSame("MyPerfectCV and LiveCareer"),
    siblings: "MyPerfectCV and LiveCareer",
    quickPicks: [
      ["You want it free and plain", "GOV.UK CV builder"],
      ["You liked Zety's designs and want them free", "FlowCV or Kickresume's free plan"],
      ["You want UK spelling and conventions built in", "WorkCV"],
      ["You want total control", "A Word or Google Docs template"],
    ],
    exportTip: "Zety's free download is plain text, which is enough to copy your content into another tool.",
    faqs: [
      { question: "Is there a free alternative to Zety?", answer: "Yes. FlowCV's free plan includes unlimited PDF downloads with no watermark, the GOV.UK CV builder is free, and Kickresume's free plan includes downloads from four basic templates." },
      { question: "Which Zety alternative is best for a UK CV?", answer: "One that uses UK conventions by default: British spelling, no photo or date of birth, and two pages at most. WorkCV and the GOV.UK builder are UK-specific; with the others, apply those conventions yourself." },
    ],
  },
  {
    path: "/livecareer-alternative", brand: "LiveCareer", vsPath: vs("/workcv-vs-livecareer-uk").path,
    title: "LiveCareer Alternatives UK: Free and Pay-Once Options",
    description: "Seven LiveCareer alternatives for UK job seekers, including free ones: what each costs, what you can download, and the catch with each.",
    freeDownload: "a plain-text (TXT) download only", renewal: "£19.85 every four weeks after the trial",
    whyLeave: "LiveCareer is free to build in, but Word and PDF downloads need paid access: £1.95 for 14 days, then £19.85 every four weeks until you cancel (checked 4 October 2026).",
    sameModel: boldSame("MyPerfectCV and Zety"),
    siblings: "MyPerfectCV and Zety",
    quickPicks: [
      ["You want it free and plain", "GOV.UK CV builder"],
      ["You want a free, designed PDF", "FlowCV or Kickresume's free plan"],
      ["You want help with the wording", "A careers adviser, or WorkCV's AI suggestions"],
      ["You want a UK CV and letter, paid once", "WorkCV"],
    ],
    exportTip: "LiveCareer's free download is plain text, which is enough to copy your content into another tool.",
    faqs: [
      { question: "Is there a free alternative to LiveCareer?", answer: "Yes. The GOV.UK CV builder is free, FlowCV's free plan includes PDF downloads, and Word or Google Docs templates cost nothing." },
      { question: "Is LiveCareer the same company as MyPerfectCV?", answer: "Their terms of use both name BOLD LLC, as do Zety's. Their plans work the same way." },
    ],
  },
  {
    path: "/resume-io-alternative-uk", brand: "Resume.io", vsPath: vs("/workcv-vs-resume-io-uk").path,
    title: "Resume.io Alternatives UK: Free and Pay-Once Options",
    description: "Seven Resume.io alternatives for UK job seekers, including free ones: what each costs, what you can download, and which suit a UK CV.",
    freeDownload: "one resume with a plain-text (TXT) download", renewal: "four-weekly renewal after the 7-day trial",
    whyLeave: "Resume.io's free plan covers one resume and one cover letter with plain-text downloads. PDF needs a paid plan: when we checked UK pricing on 23 July 2026, £2.95 for 7 days, then £19.95 every four weeks. The trial lasts 7 days, half as long as MyPerfectCV's or LiveCareer's.",
    sameModel: { heading: "Builders that work the same way", body: "MyPerfectCV, Zety, LiveCareer and CVMaker also charge a small amount for a short trial and then renew automatically. They differ in templates, not in how you pay." },
    quickPicks: [
      ["You liked Resume.io's designs and want them free", "FlowCV"],
      ["You want it free and plain", "GOV.UK CV builder"],
      ["You want a UK CV and letter, paid once", "WorkCV"],
      ["You want total control", "A Word or Google Docs template"],
    ],
    exportTip: "Resume.io's free plan downloads plain text, which is enough to copy your content into another tool.",
    faqs: [
      { question: "Is there a free alternative to Resume.io?", answer: "FlowCV's free plan is the closest in style and includes unlimited PDF downloads. The GOV.UK CV builder and Word templates are free too." },
      { question: "Is Resume.io good for UK CVs?", answer: "It works, but it's built for resumes generally. Use British spelling and leave out a photo and date of birth. Our UK CV format guide lists the conventions." },
    ],
  },
  {
    path: "/cvmaker-alternative", brand: "CVMaker", vsPath: vs("/workcv-vs-cvmaker-uk").path,
    title: "CVMaker Alternatives UK: Free and Pay-Once Options",
    description: "Seven CVMaker UK alternatives, including free ones with downloads: what each costs, what you get and the catch with each.",
    freeDownload: "no downloads at all", renewal: "£19.99 a month after the 7-day trial",
    whyLeave: "CVMaker UK lets you build with a live preview for free, but downloading a CV or cover letter needs Pro: £0.99 for 7 days, then £19.99 a month until you cancel (checked 1 November 2026). That is a lot to keep track of if you only need one download.",
    sameModel: { heading: "Builders that work the same way", body: "MyPerfectCV, Zety, LiveCareer and Resume.io also charge a small amount for a short trial and then renew automatically. They differ in templates, not in how you pay." },
    quickPicks: [
      ["You only need one download", "WorkCV, or a free option below"],
      ["You want it free and plain", "GOV.UK CV builder"],
      ["You want a free, designed PDF", "FlowCV"],
      ["You want total control", "A Word or Google Docs template"],
    ],
    exportTip: "CVMaker's free plan has no download, so copy your text from the editor, or download what you need before a paid plan ends.",
    faqs: [
      { question: "Is there a free alternative to CVMaker?", answer: "Yes, and unlike CVMaker's free plan they include a download: the GOV.UK CV builder, FlowCV's free plan, Kickresume's free plan and Word or Google Docs templates." },
      { question: "What's the cheapest way to get one CV download?", answer: "Free: the GOV.UK builder, FlowCV or a template. Paid once: WorkCV at £7.99, which includes a matching cover letter as PDF and Word." },
    ],
  },
  {
    path: "/enhancv-alternative-uk", brand: "Enhancv", vsPath: vs("/workcv-vs-enhancv-uk").path,
    title: "Enhancv Alternatives UK: Free and Pay-Once Options",
    description: "Seven Enhancv alternatives for UK job seekers, from free design-led builders to UK-specific tools: what each costs and the catch with each.",
    freeDownload: "a 7-day plan with Enhancv branding", renewal: "automatically renewing Pro subscription",
    whyLeave: "Enhancv is a design-led resume platform with AI tools. Its free plan lasts 7 days, adds Enhancv branding and caps you at 12 section items; Pro renews monthly, quarterly or every six months until cancelled (checked 1 November 2026). People leave for a free plan without branding, or for something UK-specific.",
    sameModel: { heading: "Closest in style", body: "If you chose Enhancv for its designs, FlowCV and Kickresume are the nearest free options. If you chose it for AI and ATS tools, check what each alternative's free plan actually includes before you move." },
    quickPicks: [
      ["You want Enhancv-style design, free", "FlowCV or Kickresume's free plan"],
      ["You want a UK CV and letter, paid once", "WorkCV"],
      ["You want it free and plain", "GOV.UK CV builder"],
      ["You want feedback on content", "A careers adviser"],
    ],
    exportTip: "After an Enhancv Pro plan ends, the account becomes read-only but existing documents can still be downloaded, so save PDFs first.",
    faqs: [
      { question: "Is there a free alternative to Enhancv without branding?", answer: "FlowCV's free plan says it has no watermark or branding and includes unlimited PDF downloads. The GOV.UK CV builder and Word templates are free too." },
      { question: "Which Enhancv alternative has AI tools?", answer: "Several builders, WorkCV included, offer AI writing suggestions. Treat them as drafts: check every claim matches your real experience before sending." },
    ],
  },
];

export function alternativeBrand(path: string) {
  const brand = alternativeBrands.find((item) => item.path === path);
  if (!brand) throw new Error(`No alternatives page for ${path}`);
  return brand;
}
