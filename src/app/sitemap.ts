import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { CLASS_DATA } from "@/lib/class-data";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "hourly", priority: 1.0 },
  { path: "/builds", changeFrequency: "daily", priority: 0.95 },
  { path: "/market", changeFrequency: "hourly", priority: 0.9 },
  { path: "/classes", changeFrequency: "weekly", priority: 0.9 },
  { path: "/armory", changeFrequency: "daily", priority: 0.85 },
  { path: "/maps", changeFrequency: "monthly", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE.url}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const classEntries: MetadataRoute.Sitemap = Object.keys(CLASS_DATA).map(
    (className) => ({
      url: `${SITE.url}/classes/${encodeURIComponent(className)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  return [...staticEntries, ...classEntries];
}
