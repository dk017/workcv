import { ensureAuthTables, getPool } from "@/lib/db";
import { getCvDocument, updateCvDocument } from "@/lib/cv-documents";
import { createMcpHandler } from "@/lib/mcp-http";
import type { AgentCvStore } from "@/lib/mcp-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const store: AgentCvStore = {
  get: getCvDocument,
  update: updateCvDocument,
  async create(userId, id, data) {
    await ensureAuthTables();
    // Deterministic owner-scoped ID makes concurrent create retries safe across restarts.
    await getPool().query(
      `INSERT INTO workcv_cv_documents (id, user_id, title, data, template_id)
       VALUES ($1, $2, $3, $4::jsonb, $5) ON CONFLICT (id) DO NOTHING`,
      [id, userId, "My CV", JSON.stringify(data), data.template],
    );
    const doc = await getCvDocument(userId, id);
    if (!doc) throw new Error("Could not create CV.");
    return doc;
  },
};

const handler = createMcpHandler(store, () => ({
  enabled: process.env.WORKCV_MCP_PILOT_ENABLED,
  tokenHash: process.env.WORKCV_MCP_PILOT_TOKEN_SHA256,
  userId: process.env.WORKCV_MCP_PILOT_USER_ID,
  expiresAt: process.env.WORKCV_MCP_PILOT_EXPIRES_AT,
}));

export const POST = handler;
export const GET = handler;
export const DELETE = handler;
