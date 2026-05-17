import type { Breed } from "@/lib/breeds/types";
import type { Flag } from "./types";

/**
 * Filter rules — applied before scoring.
 * Each rule receives the set of user flags and returns a predicate over breeds.
 */
export interface DealBreaker {
  id: string;
  /** Human-readable reason (Hebrew) shown in UI when a breed is filtered */
  reason: string;
  /** Returns true if this breaker is active given the user's flags */
  isActive: (flags: Set<Flag>) => boolean;
  /** Returns true if the breed PASSES (is allowed) under this breaker */
  allows: (breed: Breed) => boolean;
}

export const DEAL_BREAKERS: DealBreaker[] = [
  {
    id: "allergic",
    reason: "אלרגיה — רק גזעים היפואלרגניים",
    isActive: (flags) => flags.has("allergic"),
    allows: (b) => b.hypoallergenic === true,
  },
  {
    id: "no-giants-in-small-apartment",
    reason: "דירה קטנה — בלי גזעי ענק",
    isActive: (flags) => flags.has("small-space") && !flags.has("has-garden"),
    allows: (b) => b.size !== "giant",
  },
  {
    id: "no-heat-sensitive-when-very-hot-no-ac",
    reason: "אקלים חם מאוד בלי מיזוג — מסנן גזעים שלא עומדים בחום",
    isActive: (flags) => flags.has("very-hot") && !flags.has("has-ac"),
    allows: (b) => b.traits.heatTolerance >= 4,
  },
  {
    id: "no-baby-with-high-bark",
    reason: "תינוק בבית — מסנן גזעים ווקאליים מאוד",
    isActive: (flags) => flags.has("baby-in-home"),
    allows: (b) => b.traits.barkLevel <= 7,
  },
  {
    id: "no-very-long-alone-with-separation-prone",
    reason: "כלב לבד שעות רבות מאוד — מסנן גזעים שסובלים מחרדת נטישה חריפה",
    isActive: (flags) => flags.has("very-long-alone"),
    /** Vizsla & Cavalier-type breeds suffer from severe separation anxiety */
    allows: (b) => !["vizsla", "cavalier", "bichon-frise"].includes(b.slug),
  },
];

export function activeDealBreakers(flags: Set<Flag>): DealBreaker[] {
  return DEAL_BREAKERS.filter((d) => d.isActive(flags));
}

export function passesAllDealBreakers(
  breed: Breed,
  active: DealBreaker[]
): boolean {
  return active.every((d) => d.allows(breed));
}
