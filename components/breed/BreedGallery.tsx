"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Breed } from "@/lib/breeds/types";
import { cn } from "@/lib/cn";

interface Props {
  breed: Breed;
}

/**
 * Wikimedia gallery viewer.
 * - Renders all gallery photos as a responsive grid of thumbnails.
 * - Clicking a thumb opens a full-screen lightbox with arrow nav + ESC close.
 * - Includes the lead `imageUrl` as the first photo so the lightbox sees it too.
 */
export function BreedGallery({ breed }: Props) {
  const photos = [
    ...(breed.imageUrl
      ? [{ url: breed.imageUrl, width: breed.imageWidth ?? 800, height: breed.imageHeight ?? 600 }]
      : []),
    ...(breed.gallery ?? []),
  ];

  // De-dupe by URL just in case
  const seen = new Set<string>();
  const uniquePhotos = photos.filter((p) => {
    if (seen.has(p.url)) return false;
    seen.add(p.url);
    return true;
  });

  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const open = activeIdx !== null;

  // Keyboard nav: ESC closes, arrows navigate
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveIdx(null);
      else if (e.key === "ArrowLeft") {
        setActiveIdx((i) =>
          i === null ? null : (i + 1) % uniquePhotos.length
        );
      } else if (e.key === "ArrowRight") {
        setActiveIdx((i) =>
          i === null
            ? null
            : (i - 1 + uniquePhotos.length) % uniquePhotos.length
        );
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, uniquePhotos.length]);

  if (uniquePhotos.length <= 1) return null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {uniquePhotos.slice(1).map((p, i) => (
          <button
            key={p.url}
            type="button"
            onClick={() => setActiveIdx(i + 1)}
            className={cn(
              "group relative aspect-square overflow-hidden rounded-[18px] border-[3px] border-border-strong",
              "shadow-[inset_0_2px_0_rgba(255,255,255,0.5),0_3px_0_var(--color-border-strong)]",
              "cursor-zoom-in transition-transform hover:-translate-y-1",
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            )}
            aria-label={`הצג תמונה ${i + 2} של ${breed.name}`}
          >
            <Image
              src={p.url}
              alt={`${breed.name} — תמונה ${i + 2}`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              unoptimized
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-ink/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveIdx(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`גלריית תמונות של ${breed.name}`}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setActiveIdx(null)}
              className="absolute top-4 left-4 w-12 h-12 inline-flex items-center justify-center rounded-full bg-surface border-[3px] border-border-strong text-ink shadow-[var(--shadow-clay)] hover:scale-105 transition-transform"
              aria-label="סגירה"
            >
              <X className="w-5 h-5" strokeWidth={3} />
            </button>

            {/* Prev / next */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIdx((i) =>
                  i === null ? null : (i + 1) % uniquePhotos.length
                );
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 inline-flex items-center justify-center rounded-full bg-surface border-[3px] border-border-strong text-ink shadow-[var(--shadow-clay)] hover:scale-105 transition-transform z-10"
              aria-label="הקודמת"
            >
              <ChevronRight className="w-6 h-6" strokeWidth={3} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIdx((i) =>
                  i === null
                    ? null
                    : (i - 1 + uniquePhotos.length) % uniquePhotos.length
                );
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 inline-flex items-center justify-center rounded-full bg-surface border-[3px] border-border-strong text-ink shadow-[var(--shadow-clay)] hover:scale-105 transition-transform z-10"
              aria-label="הבאה"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={3} />
            </button>

            <motion.div
              key={activeIdx}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-5xl w-full max-h-[85vh] aspect-square sm:aspect-[4/3] bg-surface rounded-[24px] overflow-hidden border-[4px] border-border-strong"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={uniquePhotos[activeIdx].url}
                alt={`${breed.name} — תמונה ${activeIdx + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                unoptimized
              />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-surface/95 border-2 border-border-strong rounded-full px-3 py-1 font-display font-bold text-sm text-ink">
                {activeIdx + 1} / {uniquePhotos.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
