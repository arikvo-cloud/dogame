"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { Question } from "@/lib/quiz/types";
import { AnswerOption } from "./AnswerOption";
import { DogMascot, type MascotMood } from "./DogMascot";

interface Props {
  question: Question;
  selectedAnswerId?: string;
  onAnswer: (answerId: string) => void;
  onBack?: () => void;
  canGoBack: boolean;
  /** When true, ignore further answer clicks (the auto-advance is in progress) */
  isLocked?: boolean;
}

export function QuestionCard({
  question,
  selectedAnswerId,
  onAnswer,
  onBack,
  canGoBack,
  isLocked,
}: Props) {
  // The mascot temporarily shows "curious" when the user is mid-answer.
  const mascotMood: MascotMood = isLocked
    ? "curious"
    : (question.mascot ?? "smile");

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 40, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -40, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className="relative"
    >
      {/* Floating mascot above card */}
      <div className="flex justify-center -mb-12 md:-mb-16 relative z-10">
        <motion.div
          className="bg-surface rounded-full p-3 border-[3px] border-border-strong shadow-[var(--shadow-clay-lg)]"
          animate={isLocked ? { scale: [1, 1.08, 1], rotate: [0, -4, 4, 0] } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <DogMascot mood={mascotMood} size={128} />
        </motion.div>
      </div>

      <motion.div
        className="relative rounded-[32px] border-[3px] border-border bg-surface pt-20 md:pt-24 px-6 md:px-10 pb-8 shadow-[var(--shadow-clay-xl),var(--shadow-inner-clay)]"
        animate={isLocked ? { scale: [1, 1.015, 1] } : {}}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-7">
          <h2 className="text-2xl md:text-[2rem] font-black leading-tight text-ink">
            {question.text}
          </h2>
          {question.subtext && (
            <p className="mt-2.5 text-base text-ink-soft max-w-prose mx-auto">
              {question.subtext}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {question.answers.map((a, i) => (
            <AnswerOption
              key={a.id}
              answer={a}
              index={i}
              selected={selectedAnswerId === a.id}
              onClick={() => !isLocked && onAnswer(a.id)}
              disabled={isLocked && selectedAnswerId !== a.id}
            />
          ))}
        </div>

        {canGoBack && (
          <div className="mt-7 flex justify-start">
            <button
              type="button"
              onClick={onBack}
              disabled={isLocked}
              className="inline-flex items-center gap-1.5 text-ink-soft hover:text-primary-deep text-sm font-display font-bold transition-colors cursor-pointer rounded-lg px-2 py-1 disabled:opacity-50"
            >
              חזרה לשאלה הקודמת
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
