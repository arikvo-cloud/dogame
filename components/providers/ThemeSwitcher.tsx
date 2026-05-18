"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, type Theme } from "./ThemeProvider";
import { cn } from "@/lib/cn";

const OPTIONS: Array<{ value: Theme; label: string; Icon: typeof Sun }> = [
  { value: "light", label: "בהיר", Icon: Sun },
  { value: "dark", label: "כהה", Icon: Moon },
  { value: "system", label: "מערכת", Icon: Monitor },
];

/**
 * Three-state theme toggle (light/dark/system) rendered as a segmented pill.
 * Stays hidden until hydration to avoid SSR/client mismatch flash.
 */
export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated) {
    // Reserve space so the layout doesn't jump after hydration.
    return <div className={cn("h-10 w-10", className)} aria-hidden />;
  }

  const active = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[2];
  const ActiveIcon = active.Icon;

  return (
    <details className={cn("relative", className)}>
      <summary
        className="list-none cursor-pointer inline-flex items-center justify-center w-10 h-10 rounded-[12px] bg-surface text-ink border-2 border-border-strong shadow-[var(--shadow-clay-sm)] hover:border-primary-soft transition-colors [&::-webkit-details-marker]:hidden"
        aria-label={`ערכת נושא: ${active.label}`}
      >
        <ActiveIcon className="w-4 h-4" strokeWidth={2.5} aria-hidden />
      </summary>
      <div
        className="absolute end-0 mt-2 w-44 rounded-[18px] border-2 border-border-strong bg-surface shadow-[var(--shadow-clay-xl)] p-1.5 z-40"
        role="menu"
      >
        {OPTIONS.map((opt) => {
          const isActive = opt.value === theme;
          const Icon = opt.Icon;
          return (
            <button
              key={opt.value}
              type="button"
              role="menuitemradio"
              aria-checked={isActive}
              onClick={() => {
                setTheme(opt.value);
                // Close the <details>
                const details = (
                  document.activeElement as HTMLElement
                )?.closest("details");
                if (details) details.removeAttribute("open");
              }}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-[12px] font-display font-bold text-sm transition-colors text-right",
                isActive
                  ? "bg-primary text-white"
                  : "text-ink hover:bg-bg-soft"
              )}
            >
              <Icon className="w-4 h-4" strokeWidth={2.5} aria-hidden />
              <span className="flex-1">{opt.label}</span>
              {isActive && (
                <motion.span
                  layoutId="theme-check"
                  className="text-xs"
                  aria-hidden
                >
                  ✓
                </motion.span>
              )}
            </button>
          );
        })}
      </div>
    </details>
  );
}
