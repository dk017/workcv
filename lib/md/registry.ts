import { htmlPageToMarkdown } from "./html-to-markdown.ts";
import { htmlUrl, markdownUrl, type MarkdownPage } from "./format.ts";
import { findPublicRoute, publicRoutes, routeLastModified, type PublicRoute } from "./public-routes.ts";

type Renderer = (route: PublicRoute) => Promise<MarkdownPage | null>;

// Every public route gets its markdown from its own server-rendered <main>, so the copy, prices
// and dates always match the HTML. Register a renderer here only for a page whose HTML does not
// convert well; llms.txt, llms-full.txt and the catalog pick it up automatically.
const renderers: Partial<Record<string, Renderer>> = {};

const cacheMs = 60 * 60 * 1000;
const cache = new Map<string, { expires: number; page: Promise<MarkdownPage | null> }>();

function internalOrigin() {
  return process.env.WORKCV_INTERNAL_ORIGIN || `http://127.0.0.1:${process.env.PORT || 3000}`;
}

async function renderFromHtml(route: PublicRoute): Promise<MarkdownPage | null> {
  const response = await fetch(`${internalOrigin()}${route.path}`, {
    headers: { Accept: "text/html" },
    redirect: "manual",
    next: { revalidate: 3600 },
  });
  if (response.status === 404) return null;
  if (response.status !== 200) throw new Error(`Rendering ${route.path} returned ${response.status}.`);

  const page = htmlPageToMarkdown(await response.text(), htmlUrl(route.path));
  if (!page) throw new Error(`${route.path} has no <main> element.`);
  return {
    path: route.path,
    title: page.title,
    label: page.headTitle || page.title,
    summary: page.description,
    canonical: page.canonical ?? htmlUrl(route.path),
    lastUpdated: routeLastModified(route),
    body: page.body,
  };
}

export function renderMarkdownPage(path: string): Promise<MarkdownPage | null> {
  const route = findPublicRoute(path);
  if (!route) return Promise.resolve(null);

  const cached = cache.get(path);
  if (cached && cached.expires > Date.now()) return cached.page;
  const page = (renderers[path] ?? renderFromHtml)(route);
  cache.set(path, { expires: Date.now() + cacheMs, page });
  page.catch(() => cache.delete(path));
  return page;
}

export async function renderMarkdownPages(paths: string[], concurrency = 6) {
  const pages: Array<MarkdownPage | null> = [];
  for (let index = 0; index < paths.length; index += concurrency) {
    pages.push(...await Promise.all(paths.slice(index, index + concurrency).map((path) => renderMarkdownPage(path).catch((error) => {
      console.warn(`[markdown] ${error instanceof Error ? error.message : error}`);
      return null;
    }))));
  }
  return pages;
}

export function listMarkdownRoutes() {
  return publicRoutes.map((route) => ({
    path: route.path,
    section: route.section,
    url: htmlUrl(route.path),
    markdownUrl: markdownUrl(route.path),
    priority: route.priority,
    lastModified: routeLastModified(route) ?? null,
  }));
}
