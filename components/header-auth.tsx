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

export function HeaderAuth() {
  const auth = useAuthMe();
  const [loading, setLoading] = useState(false);

  if (!auth?.email) {
    return (
      <Link href={buildLoginHref("/my-cvs")} className="hidden min-h-11 items-center whitespace-nowrap px-1 text-[0.9375rem] font-bold text-navy hover:underline lg:inline-flex">
        Sign in
      </Link>
    );
  }

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      authMeRequest = null;
      window.location.href = "/";
    }
  };

  return (
    <div className="flex items-center gap-2">
      {auth.analyticsAdmin && <a href="/admin/analytics" className="inline-flex min-h-10 items-center rounded-md bg-navy px-3 text-sm font-bold text-white">Analytics</a>}
      <Link
        href="/my-cvs"
        className="inline-flex min-h-10 items-center rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper"
      >
        My CVs
      </Link>
      <span className="hidden max-w-[210px] truncate rounded-md border border-line bg-white px-3 py-2 text-sm font-bold text-navy xl:inline-block">
        {auth.email}
      </span>
      <button
        type="button"
        onClick={logout}
        disabled={loading}
        className="hidden min-h-10 items-center rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper disabled:opacity-60 lg:inline-flex"
      >
        {loading ? "Logging out..." : "Log out"}
      </button>
    </div>
  );
}
