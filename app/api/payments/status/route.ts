import { NextRequest, NextResponse } from "next/server";

import { getCurrentUserFromRequest } from "@/lib/auth";
import { userOwnsCvDocument } from "@/lib/cv-documents";
import { getPassStatus, getUpgradeOffer, hasPaidCvOrder } from "@/lib/cv-entitlement";
import { getPool, hasDatabaseUrl } from "@/lib/db";

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

    const [unlocked, pass, upgrade] = await Promise.all([
      hasPaidCvOrder(user.id, draftId),
      getPassStatus(user.id),
      // The upgrade is optional; a lookup failure must not block payment status.
      getUpgradeOffer(user).catch((error) => {
        console.error("upgrade_offer_lookup_failed", error);
        return { eligible: false } as const;
      }),
    ]);

    if (unlocked) {
      return NextResponse.json({ paid: true, status: "paid", pass, upgrade });
    }

    const checkout = await getPool().query<{ status: string }>(
      `
        SELECT status
        FROM workcv_payment_checkouts
        WHERE draft_id = $1
        ORDER BY created_at DESC
        LIMIT 1
      `,
      [draftId],
    );
    const status = checkout.rows[0]?.status;
    return NextResponse.json({
      paid: false,
      status:
        status === "failed" || status === "cancelled" ? status : "pending",
      pass,
      upgrade,
    });
  } catch (error) {
    console.error("payment_status_check_failed", error);
    return NextResponse.json({ paid: false, error: "Status unavailable" }, { status: 503 });
  }
}
