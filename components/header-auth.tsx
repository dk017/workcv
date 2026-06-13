"use client";

import { useEffect, useState } from "react";

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
    <div className="hidden items-center gap-2 lg:flex">
      <span className="max-w-[210px] truncate rounded-md border border-line bg-white px-3 py-2 text-sm font-bold text-navy">
        {userEmail}
      </span>
      <button
        type="button"
        onClick={logout}
        disabled={loading}
        className="inline-flex min-h-10 items-center rounded-md border border-line-strong bg-white px-4 text-sm font-bold text-navy hover:bg-paper disabled:opacity-60"
      >
        {loading ? "Logging out..." : "Log out"}
      </button>
    </div>
  );
}
