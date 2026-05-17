import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Tone = "default" | "warm" | "tint" | "accent";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
}

const toneStyles: Record<Tone, string> = {
  default: "bg-surface border-border",
  warm: "bg-surface-tint border-border",
  tint: "bg-primary-tint border-border-strong",
  accent: "bg-accent-tint border-accent-soft",
};

/** Claymorphism card — chunky border + double shadow + soft inner highlight. */
export function Card({ className, tone = "default", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-[28px] border-[3px] p-6 md:p-8",
        "shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)]",
        toneStyles[tone],
        className
      )}
      {...props}
    />
  );
}
