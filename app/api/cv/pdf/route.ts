import { NextRequest, NextResponse } from "next/server";

import { getCurrentUserFromRequest } from "@/lib/auth";
import { reportConversionFailure } from "@/lib/conversion-alerts";
import { recordServerEditorEvent } from "@/lib/server-editor-events";
import { cvDownloadFilename } from "@/lib/cv-docx";
import { getCvDocument } from "@/lib/cv-documents";
import { hasPaidCvOrder } from "@/lib/cv-entitlement";
import { createPdfRenderToken } from "@/lib/pdf-render-token";
import { renderPdf } from "@/lib/pdf-renderer";

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
    const token = createPdfRenderToken({ documentId, userId: user.id });
    const origin = process.env.PDF_RENDER_BASE_URL || `http://127.0.0.1:${process.env.PORT || 3000}`;
    const renderUrl = `${origin}/cv-pdf/${encodeURIComponent(documentId)}?token=${encodeURIComponent(token)}`;
    const pdf = await renderPdf(renderUrl);
    await recordServerEditorEvent({
      userId: user.id,
      documentId,
      eventName: "pdf_downloaded",
    });
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${cvDownloadFilename(document.data.fullName, "pdf")}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("cv_pdf_render_failed", error);
    await reportConversionFailure({
      category: "pdf_generation_failure",
      title: "A paid CV PDF could not be generated",
      userId: user.id,
      documentId,
      error,
      context: { route: "/api/cv/pdf" },
    });
    return NextResponse.json({ error: "PDF generation is temporarily unavailable" }, { status: 503 });
  }
}
