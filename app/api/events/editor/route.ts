import { NextRequest, NextResponse } from "next/server";

import { getCurrentUserFromRequest } from "@/lib/auth";
import { reportConversionFailure } from "@/lib/conversion-alerts";
import { ensureAnalyticsTables, getPool } from "@/lib/db";
import { editorEventNames } from "@/lib/editor-events";
import {
  funnelEventDedupeValue,
  hashAnalyticsIdentifier,
  normalizeTrafficSource,
  sanitizeFunnelEvent,
} from "@/lib/funnel-events";

const allowedEvents = new Set<string>(editorEventNames);
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

  const funnelEvent = sanitizeFunnelEvent(body);
  if (funnelEvent) {
    try {
      await ensureAnalyticsTables();
      const visitorHash = hashAnalyticsIdentifier(funnelEvent.visitorId);
      const sessionHash = hashAnalyticsIdentifier(funnelEvent.sessionId);
      const eventIdHash = hashAnalyticsIdentifier(
        funnelEventDedupeValue(
          funnelEvent.eventName,
          funnelEvent.eventId,
          funnelEvent.sessionId,
        ),
      );
      const recent = await getPool().query<{ count: string }>(
        `
          SELECT COUNT(*)::text AS count
          FROM workcv_funnel_events
          WHERE session_hash = $1
            AND created_at > NOW() - INTERVAL '1 minute'
        `,
        [sessionHash],
      );
      if (Number(recent.rows[0]?.count || 0) >= 60) {
        return NextResponse.json({ error: "Too many events" }, { status: 429 });
      }

      const user = await getCurrentUserFromRequest(request).catch(() => null);
      await getPool().query(
        `
          INSERT INTO workcv_funnel_events
            (event_id_hash, visitor_hash, session_hash, user_id, event_name, path,
             source, source_normalized, medium, campaign, referrer_host,
             device_class, metadata)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb)
          ON CONFLICT DO NOTHING
        `,
        [
          eventIdHash,
          visitorHash,
          sessionHash,
          user?.id || null,
          funnelEvent.eventName,
          funnelEvent.path,
          funnelEvent.source || null,
          normalizeTrafficSource(funnelEvent.source, funnelEvent.referrerHost),
          funnelEvent.medium || null,
          funnelEvent.campaign || null,
          funnelEvent.referrerHost || null,
          funnelEvent.deviceClass,
          JSON.stringify(funnelEvent.metadata),
        ],
      );
      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error("workcv_funnel_event_failed", error);
      return NextResponse.json({ error: "Event unavailable" }, { status: 503 });
    }
  }

  const user = await getCurrentUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

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
