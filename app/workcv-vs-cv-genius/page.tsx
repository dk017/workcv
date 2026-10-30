import { CompetitorVsPage } from "@/components/compare/competitor-vs-page";
import { vsMetadata } from "@/components/compare/metadata";
import { withAgentMetadata } from "@/lib/agent-metadata";
import { getCompetitor } from "@/lib/competitors";

const competitor = getCompetitor("cv-genius");

export const metadata = withAgentMetadata(competitor.vsPath, vsMetadata(competitor), competitor.vs.answer);

export default function CvGeniusVsPage() {
  return <CompetitorVsPage competitor={competitor} />;
}
