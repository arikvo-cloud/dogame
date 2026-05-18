"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart } from "lucide-react";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { cn } from "@/lib/cn";

interface Props {
  className?: string;
}

/**
 * Heart icon link to /favorites with a count badge.
 * Renders nothing visible until hydrated to avoid SSR/client mismatch.
 */
export function FavoritesBadge({ className }: Props) {
  const slugs = useFavoritesStore((s) => s.slugs);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const count = hydrated ? slugs.length : 0;
  const active = count > 0;

  return (
    <Link
      href="/favorites"
      aria-label={`המועדפים שלי${active ? ` (${count})` : ""}`}
      className={cn(
        "relative inline-flex items-center justify-center w-10 h-10 rounded-[12px] border-2 transition-colors",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        active
          ? "bg-rose/15 text-rose border-rose/50 hover:bg-rose/20"
          : "bg-surface text-ink-soft border-border-strong hover:text-rose hover:border-rose/50",
        className
      )}
    >
      <Heart className="w-4 h-4" strokeWidth={2.5} fill={active ? "currentColor" : "transparent"} />
      <AnimatePresence>
        {hydrated && count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="absolute -top-1.5 -left-1.5 min-w-[18px] h-[18px] inline-flex items-center justify-center bg-primary text-white text-[10px] font-display font-black rounded-full px-1 border-2 border-bg"
            aria-hidden
          >
            {count > 99 ? "99+" : count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
