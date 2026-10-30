import type { MetadataRoute } from "next";

import { site } from "@/lib/site";
import { publicRoutes, routeLastModified } from "@/lib/md/public-routes";

// Markdown versions (/<path>.md) stay out of the sitemap: they are noindex alternates of these pages.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-06-13");

  return publicRoutes.map((route) => {
    const modified = routeLastModified(route);
    return {
      url: `${site.url}${route.path}`,
      lastModified: modified ? new Date(modified) : lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    };
  });
}
