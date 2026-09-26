import { NextRequest, NextResponse } from "next/server";

import { getCurrentUserFromRequest } from "@/lib/auth";
import { reportConversionFailure } from "@/lib/conversion-alerts";
import { cvDownloadFilename, renderCvDocx } from "@/lib/cv-docx";
import { getCvDocument } from "@/lib/cv-documents";
import { hasPaidCvOrder } from "@/lib/cv-entitlement";
import { recordServerEditorEvent } from "@/lib/server-editor-events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const documentId = request.nextUrl.searchParams.get("draftId") || "";
  if (!/^[a-zA-Z0-9_-]{12,80}$/.test(documentId)) {
    return NextResponse.json({ error: "Invalid CV" }, { status: 400 });
  }
  const document = await getCvDocument(user.id, documentId);
  if (!document) return NextResponse.json({ error: "CV not found" }, { status: 404 });
  if (!(await hasPaidCvOrder(user.id, documentId))) {
    return NextResponse.json({ error: "Payment required" }, { status: 402 });
  }

  try {
    const docx = await renderCvDocx(document.data);
    await recordServerEditorEvent({
      userId: user.id,
      documentId,
      eventName: "docx_downloaded",
    });
    return new NextResponse(new Uint8Array(docx), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${cvDownloadFilename(document.data.fullName, "docx")}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("cv_docx_render_failed", error);
    await reportConversionFailure({
      category: "docx_generation_failure",
      title: "A paid CV Word file could not be generated",
      userId: user.id,
      documentId,
      error,
      context: { route: "/api/cv/docx" },
    });
    return NextResponse.json({ error: "Word download is temporarily unavailable" }, { status: 503 });
  }
}
