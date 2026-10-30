import { textResponse } from "../../lib/md/http.ts";
import { buildLlmsTxt } from "../../lib/md/site-files.ts";

// Built from the public route list and each page's own title and description, so it never goes stale.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return textResponse(request, await buildLlmsTxt(), "text/plain; charset=utf-8");
}

export const HEAD = GET;
