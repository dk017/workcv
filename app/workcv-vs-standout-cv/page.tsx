import { CompetitorVsPage } from "@/components/compare/competitor-vs-page";
import { vsMetadata } from "@/components/compare/metadata";
import { getCompetitor } from "@/lib/competitors";

const competitor = getCompetitor("standout-cv");

export const metadata = vsMetadata(competitor);

export default function StandoutCvVsPage() {
  return <CompetitorVsPage competitor={competitor} />;
}
