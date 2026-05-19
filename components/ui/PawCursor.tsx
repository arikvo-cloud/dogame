"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/** Desktop-only paw cursor that follows the pointer with spring physics.
 *  Hidden on touch devices and under prefers-reduced-motion.
 *  Enlarges over elements with [data-paw-zone] attribute. */
export function PawCursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hot, setHot] = useState(false);
  const rafRef = useRef<number | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.4 });
  const scale = useSpring(1, { stiffness: 300, damping: 20 });

  useEffect(() => {
    if (reduced) return;
    const fine =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;

    function onMove(e: PointerEvent) {
      if (rafRef.current !== null) return;
      const { clientX, clientY } = e;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        x.set(clientX);
        y.set(clientY);
        const t = e.target;
        const inZone =
          t instanceof Element &&
          (t.closest("[data-paw-zone]") !== null ||
            t.closest("a,button") !== null);
        setHot(inZone);
      });
    }
    function onLeave() {
      x.set(-100);
      y.set(-100);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, x, y]);

  useEffect(() => {
    scale.set(hot ? 1.6 : 1);
  }, [hot, scale]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        x: sx,
        y: sy,
        scale,
        pointerEvents: "none",
        zIndex: 9999,
        translateX: "-50%",
        translateY: "-50%",
        mixBlendMode: "multiply",
      }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="var(--color-primary-deep)"
        opacity="0.85"
      >
        {/* Stylized paw — main pad + 4 toes */}
        <ellipse cx="12" cy="15.5" rx="4.2" ry="3.6" />
        <circle cx="6.5" cy="10" r="1.9" />
        <circle cx="9.5" cy="6.4" r="1.7" />
        <circle cx="14.5" cy="6.4" r="1.7" />
        <circle cx="17.5" cy="10" r="1.9" />
      </svg>
    </motion.div>
  );
}
