import { homepageMarkdown } from "../../lib/agent-discovery.ts";

export const dynamic = "force-static";

export function GET() {
  return new Response(homepageMarkdown, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
