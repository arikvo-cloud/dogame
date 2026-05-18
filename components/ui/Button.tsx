"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "accent" | "soft" | "ghost";
type Size = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

/**
 * Claymorphism button — chunky, squishy, friendly.
 *
 * Recipe: 3-4px border + double shadow (hard offset + soft ambient) + spring squish on press.
 * Press animation translates Y by the shadow offset so the button looks like
 * it "sinks into the shelf" instead of just shrinking.
 */
const baseStyles =
  "group relative inline-flex items-center justify-center gap-2 font-display font-extrabold select-none cursor-pointer " +
  "border-2 transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] " +
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:hover:translate-y-0 " +
  "active:translate-y-[4px] active:shadow-[var(--shadow-clay-press)] " +
  "hover:-translate-y-[2px]";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary text-white border-primary-deep " +
    "shadow-[var(--shadow-glow-primary)] hover:bg-primary-soft " +
    "before:absolute before:inset-x-2 before:top-1 before:h-[35%] before:rounded-full " +
    "before:bg-white/25 before:blur-[1px] before:pointer-events-none",
  secondary:
    "bg-peach text-ink border-peach-deep " +
    "shadow-[var(--shadow-clay-lg)] hover:bg-peach/90",
  accent:
    "bg-accent text-white border-accent-deep " +
    "shadow-[var(--shadow-glow-accent)] hover:bg-accent-soft " +
    "before:absolute before:inset-x-2 before:top-1 before:h-[35%] before:rounded-full " +
    "before:bg-white/25 before:blur-[1px] before:pointer-events-none",
  soft:
    "bg-surface text-ink border-border " +
    "shadow-[var(--shadow-clay)] hover:bg-surface-tint hover:border-border-strong",
  ghost:
    "bg-transparent text-ink-soft border-border shadow-none " +
    "hover:bg-bg-soft hover:text-ink hover:border-border-strong active:translate-y-0",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-10 px-4 text-sm rounded-[14px]",
  md: "h-12 px-5 text-base rounded-[18px]",
  lg: "h-14 px-7 text-lg rounded-[22px]",
  xl: "h-16 px-9 text-xl rounded-[26px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        <span className="relative z-10 inline-flex items-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);
Button.displayName = "Button";
