"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useQuizStore } from "@/store/useQuizStore";
import { getNextQuestion, estimatedTotal } from "@/lib/quiz/engine";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";
import { PersonaPicker } from "./PersonaPicker";

const PICKER_DISMISSED_KEY = "dogame-picker-dismissed-v1";

/** Slight delay so the user sees their selected answer pop before we advance. */
const ANSWER_TRANSITION_MS = 380;

const stageTransition = { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const };

export function QuizContainer() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [pickerDismissed, setPickerDismissed] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const pendingTimerRef = useRef<number | null>(null);

  const answers = useQuizStore((s) => s.answers);
  const answer = useQuizStore((s) => s.answer);
  const goBack = useQuizStore((s) => s.goBack);
  const history = useQuizStore((s) => s.history);

  useEffect(() => {
    setHydrated(true);
    if (typeof window !== "undefined") {
      setPickerDismissed(sessionStorage.getItem(PICKER_DISMISSED_KEY) === "1");
    }
  }, []);

  function dismissPicker() {
    setPickerDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(PICKER_DISMISSED_KEY, "1");
    }
  }

  useEffect(() => {
    if (!hydrated) return;
    const next = getNextQuestion(answers);
    if (next === null && Object.keys(answers).length > 0) {
      router.push("/result");
    }
  }, [answers, hydrated, router]);

  useEffect(() => {
    return () => {
      if (pendingTimerRef.current != null) {
        window.clearTimeout(pendingTimerRef.current);
      }
    };
  }, []);

  // Determine stage before render so AnimatePresence can transition between them.
  const stage: "loading" | "picker" | "quiz" | "processing" = !hydrated
    ? "loading"
    : !pickerDismissed && Object.keys(answers).length === 0
      ? "picker"
      : getNextQuestion(answers) === null
        ? "processing"
        : "quiz";

  const currentQuestion = stage === "quiz" ? getNextQuestion(answers) : null;
  const answeredCount = Object.keys(answers).length;
  const total = estimatedTotal(answers);
  const current = Math.min(answeredCount + 1, total);

  function handleAnswer(answerId: string) {
    if (!currentQuestion) return;
    setPending(answerId);
    if (pendingTimerRef.current != null) {
      window.clearTimeout(pendingTimerRef.current);
    }
    pendingTimerRef.current = window.setTimeout(() => {
      answer(currentQuestion.id, answerId);
      setPending(null);
    }, ANSWER_TRANSITION_MS);
  }

  const selectedAnswerId = pending ?? (currentQuestion ? answers[currentQuestion.id] : undefined);
  const pendingAnswer =
    pending && currentQuestion
      ? currentQuestion.answers.find((a) => a.id === pending)
      : null;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {stage === "loading" && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={stageTransition}
          className="mx-auto max-w-2xl w-full"
        >
          <QuizSkeleton />
        </motion.div>
      )}

      {stage === "picker" && (
        <motion.div
          key="picker"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={stageTransition}
        >
          <PersonaPicker onSkipToQuiz={dismissPicker} />
        </motion.div>
      )}

      {stage === "processing" && (
        <motion.div
          key="processing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={stageTransition}
          className="mx-auto max-w-2xl py-16 text-center"
        >
          <p className="pull-quote !text-2xl">מעבד את התוצאות שלכם...</p>
        </motion.div>
      )}

      {stage === "quiz" && currentQuestion && (
        <motion.div
          key="quiz"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={stageTransition}
          className="mx-auto max-w-2xl w-full"
        >
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Skeleton that mirrors the question-card shape so hydration doesn't snap. */
function QuizSkeleton() {
  return (
    <div className="animate-pulse">
      {/* progress placeholder */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 w-24 rounded bg-bg-soft" />
          <div className="h-4 w-10 rounded bg-bg-soft" />
        </div>
        <div className="h-4 w-full rounded-full bg-bg-soft border-2 border-border-strong" />
      </div>
      {/* card placeholder */}
      <div className="rounded-[28px] border-2 border-border bg-surface p-7 md:p-10 shadow-[var(--shadow-clay-lg)]">
        <div className="h-6 w-3/4 rounded bg-bg-soft mb-4" />
        <div className="h-10 w-5/6 rounded bg-bg-soft mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="h-20 rounded-[18px] bg-bg-soft" />
          <div className="h-20 rounded-[18px] bg-bg-soft" />
          <div className="h-20 rounded-[18px] bg-bg-soft" />
          <div className="h-20 rounded-[18px] bg-bg-soft" />
        </div>
      </div>
    </div>
  );
}
