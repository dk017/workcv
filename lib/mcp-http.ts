import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { authenticateMcp, type McpConfig } from "./mcp-auth.ts";
import { createWorkcvMcpServer, type AgentCvStore } from "./mcp-server.ts";

const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
// Single-account pilot, process-local limit. Distributed limits are a launch requirement.
export function createMcpHandler(store: AgentCvStore, getConfig: () => McpConfig) {
  let windowStart = 0;
  let calls = 0;
  return async (request: Request) => {
    const config = getConfig();
    if (config.enabled !== "true") return new Response(null, { status: 404, headers });
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) return new Response(null, { status: 403, headers });
    const userId = authenticateMcp(request.headers.get("authorization"), config);
    if (!userId) return new Response(null, { status: 401, headers: { ...headers, "WWW-Authenticate": "Bearer" } });
    if (request.method !== "POST") return new Response(null, { status: 405, headers: { ...headers, Allow: "POST" } });
    if (!request.headers.get("content-type")?.startsWith("application/json")) return new Response(null, { status: 415, headers });
    const now = Date.now();
    if (now - windowStart >= 60_000) { windowStart = now; calls = 0; }
    if (++calls > 60) return new Response(null, { status: 429, headers: { ...headers, "Retry-After": "60" } });
    const reader = request.body?.getReader();
    if (!reader) return new Response(null, { status: 400, headers });
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        size += chunk.value.byteLength;
        if (size > 128 * 1024) { await reader.cancel(); return new Response(null, { status: 413, headers }); }
        chunks.push(chunk.value);
      }
      const parsedBody = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      const server = createWorkcvMcpServer(userId, store);
      const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
      try {
        await server.connect(transport);
        const response = await transport.handleRequest(request, { parsedBody });
        // Drain JSON before closing this per-request, stateless transport.
        const body = await response.arrayBuffer();
        const responseHeaders = new Headers(response.headers);
        Object.entries(headers).forEach(([key, value]) => responseHeaders.set(key, value));
        return new Response(body.byteLength ? body : null, { status: response.status, headers: responseHeaders });
      } finally { await server.close(); }
    } catch {
      return new Response(null, { status: 400, headers });
    }
  };
}
