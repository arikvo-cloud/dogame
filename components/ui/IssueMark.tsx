import { cn } from "@/lib/cn";

interface IssueMarkProps {
  /** Issue number — e.g. "042" */
  issue: string;
  /** Date or edition tag — e.g. "מאי 2026" */
  edition: string;
  /** Volume or category — e.g. "מהדורה ישראלית" */
  volume?: string;
  className?: string;
}

/** Magazine masthead-style header: ISSUE | EDITION | VOLUME with hairline rules.
 *  Used at the top of editorial pages (hero) to set the "feature spread" tone. */
export function IssueMark({ issue, edition, volume, className }: IssueMarkProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 text-ink-mute text-[10px] uppercase tracking-[0.24em] font-display font-bold",
        className
      )}
    >
      <span className="tabular-nums">
        <span className="text-ink-faint">N°</span>
        <span className="text-primary-deep">{issue}</span>
      </span>
      <span aria-hidden className="block h-px w-6 bg-ink-mute opacity-50" />
      <span>{edition}</span>
      {volume && (
        <>
          <span aria-hidden className="block h-px w-6 bg-ink-mute opacity-50" />
          <span>{volume}</span>
        </>
      )}
    </div>
  );
}
