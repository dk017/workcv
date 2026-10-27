import type { Metadata } from "next";

import { markdownUrl } from "./md/format.ts";

// Adds the head tags agents look for: <link rel="alternate" type="text/markdown"> pointing at the
// page's markdown version, and <meta name="ai-summary">, which defaults to the meta description.
// A page's alternates replace the layout's, so each public page wraps its own metadata.
export function withAgentMetadata(path: string, metadata: Metadata, aiSummary?: string): Metadata {
  const summary = aiSummary ?? (typeof metadata.description === "string" ? metadata.description : undefined);
  const other = summary ? Object.assign({}, metadata.other, { "ai-summary": summary }) : metadata.other;
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      canonical: metadata.alternates?.canonical ?? path,
      types: { ...metadata.alternates?.types, "text/markdown": markdownUrl(path) },
    },
    ...(other ? { other } : {}),
  };
}
