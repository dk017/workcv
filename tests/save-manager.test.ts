import assert from "node:assert/strict";
import test from "node:test";

import { DebouncedSaveManager } from "../lib/save-manager.ts";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

test("a stale response cannot mark newer edits as saved", async () => {
  const first = deferred<{ updatedAt: string }>();
  const saves: number[] = [];
  const manager = new DebouncedSaveManager(
    0,
    "2026-01-01T00:00:00.000Z",
    async (value) => {
      saves.push(value);
      if (value === 1) return first.promise;
      return { updatedAt: "2026-01-01T00:00:02.000Z" };
    },
    60_000,
  );

  manager.setValue(1);
  const firstFlush = manager.flush();
  manager.setValue(2);
  first.resolve({ updatedAt: "2026-01-01T00:00:01.000Z" });
  await firstFlush;

  assert.equal(manager.snapshot().status, "unsaved");
  assert.equal(manager.hasUnsavedChanges(), true);
  await manager.flush();
  assert.equal(manager.snapshot().status, "saved");
  assert.deepEqual(saves, [1, 2]);
  manager.dispose();
});

test("failed saves remain unsaved and retry succeeds", async () => {
  let attempts = 0;
  const manager = new DebouncedSaveManager(
    "initial",
    "2026-01-01T00:00:00.000Z",
    async () => {
      attempts += 1;
      if (attempts === 1) throw new Error("Network unavailable");
      return { updatedAt: "2026-01-01T00:00:01.000Z" };
    },
    60_000,
  );

  manager.setValue("latest");
  assert.equal(await manager.flush(), false);
  assert.equal(manager.snapshot().status, "error");
  assert.equal(manager.hasUnsavedChanges(), true);
  assert.equal(await manager.retry(), true);
  assert.equal(manager.snapshot().status, "saved");
  manager.dispose();
});
