import { CompetitorVsPage } from "@/components/compare/competitor-vs-page";
import { vsMetadata } from "@/components/compare/metadata";
import { getCompetitor } from "@/lib/competitors";

const competitor = getCompetitor("kickresume");

export const metadata = vsMetadata(competitor);

export default function KickresumeVsPage() {
  return <CompetitorVsPage competitor={competitor} />;
}
