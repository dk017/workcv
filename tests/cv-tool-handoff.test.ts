import assert from "node:assert/strict";
import test, { after, afterEach } from "node:test";

import {
  cvToolHandoffKey,
  readCvToolHandoff,
  removeCvToolHandoff,
  writeCvToolHandoff,
} from "../lib/cv-tool-handoff.ts";

function makeStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
}

const hadWindow = Object.prototype.hasOwnProperty.call(globalThis, "window");
const originalWindow = globalThis.window;
const storage = makeStorage();

Object.defineProperty(globalThis, "window", {
  configurable: true,
  value: { sessionStorage: storage },
});

afterEach(() => {
  storage.removeItem(cvToolHandoffKey);
});

after(() => {
  if (hadWindow) {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: originalWindow,
    });
  } else {
    Reflect.deleteProperty(globalThis, "window");
  }
});

test("CV tool handoff survives one editor navigation and can be removed", () => {
  writeCvToolHandoff({
    source: "job-application-pack",
    patch: { fullName: "Amira Khan", targetRole: "Service Lead" },
  });

  assert.equal(readCvToolHandoff()?.source, "job-application-pack");
  removeCvToolHandoff();
  assert.equal(readCvToolHandoff(), null);
});

test("expired and malformed handoffs are discarded before import", () => {
  storage.setItem(
    cvToolHandoffKey,
    JSON.stringify({
      version: 1,
      createdAt: Date.now() - 31 * 60 * 1_000,
      source: "job-application-pack",
    }),
  );
  assert.equal(readCvToolHandoff(), null);
  assert.equal(storage.getItem(cvToolHandoffKey), null);

  storage.setItem(cvToolHandoffKey, "not-json");
  assert.equal(readCvToolHandoff(), null);
  assert.equal(storage.getItem(cvToolHandoffKey), null);
});
