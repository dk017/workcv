"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { buildLoginHref } from "@/lib/safe-redirect";

type AuthMe = { email: string | null; analyticsAdmin: boolean };

// One /api/auth/me request per page load, shared by the header and the phone menu.
let authMeRequest: Promise<AuthMe> | null = null;

function loadAuthMe() {
  authMeRequest ??= fetch("/api/auth/me")
    .then((response) => (response.ok ? response.json() : null))
    .then((data: { user?: { email?: string }; analyticsAdmin?: boolean } | null) => ({
      email: data?.user?.email || null,
      analyticsAdmin: data?.analyticsAdmin === true,
    }))
    .catch(() => ({ email: null, analyticsAdmin: false }));
  return authMeRequest;
}

export function useAuthMe() {
  const [auth, setAuth] = useState<AuthMe | null>(null);
  useEffect(() => {
    let cancelled = false;
    loadAuthMe().then((value) => {
      if (!cancelled) setAuth(value);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return auth;
}

const primaryButton = "hidden min-h-11 items-center whitespace-nowrap rounded-lg bg-navy px-[18px] text-[0.9375rem] font-bold text-white shadow-sm hover:bg-navy-hover md:inline-flex";

// Signed out: Sign in and Build my CV. Signed in: one way back to the app (email and
// Log out live in the app's own menu), plus Analytics for admins.
export function HeaderAuth() {
  const auth = useAuthMe();

  if (!auth?.email) {
    return (
      <>
        <Link href={buildLoginHref("/my-cvs")} className="hidden min-h-11 items-center whitespace-nowrap px-1 text-[0.9375rem] font-bold text-navy hover:underline lg:inline-flex">
          Sign in
        </Link>
        <Link href="/editor" className={primaryButton}>
          Build my CV
        </Link>
      </>
    );
  }

  return (
    <>
      {auth.analyticsAdmin && <a href="/admin/analytics" className="hidden min-h-11 items-center px-1 text-[0.9375rem] font-bold text-navy hover:underline lg:inline-flex">Analytics</a>}
      <Link href="/my-cvs" className={primaryButton}>
        My CVs
      </Link>
    </>
  );
}
