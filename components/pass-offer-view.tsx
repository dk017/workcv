"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { trackFunnelEvent } from "@/components/attribution-capture";

// Measures the price/use-case block, not a page load or an off-screen banner.
export function PassOfferView({ placement, children }: { placement: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const path = usePathname();
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const key = `workcv_offer_v2:${path}:${placement}`;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let visible = false;
    let sent = false;
    const clear = () => { if (timer) clearTimeout(timer); timer = undefined; };
    const schedule = () => {
      clear();
      if (!visible || document.visibilityState !== "visible" || sent) return;
      timer = setTimeout(() => {
        try {
          if (sessionStorage.getItem(key)) return;
          sessionStorage.setItem(key, "1");
        } catch { /* Per-mount fallback if storage is unavailable. */ }
        sent = true;
        trackFunnelEvent("public_pass_offer_viewed", { placement, offer_version: "saved_versions_v2" });
      }, 1000);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
      schedule();
    }, { threshold: [0, 0.5] });
    observer.observe(node);
    document.addEventListener("visibilitychange", schedule);
    return () => { clear(); observer.disconnect(); document.removeEventListener("visibilitychange", schedule); };
  }, [path, placement]);
  return <div ref={ref}>{children}</div>;
}
