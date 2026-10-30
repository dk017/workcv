import { CompetitorVsPage } from "@/components/compare/competitor-vs-page";
import { vsMetadata } from "@/components/compare/metadata";
import { getCompetitor } from "@/lib/competitors";

const competitor = getCompetitor("flowcv");

export const metadata = vsMetadata(competitor);

export default function FlowcvVsPage() {
  return <CompetitorVsPage competitor={competitor} />;
}
