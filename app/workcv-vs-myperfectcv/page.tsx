import { CompetitorVsPage } from "@/components/compare/competitor-vs-page";
import { vsMetadata } from "@/components/compare/metadata";
import { getCompetitor } from "@/lib/competitors";

const competitor = getCompetitor("myperfectcv");

export const metadata = vsMetadata(competitor);

export default function MyperfectcvVsPage() {
  return <CompetitorVsPage competitor={competitor} />;
}
