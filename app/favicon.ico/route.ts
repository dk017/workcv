import { NextResponse } from "next/server";
import { site } from "@/lib/site";

export function GET() {
  return NextResponse.redirect(new URL("/icon.svg", site.url), 308);
}
