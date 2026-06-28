import { createHash } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  generatePersonalStatement,
  PersonalStatementError,
  personalStatementInputSchema,
} from "@/lib/personal-statement-generator";
import { consumeToolRateLimit } from "@/lib/tool-rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

const limit = 6;
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

function rateLimitHeaders(result: ReturnType<typeof consumeToolRateLimit>) {
  return {
    "Cache-Control": "no-store",
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1_000)),
  };
}

export async function POST(request: NextRequest) {
  try {
    const contentLength = Number(request.headers.get("content-length") || "0");
    if (contentLength > 4_000) {
      return NextResponse.json(
        { error: "The submitted details are too large." },
        { status: 413, headers: { "Cache-Control": "no-store" } },
      );
    }

    const body = await request.text();
    if (body.length > 4_000) {
      return NextResponse.json(
        { error: "The submitted details are too large." },
        { status: 413, headers: { "Cache-Control": "no-store" } },
      );
    }
    const input = personalStatementInputSchema.parse(JSON.parse(body));
    const identifier = createHash("sha256")
      .update(`${process.env.RATE_LIMIT_SALT || "workcv"}:${clientAddress(request)}`)
      .digest("hex");
    const rateLimit = consumeToolRateLimit(identifier, { limit, windowMs });
    const headers = rateLimitHeaders(rateLimit);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error:
            "You have reached the free generation limit. Try again in a few minutes.",
        },
        {
          status: 429,
          headers: {
            ...headers,
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        },
      );
    }

    const result = await generatePersonalStatement(input);
    return NextResponse.json(result, { headers });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error:
            error.issues[0]?.message ||
            "Check the details you entered and try again.",
        },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "The request could not be read." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }
    if (error instanceof PersonalStatementError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status, headers: { "Cache-Control": "no-store" } },
      );
    }

    console.error("workcv_personal_statement_error", {
      message: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "The generator is temporarily unavailable. Please try again." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
