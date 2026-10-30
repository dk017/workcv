import { buildAiTxt } from "../../lib/md/site-files.ts";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildAiTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
