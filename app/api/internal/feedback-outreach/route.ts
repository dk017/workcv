import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { runFeedbackOutreach } from "@/lib/feedback-outreach";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: NextRequest) {
  const expected = process.env.FEEDBACK_OUTREACH_SECRET;
  const supplied = request.headers.get("x-outreach-secret");
  if (!expected || !supplied) return false;
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  return (
    expectedBuffer.length === suppliedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, suppliedBuffer)
  );
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const payload = body as Record<string, unknown>;
  const limit =
    typeof payload.limit === "number" && Number.isFinite(payload.limit)
      ? payload.limit
      : 20;
  const result = await runFeedbackOutreach({
    limit,
    dryRun: payload.dryRun === true,
  });
  return NextResponse.json(result);
}
