"use client";

import Link from "next/link";
import type { MouseEventHandler } from "react";

import { trackFunnelEvent } from "@/components/attribution-capture";
import { rememberCtaHandoff } from "@/lib/cta-attribution";

export function TrackedLink({
  href,
  placement,
  className,
  download,
  tabIndex,
  onClick,
  children,
}: {
  href: string;
  placement: string;
  className?: string;
  download?: boolean;
  tabIndex?: number;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      download={download}
      tabIndex={tabIndex}
      data-analytics-placement={placement}
      onClick={(event) => {
        rememberCtaHandoff(placement, href);
        trackFunnelEvent("marketing_cta_clicked", {
          destination: href,
          placement,
        });
        onClick?.(event);
      }}
    >
      {children}
    </Link>
  );
}
