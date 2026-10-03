import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isAnalyticsAdminEmail, parseAnalyticsRange, parseAnalyticsView } from "@/lib/admin-access";
import { getAdminAnalytics } from "@/lib/admin-analytics";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = { title: "Analytics", robots: { index: false, follow: false, nocache: true }, alternates: { canonical: "/admin/analytics" } };

export default async function AnalyticsPage({ searchParams }: { searchParams: { range?: string; view?: string } }) {
  const range = parseAnalyticsRange(searchParams.range);
  const view = parseAnalyticsView(searchParams.view);
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/admin/analytics?range=${range}&view=${view}`)}`);
  if (!isAnalyticsAdminEmail(user.email)) notFound();
  let report = null;
  try { report = await getAdminAnalytics(range); }
  catch (error) { console.error("workcv_admin_analytics_unavailable", { name: error instanceof Error ? error.name : "UnknownError" }); }
  return <AnalyticsDashboard report={report} range={range} view={view} />;
}
