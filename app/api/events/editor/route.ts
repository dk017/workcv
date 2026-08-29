import { NextRequest, NextResponse } from "next/server";

import { getCurrentUserFromRequest } from "@/lib/auth";
import { reportConversionFailure } from "@/lib/conversion-alerts";
import { ensureAnalyticsTables, getPool } from "@/lib/db";
import { isAllowedClientEditorEvent } from "@/lib/editor-events";

const documentIdPattern = /^[a-zA-Z0-9_-]{12,100}$/;

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";
  if (!/^application\/json(?:;|$)/i.test(contentType)) {
    return NextResponse.json({ error: "JSON content type required" }, { status: 415 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  const user = await getCurrentUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const eventName = typeof body.eventName === "string" ? body.eventName : "";
  const documentId =
    typeof body.documentId === "string" && documentIdPattern.test(body.documentId)
      ? body.documentId
      : null;
  if (!isAllowedClientEditorEvent(eventName)) {
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

  if (eventName === "save_failed") {
    await reportConversionFailure({
      category: "repeated_cv_save_failure",
      title: "Repeated CV saves failed",
      userId: user.id,
      documentId,
      error:
        typeof metadata.error_kind === "string"
          ? `Client save error: ${metadata.error_kind}`
          : "The editor reported a failed save.",
      context: {
        route: "/api/events/editor",
        error_kind:
          typeof metadata.error_kind === "string"
            ? metadata.error_kind
            : "unknown",
      },
      threshold: 3,
      windowMinutes: 15,
      cooldownMinutes: 60,
    });
  }

  if (eventName === "pdf_generation_failed") {
    await reportConversionFailure({
      category: "repeated_pdf_generation_failure",
      title: "Repeated paid PDF downloads failed",
      userId: user.id,
      documentId,
      error: "The editor reported a failed PDF generation attempt.",
      context: { route: "/api/events/editor" },
      threshold: 2,
      windowMinutes: 15,
      cooldownMinutes: 60,
    });
  }

  return NextResponse.json({ ok: true });
}
