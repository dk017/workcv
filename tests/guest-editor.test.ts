import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { sanitizeFunnelEvent } from "../lib/funnel-events.ts";

const base = {
  eventId: "event_1234567890123456",
  visitorId: "visitor_12345678901234",
  sessionId: "session_12345678901234",
  path: "/editor",
  deviceClass: "desktop",
};

test("guest milestones are recorded from the editor, with only a placement", () => {
  const started = sanitizeFunnelEvent({ ...base, eventName: "guest_editor_started", metadata: { placement: "sample", cv_text: "must not survive" } });
  assert.ok(started);
  assert.equal(started.path, "/editor");
  assert.deepEqual(started.metadata, { placement: "sample" });
  const saved = sanitizeFunnelEvent({ ...base, eventName: "guest_cv_saved", metadata: { placement: "download" } });
  assert.ok(saved);
  assert.deepEqual(saved.metadata, { placement: "download" });
});

test("the editor needs an account only to reopen a saved CV, after payment, or from a tool", () => {
  const page = readFileSync(new URL("../app/editor/page.tsx", import.meta.url), "utf8");
  assert.match(page, /const needsAccount = Boolean\(searchParams\.draftId \|\| searchParams\.payment \|\| searchParams\.from\);/);
  assert.match(page, /<CvEditor guest=\{!user\} \/>/);
});

test("public start buttons open the editor directly, not the sign-in page", () => {
  for (const file of ["../app/page.tsx", "../app/pricing/page.tsx", "../components/pass-offer.tsx", "../components/search-plan-choice.tsx", "../components/job-application-tracker.tsx"]) {
    const source = readFileSync(new URL(file, import.meta.url), "utf8");
    assert.doesNotMatch(source, /buildLoginHref\("\/editor/, file);
  }
});
