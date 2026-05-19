"use client";

import { motion, useReducedMotion } from "motion/react";

type Tone = "warm" | "primary" | "accent" | "ink";

interface BlobDividerProps {
  tone?: Tone;
  flip?: boolean;
  className?: string;
}

const toneFill: Record<Tone, string> = {
  warm: "var(--color-bg-soft)",
  primary: "var(--color-primary-tint)",
  accent: "var(--color-accent-tint)",
  ink: "var(--color-ink)",
};

const PATH_A =
  "M0,40 C180,80 360,0 540,40 C720,80 900,10 1080,50 C1260,90 1320,40 1440,40 L1440,120 L0,120 Z";
const PATH_B =
  "M0,55 C180,15 360,75 540,30 C720,60 900,90 1080,40 C1260,15 1320,60 1440,50 L1440,120 L0,120 Z";

/** Liquid SVG divider that morphs between two wave shapes.
 *  Pairs sections with subtly different tones. Respects reduced motion. */
export function BlobDivider({ tone = "warm", flip = false, className }: BlobDividerProps) {
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden
      className={className}
      style={{
        width: "100%",
        height: "clamp(48px, 7vw, 96px)",
        lineHeight: 0,
        transform: flip ? "scaleY(-1)" : undefined,
      }}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "100%" }}
      >
        <motion.path
          d={PATH_A}
          fill={toneFill[tone]}
          initial={false}
          animate={reduced ? { d: PATH_A } : { d: [PATH_A, PATH_B, PATH_A] }}
          transition={
            reduced
              ? undefined
              : { duration: 18, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </svg>
    </div>
  );
}
