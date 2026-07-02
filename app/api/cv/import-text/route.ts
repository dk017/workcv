import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

import { getCurrentUserFromRequest } from "@/lib/auth";
import { CvImportError, parseCvTextWithAi } from "@/lib/cv-import";
import { parseTemplate } from "@/lib/cv-documents";

export const runtime = "nodejs";
export const maxDuration = 35;

const inputSchema = z.object({
  text: z.string().trim().min(80).max(30_000),
  template: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const contentLength = Number(request.headers.get("content-length") || "0");
    if (contentLength > 35_000) {
      return NextResponse.json(
        { error: "The CV text is too large." },
        { status: 413, headers: { "Cache-Control": "no-store" } },
      );
    }
    const input = inputSchema.parse(await request.json());
    const template = parseTemplate(input.template || "") || "classic";
    const result = await parseCvTextWithAi(input.text, template);
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "The CV text could not be read." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }
    if (error instanceof CvImportError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status, headers: { "Cache-Control": "no-store" } },
      );
    }
    console.error("workcv_import_text_error", {
      message: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "We could not import that CV text." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
