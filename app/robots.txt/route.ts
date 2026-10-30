import { privatePaths } from "../../lib/md/public-routes.ts";
import { site } from "../../lib/site.ts";

export const dynamic = "force-static";

// Search and user-directed retrieval: these decide whether answer engines can cite WorkCV.
const allowedAgents = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Googlebot",
  // Training and grounding opt-ins kept for broader Gemini and Apple Intelligence visibility.
  "Google-Extended",
  "Google-CloudVertexBot",
  "Applebot-Extended",
];

// Training-only crawlers. Blocking them does not stop the search agents above citing the site.
const blockedAgents = ["GPTBot", "ClaudeBot", "CCBot", "Bytespider"];

// A named group replaces the * group for that crawler, so every allowed group repeats the private paths.
const privateRules = [
  "Allow: /api/md/",
  ...privatePaths.filter((path) => path.robotsDisallow).map((path) => `Disallow: ${path.path}`),
];

export function GET() {
  const body = [
    "# WorkCV robots.txt. Keep in sync with /llms.txt and /ai.txt.",
    `# Agent orientation: ${site.url}/llms.txt`,
    `# AI usage policy: ${site.url}/ai.txt`,
    "# Search and user-directed retrieval are allowed.",
    "# OpenAI, Anthropic, Common Crawl and ByteDance training crawlers are blocked.",
    "# Google-Extended and Applebot-Extended are allowed for broader Gemini and Apple Intelligence visibility.",
    "",
    ...allowedAgents.flatMap((agent) => [`User-agent: ${agent}`, "Allow: /", ...privateRules, ""]),
    ...blockedAgents.flatMap((agent) => [`User-agent: ${agent}`, "Disallow: /", ""]),
    "User-agent: *",
    "Allow: /",
    ...privateRules,
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
