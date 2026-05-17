"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { useQuizStore } from "@/store/useQuizStore";
import { getNextQuestion, estimatedTotal } from "@/lib/quiz/engine";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";

/** Slight delay so the user sees their selected answer pop before we advance. */
const ANSWER_TRANSITION_MS = 380;

export function QuizContainer() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const pendingTimerRef = useRef<number | null>(null);

  const answers = useQuizStore((s) => s.answers);
  const answer = useQuizStore((s) => s.answer);
  const goBack = useQuizStore((s) => s.goBack);
  const history = useQuizStore((s) => s.history);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated) return;
    const next = getNextQuestion(answers);
    if (next === null && Object.keys(answers).length > 0) {
      router.push("/result");
    }
  }, [answers, hydrated, router]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (pendingTimerRef.current != null) {
        window.clearTimeout(pendingTimerRef.current);
      }
    };
  }, []);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center text-ink-soft font-display font-bold">
        טוען...
      </div>
    );
  }

  const currentQuestion = getNextQuestion(answers);
  if (!currentQuestion) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center text-ink-soft font-display font-bold">
        מעבד את התוצאות שלך...
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const total = estimatedTotal(answers);
  const current = Math.min(answeredCount + 1, total);

  function handleAnswer(answerId: string) {
    setPending(answerId);
    if (pendingTimerRef.current != null) {
      window.clearTimeout(pendingTimerRef.current);
    }
    pendingTimerRef.current = window.setTimeout(() => {
      answer(currentQuestion!.id, answerId);
      setPending(null);
    }, ANSWER_TRANSITION_MS);
  }

  const selectedAnswerId = pending ?? answers[currentQuestion.id];
  const pendingAnswer = pending
    ? currentQuestion.answers.find((a) => a.id === pending)
    : null;

  return (
    <div className="mx-auto max-w-2xl w-full">
      {/* SR-only announcement of selection + position */}
      <div role="status" aria-live="polite" className="sr-only">
        {pendingAnswer
          ? `נבחר: ${pendingAnswer.label}. עוברים לשאלה הבאה.`
          : `שאלה ${current} מתוך ${total}`}
      </div>

      <div className="mb-6">
        <ProgressBar current={current} total={total} />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          selectedAnswerId={selectedAnswerId}
          onAnswer={handleAnswer}
          onBack={goBack}
          canGoBack={history.length > 0}
          isLocked={pending !== null}
        />
      </AnimatePresence>
    </div>
  );
}
