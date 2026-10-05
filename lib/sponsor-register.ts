// Home Office register of licensed sponsors (workers): parsing and name search.
// Pure functions, so matching rules are tested without network access.
// The register lists organisation, town, county, licence type with rating and
// route. It does not say which jobs an employer sponsors or how many people.
//
// About 140,000 rows are held in memory for the life of the server, so the
// index is kept compact: one search string for all names, and each employer's
// details packed into a single string that is only unpacked for results.

export type SponsorRoute = { route: string; licence: string; rating: string };

export type SponsorMatch = {
  name: string;
  locations: string[];
  routes: SponsorRoute[];
  match: "exact" | "close";
};

export type SponsorSearchResult = {
  status: "listed" | "possible" | "not_found";
  matches: SponsorMatch[];
  total: number;
};

export type SponsorRegister = {
  names: string[];
  /** Packed locations and routes, one per name (see unpackDetails). */
  details: string[];
  /** Every employer's match keys, each written as "| key |", one employer after another. */
  haystack: string;
  /** Start of each employer's section in the haystack. */
  starts: Int32Array;
  registerDate: string | null;
  rowCount: number;
};

const expectedHeader = ["organisation name", "town/city", "county", "type & rating", "route"];
const FIELD = "\u001f";
const ITEM = "\u001e";
const PART = "\u001d";

// Legal-form words that do not distinguish one employer from another. Words
// such as "services" or "group" are kept, so "Acme" is not an exact match for
// "Acme Services Ltd".
const legalSuffixes = new Set(["limited", "ltd", "llp", "lp", "plc", "llc", "inc", "incorporated", "co", "corporation", "corp", "uk", "gb", "the", "cic", "cio"]);

const tidy = (value: string) => value.replace(/\s+/g, " ").trim();

/** Lower case, "&" as "and", accents and punctuation removed, single spaces. */
export function normaliseName(value: string) {
  return value
    .toLocaleLowerCase("en-GB")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** The distinctive part of a name: legal suffixes removed from the end and "the" from the start. */
export function coreName(value: string) {
  const words = normaliseName(value).split(" ").filter(Boolean);
  while (words.length > 1 && legalSuffixes.has(words[words.length - 1])) words.pop();
  while (words.length > 1 && words[0] === "the") words.shift();
  return words.join(" ");
}

/** Legal name plus any trading names after "T/A" or "trading as". */
function nameKeys(name: string) {
  const parts = name.split(/\s+(?:t\/a|t\/as|trading as)\s+/i).map(tidy).filter(Boolean);
  return Array.from(new Set(parts.map(coreName).filter(Boolean)));
}

/** Splits one CSV line, honouring double-quoted fields. Register fields never contain line breaks. */
export function splitCsvLine(line: string) {
  if (!line.includes('"')) return line.split(",");
  const cells: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (quoted) {
      if (char === '"' && line[index + 1] === '"') { cell += '"'; index += 1; }
      else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") { cells.push(cell); cell = ""; }
    else cell += char;
  }
  cells.push(cell);
  return cells;
}

function parseTypeAndRating(value: string) {
  const match = /^(.*?)\s*\((.*)\)\s*$/.exec(tidy(value));
  return match ? { licence: tidy(match[1]), rating: tidy(match[2]) } : { licence: tidy(value), rating: "" };
}

function unpackDetails(packed: string) {
  const [locations = "", routes = ""] = packed.split(FIELD);
  return {
    locations: locations ? locations.split(ITEM) : [],
    routes: routes
      ? routes.split(ITEM).map((item) => {
          const [route = "", licence = "", rating = ""] = item.split(PART);
          return { route, licence, rating };
        })
      : [],
  };
}

/**
 * Groups register rows by organisation name. Throws if the columns change, so
 * a new file format never silently empties the checker. `pause` lets the
 * caller yield between chunks so a server keeps answering requests.
 */
export async function parseSponsorRegister(
  csv: string,
  registerDate: string | null = null,
  pause: () => Promise<void> = async () => {},
): Promise<SponsorRegister> {
  // Walks the file line by line and writes straight into the compact arrays,
  // so a load does not build a temporary object for every employer.
  const text = csv.charCodeAt(0) === 0xfeff ? csv.slice(1) : csv;
  let cursor = 0;
  const nextLine = () => {
    if (cursor >= text.length) return null;
    const end = text.indexOf("\n", cursor);
    const line = text.slice(cursor, end === -1 ? text.length : end);
    cursor = end === -1 ? text.length : end + 1;
    return line.endsWith("\r") ? line.slice(0, -1) : line;
  };

  const header = splitCsvLine(nextLine() ?? "").map((cell) => tidy(cell).toLocaleLowerCase("en-GB"));
  if (expectedHeader.some((column, index) => header[index] !== column)) {
    throw new Error(`Unexpected sponsor register columns: ${header.join(", ")}`);
  }

  const indexByKey = new Map<string, number>();
  const names: string[] = [];
  const locations: string[] = [];
  const routes: string[] = [];
  let rowCount = 0;
  for (let line = nextLine(); line !== null; line = nextLine()) {
    if (rowCount % 10_000 === 0) await pause();
    if (!line.trim()) continue;
    const [rawName = "", town = "", county = "", typeAndRating = "", route = ""] = splitCsvLine(line);
    const name = tidy(rawName);
    if (!name) continue;
    rowCount += 1;
    const key = normaliseName(name);
    let entry = indexByKey.get(key);
    if (entry === undefined) {
      entry = names.length;
      indexByKey.set(key, entry);
      names.push(name);
      locations.push("");
      routes.push("");
    }
    const place = [tidy(town).replace(/,\s*$/, ""), tidy(county)].filter(Boolean).join(", ");
    if (place && !locations[entry].split(ITEM).includes(place)) locations[entry] = locations[entry] ? locations[entry] + ITEM + place : place;
    const routeName = tidy(route);
    if (routeName) {
      const { licence, rating } = parseTypeAndRating(typeAndRating);
      const packed = [routeName, licence, rating].join(PART);
      if (!routes[entry].split(ITEM).includes(packed)) routes[entry] = routes[entry] ? routes[entry] + ITEM + packed : packed;
    }
  }
  indexByKey.clear();

  const details: string[] = new Array(names.length);
  const sections: string[] = new Array(names.length);
  const starts = new Int32Array(names.length);
  let offset = 0;
  for (let entry = 0; entry < names.length; entry += 1) {
    if (entry % 10_000 === 0) await pause();
    const section = nameKeys(names[entry]).map((key) => `| ${key} |`).join("") + "\n";
    starts[entry] = offset;
    offset += section.length;
    sections[entry] = section;
    details[entry] = locations[entry] + FIELD + routes[entry];
  }
  return { names, details, haystack: sections.join(""), starts, registerDate, rowCount };
}

function entryAt(register: SponsorRegister, position: number) {
  let low = 0;
  let high = register.starts.length - 1;
  while (low < high) {
    const mid = (low + high + 1) >> 1;
    if (register.starts[mid] <= position) low = mid;
    else high = mid - 1;
  }
  return low;
}

function sectionOf(register: SponsorRegister, entry: number) {
  const end = entry + 1 < register.starts.length ? register.starts[entry + 1] : register.haystack.length;
  return register.haystack.slice(register.starts[entry], end);
}

/** Employers whose section contains `pattern`, in register order. */
function entriesContaining(register: SponsorRegister, pattern: string) {
  const found = new Set<number>();
  for (let at = register.haystack.indexOf(pattern); at !== -1; at = register.haystack.indexOf(pattern, at + 1)) {
    found.add(entryAt(register, at));
  }
  return found;
}

/**
 * Finds employers by name. An exact match on the distinctive part of the name
 * ("Deloitte" finds "Deloitte LLP") is "listed"; names that start with or
 * contain every word of the query are "possible", because the register uses
 * legal names and adverts often use brand names.
 */
export function searchSponsors(register: SponsorRegister, query: string, limit = 10): SponsorSearchResult {
  const target = coreName(query.slice(0, 160));
  if (target.length < 2) return { status: "not_found", matches: [], total: 0 };
  const words = target.split(" ");
  const exact = entriesContaining(register, `| ${target} |`);
  const prefix = Array.from(entriesContaining(register, `| ${target} `)).filter((entry) => !exact.has(entry));
  const seen = new Set(Array.from(exact).concat(prefix));
  const rarest = [...words].sort((a, b) => b.length - a.length)[0];
  const contains = Array.from(entriesContaining(register, ` ${rarest} `)).filter((entry) => {
    if (seen.has(entry)) return false;
    const section = sectionOf(register, entry);
    return section.split("|").some((key) => words.every((word) => key.includes(` ${word} `)));
  });
  const byLength = (a: number, b: number) => register.names[a].length - register.names[b].length || register.names[a].localeCompare(register.names[b]);
  const ordered = Array.from(exact).sort(byLength).concat(prefix.sort(byLength), contains.sort(byLength));
  return {
    status: exact.size ? "listed" : ordered.length ? "possible" : "not_found",
    matches: ordered.slice(0, limit).map((entry) => ({
      name: register.names[entry],
      ...unpackDetails(register.details[entry]),
      match: exact.has(entry) ? "exact" : "close",
    })),
    total: ordered.length,
  };
}

/** The register's file name carries its date, e.g. "..._Register_-_2026-10-02.csv". */
export function registerDateFromUrl(url: string) {
  return /(\d{4}-\d{2}-\d{2})\.csv$/i.exec(url)?.[1] ?? null;
}
