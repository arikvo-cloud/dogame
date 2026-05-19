"use client";

import { useEffect, useRef, useState } from "react";

/** Follows the cursor with a red label over elements that have [data-cursor-label].
 *  The data-cursor-label attribute value becomes the label text.
 *  Hidden on touch devices and under prefers-reduced-motion. */
export function CursorLabel() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (fine && !reduced) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    function onMove(e: PointerEvent) {
      const el = ref.current;
      if (!el) return;
      if (rafRef.current !== null) return;
      const { clientX, clientY } = e;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (!ref.current) return;
        ref.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
        const target = e.target as Element | null;
        const zone = target?.closest("[data-cursor-label]") as HTMLElement | null;
        const newLabel = zone?.dataset.cursorLabel ?? null;
        setLabel((cur) => (cur === newLabel ? cur : newLabel));
      });
    }
    function onLeave() {
      setLabel(null);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="brut-cursor"
      data-active={label ? "true" : "false"}
    >
      {label && <div className="brut-cursor-box">{label} →</div>}
    </div>
  );
}
