"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { SiteBreadcrumbs } from "@/components/site-breadcrumbs";

export function SiteFrame({ children, header, footer }: { children: React.ReactNode; header: React.ReactNode; footer: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return <main>{children}</main>;
  const analytics = <Script defer data-site="hq2xtnu4" data-domain="workcv.co.uk" src="https://piqo.app/piqo.js" strategy="afterInteractive" />;
  // The CV editor is a focused app screen with its own top bar.
  if (pathname === "/editor") return <>{analytics}<main>{children}</main></>;
  // Signed-in pages use the app shell, which has its own navigation and <main>.
  if (pathname === "/account" || pathname === "/my-cvs" || pathname.startsWith("/my-cvs/")) return <>{analytics}{children}</>;
  return <>
    {analytics}
    {header}<SiteBreadcrumbs /><main>{children}</main>{footer}
  </>;
}
