"use client";

import { motion } from "motion/react";
import { Info } from "lucide-react";
import { TRAITS, TRAIT_KEYS, type TraitVector, type TraitKey } from "@/lib/traits";
import { Tooltip } from "@/components/ui/Tooltip";

interface Props {
  traits: TraitVector;
}

/** Visual category for each trait — drives the bar gradient color. */
const TRAIT_CATEGORY: Record<TraitKey, "physical" | "care" | "social" | "env"> = {
  size: "physical",
  energy: "physical",
  trainability: "care",
  grooming: "care",
  shedding: "care",
  kidFriendly: "social",
  petFriendly: "social",
  apartmentOk: "social",
  heatTolerance: "env",
  barkLevel: "env",
};

const BAR_GRADIENT: Record<"physical" | "care" | "social" | "env", string> = {
  // Orange — physical attributes
  physical:
    "bg-gradient-to-l from-primary via-peach to-primary-soft",
  // Blue — investment/training/maintenance
  care:
    "bg-gradient-to-l from-accent via-accent-soft to-accent-soft",
  // Green — social compatibility
  social:
    "bg-gradient-to-l from-success-deep via-success to-success",
  // Amber — environmental considerations
  env:
    "bg-gradient-to-l from-warning-deep via-warning to-warning",
};

/** Animated trait grid — each bar fills on viewport entry, staggered. */
export function BreedTraits({ traits }: Props) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05 } },
      }}
    >
      {TRAIT_KEYS.map((k) => {
        const def = TRAITS[k];
        const value = traits[k];
        const pct = (value / 10) * 100;
        const gradient = BAR_GRADIENT[TRAIT_CATEGORY[k]];
        return (
          <motion.div
            key={k}
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[18px] border-2 border-border bg-surface p-3.5 shadow-[var(--shadow-clay-sm),var(--shadow-inner-clay)]"
          >
            <div className="flex items-center justify-between text-sm mb-2.5">
              <Tooltip content={def.description}>
                <span className="font-display font-black text-ink inline-flex items-center gap-1 cursor-help">
                  {def.label}
                  <Info className="w-3 h-3 text-ink-soft" strokeWidth={2.5} aria-hidden />
                </span>
              </Tooltip>
              <span className="text-ink-soft text-xs font-medium">
                {def.lowLabel} ← → {def.highLabel}
              </span>
            </div>
            <div className="relative h-3 w-full rounded-full bg-bg-soft border-2 border-border-strong overflow-hidden shadow-[inset_0_1px_3px_rgba(124,45,18,0.16)]">
              <motion.div
                className={`absolute inset-y-0 right-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] ${gradient}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  duration: 0.9,
                  delay: 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
