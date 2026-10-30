import { NextRequest, NextResponse } from "next/server";

import { clearSessionCookie, getCurrentUserFromRequest } from "@/lib/auth";
import { buildLoginHref, safeInternalRedirect } from "@/lib/safe-redirect";

// Signed-in pages send a session cookie the server no longer recognises here. The cookie is
// cleared so the homepage stops sending this browser to My CVs, then the visitor signs in again.
// A session that is still valid is left alone, so a link to this address can't sign anyone out.
export async function GET(request: NextRequest) {
  const next = safeInternalRedirect(request.nextUrl.searchParams.get("next"), "/my-cvs");
  const user = await getCurrentUserFromRequest(request);
  if (user) return NextResponse.redirect(new URL(next, request.url));
  const response = NextResponse.redirect(new URL(buildLoginHref(next), request.url));
  clearSessionCookie(response);
  return response;
}
