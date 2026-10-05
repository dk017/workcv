import type { Metadata } from "next";
import { SearchAlternativePage } from "@/components/search-alternative-page";
const title = "LiveCareer Alternative UK: Compare One-Time CV Plans";
const description = "Compare LiveCareer with WorkCV: download formats, renewal costs and one-time plans for one saved CV or separate applications during a 90-day job search.";
export const metadata: Metadata = { title, description, alternates: { canonical: "/livecareer-alternative" }, openGraph: { title, description, url: "/livecareer-alternative" } };
export default function Page() { return <SearchAlternativePage brandKey="liveCareer"/>; }
