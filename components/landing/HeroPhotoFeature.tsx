"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowLeft, CheckCircle2, Star } from "lucide-react";
import { BREEDS } from "@/lib/breeds/data";
import { proxyImage } from "@/lib/image-proxy";
import { cn } from "@/lib/cn";
import type { Breed } from "@/lib/breeds/types";

/**
 * Hand-picked breed slugs that have great hero-quality photos.
 * Order is randomized per visit so the hero feels fresh.
 */
const FEATURE_SLUGS = [
  "golden",
  "labrador",
  "border-collie",
  "canaan",
  "vizsla",
  "bichon-frise",
];

const ROTATION_MS = 8000;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function HeroPhotoFeature() {
  const reduced = useReducedMotion();

  // Stable initial order on first render to avoid hydration mismatch,
  // then shuffle once on the client.
  const [orderedBreeds, setOrderedBreeds] = useState<Breed[]>(() =>
    FEATURE_SLUGS.map((slug) => BREEDS.find((b) => b.slug === slug)!).filter(
      Boolean
    )
  );
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setOrderedBreeds((prev) => shuffle(prev));
  }, []);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setActiveIdx((i) => (i + 1) % orderedBreeds.length);
    }, ROTATION_MS);
    return () => window.clearInterval(id);
  }, [reduced, orderedBreeds.length]);

  if (orderedBreeds.length === 0) return null;
  const current = orderedBreeds[activeIdx];

  return (
    <div className="relative">
      {/* Photo frame — generous aspect, subtle border + clay shadow */}
      <div className="relative aspect-[4/5] max-w-md mx-auto rounded-[28px] overflow-hidden border-2 border-border-strong shadow-[var(--shadow-clay-xl)]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={current.slug}
            initial={reduced ? false : { opacity: 0, scale: 1.06 }}
            animate={
              reduced
                ? undefined
                : { opacity: 1, scale: 1, transition: { duration: 1.2, ease: "easeOut" } }
            }
            exit={reduced ? undefined : { opacity: 0, transition: { duration: 0.6 } }}
            className="absolute inset-0"
          >
            {current.imageUrl ? (
              <Image
                src={proxyImage(current.imageUrl, { w: 600, h: 750 })}
                alt={`${current.name} — ${current.tagline}`}
                fill
                sizes="(max-width: 768px) 90vw, 28rem"
                className="object-cover"
                priority={activeIdx === 0}
                unoptimized
              />
            ) : null}
            {/* Soft bottom gradient for caption legibility */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
            />
          </motion.div>
        </AnimatePresence>

        {/* Floating badges */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-success text-white border-2 border-success/80 px-3 py-1.5 rounded-full font-display font-extrabold text-xs shadow-[0_2px_0_rgba(20,83,45,0.4)] z-10">
          <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={3} />
          100% חינמי
        </div>
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-accent text-white border-2 border-accent-deep px-3 py-1.5 rounded-full font-display font-extrabold text-xs shadow-[0_2px_0_var(--color-accent-deep)] z-10">
          <Star className="w-3.5 h-3.5 fill-current" strokeWidth={0} />
          3-5 גזעים
        </div>

        {/* Photo caption — current breed name + tagline */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.slug}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-x-0 bottom-0 p-5 text-white z-10"
          >
            <div className="text-[11px] tracking-[0.2em] uppercase font-display font-bold text-white/80">
              לדוגמה
            </div>
            <Link
              href={`/breed/${current.slug}`}
              className="inline-flex items-baseline gap-2 mt-1 group"
            >
              <span className="font-display font-extrabold text-2xl md:text-3xl text-white drop-shadow-md">
                {current.name}
              </span>
              <ArrowLeft className="w-4 h-4 text-white/80 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div className="text-sm text-white/85 font-medium mt-0.5 drop-shadow line-clamp-1">
              {current.tagline}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Rotation indicator dots */}
        {!reduced && orderedBreeds.length > 1 && (
          <div className="absolute bottom-3 right-1/2 translate-x-1/2 flex items-center gap-1 z-10">
            {orderedBreeds.map((b, i) => (
              <button
                key={b.slug}
                type="button"
                onClick={() => setActiveIdx(i)}
                aria-label={`עבור לתמונה של ${b.name}`}
                className={cn(
                  "rounded-full transition-all",
                  i === activeIdx
                    ? "w-6 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Photo credit (small, restrained) */}
      <div className="mt-3 text-center text-[11px] text-ink-mute font-medium">
        תמונות מויקיפדיה · רישיון CC
      </div>
    </div>
  );
}
