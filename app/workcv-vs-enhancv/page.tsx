import { CompetitorVsPage } from "@/components/compare/competitor-vs-page";
import { vsMetadata } from "@/components/compare/metadata";
import { withAgentMetadata } from "@/lib/agent-metadata";
import { getCompetitor } from "@/lib/competitors";

const competitor = getCompetitor("enhancv");

export const metadata = withAgentMetadata(competitor.vsPath, vsMetadata(competitor), competitor.vs.answer);

export default function EnhancvVsPage() {
  return <CompetitorVsPage competitor={competitor} />;
}
