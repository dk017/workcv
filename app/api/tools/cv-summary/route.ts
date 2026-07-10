import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { CvSummaryError, cvSummaryInputSchema, generateCvSummaries } from "@/lib/cv-summary-generator";
import { consumeToolRateLimit } from "@/lib/tool-rate-limit";

export const runtime = "nodejs";
export const maxDuration = 35;
const limit = 5;
const windowMs = 15 * 60 * 1_000;

function clientAddress(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (request.headers.get("cf-connecting-ip")?.trim() || request.headers.get("x-real-ip")?.trim() || forwarded || "unknown").slice(0, 128);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    if (body.length > 12_000) return NextResponse.json({ error: "The submitted details are too large." }, { status: 413, headers: { "Cache-Control": "no-store" } });
    const input = cvSummaryInputSchema.parse(JSON.parse(body));
    const identifier = createHash("sha256").update(`${process.env.RATE_LIMIT_SALT || "workcv"}:${clientAddress(request)}`).digest("hex");
    const rate = consumeToolRateLimit(identifier, { limit, windowMs });
    const headers = { "Cache-Control": "no-store", "X-RateLimit-Limit": String(rate.limit), "X-RateLimit-Remaining": String(rate.remaining), "X-RateLimit-Reset": String(Math.ceil(rate.resetAt / 1_000)) };
    if (!rate.allowed) return NextResponse.json({ error: "You have reached the free generation limit. Try again shortly." }, { status: 429, headers: { ...headers, "Retry-After": String(rate.retryAfterSeconds) } });
    return NextResponse.json(await generateCvSummaries(input), { headers });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: error.issues[0]?.message || "Check your details and try again." }, { status: 400 });
    if (error instanceof SyntaxError) return NextResponse.json({ error: "The request could not be read." }, { status: 400 });
    if (error instanceof CvSummaryError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("workcv_cv_summary_error", { message: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: "The generator is temporarily unavailable. Please try again." }, { status: 500 });
  }
}
