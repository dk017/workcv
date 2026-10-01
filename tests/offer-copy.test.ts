import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";

// Every CV purchase includes a matching cover letter and Word export. Old copy
// that says otherwise misleads buyers and gets quoted by search and AI answers.
const outdated = [
  /No cover letters?\b/,
  /Not included (in this version|currently)/,
  /Not in this version/,
  /Does WorkCV include cover letters\?[^\n]*\n?[^\n]*Not currently/,
  /unlock the selected (saved )?CV PDF/,
  /saved-CV PDF unlock/,
];

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.(tsx?|mdx)$/.test(name) ? [full] : [];
  });
}

test("public copy does not understate what a CV purchase includes", () => {
  const offenders: string[] = [];
  for (const file of ["app", "components", "lib"].flatMap(sourceFiles)) {
    const text = readFileSync(file, "utf8");
    for (const pattern of outdated) {
      if (pattern.test(text)) offenders.push(`${file}: ${pattern}`);
    }
  }
  assert.deepEqual(offenders, []);
});
