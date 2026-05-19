"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionStyle,
} from "motion/react";
import { cn } from "@/lib/cn";

export interface TiltCardProps {
  /** Maximum tilt angle in degrees */
  tiltLimit?: number;
  /** Scale factor on hover */
  scale?: number;
  /** Perspective distance in pixels */
  perspective?: number;
  /** "gravitate" follows cursor, "evade" tilts away */
  effect?: "gravitate" | "evade";
  /** Show a spotlight that follows the cursor on hover */
  spotlight?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const tiltSpring = { stiffness: 220, damping: 22, mass: 0.5 };
const opacitySpring = { stiffness: 180, damping: 30, mass: 0.4 };

/**
 * Spring-physics 3D tilt with cursor-tracking spotlight.
 * rAF-coalesced pointer events + cached rect avoid forced layout per move.
 * Tilt collapses to a no-op for reduced-motion users.
 */
export function TiltCard({
  tiltLimit = 15,
  scale = 1.05,
  perspective = 1200,
  effect = "evade",
  spotlight = true,
  className,
  style,
  children,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number | null>(null);
  const reduced = useReducedMotion();
  const dir = effect === "evade" ? -1 : 1;

  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const scl = useMotionValue(1);
  const spotX = useMotionValue(50);
  const spotY = useMotionValue(50);
  const spotOpacity = useMotionValue(0);

  const srotX = useSpring(rotX, tiltSpring);
  const srotY = useSpring(rotY, tiltSpring);
  const sscl = useSpring(scl, tiltSpring);
  const sSpotOpacity = useSpring(spotOpacity, opacitySpring);

  const spotLeft = useTransform(spotX, (v) => `${v}%`);
  const spotTop = useTransform(spotY, (v) => `${v}%`);

  function onEnter() {
    if (reduced || !ref.current) return;
    rectRef.current = ref.current.getBoundingClientRect();
    scl.set(scale);
    spotOpacity.set(1);
  }

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduced || !rectRef.current) return;
    if (rafRef.current !== null) return;
    const { clientX, clientY } = e;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const r = rectRef.current;
      if (!r) return;
      const px = (clientX - r.left) / r.width;
      const py = (clientY - r.top) / r.height;
      rotX.set((py - 0.5) * (tiltLimit * 2) * dir);
      rotY.set((px - 0.5) * -(tiltLimit * 2) * dir);
      if (spotlight) {
        spotX.set(px * 100);
        spotY.set(py * 100);
      }
    });
  }

  function onLeave() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    rectRef.current = null;
    rotX.set(0);
    rotY.set(0);
    scl.set(1);
    spotOpacity.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("relative overflow-hidden will-change-transform", className)}
      style={
        {
          rotateX: srotX,
          rotateY: srotY,
          scale: sscl,
          transformPerspective: perspective,
          transformStyle: "preserve-3d",
          ...style,
        } as MotionStyle
      }
    >
      {children}
      {spotlight && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
          style={{ opacity: sSpotOpacity }}
        >
          <motion.div
            className="absolute h-[200%] w-[200%] rounded-full opacity-100 dark:opacity-50"
            style={{
              left: spotLeft,
              top: spotTop,
              x: "-50%",
              y: "-50%",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 40%)",
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
