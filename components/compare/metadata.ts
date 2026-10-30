import type { Metadata } from "next";

import { comparisonCheckedIso, type Competitor } from "@/lib/competitors";

function pageMetadata(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "article",
      modifiedTime: comparisonCheckedIso,
    },
  };
}

export const vsMetadata = (competitor: Competitor) =>
  pageMetadata(competitor.vsPath, competitor.vs.title, competitor.vs.description);

export const altMetadata = (competitor: Competitor) =>
  pageMetadata(competitor.altPath, competitor.alt.title, competitor.alt.description);
