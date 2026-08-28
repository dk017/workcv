"use client";

import Link from "next/link";

import { trackFunnelEvent } from "@/components/attribution-capture";

export function TrackedLink({
  href,
  placement,
  className,
  download,
  children,
}: {
  href: string;
  placement: string;
  className?: string;
  download?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      download={download}
      data-analytics-placement={placement}
      onClick={() =>
        trackFunnelEvent("marketing_cta_clicked", {
          destination: href,
          placement,
        })
      }
    >
      {children}
    </Link>
  );
}
