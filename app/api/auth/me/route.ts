import { NextRequest, NextResponse } from "next/server";

import { getCurrentUserFromRequest } from "@/lib/auth";
import { isAnalyticsAdminEmail } from "@/lib/admin-access";

export async function GET(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ authenticated: false }, { headers: { "Cache-Control": "private, no-store" } });
  }

  return NextResponse.json({
    authenticated: true,
    user,
    analyticsAdmin: isAnalyticsAdminEmail(user.email),
  }, { headers: { "Cache-Control": "private, no-store" } });
}
