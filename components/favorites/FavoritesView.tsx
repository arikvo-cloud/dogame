"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Heart, ArrowLeft, Trash2 } from "lucide-react";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { BREEDS } from "@/lib/breeds/data";
import { BreedPhoto } from "@/components/breed/BreedPhoto";
import { FavoriteButton } from "@/components/breed/FavoriteButton";
import { Pill } from "@/components/ui/Pill";

const SIZE_LABELS: Record<string, string> = {
  toy: "זעיר",
  small: "קטן",
  medium: "בינוני",
  large: "גדול",
  giant: "ענק",
};

export function FavoritesView() {
  const [hydrated, setHydrated] = useState(false);
  const slugs = useFavoritesStore((s) => s.breedSlugs);
  const clear = useFavoritesStore((s) => s.clear);

  useEffect(() => setHydrated(true), []);

  if (!hydrated) {
    return (
      <div className="py-20 text-center text-ink-soft font-display font-bold">טוען...</div>
    );
  }

  const favorites = slugs
    .map((slug) => BREEDS.find((b) => b.slug === slug))
    .filter((b): b is NonNullable<typeof b> => b !== undefined);

  if (favorites.length === 0) {
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
    if (confirm(`למחוק את כל ${favorites.length} המועדפים?`)) {
      clear();
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm text-ink-soft font-display font-bold">
          <span className="text-primary-deep">{favorites.length}</span> גזעים שמורים
        </div>
        <div className="flex items-center gap-3">
          {favorites.length >= 2 && (
            <Link
              href={`/compare?a=${favorites[0].slug}&b=${favorites[1].slug}`}
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

      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {favorites.map((b) => (
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
    </div>
  );
}
