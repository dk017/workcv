import { barclaysOption, blankTemplateOption, workcvOption } from "./workcv.ts";
import type { Competitor } from "./types.ts";

const vsPath = "/workcv-vs-resume-io";

export const resumeIo: Competitor = {
  slug: "resume-io",
  name: "Resume.io",
  domain: "resume.io",
  homepage: "https://resume.io/",
  summary:
    "A CV and cover letter builder with a free plan limited to TXT downloads and a 7-day trial that renews every four weeks.",
  category: "Subscription CV and cover letter builder",
  vsPath,
  altPath: "/resume-io-alternative-uk",
  pricing: {
    headline: "£2.95 for 7 days, then £20.95 every 4 weeks",
    rows: [
      ["7-day access", "£2.95"],
      ["After 7 days", "£20.95 every 4 weeks until cancelled"],
      ["Quarterly plan", "£49.95 every 3 months"],
      ["Free plan", "One CV and one cover letter, TXT download only"],
    ],
    confidence: "uk-page",
    note: "Resume.io says prices vary by location; these are the amounts on its UK pricing page. WorkCV's earlier July 2026 check showed a £19.95 renewal.",
    sourceUrl: "https://resume.io/uk/pricing",
    plans: [
      { label: "7-day access, then 4-weekly", first: { price: 2.95, days: 7 }, price: 20.95, days: 28 },
      { label: "Quarterly plan", price: 49.95, days: 91 },
    ],
  },
  facts: {
    billing: "£2.95 for 7 days, then renews automatically at £20.95 every 4 weeks. Quarterly plan £49.95.",
    free: "Free plan: one CV and one cover letter, downloadable as plain text (TXT) only.",
    formats: "TXT free; PDF and Word with a paid plan.",
    coverLetters: "Yes. Cover letter builder included; unlimited with premium.",
    ai: "AI-powered sample phrases while writing; AI interview prep on premium.",
    ats: "Promotes ATS-friendly templates; no separate score confirmed.",
    design: "A polished template library with colour options.",
    afterPaying: "PDF and Word downloads stop when premium ends; TXT stays available.",
    bestFor: "Polished designs and cover letters for a short, active job hunt.",
  },
  switching: {
    summary:
      "Resume.io says plans can be changed or cancelled at any time from the app, and every premium plan has a 7-day money-back guarantee. Download your CV as PDF or Word while premium is active, then cancel before the next renewal and keep the confirmation.",
    href: "https://help.resume.io/en/articles/3888960",
    label: "Resume.io payments, refunds and cancellations",
  },
  sources: [
    ["Resume.io UK pricing", "https://resume.io/uk/pricing"],
    ["Resume.io billing help", "https://help.resume.io/article/28-how-does-billing-work"],
    ["Resume.io free use", "https://help.resume.io/article/30-how-can-i-use-resume-io-for-free"],
    ["Resume.io refunds and cancellations", "https://help.resume.io/en/articles/3888960"],
  ],
  vs: {
    title: "WorkCV vs Resume.io 2026: UK Prices and Free Plan",
    description:
      "Resume.io is £2.95 for 7 days, then £20.95 every 4 weeks, and its free plan downloads TXT only. WorkCV is £7.99 once for a UK CV PDF. Full comparison.",
    answer:
      "Resume.io is better if you want polished templates, a cover letter builder and Word downloads, and you will cancel within 7 days or use the quarterly plan. WorkCV is better if you want one UK CV PDF for £7.99 with no renewal. Resume.io's free plan only downloads plain text, so a formatted CV needs a paid plan.",
    verdict: [
      "Resume.io's trial is shorter than most: £2.95 covers 7 days, then £20.95 every four weeks. Missing the cancellation by a week costs £23.90 in total, and three months on the four-weekly plan costs £65.80, or £49.95 on the quarterly plan.",
      "Its free plan is useful for drafting but downloads only a TXT file, which strips the layout. PDF and Word are premium. WorkCV also charges for the formatted file, but once: £7.99 for the saved CV, with a full preview first and free edits afterwards.",
      "Resume.io offers more: cover letters, more templates, Word export and AI phrase suggestions. WorkCV offers a fixed price and a UK-only structure. Decide by whether you need those extras for more than a week.",
    ],
    competitorBetter: [
      "You need cover letters and a CV with matching designs",
      "You want PDF and Word downloads",
      "You can finish within the 7-day trial and cancel",
      "You will apply for three months and the £49.95 quarterly plan suits you",
      "You want AI phrase suggestions while writing",
    ],
    workcvBetter: [
      "You need a formatted CV without a subscription",
      "Seven days is too short for you to finish",
      "You want to see the exact PDF before paying",
      "You want to keep editing the same CV without paying again",
      "You only need a PDF for UK applications",
    ],
    faqs: [
      {
        question: "Can I download a CV from Resume.io for free?",
        answer:
          "Only as a plain text (TXT) file. Resume.io's free plan covers one CV and one cover letter with TXT download; PDF and Word downloads need a paid plan. WorkCV is also paid for the PDF, at £7.99 once.",
      },
      {
        question: "How much is Resume.io after the trial?",
        answer:
          "Resume.io's UK pricing page lists £2.95 for 7 days, then £20.95 every 4 weeks, or £49.95 every 3 months on the quarterly plan. Checked 30 October 2026; Resume.io says prices vary by location.",
      },
      {
        question: "Is WorkCV cheaper than Resume.io?",
        answer:
          "Yes, unless you finish and cancel within 7 days. Resume.io costs £23.90 for a month on the 4-weekly plan and £49.95 for three months on the quarterly plan. WorkCV is £7.99 once per saved CV.",
      },
      {
        question: "Does Resume.io offer refunds?",
        answer:
          "Resume.io says every premium plan comes with a 7-day money-back guarantee. Check its refunds and cancellations help article for the current conditions.",
      },
      {
        question: "Does WorkCV export Word like Resume.io?",
        answer:
          "No. The WorkCV editor exports PDF. WorkCV's free blank Word CV template is a separate .docx download if an employer asks for Word.",
      },
    ],
  },
  alt: {
    title: "Resume.io Alternatives UK 2026: Free and One-Off Options",
    description:
      "Resume.io's free plan downloads TXT only and paid plans renew at £20.95 every 4 weeks. Compare 6 UK alternatives with free PDFs or one-off pricing.",
    answer:
      "If you want a formatted CV without Resume.io's subscription, WorkCV charges £7.99 once for a UK CV PDF. If you want it free, FlowCV's free plan downloads watermark-free PDFs and Kickresume's free plan exports PDF or Word on free design options.",
    why: [
      "The free plan only downloads plain text, so the layout is lost.",
      "The paid trial lasts 7 days before the £20.95 four-weekly renewal.",
      "Many people need one CV in PDF, not a renewing plan with cover letters.",
    ],
    options: [
      workcvOption(vsPath, "A formatted UK CV PDF for £7.99 once, with a full preview first and no renewal."),
      { slug: "flowcv", why: "The free plan downloads formatted PDFs, which Resume.io's free plan does not." },
      { slug: "kickresume", why: "Free PDF or Word downloads without a watermark on free design options." },
      { slug: "canva", why: "Free designed templates with free PDF export." },
      blankTemplateOption,
      barclaysOption,
    ],
    faqs: [
      {
        question: "Which Resume.io alternative lets me download a PDF for free?",
        answer:
          "FlowCV's free plan includes unlimited watermark-free PDF downloads, Canva's free plan exports PDF, and Kickresume's free plan downloads PDF or Word if you use only free options. WorkCV's PDF is paid (£7.99 once), but its Word template is free.",
      },
      {
        question: "Why does Resume.io only give me a TXT file?",
        answer:
          "TXT download is the limit of Resume.io's free plan. Formatted PDF and Word files require a paid plan, which starts at £2.95 for 7 days on its UK pricing page.",
      },
      {
        question: "What is the Resume.io £20.95 charge?",
        answer:
          "It is the renewal price every 4 weeks on Resume.io's UK pricing page, charged after the £2.95 7-day access unless you cancel. Resume.io offers a 7-day money-back guarantee on premium plans.",
      },
      {
        question: "Is there a Resume.io alternative with no subscription?",
        answer:
          "Yes. WorkCV charges £7.99 once per saved CV. Novorésumé sells a one-off monthly Pro Pass. Free tools such as FlowCV, Kickresume's free plan and the WorkCV Word template have no subscription at all.",
      },
      {
        question: "How do I move my CV from Resume.io?",
        answer:
          "Download a PDF or Word copy while premium is active (or TXT on the free plan), then import it into your new builder. WorkCV's Import CV reads PDF and Word files.",
      },
    ],
  },
  asAlternative: {
    bestFor: "Polished designs plus cover letters",
    price: "£2.95 for 7 days, then £20.95 every 4 weeks",
    tradeOff: "Free plan downloads TXT only; paid plan renews after 7 days.",
  },
  related: ["zety", "myperfectcv", "enhancv"],
};
