import { ADOPTABLE_DOGS } from "./data";
import type { AdoptableDog, AgeGroup, GoodWith } from "./types";
import type { BreedSize } from "@/lib/breeds/types";
import type { Region } from "@/lib/shelters/types";

interface DogFilter {
  region?: Region;
  size?: BreedSize;
  ageGroup?: AgeGroup;
  breedSlug?: string;
  goodWith?: GoodWith;
  shelterId?: string;
  query?: string;
}

export function filterDogs(filter: DogFilter = {}): AdoptableDog[] {
  return ADOPTABLE_DOGS.filter((d) => {
    if (filter.region && d.region !== filter.region) return false;
    if (filter.size && d.size !== filter.size) return false;
    if (filter.ageGroup && d.ageGroup !== filter.ageGroup) return false;
    if (filter.breedSlug && d.breedSlug !== filter.breedSlug) return false;
    if (filter.goodWith && !d.goodWith.includes(filter.goodWith)) return false;
    if (filter.shelterId && d.shelterId !== filter.shelterId) return false;
    if (filter.query) {
      const q = filter.query.toLowerCase();
      const hay = (d.name + " " + d.breedDisplay + " " + d.description).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function dogsForBreed(breedSlug: string, limit?: number): AdoptableDog[] {
  const list = filterDogs({ breedSlug });
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

export function dogsInRegion(region: Region, limit: number): AdoptableDog[] {
  return filterDogs({ region }).slice(0, limit);
}

export function dogsOfTheWeek(limit: number): AdoptableDog[] {
  const seed = new Date().toISOString().slice(0, 10);
  const arr = [...ADOPTABLE_DOGS];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  for (let i = arr.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    const j = h % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, limit);
}
