import type { Metadata } from "next";
import { SearchAlternativePage } from "@/components/search-alternative-page";
const title = "MyPerfectCV Alternative UK: CVs Without Renewal";
const description = "Compare MyPerfectCV's paid plans with WorkCV's £7.99 saved pair and £24.99 Job Search Pass. See download formats, renewal terms and who each suits.";
export const metadata: Metadata = { title, description, alternates: { canonical: "/myperfectcv-alternative-uk" }, openGraph: { title, description, url: "/myperfectcv-alternative-uk" } };
export default function Page() { return <SearchAlternativePage brandKey="myPerfectCv"/>; }
