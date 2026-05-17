"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/cn";

interface AnimatedHeadlineProps {
  /** Words to stagger in. Use `accent: true` to highlight a word. */
  words: Array<{ text: string; accent?: boolean; underline?: boolean }>;
  className?: string;
  /** Delay before stagger begins (s) */
  delay?: number;
  as?: "h1" | "h2";
  /** Render children after the last word (e.g. emoji) */
  children?: ReactNode;
}

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0 },
  },
};

const wordVariant: Variants = {
  hidden: { y: 28, opacity: 0, rotateX: -25 },
  visible: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: { type: "spring", stiffness: 220, damping: 22 },
  },
};

const underlineVariant: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Word-by-word reveal headline.
 * Each word slides up + fades. Optional underline drawn under accented words.
 */
export function AnimatedHeadline({
  words,
  className,
  delay = 0,
  as = "h1",
  children,
}: AnimatedHeadlineProps) {
  const Tag = as === "h1" ? motion.h1 : motion.h2;
  return (
    <Tag
      className={cn("inline-block", className)}
      initial="hidden"
      animate="visible"
      variants={container}
      transition={{ delayChildren: delay }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-baseline mx-[0.18em] first:mr-0 last:ml-0">
          <motion.span
            variants={wordVariant}
            className={cn(
              "inline-block",
              w.underline && "relative whitespace-nowrap"
            )}
          >
            {w.accent ? (
              <span className="text-primary-deep relative z-10">{w.text}</span>
            ) : (
              w.text
            )}
            {w.underline && (
              <motion.span
                aria-hidden
                className="absolute -bottom-2 right-0 left-0 h-3 md:h-4 rounded-full -z-0 origin-right"
                style={{ background: "#FED7AA" }}
                variants={underlineVariant}
              />
            )}
          </motion.span>
        </span>
      ))}
      {children}
    </Tag>
  );
}
