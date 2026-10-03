import { getPool } from "@/lib/db";
import { WORKCV_PASS_PRODUCT_ID, WORKCV_PRODUCT_ID } from "@/lib/commerce";
import { collectAdminAnalytics } from "@/lib/admin-analytics-query";
import type { AnalyticsRange } from "@/lib/admin-access";

// Called only after the page's server-side admin check. No shared or public cache.
export async function getAdminAnalytics(range: AnalyticsRange) {
  const client = await getPool().connect();
  try {
    return await collectAdminAnalytics(client, {
      range,
      excludedUsers: [process.env.WORKCV_TEST_USER_IDS, process.env.ANALYTICS_ADMIN_EMAILS].filter(Boolean).join(",").split(",").map(x => x.trim()).filter(Boolean),
      passProductId: WORKCV_PASS_PRODUCT_ID,
      cvProductId: WORKCV_PRODUCT_ID,
      ingestEnabled: process.env.WORKCV_FUNNEL_INGEST_ENABLED === "true",
    });
  } finally {
    client.release();
  }
}
