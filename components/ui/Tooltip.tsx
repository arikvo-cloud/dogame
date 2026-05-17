"use client";

import { useId, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/cn";

interface TooltipProps {
  /** Trigger content */
  children: ReactNode;
  /** Tooltip body */
  content: ReactNode;
  className?: string;
  /** Side of the tooltip relative to trigger */
  side?: "top" | "bottom";
}

/**
 * Lightweight tooltip — works on hover (desktop) AND tap/focus (mobile).
 * Uses aria-describedby for screen readers.
 */
export function Tooltip({
  children,
  content,
  className,
  side = "top",
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onTouchStart={(e) => {
        e.stopPropagation();
        setOpen((v) => !v);
      }}
    >
      <span aria-describedby={open ? id : undefined}>{children}</span>
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: side === "top" ? 4 : -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: side === "top" ? 4 : -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-40 inline-block px-3 py-1.5 rounded-[12px] text-xs font-medium leading-snug",
              "bg-ink text-white border-2 border-ink/80 shadow-[0_4px_10px_rgba(0,0,0,0.25)]",
              "max-w-[220px] whitespace-normal text-center pointer-events-none",
              side === "top"
                ? "bottom-full mb-2 left-1/2 -translate-x-1/2"
                : "top-full mt-2 left-1/2 -translate-x-1/2"
            )}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
