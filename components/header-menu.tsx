"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { useAuthMe } from "@/components/header-auth";
import { buildLoginHref } from "@/lib/safe-redirect";
import { routes } from "@/lib/site";

// Phone and tablet navigation. The desktop header shows the same links inline.
export function HeaderMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const signedIn = Boolean(useAuthMe()?.email);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="grid h-11 w-11 place-items-center rounded-lg border border-line bg-white text-navy"
      >
        {open ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
      </button>
      {open && (
        <nav id="site-menu" aria-label="Main" className="absolute inset-x-0 top-full border-b border-line bg-white shadow-soft">
          <ul className="container-page flex flex-col py-2">
            {routes.map((route) => (
              <li key={route.href}>
                <Link href={route.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-line font-bold text-navy">
                  {route.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={signedIn ? "/my-cvs" : buildLoginHref("/my-cvs")} onClick={() => setOpen(false)} className="flex min-h-12 items-center font-bold text-navy">
                {signedIn ? "My CVs" : "Sign in"}
              </Link>
            </li>
            <li className="pb-2 pt-1">
              <Link href="/editor" onClick={() => setOpen(false)} className="flex min-h-12 items-center justify-center rounded-lg bg-navy font-bold text-white">
                Build my CV
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
