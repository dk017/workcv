import { createHash } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  assessCvFit,
  CvFitAssessmentError,
  cvFitInputSchema,
} from "@/lib/cv-fit-assessment";
import { consumeToolRateLimit } from "@/lib/tool-rate-limit";

export const runtime = "nodejs";
export const maxDuration = 35;

const limit = 4;
const windowMs = 15 * 60 * 1_000;
const maxBodyBytes = 55_000;

function clientAddress(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    request.headers.get("cf-connecting-ip")?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    forwarded ||
    "unknown"
  ).slice(0, 128);
}

function noStoreHeaders(extra: Record<string, string> = {}) {
  return { "Cache-Control": "no-store", ...extra };
}

export async function POST(request: NextRequest) {
  try {
    const contentLength = Number(request.headers.get("content-length") || "0");
    if (contentLength > maxBodyBytes) {
      return NextResponse.json(
        { error: "The CV and job advert are too large." },
        { status: 413, headers: noStoreHeaders() },
      );
    }

    const body = await request.text();
    if (body.length > maxBodyBytes) {
      return NextResponse.json(
        { error: "The CV and job advert are too large." },
        { status: 413, headers: noStoreHeaders() },
      );
    }

    const input = cvFitInputSchema.parse(JSON.parse(body));
    const identifier = createHash("sha256")
      .update(
        `${process.env.RATE_LIMIT_SALT || "workcv"}:cv-fit:${clientAddress(request)}`,
      )
      .digest("hex");
    const rateLimit = consumeToolRateLimit(identifier, { limit, windowMs });
    const headers = noStoreHeaders({
      "X-RateLimit-Limit": String(rateLimit.limit),
      "X-RateLimit-Remaining": String(rateLimit.remaining),
      "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetAt / 1_000)),
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "You have reached the free assessment limit. Try again shortly." },
        {
          status: 429,
          headers: {
            ...headers,
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        },
      );
    }

    return NextResponse.json(await assessCvFit(input), { headers });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Check both text inputs." },
        { status: 400, headers: noStoreHeaders() },
      );
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "The request could not be read." },
        { status: 400, headers: noStoreHeaders() },
      );
    }
    if (error instanceof CvFitAssessmentError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status, headers: noStoreHeaders() },
      );
    }

    console.error("workcv_cv_fit_error", {
      message: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "The assessment is temporarily unavailable. Please try again." },
      { status: 500, headers: noStoreHeaders() },
    );
  }
}
