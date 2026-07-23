import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const cvDocumentsSource = readFileSync("lib/cv-documents.ts", "utf8");

test("CV version checks use the millisecond precision preserved by JavaScript dates", () => {
  assert.match(
    cvDocumentsSource,
    /date_trunc\('milliseconds', updated_at\)\s*=\s*date_trunc\('milliseconds', \$6::timestamptz\)/,
  );
  assert.doesNotMatch(
    cvDocumentsSource,
    /updated_at\s*=\s*\$6::timestamptz/,
  );
});

test("each successful save advances the version by at least one millisecond", () => {
  assert.match(
    cvDocumentsSource,
    /date_trunc\('milliseconds', updated_at\)\s*\+\s*INTERVAL '1 millisecond'/,
  );
});
