import { NextRequest, NextResponse } from "next/server.js";

import { agentDiscoveryLinkHeader } from "./lib/agent-discovery.ts";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const acceptsMarkdown = request.headers
    .get("accept")
    ?.toLowerCase()
    .includes("text/markdown");

  if (request.method === "GET" && pathname === "/" && acceptsMarkdown) {
    const url = request.nextUrl.clone();
    url.pathname = "/agent-markdown";
    url.searchParams.set("path", "/");

    const response = NextResponse.rewrite(url);
    response.headers.set("Link", agentDiscoveryLinkHeader);
    response.headers.set("Vary", "Accept");
    return response;
  }

  const response = NextResponse.next();
  const privatePath =
    pathname === "/admin" || pathname.startsWith("/admin/") ||
    pathname === "/editor" ||
    pathname === "/my-cvs" ||
    pathname.startsWith("/cv-pdf/");

  if (pathname === "/login") {
    response.headers.set("X-Robots-Tag", "noindex, follow, noarchive");
  } else if (privatePath) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    response.headers.set("Referrer-Policy", "no-referrer");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
  }

  if (pathname === "/") {
    response.headers.set("Link", agentDiscoveryLinkHeader);
    response.headers.append("Vary", "Accept");
  }

  return response;
}

export const config = {
  matcher: ["/", "/login", "/editor", "/my-cvs", "/cv-pdf/:path*", "/admin/:path*"],
};
