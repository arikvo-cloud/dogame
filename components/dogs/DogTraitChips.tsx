import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/cn";
import type { GoodWith } from "@/lib/dogs/types";
import { GOOD_WITH_LABELS } from "@/lib/dogs/types";

interface DogTraitChipsProps {
  goodWith: GoodWith[];
  className?: string;
}

const ALL: GoodWith[] = ["kids", "cats", "dogs", "small-pets"];

export function DogTraitChips({ goodWith, className }: DogTraitChipsProps) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {ALL.map((trait) => {
        const ok = goodWith.includes(trait);
        return (
          <li
            key={trait}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-display font-bold",
              ok
                ? "bg-success-tint text-success-deep border-success/40"
                : "bg-bg-soft text-ink-mute border-border"
            )}
          >
            {ok ? <Check className="w-3 h-3" strokeWidth={3} /> : <Minus className="w-3 h-3" strokeWidth={3} />}
            {GOOD_WITH_LABELS[trait]}
          </li>
        );
      })}
    </ul>
  );
}
