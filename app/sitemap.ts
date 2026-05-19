import type { MetadataRoute } from "next";
import { BREEDS } from "@/lib/breeds/data";
import { ADOPTABLE_DOGS } from "@/lib/dogs/data";
import { SHELTERS } from "@/lib/shelters/data";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dogame.pages.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/quiz/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/breeds/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/adopt/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/shelters/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about-adoption/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about/`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const breedRoutes: MetadataRoute.Sitemap = BREEDS.map((b) => ({
    url: `${BASE_URL}/breed/${b.slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const dogRoutes: MetadataRoute.Sitemap = ADOPTABLE_DOGS.map((d) => ({
    url: `${BASE_URL}/dog/${d.id}/`,
    lastModified: new Date(d.dateAvailable),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const shelterRoutes: MetadataRoute.Sitemap = SHELTERS.map((s) => ({
    url: `${BASE_URL}/shelter/${s.slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...breedRoutes, ...dogRoutes, ...shelterRoutes];
}
