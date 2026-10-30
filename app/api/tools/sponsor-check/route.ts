import { NextRequest, NextResponse } from "next/server";

import { searchSponsors } from "@/lib/sponsor-register";
import { getSponsorRegister } from "@/lib/sponsor-register-store";
import { consumeToolRateLimit } from "@/lib/tool-rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limit = 60;
const windowMs = 10 * 60 * 1_000;

// Public register data, read by the WorkCV site and the Chrome extension popup.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") || "").trim().slice(0, 160);
  if (query.length < 2) {
    return NextResponse.json({ error: "Enter at least two characters of the employer's name." }, { status: 400, headers: { ...corsHeaders, "Cache-Control": "no-store" } });
  }

  const rate = consumeToolRateLimit(`sponsor-check:${clientAddress(request)}`, { limit, windowMs });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many searches. Please wait a few minutes and try again." },
      { status: 429, headers: { ...corsHeaders, "Retry-After": String(rate.retryAfterSeconds), "Cache-Control": "no-store" } },
    );
  }

  try {
    const { register } = await getSponsorRegister();
    const result = searchSponsors(register, query, 10);
    return NextResponse.json(
      { query, registerDate: register.registerDate, ...result },
      { headers: { ...corsHeaders, "Cache-Control": "public, max-age=600" } },
    );
  } catch {
    return NextResponse.json(
      { error: "The sponsor register is temporarily unavailable. Please try again shortly, or search it on GOV.UK." },
      { status: 503, headers: { ...corsHeaders, "Cache-Control": "no-store" } },
    );
  }
}
