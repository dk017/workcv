import { CompetitorVsPage } from "@/components/compare/competitor-vs-page";
import { vsMetadata } from "@/components/compare/metadata";
import { getCompetitor } from "@/lib/competitors";

const competitor = getCompetitor("enhancv");

export const metadata = vsMetadata(competitor);

export default function EnhancvVsPage() {
  return <CompetitorVsPage competitor={competitor} />;
}
