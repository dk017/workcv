import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

// Pages that rank or sell should link to the closest tool, guide or the no-subscription page.
const required: Array<[string, string]> = [
  ["app/cv-personal-statement-uk/page.tsx", "/tools/cv-summary-generator-uk"],
  ["app/tools/cv-summary-generator-uk/page.tsx", "/cv-personal-statement-uk"],
  ["app/convert-resume-to-uk-cv/page.tsx", "/tools/uk-cv-converter"],
  ["app/uk-cv-format/page.tsx", "/tools/uk-cv-converter"],
  ["app/tools/uk-living-wage-checker/page.tsx", "/tools/uk-salary-by-job-title"],
  ["app/tools/uk-living-wage-checker/page.tsx", "/cv-builder-no-subscription-uk"],
  ["app/tools/uk-salary-by-job-title/page.tsx", "/tools/uk-living-wage-checker"],
  ["app/tools/take-home-pay-calculator-uk/page.tsx", "/tools/uk-living-wage-checker"],
  ["app/tools/job-application-tracker-uk/page.tsx", "/cv-builder-no-subscription-uk"],
  ["app/cv-builder-no-subscription-uk/page.tsx", "/cv-builder-scams-uk"],
  ["app/cv-builder-no-subscription-uk/page.tsx", "/best-cv-builder-uk"],
  ["app/best-cv-builder-uk/page.tsx", "/cv-builder-no-subscription-uk"],
  ["app/cv-builder-scams-uk/page.tsx", "/cv-builder-no-subscription-uk"],
  ["app/tools/notice-period-calculator/page.tsx", "/tools/resignation-letter-generator-uk"],
  ["app/tools/resignation-letter-generator-uk/page.tsx", "/tools/notice-period-calculator"],
];

test("high-traffic and buyer pages keep their key internal links", () => {
  for (const [file, href] of required) {
    assert.ok(readFileSync(file, "utf8").includes(`"${href}"`), `${file} should link to ${href}`);
  }
});
