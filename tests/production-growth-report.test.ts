import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import test from "node:test";
import { encryptSnapshot, collectSnapshot } from "../scripts/production-growth-snapshot.mjs";
import { decryptSnapshot, readEncryptedChunks, renderDashboard, cohortRate } from "../scripts/production-growth-dashboard.mjs";

const keys = generateKeyPairSync("rsa", { modulusLength: 3072,
  publicKeyEncoding: { type: "spki", format: "pem" }, privateKeyEncoding: { type: "pkcs8", format: "pem" } });
const publicKey = Buffer.from(keys.publicKey).toString("base64");
const fixture = { version: 1, request_id: "example", revenue: 123456, note: "private baseline" };

test("production report survives encrypted transport without exposing plaintext and rejects a different request", () => {
  const encrypted = encryptSnapshot(fixture, publicKey);
  const decodedEnvelope = Buffer.from(encrypted, "base64").toString("utf8");
  assert.ok(!decodedEnvelope.includes("private baseline"));
  const chunks = encrypted.match(/.{1,3000}/g)!;
  const logs = chunks.map((chunk, i) => `timestamp WORKCV_GROWTH_CHUNK:${i + 1}/${chunks.length}:${chunk}`).join("\n");
  assert.deepEqual(decryptSnapshot(readEncryptedChunks(logs), keys.privateKey, "example"), fixture);
  assert.throws(() => decryptSnapshot(encrypted, keys.privateKey, "other"), /does not match/);
  assert.notEqual(encryptSnapshot(fixture, publicKey), encrypted);
});

test("tampered or incomplete transport fails closed", () => {
  const envelope = JSON.parse(Buffer.from(encryptSnapshot(fixture, publicKey), "base64").toString("utf8"));
  const data = Buffer.from(envelope.data, "base64");
  data[0] ^= 1;
  envelope.data = data.toString("base64");
  assert.throws(() => decryptSnapshot(Buffer.from(JSON.stringify(envelope)).toString("base64"), keys.privateKey, "example"));
  assert.throws(() => readEncryptedChunks("WORKCV_GROWTH_CHUNK:1/2:YWJj"), /incomplete/);
  assert.throws(() => readEncryptedChunks("WORKCV_GROWTH_CHUNK:2/2:YWJj\nWORKCV_GROWTH_CHUNK:1/2:YWJj"), /incomplete/);
  assert.throws(() => readEncryptedChunks("WORKCV_GROWTH_CHUNK:1/1:YWJj\nWORKCV_GROWTH_CHUNK:1/1:YWJj"), /incomplete/);
});

test("weak recipient keys are refused before querying production", () => {
  const weak = generateKeyPairSync("rsa", { modulusLength: 2048, publicKeyEncoding: { type: "spki", format: "pem" }, privateKeyEncoding: { type: "pkcs8", format: "pem" } });
  assert.throws(() => encryptSnapshot(fixture, Buffer.from(weak.publicKey).toString("base64")), /3072/);
});

test("dashboard treats a zero-visitor window as unknown and escapes stored content", () => {
  const report = { generated_at: "2026-09-25", coverage: { latest_public_event: "<img src=x onerror=alert(1)>" },
    notes: ["<script>alert(1)</script>"], windows: [{ days: 7, start: "2026-09-18", end: "2026-09-25",
      activity: { paid_orders: 2 }, cohort: [], revenue: [{ currency: "GBP", gross_minor_units: "1598" }], sales: [], tools: [], quality: {} }] };
  const html = renderDashboard(report);
  assert.equal(cohortRate(0, 0), "Not measurable");
  assert.equal(cohortRate(2, 100), "2.0%");
  assert.ok(html.includes("Not measurable"));
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(!html.includes("<script>"));
  assert.ok(!html.includes("<img src="));
  assert.ok(html.includes("different populations"));
  assert.equal((html.match(/<section>/g) || []).length, (html.match(/<\/section>/g) || []).length);
});

test("a failed production query rolls back the read-only transaction without returning partial numbers", async () => {
  const statements: string[] = [];
  const client = { query: async (sql: string) => {
    statements.push(sql);
    if (sql === "SELECT NOW() AS at") throw new Error("database unavailable");
    return { rows: [] };
  } };
  await assert.rejects(collectSnapshot(client, { NODE_ENV: "test" }), /database unavailable/);
  assert.equal(statements[0], "BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");
  assert.ok(statements.includes("SET LOCAL statement_timeout = '20s'"));
  assert.equal(statements.at(-1), "ROLLBACK");
});
