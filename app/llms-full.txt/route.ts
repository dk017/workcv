import { textResponse } from "../../lib/md/http.ts";
import { buildLlmsFullTxt } from "../../lib/md/site-files.ts";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return textResponse(request, await buildLlmsFullTxt(), "text/plain; charset=utf-8");
}

export const HEAD = GET;
