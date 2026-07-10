import { createHash } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  CoverLetterError,
  coverLetterInputSchema,
  generateCoverLetter,
} from "@/lib/cover-letter-generator";
import { consumeToolRateLimit } from "@/lib/tool-rate-limit";

export const runtime = "nodejs";
export const maxDuration = 35;

const limit = 5;
const windowMs = 15 * 60 * 1_000;

function clientAddress(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    request.headers.get("cf-connecting-ip")?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    forwarded ||
    "unknown"
  ).slice(0, 128);
}

export async function POST(request: NextRequest) {
  try {
    const contentLength = Number(request.headers.get("content-length") || "0");
    if (contentLength > 12_000) {
      return NextResponse.json(
        { error: "The submitted details are too large." },
        { status: 413, headers: { "Cache-Control": "no-store" } },
      );
    }

    const body = await request.text();
    if (body.length > 12_000) {
      return NextResponse.json(
        { error: "The submitted details are too large." },
        { status: 413, headers: { "Cache-Control": "no-store" } },
      );
    }

    const input = coverLetterInputSchema.parse(JSON.parse(body));
    const identifier = createHash("sha256")
      .update(`${process.env.RATE_LIMIT_SALT || "workcv"}:${clientAddress(request)}`)
      .digest("hex");
    const rateLimit = consumeToolRateLimit(identifier, { limit, windowMs });
    const headers = {
      "Cache-Control": "no-store",
      "X-RateLimit-Limit": String(rateLimit.limit),
      "X-RateLimit-Remaining": String(rateLimit.remaining),
      "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetAt / 1_000)),
    };

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "You have reached the free generation limit. Try again shortly." },
        {
          status: 429,
          headers: {
            ...headers,
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        },
      );
    }

    return NextResponse.json(await generateCoverLetter(input), { headers });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Check your details and try again." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "The request could not be read." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }
    if (error instanceof CoverLetterError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status, headers: { "Cache-Control": "no-store" } },
      );
    }

    console.error("workcv_cover_letter_error", {
      message: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "The generator is temporarily unavailable. Please try again." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
