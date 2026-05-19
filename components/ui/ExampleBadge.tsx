import { cn } from "@/lib/cn";

interface ExampleBadgeProps {
  className?: string;
}

/** Small "דוגמה" tag for every dog/shelter card. Required by v1 disclosure pattern. */
export function ExampleBadge({ className }: ExampleBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-bg-soft border border-border-strong",
        "px-2 py-0.5 text-[10px] font-display font-bold text-ink-soft tracking-wide",
        className
      )}
      title="פרטי הכלב הם דוגמה איורית בלבד"
    >
      <span aria-hidden>★</span>
      דוגמה
    </span>
  );
}
