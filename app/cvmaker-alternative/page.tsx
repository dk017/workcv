import type { Metadata } from "next";

import {
  FocusedAlternativePage,
  type FocusedAlternativeConfig,
} from "@/components/focused-alternative-page";
import { site } from "@/lib/site";

const slug = "/cvmaker-alternative";

export const metadata: Metadata = {
  title: "CVMaker Alternative UK - No Subscription CV Builder",
  description:
    `Compare CVMaker with WorkCV's ${site.price} saved-CV PDF unlock, including billing model, document scope and cancellation links.`,
  alternates: { canonical: slug },
  openGraph: {
    title: "CVMaker Alternative UK - WorkCV",
    description:
      "An independent comparison between CVMaker's broader service and WorkCV's focused one-CV model.",
    url: slug,
  },
};

const config: FocusedAlternativeConfig = {
  brand: "CVMaker",
  slug,
  checkedDate: "23 July 2026",
  kicker: "CVMaker alternative UK",
  heading: "CVMaker sells ongoing document access. WorkCV unlocks one saved UK CV.",
  intro:
    `CVMaker may suit people who want its wider CV service and continuing account access. WorkCV is deliberately narrower: build and preview one UK CV, then pay ${site.price} to unlock that saved document.`,
  competitorFit: [
    "You want CVMaker's broader template and account features",
    "You expect to maintain documents through an ongoing service",
    "Its live checkout terms and renewal model suit your needs",
    "You have checked how access changes after cancellation",
  ],
  comparisonRows: [
    ["Primary focus", "Online CV creation service", "Focused UK CV builder"],
    ["Before payment", "Check the live plan and checkout terms", "Build and inspect the preview"],
    ["Paid model", "Subscription terms shown by CVMaker", `${site.price} unlock for the selected saved CV`],
    ["Renewal", "Check the current renewal terms before paying", "No automatic WorkCV renewal"],
    ["Documents", "Broader service and template catalogue", "One saved CV per payment"],
    ["Current limits", "Features depend on the selected CVMaker service", "No cover letters, AI scoring or application tracking"],
    ["Best fit", "Users who value the broader ongoing service", "One practical UK CV without recurring billing"],
  ],
  cancellationHref: "/cancel-cvmaker-uk",
  cancellationCopy:
    "Switching tools does not cancel an existing CVMaker subscription. Follow the official account process, keep written confirmation and check the next statement.",
  sources: [
    ["CVMaker UK pricing help", "https://www.cvmaker.uk/help/what-are-the-costs-of-cvmaker-uk"],
    ["CVMaker cancellation help", "https://www.cvmaker.uk/help/how-can-i-cancel-my-subscription"],
    ["CVMaker terms", "https://www.cvmaker.uk/terms-and-conditions"],
  ],
  faqs: [
    { question: "What is a good CVMaker alternative in the UK?", answer: `WorkCV may suit someone who wants one saved UK CV and no recurring WorkCV subscription. It costs ${site.price} to unlock the selected CV PDF.` },
    { question: "How is WorkCV different from CVMaker?", answer: "WorkCV focuses on one saved UK CV, three layouts and a one-time PDF unlock. Check CVMaker's official pages for its current service scope, pricing and renewal terms." },
    { question: "Does WorkCV renew automatically?", answer: "No. The standard WorkCV download flow does not start a monthly plan or automatic renewal." },
    { question: "How do I cancel CVMaker?", answer: "Use CVMaker's official account and cancellation guidance. The separate WorkCV guide links to official sources and explains what confirmation to keep." },
  ],
};

export default function CvMakerAlternativePage() {
  return <FocusedAlternativePage config={config} />;
}
