import assert from "node:assert/strict";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { NextRequest } from "next/server.js";

import { GET as getAiTxt } from "../app/ai.txt/route.ts";
import { GET as getMarkdown, HEAD as headMarkdown, OPTIONS as optionsMarkdown } from "../app/api/md/[[...path]]/route.ts";
import { GET as getLlmsFull } from "../app/llms-full.txt/route.ts";
import { GET as getLlms } from "../app/llms.txt/route.ts";
import { withAgentMetadata } from "../lib/agent-metadata.ts";
import { prefersMarkdown } from "../lib/md/accept.ts";
import { htmlPageToMarkdown } from "../lib/md/html-to-markdown.ts";
import { nonPublicRoutes, publicRoutes } from "../lib/md/public-routes.ts";

function appPageRoutes(directory = "app", prefix = ""): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) return appPageRoutes(path, `${prefix}/${entry}`);
    return entry === "page.tsx" ? [prefix || "/"] : [];
  });
}

test("every page under app/ is either public (with a markdown version) or skipped with a reason", () => {
  const publicPaths = new Set<string>(publicRoutes.map((route) => route.path));
  const pages = appPageRoutes();
  for (const route of pages) {
    assert.ok(
      publicPaths.has(route) || route in nonPublicRoutes,
      `${route} has no markdown version. Add it to publicRoutes in lib/md/public-routes.ts, or to nonPublicRoutes with a reason.`,
    );
    assert.ok(!(publicPaths.has(route) && route in nonPublicRoutes), `${route} is in both lists`);
  }
  for (const { path } of publicRoutes) assert.ok(pages.includes(path), `${path} is listed as public but has no page`);
});

test("every public page advertises its markdown version and an ai-summary in <head>", () => {
  for (const route of publicRoutes) {
    const source = readFileSync(`app${route.path === "/" ? "" : route.path}/page.tsx`, "utf8");
    assert.match(source, /withAgentMetadata\(|guideMetadata\(/, route.path);
  }

  const metadata = withAgentMetadata("/pricing", { title: "Pricing", description: "What it costs." });
  assert.deepEqual(metadata.alternates, {
    canonical: "/pricing",
    types: { "text/markdown": "https://workcv.co.uk/pricing.md" },
  });
  assert.deepEqual(metadata.other, { "ai-summary": "What it costs." });
  assert.equal(withAgentMetadata("/", { description: "Home" }, "Own summary").other?.["ai-summary"], "Own summary");
  assert.equal(withAgentMetadata("/", {}).alternates?.types?.["text/markdown"], "https://workcv.co.uk/index.md");
});

test("markdown is negotiated only when the client ranks it above HTML", () => {
  assert.equal(prefersMarkdown("text/markdown"), true);
  assert.equal(prefersMarkdown("text/markdown, text/html;q=0.9, */*;q=0.8"), true);
  assert.equal(prefersMarkdown("text/html;q=0.5, text/markdown;q=0.8"), true);
  assert.equal(prefersMarkdown(null), false);
  assert.equal(prefersMarkdown("*/*"), false);
  assert.equal(prefersMarkdown("text/markdown, */*"), false);
  assert.equal(prefersMarkdown("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"), false);
  assert.equal(prefersMarkdown("text/markdown;q=0"), false);
});

test("the converter keeps the main content in reading order and drops page chrome", () => {
  const html = `<!DOCTYPE html><html><head><title>Pricing | WorkCV</title>
    <meta name="description" content="What WorkCV costs."/><link rel="canonical" href="https://workcv.co.uk/pricing"/></head>
    <body><header><a href="/">WorkCV</a></header><main>
      <h1>Choose a plan</h1>
      <p>Pay <strong>£7.99</strong> once &amp; keep it. See <a href="/terms">the terms</a>.</p>
      <nav><a href="/x">Skip me</a></nav>
      <form><label>Email</label><input name="email"/><button>Send</button></form>
      <div aria-hidden="true">Decoration</div><div class="hidden">Closed panel</div><div data-md-skip>Preview</div>
      <div class="grid md:hidden">Mobile cards</div><div class="hidden md:block">Desktop table</div>
      <h2>What you get</h2>
      <ul><li>PDF</li><li>Word <ul><li>Single column</li></ul></li></ul>
      <ol><li><strong>1. Build</strong><p>Write it.</p></li></ol>
      <table><tr><th>Plan</th><th>Price</th></tr><tr><td>One CV</td><td>£7.99</td></tr></table>
      <details><summary>Does it renew?</summary><p>No.</p></details>
      <a href="/cv-template-nurse-uk"><h3>Nurse CV</h3><p>A complete example.</p></a>
      <div><a href="/editor">Start</a><a href="#faq">Questions</a></div>
      <div class="whitespace-pre-wrap">Alex Morgan
Leeds</div>
    </main><footer>Footer links</footer></body></html>`;
  const page = htmlPageToMarkdown(html, "https://workcv.co.uk/pricing");

  assert.equal(page?.title, "Choose a plan");
  assert.equal(page?.headTitle, "Pricing");
  assert.equal(page?.description, "What WorkCV costs.");
  assert.equal(page?.canonical, "https://workcv.co.uk/pricing");
  assert.equal(page?.body, [
    "Pay **£7.99** once & keep it. See [the terms](https://workcv.co.uk/terms).",
    "Desktop table",
    "## What you get",
    "- PDF\n- Word\n  - Single column",
    "1. **Build**\n   Write it.",
    "| Plan | Price |\n| --- | --- |\n| One CV | £7.99 |",
    "### Does it renew?",
    "No.",
    "- [Nurse CV](https://workcv.co.uk/cv-template-nurse-uk) - A complete example.\n- [Start](https://workcv.co.uk/editor)\n- [Questions](https://workcv.co.uk/pricing#faq)",
    "```text\nAlex Morgan\nLeeds\n```",
  ].join("\n\n"));
  assert.equal(htmlPageToMarkdown("<html><body><p>No main</p></body></html>", "https://workcv.co.uk"), null);
});

function fixturePage(path: string) {
  return `<!DOCTYPE html><html><head><title>Label for ${path} | WorkCV</title>
    <meta name="description" content="Summary of ${path}."/><link rel="canonical" href="https://workcv.co.uk${path === "/" ? "" : path}"/></head>
    <body><header><a href="/login">Sign in</a></header><main><h1>Heading for ${path}</h1>
    <p>Content of ${path} with a <a href="/pricing">pricing link</a>.</p></main><footer>Footer</footer></body></html>`;
}

test("markdown, llms.txt and llms-full.txt are rendered from each page's own HTML", async (t) => {
  const publicPaths = new Set<string>(publicRoutes.map((route) => route.path));
  const fetched: string[] = [];
  const server = createServer((request, response) => {
    const path = request.url ?? "/";
    fetched.push(path);
    if (!publicPaths.has(path)) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }).end(fixturePage(path));
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  process.env.WORKCV_INTERNAL_ORIGIN = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  t.after(() => server.close());

  const markdown = (segments: string[], method = "GET") => {
    const request = new NextRequest(`https://workcv.co.uk/api/md/${segments.join("/")}`, { method });
    return (method === "HEAD" ? headMarkdown : getMarkdown)(request, { params: { path: segments } });
  };

  const pricing = await markdown(["pricing"]);
  assert.equal(pricing.status, 200);
  assert.equal(pricing.headers.get("content-type"), "text/markdown; charset=utf-8");
  assert.equal(pricing.headers.get("x-robots-tag"), "noindex, follow");
  assert.equal(pricing.headers.get("content-location"), "https://workcv.co.uk/pricing");
  assert.match(pricing.headers.get("link") ?? "", /^<https:\/\/workcv\.co\.uk\/pricing>; rel="canonical", <\/llms\.txt>; rel="describedby"/);
  assert.equal(pricing.headers.get("vary"), "Accept");
  assert.equal(pricing.headers.get("access-control-allow-origin"), "*");
  assert.equal(pricing.headers.get("last-modified"), "Fri, 02 Oct 2026 00:00:00 GMT");
  assert.match(pricing.headers.get("cache-control") ?? "", /s-maxage=3600, stale-while-revalidate=86400/);
  const body = await pricing.text();
  assert.equal(body, [
    "# Heading for /pricing",
    "> Summary of /pricing.",
    "Canonical: https://workcv.co.uk/pricing\nLast updated: 2026-10-02",
    "Content of /pricing with a [pricing link](https://workcv.co.uk/pricing).",
  ].join("\n\n") + "\n");
  assert.equal(pricing.headers.get("x-markdown-tokens"), String(Math.ceil(body.length / 4)));

  const head = await markdown(["pricing"], "HEAD");
  assert.equal(head.status, 200);
  assert.equal(head.headers.get("content-type"), "text/markdown; charset=utf-8");
  assert.equal(await head.text(), "");
  assert.equal(optionsMarkdown().status, 204);

  const home = await markdown(["index"]);
  assert.match(await home.text(), /^# Heading for \/\n\n> Summary of \/\.\n\nCanonical: https:\/\/workcv\.co\.uk\n/);

  for (const segments of [["does-not-exist"], ["editor"], ["my-cvs"], ["admin"]]) {
    const missing = await markdown(segments);
    assert.equal(missing.status, 404, segments.join("/"));
    assert.equal(missing.headers.get("content-type"), "text/markdown; charset=utf-8");
    assert.match(await missing.text(), /^# Page not found/);
  }
  assert.ok(!fetched.includes("/editor"), "private pages are never fetched");

  const catalog = await (await markdown(["_catalog"])).json();
  assert.equal(catalog.routes.length, publicRoutes.length);
  assert.deepEqual(catalog.routes.find((route: { path: string }) => route.path === "/pricing"), {
    path: "/pricing",
    section: "core",
    url: "https://workcv.co.uk/pricing",
    markdownUrl: "https://workcv.co.uk/pricing.md",
    priority: 0.95,
    lastModified: "2026-10-02",
  });

  const llmsRequest = new Request("https://workcv.co.uk/llms.txt");
  const llms = await (await getLlms(llmsRequest)).text();
  assert.match(llms, /^# WorkCV\n\n> WorkCV is a UK CV builder/);
  assert.match(llms, /\n## Core pages\n\n- \[Label for \/\]\(https:\/\/workcv\.co\.uk\/index\.md\): Summary of \/\.\n/);
  assert.match(llms, /- \[Label for \/pricing\]\(https:\/\/workcv\.co\.uk\/pricing\.md\): Summary of \/pricing\./);
  assert.match(llms, /## Machine-readable[\s\S]*llms-full\.txt[\s\S]*api\/md\/_catalog[\s\S]*sitemap\.xml[\s\S]*ai\.txt/);
  assert.match(llms, /## Optional\n\n[\s\S]*\/privacy\.md/);
  for (const route of publicRoutes) assert.ok(llms.includes(`(https://workcv.co.uk${route.path === "/" ? "/index" : route.path}.md)`), route.path);

  const full = await (await getLlmsFull(new Request("https://workcv.co.uk/llms-full.txt"))).text();
  assert.match(full, /^# WorkCV - full content\n\n> /);
  assert.match(full, /Generated: \d{4}-\d{2}-\d{2}\nPages: 109 of 109 public pages/);
  assert.match(full, /---\n<!-- source: https:\/\/workcv\.co\.uk\/pricing -->\n\n# Heading for \/pricing\n/);
  // Core pages come first, legal pages last.
  assert.ok(full.indexOf("source: https://workcv.co.uk -->") < full.indexOf("source: https://workcv.co.uk/how-to-write-a-cv-uk -->"));
  assert.ok(full.indexOf("source: https://workcv.co.uk/tools/ats-score-checker -->") < full.indexOf("source: https://workcv.co.uk/privacy -->"));
});

test("ai.txt carries the same identity as llms.txt and keeps private paths out of scope", async () => {
  const response = getAiTxt();
  const body = await response.text();
  assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
  for (const heading of ["Identity", "Permissions", "Restrictions", "Attribution", "Scope", "Contact", "Version"]) {
    assert.match(body, new RegExp(`\\n## ${heading}\\n`), heading);
  }
  assert.match(body, /Description: WorkCV is a UK CV builder/);
  assert.match(body, /Excluded: \/admin, \/api\/, \/cv-pdf, \/embed\/, \/feedback\/, \/editor, \/login, \/my-cvs, \/account/);
  assert.match(body, /AI-Training: No, except/);
  assert.match(body, /Last updated: \d{4}-\d{2}-\d{2}/);
});
