import { ensureAnalyticsTables, getPool } from "@/lib/db";

export const serverEditorEventNames = [
  "document_created",
  "payment_confirmed",
  "pdf_downloaded",
] as const;

export type ServerEditorEventName = (typeof serverEditorEventNames)[number];

const allowedMetadata: Record<ServerEditorEventName, ReadonlySet<string>> = {
  document_created: new Set(["creation_method"]),
  payment_confirmed: new Set([]),
  pdf_downloaded: new Set([]),
};

function safeMetadata(
  eventName: ServerEditorEventName,
  input: Record<string, string | number | boolean>,
) {
  return Object.fromEntries(
    Object.entries(input)
      .filter(
        ([key, value]) =>
          allowedMetadata[eventName].has(key) &&
          (typeof value === "boolean" ||
            typeof value === "number" ||
            (typeof value === "string" && value.length <= 80)),
      )
      .slice(0, 5),
  );
}

export async function recordServerEditorEvent(input: {
  userId: string;
  documentId: string;
  eventName: ServerEditorEventName;
  eventKey?: string;
  metadata?: Record<string, string | number | boolean>;
}) {
  try {
    await ensureAnalyticsTables();
    await getPool().query(
      `
        INSERT INTO workcv_editor_events
          (user_id, document_id, event_name, event_key, metadata)
        VALUES ($1, $2, $3, $4, $5::jsonb)
        ON CONFLICT DO NOTHING
      `,
      [
        input.userId,
        input.documentId,
        input.eventName,
        input.eventKey?.slice(0, 200) || null,
        JSON.stringify(safeMetadata(input.eventName, input.metadata || {})),
      ],
    );
    return true;
  } catch (error) {
    console.error("workcv_server_editor_event_failed", {
      eventName: input.eventName,
      error: error instanceof Error ? error.name : "UnknownError",
    });
    return false;
  }
}
