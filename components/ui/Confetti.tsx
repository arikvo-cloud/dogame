"use client";

import { useEffect } from "react";
import { useReducedMotion } from "motion/react";

interface ConfettiProps {
  /** How many particles per burst. Default 80. */
  count?: number;
  /** Burst duration (s) */
  duration?: number;
  /** Color palette */
  colors?: string[];
  /** When `key` changes, re-fires. Defaults to 1 fire on mount. */
  trigger?: number;
}

const DEFAULT_COLORS = [
  "#F97316", // primary orange
  "#2563EB", // accent blue
  "#16A34A", // success green
  "#FB923C", // primary soft
  "#E8B14A", // mustard
  "#E8826B", // rose
];

/**
 * Realistic canvas confetti burst — uses the `canvas-confetti` library so
 * each particle has physics (gravity, rotation, drift) rather than fake
 * motion-div animations. Fires once on mount unless `trigger` is changed.
 */
export function Confetti({
  count = 80,
  duration = 1.6,
  colors = DEFAULT_COLORS,
  trigger,
}: ConfettiProps) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;

    (async () => {
      const confetti = (await import("canvas-confetti")).default;
      if (cancelled) return;

      // Two staggered side bursts give a more natural "celebration" feel
      // than a single center pop.
      const defaults = {
        colors,
        startVelocity: 35,
        spread: 70,
        ticks: Math.round(duration * 60),
        gravity: 1.05,
        scalar: 1,
        zIndex: 50,
      };

      confetti({
        ...defaults,
        particleCount: Math.round(count * 0.55),
        origin: { x: 0.3, y: 0.5 },
        angle: 60,
      });
      confetti({
        ...defaults,
        particleCount: Math.round(count * 0.55),
        origin: { x: 0.7, y: 0.5 },
        angle: 120,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [count, duration, colors, reduced, trigger]);

  // No DOM — canvas-confetti injects its own canvas overlay.
  return null;
}
