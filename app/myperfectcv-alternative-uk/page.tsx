import { CompetitorAlternativesPage } from "@/components/compare/competitor-alternatives-page";
import { altMetadata } from "@/components/compare/metadata";
import { getCompetitor } from "@/lib/competitors";

const competitor = getCompetitor("myperfectcv");

export const metadata = altMetadata(competitor);

export default function MyperfectcvAlternativesPage() {
  return <CompetitorAlternativesPage competitor={competitor} />;
}
