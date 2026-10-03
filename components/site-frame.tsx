"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { SiteBreadcrumbs } from "@/components/site-breadcrumbs";

export function SiteFrame({ children, header, footer }: { children: React.ReactNode; header: React.ReactNode; footer: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return <main>{children}</main>;
  return <>
    <Script defer data-site="hq2xtnu4" data-domain="workcv.co.uk" src="https://piqo.app/piqo.js" strategy="afterInteractive" />
    {header}<SiteBreadcrumbs /><main>{children}</main>{footer}
  </>;
}
