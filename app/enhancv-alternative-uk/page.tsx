import type { Metadata } from "next";
import { CvBuilderAlternativesPage } from "@/components/cv-builder-alternatives-page";
import { withAgentMetadata } from "@/lib/agent-metadata";
import { alternativeBrand } from "@/lib/cv-builder-alternatives";
const page = alternativeBrand("/enhancv-alternative-uk");
export const metadata: Metadata = withAgentMetadata(page.path, { title: { absolute: page.title }, description: page.description, alternates: { canonical: page.path }, openGraph: { title: page.title, description: page.description, url: page.path } });
export default function Page() { return <CvBuilderAlternativesPage page={page} />; }
