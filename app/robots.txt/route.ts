import { site } from "../../lib/site.ts";

export const dynamic = "force-static";

export function GET() {
  const body = [
    "# Search and user-directed retrieval are allowed.",
    "# OpenAI and Anthropic training crawlers are blocked.",
    "# Google-Extended is allowed for broader Gemini visibility and grounding.",
    "",
    "User-agent: OAI-SearchBot",
    "Allow: /",
    "",
    "User-agent: ChatGPT-User",
    "Allow: /",
    "",
    "User-agent: GPTBot",
    "Disallow: /",
    "",
    "User-agent: Claude-SearchBot",
    "Allow: /",
    "",
    "User-agent: Claude-User",
    "Allow: /",
    "",
    "User-agent: ClaudeBot",
    "Disallow: /",
    "",
    "User-agent: Googlebot",
    "Allow: /",
    "",
    "User-agent: Google-Extended",
    "Allow: /",
    "",
    "User-agent: Google-CloudVertexBot",
    "Allow: /",
    "",
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${site.url}/sitemap.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
