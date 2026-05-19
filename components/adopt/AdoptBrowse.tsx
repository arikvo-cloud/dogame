"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X } from "lucide-react";
import { ADOPTABLE_DOGS } from "@/lib/dogs/data";
import { filterDogs } from "@/lib/dogs/helpers";
import type { AgeGroup } from "@/lib/dogs/types";
import type { BreedSize } from "@/lib/breeds/types";
import type { Region } from "@/lib/shelters/types";
import { LocationFilter } from "@/components/ui/LocationFilter";
import { DogCard } from "@/components/dogs/DogCard";

const SIZES: Array<BreedSize | "all"> = ["all", "toy", "small", "medium", "large", "giant"];
const AGE_GROUPS: Array<AgeGroup | "all"> = ["all", "puppy", "young", "adult", "senior"];

const SIZE_LABELS: Record<BreedSize | "all", string> = {
  all: "הכל",
  toy: "זעיר",
  small: "קטן",
  medium: "בינוני",
  large: "גדול",
  giant: "ענק",
};

const AGE_LABELS: Record<AgeGroup | "all", string> = {
  all: "הכל",
  puppy: "גורים",
  young: "צעירים",
  adult: "בוגרים",
  senior: "מבוגרים",
};

export function AdoptBrowse() {
  const [region, setRegion] = useState<Region | "all">("all");
  const [size, setSize] = useState<BreedSize | "all">("all");
  const [age, setAge] = useState<AgeGroup | "all">("all");
  const [query, setQuery] = useState("");
  const dq = useDeferredValue(query.trim());

  const filtered = useMemo(() => {
    return filterDogs({
      region: region === "all" ? undefined : region,
      size: size === "all" ? undefined : size,
      ageGroup: age === "all" ? undefined : age,
      query: dq || undefined,
    });
  }, [region, size, age, dq]);

  const regionCounts = useMemo(() => {
    return {
      all: ADOPTABLE_DOGS.length,
      center: ADOPTABLE_DOGS.filter((d) => d.region === "center").length,
      north: ADOPTABLE_DOGS.filter((d) => d.region === "north").length,
      south: ADOPTABLE_DOGS.filter((d) => d.region === "south").length,
      jerusalem: ADOPTABLE_DOGS.filter((d) => d.region === "jerusalem").length,
    } as Record<Region | "all", number>;
  }, []);

  return (
    <div>
      <div className="rounded-[28px] border-2 border-border bg-surface p-4 md:p-5 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)]">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-soft" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חיפוש לפי שם או תיאור"
            aria-label="חיפוש כלבים"
            className="w-full bg-bg-soft border-2 border-border-strong rounded-[18px] pr-10 pl-3 py-2.5 font-display text-base text-ink placeholder:text-ink-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="נקה חיפוש"
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1 text-ink-soft hover:text-ink"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="mt-4 space-y-3">
          <FilterRow label="אזור">
            <LocationFilter value={region} onChange={setRegion} counts={regionCounts} />
          </FilterRow>
          <FilterRow label="גודל">
            <ChipRow value={size} onChange={(v) => setSize(v as BreedSize | "all")} options={SIZES} labels={SIZE_LABELS} />
          </FilterRow>
          <FilterRow label="גיל">
            <ChipRow value={age} onChange={(v) => setAge(v as AgeGroup | "all")} options={AGE_GROUPS} labels={AGE_LABELS} />
          </FilterRow>
        </div>
      </div>

      <div className="mt-6 mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-display font-bold text-ink-mute">
        <span className="tabular-nums">
          <span className="text-primary-deep">{filtered.length}</span>
          <span className="text-ink-faint"> / {ADOPTABLE_DOGS.length}</span>
        </span>
        <span aria-hidden className="block h-px flex-1 bg-ink-mute opacity-30" />
        <span>כלבים זמינים</span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            className="rounded-[28px] border-2 border-warning/40 bg-warning-tint p-10 text-center shadow-[var(--shadow-clay)]"
          >
            <p className="pull-quote !text-2xl">לא מצאנו כלבים שמתאימים</p>
            <button
              type="button"
              onClick={() => { setRegion("all"); setSize("all"); setAge("all"); setQuery(""); }}
              className="mt-5 inline-flex items-center gap-1 text-primary-deep font-display font-extrabold underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors"
            >
              נקו את הסינון
            </button>
          </motion.div>
        ) : (
          <motion.div key="grid" layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((d) => (
                <motion.div
                  key={d.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
                >
                  <DogCard dog={d} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-display font-extrabold text-ink-soft uppercase tracking-wide mb-1.5">{label}</div>
      {children}
    </div>
  );
}

function ChipRow<T extends string>({
  value, onChange, options, labels,
}: {
  value: T;
  onChange: (v: T) => void;
  options: T[];
  labels: Record<T, string>;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-3 py-1 rounded-full border-2 text-sm font-display font-bold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
              active ? "bg-primary text-white border-primary-deep shadow-[0_2px_0_var(--color-primary-deep)]" : "bg-bg-soft text-ink border-border-strong hover:bg-primary-tint"
            }`}
          >
            {labels[opt]}
          </button>
        );
      })}
    </div>
  );
}
