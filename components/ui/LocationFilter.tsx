"use client";

import { cn } from "@/lib/cn";
import type { Region } from "@/lib/shelters/types";
import { REGION_LABELS } from "@/lib/shelters/types";

interface LocationFilterProps {
  value: Region | "all";
  onChange: (value: Region | "all") => void;
  counts?: Record<Region | "all", number>;
  className?: string;
}

const REGIONS: Array<Region | "all"> = ["all", "center", "north", "south", "jerusalem"];

export function LocationFilter({ value, onChange, counts, className }: LocationFilterProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {REGIONS.map((r) => {
        const active = r === value;
        const label = r === "all" ? "כל הארץ" : REGION_LABELS[r];
        const count = counts?.[r];
        return (
          <button
            key={r}
            type="button"
            onClick={() => onChange(r)}
            className={cn(
              "px-3 py-1 rounded-full border-2 text-sm font-display font-bold transition-colors cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
              active
                ? "bg-primary text-white border-primary-deep shadow-[0_2px_0_var(--color-primary-deep)]"
                : "bg-bg-soft text-ink border-border-strong hover:bg-primary-tint"
            )}
          >
            {label}
            {typeof count === "number" && (
              <span className={cn("mr-1.5 tabular-nums", active ? "opacity-80" : "text-ink-mute")}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
