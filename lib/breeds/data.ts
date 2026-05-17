import breedsJson from "@/data/breeds.json";
import type { Breed } from "./types";

export const BREEDS: Breed[] = breedsJson as Breed[];

export function getBreedBySlug(slug: string): Breed | undefined {
  return BREEDS.find((b) => b.slug === slug);
}

export function allBreedSlugs(): string[] {
  return BREEDS.map((b) => b.slug);
}

/** Best Wikipedia URL for a breed: Hebrew if available, otherwise English. */
export function bestWikipediaUrl(breed: Breed): { url: string; lang: "he" | "en" } | null {
  if (breed.wikipediaHe) return { url: breed.wikipediaHe, lang: "he" };
  if (breed.wikipediaEn) return { url: breed.wikipediaEn, lang: "en" };
  return null;
}
