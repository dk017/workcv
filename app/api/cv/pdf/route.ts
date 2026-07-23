import { NextRequest, NextResponse } from "next/server";

import { getCurrentUserFromRequest } from "@/lib/auth";
import { reportConversionFailure } from "@/lib/conversion-alerts";
import { getCvDocument } from "@/lib/cv-documents";
import { ensurePaymentTables, getPool } from "@/lib/db";
import { createPdfRenderToken } from "@/lib/pdf-render-token";
import { renderPdf } from "@/lib/pdf-renderer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeFilename(name: string) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${base || "workcv"}-cv.pdf`;
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const documentId = request.nextUrl.searchParams.get("draftId") || "";
  if (!/^[a-zA-Z0-9_-]{12,80}$/.test(documentId)) {
    return NextResponse.json({ error: "Invalid CV" }, { status: 400 });
  }
  const document = await getCvDocument(user.id, documentId);
  if (!document) return NextResponse.json({ error: "CV not found" }, { status: 404 });

  await ensurePaymentTables();
  const paid = await getPool().query(
    "SELECT 1 FROM workcv_orders WHERE draft_id = $1 AND user_id = $2 LIMIT 1",
    [documentId, user.id],
  );
  if (!paid.rows[0]) return NextResponse.json({ error: "Payment required" }, { status: 402 });

  try {
    const token = createPdfRenderToken({ documentId, userId: user.id });
    const origin = process.env.PDF_RENDER_BASE_URL || `http://127.0.0.1:${process.env.PORT || 3000}`;
    const renderUrl = `${origin}/cv-pdf/${encodeURIComponent(documentId)}?token=${encodeURIComponent(token)}`;
    const pdf = await renderPdf(renderUrl);
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeFilename(document.data.fullName)}"`,
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
