import { SHELTERS } from "./data";
import type { Region, Shelter } from "./types";

export function getSheltersByRegion(region: Region): Shelter[] {
  return SHELTERS.filter((s) => s.region === region);
}

export function allShelterSlugs(): string[] {
  return SHELTERS.map((s) => s.slug);
}
