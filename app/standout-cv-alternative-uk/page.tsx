import { CompetitorAlternativesPage } from "@/components/compare/competitor-alternatives-page";
import { altMetadata } from "@/components/compare/metadata";
import { getCompetitor } from "@/lib/competitors";

const competitor = getCompetitor("standout-cv");

export const metadata = altMetadata(competitor);

export default function StandoutCvAlternativesPage() {
  return <CompetitorAlternativesPage competitor={competitor} />;
}
