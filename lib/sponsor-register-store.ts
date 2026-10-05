import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { parseSponsorRegister, registerDateFromUrl, type SponsorRegister } from "@/lib/sponsor-register";

// Keeps the Home Office sponsor register in memory. The file is found through
// the GOV.UK Content API (its address changes with every update), refreshed
// every 12 hours, and cached on disk so a restart does not download it again.
// If GOV.UK is unavailable, the last good copy keeps serving.

const contentApi = "https://www.gov.uk/api/content/government/publications/register-of-licensed-sponsors-workers";
const refreshMs = 12 * 60 * 60 * 1_000;
const retryMs = 15 * 60 * 1_000;
const maxBytes = 40_000_000;
const cacheDir = path.join(os.tmpdir(), "workcv-sponsor-register");
const cacheFile = path.join(cacheDir, "register.csv");
const cacheMeta = path.join(cacheDir, "register.json");
// Loading briefly needs about 200 MB on top of the running app (measured with
// the October 2026 file), so it is skipped when the server is short of memory.
const minFreeMb = Number(process.env.SPONSOR_REGISTER_MIN_FREE_MB) || 600;

type Loaded = { register: SponsorRegister; loadedAt: number };

let current: Loaded | null = null;
let inFlight: Promise<Loaded> | null = null;
let lastFailureAt = 0;

const pause = () => new Promise<void>((resolve) => setImmediate(resolve));

async function fetchWithTimeout(url: string, timeoutMs: number) {
  const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs), headers: { "User-Agent": "WorkCV sponsor checker (https://workcv.co.uk)" } });
  if (!response.ok) throw new Error(`GOV.UK responded ${response.status} for ${url}`);
  return response;
}

async function latestCsvUrl() {
  const data = (await (await fetchWithTimeout(contentApi, 15_000)).json()) as {
    details?: { attachments?: Array<{ url?: string; content_type?: string }> };
  };
  const url = data.details?.attachments?.find((item) => item.content_type === "text/csv" && item.url)?.url;
  if (!url || !/^https:\/\/assets\.publishing\.service\.gov\.uk\//.test(url)) throw new Error("No register CSV found on GOV.UK");
  return url;
}

async function readDiskCache(): Promise<{ csv: string; registerDate: string | null; savedAt: number } | null> {
  try {
    const meta = JSON.parse(await readFile(cacheMeta, "utf8")) as { registerDate: string | null; savedAt: number };
    const { size } = await stat(cacheFile);
    if (size > maxBytes) return null;
    return { csv: await readFile(cacheFile, "utf8"), ...meta };
  } catch {
    return null;
  }
}

async function writeDiskCache(csv: string, registerDate: string | null) {
  try {
    await mkdir(cacheDir, { recursive: true });
    await writeFile(`${cacheFile}.tmp`, csv, "utf8");
    await rename(`${cacheFile}.tmp`, cacheFile);
    await writeFile(cacheMeta, JSON.stringify({ registerDate, savedAt: Date.now() }), "utf8");
  } catch {
    // The checker still works from memory; only the restart cache is lost.
  }
}

/** Memory available to this process: the container limit if one is set, otherwise the host's available memory. */
export function availableMemoryMb() {
  const available = typeof process.availableMemory === "function" ? process.availableMemory() : os.freemem();
  return Math.round(available / 1_048_576);
}

async function load(): Promise<Loaded> {
  const freeMb = availableMemoryMb();
  if (freeMb < minFreeMb) {
    console.warn(`[sponsor-register] skipped load: ${freeMb} MB available, needs ${minFreeMb} MB`);
    throw new Error("Not enough free memory to load the sponsor register");
  }
  // On first use after a restart, a recent disk copy avoids a 10 MB download.
  if (!current) {
    const cached = await readDiskCache();
    if (cached && Date.now() - cached.savedAt < refreshMs) {
      return { register: await parseSponsorRegister(cached.csv, cached.registerDate, pause), loadedAt: cached.savedAt };
    }
  }
  const url = await latestCsvUrl();
  const registerDate = registerDateFromUrl(url);
  if (current && registerDate && current.register.registerDate === registerDate) {
    return { register: current.register, loadedAt: Date.now() };
  }
  const response = await fetchWithTimeout(url, 60_000);
  const length = Number(response.headers.get("content-length") || "0");
  if (length > maxBytes) throw new Error("Sponsor register is unexpectedly large");
  const csv = await response.text();
  if (csv.length > maxBytes) throw new Error("Sponsor register is unexpectedly large");
  const register = await parseSponsorRegister(csv, registerDate, pause);
  if (register.names.length < 10_000) throw new Error("Sponsor register looks incomplete");
  await writeDiskCache(csv, registerDate);
  console.info(`[sponsor-register] loaded ${register.names.length} sponsors (register ${registerDate ?? "undated"}); rss ${Math.round(process.memoryUsage().rss / 1_048_576)} MB`);
  return { register, loadedAt: Date.now() };
}

function refresh() {
  inFlight ??= load()
    .then((loaded) => {
      current = loaded;
      return loaded;
    })
    .catch((error) => {
      lastFailureAt = Date.now();
      throw error;
    })
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}

/**
 * The register, refreshing in the background when it is over 12 hours old.
 * Only the very first request waits for a download; later ones get the
 * current copy immediately. Throws only when no copy has ever loaded.
 */
export async function getSponsorRegister(): Promise<{ register: SponsorRegister; loadedAt: number }> {
  if (!current) {
    if (Date.now() - lastFailureAt < 60_000 && !inFlight) throw new Error("Sponsor register temporarily unavailable");
    return refresh();
  }
  const stale = Date.now() - current.loadedAt > refreshMs;
  const recentlyFailed = Date.now() - lastFailureAt < retryMs;
  if (stale && !recentlyFailed) void refresh().catch(() => undefined);
  return current;
}
