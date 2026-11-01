import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const folder = new URL("../chrome-extension/workcv-uk-visa-sponsor-checker/", import.meta.url);
const read = (file: string) => readFileSync(new URL(file, folder), "utf8");

type Employers = {
  cleanName: (value: string) => string;
  isLikelyAgency: (name: string) => boolean;
  cacheKey: (name: string) => string;
  batchUrl: () => string;
  checkerUrl: (name: string) => string;
  guideUrl: () => string;
};

function loadEmployers() {
  const context: Record<string, unknown> = { encodeURIComponent };
  context.globalThis = context;
  vm.runInNewContext(read("employers.js"), context);
  return context.WorkCVSponsorEmployers as Employers;
}

test("employer names are read from the first line of the job board's text", () => {
  const { cleanName } = loadEmployers();
  assert.equal(cleanName("  Lloyds   Banking Group \n Hybrid work in London"), "Lloyds Banking Group");
  assert.equal(cleanName("Citi ·"), "Citi");
  assert.equal(cleanName("x".repeat(300)).length, 160);
});

test("recruitment agencies are flagged, employers with similar words are not", () => {
  const { isLikelyAgency } = loadEmployers();
  for (const agency of ["VIQU IT Recruitment", "Understanding Recruitment", "Michael Page Technology", "Hays", "Robert Half", "ITOL Recruit", "Acme Resourcing Ltd", "Healthcare Staffing Partners"]) {
    assert.equal(isLikelyAgency(agency), true, agency);
  }
  for (const employer of ["Hays Travel", "Reed Smith LLP", "Lloyds Banking Group", "Deloitte", "CMC Markets", "Nandos", "bp"]) {
    assert.equal(isLikelyAgency(employer), false, employer);
  }
});

test("cache keys ignore case, accents, punctuation and spacing", () => {
  const { cacheKey } = loadEmployers();
  assert.equal(cacheKey("Crème & Co. Ltd"), cacheKey("creme and co ltd"));
  assert.notEqual(cacheKey("Acme"), cacheKey("Acme Services"));
});

test("links go to WorkCV and carry only the employer name", () => {
  const employers = loadEmployers();
  assert.equal(employers.batchUrl(), "https://workcv.co.uk/api/tools/sponsor-check/batch");
  const checker = new URL(employers.checkerUrl("Deloitte LLP\nLondon"));
  assert.equal(checker.origin + checker.pathname, "https://workcv.co.uk/tools/uk-visa-sponsor-checker");
  assert.equal(checker.searchParams.get("q"), "Deloitte LLP");
  assert.equal(checker.searchParams.get("utm_campaign"), "sponsor_extension");
  assert.equal(new URL(employers.guideUrl()).pathname, "/right-to-work-cv-uk");
});

test("the manifest asks only for what the badges need", () => {
  const manifest = JSON.parse(read("manifest.json"));
  assert.deepEqual(manifest.permissions, ["storage", "activeTab", "scripting"]);
  assert.deepEqual(manifest.host_permissions, ["https://workcv.co.uk/*"]);
  const matches: string[] = manifest.content_scripts.flatMap((script: { matches: string[] }) => script.matches);
  assert.ok(matches.every((pattern) => /^https:\/\/(www|uk)\.[a-z.-]+\/\*?(jobs\/\*)?/.test(pattern) && !pattern.includes("<all_urls>")), matches.join(", "));
  assert.match(manifest.name, /^UK Visa Sponsor Checker/);
  assert.ok(manifest.description.length <= 132);
  for (const file of ["background.js", "content.js", "employers.js", "sites.js", "popup.html", "popup.js", "popup.css", "icons/icon-128.png"]) {
    assert.ok(readFileSync(new URL(file, folder)).length > 0, file);
  }
});

test("the store listing describes features without keyword lists or other sites' names", () => {
  const listing = read("STORE-LISTING.md");
  const description = listing.split("## Detailed description")[1].split("\n## ")[0];
  assert.doesNotMatch(description, /linkedin|indeed|reed|totaljobs|cv-library|glassdoor/i);
  assert.match(description, /only the employer names/i);
});

test("the batch endpoint, support page and privacy page exist", () => {
  const root = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
  assert.match(root("app/api/tools/sponsor-check/batch/route.ts"), /searchSponsors\(register, query, 3\)/);
  assert.match(root("lib/md/public-routes.ts"), /path: "\/chrome\/uk-visa-sponsor-checker"/);
  assert.match(root("app/chrome/uk-visa-sponsor-checker/privacy/page.tsx"), /employer names/);
  assert.match(root("app/chrome/uk-visa-sponsor-checker/page.tsx"), /not immigration advice/);
});
