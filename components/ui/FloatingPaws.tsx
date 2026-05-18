"use client";

import { useMemo } from "react";
import { useReducedMotion } from "motion/react";

interface Props {
  count?: number;
  /** className applied to the container; should be positioned (absolute/fixed) */
  className?: string;
}

/**
 * Decorative scattered paws. Static positions, CSS keyframe animation
 * (no motion-js, no infinite JS loop). Disabled on small screens and for
 * reduced-motion. Each paw uses transform+opacity only — GPU-cheap.
 */
export function FloatingPaws({ count = 6, className }: Props) {
  const reduced = useReducedMotion();
  const items = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: 5 + ((i * 37) % 90),
      top: 8 + ((i * 53) % 80),
      size: 18 + (i % 3) * 6,
      rotate: ((i * 41) % 40) - 20,
      delay: (i * 0.8) % 6,
      char: i % 4 === 0 ? "✨" : "🐾",
    }));
  }, [count]);

  return (
    <div
      aria-hidden
      className={className}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {items.map((p) => (
        <span
          key={p.id}
          className="floating-paw hidden md:inline-block"
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: `${p.top}%`,
            fontSize: p.size,
            transform: `rotate(${p.rotate}deg)`,
            opacity: 0.22,
            animationDelay: reduced ? "0s" : `-${p.delay}s`,
            animationPlayState: reduced ? "paused" : "running",
            userSelect: "none",
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  );
}
