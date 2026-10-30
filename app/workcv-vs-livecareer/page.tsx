import { CompetitorVsPage } from "@/components/compare/competitor-vs-page";
import { vsMetadata } from "@/components/compare/metadata";
import { getCompetitor } from "@/lib/competitors";

const competitor = getCompetitor("livecareer");

export const metadata = vsMetadata(competitor);

export default function LivecareerVsPage() {
  return <CompetitorVsPage competitor={competitor} />;
}
