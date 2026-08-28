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
    pathname === "/login" ||
    pathname === "/editor" ||
    pathname === "/my-cvs" ||
    pathname.startsWith("/cv-pdf/");

  if (privatePath) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  if (pathname === "/") {
    response.headers.set("Link", agentDiscoveryLinkHeader);
    response.headers.append("Vary", "Accept");
  }

  return response;
}

export const config = {
  matcher: ["/", "/login", "/editor", "/my-cvs", "/cv-pdf/:path*"],
};
