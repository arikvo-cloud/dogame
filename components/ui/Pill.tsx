import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "primary" | "accent" | "neutral" | "success" | "warning";

interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  icon?: ReactNode;
  children: ReactNode;
}

const toneStyles: Record<Tone, string> = {
  primary: "bg-primary-tint text-primary-deep border-primary-soft",
  accent: "bg-accent-tint text-accent-deep border-accent-soft",
  neutral: "bg-bg-soft text-ink border-border-strong",
  success: "bg-success-tint text-success border-success/40",
  warning: "bg-warning-tint text-ink border-warning/40",
};

/** Small chunky badge — claymorphism token. */
export function Pill({ tone = "primary", icon, children, className, ...props }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full",
        "border-2 font-display font-bold text-sm",
        "shadow-[var(--shadow-clay-sm)]",
        toneStyles[tone],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}
