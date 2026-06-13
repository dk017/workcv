import Link from "next/link";

import { HeaderAuth } from "@/components/header-auth";
import { routes } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link href="/" className="font-display text-2xl font-semibold text-navy">
          WorkCV
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
          {routes.slice(1).map((route) => (
            <Link key={route.href} href={route.href} className="hover:text-navy">
              {route.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <HeaderAuth />
          <Link
            href="/templates"
            className="hidden rounded-md border border-line-strong px-4 py-2 text-sm font-bold text-navy hover:bg-white sm:inline-flex"
          >
            See example
          </Link>
          <Link
            href="/editor"
            className="rounded-md bg-navy px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-navy-hover"
          >
            Build my CV
          </Link>
        </div>
      </div>
    </header>
  );
}
