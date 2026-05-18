"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { ToastProvider } from "@/components/ui/Toast";
import { ThemeProvider } from "./ThemeProvider";

/**
 * Global providers — Theme + MotionConfig (reduced-motion) + ToastProvider.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <ToastProvider>{children}</ToastProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
