import type { Metadata } from "next";

import { CompetitorVsPage, type CompetitorVsConfig } from "@/components/competitor-vs-page";
import { competitorPlans, costOverDays, formatMinor } from "@/lib/competitor-plans";
import { site } from "@/lib/site";

const a = competitorPlans.myPerfectCv;
const b = competitorPlans.liveCareer;
const gbp = (minor: number) => formatMinor(minor, "GBP");

export const metadata: Metadata = {
  title: "MyPerfectCV vs LiveCareer UK: Same Company, Different Prices",
  description: `MyPerfectCV vs LiveCareer compared on UK prices, renewals and free plans. Both are run by BOLD LLC; see what each costs after the trial and a one-off alternative at ${site.price}.`,
  alternates: { canonical: "/myperfectcv-vs-livecareer-uk" },
  openGraph: {
    title: "MyPerfectCV vs LiveCareer UK – WorkCV",
    description: "Same company, same trial-then-renewal model, different prices. A sourced UK comparison.",
    url: "/myperfectcv-vs-livecareer-uk",
  },
};

const config: CompetitorVsConfig = {
  slug: "/myperfectcv-vs-livecareer-uk",
  a,
  b,
  heading: "MyPerfectCV vs LiveCareer: which is better in the UK?",
  shortAnswer: [
    `MyPerfectCV and LiveCareer are run by the same company, ${a.operator}, and work the same way: you build for free, pay a small trial fee to download a PDF or Word CV, and the trial then renews every four weeks until you cancel.`,
    `MyPerfectCV is cheaper once the trial ends: ${gbp(a.trial.renewalMinor)} every 4 weeks against ${gbp(b.trial.renewalMinor)}, and ${gbp(a.annual.totalMinor)} a year against ${gbp(b.annual.totalMinor)}. LiveCareer's trial is ${gbp(a.trial.entryMinor - b.trial.entryMinor)} cheaper (${gbp(b.trial.entryMinor)} against ${gbp(a.trial.entryMinor)}). Left running for 12 weeks, MyPerfectCV costs ${gbp(costOverDays(a.trial, 84))} and LiveCareer ${gbp(costOverDays(b.trial, 84))}.`,
    `If you would rather not manage a renewing trial, WorkCV is a one-off alternative: ${site.price} once for one CV and its cover letter, or ${site.passPrice} once for ${site.passDays} days of applications.`,
  ],
  sameOperatorNote:
    "Both sites offer the same Bold.pro online profile and use the same model: a low-cost 14-day trial that renews every four weeks unless you cancel. Choosing between them is mostly a choice of templates and price, not of different companies or policies.",
  featureRows: [
    ["Company you contract with", a.operator, b.operator, "WorkCV, an independent UK CV builder"],
    ["Free plan downloads", "TXT only", "TXT only", "No free download of a built CV; free blank Word template"],
    ["Trial", `${gbp(a.trial.entryMinor)} for 14 days`, `${gbp(b.trial.entryMinor)} for 14 days`, "No trial: pay once when you download"],
    ["After the trial", `${gbp(a.trial.renewalMinor)} every 4 weeks until cancelled`, `${gbp(b.trial.renewalMinor)} every 4 weeks until cancelled`, "Nothing renews"],
    ["Annual plan", `${gbp(a.annual.totalMinor)} a year, renews yearly`, `${gbp(b.annual.totalMinor)} a year, renews yearly`, `Not needed: ${site.passPrice} covers ${site.passDays} days, once`],
    ["Templates", "Over 40 templates and 700 designs", "46 CV templates", "3 UK CV layouts"],
    ["Paid downloads", "PDF, Word and TXT", "Word, PDF, TXT and HTML", "PDF and Word"],
    ["Cover letters", "Cover letter builder", "Cover letter builder, 6 templates", "Matching letter included with each CV"],
    ["Other tools", "CV Check, pre-written content, Bold.pro profile", "Expert suggestions, CV review, Bold.pro profile", "Free ATS checker and job tracker; AI suggestions only applied when you approve them"],
    ["Money-back terms", "Refund if requested within 14 days of subscribing", "Refund if unhappy during the first 14 days", "See WorkCV's refund policy"],
  ],
  chooseA: [
    "You want a large choice of designs and pre-written CV content",
    "You plan to keep a subscription: its renewal and annual prices are lower than LiveCareer's",
    "You will cancel before day 14, or deliberately choose the annual plan",
  ],
  chooseB: [
    "You want the cheapest trial and will definitely cancel before day 14",
    "You prefer LiveCareer's template set; features are otherwise very close",
    "You also want an HTML copy of your CV, which LiveCareer lists alongside Word and PDF",
  ],
  cancelGuides: { a: "/cancel-myperfectcv-uk", b: "/cancel-livecareer-uk" },
  faqs: [
    {
      question: "Are MyPerfectCV and LiveCareer the same company?",
      answer: `Yes. The terms of use on myperfectcv.co.uk and livecareer.co.uk both name ${a.operator} as the company you contract with (checked ${a.checked}). They are separate websites with different templates and prices.`,
    },
    {
      question: "Is MyPerfectCV free?",
      answer: `Partly. ${a.freePlan} The paid trial is ${gbp(a.trial.entryMinor)} for 14 days, then ${gbp(a.trial.renewalMinor)} every 4 weeks unless cancelled.`,
    },
    {
      question: "Is LiveCareer free?",
      answer: `Partly. ${b.freePlan} The paid trial is ${gbp(b.trial.entryMinor)} for 14 days, then ${gbp(b.trial.renewalMinor)} every 4 weeks unless cancelled.`,
    },
    {
      question: "Which is cheaper, MyPerfectCV or LiveCareer?",
      answer: `LiveCareer's 14-day trial is cheaper (${gbp(b.trial.entryMinor)} against ${gbp(a.trial.entryMinor)}), but MyPerfectCV is cheaper after that: ${gbp(a.trial.renewalMinor)} every 4 weeks against ${gbp(b.trial.renewalMinor)}, and ${gbp(a.annual.totalMinor)} a year against ${gbp(b.annual.totalMinor)}.`,
    },
    {
      question: "How do I avoid being charged after the trial?",
      answer: "Cancel before the 14-day trial ends and keep the confirmation email. Both sites renew automatically every four weeks after the trial. WorkCV's cancellation guides link to each provider's official route.",
    },
    {
      question: "Does WorkCV renew automatically?",
      answer: `No. WorkCV charges ${site.price} once for one CV and its matching cover letter, or ${site.passPrice} once for ${site.passDays} days of CVs and letters. Neither renews.`,
    },
  ],
};

export default function MyPerfectCvVsLiveCareerPage() {
  return <CompetitorVsPage config={config} />;
}
