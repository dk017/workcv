import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { workcvVsBrands } from "../lib/workcv-vs.ts";
import { costOverDays } from "../lib/competitor-plans.ts";

test("each WorkCV vs page replaces a cancellation guide with a permanent redirect", () => {
  const config = readFileSync("next.config.js", "utf8");
  const routes = readFileSync("lib/md/public-routes.ts", "utf8");
  for (const page of workcvVsBrands) {
    assert.ok(existsSync(`app${page.path}/page.tsx`), page.path);
    assert.ok(!existsSync(`app${page.replaces}`), `${page.replaces} should be removed`);
    assert.ok(config.includes(`{ source: "${page.replaces}", destination: "${page.path}", permanent: true }`), page.replaces);
    assert.equal(routes.split(`path: "${page.path}"`).length - 1, 1, page.path);
    assert.ok(!routes.includes(`path: "${page.replaces}"`), page.replaces);
  }
});

test("short WorkCV vs addresses redirect to a real page", () => {
  const config = readFileSync("next.config.js", "utf8");
  const shortcuts = [
    ...workcvVsBrands.map((page) => [page.path.replace(/-uk$/, ""), page.path]),
    ["/workcv-vs-canva", "/canva-cv-alternative-uk"],
    ["/workcv-vs-kickresume", "/kickresume-alternative-uk"],
  ];
  for (const [source, destination] of shortcuts) {
    assert.ok(config.includes(`{ source: "${source}", destination: "${destination}", permanent: true }`), source);
    assert.ok(existsSync(`app${destination}/page.tsx`), destination);
  }
});

test("WorkCV vs pages keep dated cancellation steps and sources", () => {
  for (const page of workcvVsBrands) {
    assert.ok(page.cancel.steps.length >= 4, page.brand);
    assert.match(page.cancel.checked, /^\d{1,2} [A-Z][a-z]+ 2026$/);
    assert.ok(page.cancel.sources.every(([, href]) => href.startsWith("https://")), page.brand);
    assert.ok(page.title.length <= 60, `${page.brand} title is ${page.title.length} characters`);
  }
});

test("90-day totals quoted in the short answers match the calculated cost", () => {
  for (const page of workcvVsBrands) {
    const trial = page.pricing.trial;
    if (!trial || trial.currency !== "GBP") continue;
    for (const quoted of Array.from(page.shortAnswer.join(" ").matchAll(/Left running for 90 days, it costs £(\d+\.\d\d)/g))) {
      assert.equal(Math.round(Number(quoted[1]) * 100), costOverDays(trial, 90), page.brand);
    }
  }
});
