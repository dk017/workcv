import { CompetitorAlternativesPage } from "@/components/compare/competitor-alternatives-page";
import { altMetadata } from "@/components/compare/metadata";
import { withAgentMetadata } from "@/lib/agent-metadata";
import { getCompetitor } from "@/lib/competitors";

const competitor = getCompetitor("flowcv");

export const metadata = withAgentMetadata(competitor.altPath, altMetadata(competitor), competitor.alt.answer);

export default function FlowcvAlternativesPage() {
  return <CompetitorAlternativesPage competitor={competitor} />;
}
