import type { MetadataRoute } from "next";
import { BREEDS } from "@/lib/breeds/data";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dogame.pages.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/quiz/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/breeds/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/about/`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const breedRoutes: MetadataRoute.Sitemap = BREEDS.map((b) => ({
    url: `${BASE_URL}/breed/${b.slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...breedRoutes];
}
