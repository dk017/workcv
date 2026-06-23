import { NextRequest } from "next/server";

import { homepageMarkdown } from "@/lib/agent-discovery";

export const dynamic = "force-static";

export function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") || "/";

  if (path !== "/") {
    return new Response("Not found", { status: 404 });
  }

  return new Response(homepageMarkdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Vary": "Accept",
      "X-Markdown-Tokens": String(Math.ceil(homepageMarkdown.length / 4)),
    },
  });
}
