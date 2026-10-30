import { CompetitorAlternativesPage } from "@/components/compare/competitor-alternatives-page";
import { altMetadata } from "@/components/compare/metadata";
import { getCompetitor } from "@/lib/competitors";

const competitor = getCompetitor("resume-io");

export const metadata = altMetadata(competitor);

export default function ResumeIoAlternativesPage() {
  return <CompetitorAlternativesPage competitor={competitor} />;
}
