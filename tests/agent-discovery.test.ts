import assert from "node:assert/strict";
import test from "node:test";

import { NextRequest } from "next/server.js";

import { GET as getAuth } from "../app/auth.md/route.ts";
import { GET as getRobots } from "../app/robots.txt/route.ts";
import { agentDiscoveryLinkHeader } from "../lib/agent-discovery.ts";
import { middleware } from "../middleware.ts";

const expectedSearchAgents = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Googlebot",
  "Google-Extended",
  "Google-CloudVertexBot",
  "Applebot-Extended",
];

const expectedBlockedTrainingAgents = ["GPTBot", "ClaudeBot", "CCBot", "Bytespider"];

test("robots response allows discovery crawlers and blocks opted-out training crawlers", async () => {
  const response = getRobots();
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
  assert.equal(
    response.headers.get("cache-control"),
    "public, max-age=3600, s-maxage=86400",
  );
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");

  for (const bot of expectedSearchAgents) {
    assert.match(body, new RegExp(`User-agent: ${bot}\\nAllow: /\\nAllow: /api/md/\\nDisallow: /admin\\n`), bot);
  }
  for (const bot of expectedBlockedTrainingAgents) {
    assert.match(body, new RegExp(`User-agent: ${bot}\\nDisallow: /(?:\\n|$)`), bot);
  }

  assert.match(body, /User-agent: \*\nAllow: \/\nAllow: \/api\/md\/\nDisallow: \/admin\nDisallow: \/api\/\nDisallow: \/cv-pdf\n/);
  // Pages linked from public pages keep their noindex header visible to crawlers.
  assert.doesNotMatch(body, /Disallow: \/(editor|login|my-cvs|account)/);
  assert.match(body, /llms\.txt/);
  assert.match(body, /ai\.txt/);
  assert.doesNotMatch(body, /Content-Signal:/);
  assert.match(body, /Sitemap: https:\/\/workcv\.co\.uk\/sitemap\.xml/);
});

test("auth response links to the LLM orientation surface", async () => {
  const response = getAuth();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "text/markdown; charset=utf-8");
  assert.match(await response.text(), /LLM orientation: https:\/\/workcv\.co\.uk\/llms\.txt/);
});

test("homepage middleware advertises discovery links for HTML and rewrites markdown requests", () => {
  const htmlResponse = middleware(
    new NextRequest("https://workcv.co.uk/", {
      headers: { Accept: "text/html" },
    }),
  );

  assert.equal(htmlResponse.headers.get("link"), agentDiscoveryLinkHeader);
  assert.match(agentDiscoveryLinkHeader, /<\/index\.md>; rel="alternate"; type="text\/markdown"/);
  assert.match(agentDiscoveryLinkHeader, /<\/llms\.txt>; rel="describedby"/);
  assert.match(htmlResponse.headers.get("vary") ?? "", /Accept/i);

  const markdownResponse = middleware(
    new NextRequest("https://workcv.co.uk/", {
      headers: { Accept: "text/markdown" },
    }),
  );

  assert.equal(
    markdownResponse.headers.get("x-middleware-rewrite"),
    "https://workcv.co.uk/api/md/index",
  );
});

test("middleware routes .md URLs and negotiated requests to the markdown handler", () => {
  const rewrite = (path: string, accept?: string) => middleware(
    new NextRequest(`https://workcv.co.uk${path}`, accept ? { headers: { Accept: accept } } : undefined),
  ).headers.get("x-middleware-rewrite");

  assert.equal(rewrite("/pricing.md"), "https://workcv.co.uk/api/md/pricing");
  assert.equal(rewrite("/index.md"), "https://workcv.co.uk/api/md/index");
  assert.equal(rewrite("/tools/ats-score-checker.md"), "https://workcv.co.uk/api/md/tools/ats-score-checker");
  // Unknown and private pages still reach the handler, which answers with a markdown 404.
  assert.equal(rewrite("/does-not-exist.md"), "https://workcv.co.uk/api/md/does-not-exist");
  assert.equal(rewrite("/pricing", "text/markdown, text/html;q=0.9"), "https://workcv.co.uk/api/md/pricing");

  assert.equal(rewrite("/auth.md"), null);
  assert.equal(rewrite("/agent-skills/create-uk-cv.md"), null);
  assert.equal(rewrite("/pricing"), null);
  assert.equal(rewrite("/pricing", "*/*"), null);
  assert.equal(rewrite("/pricing", "text/html, text/markdown"), null);
  assert.equal(rewrite("/editor", "text/markdown"), null);

  const html = middleware(new NextRequest("https://workcv.co.uk/pricing"));
  assert.match(html.headers.get("link") ?? "", /^<\/pricing\.md>; rel="alternate"; type="text\/markdown", <\/llms\.txt>; rel="describedby"/);
  assert.match(html.headers.get("link") ?? "", /<\/ai\.txt>; rel="describedby"/);
  assert.equal(middleware(new NextRequest("https://workcv.co.uk/editor")).headers.get("link"), null);
});
