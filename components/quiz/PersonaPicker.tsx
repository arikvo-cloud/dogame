"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { PERSONAS, type Persona } from "@/lib/quiz/personas";
import { useQuizStore } from "@/store/useQuizStore";
import { cn } from "@/lib/cn";

interface Props {
  onSkipToQuiz: () => void;
}

/**
 * "Quick start" screen shown before the first quiz question.
 * The user can either pick a persona (we bulk-fill the matching answers
 * and jump to the next unanswered question) or take the full quiz from scratch.
 */
export function PersonaPicker({ onSkipToQuiz }: Props) {
  const router = useRouter();
  const answer = useQuizStore((s) => s.answer);
  const reset = useQuizStore((s) => s.reset);

  function pick(p: Persona) {
    reset();
    // Apply each persona answer through the store so history is consistent.
    for (const [qid, aid] of Object.entries(p.answers)) {
      answer(qid, aid);
    }
    // Re-render the quiz container so it picks up the next unanswered question.
    onSkipToQuiz();
  }

  return (
    <div className="mx-auto max-w-3xl w-full">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 bg-accent-tint text-accent-deep border-2 border-accent-soft px-3.5 py-1.5 rounded-full text-sm font-display font-extrabold shadow-[var(--shadow-clay-sm)]">
          <Sparkles className="w-4 h-4" strokeWidth={2.5} />
          התחלה מהירה
        </span>
        <h1 className="mt-4 text-3xl md:text-5xl font-black text-ink leading-tight">
          איזה{" "}
          <span className="relative inline-block whitespace-nowrap">
            <span className="relative z-10 text-primary-deep">פרופיל</span>
            <span
              aria-hidden
              className="absolute -bottom-1 right-0 left-0 h-3 md:h-4 -z-0 rounded-full"
              style={{ background: "#FED7AA" }}
            />
          </span>{" "}
          הכי קרוב אליך?
        </h1>
        <p className="mt-4 text-ink-soft text-base md:text-lg font-medium max-w-2xl mx-auto">
          בחר/י פרופיל שמתאר אותך — נדלג ישר לשאלות שעדיין לא ברורות. אפשר גם להתחיל
          את כל השאלון מאפס.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PERSONAS.map((p, i) => (
          <motion.button
            key={p.id}
            type="button"
            onClick={() => pick(p)}
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.05 * i,
              type: "spring",
              stiffness: 240,
              damping: 22,
            }}
            whileHover={{ y: -3 }}
            whileTap={{ y: 2, scale: 0.985 }}
            className={cn(
              "group text-right rounded-[24px] border-2 border-border bg-surface p-5",
              "shadow-[var(--shadow-clay),var(--shadow-inner-clay)]",
              "hover:border-primary-soft hover:bg-surface-tint transition-colors cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            )}
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className="shrink-0 flex items-center justify-center w-14 h-14 rounded-[18px] bg-primary-tint border-2 border-border-strong text-3xl shadow-[inset_0_2px_0_rgba(255,255,255,0.6)]"
              >
                {p.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-display font-black text-lg text-ink leading-tight">
                  {p.title}
                </div>
                <p className="mt-1 text-sm text-ink-soft font-medium leading-snug">
                  {p.description}
                </p>
                <div className="mt-2 inline-flex items-center gap-1 text-xs text-primary-deep font-display font-extrabold">
                  המשך לשאלון
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={onSkipToQuiz}
          className="inline-flex items-center gap-2 bg-surface text-ink border-2 border-border-strong px-6 py-3 rounded-[20px] font-display font-extrabold shadow-[var(--shadow-clay)] hover:-translate-y-0.5 hover:border-primary-soft active:translate-y-0.5 transition-all"
        >
          או דלג ועבור לשאלון המלא
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
