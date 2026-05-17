"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Share2, Sparkles, Eye } from "lucide-react";
import { useQuizStore } from "@/store/useQuizStore";
import { matchBreeds } from "@/lib/breeds/matcher";
import { decodeAnswers } from "@/lib/share";
import { MatchCard } from "./MatchCard";
import { ShareButtons } from "./ShareButtons";
import { CompatibilityRadar } from "./CompatibilityRadar";
import { AdoptionLinks } from "./AdoptionLinks";
import { Confetti } from "@/components/ui/Confetti";
import { CountUp } from "@/components/ui/CountUp";

export function ResultView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hydrated, setHydrated] = useState(false);
  const storeAnswers = useQuizStore((s) => s.answers);

  // If `?q=` is present in the URL, use those shared answers instead of local store
  const sharedAnswers = useMemo(() => {
    const q = searchParams.get("q");
    return q ? decodeAnswers(q) : null;
  }, [searchParams]);
  const isShared = sharedAnswers !== null;
  const answers = sharedAnswers ?? storeAnswers;

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isShared && Object.keys(storeAnswers).length === 0) {
      router.replace("/quiz");
    }
  }, [hydrated, isShared, storeAnswers, router]);

  if (!hydrated || Object.keys(answers).length === 0) {
    return <div className="py-20 text-center text-ink-soft font-display font-bold">טוען תוצאות...</div>;
  }

  const result = matchBreeds(answers);
  const { matches, vector, filteredCount } = result;

  if (matches.length === 0) {
    return (
      <div className="rounded-[32px] border-[3px] border-warning/40 bg-warning-tint p-8 text-center shadow-[var(--shadow-clay-lg)]">
        <h2 className="text-2xl font-black text-ink">
          לא מצאנו גזע שעובר את כל הקריטריונים שלך
        </h2>
        <p className="mt-2 text-ink-soft">
          זה קורה כשיש שילוב מאוד מגביל. נסה לרכך שאלה אחת — אולי לבחור באלרגיה
          קלה במקום חזקה, או לאפשר גזע גדול יותר.
        </p>
        <div className="mt-6">
          <Link
            href="/quiz"
            className="inline-block bg-primary text-white border-[3px] border-primary-deep font-display font-extrabold px-6 py-3 rounded-[18px] shadow-[var(--shadow-glow-primary)]"
          >
            חזרה לשאלון
          </Link>
        </div>
      </div>
    );
  }

  const top = matches[0];

  return (
    <div className="space-y-10">
      {isShared && (
        <div className="rounded-[18px] border-2 border-accent-soft bg-accent-tint p-3.5 text-center shadow-[var(--shadow-clay-sm)] mb-2 flex items-center justify-center gap-2">
          <Eye className="w-4 h-4 text-accent-deep" strokeWidth={2.5} aria-hidden />
          <span className="text-accent-deep font-display font-extrabold text-sm">
            את/ה צופה בתוצאות משותפות. רוצה תוצאות משלך?{" "}
            <Link
              href="/quiz"
              className="underline underline-offset-2 hover:text-accent"
            >
              קח/י את השאלון
            </Link>
          </span>
        </div>
      )}

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className="text-center relative"
      >
        <Confetti count={36} duration={2} />
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 240, damping: 18 }}
          className="inline-flex items-center gap-1.5 bg-accent-tint text-accent-deep border-2 border-accent-soft px-3.5 py-1.5 rounded-full text-sm font-display font-extrabold shadow-[var(--shadow-clay-sm)]"
        >
          <Sparkles className="w-4 h-4" strokeWidth={2.5} />
          {isShared ? "תוצאות משותפות" : "התוצאות שלך מוכנות"}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, type: "spring", stiffness: 220, damping: 24 }}
          className="mt-4 text-3xl md:text-5xl lg:text-6xl font-black text-ink leading-[1.1]"
        >
          הכלב שמתאים לך הוא{" "}
          <span className="relative inline-block whitespace-nowrap">
            <span className="relative z-10 text-primary-deep">{top.breed.name}</span>
            <motion.span
              aria-hidden
              className="absolute -bottom-1 right-0 left-0 h-3 md:h-4 -z-0 rounded-full origin-right"
              style={{ background: "#FED7AA" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-4 text-ink-soft text-lg md:text-xl max-w-2xl mx-auto"
        >
          {top.breed.tagline} ·{" "}
          <span className="font-display font-extrabold text-primary-deep">
            <CountUp to={top.score} />% התאמה
          </span>
        </motion.p>
      </motion.div>

      {/* Matches + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-5">
          {matches.map((m, i) => (
            <MatchCard key={m.breed.slug} match={m} rank={i + 1} />
          ))}
        </div>

        <aside className="lg:sticky lg:top-4 rounded-[32px] border-[3px] border-border bg-surface p-6 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)]">
          <h2 className="text-xl font-black text-ink mb-1">
            פרופיל ההתאמה
          </h2>
          <p className="text-sm text-ink-soft mb-4">
            השוואה: ההעדפות שלך מול {top.breed.name}
          </p>
          <CompatibilityRadar user={vector} breed={top.breed.traits} />
          {filteredCount > 0 && (
            <div className="mt-4 rounded-[16px] bg-bg-soft border-2 border-border-strong p-3 text-xs text-ink-soft font-medium">
              <strong className="text-ink">{filteredCount} גזעים</strong> סוננו אוטומטית בגלל אי-התאמה מהותית (אקלים, אלרגיה וכו').
            </div>
          )}
        </aside>
      </div>

      {/* Adoption next-step */}
      <AdoptionLinks breed={top.breed} />

      {/* Share */}
      <div className="rounded-[32px] border-[3px] border-primary-soft bg-primary-tint p-6 md:p-10 text-center shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)]">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary text-white rounded-[18px] border-[3px] border-primary-deep shadow-[0_3px_0_var(--color-primary-deep)] mb-3">
          <Share2 className="w-7 h-7" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-ink">שתף את התוצאה</h2>
        <p className="mt-1.5 text-ink-soft">
          אם זה עזר לך, ייתכן שזה יעזור גם לחבר שמתלבט
        </p>
        <div className="mt-6">
          <ShareButtons
            topBreedName={top.breed.name}
            topScore={top.score}
            answers={answers}
          />
        </div>
      </div>
    </div>
  );
}
