import { NextRequest, NextResponse } from "next/server.js";

import { agentDiscoveryLinkHeader, pageLinkHeader } from "./lib/agent-discovery.ts";
import { prefersMarkdown } from "./lib/md/accept.ts";
import { isPublicRoute } from "./lib/md/public-routes.ts";

// Routes that really end in .md are served as they are.
function isRealMarkdownRoute(pathname: string) {
  return pathname === "/auth.md" || pathname.startsWith("/agent-skills/") || pathname.startsWith("/.well-known/");
}

function rewriteToMarkdown(request: NextRequest, pagePath: string) {
  const url = request.nextUrl.clone();
  url.pathname = pagePath === "/" ? "/api/md/index" : `/api/md${pagePath}`;
  url.search = "";
  return NextResponse.rewrite(url);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /pricing.md and /index.md: the markdown version of that page, or a markdown 404 from the handler.
  if (pathname.endsWith(".md") && !isRealMarkdownRoute(pathname)) {
    return rewriteToMarkdown(request, pathname === "/index.md" ? "/" : pathname.slice(0, -3));
  }

  // Content negotiation is limited to public pages, so app and API routes never change shape.
  const readsPage = request.method === "GET" || request.method === "HEAD";
  if (readsPage && isPublicRoute(pathname) && prefersMarkdown(request.headers.get("accept"))) {
    return rewriteToMarkdown(request, pathname);
  }

  // Signed-in visitors use the app's own pages. Browsers keep the #fragment across this
  // redirect, so job details the Chrome extension puts there reach the in-app Tailor page.
  if (request.method === "GET" && (pathname === "/" || pathname === "/tailor") && request.cookies.has("workcv_session")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/tailor" ? "/my-cvs/tailor" : "/my-cvs";
    if (pathname === "/") url.search = "";
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  const privatePath =
    pathname === "/admin" || pathname.startsWith("/admin/") ||
    pathname === "/editor" ||
    pathname === "/my-cvs" || pathname.startsWith("/my-cvs/") ||
    pathname === "/account" ||
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

  if (isPublicRoute(pathname)) {
    response.headers.set("Link", pathname === "/" ? agentDiscoveryLinkHeader : pageLinkHeader(pathname));
    response.headers.append("Vary", "Accept");
  }

  return response;
}

export const config = {
  // Everything except Next internals, API routes and static files; the checks above pick what to act on.
  matcher: ["/((?!_next/|api/|.*\\.(?:txt|xml|json|ico|png|jpe?g|gif|svg|webp|avif|css|js|map|woff2?|ttf|pdf|docx)$).*)"],
};
