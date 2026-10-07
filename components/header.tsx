import Link from "next/link";

import { HeaderAuth } from "@/components/header-auth";
import { HeaderMenu } from "@/components/header-menu";
import { routes } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 font-display text-2xl font-bold text-navy">
          <svg aria-hidden="true" viewBox="0 0 64 64" className="h-8 w-8 shrink-0">
            <rect width="64" height="64" rx="12" fill="#0F2942" />
            <path d="M12 16h9l6 28h-8L12 16Zm17 0h7l-5 28h-8l6-28Zm9 0h8l-3 28h-8l3-28Zm10 0h8l-7 28h-8l7-28Z" fill="#fff" />
            <rect x="12" y="50" width="40" height="4" rx="2" fill="#D4A843" />
          </svg>
          WorkCV
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 whitespace-nowrap text-[0.9375rem] font-medium text-muted lg:flex">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} className="hover:text-navy">
              {route.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <HeaderAuth />
          <Link
            href="/editor"
            className="hidden min-h-11 items-center whitespace-nowrap rounded-lg bg-navy px-[18px] text-[0.9375rem] font-bold text-white shadow-sm hover:bg-navy-hover md:inline-flex"
          >
            Build my CV
          </Link>
          <HeaderMenu />
        </div>
      </div>
    </header>
  );
}
