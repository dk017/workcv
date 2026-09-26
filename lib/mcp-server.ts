import { createHash } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createBlankCv, templates, type CvData, type TemplateId } from "./editor-data.ts";
import { parseCvData, cvDataSchema } from "./cv-schema.ts";
import { calculateCvReadiness } from "./cv-readiness.ts";

export type AgentDocument = { id: string; data: CvData; updatedAt: string };
export interface AgentCvStore {
  create(userId: string, id: string, data: CvData): Promise<AgentDocument>;
  get(userId: string, id: string): Promise<AgentDocument | null>;
  update(userId: string, id: string, data: CvData, version: string): Promise<AgentDocument | null>;
}

export function agentDocumentId(userId: string, requestId: string) {
  return "mcp-" + createHash("sha256").update(JSON.stringify([userId, requestId])).digest("hex");
}

const id = z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/);
const template = z.enum(["classic", "modern", "compact"]);
const annotations = { readOnlyHint: true, destructiveHint: false, openWorldHint: false, idempotentHint: true };
const output = { result: z.record(z.string(), z.unknown()) };
function result(value: Record<string, unknown>) {
  return { structuredContent: { result: value }, content: [{ type: "text" as const, text: JSON.stringify(value) }] };
}

export function createWorkcvMcpServer(userId: string, store: AgentCvStore) {
  const server = new McpServer({ name: "workcv-pilot", version: "0.1.0" }, {
    instructions: "Use only CV facts provided by the user. Read the current CV before updating and preserve its version. Keep the same requestId when retrying creation. This pilot does not charge, initiate checkout, or export paid PDFs. Preview is a text review, not a rendered PDF.",
  });
  async function get(documentId: string) {
    const doc = await store.get(userId, documentId);
    if (!doc) throw new Error("CV not found.");
    return doc;
  }
  const safe = <Args,>(handler: (args: Args) => Promise<ReturnType<typeof result>>) => async (args: Args) => {
    try { return await handler(args); }
    catch { return { isError: true, content: [{ type: "text" as const, text: "CV operation could not be completed. Check the ID and input; read the latest CV before retrying an update." }] }; }
  };
  server.registerTool("list_cv_templates", {
    title: "List WorkCV templates", description: "Use this when choosing a UK CV layout. Returns the supported template IDs and descriptions.",
    inputSchema: {}, outputSchema: output, annotations,
  }, async () => result({ templates }));
  server.registerTool("create_cv", {
    title: "Create a blank CV", description: "Use this when the user asks to create a new saved CV. Reuse requestId on retries; a new requestId creates another CV. No payment is taken.",
    inputSchema: { requestId: z.string().uuid(), template }, outputSchema: output,
    annotations: { ...annotations, readOnlyHint: false },
  }, safe<{ requestId: string; template: TemplateId }>(async ({ requestId, template: selected }) => {
    const documentId = agentDocumentId(userId, requestId);
    const existing = await store.get(userId, documentId);
    if (existing) return result({ document: existing });
    const blank = createBlankCv(selected);
    blank.experience = []; blank.education = [];
    return result({ document: await store.create(userId, documentId, parseCvData(blank)) });
  }));
  server.registerTool("get_cv", {
    title: "Read a saved CV", description: "Use this when reviewing the user's saved CV or obtaining its latest version before editing. Returns personal CV data from the authenticated account only.",
    inputSchema: { documentId: id }, outputSchema: output, annotations,
  }, safe<{ documentId: string }>(async ({ documentId }) => result({ document: await get(documentId) })));
  // Zod transforms are enforced by parseCvData; JSON Schema describes the input shape.
  const cvInput = z.toJSONSchema(cvDataSchema, { io: "input" });
  server.registerTool("update_cv", {
    title: "Update a saved CV", description: "Use this to replace CV fields with user-provided facts or change the template. Read get_cv first. Send the complete data object and its updatedAt as expectedUpdatedAt. A stale version is rejected.",
    inputSchema: { documentId: id, expectedUpdatedAt: z.string().datetime(), data: cvDataSchema },
    outputSchema: output, annotations: { ...annotations, readOnlyHint: false, destructiveHint: true, idempotentHint: false },
  }, safe<{ documentId: string; expectedUpdatedAt: string; data: CvData }>(async ({ documentId, expectedUpdatedAt, data }) => {
    const updated = await store.update(userId, documentId, parseCvData(data), expectedUpdatedAt);
    if (!updated) throw new Error("CV not found or changed.");
    return result({ document: updated });
  }));
  server.registerResource("cv_input_schema", "workcv://cv-input-schema", {
    description: "Input JSON Schema for a complete WorkCV CV; no personal data.", mimeType: "application/json",
  }, async () => ({ contents: [{ uri: "workcv://cv-input-schema", mimeType: "application/json", text: JSON.stringify(cvInput) }] }));
  server.registerTool("review_cv", {
    title: "Review CV completeness", description: "Use this to review saved CV content and completeness. This is a text review, not a visual PDF preview or an ATS guarantee.",
    inputSchema: { documentId: id }, outputSchema: output, annotations,
  }, safe<{ documentId: string }>(async ({ documentId }) => {
    const doc = await get(documentId);
    return result({ document: doc, readiness: calculateCvReadiness(doc.data), previewType: "text" });
  }));
  return server;
}
