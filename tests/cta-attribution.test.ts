import assert from "node:assert/strict";
import test from "node:test";

import {
  readRecentCtaPlacement,
  rememberCtaHandoff,
} from "../lib/cta-attribution.ts";

function installWindow() {
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      sessionStorage: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
        removeItem: (key: string) => values.delete(key),
      },
    },
  });
}

test("CTA attribution survives one editor-to-login handoff and is consumed once", () => {
  installWindow();
  rememberCtaHandoff("pricing_hero_editor", "/editor?new=1", 1_000);
  assert.equal(readRecentCtaPlacement("/editor", 2_000), "pricing_hero_editor");
  assert.equal(readRecentCtaPlacement("/editor", 2_001), undefined);
  Reflect.deleteProperty(globalThis, "window");
});

test("unsafe, stale and unrelated handoffs are not returned", () => {
  installWindow();
  rememberCtaHandoff("pricing_hero_editor", "https://evil.example", 1_000);
  assert.equal(readRecentCtaPlacement("/editor", 1_100), undefined);
  rememberCtaHandoff("pricing_hero_editor", "/editor", 1_000);
  assert.equal(readRecentCtaPlacement("/login", 1_100), undefined);
  rememberCtaHandoff("pricing_hero_editor", "/editor", 1_000);
  assert.equal(readRecentCtaPlacement("/editor", 2_000_001), undefined);
  Reflect.deleteProperty(globalThis, "window");
});
