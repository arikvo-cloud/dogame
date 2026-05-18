"use client";

import { motion } from "motion/react";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((current / Math.max(total, 1)) * 100));
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm text-ink-soft mb-2 font-display font-bold">
        <span>שאלה {current} מתוך {total}</span>
        <span className="text-primary-deep">{pct}%</span>
      </div>
      <div
        className="relative h-4 w-full rounded-full bg-bg-soft border-2 border-border-strong overflow-hidden shadow-[inset_0_2px_4px_rgba(124,45,18,0.12)]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={`שאלה ${current} מתוך ${total}, ${pct} אחוז`}
      >
        <motion.div
          className="absolute inset-y-0 right-0 rounded-full bg-gradient-to-l from-primary via-peach to-primary-soft shadow-[inset_0_2px_0_rgba(255,255,255,0.45)]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 110, damping: 18 }}
        />
      </div>
    </div>
  );
}
