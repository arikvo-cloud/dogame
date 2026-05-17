"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import type { AnswerOption as AnswerOptionType } from "@/lib/quiz/types";

interface Props {
  answer: AnswerOptionType;
  selected?: boolean;
  onClick?: () => void;
  index: number;
  disabled?: boolean;
}

/**
 * Clay-style answer button — chunky border, double shadow, squish on press.
 * Selected state turns the whole tile primary-tinted with a check-bubble.
 */
export function AnswerOption({ answer, selected, onClick, index, disabled }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={
        selected
          ? { opacity: 1, y: -2, scale: 1.02 }
          : { opacity: disabled ? 0.5 : 1, y: 0, scale: 1 }
      }
      transition={{
        delay: 0.05 * index,
        type: "spring",
        stiffness: 240,
        damping: 22,
      }}
      whileHover={disabled ? undefined : { y: -3 }}
      whileTap={disabled ? undefined : { y: 2, scale: 0.985 }}
      className={cn(
        "group relative w-full text-right flex items-center gap-4",
        "rounded-[22px] border-[3px] px-4 py-4 md:py-5",
        "font-display text-lg md:text-xl",
        "transition-colors duration-150 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        "disabled:cursor-not-allowed",
        selected
          ? "bg-primary-tint border-primary-deep text-primary-deep shadow-[var(--shadow-glow-primary),var(--shadow-inner-clay)]"
          : "bg-surface border-border text-ink hover:border-primary-soft hover:bg-surface-tint shadow-[var(--shadow-clay-sm),var(--shadow-inner-clay)]"
      )}
    >
      {/* Emoji bubble */}
      <span
        aria-hidden
        className={cn(
          "flex items-center justify-center shrink-0 w-14 h-14 rounded-[18px] text-3xl border-[3px]",
          "transition-all duration-200",
          selected
            ? "bg-primary border-primary-deep text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.4),0_2px_0_var(--color-primary-deep)]"
            : "bg-bg-soft border-border-strong shadow-[inset_0_2px_0_rgba(255,255,255,0.55)] group-hover:bg-primary-tint"
        )}
      >
        {answer.emoji ?? "🐾"}
      </span>

      {/* Label */}
      <span className="flex-1 font-bold leading-snug">{answer.label}</span>

      {/* Check indicator */}
      <span
        aria-hidden
        className={cn(
          "flex items-center justify-center shrink-0 w-8 h-8 rounded-full border-[3px] transition-all",
          selected
            ? "bg-primary border-primary-deep text-white scale-100"
            : "bg-bg border-border-strong text-transparent scale-90 group-hover:scale-100"
        )}
      >
        <Check className="w-4 h-4" strokeWidth={3.5} />
      </span>
    </motion.button>
  );
}
