"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

interface Props {
  children: ReactNode;
  className?: string;
}

/**
 * Subtle radial glow that follows the cursor inside its container.
 * Desktop-only (pointer: fine). Cheap — uses CSS vars + transform on
 * a single absolutely-positioned div, no per-frame React state.
 */
export function CursorSpotlight({ children, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const el = containerRef.current;
    if (!el) return;
    let raf: number | null = null;
    let lastX = 0;
    let lastY = 0;

    function onMove(e: PointerEvent) {
      lastX = e.clientX;
      lastY = e.clientY;
      if (raf !== null) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = lastX - rect.left;
        const y = lastY - rect.top;
        el.style.setProperty("--mx", `${x}px`);
        el.style.setProperty("--my", `${y}px`);
      });
    }

    function onEnter() {
      el?.style.setProperty("--ms", "1");
    }
    function onLeave() {
      el?.style.setProperty("--ms", "0");
    }

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: "var(--ms, 0)",
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(249, 115, 22, 0.18), transparent 60%)",
          mixBlendMode: "multiply",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
