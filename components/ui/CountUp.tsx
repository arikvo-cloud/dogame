"use client";

import { useEffect, useRef } from "react";
import {
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  motion,
  useReducedMotion,
} from "motion/react";

interface CountUpProps {
  /** Target number to count up to */
  to: number;
  /** Optional suffix (e.g. "%", "+") */
  suffix?: string;
  /** Decimal precision */
  decimals?: number;
  /** Stiffness controls speed of the count */
  stiffness?: number;
  /** className passed to the span */
  className?: string;
}

// Locale formatter cached at module scope — avoids per-frame `Intl` allocation.
const formatters = new Map<number, Intl.NumberFormat>();
function getFormatter(decimals: number): Intl.NumberFormat {
  let fmt = formatters.get(decimals);
  if (!fmt) {
    fmt = new Intl.NumberFormat("he-IL", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    formatters.set(decimals, fmt);
  }
  return fmt;
}

/**
 * Animates a number from 0 → `to` when it enters the viewport.
 * Uses a spring for natural deceleration. Respects reduced-motion (jumps).
 */
export function CountUp({
  to,
  suffix = "",
  decimals = 0,
  stiffness = 90,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness, damping: 22, mass: 0.6 });
  const fmt = getFormatter(decimals);
  const text = useTransform(spring, (latest) => fmt.format(latest));

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      mv.set(to);
      spring.set(to);
      return;
    }
    mv.set(to);
  }, [inView, to, mv, spring, reduced]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{text}</motion.span>
      {suffix}
    </span>
  );
}
