import { NextRequest, NextResponse } from "next/server";

import { searchSponsors } from "@/lib/sponsor-register";
import { getSponsorRegister } from "@/lib/sponsor-register-store";
import { consumeToolRateLimit } from "@/lib/tool-rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// One request per page of job cards from the UK Visa Sponsor Checker
// extension, which caches each answer for a day.
const maxNames = 40;
const limit = 120;
const windowMs = 10 * 60 * 1_000;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

function clientAddress(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    request.headers.get("cf-connecting-ip")?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    forwarded ||
    "unknown"
  ).slice(0, 128);
}

function fail(error: string, status: number, headers: Record<string, string> = {}) {
  return NextResponse.json({ error }, { status, headers: { ...corsHeaders, ...headers, "Cache-Control": "no-store" } });
}

/** Employer names from the request body: strings only, trimmed, deduplicated. */
function readNames(body: unknown) {
  const names = body && typeof body === "object" ? (body as { names?: unknown }).names : undefined;
  if (!Array.isArray(names)) return null;
  const tidy = names.filter((name): name is string => typeof name === "string").map((name) => name.trim().slice(0, 160)).filter((name) => name.length >= 2);
  return Array.from(new Set(tidy)).slice(0, maxNames);
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  let names: string[] | null = null;
  try {
    names = readNames(await request.json());
  } catch {
    names = null;
  }
  if (!names) return fail('Send {"names": [...]} with up to 40 employer names.', 400);
  if (!names.length) return NextResponse.json({ registerDate: null, results: [] }, { headers: corsHeaders });

  const rate = consumeToolRateLimit(`sponsor-batch:${clientAddress(request)}`, { limit, windowMs });
  if (!rate.allowed) return fail("Too many checks. Please wait a few minutes.", 429, { "Retry-After": String(rate.retryAfterSeconds) });

  try {
    const { register } = await getSponsorRegister();
    const results = names.map((query) => {
      const result = searchSponsors(register, query, 3);
      return { query, status: result.status, total: result.total, matches: result.matches };
    });
    return NextResponse.json({ registerDate: register.registerDate, results }, { headers: { ...corsHeaders, "Cache-Control": "no-store" } });
  } catch {
    return fail("The sponsor register is temporarily unavailable. Please try again shortly.", 503);
  }
}
