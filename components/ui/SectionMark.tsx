import { cn } from "@/lib/cn";

interface SectionMarkProps {
  /** Numeral like "01" or "N°1" — rendered tabular */
  numeral?: string;
  /** Small-caps label to the right of the numeral */
  label: string;
  className?: string;
}

/** Small editorial section header: tabular numeral + hairline + label.
 *  Reads as a magazine section opener, not a CTA. */
export function SectionMark({ numeral, label, className }: SectionMarkProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 text-ink-mute",
        className
      )}
    >
      {numeral && (
        <span className="font-display font-extrabold text-sm tabular-nums tracking-tight text-primary-deep">
          {numeral}
        </span>
      )}
      <span aria-hidden className="block h-px w-8 bg-ink-mute opacity-60" />
      <span className="text-[11px] uppercase tracking-[0.22em] font-display font-bold">
        {label}
      </span>
    </div>
  );
}
