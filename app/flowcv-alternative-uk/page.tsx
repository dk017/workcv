import { CompetitorAlternativesPage } from "@/components/compare/competitor-alternatives-page";
import { altMetadata } from "@/components/compare/metadata";
import { getCompetitor } from "@/lib/competitors";

const competitor = getCompetitor("flowcv");

export const metadata = altMetadata(competitor);

export default function FlowcvAlternativesPage() {
  return <CompetitorAlternativesPage competitor={competitor} />;
}
