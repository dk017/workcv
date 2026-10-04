import type { Metadata } from "next";

import {
  FocusedAlternativePage,
  type FocusedAlternativeConfig,
} from "@/components/focused-alternative-page";
import { competitorPlans } from "@/lib/competitor-plans";
import { site } from "@/lib/site";

const slug = "/kickresume-alternative-uk";
const kickresume = competitorPlans.kickresume;

export const metadata: Metadata = {
  title: "Kickresume Alternative UK - Is Kickresume Free?",
  description: `Is Kickresume free, and does it renew? An honest UK comparison of Kickresume's free and paid plans with WorkCV's ${site.price} one-time CV and cover letter.`,
  alternates: { canonical: slug },
  openGraph: {
    title: "Kickresume Alternative UK - WorkCV",
    description: "Kickresume's free plan, its auto-renewing paid plans, and when a one-time UK CV builder fits better.",
    url: slug,
  },
};

const config: FocusedAlternativeConfig = {
  brand: "Kickresume",
  slug,
  checkedDate: kickresume.checked,
  kicker: "Kickresume alternative UK",
  heading: "Kickresume is free for basic resumes. WorkCV is for a finished UK CV with nothing to cancel.",
  intro: `If Kickresume's four free templates are enough, you may not need to pay anyone: its free plan downloads as often as you like. Its paid plans renew automatically. WorkCV builds UK CVs with a matching cover letter for ${site.price} once, or ${site.passPrice} once for ${site.passDays} days.`,
  competitorFit: [
    "The 4 free templates are enough and you want free downloads",
    "You are a student who can get free Premium with ISIC, ITIC or UNiDAYS",
    "You want its AI Writer, personal website templates or mobile apps",
    "You are applying outside the UK and need a resume",
  ],
  comparisonRows: [
    ["Free use", "4 basic templates, unlimited downloads", "Build and preview free; pay to download"],
    ["Paid plans", "$9 a month, $18 for 3 months or $48 a year (shown to us in US dollars)", `${site.price} once per CV, or ${site.passPrice} once for ${site.passDays} days`],
    ["Renewal", "Kickresume's terms: monthly, quarterly and annual plans auto-renew until cancelled", "Nothing renews"],
    ["Cancelling", "Cancel before the current term ends; no refund for the rest of the period", "Nothing to cancel"],
    ["Money-back", "14-day money-back guarantee for new subscribers, once per user", "See WorkCV's refund policy"],
    ["Templates", "40+ premium templates", "3 UK CV layouts"],
    ["Focus", "International resumes, personal websites, career tools", "UK CVs and matching cover letters"],
  ],
  cancellationHref: kickresume.operatorSource,
  cancellationCopy:
    "Kickresume's terms say paid plans renew automatically and must be cancelled before the end of the current term to stop the next charge; no refund is paid for the remaining period. Starting a WorkCV CV does not cancel Kickresume.",
  freePlan: `Mostly, yes. ${kickresume.freePlan} Premium templates, the AI Writer and extra customisation need a paid plan, which renews automatically. Students can get Premium free with ISIC, ITIC or UNiDAYS.`,
  sources: [
    ["Kickresume pricing", kickresume.pricingSource],
    ["Kickresume terms of use", kickresume.operatorSource],
  ],
  faqs: [
    {
      question: "Is Kickresume free?",
      answer: `Mostly. ${kickresume.freePlan} Premium templates and the AI Writer need a paid plan (checked ${kickresume.checked}).`,
    },
    {
      question: "Does Kickresume renew automatically?",
      answer: "Yes. Its pricing page shows each plan as a single payment, but Kickresume's terms say auto-renew is selected for monthly, quarterly and annual plans, and you must cancel before the current term ends to avoid the next charge.",
    },
    {
      question: "Is Kickresume good for a UK CV?",
      answer: "It can be. Kickresume is an international builder that writes about resumes, so check your document follows UK CV conventions: no photo, no date of birth and a two-page length for most roles.",
    },
    {
      question: "How is WorkCV different from Kickresume?",
      answer: `WorkCV only does UK CVs and matching cover letters. You build and preview free, then pay ${site.price} once to download one CV and its letter as PDF and Word, or ${site.passPrice} once for ${site.passDays} days. It has fewer templates and no personal website or mobile app.`,
    },
    {
      question: "Do I need to cancel WorkCV?",
      answer: "No. WorkCV payments are one-off and never renew.",
    },
  ],
};

export default function KickresumeAlternativePage() {
  return <FocusedAlternativePage config={config} />;
}
