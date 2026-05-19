"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useSpring,
  useTransform,
  type SpringOptions,
} from "motion/react";
import { cn } from "@/lib/cn";

interface CursorSpotlightProps {
  className?: string;
  size?: number;
  springOptions?: SpringOptions;
}

/** Cursor-tracking radial spotlight (ibelick). Attaches to the nearest
 *  positioned ancestor; that ancestor is forced to position:relative + overflow:hidden. */
export function CursorSpotlight({
  className,
  size = 200,
  springOptions = { bounce: 0 },
}: CursorSpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [parent, setParent] = useState<HTMLElement | null>(null);

  const mouseX = useSpring(0, springOptions);
  const mouseY = useSpring(0, springOptions);
  const left = useTransform(mouseX, (x) => `${x - size / 2}px`);
  const top = useTransform(mouseY, (y) => `${y - size / 2}px`);

  useEffect(() => {
    const el = containerRef.current?.parentElement;
    if (!el) return;
    el.style.position = "relative";
    el.style.overflow = "hidden";
    setParent(el);
  }, []);

  const onMove = useCallback(
    (e: MouseEvent) => {
      if (!parent) return;
      const { left: l, top: t } = parent.getBoundingClientRect();
      mouseX.set(e.clientX - l);
      mouseY.set(e.clientY - t);
    },
    [mouseX, mouseY, parent]
  );

  useEffect(() => {
    if (!parent) return;
    const onEnter = () => setIsHovered(true);
    const onLeave = () => setIsHovered(false);
    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseenter", onEnter);
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseenter", onEnter);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, [parent, onMove]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops),transparent_80%)] blur-xl transition-opacity duration-200",
        "from-zinc-50 via-zinc-100 to-zinc-200",
        isHovered ? "opacity-100" : "opacity-0",
        className
      )}
      style={{ width: size, height: size, left, top }}
    />
  );
}
