"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ChevronLeft, Sparkles, AlertTriangle, Trophy, Lightbulb } from "lucide-react";
import type { BreedMatch } from "@/lib/breeds/types";
import { cn } from "@/lib/cn";
import { BreedPhoto } from "@/components/breed/BreedPhoto";
import { CountUp } from "@/components/ui/CountUp";

interface Props {
  match: BreedMatch;
  rank: number;
}

export function MatchCard({ match, rank }: Props) {
  const { breed, score, strengths, watchOuts } = match;
  const isTop = rank === 1;

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
      whileHover={{ y: -3 }}
      className={cn(
        "relative rounded-[32px] border-2 p-5 md:p-7 transition-colors",
        isTop
          ? "border-primary-deep bg-surface shadow-[var(--shadow-glow-primary),var(--shadow-inner-clay)]"
          : "border-border bg-surface shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)] hover:border-border-strong"
      )}
    >
      {isTop && (
        <motion.span
          initial={{ y: -20, opacity: 0, scale: 0.7 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 18 }}
          className="absolute -top-3 right-6 inline-flex items-center gap-1.5 bg-primary-deep text-white border-2 border-primary-deep rounded-full px-3 py-1 font-display font-extrabold text-xs shadow-[0_3px_0_var(--color-primary-deep)]"
        >
          <Trophy className="w-3.5 h-3.5" strokeWidth={3} />
          ההתאמה המובילה
        </motion.span>
      )}

      <div className="flex items-start gap-4">
        <BreedPhoto
          breed={breed}
          size={96}
          rounded="rounded-[22px]"
          className="shrink-0"
          priority={isTop}
        />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-display font-extrabold text-ink-soft uppercase tracking-wide">
            {isTop ? "ההמלצה שלנו" : `מקום ${rank}`}
          </div>
          <h3 className="mt-1 text-2xl md:text-3xl font-black text-ink leading-tight">
            {breed.name}
          </h3>
          <p className="text-sm text-ink-soft">{breed.tagline}</p>
        </div>
        <div className="text-center shrink-0">
          <div
            className={cn(
              "text-3xl md:text-4xl font-black leading-none font-display",
              isTop ? "text-primary-deep" : "text-ink-soft"
            )}
          >
            <CountUp to={score} />
            <span className="text-base align-top mr-0.5">%</span>
          </div>
          <div className="text-xs text-ink-soft font-display font-bold mt-0.5">התאמה</div>
        </div>
      </div>

      {/* "Why we matched" — only on top result to avoid noise */}
      {isTop && match.reasons.length > 0 && (
        <div className="mt-5 rounded-[18px] bg-accent-tint border-2 border-accent-soft p-4 shadow-[var(--shadow-clay-sm)]">
          <div className="flex items-center gap-1.5 text-accent-deep font-display font-extrabold text-sm mb-2">
            <Lightbulb className="w-4 h-4" strokeWidth={2.5} />
            למה התאמנו אותך לגזע הזה?
          </div>
          <ul className="text-sm text-ink space-y-1.5">
            {match.reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2 font-medium leading-relaxed">
                <span className="text-accent-deep mt-1 shrink-0">✓</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
        {strengths.length > 0 && (
          <div className="rounded-[18px] bg-success-tint border-2 border-success/40 p-3.5 shadow-[var(--shadow-clay-sm)]">
            <div className="flex items-center gap-1.5 text-success-deep font-display font-extrabold text-sm mb-1.5">
              <Sparkles className="w-4 h-4" strokeWidth={2.5} />
              חוזקות בהתאמה
            </div>
            <ul className="text-sm text-ink space-y-1">
              {strengths.map((s) => (
                <li key={s} className="font-medium">• {s}</li>
              ))}
            </ul>
          </div>
        )}
        {watchOuts.length > 0 && (
          <div className="rounded-[18px] bg-warning-tint border-2 border-warning/50 p-3.5 shadow-[var(--shadow-clay-sm)]">
            <div className="flex items-center gap-1.5 text-warning-deep font-display font-extrabold text-sm mb-1.5">
              <AlertTriangle className="w-4 h-4" strokeWidth={2.5} />
              לשים לב
            </div>
            <ul className="text-sm text-ink space-y-1">
              {watchOuts.map((w) => (
                <li key={w} className="font-medium">• {w}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
        <div className="text-sm text-ink-soft font-medium">
          <span className="inline-flex items-center gap-3">
            <span>{breed.weightKg[0]}-{breed.weightKg[1]} ק"ג</span>
            <span aria-hidden className="text-ink-mute">·</span>
            <span>{breed.exerciseMinPerDay} דק' פעילות</span>
          </span>
        </div>
        <Link
          href={`/breed/${breed.slug}`}
          className="inline-flex items-center gap-1 font-display font-extrabold text-primary-deep hover:text-primary transition-colors rounded-lg px-2 py-1 -mx-2"
        >
          קרא עוד על {breed.name}
          <ChevronLeft className="w-4 h-4" strokeWidth={3} />
        </Link>
      </div>
    </motion.article>
  );
}
