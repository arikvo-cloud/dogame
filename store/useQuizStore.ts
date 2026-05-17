"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AnswerMap } from "@/lib/quiz/types";

interface QuizState {
  answers: AnswerMap;
  /** Ordered history of question ids the user has visited (for back navigation) */
  history: string[];
  /** Sets the chosen answer for a question id. Adds to history if new. */
  answer: (questionId: string, answerId: string) => void;
  /** Removes the last answer (back-button behavior) */
  goBack: () => void;
  /** Wipes all state — used by "התחל מחדש" */
  reset: () => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      answers: {},
      history: [],
      answer: (questionId, answerId) =>
        set((state) => {
          const newHistory = state.history.includes(questionId)
            ? state.history
            : [...state.history, questionId];
          return {
            answers: { ...state.answers, [questionId]: answerId },
            history: newHistory,
          };
        }),
      goBack: () =>
        set((state) => {
          if (state.history.length === 0) return state;
          const newHistory = state.history.slice(0, -1);
          const removed = state.history[state.history.length - 1];
          const newAnswers = { ...state.answers };
          delete newAnswers[removed];
          return { history: newHistory, answers: newAnswers };
        }),
      reset: () => set({ answers: {}, history: [] }),
    }),
    {
      name: "dogame-quiz-v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
