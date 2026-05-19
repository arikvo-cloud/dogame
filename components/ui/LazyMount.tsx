"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Margin around the viewport (rootMargin) — start loading before in-view */
  rootMargin?: string;
  /** Min height for the placeholder so layout doesn't jump */
  minHeight?: string | number;
}

/**
 * Only mounts its children once they're about to enter the viewport.
 * Useful for heavy below-the-fold sections (GSAP scroll story, testimonials,
 * BreedChat) — keeps initial JS work and image loading off the critical path.
 */
export function LazyMount({
  children,
  rootMargin = "200px",
  minHeight = 200,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;
    if (!ref.current) return;
    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setMounted(true));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          obs.disconnect();
        }
      },
      { rootMargin }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [mounted, rootMargin]);

  return (
    <div ref={ref} style={{ minHeight: mounted ? undefined : minHeight }}>
      {mounted ? children : null}
    </div>
  );
}
