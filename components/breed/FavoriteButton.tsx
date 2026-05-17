"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Heart } from "lucide-react";
import { useFavorite } from "@/store/useFavoritesStore";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

interface Props {
  slug: string;
  breedName: string;
  /** Visual size — sm: compact for card overlay; md: standard */
  size?: "sm" | "md";
  className?: string;
  /** Stop event propagation when used inside a Link */
  stopPropagation?: boolean;
}

/**
 * Heart button that toggles a breed in favorites (localStorage).
 * Bursts a small heart on activation. Respects reduced-motion.
 */
export function FavoriteButton({
  slug,
  breedName,
  size = "md",
  className,
  stopPropagation,
}: Props) {
  const { isFavorite, toggle } = useFavorite(slug);
  const reduced = useReducedMotion();
  const toast = useToast();
  const [hydrated, setHydrated] = useState(false);
  const [burst, setBurst] = useState(0);

  useEffect(() => setHydrated(true), []);

  function onClick(e: React.MouseEvent) {
    if (stopPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }
    const nowFavorite = toggle();
    if (nowFavorite) {
      setBurst((n) => n + 1);
      toast.show(`${breedName} נוסף למועדפים 💛`, "success");
    } else {
      toast.show(`${breedName} הוסר מהמועדפים`, "info");
    }
  }

  const sizes = size === "sm" ? "w-9 h-9 rounded-[12px]" : "w-11 h-11 rounded-[16px]";
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `הסר את ${breedName} ממועדפים` : `הוסף את ${breedName} למועדפים`}
      className={cn(
        "relative inline-flex items-center justify-center border-[3px] transition-all cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        sizes,
        // Avoid flashing the wrong state during SSR/hydration
        hydrated && isFavorite
          ? "bg-rose text-white border-rose shadow-[0_3px_0_#C2410C]"
          : "bg-surface text-ink-soft border-border-strong shadow-[var(--shadow-clay-sm)] hover:text-rose hover:border-rose",
        className
      )}
    >
      <Heart
        className={cn(iconSize, "transition-transform")}
        strokeWidth={2.5}
        fill={hydrated && isFavorite ? "currentColor" : "transparent"}
      />
      {!reduced && (
        <AnimatePresence>
          {burst > 0 && (
            <motion.span
              key={burst}
              initial={{ opacity: 0, scale: 0.4, y: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0.4, 1.4, 1.6], y: -28 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="pointer-events-none absolute text-rose"
              aria-hidden
              onAnimationComplete={() => setBurst(0)}
            >
              <Heart className="w-5 h-5" fill="currentColor" strokeWidth={0} />
            </motion.span>
          )}
        </AnimatePresence>
      )}
    </button>
  );
}
