"use client";

import { useRef, type ReactNode, type HTMLAttributes } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/cn";

interface MagneticButtonProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onAnimationStart" | "onDragStart" | "onDrag" | "onDragEnd"> {
  /** Strength of the magnetic pull (px) */
  strength?: number;
  /** Children rendered inside the moving wrapper */
  children: ReactNode;
}

/**
 * Pointer-tracking magnetic wrapper.
 * Inner element drifts a few pixels toward the cursor while hovered.
 * Uses requestAnimationFrame coalescing + cached rect to avoid forced layout
 * on every pointer event. Disabled for reduced-motion users.
 */
export function MagneticButton({
  strength = 18,
  className,
  children,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  const rotate = useTransform([sx, sy] as const, ([dx, dy]) =>
    Math.atan2(dy as number, dx as number) * (180 / Math.PI) * 0.04
  );
  const reduced = useReducedMotion();

  function onEnter() {
    if (reduced || !ref.current) return;
    rectRef.current = ref.current.getBoundingClientRect();
  }

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduced || !rectRef.current) return;
    if (rafRef.current !== null) return; // coalesce to next frame
    const { clientX, clientY } = e;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const r = rectRef.current;
      if (!r) return;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = ((clientX - cx) / (r.width / 2)) * strength;
      const dy = ((clientY - cy) / (r.height / 2)) * strength;
      x.set(dx);
      y.set(dy);
    });
  }

  function onLeave() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    rectRef.current = null;
    x.set(0);
    y.set(0);
  }

  return (
    <div
      ref={ref}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("inline-block", className)}
      {...rest}
    >
      <motion.div style={{ x: sx, y: sy, rotate }}>{children}</motion.div>
    </div>
  );
}
