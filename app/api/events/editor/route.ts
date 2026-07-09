import { NextRequest, NextResponse } from "next/server";

import { getCurrentUserFromRequest } from "@/lib/auth";
import { ensureAnalyticsTables, getPool } from "@/lib/db";
import { editorEventNames } from "@/lib/editor-events";

const allowedEvents = new Set<string>(editorEventNames);
const documentIdPattern = /^[a-zA-Z0-9_-]{12,100}$/;

export async function POST(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }
  const eventName = typeof body.eventName === "string" ? body.eventName : "";
  const documentId =
    typeof body.documentId === "string" && documentIdPattern.test(body.documentId)
      ? body.documentId
      : null;
  if (!allowedEvents.has(eventName)) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  const metadataInput =
    body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)
      ? (body.metadata as Record<string, unknown>)
      : {};
  const metadata = Object.fromEntries(
    Object.entries(metadataInput)
      .filter(
        ([key, value]) =>
          /^[a-z_]{1,40}$/.test(key) &&
          (typeof value === "boolean" ||
            typeof value === "number" ||
            (typeof value === "string" && value.length <= 80)),
      )
      .slice(0, 10),
  );

  await ensureAnalyticsTables();
  await getPool().query(
    `
      INSERT INTO workcv_editor_events
        (user_id, document_id, event_name, metadata)
      VALUES ($1, $2, $3, $4::jsonb)
    `,
    [user.id, documentId, eventName, JSON.stringify(metadata)],
  );
  return NextResponse.json({ ok: true });
}
