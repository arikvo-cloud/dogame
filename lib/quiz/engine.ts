import { buildUserVector, topMargin } from "@/lib/breeds/matcher";
import type { AnswerMap, Flag, Question } from "./types";
import { CORE_QUESTIONS, QUESTIONS } from "./questions";

const MAX_QUESTIONS = 15;
/** If top match has this margin over #2, we can stop early. */
const CONFIDENCE_MARGIN = 14;
/** Minimum questions before we allow early stopping. */
const MIN_QUESTIONS = 9;

/** Question passes its showIf rule against current user flags. */
function isVisible(question: Question, flags: Set<Flag>): boolean {
  const cond = question.showIf;
  if (!cond) return true;
  if (cond.flags && !cond.flags.every((f) => flags.has(f))) return false;
  if (cond.notFlags && cond.notFlags.some((f) => flags.has(f))) return false;
  return true;
}

/**
 * Returns the next question to ask, or null if the quiz is done.
 *
 * Strategy:
 * 1. Ask all core questions first, in order.
 * 2. After core: pick the next visible, unanswered, highest-priority question.
 *    Priority = layer (lifestyle > preferences) + axes still unconstrained.
 * 3. Stop when MAX_QUESTIONS reached or confidence margin exceeded after MIN_QUESTIONS.
 */
export function getNextQuestion(answers: AnswerMap): Question | null {
  const answeredIds = new Set(Object.keys(answers));
  const { flags } = buildUserVector(answers);

  // Phase 1: core questions in order
  for (const q of CORE_QUESTIONS) {
    if (!answeredIds.has(q.id)) return q;
  }

  // Phase 2/3: stop conditions
  if (answeredIds.size >= MAX_QUESTIONS) return null;
  if (answeredIds.size >= MIN_QUESTIONS && topMargin(answers) >= CONFIDENCE_MARGIN) {
    return null;
  }

  // Pick next visible, unanswered question — prefer lifestyle, then preferences
  const layerOrder: Record<string, number> = {
    lifestyle: 0,
    preferences: 1,
    tiebreak: 2,
    core: -1,
  };
  const candidates = QUESTIONS.filter(
    (q) =>
      !answeredIds.has(q.id) &&
      q.layer !== "core" &&
      isVisible(q, flags)
  ).sort((a, b) => (layerOrder[a.layer] ?? 9) - (layerOrder[b.layer] ?? 9));

  return candidates[0] ?? null;
}

/** Total visible questions remaining (used for progress estimation). */
export function estimatedTotal(answers: AnswerMap): number {
  const { flags } = buildUserVector(answers);
  const visible = QUESTIONS.filter((q) => isVisible(q, flags));
  // We cap by MAX_QUESTIONS to avoid showing 25/25
  return Math.min(visible.length, MAX_QUESTIONS);
}

export function isQuizComplete(answers: AnswerMap): boolean {
  return getNextQuestion(answers) === null;
}
