import type { TraitVector } from "@/lib/traits";

export type BreedSize = "toy" | "small" | "medium" | "large" | "giant";
export type CoatType = "short" | "medium" | "long" | "wire" | "curly";
export type LifeExpectancy = [number, number];

export interface Breed {
  slug: string;
  /** Hebrew name (main display) */
  name: string;
  /** English name (for SEO/secondary) */
  nameEn: string;
  /** Short one-liner shown in cards */
  tagline: string;
  /** Long description */
  description: string;
  /** Trait scores 0-10 */
  traits: TraitVector;
  /** Categorical fields used by matcher/UI */
  size: BreedSize;
  coat: CoatType;
  /** Is hypoallergenic (low-shedding, suitable for allergy sufferers) */
  hypoallergenic: boolean;
  /** General classification (for filtering UI) */
  group:
    | "מקבילי-עזר"
    | "ספורט"
    | "רועים"
    | "טרייר"
    | "טויי"
    | "לא ספורטיבי"
    | "עבודה"
    | "מעורב";
  /** Average adult weight (kg) range */
  weightKg: [number, number];
  /** Average lifespan (years) */
  lifeExpectancy: LifeExpectancy;
  /** Estimated minimum daily exercise needs (minutes) */
  exerciseMinPerDay: number;
  /** Common care tips */
  careTips: string[];
  /** Common mistakes new owners make */
  commonMistakes: string[];
  /** Best for (positive blurbs) */
  goodFor: string[];
  /** Not ideal for */
  notIdealFor: string[];
  /** Color emoji or single-character avatar fallback */
  emoji: string;
  /** Hex color theme for the breed card */
  accent: string;
  /** Lead photo URL (Wikimedia Commons) */
  imageUrl?: string | null;
  imageWidth?: number | null;
  imageHeight?: number | null;
  /** Hebrew Wikipedia URL (when available) */
  wikipediaHe?: string | null;
  /** English Wikipedia URL */
  wikipediaEn?: string | null;
}

export interface BreedMatch {
  breed: Breed;
  /** 0-100 compatibility score */
  score: number;
  /** Trait keys where breed strongly matches user preferences */
  strengths: string[];
  /** Trait keys where care is needed */
  watchOuts: string[];
}
