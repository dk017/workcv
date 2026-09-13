import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";

test("trend radar gives specific employment signals precedence and deduplicates queries", () => {
  const directory = mkdtempSync(join(tmpdir(), "workcv-trend-radar-"));
  const input = join(directory, "trends.csv");
  const output = join(directory, "review.md");
  writeFileSync(
    input,
    [
      "query,search interest,increase percent",
      "dutch style employment support uk,0,Breakout",
      "argos pay,0,900%",
      "Argos  Pay,1,100%",
      "job interview,5,50%",
    ].join("\n"),
    "utf8",
  );

  try {
    execFileSync(
      process.execPath,
      [
        "scripts/prepare-trend-radar.mjs",
        `--input=${input}`,
        "--as-of=2026-09-13",
        `--output=${output}`,
      ],
      { cwd: process.cwd(), encoding: "utf8" },
    );
    const report = readFileSync(output, "utf8");
    const dutchLine = report.split("\n").find((line) => line.includes("dutch style"));
    const argosRows = report.match(/\| argos pay \|/g) || [];
    assert.match(dutchLine || "", /employment-changes/);
    assert.equal(argosRows.length, 1);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
