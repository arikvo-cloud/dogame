import type { BreedSize } from "@/lib/breeds/types";
import type { Region } from "@/lib/shelters/types";

export type AgeGroup = "puppy" | "young" | "adult" | "senior";
export type DogSex = "male" | "female";
export type GoodWith = "kids" | "cats" | "dogs" | "small-pets";

export interface AdoptableDog {
  /** Stable URL slug: "{shelter}-{name-lat}-{n}" */
  id: string;
  /** Hebrew name */
  name: string;
  /** Age in years (decimal allowed for young dogs) */
  age: number;
  ageGroup: AgeGroup;
  sex: DogSex;
  neutered: boolean;
  size: BreedSize;
  /** Slug of a breed in lib/breeds/data.ts, if applicable */
  breedSlug?: string;
  /** Display string — "לברדור מעורב" or "תערובת" */
  breedDisplay: string;
  weightKg?: number;
  /** Image URL (Wikimedia or proxied) */
  imageUrl: string;
  shelterId: string;
  region: Region;
  /** 2-3 sentence Hebrew story */
  description: string;
  goodWith: GoodWith[];
  /** Optional Hebrew descriptors (energy level, special needs, etc.) */
  tags: string[];
  /** ISO date string */
  dateAvailable: string;
  /** External URL for express-interest CTA (shelter contact) */
  contactUrl: string;
  /** Always true in v1 */
  isExample: true;
}

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  puppy: "גור",
  young: "צעיר",
  adult: "בוגר",
  senior: "מבוגר",
};

export const SEX_LABELS: Record<DogSex, string> = {
  male: "זכר",
  female: "נקבה",
};

export const GOOD_WITH_LABELS: Record<GoodWith, string> = {
  kids: "ילדים",
  cats: "חתולים",
  dogs: "כלבים אחרים",
  "small-pets": "חיות קטנות",
};
