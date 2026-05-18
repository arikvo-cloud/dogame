"use client";

import Link from "next/link";
import Image from "next/image";
import { BREEDS } from "@/lib/breeds/data";
import { cn } from "@/lib/cn";
import { proxyImage } from "@/lib/image-proxy";

/**
 * Auto-scrolling band of breed photos.
 * Two duplicate strips slide left infinitely with a CSS animation,
 * giving a seamless loop. Gradient masks fade the edges. Pauses on hover.
 * Each photo is a Link to the breed page.
 *
 * Performance: each `<Image>` is `unoptimized` (Wikimedia) and `loading="lazy"`.
 * The animation uses transform only — GPU-composited.
 */
export function BreedMarquee() {
  // Show fewer photos on small screens (network/perf) — 12 vs 24.
  const items = BREEDS.filter((b) => b.imageUrl).slice(0, 24);

  return (
    <section
      aria-label="כל הגזעים במאגר"
      className="relative overflow-hidden py-6 md:py-10 border-y-2 border-border bg-surface-tint/60 group/marquee"
    >
      {/* Edge fades */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-bg to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-bg to-transparent"
      />

      <div className="marquee-track flex gap-4 md:gap-5 will-change-transform">
        {/* Render twice for seamless loop */}
        {[0, 1].map((dup) => (
          <ul
            key={dup}
            className="flex gap-4 md:gap-5 shrink-0"
            aria-hidden={dup === 1}
          >
            {items.map((b) => (
              <li key={`${dup}-${b.slug}`}>
                <MarqueeTile breed={b} eager={dup === 0} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}

function MarqueeTile({
  breed,
  eager,
}: {
  breed: (typeof BREEDS)[number];
  eager?: boolean;
}) {
  return (
    <Link
      href={`/breed/${breed.slug}`}
      className={cn(
        "relative block w-32 h-32 md:w-44 md:h-44 rounded-[20px] overflow-hidden",
        "border-2 border-border-strong shadow-[var(--shadow-clay-sm),var(--shadow-inner-clay)]",
        "transition-transform duration-300 hover:scale-[1.04] hover:-translate-y-1",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      )}
      style={{ background: `${breed.accent}26` }}
    >
      {breed.imageUrl ? (
        <Image
          src={proxyImage(breed.imageUrl, { w: 180, h: 180 })}
          alt={breed.name}
          fill
          sizes="176px"
          className="object-cover transition-transform duration-500 hover:scale-110"
          loading={eager ? "eager" : "lazy"}
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-5xl">
          {breed.emoji}
        </div>
      )}
      {/* Caption overlay (visible on hover) */}
      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-ink/85 to-transparent opacity-0 hover:opacity-100 transition-opacity">
        <div className="text-white text-xs font-display font-extrabold text-center truncate">
          {breed.name}
        </div>
      </div>
    </Link>
  );
}
