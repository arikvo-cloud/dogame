import { buildUserVector } from "@/lib/breeds/matcher";
import type { AnswerMap, Flag, Question } from "./types";
import { CORE_QUESTIONS, QUESTIONS } from "./questions";

const MAX_QUESTIONS = 15;

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
 * 3. Stop when MAX_QUESTIONS reached OR no more visible candidates exist.
 *    (Confidence-based early stopping was removed to give every quiz-taker
 *    the full 15-question experience.)
 */
export function getNextQuestion(answers: AnswerMap): Question | null {
  const answeredIds = new Set(Object.keys(answers));
  const { flags } = buildUserVector(answers);

  // Phase 1: core questions in order
  for (const q of CORE_QUESTIONS) {
    if (!answeredIds.has(q.id)) return q;
  }

  // Phase 2: hard cap at MAX_QUESTIONS
  if (answeredIds.size >= MAX_QUESTIONS) return null;

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

/** Total questions the quiz will ask — always MAX_QUESTIONS for a stable
 *  progress bar. The engine reaches this cap as long as visible candidates
 *  exist (26 questions available, only 15 needed, so the cap is the binding
 *  constraint in practice). The previous version returned the currently
 *  visible count which jumped from "/12" to "/15" as flags unlocked
 *  showIf-gated questions, confusing the progress UI. */
export function estimatedTotal(_answers: AnswerMap): number {
  return MAX_QUESTIONS;
}

export function isQuizComplete(answers: AnswerMap): boolean {
  return getNextQuestion(answers) === null;
}
