"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

export function AnalyticsRefresh() {
  const router = useRouter();
  const [automatic, setAutomatic] = useState(false);
  const [pending, startTransition] = useTransition();
  useEffect(() => {
    if (!automatic) return;
    const timer = setInterval(() => {
      if (document.visibilityState === "visible" && !pending) startTransition(() => router.refresh());
    }, 60_000);
    return () => clearInterval(timer);
  }, [automatic, pending, router]);
  return <div className="flex flex-wrap items-center gap-3 text-sm">
    <label className="flex cursor-pointer items-center gap-2 text-slate-600"><input type="checkbox" checked={automatic} onChange={event => setAutomatic(event.target.checked)} />Auto-refresh · 60s</label>
    <button type="button" onClick={() => startTransition(() => router.refresh())} disabled={pending} className="flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"><RefreshCw size={15} className={pending ? "animate-spin" : ""} />{pending ? "Refreshing…" : "Refresh"}</button>
    <span role="status" className="sr-only">{pending ? "Updating analytics" : "Analytics ready"}</span>
  </div>;
}
