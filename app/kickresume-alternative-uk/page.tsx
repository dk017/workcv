import { CompetitorAlternativesPage } from "@/components/compare/competitor-alternatives-page";
import { altMetadata } from "@/components/compare/metadata";
import { withAgentMetadata } from "@/lib/agent-metadata";
import { getCompetitor } from "@/lib/competitors";

const competitor = getCompetitor("kickresume");

export const metadata = withAgentMetadata(competitor.altPath, altMetadata(competitor), competitor.alt.answer);

export default function KickresumeAlternativesPage() {
  return <CompetitorAlternativesPage competitor={competitor} />;
}
