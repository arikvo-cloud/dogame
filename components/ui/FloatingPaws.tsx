"use client";

import { useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

interface Props {
  count?: number;
  /** className applied to the container; should be positioned (absolute/fixed) */
  className?: string;
}

/**
 * Decorative drifting paws/sparkles. Pauses (unmounts particles) when off-screen
 * via useInView. Respects reduced-motion (renders static low-opacity).
 */
export function FloatingPaws({ count = 8, className }: Props) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { amount: 0, margin: "0px" });

  const items = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: 5 + Math.random() * 90,
      top: 5 + Math.random() * 80,
      size: 18 + Math.random() * 22,
      rotate: (Math.random() - 0.5) * 40,
      duration: 9 + Math.random() * 8,
      delay: -Math.random() * 6,
      driftX: (Math.random() - 0.5) * 60,
      driftY: -30 - Math.random() * 50,
      char: i % 4 === 0 ? "✨" : "🐾",
      opacity: 0.16 + Math.random() * 0.18,
    }));
  }, [count]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={className}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {inView &&
        items.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 0, x: 0, y: 0, rotate: p.rotate }}
            animate={
              reduced
                ? { opacity: p.opacity }
                : {
                    opacity: [0, p.opacity, p.opacity, 0],
                    x: [0, p.driftX, p.driftX],
                    y: [0, p.driftY, p.driftY],
                    rotate: [p.rotate, p.rotate + 25, p.rotate + 50],
                  }
            }
            transition={
              reduced
                ? undefined
                : {
                    duration: p.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: p.delay,
                  }
            }
            style={{
              position: "absolute",
              left: `${p.left}%`,
              top: `${p.top}%`,
              fontSize: p.size,
              userSelect: "none",
              filter: "drop-shadow(0 1px 2px rgba(124,45,18,0.08))",
            }}
          >
            {p.char}
          </motion.span>
        ))}
    </div>
  );
}
