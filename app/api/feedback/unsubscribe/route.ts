import { NextRequest, NextResponse } from "next/server";

import { unsubscribeFromFeedback } from "@/lib/feedback-outreach";
import { verifyFeedbackUnsubscribeToken } from "@/lib/feedback-token";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null);
  const token = formData?.get("token");
  const claims = verifyFeedbackUnsubscribeToken(
    typeof token === "string" ? token : null,
  );
  if (!claims) {
    return NextResponse.redirect(
      new URL("/feedback/unsubscribe?status=invalid", request.url),
      303,
    );
  }
  const updated = await unsubscribeFromFeedback(claims.userId);
  return NextResponse.redirect(
    new URL(
      `/feedback/unsubscribe?status=${updated ? "success" : "invalid"}`,
      request.url,
    ),
    303,
  );
}
