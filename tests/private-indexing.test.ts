import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server.js";

import { buildLoginHref, safeInternalRedirect } from "../lib/safe-redirect.ts";
import { middleware } from "../middleware.ts";

test("builds one correctly encoded login return URL", () => {
  assert.equal(buildLoginHref("/editor"), "/login?next=%2Feditor");
  assert.equal(
    buildLoginHref("/editor?template=compact&new=1"),
    "/login?next=%2Feditor%3Ftemplate%3Dcompact%26new%3D1",
  );
  assert.equal(buildLoginHref("https://evil.example/"), "/login?next=%2Feditor");
  assert.equal(safeInternalRedirect("/%252fevil.example"), "/editor");
});

test("middleware adds response-level noindex to private routes only", () => {
  const loginResponse = middleware(
    new NextRequest("https://workcv.co.uk/login?next=%2Feditor"),
  );
  const loginRobots = loginResponse.headers.get("x-robots-tag") || "";
  assert.match(loginRobots, /noindex/);
  assert.match(loginRobots, /follow/);
  assert.doesNotMatch(loginRobots, /nofollow/);

  for (const path of ["/editor", "/my-cvs", "/cv-pdf/cv_123"]) {
    const response = middleware(new NextRequest(`https://workcv.co.uk${path}`));
    const robots = response.headers.get("x-robots-tag") || "";
    assert.match(robots, /noindex/);
    assert.match(robots, /nofollow/);
    assert.match(robots, /noarchive/);
  }
  const publicResponse = middleware(new NextRequest("https://workcv.co.uk/"));
  assert.equal(publicResponse.headers.get("x-robots-tag"), null);
});
