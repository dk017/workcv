import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, existsSync } from "node:fs";
import { scoreCvFit } from "../lib/cv-fit-assessment.ts";
import { checkerExampleInput, checkerExampleClassification } from "../lib/content-checker-example.ts";
import { shorterCv, longerCv, exampleWordCount } from "../lib/content-cv-examples.ts";

test("worked checker evidence is grounded and does not turn missing software into a skill", () => {
  const result = scoreCvFit(checkerExampleInput, checkerExampleClassification);
  assert.equal(result.score, result.dimensions.reduce((sum, d) => sum + d.score, 0));
  for (const r of result.requirements.filter(r => r.status === "supported")) assert.ok(r.cvEvidence && checkerExampleInput.cvText.includes(r.cvEvidence));
  const sage = result.requirements.find(r => r.requirement.includes("Sage"));
  assert.equal(sage?.status, "not-evidenced");
  assert.equal(sage?.cvEvidence, null);
});
test("shortening example removes words while retaining employer chronology", () => {
  assert.ok(exampleWordCount(shorterCv) < exampleWordCount(longerCv));
  for (const fact of ["September 2022 - Present", "July 2019 - August 2022", "12-person", "North Lane College"]) assert.ok(shorterCv.includes(fact));
});
test("four articles have canonical ownership and their proof assets exist", () => {
  const sitemap = readFileSync("app/sitemap.ts", "utf8");
  for (const slug of ["chatgpt-cv-to-pdf-uk", "convert-resume-to-uk-cv", "shorten-cv-to-two-pages", "cv-word-or-pdf-uk"]) {
    const source = readFileSync(`app/${slug}/page.tsx`, "utf8");
    assert.ok(source.includes(`const path = "/${slug}"`));
    assert.equal(sitemap.split(`path: "/${slug}"`).length - 1, 1);
  }
  for (const asset of ["samples/chatgpt-cv-alex-morgan.pdf", "product-proof/chatgpt-cv-import.png", "product-proof/chatgpt-cv-editor.png", "product-proof/chatgpt-cv-pdf.png", "product-proof/blank-word-template.png"]) assert.ok(existsSync(`public/${asset}`), asset);
});
