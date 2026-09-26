import test from "node:test";
import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { authenticateMcp } from "../lib/mcp-auth.ts";
import { createMcpHandler } from "../lib/mcp-http.ts";
import type { AgentCvStore, AgentDocument } from "../lib/mcp-server.ts";

const token = "a".repeat(43);
const config = { enabled: "true", tokenHash: createHash("sha256").update(token).digest("hex"), userId: "pilot-a", expiresAt: "2099-01-01T00:00:00Z" };
test("pilot credentials fail closed and expire", () => {
  assert.equal(authenticateMcp("Bearer " + token, config), "pilot-a");
  for (const settings of [{ ...config, enabled: "false" }, { ...config, tokenHash: "bad" }, { ...config, expiresAt: "2020-01-01" }, { ...config, userId: undefined }]) {
    assert.equal(authenticateMcp("Bearer " + token, settings), null);
  }
  assert.equal(authenticateMcp("Bearer " + "b".repeat(43), config), null);
  assert.equal(authenticateMcp(null, config), null);
});

test("MCP protocol protects ownership and update versions", async () => {
  const docs = new Map<string, AgentDocument>();
  let version = 0;
  const store: AgentCvStore = {
    async get(userId, id) { return docs.get(userId + ":" + id) || null; },
    async create(userId, id, data) {
      const key = userId + ":" + id;
      const existing = docs.get(key);
      if (existing) return existing;
      const doc = { id, data, updatedAt: new Date(++version).toISOString() };
      docs.set(key, doc); return doc;
    },
    async update(userId, id, data, expected) {
      const key = userId + ":" + id;
      const doc = docs.get(key);
      if (!doc || doc.updatedAt !== expected) throw new Error("conflict");
      const updated = { id, data, updatedAt: new Date(++version).toISOString() };
      docs.set(key, updated); return updated;
    },
  };
  const handler = createMcpHandler(store, () => config);
  const request = (body: unknown, authorization = "Bearer " + token, extra = {}) => new Request("http://localhost:3100/mcp", {
    method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream", Authorization: authorization, ...extra }, body: JSON.stringify(body),
  });
  async function rpc(method: string, params: unknown = {}, target = handler) {
    const response = await target(request({ jsonrpc: "2.0", id: 1, method, params }));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    return (await response.json()).result;
  }
  const call = (name: string, args: unknown) => rpc("tools/call", { name, arguments: args });
  const init = await rpc("initialize", { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "workcv-test", version: "1.0" } });
  assert.equal(init.serverInfo.name, "workcv-pilot");
  const listed = await rpc("tools/list");
  assert.equal(listed.tools.length, 5);
  assert.equal((await call("list_cv_templates", {})).structuredContent.result.templates.length, 3);
  const args = { requestId: randomUUID(), template: "classic" };
  const created = await call("create_cv", args);
  assert.ok(!created.isError, JSON.stringify(created));
  const doc = created.structuredContent.result.document;
  assert.equal((await call("create_cv", args)).structuredContent.result.document.id, doc.id);
  assert.equal(docs.size, 1);
  const parallel = await Promise.all([call("create_cv", args), call("create_cv", args)]);
  assert.equal(parallel[0].structuredContent.result.document.id, parallel[1].structuredContent.result.document.id);
  assert.equal(docs.size, 1);
  const updated = await call("update_cv", { documentId: doc.id, expectedUpdatedAt: doc.updatedAt, data: { ...doc.data, fullName: "Test Person", template: "compact" } });
  assert.ok(!updated.isError, JSON.stringify(updated));
  assert.equal(updated.structuredContent.result.document.data.template, "compact");
  assert.equal((await call("update_cv", { documentId: doc.id, expectedUpdatedAt: doc.updatedAt, data: doc.data })).isError, true);
  const latest = updated.structuredContent.result.document;
  for (const data of [
    { ...latest.data, fullName: "x".repeat(161) },
    { ...latest.data, template: "unsupported" },
    { ...latest.data, unexpectedField: "not part of a CV" },
  ]) {
    assert.equal((await call("update_cv", { documentId: doc.id, expectedUpdatedAt: latest.updatedAt, data })).isError, true);
  }
  const other = createMcpHandler(store, () => ({ ...config, userId: "pilot-b" }));
  assert.equal((await rpc("tools/call", { name: "get_cv", arguments: { documentId: doc.id } }, other)).isError, true);
  assert.equal((await rpc("tools/call", { name: "update_cv", arguments: { documentId: doc.id, expectedUpdatedAt: latest.updatedAt, data: doc.data } }, other)).isError, true);
  const resources = await rpc("resources/read", { uri: "workcv://cv-input-schema" });
  assert.equal(JSON.parse(resources.contents[0].text).type, "object");
  assert.equal((await call("review_cv", { documentId: doc.id })).structuredContent.result.previewType, "text");
  assert.equal((await handler(request({}, "Bearer wrong"))).status, 401);
  assert.equal((await handler(request({}, undefined, { Origin: "https://evil.example" }))).status, 403);
  assert.equal((await handler(request({ text: "x".repeat(129 * 1024) }))).status, 413);
  assert.equal((await createMcpHandler(store, () => ({ enabled: "false" }))(request({}))).status, 404);
});


test("HTTP boundary rejects malformed requests and throttles the pilot", async () => {
  let storeCalls = 0;
  const store: AgentCvStore = {
    async get() { storeCalls++; return null; },
    async create() { storeCalls++; throw new Error("unexpected write"); },
    async update() { storeCalls++; return null; },
  };
  const handler = createMcpHandler(store, () => config);
  const headers = { Authorization: "Bearer " + token, Accept: "application/json, text/event-stream", "Content-Type": "application/json" };
  assert.equal((await handler(new Request("http://localhost/mcp", { method: "GET", headers }))).status, 405);
  assert.equal((await handler(new Request("http://localhost/mcp", { method: "POST", headers: { ...headers, "Content-Type": "text/plain" }, body: "{}" }))).status, 415);
  assert.equal((await handler(new Request("http://localhost/mcp", { method: "POST", headers, body: "broken json" }))).status, 400);
  for (let i = 0; i < 59; i++) {
    const response = await handler(new Request("http://localhost/mcp", {
      method: "POST", headers, body: JSON.stringify({ jsonrpc: "2.0", id: i, method: "tools/list" }),
    }));
    assert.equal(response.status, 200);
  }
  const limited = await handler(new Request("http://localhost/mcp", { method: "POST", headers, body: "{}" }));
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("retry-after"), "60");
  assert.equal(storeCalls, 0);
});
