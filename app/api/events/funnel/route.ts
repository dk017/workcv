import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { getCurrentUserFromRequest } from "@/lib/auth";
import { ensureAnalyticsTables, getPool } from "@/lib/db";
import {
  consumeFunnelRateLimit,
  funnelRateLimitHeaders,
} from "@/lib/funnel-rate-limit";
import {
  funnelEventDedupeValue,
  hashAnalyticsIdentifier,
  normalizeTrafficSource,
  sanitizeFunnelEvent,
} from "@/lib/funnel-events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function timingSafeSecretMatch(supplied: string | null, expected: string | undefined) {
  if (!supplied || !expected) return false;
  const suppliedBuffer = Buffer.from(supplied);
  const expectedBuffer = Buffer.from(expected);
  return (
    suppliedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(suppliedBuffer, expectedBuffer)
  );
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";
  if (!/^application\/json(?:;|$)/i.test(contentType)) {
    return NextResponse.json(
      { error: "JSON content type required" },
      { status: 415, headers: { "Cache-Control": "no-store" } },
    );
  }

  const body = await request.json().catch(() => null);
  const event = sanitizeFunnelEvent(body);
  if (!event) {
    return NextResponse.json(
      { error: "Invalid event" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (process.env.WORKCV_FUNNEL_INGEST_ENABLED !== "true") {
    return new NextResponse(null, {
      status: 204,
      headers: { "Cache-Control": "no-store", "X-WorkCV-Funnel": "disabled" },
    });
  }

  try {
    const visitorHash = hashAnalyticsIdentifier(event.visitorId);
    const sessionHash = hashAnalyticsIdentifier(event.sessionId);
    const rate = consumeFunnelRateLimit(request.headers, sessionHash);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many events" },
        { status: 429, headers: funnelRateLimitHeaders(rate) },
      );
    }

    const eventIdHash = hashAnalyticsIdentifier(
      funnelEventDedupeValue(event.eventName, event.eventId, event.sessionId),
    );
    const isTest = timingSafeSecretMatch(
      request.headers.get("x-workcv-smoke-token"),
      process.env.WORKCV_FUNNEL_SMOKE_SECRET,
    );
    const user = await getCurrentUserFromRequest(request).catch(() => null);

    await ensureAnalyticsTables();
    await getPool().query(
      `
        INSERT INTO workcv_funnel_events
          (event_id_hash, visitor_hash, session_hash, user_id, event_name, path,
           source, source_normalized, medium, campaign, referrer_host,
           device_class, is_test, metadata)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14::jsonb)
        ON CONFLICT DO NOTHING
      `,
      [
        eventIdHash,
        visitorHash,
        sessionHash,
        user?.id || null,
        event.eventName,
        event.path,
        event.source || null,
        normalizeTrafficSource(event.source, event.referrerHost),
        event.medium || null,
        event.campaign || null,
        event.referrerHost || null,
        event.deviceClass,
        isTest,
        JSON.stringify(event.metadata),
      ],
    );
    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("workcv_funnel_event_failed", {
      error: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json(
      { error: "Event unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
