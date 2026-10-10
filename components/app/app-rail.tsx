"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import { Briefcase, FileText, Library, Mail, Plus, User, Wrench, X } from "lucide-react";

import { Logo, NavContent } from "@/components/app/app-shell";

const railLinks = [
  { href: "/my-cvs", label: "My CVs", icon: FileText },
  { href: "/my-cvs?view=letters", label: "Letters", icon: Mail },
  { href: "/my-cvs/samples", label: "Samples", icon: Library },
  { href: "/my-cvs/tracker", label: "Tracker", icon: Briefcase },
  { href: "/tools", label: "Tools", icon: Wrench },
] as const;

/** The editor's slim navy rail: the same places as the dashboard sidebar, as icons. */
export function AppRail({ onNavigate }: { onNavigate?: (event: React.MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  const item = "flex w-16 flex-col items-center gap-1 rounded-xl py-2.5 text-[11px] font-bold";
  return (
    <nav aria-label="WorkCV" className="editor-chrome fixed inset-y-0 left-0 z-40 hidden w-[76px] flex-col items-center gap-1.5 bg-navy py-4 text-white lg:flex">
      <Link href="/my-cvs" onClick={(event) => onNavigate?.(event, "/my-cvs")} aria-label="WorkCV: My CVs" className="mb-4 grid h-10 w-10 place-items-center rounded-[10px] bg-gold">
        <svg aria-hidden="true" viewBox="0 0 64 64" className="h-6 w-6">
          <path d="M12 16h9l6 28h-8L12 16Zm17 0h7l-5 28h-8l6-28Zm9 0h8l-3 28h-8l3-28Zm10 0h8l-7 28h-8l7-28Z" fill="#0F2942" />
        </svg>
      </Link>
      <Link href="/editor?new=1" onClick={(event) => onNavigate?.(event, "/editor?new=1")} className={`${item} mb-2 bg-gold text-navy hover:bg-[#e0b754]`}>
        <Plus className="h-[22px] w-[22px]" aria-hidden="true" />New CV
      </Link>
      {railLinks.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} onClick={(event) => onNavigate?.(event, href)} className={`${item} text-white/75 hover:bg-white/10 hover:text-white`}>
          <Icon className="h-[22px] w-[22px]" aria-hidden="true" />{label}
        </Link>
      ))}
      <span className="flex-1" />
      <Link href="/account" onClick={(event) => onNavigate?.(event, "/account")} className={`${item} text-white/75 hover:bg-white/10 hover:text-white`}>
        <User className="h-[22px] w-[22px]" aria-hidden="true" />Account
      </Link>
    </nav>
  );
}

/** Phone menu with the app's links, opened from the editor's top bar. */
export function AppMenuDrawer({ open, onClose, onLinkClick, children }: { open: boolean; onClose: () => void; onLinkClick?: (event: React.MouseEvent<HTMLElement>, href: string) => void; children?: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="editor-chrome fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <button type="button" aria-label="Close menu" onClick={onClose} className="absolute inset-0 bg-navy/40" />
      <div
        className="absolute inset-y-0 right-0 flex w-[min(320px,88vw)] flex-col overflow-y-auto bg-navy px-4 pb-6 pt-4 text-white"
        onClickCapture={(event) => {
          // Lets the editor save before any link in the menu leaves the page.
          const link = (event.target as HTMLElement).closest("a");
          const href = link?.getAttribute("href");
          if (href) onLinkClick?.(event, href);
        }}
      >
        <div className="mb-4 flex items-center justify-between px-3">
          <Logo />
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-lg border border-white/25">
            <X className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>
        {children}
        <Suspense fallback={null}>
          <NavContent onNavigate={onClose} />
        </Suspense>
      </div>
    </div>
  );
}
