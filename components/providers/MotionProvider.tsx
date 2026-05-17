"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

/**
 * Global motion config — when the user has prefers-reduced-motion set,
 * every motion component in the tree disables transforms automatically.
 * Layout-prop animations still fade as a fallback.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
