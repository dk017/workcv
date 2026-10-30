import { agentDescribedByLinks } from "../agent-discovery.ts";
import { markdownDocument, markdownNotFound, markdownTokens } from "./format.ts";
import { renderMarkdownPage } from "./registry.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Accept, Content-Type",
  "Access-Control-Expose-Headers": "Content-Location, Link, Last-Modified, X-Markdown-Tokens",
};

type MarkdownResponseOptions = {
  status?: number;
  canonical?: string;
  lastModified?: string;
  sMaxAge?: number;
  staleWhileRevalidate?: number;
};

export function markdownResponse(request: Request, body: string, options: MarkdownResponseOptions = {}) {
  const { status = 200, canonical, lastModified, sMaxAge = 3600, staleWhileRevalidate = 86400 } = options;
  const headers = new Headers({
    ...corsHeaders,
    "Content-Type": "text/markdown; charset=utf-8",
    "X-Markdown-Tokens": String(markdownTokens(body)),
    // The HTML page stays canonical, so search engines never index the markdown copy.
    "X-Robots-Tag": "noindex, follow",
    "X-Content-Type-Options": "nosniff",
    "Vary": "Accept",
    "Cache-Control": `public, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
    "Link": [...(canonical ? [`<${canonical}>; rel="canonical"`] : []), ...agentDescribedByLinks].join(", "),
  });
  if (canonical) headers.set("Content-Location", canonical);
  if (lastModified) headers.set("Last-Modified", new Date(`${lastModified}T00:00:00Z`).toUTCString());

  return new Response(request.method === "HEAD" ? null : body, { status, headers });
}

// Unknown, private and non-public paths all get the same markdown 404, never an HTML page.
export async function markdownPageResponse(request: Request, path: string) {
  try {
    const page = await renderMarkdownPage(path);
    if (!page) return markdownResponse(request, markdownNotFound(path), { status: 404, sMaxAge: 300 });
    return markdownResponse(request, markdownDocument(page), { canonical: page.canonical, lastModified: page.lastUpdated });
  } catch (error) {
    console.error("[markdown]", error);
    return markdownResponse(request, "# Temporarily unavailable\n\nThe markdown version of this page could not be built. Try the HTML page instead.\n", { status: 503, sMaxAge: 0, staleWhileRevalidate: 0 });
  }
}

export function textResponse(request: Request, body: string, contentType: string, options: { sMaxAge?: number; staleWhileRevalidate?: number } = {}) {
  const { sMaxAge = 86400, staleWhileRevalidate = 604800 } = options;
  return new Response(request.method === "HEAD" ? null : body, {
    headers: {
      ...corsHeaders,
      "Content-Type": contentType,
      "Cache-Control": `public, max-age=3600, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export function optionsResponse() {
  return new Response(null, { status: 204, headers: { ...corsHeaders, "Access-Control-Max-Age": "86400" } });
}
