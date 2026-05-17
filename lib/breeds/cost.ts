import type { Breed } from "./types";

/**
 * Estimated annual cost (ILS) of owning a dog of this breed.
 * All numbers are rough Israeli market averages aggregated from public sources
 * (וטרינר, פטשופ, ביטוח חיות מחמד). Treat as a planning aid, not gospel.
 */
export interface CostBreakdown {
  food: [number, number];
  vet: [number, number];
  grooming: [number, number];
  insurance: [number, number];
  extras: [number, number];
  total: [number, number];
}

/** Mid-weight of the breed in kg (used to scale food/medication costs). */
function avgWeight(b: Breed): number {
  return (b.weightKg[0] + b.weightKg[1]) / 2;
}

export function estimateAnnualCost(b: Breed): CostBreakdown {
  const w = avgWeight(b);

  // === Food ===
  // ~ 25g premium kibble per kg body weight per day.
  // Cost ~35 ש"ח/ק"ג premium. Cheap kibble half that.
  const foodDailyGrams = w * 25;
  const foodAnnualKg = (foodDailyGrams * 365) / 1000;
  const foodLow = Math.round((foodAnnualKg * 22) / 50) * 50; // round to nearest 50
  const foodHigh = Math.round((foodAnnualKg * 45) / 50) * 50;

  // === Vet ===
  // Annual: routine checkup, vaccinations, chip — ~700-1200 base
  // + 1-2 unexpected visits depending on breed risk
  let vetBase = 800;
  let vetTop = 1400;
  // High-risk breeds (brachycephalic, large with hip issues, etc.)
  if (b.size === "giant" || b.size === "large") vetTop += 600;
  if (b.lifeExpectancy[1] - b.lifeExpectancy[0] >= 4) vetTop += 300;
  // Small/medium short-coat breeds tend to be hardier
  if (b.size === "small" || b.size === "toy") vetTop -= 200;

  // === Grooming ===
  // Driven by coat + grooming-trait score.
  let groomingLow = 200;
  let groomingHigh = 600;
  if (b.traits.grooming >= 8) {
    // Pro grooming every 4-6 weeks: ~180-280 ש"ח per session
    groomingLow = 1800;
    groomingHigh = 3200;
  } else if (b.traits.grooming >= 5) {
    groomingLow = 600;
    groomingHigh = 1400;
  }

  // === Insurance ===
  // Pet insurance in Israel: ~60-180 ש"ח/חודש; large/risky breeds cost more.
  let insLow = 60 * 12;
  let insHigh = 130 * 12;
  if (b.size === "giant") {
    insLow = 110 * 12;
    insHigh = 200 * 12;
  } else if (b.size === "large") {
    insLow = 90 * 12;
    insHigh = 170 * 12;
  }

  // === Extras: toys, leashes, training treats, bedding, kennel days ===
  let extrasLow = 500;
  let extrasHigh = 1500;
  if (b.size === "giant" || b.size === "large") extrasHigh += 400;
  // High-energy dogs chew through more toys
  if (b.traits.energy >= 8) extrasHigh += 300;

  const totalLow = foodLow + vetBase + groomingLow + insLow + extrasLow;
  const totalHigh = foodHigh + vetTop + groomingHigh + insHigh + extrasHigh;

  return {
    food: [foodLow, foodHigh],
    vet: [vetBase, vetTop],
    grooming: [groomingLow, groomingHigh],
    insurance: [insLow, insHigh],
    extras: [extrasLow, extrasHigh],
    total: [totalLow, totalHigh],
  };
}

const fmt = new Intl.NumberFormat("he-IL", { maximumFractionDigits: 0 });

/** Format a [low, high] tuple as "X–Y ש"ח". */
export function formatRange(range: [number, number]): string {
  if (range[0] === range[1]) return `${fmt.format(range[0])} ש"ח`;
  return `${fmt.format(range[0])}–${fmt.format(range[1])} ש"ח`;
}
