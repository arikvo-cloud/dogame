"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Heart, ArrowLeft, Trash2 } from "lucide-react";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { BREEDS } from "@/lib/breeds/data";
import { BreedPhoto } from "@/components/breed/BreedPhoto";
import { FavoriteButton } from "@/components/breed/FavoriteButton";
import { Pill } from "@/components/ui/Pill";
import { ADOPTABLE_DOGS } from "@/lib/dogs/data";
import { DogCard } from "@/components/dogs/DogCard";

const SIZE_LABELS: Record<string, string> = {
  toy: "זעיר",
  small: "קטן",
  medium: "בינוני",
  large: "גדול",
  giant: "ענק",
};

export function FavoritesView() {
  const [hydrated, setHydrated] = useState(false);
  const [tab, setTab] = useState<"breeds" | "dogs">("breeds");
  const breedSlugs = useFavoritesStore((s) => s.breedSlugs);
  const dogIds = useFavoritesStore((s) => s.dogIds);
  const clear = useFavoritesStore((s) => s.clear);

  useEffect(() => { queueMicrotask(() => setHydrated(true)); }, []);

  const favBreeds = useMemo(
    () => BREEDS.filter((b) => breedSlugs.includes(b.slug)),
    [breedSlugs]
  );
  const favDogs = useMemo(
    () => ADOPTABLE_DOGS.filter((d) => dogIds.includes(d.id)),
    [dogIds]
  );

  if (!hydrated) {
    return (
      <div className="py-20 text-center text-ink-soft font-display font-bold">טוען...</div>
    );
  }

  const totalCount = favBreeds.length + favDogs.length;

  if (totalCount === 0) {
    return (
      <div className="rounded-[28px] border-2 border-border bg-surface p-10 text-center shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)]">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[24px] bg-rose/15 border-2 border-rose/40 mb-4">
          <Heart className="w-10 h-10 text-rose" strokeWidth={2} aria-hidden />
        </div>
        <h2 className="text-2xl font-black text-ink">עדיין אין לך מועדפים 💛</h2>
        <p className="mt-2 text-ink-soft font-medium max-w-md mx-auto">
          לחץ על הלב בכרטיס של כל גזע שמוצא חן בעיניך כדי לשמור אותו לעיון עתידי.
        </p>
        <Link
          href="/breeds"
          className="mt-6 inline-flex items-center gap-2 bg-primary text-white border-2 border-primary-deep px-6 py-3 rounded-[20px] font-display font-extrabold shadow-[var(--shadow-glow-primary)] hover:-translate-y-0.5 transition-transform"
        >
          לדפדף בגזעים
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  function clearAll() {
    if (confirm(`למחוק את כל ${totalCount} המועדפים?`)) {
      clear();
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm text-ink-soft font-display font-bold">
          <span className="text-primary-deep">{totalCount}</span> מועדפים שמורים
        </div>
        <div className="flex items-center gap-3">
          {favBreeds.length >= 2 && tab === "breeds" && (
            <Link
              href={`/compare?a=${favBreeds[0].slug}&b=${favBreeds[1].slug}`}
              className="inline-flex items-center gap-1 text-sm text-accent-deep hover:text-accent font-display font-extrabold transition-colors"
            >
              השווה 2 ראשונים
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-rose font-display font-bold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
            ניקוי הכל
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setTab("breeds")}
          className={
            tab === "breeds"
              ? "bg-primary text-white border-2 border-primary-deep px-4 py-2 rounded-full font-display font-extrabold text-sm shadow-[0_2px_0_var(--color-primary-deep)]"
              : "bg-bg-soft text-ink border-2 border-border-strong px-4 py-2 rounded-full font-display font-bold text-sm hover:bg-primary-tint"
          }
        >
          גזעים ({favBreeds.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("dogs")}
          className={
            tab === "dogs"
              ? "bg-primary text-white border-2 border-primary-deep px-4 py-2 rounded-full font-display font-extrabold text-sm shadow-[0_2px_0_var(--color-primary-deep)]"
              : "bg-bg-soft text-ink border-2 border-border-strong px-4 py-2 rounded-full font-display font-bold text-sm hover:bg-primary-tint"
          }
        >
          כלבים לאימוץ ({favDogs.length})
        </button>
      </div>

      {tab === "breeds" && (
        favBreeds.length === 0 ? (
          <p className="text-ink-soft font-medium py-8 text-center">
            עדיין לא סימנתם גזעים. דפדפו ב<Link href="/breeds" className="text-primary-deep underline">/breeds</Link>.
          </p>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {favBreeds.map((b) => (
                <motion.div
                  key={b.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85, y: -20 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <Link
                    href={`/breed/${b.slug}`}
                    className="group block rounded-[22px] border-2 border-border bg-surface p-3 text-center shadow-[var(--shadow-clay),var(--shadow-inner-clay)] hover:-translate-y-1 hover:border-border-strong transition-all"
                  >
                    <div className="flex justify-center mb-2.5 group-hover:scale-105 transition-transform">
                      <BreedPhoto breed={b} size={140} rounded="rounded-[18px]" />
                    </div>
                    <div className="font-display font-extrabold text-sm text-ink leading-tight">
                      {b.name}
                    </div>
                    <div className="mt-1.5 flex items-center justify-center gap-1.5">
                      <Pill tone="neutral" className="!px-2 !py-0.5 !text-[10px] !shadow-none">
                        {SIZE_LABELS[b.size]}
                      </Pill>
                    </div>
                  </Link>
                  <div className="absolute top-2 right-2 z-10">
                    <FavoriteButton
                      slug={b.slug}
                      breedName={b.name}
                      size="sm"
                      stopPropagation
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )
      )}

      {tab === "dogs" && (
        favDogs.length === 0 ? (
          <p className="text-ink-soft font-medium py-8 text-center">
            עדיין לא סימנתם כלבים זמינים. דפדפו ב<Link href="/adopt" className="text-primary-deep underline">/adopt</Link>.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {favDogs.map((d) => <DogCard key={d.id} dog={d} />)}
          </div>
        )
      )}
    </div>
  );
}
