"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";

interface ConfettiProps {
  /** Number of particles. Default 28. */
  count?: number;
  /** Burst duration (s) */
  duration?: number;
  /** Color palette */
  colors?: string[];
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
 * One-shot confetti burst from the center of its parent.
 * Particles fly outward with gravity-like drop. Auto-cleans on animation end.
 * Respects prefers-reduced-motion (renders nothing).
 */
export function Confetti({
  count = 28,
  duration = 1.6,
  colors = DEFAULT_COLORS,
}: ConfettiProps) {
  const reduced = useReducedMotion();
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const distance = 180 + Math.random() * 180;
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        rotate: (Math.random() - 0.5) * 720,
        color: colors[i % colors.length],
        size: 8 + Math.random() * 10,
        shape: i % 3,
        delay: Math.random() * 0.08,
      };
    });
  }, [count, colors]);

  if (reduced) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible"
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
          animate={{
            x: p.x,
            y: [0, p.y * 0.6, p.y + 240],
            scale: [0, 1, 1, 0.6],
            rotate: p.rotate,
            opacity: [1, 1, 0.9, 0],
          }}
          transition={{
            duration,
            delay: p.delay,
            times: [0, 0.4, 0.7, 1],
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.shape === 1 ? p.size * 0.55 : p.size,
            background: p.color,
            borderRadius: p.shape === 2 ? "50%" : 3,
            boxShadow: `0 1px 0 rgba(0,0,0,0.08)`,
          }}
        />
      ))}
    </div>
  );
}
