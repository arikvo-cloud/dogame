import questionsJson from "@/data/questions.json";
import type { Question } from "./types";

export const QUESTIONS: Question[] = questionsJson as Question[];

export function getQuestionById(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

export const CORE_QUESTIONS = QUESTIONS.filter((q) => q.layer === "core").sort(
  (a, b) => (a.order ?? 99) - (b.order ?? 99)
);
