"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Briefcase, FileText, LayoutGrid, LogOut, Mail, Menu, Plus, User, X } from "lucide-react";

import type { PassStatus } from "@/lib/pass-rules";
import { site } from "@/lib/site";

export const mainLinks = [
  { href: "/my-cvs", label: "My CVs", icon: LayoutGrid },
  { href: "/my-cvs?view=letters", label: "Cover letters", icon: Mail },
  { href: "/my-cvs/tracker", label: "Job tracker", icon: Briefcase },
] as const;

const helpLinks = [
  { href: "/tailor", label: "Tailor a CV to a job" },
  { href: "/tools", label: "Free tools and checkers" },
  { href: "/cv-examples-uk", label: "CV examples" },
] as const;

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-display text-[1.375rem] font-bold">
      <svg aria-hidden="true" viewBox="0 0 64 64" className="h-8 w-8 shrink-0">
        <rect width="64" height="64" rx="12" fill="#D4A843" />
        <path d="M12 16h9l6 28h-8L12 16Zm17 0h7l-5 28h-8l6-28Zm9 0h8l-3 28h-8l3-28Zm10 0h8l-7 28h-8l7-28Z" fill="#0F2942" />
      </svg>
      WorkCV
    </Link>
  );
}

function formatDay(value: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" }).format(new Date(value));
}

function PassCard({ pass }: { pass: PassStatus }) {
  if (pass.active && pass.expiresAt) {
    return (
      <div className="rounded-xl border border-white/15 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-gold">Job Search Pass</p>
        <p className="mt-1.5 font-bold">{pass.daysLeft} {pass.daysLeft === 1 ? "day" : "days"} left</p>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/15" aria-hidden="true">
          <div className="h-full rounded-full bg-gold" style={{ width: `${Math.min(100, (pass.daysLeft / site.passDays) * 100)}%` }} />
        </div>
        <p className="mt-2.5 text-[0.8125rem] leading-snug text-white/75">Every CV you create before {formatDay(pass.expiresAt)} is unlocked. It never renews.</p>
      </div>
    );
  }
  return (
    <Link href="/pricing" className="block rounded-xl border border-white/15 p-4 hover:bg-white/5">
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-gold">Applying for lots of jobs?</p>
      <p className="mt-1.5 text-[0.8125rem] leading-snug text-white/80">The Job Search Pass gives you unlimited CVs and cover letters for {site.passDays} days, for {site.passPrice} once.</p>
    </Link>
  );
}

/** The app's links, used by the sidebar, the editor rail's phone menu and the dashboard's phone menu. */
export function NavContent({ email, pass, onNavigate }: { email?: string; pass?: PassStatus | null; onNavigate?: () => void }) {
  const pathname = usePathname();
  const view = useSearchParams().get("view");
  const [loggingOut, setLoggingOut] = useState(false);
  const isActive = (href: string) => {
    if (href === "/my-cvs?view=letters") return pathname === "/my-cvs" && view === "letters";
    if (href === "/my-cvs") return pathname === "/my-cvs" && view !== "letters";
    return pathname === href;
  };
  const logout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.href = "/";
    }
  };
  const item = "flex min-h-11 items-center gap-3 rounded-lg px-3 text-[0.9375rem]";
  return (
    <div className="flex h-full flex-col gap-1.5">
      <Link href="/editor?new=1" onClick={onNavigate} className="mb-3 flex min-h-12 items-center justify-center gap-2 rounded-lg bg-gold font-bold text-navy hover:bg-[#e0b754]">
        <Plus className="h-[18px] w-[18px]" aria-hidden="true" />New CV
      </Link>
      <nav aria-label="Your account" className="flex flex-col gap-1">
        {mainLinks.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link key={href} href={href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={`${item} ${active ? "bg-white/10 font-bold text-white" : "font-medium text-white/80 hover:bg-white/5 hover:text-white"}`}>
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />{label}
            </Link>
          );
        })}
      </nav>
      <p className="mt-5 px-3 text-xs font-bold uppercase tracking-[0.1em] text-white/50">Help and tools</p>
      <nav aria-label="Help and tools" className="flex flex-col gap-1">
        {helpLinks.map(({ href, label }) => (
          <Link key={href} href={href} onClick={onNavigate} className={`${item} font-medium text-white/80 hover:bg-white/5 hover:text-white`}>
            <FileText className="h-[18px] w-[18px]" aria-hidden="true" />{label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-1 pt-5">
        {pass && <PassCard pass={pass} />}
        <Link href="/account" onClick={onNavigate} aria-current={pathname === "/account" ? "page" : undefined} className={`${item} mt-2 ${pathname === "/account" ? "bg-white/10 font-bold text-white" : "font-medium text-white/80 hover:bg-white/5 hover:text-white"}`}>
          <User className="h-[18px] w-[18px]" aria-hidden="true" />Account and orders
        </Link>
        <button type="button" onClick={logout} disabled={loggingOut} className={`${item} font-medium text-white/80 hover:bg-white/5 hover:text-white disabled:opacity-60`}>
          <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />{loggingOut ? "Logging out…" : "Log out"}
        </button>
        {email && <p className="truncate px-3 pt-1 text-xs text-white/50" title={email}>{email}</p>}
      </div>
    </div>
  );
}

/** Frame for signed-in pages: a navy sidebar on larger screens, a top bar and menu on phones. */
export function AppShell({ email, pass, children }: { email: string; pass: PassStatus; children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] overflow-y-auto bg-navy px-4 py-5 text-white lg:block">
        <div className="mb-5 px-3"><Logo /></div>
        <NavContent email={email} pass={pass} />
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 bg-navy px-4 text-white lg:hidden">
        <Logo />
        <div className="flex items-center gap-2">
          <Link href="/editor?new=1" className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-gold px-3 text-sm font-bold text-navy">
            <Plus className="h-4 w-4" aria-hidden="true" />New CV
          </Link>
          <button type="button" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen} aria-controls="app-menu" className="grid h-10 w-10 place-items-center rounded-lg border border-white/25">
            <Menu className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu" id="app-menu">
          <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-navy/40" />
          <div className="absolute inset-y-0 right-0 flex w-[min(320px,88vw)] flex-col overflow-y-auto bg-navy px-4 pb-6 pt-4 text-white">
            <div className="mb-4 flex items-center justify-between px-3">
              <Logo />
              <button type="button" onClick={() => setMenuOpen(false)} className="grid h-10 w-10 place-items-center rounded-lg border border-white/25">
                <X className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>
            <NavContent email={email} pass={pass} onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-[264px]">
        <main className="mx-auto max-w-[1180px] px-4 pb-16 pt-6 sm:px-8 lg:pt-10">{children}</main>
      </div>
    </div>
  );
}

