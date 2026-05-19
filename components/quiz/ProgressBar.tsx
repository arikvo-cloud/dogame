"use client";

import { motion } from "motion/react";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((current / Math.max(total, 1)) * 100));
  const cur = String(current).padStart(2, "0");
  const tot = String(total).padStart(2, "0");

  return (
    <div className="w-full">
      <div className="flex items-end justify-between mb-3 gap-4">
        <div className="font-display tabular-nums leading-none flex items-baseline gap-1">
          <span className="font-extrabold text-3xl md:text-4xl text-primary-deep">
            {cur}
          </span>
          <span className="text-ink-faint text-xl md:text-2xl">/</span>
          <span className="text-ink-mute font-bold text-xl md:text-2xl">
            {tot}
          </span>
        </div>
        <div className="text-[10px] uppercase tracking-[0.22em] font-display font-bold text-ink-mute pb-1">
          שאלה
        </div>
      </div>
      <div
        className="relative h-2.5 w-full rounded-full bg-bg-soft border border-border-strong overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={`שאלה ${current} מתוך ${total}, ${pct} אחוז`}
      >
        <motion.div
          className="absolute inset-y-0 right-0 rounded-full bg-gradient-to-l from-primary via-peach to-primary-soft"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 110, damping: 18 }}
        />
      </div>
    </div>
  );
}
