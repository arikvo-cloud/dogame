"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  Wallet,
  Bone,
  Stethoscope,
  Scissors,
  Shield,
  Sparkles,
} from "lucide-react";
import type { Breed } from "@/lib/breeds/types";
import { estimateAnnualCost, formatRange } from "@/lib/breeds/cost";

interface Props {
  breed: Breed;
}

/** Annual cost estimator card with collapsible breakdown. */
export function CostEstimator({ breed }: Props) {
  const cost = estimateAnnualCost(breed);
  const [open, setOpen] = useState(false);
  const monthlyLow = Math.round(cost.total[0] / 12);
  const monthlyHigh = Math.round(cost.total[1] / 12);

  const items = [
    { Icon: Bone, label: "אוכל", value: cost.food },
    { Icon: Stethoscope, label: "וטרינר ובדיקות", value: cost.vet },
    { Icon: Scissors, label: "טיפוח ומספרה", value: cost.grooming },
    { Icon: Shield, label: "ביטוח חיות מחמד", value: cost.insurance },
    { Icon: Sparkles, label: "אביזרים ופנאי", value: cost.extras },
  ];

  return (
    <section className="rounded-[28px] border-2 border-border bg-surface p-6 md:p-8 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-[16px] bg-mustard text-ink border-2 border-mustard-soft shadow-[inset_0_2px_0_rgba(255,255,255,0.5)]">
          <Wallet className="w-6 h-6" strokeWidth={2.5} aria-hidden />
        </div>
        <div>
          <h2 className="font-display font-black text-xl md:text-2xl text-ink leading-tight">
            כמה זה עולה בשנה?
          </h2>
          <p className="text-xs text-ink-soft font-medium">
            הערכה מבוססת על שוק חיות המחמד בישראל
          </p>
        </div>
      </div>

      {/* Headline cost */}
      <div className="rounded-[20px] bg-bg-soft border-2 border-border-strong p-4 mb-4">
        <div className="text-xs font-display font-extrabold text-ink-soft uppercase tracking-wide">
          סך הכל לשנה
        </div>
        <div className="mt-1 text-2xl md:text-3xl font-black text-primary-deep leading-none font-display">
          {formatRange(cost.total)}
        </div>
        <div className="mt-1 text-sm text-ink-soft font-display font-bold">
          זה בערך {monthlyLow.toLocaleString("he-IL")}–
          {monthlyHigh.toLocaleString("he-IL")} ש"ח לחודש
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full inline-flex items-center justify-between gap-2 px-4 py-3 rounded-[18px] bg-surface border-2 border-border-strong shadow-[var(--shadow-clay-sm)] font-display font-extrabold text-ink hover:border-primary-soft transition-colors cursor-pointer"
      >
        <span className="text-sm">פירוט מלא של ההוצאות</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={2.5}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ul className="mt-3 space-y-2">
              {items.map(({ Icon, label, value }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-[14px] bg-bg-soft/70 border-2 border-border p-3"
                >
                  <Icon className="w-5 h-5 text-primary-deep shrink-0" strokeWidth={2.5} />
                  <span className="flex-1 font-display font-bold text-ink text-sm">
                    {label}
                  </span>
                  <span className="font-display font-extrabold text-ink-soft text-sm tabular-nums">
                    {formatRange(value)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-ink-soft font-medium leading-relaxed">
              הערכים מותאמים לגזע {breed.name} (גודל: {breed.weightKg[0]}–
              {breed.weightKg[1]} ק"ג, טיפוח:{" "}
              {breed.traits.grooming}/10). ההערכה היא לכלב בוגר; שנת הגור
              עולה ~30% יותר (אילוף, חיסונים נוספים, סירוס/עיקור).
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
