import type { TraitKey } from "@/lib/traits";

export type QuestionLayer = "core" | "lifestyle" | "preferences" | "tiebreak";

export type Flag =
  | "small-space"
  | "has-garden"
  | "long-alone"
  | "very-long-alone"
  | "young-kids"
  | "baby-in-home"
  | "first-time"
  | "has-dog"
  | "has-cat"
  | "has-small-pets"
  | "allergic"
  | "very-hot"
  | "has-ac"
  | "wants-guard"
  | "low-budget"
  | "low-exercise";

export interface AnswerOption {
  id: string;
  label: string;
  emoji?: string;
  /** How much to shift the user's trait vector when this answer is chosen */
  shifts: Partial<Record<TraitKey, number>>;
  /** Flags this answer raises (used for deal-breakers and conditional questions) */
  flags?: Flag[];
}

export interface QuestionShowIf {
  flags?: Flag[];
  notFlags?: Flag[];
}

export interface Question {
  id: string;
  layer: QuestionLayer;
  /** Used to order the core questions */
  order?: number;
  text: string;
  subtext?: string;
  mascot?: "smile" | "thinking" | "curious" | "wave" | "run" | "ball" | "brush" | "graduation" | "sun" | "shield";
  /** Conditional display rules */
  showIf?: QuestionShowIf;
  answers: AnswerOption[];
}

export type AnswerMap = Record<string, string>;
