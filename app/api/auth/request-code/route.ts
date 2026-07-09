import { NextRequest, NextResponse } from "next/server";

import { AuthRateLimitError, requestEmailLoginCode } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const payload = typeof body === "object" && body ? (body as Record<string, unknown>) : {};
    const email = typeof payload.email === "string" ? payload.email : "";
    const ip =
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      "unknown";
    const result = await requestEmailLoginCode(email, ip);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_EMAIL") {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (error instanceof AuthRateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }

    console.error("workcv_request_code_failed", error);
    return NextResponse.json({ error: "Could not send the login code." }, { status: 500 });
  }
}
