import assert from "node:assert/strict";
import test from "node:test";

import { NextRequest } from "next/server.js";

import { GET as getAuth } from "../app/auth.md/route.ts";
import { GET as getLlms } from "../app/llms.txt/route.ts";
import { GET as getRobots } from "../app/robots.txt/route.ts";
import {
  agentDiscoveryLinkHeader,
  homepageMarkdown,
} from "../lib/agent-discovery.ts";
import { middleware } from "../middleware.ts";

const expectedSearchAgents = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "Googlebot",
  "Google-Extended",
  "Google-CloudVertexBot",
];

const expectedBlockedTrainingAgents = ["GPTBot", "ClaudeBot"];

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
    assert.match(body, new RegExp(`User-agent: ${bot}\\nAllow: /(?:\\n|$)`), bot);
  }
  for (const bot of expectedBlockedTrainingAgents) {
    assert.match(body, new RegExp(`User-agent: ${bot}\\nDisallow: /(?:\\n|$)`), bot);
  }

  assert.doesNotMatch(body, /Content-Signal:/);
  assert.match(body, /Sitemap: https:\/\/workcv\.co\.uk\/sitemap\.xml/);
});

test("llms response emits the maintained orientation with production headers", async () => {
  const response = getLlms();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
  assert.equal(
    response.headers.get("cache-control"),
    "public, max-age=3600, s-maxage=86400",
  );
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(await response.text(), homepageMarkdown);
  assert.match(homepageMarkdown, /LLM orientation file: https:\/\/workcv\.co\.uk\/llms\.txt/);
});

test("auth response links to the LLM orientation surface", async () => {
  const response = getAuth();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "text/markdown; charset=utf-8");
  assert.match(await response.text(), /LLM orientation: https:\/\/workcv\.co\.uk\/llms\.txt/);
});

test("homepage middleware advertises discovery links for HTML and markdown", () => {
  const htmlResponse = middleware(
    new NextRequest("https://workcv.co.uk/", {
      headers: { Accept: "text/html" },
    }),
  );

  assert.equal(htmlResponse.headers.get("link"), agentDiscoveryLinkHeader);
  assert.match(htmlResponse.headers.get("vary") ?? "", /Accept/i);

  const markdownResponse = middleware(
    new NextRequest("https://workcv.co.uk/", {
      headers: { Accept: "text/markdown" },
    }),
  );

  assert.equal(markdownResponse.headers.get("link"), agentDiscoveryLinkHeader);
  assert.match(markdownResponse.headers.get("vary") ?? "", /Accept/i);
  assert.equal(
    markdownResponse.headers.get("x-middleware-rewrite"),
    "https://workcv.co.uk/agent-markdown?path=%2F",
  );
});
