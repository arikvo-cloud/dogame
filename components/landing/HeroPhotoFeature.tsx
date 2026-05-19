"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { dogsOfTheWeek } from "@/lib/dogs/helpers";
import { getShelterById } from "@/lib/shelters/data";
import { proxyImage } from "@/lib/image-proxy";
import { cn } from "@/lib/cn";
import type { AdoptableDog } from "@/lib/dogs/types";

const AUTO_ROTATE_MS = 10000;
const SWIPE_THRESHOLD = 80; // px to commit a swipe

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Tinder-style adoptable dog browser.
 * - Big photo of the dog (full dog visible — uses object-contain on a
 *   neutral background so nothing gets cropped).
 * - Drag/swipe left or right to switch dogs (snaps back to center).
 * - Auto-rotates every 10s unless the user is interacting (paused on
 *   hover / drag).
 * - Caption with dog name + breed + shelter city below the photo.
 */
export function HeroPhotoFeature() {
  const reduced = useReducedMotion();
  // TODO 5.x: re-enable for dog favorites
  // const toast = useToast();
  // const favSlugs = useFavoritesStore((s) => s.slugs);
  // const toggleFav = useFavoritesStore((s) => s.toggle);

  const [orderedDogs, setOrderedDogs] = useState<AdoptableDog[]>(() =>
    dogsOfTheWeek(8)
  );
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dir, setDir] = useState<1 | -1>(-1); // animation direction
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-8, 0, 8]);
  const opacity = useTransform(x, [-220, -120, 0, 120, 220], [0.4, 0.7, 1, 0.7, 0.4]);

  const cardVariants = {
    enter: (d: number) => ({
      x: d > 0 ? -320 : 320,
      opacity: 0,
      rotate: d > 0 ? -12 : 12,
    }),
    center: { x: 0, opacity: 1, rotate: 0 },
    exit: (d: number) => ({
      x: d > 0 ? 320 : -320,
      opacity: 0,
      rotate: d > 0 ? 12 : -12,
      transition: { duration: 0.22, ease: [0.4, 0, 1, 1] as const },
    }),
  };

  useEffect(() => {
    setOrderedDogs((prev) => shuffle(prev));
  }, []);

  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(() => {
      setDir(-1);
      setActiveIdx((i) => (i + 1) % orderedDogs.length);
    }, AUTO_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reduced, paused, orderedDogs.length]);

  if (orderedDogs.length === 0) return null;
  const current = orderedDogs[activeIdx];

  function next() {
    setDir(-1);
    setActiveIdx((i) => (i + 1) % orderedDogs.length);
  }
  function prev() {
    setDir(1);
    setActiveIdx((i) => (i - 1 + orderedDogs.length) % orderedDogs.length);
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    const swipe = info.offset.x;
    if (swipe < -SWIPE_THRESHOLD) {
      next();
    } else if (swipe > SWIPE_THRESHOLD) {
      prev();
    }
    x.set(0);
  }

  // TODO 5.x: re-enable handleFavorite for dog favorites
  // function handleFavorite() {
  //   const nowFav = toggleFav(current.id);
  //   track.favoriteToggle(current.id, nowFav);
  //   toast.show(
  //     nowFav ? `${current.name} נוסף למועדפים 💛` : `${current.name} הוסר מהמועדפים`,
  //     nowFav ? "success" : "info"
  //   );
  // }

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Card stack — current card is the visible one with swipe */}
        <div className="relative aspect-[5/5] md:aspect-[4/5] select-none">
          <AnimatePresence initial={false} custom={dir} mode="wait">
            <motion.div
              key={current.id}
              custom={dir}
              drag={reduced ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.3}
              onDragStart={() => setPaused(true)}
              onDragEnd={handleDragEnd}
              style={{ x, rotate, opacity }}
              variants={reduced ? undefined : cardVariants}
              initial={reduced ? false : "enter"}
              animate={reduced ? { x: 0, opacity: 1, rotate: 0 } : "center"}
              exit={reduced ? undefined : "exit"}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <Link
                href={`/dog/${current.id}`}
                draggable={false}
                className="block w-full h-full rounded-[28px] overflow-hidden border border-border shadow-[var(--shadow-clay-xl)] photo-skeleton"
                style={{ background: "var(--color-bg-soft)" }}
              >
                {current.imageUrl ? (
                  <Image
                    src={proxyImage(current.imageUrl, { w: 700, h: 875, fit: "contain" })}
                    alt={`${current.name} — ${current.breedDisplay}`}
                    fill
                    sizes="(max-width: 768px) 90vw, 36rem"
                    className="object-contain relative z-[1] pointer-events-none"
                    priority
                    unoptimized
                    draggable={false}
                  />
                ) : null}
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Prev / next chevrons (desktop) */}
          <button
            type="button"
            onClick={prev}
            aria-label="הקודם"
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-surface/90 backdrop-blur text-ink border border-border shadow-md hover:scale-105 hover:bg-surface transition-transform"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="הבא"
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-surface/90 backdrop-blur text-ink border border-border shadow-md hover:scale-105 hover:bg-surface transition-transform"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Caption */}
        <div className="mt-4 flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: 8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-[10px] tracking-[0.2em] uppercase font-display font-bold text-ink-mute">
                  כלב לאימוץ
                </div>
                <Link
                  href={`/dog/${current.id}`}
                  className="group inline-flex items-baseline gap-1.5 mt-0.5"
                >
                  <span className="font-display font-extrabold text-2xl md:text-3xl text-ink leading-tight">
                    {current.name}
                  </span>
                  <ChevronLeft
                    aria-hidden
                    className="w-4 h-4 text-ink-mute group-hover:-translate-x-1 transition-transform"
                  />
                </Link>
                <p className="mt-1 text-sm text-ink-soft font-medium leading-snug line-clamp-2">
                  {current.breedDisplay} · {getShelterById(current.shelterId)?.city ?? ""}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* TODO 5.x: re-enable heart button for dog favorites */}
        </div>

        {/* Dot indicators + swipe hint */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {orderedDogs.map((d, i) => (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  setDir(i > activeIdx ? -1 : 1);
                  setActiveIdx(i);
                }}
                aria-label={`עבור ל-${d.name}`}
                className={cn(
                  "rounded-full transition-all",
                  i === activeIdx ? "w-6 h-1.5 bg-ink" : "w-1.5 h-1.5 bg-ink/25 hover:bg-ink/50"
                )}
              />
            ))}
          </div>
          <div className="text-[10px] tracking-[0.15em] uppercase font-display font-bold text-ink-mute hidden sm:block">
            ← החלק כדי לדפדף →
          </div>
        </div>
      </div>
    </div>
  );
}
