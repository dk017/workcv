import { CompetitorVsPage } from "@/components/compare/competitor-vs-page";
import { vsMetadata } from "@/components/compare/metadata";
import { withAgentMetadata } from "@/lib/agent-metadata";
import { getCompetitor } from "@/lib/competitors";

const competitor = getCompetitor("canva");

export const metadata = withAgentMetadata(competitor.vsPath, vsMetadata(competitor), competitor.vs.answer);

export default function CanvaVsPage() {
  return <CompetitorVsPage competitor={competitor} />;
}
