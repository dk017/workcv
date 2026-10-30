import { CompetitorAlternativesPage } from "@/components/compare/competitor-alternatives-page";
import { altMetadata } from "@/components/compare/metadata";
import { getCompetitor } from "@/lib/competitors";

const competitor = getCompetitor("livecareer");

export const metadata = altMetadata(competitor);

export default function LivecareerAlternativesPage() {
  return <CompetitorAlternativesPage competitor={competitor} />;
}
