"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function HeaderAuth() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { user?: { email?: string } } | null) => {
        if (!cancelled) setUserEmail(data?.user?.email || null);
      })
      .catch(() => {
        if (!cancelled) setUserEmail(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!userEmail) {
    return null;
  }

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.href = "/";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/my-cvs"
        className="inline-flex min-h-10 items-center rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper"
      >
        My CVs
      </Link>
      <span className="hidden max-w-[210px] truncate rounded-md border border-line bg-white px-3 py-2 text-sm font-bold text-navy xl:inline-block">
        {userEmail}
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
