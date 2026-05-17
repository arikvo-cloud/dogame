import {
  TRAITS,
  TRAIT_KEYS,
  ZERO_VECTOR,
  type TraitKey,
  type TraitVector,
} from "@/lib/traits";
import { BREEDS } from "./data";
import type { Breed, BreedMatch } from "./types";
import {
  activeDealBreakers,
  passesAllDealBreakers,
} from "@/lib/quiz/deal-breakers";
import type { AnswerMap, Flag } from "@/lib/quiz/types";
import { QUESTIONS, getQuestionById } from "@/lib/quiz/questions";

/** Clamp a number to [0, 10] */
function clamp(n: number, min = 0, max = 10): number {
  return Math.max(min, Math.min(max, n));
}

/**
 * Convert answers map → user preference TraitVector (each axis 0-10)
 * and the set of flags raised by chosen answers.
 */
export function buildUserVector(answers: AnswerMap): {
  vector: TraitVector;
  flags: Set<Flag>;
} {
  const vector: TraitVector = { ...ZERO_VECTOR };
  const flags = new Set<Flag>();

  for (const question of QUESTIONS) {
    const chosenId = answers[question.id];
    if (!chosenId) continue;
    const chosen = question.answers.find((a) => a.id === chosenId);
    if (!chosen) continue;

    for (const [traitKey, shift] of Object.entries(chosen.shifts) as [
      TraitKey,
      number
    ][]) {
      vector[traitKey] = clamp(vector[traitKey] + shift);
    }
    if (chosen.flags) {
      for (const flag of chosen.flags) flags.add(flag);
    }
  }

  return { vector, flags };
}

/** Weighted Euclidean-style distance per trait, normalized to a 0-100 score. */
function scoreBreed(user: TraitVector, breed: Breed): number {
  let weightedSqDist = 0;
  let totalWeight = 0;
  for (const key of TRAIT_KEYS) {
    const w = TRAITS[key].weight;
    const diff = user[key] - breed.traits[key];
    weightedSqDist += w * diff * diff;
    totalWeight += w;
  }
  // Max possible weighted sq distance: totalWeight * 100 (each diff up to 10 → 100)
  const maxDist = totalWeight * 100;
  const normalized = 1 - weightedSqDist / maxDist;
  return Math.round(clamp(normalized * 100, 0, 100));
}

/** Per-axis qualitative summary: strengths and watch-outs. */
function describeMatch(
  user: TraitVector,
  breed: Breed
): { strengths: string[]; watchOuts: string[] } {
  const strengths: string[] = [];
  const watchOuts: string[] = [];
  for (const key of TRAIT_KEYS) {
    const diff = Math.abs(user[key] - breed.traits[key]);
    if (diff <= 1.5) {
      strengths.push(TRAITS[key].label);
    } else if (diff >= 4) {
      watchOuts.push(TRAITS[key].label);
    }
  }
  return {
    strengths: strengths.slice(0, 4),
    watchOuts: watchOuts.slice(0, 3),
  };
}

/**
 * Generates plain-language reasons why this breed matches the user.
 * Picks the 3 user answers whose target trait most strongly aligns with
 * the breed and renders a short Hebrew sentence each.
 */
function explainMatch(
  user: TraitVector,
  breed: Breed,
  answers: AnswerMap,
  flags: Set<Flag>
): string[] {
  const reasons: string[] = [];

  // 1. Flag-based reasons (deterministic and very tangible)
  if (flags.has("allergic") && breed.hypoallergenic) {
    reasons.push(`היפואלרגני — מתאים גם לאלרגיים, ${breed.name} משיר מעט מאוד`);
  }
  if (flags.has("baby-in-home") && breed.traits.kidFriendly >= 8) {
    reasons.push(
      `סבלני עם תינוקות וילדים — ציון התאמה לילדים גבוה (${breed.traits.kidFriendly}/10)`
    );
  }
  if (flags.has("small-space") && breed.traits.apartmentOk >= 8) {
    reasons.push(
      `מצוין לדירה — ${breed.size === "toy" || breed.size === "small" ? "קטן" : "מסתדר היטב"} ובלי דרישות שטח גדולות`
    );
  }
  if (flags.has("very-hot") && breed.traits.heatTolerance >= 7) {
    reasons.push(
      `עמיד בחום הישראלי (${breed.traits.heatTolerance}/10) — חשוב במיוחד באזורך`
    );
  }
  if (flags.has("first-time") && breed.traits.trainability >= 7) {
    reasons.push(
      `קל לאילוף (${breed.traits.trainability}/10) — מעולה לבעלים ראשון`
    );
  }
  if (flags.has("has-cat") && breed.traits.petFriendly >= 8) {
    reasons.push(`מסתדר טוב עם חתולים וחיות אחרות בבית`);
  }

  // 2. Trait-based reasons — find user answers whose target trait is closely matched
  type Cand = {
    questionId: string;
    questionText: string;
    answerLabel: string;
    traitKey: TraitKey;
    diff: number;
  };
  const candidates: Cand[] = [];

  for (const [qid, aid] of Object.entries(answers)) {
    const q = getQuestionById(qid);
    if (!q) continue;
    const a = q.answers.find((x) => x.id === aid);
    if (!a) continue;
    for (const [traitKey] of Object.entries(a.shifts) as [TraitKey, number][]) {
      const diff = Math.abs(user[traitKey] - breed.traits[traitKey]);
      candidates.push({
        questionId: qid,
        questionText: q.text,
        answerLabel: a.label,
        traitKey,
        diff,
      });
    }
  }

  // Top traits where breed best matches user, dedupe by traitKey
  const seenTraits = new Set<TraitKey>();
  const seenQuestions = new Set<string>();
  candidates
    .sort((a, b) => a.diff - b.diff)
    .filter((c) => {
      if (c.diff > 2.5) return false;
      if (seenTraits.has(c.traitKey)) return false;
      if (seenQuestions.has(c.questionId)) return false;
      seenTraits.add(c.traitKey);
      seenQuestions.add(c.questionId);
      return true;
    })
    .slice(0, 3)
    .forEach((c) => {
      const traitLabel = TRAITS[c.traitKey].label;
      reasons.push(`ענית "${c.answerLabel}" — הגזע תואם בציר ${traitLabel}`);
    });

  // Deduplicate and cap at 4
  const unique: string[] = [];
  for (const r of reasons) {
    if (!unique.includes(r)) unique.push(r);
    if (unique.length >= 4) break;
  }
  return unique;
}

export interface MatchResult {
  matches: BreedMatch[];
  filteredCount: number;
  totalCount: number;
  vector: TraitVector;
  flags: Flag[];
}

export function matchBreeds(answers: AnswerMap): MatchResult {
  const { vector, flags } = buildUserVector(answers);
  const active = activeDealBreakers(flags);

  const passing = BREEDS.filter((b) => passesAllDealBreakers(b, active));
  const filteredCount = BREEDS.length - passing.length;

  const scored: BreedMatch[] = passing
    .map((breed) => {
      const score = scoreBreed(vector, breed);
      const { strengths, watchOuts } = describeMatch(vector, breed);
      const reasons = explainMatch(vector, breed, answers, flags);
      return { breed, score, strengths, watchOuts, reasons };
    })
    .sort((a, b) => b.score - a.score);

  return {
    matches: scored.slice(0, 5),
    filteredCount,
    totalCount: BREEDS.length,
    vector,
    flags: [...flags],
  };
}

/**
 * Estimate the confidence margin between the top match and the runner-up.
 * Used by the engine to decide when to stop asking questions early.
 */
export function topMargin(answers: AnswerMap): number {
  const { matches } = matchBreeds(answers);
  if (matches.length < 2) return 100;
  return matches[0].score - matches[1].score;
}
