import Link from "next/link";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Shelter } from "@/lib/shelters/types";
import { REGION_LABELS } from "@/lib/shelters/types";
import { filterDogs } from "@/lib/dogs/helpers";
import { ExampleBadge } from "@/components/ui/ExampleBadge";

interface ShelterCardProps {
  shelter: Shelter;
  className?: string;
}

export function ShelterCard({ shelter, className }: ShelterCardProps) {
  const dogCount = filterDogs({ shelterId: shelter.id }).length;
  return (
    <Link
      href={`/shelter/${shelter.slug}`}
      data-paw-zone
      className={cn(
        "group relative block rounded-[24px] border-2 border-border bg-surface p-6",
        "shadow-[var(--shadow-clay),var(--shadow-inner-clay)] lift-on-hover hover:border-primary-soft",
        className
      )}
    >
      <div className="absolute top-3 left-3"><ExampleBadge /></div>
      <div className="flex items-center gap-1.5 text-xs text-ink-mute font-display font-bold uppercase tracking-[0.18em]">
        <MapPin className="w-3 h-3" strokeWidth={2.5} />
        {REGION_LABELS[shelter.region]} · {shelter.city}
      </div>
      <h3 className="mt-3 font-display font-extrabold text-2xl text-ink leading-tight tracking-tight">
        {shelter.name}
      </h3>
      <p className="mt-3 text-sm text-ink-soft font-medium leading-relaxed line-clamp-3">
        {shelter.description}
      </p>
      <div className="mt-4 inline-flex items-baseline gap-1.5 text-sm font-display font-extrabold text-primary-deep">
        <span className="tabular-nums">{dogCount}</span>
        <span className="text-ink-mute font-bold">כלבים זמינים</span>
      </div>
    </Link>
  );
}
