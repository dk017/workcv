import { absoluteUrl, escapeMarkdownText, markdownLink, markdownTable } from "./format.ts";

// A small converter for the HTML our own pages render. It reads the page's <main> element,
// so the markdown version carries the same copy as the HTML without a second copy to maintain.

type Element = { tag: string; attrs: Record<string, string>; children: Node[] };
type Node = Element | string;

const voidTags = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const rawTextTags = new Set(["script", "style", "textarea", "title"]);
// Interactive or decorative parts: forms, controls and media say nothing useful in markdown.
const skippedTags = new Set([
  "script", "style", "noscript", "template", "svg", "form", "button", "input", "select", "textarea", "label",
  "output", "progress", "meter", "nav", "dialog", "iframe", "img", "picture", "video", "audio", "canvas", "object",
]);
const blockTags = new Set([
  "address", "article", "aside", "blockquote", "details", "dd", "div", "dl", "dt", "fieldset", "figcaption",
  "figure", "footer", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "li", "main", "ol", "p",
  "pre", "section", "summary", "table", "ul",
]);

const namedEntities: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: "\"", apos: "'", nbsp: " ", pound: "£", euro: "€", copy: "©", reg: "®",
  hellip: "…", mdash: "—", ndash: "–", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", middot: "·", rarr: "→",
  larr: "←", times: "×", check: "✓", bull: "•",
};

export function decodeEntities(text: string) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, name: string) => {
    if (name[0] === "#") {
      const code = name[1] === "x" || name[1] === "X" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : entity;
    }
    return namedEntities[name.toLowerCase()] ?? entity;
  });
}

function parseAttributes(raw: string) {
  const attrs: Record<string, string> = {};
  const pattern = /([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(raw))) {
    attrs[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? "");
  }
  return attrs;
}

export function parseHtml(html: string): Element {
  const root: Element = { tag: "#root", attrs: {}, children: [] };
  const stack = [root];
  const lower = html.toLowerCase();
  const tagPattern = /<!--[\s\S]*?-->|<![^>]*>|<\/([a-zA-Z][\w:-]*)\s*>|<([a-zA-Z][\w:-]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>/g;
  let last = 0;
  let match: RegExpExecArray | null;

  const appendText = (text: string) => {
    if (text) stack[stack.length - 1].children.push(text);
  };

  while ((match = tagPattern.exec(html))) {
    appendText(html.slice(last, match.index));
    last = tagPattern.lastIndex;
    const [, closing, opening, rawAttrs, selfClosing] = match;

    if (closing) {
      const tag = closing.toLowerCase();
      // Ignore stray closing tags rather than unwinding the whole tree.
      for (let index = stack.length - 1; index > 0; index--) {
        if (stack[index].tag === tag) {
          stack.length = index;
          break;
        }
      }
      continue;
    }
    if (!opening) continue;

    const tag = opening.toLowerCase();
    const element: Element = { tag, attrs: parseAttributes(rawAttrs ?? ""), children: [] };
    stack[stack.length - 1].children.push(element);

    if (rawTextTags.has(tag)) {
      const end = lower.indexOf(`</${tag}`, last);
      const stop = end === -1 ? html.length : end;
      element.children.push(html.slice(last, stop));
      const closeEnd = html.indexOf(">", stop);
      last = tagPattern.lastIndex = closeEnd === -1 ? html.length : closeEnd + 1;
      continue;
    }
    if (!voidTags.has(tag) && !selfClosing) stack.push(element);
  }
  appendText(html.slice(last));
  return root;
}

function findElement(node: Node, predicate: (element: Element) => boolean): Element | undefined {
  if (typeof node === "string") return undefined;
  if (predicate(node)) return node;
  for (const child of node.children) {
    const found = findElement(child, predicate);
    if (found) return found;
  }
  return undefined;
}

function textContent(node: Node): string {
  if (typeof node === "string") return decodeEntities(node);
  if (node.tag === "br") return "\n";
  if (isSkipped(node)) return "";
  return node.children.map(textContent).join("");
}

function plainText(node: Node) {
  return textContent(node).replace(/\s+/g, " ").trim();
}

function isSkipped(element: Element) {
  const classes = (element.attrs.class ?? "").split(/\s+/);
  // Responsive Tailwind layouts often render the same content twice. Keep the desktop version
  // (`hidden md:block`, usually a real table) and drop the mobile-only copy (`md:hidden`).
  const shownAtBreakpoint = classes.some((name) => /^(sm|md|lg|xl|2xl):(block|flex|grid|inline|inline-block|inline-flex|table|contents)$/.test(name));
  const mobileOnly = classes.some((name) => /^(sm|md|lg|xl|2xl):hidden$/.test(name));
  return (
    skippedTags.has(element.tag) ||
    "hidden" in element.attrs ||
    element.attrs["aria-hidden"] === "true" ||
    "data-md-skip" in element.attrs ||
    (classes.includes("hidden") && !shownAtBreakpoint) ||
    mobileOnly
  );
}

const blockish = new WeakMap<Element, boolean>();
function isBlockish(node: Node): boolean {
  if (typeof node === "string") return false;
  const known = blockish.get(node);
  if (known !== undefined) return known;
  const result = blockTags.has(node.tag) || node.children.some(isBlockish);
  blockish.set(node, result);
  return result;
}

type Context = { baseUrl: string };

function linkTarget(element: Element, context: Context) {
  const href = element.attrs.href?.trim();
  if (!href || href === "#" || /^javascript:/i.test(href)) return null;
  return absoluteUrl(href, context.baseUrl);
}

function wrapInline(inner: string, marker: string) {
  const match = inner.match(/^(\s*)([\s\S]*?)(\s*)$/)!;
  return match[2] ? `${match[1]}${marker}${match[2]}${marker}${match[3]}` : inner;
}

const formattingTags = new Set(["strong", "b", "em", "i", "cite", "code", "kbd", "a"]);

function renderInlineElement(node: Element, context: Context): string {
  const inner = () => renderInline(node.children, context);
  switch (node.tag) {
    case "br": return "\n";
    case "strong": case "b": return wrapInline(inner(), "**");
    case "em": case "i": case "cite": return wrapInline(inner(), "*");
    case "code": case "kbd": return wrapInline(plainText(node), "`");
    case "a": {
      const text = inner().replace(/\s+/g, " ").trim();
      const url = linkTarget(node, context);
      if (!text) return "";
      return url ? markdownLink(text, url) : text;
    }
    default: return inner();
  }
}

function renderInline(nodes: Node[], context: Context): string {
  let previousTag: string | null = null;
  return nodes.map((node) => {
    if (typeof node === "string") {
      previousTag = null;
      return escapeMarkdownText(decodeEntities(node).replace(/\s+/g, " "));
    }
    if (isSkipped(node)) return "";
    const text = renderInlineElement(node, context);
    if (!text.trim()) return text;
    // Labels and values laid out with flex or grid sit side by side with no space in the HTML.
    // Only plain formatting (bold next to a link, say) really runs together on the page.
    const separated = previousTag !== null && node.tag !== "br" && previousTag !== "br" &&
      !(formattingTags.has(previousTag) && formattingTags.has(node.tag));
    previousTag = node.tag;
    return separated ? ` · ${text}` : text;
  }).join("");
}

function cleanParagraph(text: string) {
  const clean = text.replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n").replace(/ ([,.;:!?)])(?=\s|$)/g, "$1")
    .replace(/(\]\([^)\s]*\))(?=\[)/g, "$1 ").trim();
  // A paragraph that starts like markdown syntax would be read as a heading, quote or list.
  return clean.replace(/^(#{1,6} |> |[-+] )/, "\\$1").replace(/^(\d+)\. /, "$1\\. ");
}

function prefixLines(text: string, first: string, rest: string) {
  return text.split("\n").map((line, index) => (index === 0 ? first : line ? rest : "") + line).join("\n");
}

function renderList(element: Element, context: Context) {
  const ordered = element.tag === "ol";
  let number = Number(element.attrs.start) || 1;
  return element.children
    .filter((child): child is Element => typeof child !== "string" && child.tag === "li" && !isSkipped(child))
    .map((item) => {
      const marker = ordered ? `${number++}. ` : "- ";
      let content = renderBlocks(item.children, context)
        .map((block) => block.replace(/^#{1,6} (.*)$/, "**$1**"))
        .join("\n")
        .replace(/^[·•]\s*/, "");
      // Steps that print their own number ("1. Start") would read "1. 1. Start".
      if (ordered) content = content.replace(new RegExp(`^(\\*\\*)?\\\\?${number - 1}\\. `), "$1");
      return content ? prefixLines(content, marker, " ".repeat(marker.length)) : "";
    })
    .filter(Boolean)
    .join("\n");
}

function renderTable(element: Element, context: Context) {
  const rows: string[][] = [];
  const collect = (node: Node) => {
    if (typeof node === "string" || isSkipped(node)) return;
    if (node.tag === "tr") {
      rows.push(node.children
        .filter((cell): cell is Element => typeof cell !== "string" && (cell.tag === "th" || cell.tag === "td"))
        .map((cell) => cleanParagraph(renderBlocks(cell.children, context).join(" "))));
      return;
    }
    node.children.forEach(collect);
  };
  collect(element);
  const caption = findElement(element, (child) => child.tag === "caption");
  const table = markdownTable(rows.filter((row) => row.some(Boolean)));
  return caption ? `**${plainText(caption)}**\n\n${table}` : table;
}

// A card-style link wraps a heading and a description: list it as "- [Title](url) - description".
function renderBlockLink(element: Element, context: Context) {
  const blocks = renderBlocks(element.children, context);
  const url = linkTarget(element, context);
  if (!blocks.length) return [];
  const [first, ...rest] = blocks.map((block) => block.replace(/^#+ /, "").replace(/\s*\n\s*/g, " "));
  if (!url) return blocks;
  const description = rest.join(" ").trim();
  return [`- ${markdownLink(first.replace(/^\\/, ""), url)}${description ? ` - ${description}` : ""}`];
}

function renderBlock(element: Element, context: Context): string[] {
  switch (element.tag) {
    case "h1": case "h2": case "h3": case "h4": case "h5": case "h6": {
      const text = cleanParagraph(renderInline(element.children, context).replace(/\n/g, " "));
      return text ? [`${"#".repeat(Number(element.tag[1]))} ${text.replace(/^\\/, "")}`] : [];
    }
    case "ul": case "ol": {
      const list = renderList(element, context);
      return list ? [list] : [];
    }
    case "table": {
      const table = renderTable(element, context);
      return table ? [table] : [];
    }
    case "pre": {
      const code = textContent(element).replace(/\n+$/, "");
      return code.trim() ? ["```\n" + code + "\n```"] : [];
    }
    case "blockquote": {
      const quote = renderBlocks(element.children, context).join("\n\n");
      return quote ? [prefixLines(quote, "> ", "> ").replace(/^$/gm, ">")] : [];
    }
    case "hr": return ["---"];
    case "details": {
      const summary = element.children.find((child): child is Element => typeof child !== "string" && child.tag === "summary");
      const rest = element.children.filter((child) => child !== summary);
      const question = summary ? plainText(summary) : "";
      return [...(question ? [`### ${question}`] : []), ...renderBlocks(rest, context)];
    }
    case "dt": {
      const term = cleanParagraph(renderInline(element.children, context));
      return term ? [`**${term}**`] : [];
    }
    case "a": return renderBlockLink(element, context);
    default: {
      // Sample CV text keeps its line breaks on the page, so keep them here too.
      if (/(^|\s)whitespace-pre(-wrap|-line)?(\s|$)/.test(element.attrs.class ?? "")) {
        const text = textContent(element).trim();
        return text ? ["```text\n" + text + "\n```"] : [];
      }
      return renderBlocks(element.children, context);
    }
  }
}

export function renderBlocks(nodes: Node[], context: Context): string[] {
  const blocks: string[] = [];
  let inline: Node[] = [];
  const flush = () => {
    const content = inline.filter((node) => typeof node !== "string" || node.trim());
    const links = content.filter((node): node is Element => typeof node !== "string" && node.tag === "a" && Boolean(linkTarget(node, context)));
    if (links.length > 1 && links.length === content.length) {
      // A row of sibling links (button groups, "related" rows) reads best as a list.
      blocks.push(...links.map((link) => cleanParagraph(renderInline([link], context))).filter(Boolean).map((link) => `- ${link}`));
    } else {
      const paragraph = cleanParagraph(renderInline(inline, context));
      if (paragraph) blocks.push(paragraph);
    }
    inline = [];
  };

  for (const node of nodes) {
    if (typeof node !== "string" && isSkipped(node)) continue;
    if (isBlockish(node)) {
      flush();
      blocks.push(...renderBlock(node as Element, context));
    } else {
      inline.push(node);
    }
  }
  flush();
  return blocks;
}

function joinBlocks(blocks: string[]) {
  const kept = blocks.filter((block, index) => block !== blocks[index - 1]);
  // Consecutive one-line list items (for example from card links) form one tight list.
  return kept.reduce((markdown, block, index) => {
    if (!index) return block;
    const previous = kept[index - 1];
    const tight = /^- /.test(block) && !block.includes("\n") && /^- /.test(previous) && !previous.includes("\n");
    return `${markdown}${tight ? "\n" : "\n\n"}${block}`;
  }, "");
}

export type HtmlPage = { title: string; headTitle?: string; description?: string; canonical?: string; body: string };

export function htmlPageToMarkdown(html: string, baseUrl: string): HtmlPage | null {
  const document = parseHtml(html);
  const main = findElement(document, (element) => element.tag === "main");
  if (!main) return null;

  const heading = findElement(main, (element) => element.tag === "h1" && !isSkipped(element));
  const titleElement = findElement(document, (element) => element.tag === "title");
  const description = findElement(document, (element) => element.tag === "meta" && element.attrs.name === "description");
  const canonical = findElement(document, (element) => element.tag === "link" && element.attrs.rel === "canonical");
  const headTitle = titleElement ? plainText(titleElement).replace(/\s*[|–-]\s*WorkCV$/, "") : undefined;
  const title = (heading && plainText(heading)) || headTitle || "";

  // The h1 becomes the document title, so drop it from the body.
  if (heading) heading.attrs["data-md-skip"] = "";

  return {
    title,
    headTitle,
    description: description?.attrs.content?.trim() || undefined,
    canonical: canonical?.attrs.href,
    body: joinBlocks(renderBlocks(main.children, { baseUrl })).replace(/\n{3,}/g, "\n\n"),
  };
}
