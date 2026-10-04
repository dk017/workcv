import type { Metadata } from "next";

import { CompetitorVsPage, type CompetitorVsConfig } from "@/components/competitor-vs-page";
import { competitorPlans, formatMinor } from "@/lib/competitor-plans";
import { site } from "@/lib/site";

// Zety first in the title to match how people search; MyPerfectCV is the
// UK-priced site, so it carries the pound figures.
const a = competitorPlans.zety;
const b = competitorPlans.myPerfectCv;
const usd = (minor: number) => formatMinor(minor, "USD");
const gbp = (minor: number) => formatMinor(minor, "GBP");

export const metadata: Metadata = {
  title: "Zety vs MyPerfectCV UK: Same Company, Compared",
  description: `Zety vs MyPerfectCV for UK job seekers: both are run by BOLD LLC. Compare free plans, trial renewals and templates, plus a no-renewal alternative at ${site.price}.`,
  alternates: { canonical: "/zety-vs-myperfectcv-uk" },
  openGraph: {
    title: "Zety vs MyPerfectCV UK – WorkCV",
    description: "Both are run by BOLD LLC and use a renewing 14-day trial. A sourced UK comparison.",
    url: "/zety-vs-myperfectcv-uk",
  },
};

const config: CompetitorVsConfig = {
  slug: "/zety-vs-myperfectcv-uk",
  a,
  b,
  heading: "Zety vs MyPerfectCV: which should UK job seekers use?",
  shortAnswer: [
    `Zety and MyPerfectCV are run by the same company, ${a.operator}. Both let you build for free, charge a small 14-day trial fee to download a PDF or Word file, and then renew every four weeks until you cancel.`,
    `MyPerfectCV is the UK site: it talks about CVs, prices in pounds (${gbp(b.trial.entryMinor)} for 14 days, then ${gbp(b.trial.renewalMinor)} every 4 weeks) and has more templates. Zety's main site is US-focused and writes about resumes; its UK pricing address sent us to US-dollar prices (${usd(a.trial.entryMinor)}, then ${usd(a.trial.renewalMinor)} every 4 weeks), so check the price at checkout.`,
    `If you only need a finished UK CV and do not want a renewing trial, WorkCV costs ${site.price} once for one CV and its cover letter, or ${site.passPrice} once for ${site.passDays} days of applications.`,
  ],
  sameOperatorNote:
    "Both offer the same Bold.pro online profile and the same trial-then-renewal model, so the choice is mainly about templates, wording and the currency you are charged in.",
  featureRows: [
    ["Company you contract with", a.operator, b.operator, "WorkCV, an independent UK CV builder"],
    ["Focus", "International site that writes about resumes", "UK site built around CVs", "UK CVs and cover letters only"],
    ["Free plan downloads", "TXT only", "TXT only", "No free download of a built CV; free blank Word template"],
    ["Trial", `${usd(a.trial.entryMinor)} for 14 days (US-dollar page)`, `${gbp(b.trial.entryMinor)} for 14 days`, "No trial: pay once when you download"],
    ["After the trial", `${usd(a.trial.renewalMinor)} every 4 weeks until cancelled`, `${gbp(b.trial.renewalMinor)} every 4 weeks until cancelled`, "Nothing renews"],
    ["Annual plan", `${usd(a.annual.totalMinor)} a year, renews yearly`, `${gbp(b.annual.totalMinor)} a year, renews yearly`, `Not needed: ${site.passPrice} covers ${site.passDays} days, once`],
    ["Templates", "18+ templates", "Over 40 templates and 700 designs", "3 UK CV layouts"],
    ["Paid downloads", "PDF, Word and TXT", "PDF, Word and TXT", "PDF and Word"],
    ["Other tools", "Resume Check, job matches, Bold.pro profile", "CV Check, pre-written content, Bold.pro profile", "Free ATS checker and job tracker; AI suggestions only applied when you approve them"],
  ],
  chooseA: [
    "You are applying outside the UK and need a US-style resume",
    "You want its Resume Check and instant job matches",
    "You will cancel before the 14-day trial ends",
  ],
  chooseB: [
    "You are applying in the UK and want CV wording and pound pricing",
    "You want more templates and designs to choose from",
    "You will cancel before day 14, or deliberately choose the annual plan",
  ],
  cancelGuides: { a: "/cancel-zety-uk", b: "/cancel-myperfectcv-uk" },
  faqs: [
    {
      question: "Are Zety and MyPerfectCV the same company?",
      answer: `Yes. The terms of use on zety.com and myperfectcv.co.uk both name ${a.operator} as the company you contract with (checked ${a.checked}).`,
    },
    {
      question: "Is Zety free?",
      answer: `Partly. ${a.freePlan} The trial on Zety's US-dollar pricing page is ${usd(a.trial.entryMinor)} for 14 days, then ${usd(a.trial.renewalMinor)} every 4 weeks unless cancelled.`,
    },
    {
      question: "Is MyPerfectCV free?",
      answer: `Partly. ${b.freePlan} The paid trial is ${gbp(b.trial.entryMinor)} for 14 days, then ${gbp(b.trial.renewalMinor)} every 4 weeks unless cancelled.`,
    },
    {
      question: "Which is better for a UK CV, Zety or MyPerfectCV?",
      answer: "MyPerfectCV is the UK-focused site, with CV wording and pound pricing. Zety's main site is written for resumes. Both come from the same company and use the same renewing-trial model.",
    },
    {
      question: "How much does Zety cost in the UK?",
      answer: `Zety's UK pricing address redirected us to its US-dollar page on ${a.checked}, so we do not quote a pound price. Check the amount and renewal terms shown at Zety's checkout before paying.`,
    },
    {
      question: "Does WorkCV renew automatically?",
      answer: `No. WorkCV charges ${site.price} once for one CV and its matching cover letter, or ${site.passPrice} once for ${site.passDays} days of CVs and letters. Neither renews.`,
    },
  ],
};

export default function ZetyVsMyPerfectCvPage() {
  return <CompetitorVsPage config={config} />;
}
