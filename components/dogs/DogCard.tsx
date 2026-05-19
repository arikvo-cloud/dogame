import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { proxyImage } from "@/lib/image-proxy";
import { cn } from "@/lib/cn";
import type { AdoptableDog } from "@/lib/dogs/types";
import { AGE_GROUP_LABELS } from "@/lib/dogs/types";
import { getShelterById } from "@/lib/shelters/data";
import { ExampleBadge } from "@/components/ui/ExampleBadge";

interface DogCardProps {
  dog: AdoptableDog;
  compact?: boolean;
  className?: string;
}

export function DogCard({ dog, compact = false, className }: DogCardProps) {
  const shelter = getShelterById(dog.shelterId);
  return (
    <Link
      href={`/dog/${dog.id}`}
      data-paw-zone
      className={cn(
        "group relative block rounded-[22px] border-2 border-border bg-surface overflow-hidden",
        "shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)] lift-on-hover hover:border-primary-soft",
        className
      )}
    >
      <div className="absolute top-2 left-2 z-10">
        <ExampleBadge />
      </div>
      <div className="relative aspect-[5/4] overflow-hidden bg-bg-soft">
        <Image
          src={proxyImage(dog.imageUrl, { w: 400, h: 320, fit: "cover" })}
          alt={`תמונה של ${dog.name}`}
          fill
          sizes="(max-width: 768px) 50vw, 320px"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          unoptimized
        />
      </div>
      <div className="p-4 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <div className="font-display font-extrabold text-lg text-ink leading-tight">
            {dog.name}
          </div>
          <span className="text-xs text-ink-mute font-display font-bold tabular-nums">
            {AGE_GROUP_LABELS[dog.ageGroup]}
          </span>
        </div>
        <div className="mt-1 text-sm text-ink-soft font-medium">{dog.breedDisplay}</div>
        {!compact && shelter && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-mute font-display font-bold">
            <MapPin className="w-3 h-3" strokeWidth={2.5} />
            {shelter.city}
          </div>
        )}
      </div>
    </Link>
  );
}
