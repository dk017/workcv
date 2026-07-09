import { NextRequest, NextResponse } from "next/server";

import {
  applySessionCookie,
  AuthRateLimitError,
  verifyEmailLoginCode,
} from "@/lib/auth";

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
    const code = typeof payload.code === "string" ? payload.code : "";
    const ip =
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      "unknown";
    const session = await verifyEmailLoginCode(email, code, ip);

    if (!session) {
      return NextResponse.json({ error: "Invalid or expired code." }, { status: 401 });
    }

    const response = NextResponse.json({
      ok: true,
      userId: session.userId,
      isNewUser: session.isNewUser,
    });
    applySessionCookie(response, session.token);
    return response;
  } catch (error) {
    if (error instanceof AuthRateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }
    console.error("workcv_verify_code_failed", error);
    return NextResponse.json({ error: "Could not verify the login code." }, { status: 500 });
  }
}
