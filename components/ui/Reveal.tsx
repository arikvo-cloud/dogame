"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "motion/react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  /** "up" slides up into place, "fade" only opacity, "scale" pops in */
  from?: "up" | "down" | "fade" | "scale";
  /** Trigger once on first viewport entry */
  once?: boolean;
  /** How much of the element must be visible (0-1) */
  amount?: number;
  className?: string;
}

const variantMap: Record<NonNullable<RevealProps["from"]>, Variants> = {
  up: {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  },
  down: {
    hidden: { opacity: 0, y: -28 },
    visible: { opacity: 1, y: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
};

/** Generic on-scroll reveal wrapper using whileInView. */
export function Reveal({
  children,
  delay = 0,
  from = "up",
  once = true,
  amount = 0.25,
  className,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variantMap[from]}
      transition={{
        delay,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  /** Delay between children */
  stagger?: number;
  /** Initial delay before first child */
  delayChildren?: number;
  className?: string;
  amount?: number;
  once?: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0,
    },
  },
};

/** Wrap children with stagger reveal. Use <StaggerItem> for each child. */
export function Stagger({
  children,
  stagger = 0.08,
  delayChildren = 0,
  className,
  amount = 0.2,
  once = true,
}: StaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        ...containerVariants,
        visible: {
          opacity: 1,
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  );
}
