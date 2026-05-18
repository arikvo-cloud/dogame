import { cn } from "@/lib/cn";

interface SkeletonProps {
  className?: string;
  rounded?: string;
}

/**
 * Shimmer skeleton — clay-style placeholder while content loads.
 * The shimmer is a CSS gradient sweep, no JS animation needed.
 */
export function Skeleton({ className, rounded = "rounded-[16px]" }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden border-2 border-border bg-bg-soft",
        "before:absolute before:inset-0",
        "before:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.6)_50%,transparent_100%)]",
        "before:translate-x-[-100%] before:animate-[shimmer_1.6s_infinite]",
        rounded,
        className
      )}
    />
  );
}

/** Pre-built breed-card skeleton grid (used while filtering or loading) */
export function BreedCardSkeleton() {
  return (
    <div className="rounded-[22px] border-2 border-border bg-surface p-3 text-center shadow-[var(--shadow-clay-sm),var(--shadow-inner-clay)]">
      <Skeleton className="h-[140px] w-full mb-2.5" rounded="rounded-[18px]" />
      <Skeleton className="h-4 w-3/4 mx-auto mb-2" rounded="rounded-md" />
      <div className="flex justify-center gap-1">
        <Skeleton className="h-3 w-10" rounded="rounded-full" />
        <Skeleton className="h-3 w-12" rounded="rounded-full" />
      </div>
    </div>
  );
}
