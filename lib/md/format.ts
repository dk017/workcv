import { site } from "../site.ts";

export type MarkdownPage = {
  path: string;
  title: string;
  // The page's <title>, shorter than its h1: used as link text in llms.txt.
  label: string;
  summary?: string;
  canonical: string;
  lastUpdated?: string;
  body: string;
};

export function markdownPath(path: string) {
  return path === "/" ? "/index.md" : `${path}.md`;
}

export function htmlUrl(path: string) {
  return path === "/" ? site.url : `${site.url}${path}`;
}

export function markdownUrl(path: string) {
  return `${site.url}${markdownPath(path)}`;
}

export function absoluteUrl(href: string, base = site.url) {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

export function escapeMarkdownText(text: string) {
  return text.replace(/([\\`*_[\]])/g, "\\$1");
}

export function markdownLink(text: string, url: string) {
  return `[${text}](${url.replace(/ /g, "%20").replace(/\(/g, "%28").replace(/\)/g, "%29")})`;
}

export function markdownTable(rows: string[][]) {
  if (!rows.length) return "";
  const width = Math.max(...rows.map((row) => row.length));
  const cell = (value = "") => value.replace(/\|/g, "\\|").replace(/\s*\n\s*/g, " ").trim();
  const line = (row: string[]) => `| ${Array.from({ length: width }, (_, index) => cell(row[index])).join(" | ")} |`;
  const [head, ...body] = rows;
  return [line(head), `| ${Array.from({ length: width }, () => "---").join(" | ")} |`, ...body.map(line)].join("\n");
}

export function markdownTokens(markdown: string) {
  return Math.ceil(markdown.length / 4);
}

export function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function markdownDocument(page: MarkdownPage) {
  return [
    `# ${page.title}`,
    page.summary ? `> ${page.summary}` : "",
    [`Canonical: ${page.canonical}`, page.lastUpdated ? `Last updated: ${page.lastUpdated}` : ""].filter(Boolean).join("\n"),
    page.body.trim(),
  ].filter(Boolean).join("\n\n") + "\n";
}

export function markdownNotFound(path: string) {
  return `# Page not found\n\nThere is no public page at ${htmlUrl(path)}.\n\nSee ${site.url}/llms.txt for the pages ${site.name} publishes.\n`;
}
