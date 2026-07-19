import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const key = "1dda8b6b20af491cb1fdb736c823bc44";
const keyFile = readFileSync(`public/${key}.txt`, "utf8").trim();
const submitter = readFileSync("scripts/submit-indexnow.mjs", "utf8");

test("IndexNow ownership key is hosted at the public root", () => {
  assert.equal(keyFile, key);
});

test("IndexNow submission uses the WorkCV host, key location and sitemap", () => {
  assert.match(submitter, /https:\/\/workcv\.co\.uk/);
  assert.match(submitter, /\/sitemap\.xml/);
  assert.match(submitter, /keyLocation/);
  assert.match(submitter, /api\.indexnow\.org\/indexnow/);
});
