"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Sparkles, AlertTriangle, Lightbulb } from "lucide-react";
import type { BreedMatch } from "@/lib/breeds/types";
import { cn } from "@/lib/cn";
import { BreedPhoto } from "@/components/breed/BreedPhoto";
import { CountUp } from "@/components/ui/CountUp";
import { dogsForBreed } from "@/lib/dogs/helpers";
import { DogCard } from "@/components/dogs/DogCard";

interface Props {
  match: BreedMatch;
  rank: number;
}

const sectionTransition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function MatchCard({ match, rank }: Props) {
  const { breed, score, strengths, watchOuts } = match;
  const isTop = rank === 1;
  const rankStr = `N°${rank}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: rank * 0.08,
        type: "spring",
        stiffness: 200,
        damping: 24,
      }}
      whileHover={isTop ? undefined : { y: -3 }}
      className={cn(
        "relative overflow-hidden",
        isTop
          ? "rounded-[36px] border-2 border-primary-deep bg-surface shadow-[var(--shadow-clay-xl),var(--shadow-inner-clay)]"
          : "rounded-[28px] border-2 border-border bg-surface shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)] hover:border-border-strong transition-colors"
      )}
      data-paw-zone
    >
      {/* Decorative giant serif rank watermark — only on top match */}
      {isTop && (
        <span
          aria-hidden
          className="serif-numeral absolute -top-4 -left-2 md:-top-6 md:-left-4 text-primary-deep/10 select-none pointer-events-none"
          style={{ fontSize: "clamp(8rem, 18vw, 16rem)" }}
        >
          1
        </span>
      )}

      <div className={cn("relative", isTop ? "p-6 md:p-9" : "p-5 md:p-7")}>
        {/* Editorial mark */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="inline-flex items-center gap-3">
            <span className="font-display font-extrabold text-sm tabular-nums tracking-tight text-primary-deep">
              {rankStr}
            </span>
            <span aria-hidden className="block h-px w-6 bg-ink-mute opacity-50" />
            <span className="text-[10px] uppercase tracking-[0.22em] font-display font-bold text-ink-mute">
              {isTop ? "ההמלצה המובילה" : "המלצה"}
            </span>
          </div>
          <div
            className={cn(
              "font-display tabular-nums leading-none",
              isTop ? "text-primary-deep" : "text-ink-soft"
            )}
          >
            <span className={isTop ? "text-4xl md:text-5xl font-extrabold" : "text-2xl md:text-3xl font-extrabold"}>
              <CountUp to={score} />
            </span>
            <span className="text-base align-top mr-0.5">%</span>
          </div>
        </div>

        <div className="flex items-start gap-4 md:gap-6">
          <BreedPhoto
            breed={breed}
            size={isTop ? 128 : 96}
            rounded={isTop ? "rounded-[26px]" : "rounded-[22px]"}
            className="shrink-0"
            priority={isTop}
          />
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-display font-extrabold text-ink leading-tight tracking-tight",
                isTop ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"
              )}
            >
              {breed.name}
            </h3>
            <p
              className={cn(
                "mt-2 text-ink-soft font-medium leading-relaxed max-w-prose",
                isTop ? "text-base md:text-lg" : "text-sm"
              )}
            >
              {breed.tagline}
            </p>
          </div>
        </div>

        {/* Why we matched — pull-quote treatment on top result */}
        <AnimatePresence initial={false}>
          {isTop && match.reasons.length > 0 && (
            <motion.div
              key="reasons"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={sectionTransition}
              className="overflow-hidden"
            >
              <div className="mt-7 border-t border-border pt-6">
                <div className="flex items-center gap-2 text-primary-deep font-display font-extrabold text-xs uppercase tracking-[0.2em] mb-4">
                  <Lightbulb className="w-3.5 h-3.5" strokeWidth={2.5} />
                  למה התאמנו אתכם
                </div>
                <ul className="space-y-3">
                  {match.reasons.map((r, i) => (
                    <li
                      key={i}
                      className="flex items-baseline gap-3 text-ink leading-relaxed"
                    >
                      <span className="serif-numeral text-primary-deep/40 text-xl tabular-nums shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-medium text-base md:text-lg">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isTop && (() => {
          const available = dogsForBreed(breed.slug, 3);
          if (available.length === 0) return null;
          return (
            <div className="mt-7 border-t border-border pt-6">
              <div className="flex items-center gap-2 text-primary-deep font-display font-extrabold text-xs uppercase tracking-[0.2em] mb-4">
                {available.length} {breed.name} מחכים לבית
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {available.map((d) => <DogCard key={d.id} dog={d} compact />)}
              </div>
              <Link
                href="/adopt"
                className="mt-4 inline-flex items-center gap-1 font-display font-extrabold text-primary-deep underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors"
              >
                לכל הכלבים הזמינים לאימוץ
                <ChevronLeft className="w-4 h-4" strokeWidth={3} />
              </Link>
            </div>
          );
        })()}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
          <AnimatePresence initial={false}>
            {strengths.length > 0 && (
              <motion.div
                key="strengths"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={sectionTransition}
                className="rounded-[18px] bg-success-tint border-2 border-success/40 p-4 shadow-[var(--shadow-clay-sm)]"
              >
                <div className="flex items-center gap-1.5 text-success-deep font-display font-extrabold text-xs uppercase tracking-[0.15em] mb-2">
                  <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
                  חוזקות בהתאמה
                </div>
                <ul className="text-sm text-ink space-y-1">
                  {strengths.map((s) => (
                    <li key={s} className="font-medium">
                      • {s}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {watchOuts.length > 0 && (
              <motion.div
                key="watchouts"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={sectionTransition}
                className="rounded-[18px] bg-warning-tint border-2 border-warning/50 p-4 shadow-[var(--shadow-clay-sm)]"
              >
                <div className="flex items-center gap-1.5 text-warning-deep font-display font-extrabold text-xs uppercase tracking-[0.15em] mb-2">
                  <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2.5} />
                  לשים לב
                </div>
                <ul className="text-sm text-ink space-y-1">
                  {watchOuts.map((w) => (
                    <li key={w} className="font-medium">
                      • {w}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
          <div className="text-sm text-ink-soft font-medium tabular-nums">
            <span className="inline-flex items-center gap-3">
              <span>
                {breed.weightKg[0]}–{breed.weightKg[1]} ק&quot;ג
              </span>
              <span aria-hidden className="text-ink-mute">·</span>
              <span>{breed.exerciseMinPerDay} דק&apos; פעילות ביום</span>
            </span>
          </div>
          <Link
            href={`/breed/${breed.slug}`}
            data-paw-zone
            className="inline-flex items-center gap-1 font-display font-extrabold text-primary-deep hover:text-primary transition-colors underline underline-offset-4 decoration-primary/40 hover:decoration-primary"
          >
            הפרופיל המלא של {breed.name}
            <ChevronLeft className="w-4 h-4" strokeWidth={3} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
