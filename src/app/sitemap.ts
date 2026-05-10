import type { MetadataRoute } from "next";

import { categories } from "@/lib/domain";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["/", "/submit", "/login", "/privacy", "/terms"];
  const categoryRoutes = categories.map((category) => `/categories/${category.slug}`);

  return [...staticRoutes, ...categoryRoutes].map((path) => ({
    changeFrequency: path === "/" ? "daily" : "weekly",
    lastModified: now,
    priority: path === "/" ? 1 : 0.7,
    url: absoluteUrl(path)
  }));
}
