import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const dockerfile = readFileSync(
  new URL("../Dockerfile", import.meta.url),
  "utf8",
);
const rendererSource = readFileSync(
  new URL("../lib/pdf-renderer.ts", import.meta.url),
  "utf8",
);

test("the production Chromium user has a writable home directory", () => {
  assert.match(dockerfile, /ENV HOME=\/home\/nextjs/);
  assert.match(dockerfile, /useradd[^\n]*--create-home[^\n]*nextjs/);
  assert.match(rendererSource, /executablePath:\s*process\.env\.CHROMIUM_PATH/);
});

test("Chromium uses writable XDG paths and is smoke-tested during the image build", () => {
  assert.match(
    dockerfile,
    /ENV XDG_CONFIG_HOME=\/tmp\/workcv-chromium-config/,
  );
  assert.match(
    dockerfile,
    /ENV XDG_CACHE_HOME=\/tmp\/workcv-chromium-cache/,
  );
  assert.match(dockerfile, /RUN node scripts\/pdf-runtime-smoke\.mjs/);
});
