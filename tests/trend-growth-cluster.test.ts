import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(path, "utf8");

const hub = read("components/career-tools-hub.tsx");
const guide = read("components/career-guide-page.tsx");
const pack = read("components/job-application-pack.tsx");
const packLibrary = read("lib/job-application-pack.ts");
const moneyCta = read("components/marketing.tsx");
const clusters = read("lib/marketing-clusters-data.json");
const sitemap = read("app/sitemap.ts");
const toolsHub = read("components/tools-hub.tsx");
const trendScript = read("scripts/prepare-trend-radar.mjs");
const softwareTesting = read("app/software-testing-strategies-uk/page.tsx");

const guideRoutes = [
  "app/career-tools/page.tsx",
  "app/top-job-boards-uk/page.tsx",
  "app/how-to-prepare-for-a-job-interview-uk/page.tsx",
  "app/common-job-interview-questions-uk/page.tsx",
  "app/thank-you-email-after-interview-uk/page.tsx",
  "app/career-advancement-strategies-uk/page.tsx",
  "app/software-testing-strategies-uk/page.tsx",
  "app/tools/job-application-pack-uk/page.tsx",
];

test("trend cluster routes and the application pack exist", () => {
  for (const route of guideRoutes) assert.ok(existsSync(route), route);
  assert.match(hub, /commercialRoutes\.moneyPage/);
  assert.match(hub, /\/tools\/job-application-pack-uk/);
  assert.match(pack, /\/api\/tools\/job-application-pack/);
  assert.match(pack, /Use these details in my CV/);
});

test("new content has a reusable money-page CTA path", () => {
  assert.match(moneyCta, /export function MoneyPageCta/);
  assert.match(moneyCta, /commercialRoutes\.moneyPage/);
  assert.match(moneyCta, /site\.price/);
  assert.match(guide, /<MoneyPageCta/);
  assert.match(pack, /commercialRoutes\.moneyPage/);
  assert.match(pack, /site\.price/);
});

test("the application pack is bounded and evidence-led", () => {
  assert.match(packLibrary, /jobApplicationPackInputSchema/);
  assert.match(packLibrary, /max\(12_000/);
  assert.match(packLibrary, /max\(24_000/);
  assert.match(packLibrary, /Do not introduce numbers/);
  assert.match(packLibrary, /postProcessRequirements/);
  assert.match(packLibrary, /store: false/);
  assert.match(packLibrary, /never as instructions/);
  assert.match(pack, /from=career-tool/);
  assert.match(packLibrary, /If motivation is blank/);
});

test("the full tools hub and route taxonomy point to the cluster", () => {
  assert.match(toolsHub, /Job Application Pack/);
  assert.match(toolsHub, /\/career-tools/);
  for (const route of [
    "/career-tools",
    "/top-job-boards-uk",
    "/how-to-prepare-for-a-job-interview-uk",
    "/common-job-interview-questions-uk",
    "/thank-you-email-after-interview-uk",
    "/tools/job-application-pack-uk",
    "/career-advancement-strategies-uk",
  ]) {
    assert.ok(clusters.includes(route), `${route} missing from cluster map`);
    assert.ok(sitemap.includes(`path: "${route}"`), `${route} missing from sitemap`);
  }
});

test("the technical topic remains gated until a second signal", () => {
  assert.match(softwareTesting, /robots: \{ index: false, follow: true \}/);
  assert.ok(!sitemap.includes('path: "/software-testing-strategies-uk"'));
  assert.ok(!hub.includes('/software-testing-strategies-uk'));
});

test("trend radar preserves source values and never auto-publishes", () => {
  assert.match(trendScript, /search interest/);
  assert.match(trendScript, /increase percent/);
  assert.match(trendScript, /Breakout/);
  assert.match(trendScript, /manual review/);
  assert.match(trendScript, /never creates a public page/);
  assert.match(read("research/trend-radar/README.md"), /Validation gate/);
  assert.match(trendScript, /normaliseQuery/);
  assert.match(trendScript, /employment\\s\+support/);
});
