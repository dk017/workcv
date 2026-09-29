import assert from "node:assert/strict";
import test from "node:test";

import { evidenceRows, guidanceQuotes, recruiterQuotes } from "../lib/cv-evidence.ts";

test("guidance quotes are short, attributed and linked to their source", () => {
  assert.ok(guidanceQuotes.length > 0);
  for (const item of guidanceQuotes) {
    assert.ok(item.quote.split(/\s+/).length <= 20, `quote too long: ${item.quote}`);
    assert.ok(item.source.trim().length > 0);
    assert.match(item.href, /^https:\/\//);
  }
  // The skim-time claim in the contrast section links to the first quote.
  assert.match(guidanceQuotes[0].quote, /7\.4 seconds/);
});

test("recruiter quotes are only shown with a named person and written permission", () => {
  for (const item of recruiterQuotes) {
    assert.ok(item.name.trim() && item.role.trim() && item.company.trim(), "quote needs name, role and company");
    assert.match(item.permissionDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(!Number.isNaN(Date.parse(item.permissionDate)));
  }
});

test("evidence rows contrast a generic line with a specific one", () => {
  const roles = evidenceRows.map((row) => row.role);
  assert.equal(new Set(roles).size, roles.length);
  for (const row of evidenceRows) {
    assert.ok(row.specific.length > row.safe.length * 2, `specific line should carry detail: ${row.role}`);
  }
});
