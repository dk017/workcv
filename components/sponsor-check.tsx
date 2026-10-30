"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { BadgeCheck, HelpCircle, Search, SearchX } from "lucide-react";

import { trackFunnelEvent } from "@/components/attribution-capture";
import type { SponsorSearchResult } from "@/lib/sponsor-register";

export type SponsorCheck = SponsorSearchResult & { query: string; registerDate: string | null };

export async function fetchSponsorCheck(name: string): Promise<SponsorCheck> {
  const response = await fetch(`/api/tools/sponsor-check?q=${encodeURIComponent(name.trim().slice(0, 160))}`);
  const data = (await response.json().catch(() => null)) as (SponsorCheck & { error?: string }) | null;
  if (!response.ok || !data || data.error) throw new Error(data?.error || "The sponsor check is unavailable right now.");
  return data;
}

export function formatRegisterDate(date: string | null) {
  if (!date) return "the latest register";
  const parsed = new Date(`${date}T12:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

const statusCopy = {
  listed: {
    icon: BadgeCheck,
    tone: "border-success/40 bg-greensoft text-navy",
    title: "An employer with this name holds a sponsor licence.",
    body: "Check the registered name below is the employer you mean. A licence shows the employer can sponsor workers; it does not mean this particular job can be sponsored.",
  },
  possible: {
    icon: HelpCircle,
    tone: "border-gold bg-gold-tint/50 text-navy",
    title: "No exact match, but these registered names are close.",
    body: "The register uses legal names, which can differ from the brand name in a job advert. Check which one, if any, is the employer.",
  },
  not_found: {
    icon: SearchX,
    tone: "border-line-strong bg-paper text-navy",
    title: "No employer with this name is on the register.",
    body: "Try the employer's legal name, often shown in the footer of its website or in the advert's small print. If it is still missing, the employer was not licensed to sponsor workers on the register date.",
  },
} as const;

const compactTitle = { listed: "Licensed sponsor", possible: "Possible sponsor match", not_found: "Not on the sponsor register" } as const;

/** Skilled Worker status first, as that is the route most applicants need. */
function routeSummary(routes: SponsorCheck["matches"][number]["routes"]) {
  const skilled = routes.find((route) => route.route === "Skilled Worker");
  const first = skilled ?? routes[0];
  if (!first) return "";
  const others = routes.length - 1;
  return `${first.route} (${first.rating || first.licence})${others > 0 ? ` +${others} more route${others === 1 ? "" : "s"}` : ""}`;
}

/** The verdict and matching register entries. Always names the matched entries, never just "yes". */
export function SponsorResult({ check, compact = false }: { check: SponsorCheck; compact?: boolean }) {
  const copy = statusCopy[check.status];
  const Icon = copy.icon;
  const detailsHref = `/tools/uk-visa-sponsor-checker?q=${encodeURIComponent(check.query)}`;

  if (compact) {
    const shown = check.matches.slice(0, 2);
    return (
      <div className={`rounded-md border p-2.5 text-xs leading-5 ${copy.tone}`} role="status">
        <p className="flex items-center gap-1.5 font-bold">
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          {compactTitle[check.status]}
        </p>
        {shown.map((match) => (
          <p key={`${match.name}-${match.locations[0] ?? ""}`} className="mt-1 break-words">
            <span className="font-bold text-navy">{match.name}</span>
            <span className="block text-muted">{routeSummary(match.routes)}</span>
          </p>
        ))}
        <Link href={detailsHref} className="mt-1 inline-block font-bold text-navy underline underline-offset-2">
          {check.total > shown.length ? `Details and ${check.total - shown.length} more` : "Details"}
        </Link>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border p-4 ${copy.tone}`} role="status">
      <p className="flex items-start gap-2 font-bold leading-6">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        {copy.title}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted">{copy.body}</p>
      {check.matches.length ? (
        <ul className="mt-3 space-y-3">
          {check.matches.map((match) => (
            <li key={`${match.name}-${match.locations[0] ?? ""}`} className="rounded-md bg-white p-3 text-sm leading-6">
              <p className="font-bold text-navy">
                {match.name}
                {match.match === "exact" ? <span className="ml-2 rounded bg-greensoft px-1.5 py-0.5 text-xs text-success">Name match</span> : null}
              </p>
              {match.locations.length ? (
                <p className="text-muted">
                  {match.locations.slice(0, 3).join(" · ")}
                  {match.locations.length > 3 ? ` and ${match.locations.length - 3} more` : ""}
                </p>
              ) : null}
              <p className="text-ink">
                {match.routes.map((route) => `${route.route} (${route.rating || route.licence})`).join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
      {check.total > check.matches.length ? (
        <p className="mt-2 text-xs text-muted">
          {check.total - check.matches.length} more similar name{check.total - check.matches.length === 1 ? "" : "s"}. Add more of the name to narrow the list.
        </p>
      ) : null}
      <p className="mt-3 text-xs leading-5 text-muted">Home Office register dated {formatRegisterDate(check.registerDate)}.</p>
    </div>
  );
}

/** Full search box for the sponsor checker tool page. */
export function SponsorChecker() {
  const [query, setQuery] = useState("");
  const [check, setCheck] = useState<SponsorCheck | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const startedRef = useRef(false);

  const search = async (event?: FormEvent, value = query) => {
    event?.preventDefault();
    if (value.trim().length < 2) {
      setError("Enter at least two characters of the employer's name.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await fetchSponsorCheck(value);
      setCheck(result);
      trackFunnelEvent("tool_completed", { tool: "uk_visa_sponsor_checker", result: "success" });
    } catch (caught) {
      setCheck(null);
      setError(caught instanceof Error ? caught.message : "The sponsor check is unavailable right now.");
    } finally {
      setLoading(false);
    }
  };

  // "?q=Employer" (from a tracker card or the Chrome extension) searches straight away.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const initial = new URLSearchParams(window.location.search).get("q")?.trim().slice(0, 160) || "";
    if (initial.length < 2) return;
    setQuery(initial);
    void search(undefined, initial);
  }, []);

  return (
    <div>
      <form onSubmit={(event) => search(event)} className="flex flex-col gap-3 sm:flex-row" role="search">
        <label className="sr-only" htmlFor="sponsor-query">Employer name</label>
        <input
          id="sponsor-query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          maxLength={160}
          placeholder="Employer name, e.g. Deloitte"
          className="min-h-12 flex-1 rounded-md border border-line-strong bg-white px-4 text-[16px] text-ink outline-none focus:border-navy focus:ring-2 focus:ring-navy/15"
        />
        <button type="submit" disabled={loading} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-navy px-5 text-sm font-bold text-white hover:bg-navy-hover disabled:cursor-wait disabled:opacity-60">
          <Search className="h-4 w-4" aria-hidden="true" />
          {loading ? "Checking..." : "Check the register"}
        </button>
      </form>
      {error ? <p className="mt-3 text-sm font-bold text-[#8d3030]" role="alert">{error}</p> : null}
      {check ? (
        <div className="mt-5 space-y-4">
          <SponsorResult check={check} />
          {check.status !== "not_found" ? (
            <p className="text-sm leading-6 text-muted">
              Applying to this employer?{" "}
              <Link href="/tailor" className="font-bold text-navy underline underline-offset-4">Tailor your CV for the job</Link>{" "}
              so it matches the advert.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/** On-demand check for one employer, e.g. on a job tracker card. Sends only the employer name. */
export function SponsorCheckButton({ employer }: { employer: string }) {
  const [check, setCheck] = useState<SponsorCheck | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (check) return <div className="mt-2"><SponsorResult check={check} compact /></div>;
  return (
    <div className="mt-2">
      <button
        type="button"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          setError("");
          try {
            setCheck(await fetchSponsorCheck(employer));
            trackFunnelEvent("tool_completed", { tool: "tracker_sponsor_check", result: "success" });
          } catch (caught) {
            setError(caught instanceof Error ? caught.message : "The sponsor check is unavailable right now.");
          } finally {
            setLoading(false);
          }
        }}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-navy underline underline-offset-4 disabled:cursor-wait disabled:opacity-60"
      >
        <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
        {loading ? "Checking the register..." : "Check sponsor licence"}
      </button>
      {error ? <p className="mt-1 text-xs font-bold text-[#8d3030]">{error}</p> : null}
    </div>
  );
}
