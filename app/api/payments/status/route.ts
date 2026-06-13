import { NextRequest, NextResponse } from "next/server";

import { getCurrentUserFromRequest } from "@/lib/auth";
import { userOwnsCvDocument } from "@/lib/cv-documents";
import { ensurePaymentTables, getPool, hasDatabaseUrl } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const draftId = request.nextUrl.searchParams.get("draftId");
  if (!draftId || !/^[a-zA-Z0-9_-]{12,80}$/.test(draftId)) {
    return NextResponse.json({ paid: false }, { status: 400 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ paid: false, configured: false });
  }

  try {
    const ownsDocument = await userOwnsCvDocument(user.id, draftId);
    if (!ownsDocument) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    await ensurePaymentTables();
    const result = await getPool().query(
      `
        SELECT id, paid_at
        FROM workcv_orders
        WHERE draft_id = $1
        ORDER BY paid_at DESC
        LIMIT 1
      `,
      [draftId]
    );

    return NextResponse.json({
      paid: result.rows.length > 0,
      paidAt: result.rows[0]?.paid_at ?? null,
    });
  } catch (error) {
    console.error("payment_status_check_failed", error);
    return NextResponse.json({ paid: false, error: "Status unavailable" }, { status: 503 });
  }
}
