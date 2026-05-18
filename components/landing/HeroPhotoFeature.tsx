"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { BREEDS } from "@/lib/breeds/data";
import { proxyImage } from "@/lib/image-proxy";
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

const ROTATION_MS = 9000;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Editorial hero photo. Strips down to ONLY the photo + a tiny breed name
 * pill in the bottom corner. No floating badges, no dot indicators, no
 * captions — those moved out of the photo (the badges live next to the
 * CTAs now). The photo carries itself.
 */
export function HeroPhotoFeature() {
  const reduced = useReducedMotion();

  // Stable initial order on SSR, shuffle on client mount.
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
    <div className="relative w-full max-w-xl mx-auto">
      <Link
        href={`/breed/${current.slug}`}
        aria-label={`למידע על ${current.name}`}
        className="group relative block aspect-[4/5] rounded-[28px] overflow-hidden border border-border bg-bg-soft shadow-[var(--shadow-clay-xl)]"
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={current.slug}
            initial={reduced ? false : { opacity: 0, scale: 1.04 }}
            animate={
              reduced
                ? undefined
                : {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 1.4, ease: "easeOut" },
                  }
            }
            exit={reduced ? undefined : { opacity: 0, transition: { duration: 0.7 } }}
            className="absolute inset-0"
          >
            {current.imageUrl ? (
              <Image
                src={proxyImage(current.imageUrl, { w: 700, h: 875 })}
                alt={`${current.name} — ${current.tagline}`}
                fill
                sizes="(max-width: 768px) 90vw, 36rem"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority={activeIdx === 0}
                unoptimized
              />
            ) : null}
          </motion.div>
        </AnimatePresence>

        {/* Subtle bottom shadow for the name pill */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
        />

        {/* Minimal name pill — just the breed name + tiny arrow on hover */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.slug}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: 8 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-ink text-sm font-display font-extrabold shadow-md"
          >
            {current.name}
            <span
              aria-hidden
              className="text-ink-mute group-hover:-translate-x-1 transition-transform"
            >
              ←
            </span>
          </motion.div>
        </AnimatePresence>
      </Link>
    </div>
  );
}
