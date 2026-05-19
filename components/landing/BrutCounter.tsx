"use client";

import { useEffect, useRef, useState } from "react";

interface BrutCounterProps {
  /** Final value to count up to (numeric). For non-numeric like "3–5", pass it directly via fixed. */
  to?: number;
  /** Padded string length for the final number ("37" → "37", padTo:2). */
  padTo?: number;
  /** Use this static value instead of counting. */
  fixed?: string;
  /** Animation duration in ms. Default 900ms. */
  duration?: number;
  /** Number of discrete steps. Default 12 (gives a flickering count feel). */
  steps?: number;
  className?: string;
}

/** Counts up from 0 to `to` in N discrete steps. Mechanical, not smooth.
 *  Triggers on enter view via IntersectionObserver. */
export function BrutCounter({
  to,
  padTo,
  fixed,
  duration = 900,
  steps = 12,
  className,
}: BrutCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string>(
    fixed ?? (padTo ? "0".padStart(padTo, "0") : "0")
  );
  const startedRef = useRef(false);

  useEffect(() => {
    if (fixed || typeof to !== "number" || !ref.current) return;
    const el = ref.current;

    function start() {
      if (startedRef.current) return;
      startedRef.current = true;
      const stepMs = duration / steps;
      let i = 0;
      const id = window.setInterval(() => {
        i++;
        const v = Math.round((to as number) * (i / steps));
        const s = padTo ? String(v).padStart(padTo, "0") : String(v);
        setDisplay(s);
        if (i >= steps) {
          window.clearInterval(id);
          const final = padTo ? String(to).padStart(padTo, "0") : String(to);
          setDisplay(final);
        }
      }, stepMs);
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          start();
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, padTo, fixed, duration, steps]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
