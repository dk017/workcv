import type { NextRequest } from "next/server";

import { markdownPageResponse, optionsResponse, textResponse } from "../../../../lib/md/http.ts";
import { listMarkdownRoutes } from "../../../../lib/md/registry.ts";
import { site } from "../../../../lib/site.ts";

// The one markdown handler. middleware.ts rewrites /<path>.md and Accept: text/markdown requests here.
export const dynamic = "force-dynamic";

type Context = { params: { path?: string[] } };

function handle(request: NextRequest, { params }: Context) {
  const segments = params.path ?? [];
  if (segments.length === 1 && segments[0] === "_catalog") {
    const catalog = { site: site.name, url: site.url, llms: `${site.url}/llms.txt`, routes: listMarkdownRoutes() };
    return textResponse(request, JSON.stringify(catalog, null, 2), "application/json; charset=utf-8", { sMaxAge: 3600, staleWhileRevalidate: 86400 });
  }
  const path = !segments.length || (segments.length === 1 && segments[0] === "index") ? "/" : `/${segments.join("/")}`;
  return markdownPageResponse(request, path);
}

export const GET = handle;
export const HEAD = handle;

export function OPTIONS() {
  return optionsResponse();
}
