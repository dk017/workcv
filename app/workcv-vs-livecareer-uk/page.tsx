import type { Metadata } from "next";
import { WorkcvVsPage } from "@/components/workcv-vs-page";
import { withAgentMetadata } from "@/lib/agent-metadata";
import { workcvVsPage } from "@/lib/workcv-vs";
const page = workcvVsPage("/workcv-vs-livecareer-uk");
export const metadata: Metadata = withAgentMetadata(page.path, { title: { absolute: page.title }, description: page.description, alternates: { canonical: page.path }, openGraph: { title: page.title, description: page.description, url: page.path } });
export default function Page() { return <WorkcvVsPage page={page} />; }
