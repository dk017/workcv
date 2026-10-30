type MediaRange = { type: string; subtype: string; q: number };

export function parseAccept(header: string | null | undefined): MediaRange[] {
  if (!header) return [];
  return header.split(",").flatMap((part) => {
    const [range, ...params] = part.trim().toLowerCase().split(";");
    const [type, subtype] = range.trim().split("/");
    if (!type || !subtype) return [];
    const qParam = params.map((param) => param.trim()).find((param) => param.startsWith("q="));
    const q = qParam ? Number(qParam.slice(2)) : 1;
    return [{ type, subtype, q: Number.isFinite(q) ? Math.min(Math.max(q, 0), 1) : 0 }];
  });
}

// The most specific matching range sets the quality (RFC 9110 section 12.5.1).
function qualityFor(ranges: MediaRange[], type: string, subtype: string) {
  const exact = ranges.find((range) => range.type === type && range.subtype === subtype);
  if (exact) return exact.q;
  const typeWildcard = ranges.find((range) => range.type === type && range.subtype === "*");
  if (typeWildcard) return typeWildcard.q;
  return ranges.find((range) => range.type === "*" && range.subtype === "*")?.q ?? 0;
}

// Markdown only when the client ranks it strictly above HTML, so browsers, curl (*/*),
// link previews and requests without an Accept header always get the HTML page.
export function prefersMarkdown(header: string | null | undefined) {
  const ranges = parseAccept(header);
  const markdown = qualityFor(ranges, "text", "markdown");
  return markdown > 0 && markdown > qualityFor(ranges, "text", "html");
}
