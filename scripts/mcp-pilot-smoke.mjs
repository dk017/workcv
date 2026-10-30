import assert from "node:assert/strict";
import { createServer } from "node:http";
import { Readable } from "node:stream";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { createMcpHandler } from "../lib/mcp-http.ts";

// Real HTTP + official MCP client, synthetic in-memory store, no database or model API.
const docs = new Map();
let revision = 0;
const store = {
  async get(user, id) { return docs.get(`${user}:${id}`) || null; },
  async create(user, id, data) {
    const key = `${user}:${id}`;
    if (!docs.has(key)) docs.set(key, { id, data, updatedAt: new Date(++revision).toISOString() });
    return docs.get(key);
  },
  async update(user, id, data, expected) {
    const key = `${user}:${id}`;
    if (docs.get(key)?.updatedAt !== expected) throw new Error("CV changed or unavailable");
    const doc = { id, data, updatedAt: new Date(++revision).toISOString() };
    docs.set(key, doc); return doc;
  },
};
const token = randomBytes(32).toString("base64url");
const config = {
  enabled: "true", userId: "synthetic-smoke-user",
  tokenHash: createHash("sha256").update(token).digest("hex"),
  expiresAt: new Date(Date.now() + 60_000).toISOString(),
};
const handler = createMcpHandler(store, () => config);
let base;
const http = createServer(async (incoming, outgoing) => {
  try {
    if (incoming.url !== "/mcp") { outgoing.writeHead(404).end(); return; }
    const body = incoming.method === "POST" ? Readable.toWeb(incoming) : undefined;
    const response = await handler(new Request(`${base}/mcp`, {
      method: incoming.method, headers: incoming.headers, body, duplex: "half",
    }));
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch { outgoing.writeHead(500).end(); }
});
http.requestTimeout = 15_000;
const client = new Client({ name: "workcv-smoke", version: "0.1.0" });
try {
  await new Promise((resolve, reject) => { http.once("error", reject); http.listen(0, "127.0.0.1", resolve); });
  base = `http://127.0.0.1:${http.address().port}`;
  await client.connect(new StreamableHTTPClientTransport(new URL(`${base}/mcp`), {
    requestInit: { headers: { Authorization: `Bearer ${token}` } },
  }));
  const { tools } = await client.listTools();
  assert.equal(tools.length, 5);
  const requestId = randomUUID();
  const created = await client.callTool({ name: "create_cv", arguments: { requestId, template: "modern" } });
  assert.ok(!created.isError);
  const doc = created.structuredContent.result.document;
  const updated = await client.callTool({ name: "update_cv", arguments: {
    documentId: doc.id, expectedUpdatedAt: doc.updatedAt,
    data: { ...doc.data, fullName: "Synthetic Test", targetRole: "Office assistant" },
  } });
  assert.ok(!updated.isError);
  const retry = await client.callTool({ name: "create_cv", arguments: { requestId, template: "modern" } });
  assert.equal(retry.structuredContent.result.document.data.fullName, "Synthetic Test");
  assert.equal(docs.size, 1);
  const review = await client.callTool({ name: "review_cv", arguments: { documentId: doc.id } });
  assert.equal(review.structuredContent.result.previewType, "text");
  assert.ok(review.structuredContent.result.readiness);
  const schema = await client.readResource({ uri: "workcv://cv-input-schema" });
  assert.equal(JSON.parse(schema.contents[0].text).type, "object");
  assert.equal((await fetch(`${base}/mcp`, { method: "POST", body: "{}" })).status, 401);
  console.log("MCP HTTP smoke passed: initialize, tools, create/update/retry, review, schema and authentication. Synthetic data only; no charges.");
} finally {
  await client.close();
  http.closeAllConnections();
  await new Promise((resolve) => http.close(resolve));
}
