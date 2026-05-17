"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/cn";

interface Props {
  children: ReactNode;
  className?: string;
}

/**
 * Subtle parallax for the hero mascot panel.
 * As the page scrolls, the mascot drifts upward and tilts very slightly.
 * Disabled for reduced-motion preference.
 */
export function HeroParallax({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -3]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  return (
    <div ref={ref} className={cn(className)}>
      <motion.div
        style={reduced ? undefined : { y, rotate, scale }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
