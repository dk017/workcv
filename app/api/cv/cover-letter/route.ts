import { NextRequest, NextResponse } from "next/server";

import { getCurrentUserFromRequest } from "@/lib/auth";
import { reportConversionFailure } from "@/lib/conversion-alerts";
import { hasCoverLetterContent } from "@/lib/cover-letter-document";
import { renderCoverLetterDocx } from "@/lib/cover-letter-docx";
import { cvDownloadFilename } from "@/lib/cv-docx";
import { getCvDocument } from "@/lib/cv-documents";
import { hasPaidCvOrder } from "@/lib/cv-entitlement";
import { createPdfRenderToken } from "@/lib/pdf-render-token";
import { renderPdf } from "@/lib/pdf-renderer";
import { recordServerEditorEvent } from "@/lib/server-editor-events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const contentTypes = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
} as const;

export async function GET(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const documentId = request.nextUrl.searchParams.get("draftId") || "";
  if (!/^[a-zA-Z0-9_-]{12,80}$/.test(documentId)) {
    return NextResponse.json({ error: "Invalid CV" }, { status: 400 });
  }
  const format = request.nextUrl.searchParams.get("format");
  if (format !== "pdf" && format !== "docx") {
    return NextResponse.json({ error: "Choose PDF or Word" }, { status: 400 });
  }
  const document = await getCvDocument(user.id, documentId);
  if (!document) return NextResponse.json({ error: "CV not found" }, { status: 404 });
  if (!(await hasPaidCvOrder(user.id, documentId))) {
    return NextResponse.json({ error: "Payment required" }, { status: 402 });
  }
  if (!hasCoverLetterContent(document.data)) {
    return NextResponse.json({ error: "Write your cover letter before downloading it." }, { status: 400 });
  }

  try {
    let file: Uint8Array<ArrayBuffer>;
    if (format === "docx") {
      file = new Uint8Array(await renderCoverLetterDocx(document.data));
    } else {
      const token = createPdfRenderToken({ documentId, userId: user.id });
      const origin = process.env.PDF_RENDER_BASE_URL || `http://127.0.0.1:${process.env.PORT || 3000}`;
      const renderUrl = `${origin}/cv-pdf/${encodeURIComponent(documentId)}/cover-letter?token=${encodeURIComponent(token)}`;
      file = new Uint8Array(await renderPdf(renderUrl));
    }
    await recordServerEditorEvent({
      userId: user.id,
      documentId,
      eventName: "cover_letter_downloaded",
      metadata: { format },
    });
    return new NextResponse(file, {
      headers: {
        "Content-Type": contentTypes[format],
        "Content-Disposition": `attachment; filename="${cvDownloadFilename(document.data.fullName, format, "cover-letter")}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("cover_letter_render_failed", error);
    await reportConversionFailure({
      category: "cover_letter_generation_failure",
      title: "A paid cover letter could not be generated",
      userId: user.id,
      documentId,
      error,
      context: { route: "/api/cv/cover-letter", format },
    });
    return NextResponse.json({ error: "Cover letter download is temporarily unavailable" }, { status: 503 });
  }
}
