import Image from "next/image";
import { proxyImage } from "@/lib/image-proxy";
import type { AdoptableDog } from "@/lib/dogs/types";
import { AGE_GROUP_LABELS, SEX_LABELS } from "@/lib/dogs/types";
import { ExampleBadge } from "@/components/ui/ExampleBadge";
import { SectionMark } from "@/components/ui/SectionMark";

interface DogHeroProps {
  dog: AdoptableDog;
  shelterName: string;
  shelterCity: string;
}

export function DogHero({ dog, shelterName, shelterCity }: DogHeroProps) {
  return (
    <header className="relative grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6 md:gap-10 items-center">
      <div className="relative order-2 md:order-1">
        <div className="relative aspect-[5/4] md:aspect-[4/5] rounded-[28px] overflow-hidden border border-border bg-bg-soft shadow-[var(--shadow-clay-xl)]">
          <Image
            src={proxyImage(dog.imageUrl, { w: 700, h: 875, fit: "contain" })}
            alt={`תמונה של ${dog.name}`}
            fill
            sizes="(max-width: 768px) 90vw, 32rem"
            className="object-contain"
            priority
            unoptimized
          />
        </div>
        <div className="absolute top-4 right-4 z-10"><ExampleBadge /></div>
      </div>

      <div className="order-1 md:order-2 text-right">
        <SectionMark numeral="N°1" label={`מקלט: ${shelterName}, ${shelterCity}`} />
        <h1 className="mt-5 text-5xl md:text-6xl lg:text-7xl font-extrabold font-display text-ink leading-[0.95]">
          {dog.name}
        </h1>
        <p className="mt-2 text-base text-ink-mute font-display font-medium italic">
          {dog.breedDisplay}
        </p>
        <dl className="mt-6 grid grid-cols-3 gap-3 max-w-md">
          <div className="border-t-2 border-border pt-3">
            <dt className="text-[10px] uppercase tracking-wide font-display font-bold text-ink-mute">גיל</dt>
            <dd className="mt-1 text-base font-display font-extrabold text-ink tabular-nums">
              {dog.age} <span className="text-xs text-ink-mute">{AGE_GROUP_LABELS[dog.ageGroup]}</span>
            </dd>
          </div>
          <div className="border-t-2 border-border pt-3">
            <dt className="text-[10px] uppercase tracking-wide font-display font-bold text-ink-mute">מין</dt>
            <dd className="mt-1 text-base font-display font-extrabold text-ink">{SEX_LABELS[dog.sex]}</dd>
          </div>
          <div className="border-t-2 border-border pt-3">
            <dt className="text-[10px] uppercase tracking-wide font-display font-bold text-ink-mute">גודל</dt>
            <dd className="mt-1 text-base font-display font-extrabold text-ink">{dog.weightKg ? `${dog.weightKg} ק"ג` : dog.size}</dd>
          </div>
        </dl>
      </div>
    </header>
  );
}
