"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Filter as FilterIcon, Sparkles, Shield } from "lucide-react";
import { BREEDS } from "@/lib/breeds/data";
import { BreedPhoto } from "@/components/breed/BreedPhoto";
import { Pill } from "@/components/ui/Pill";
import { cn } from "@/lib/cn";
import type { Breed, BreedSize } from "@/lib/breeds/types";

type SizeFilter = BreedSize | "all";
type EnergyFilter = "all" | "low" | "medium" | "high";
type HeatFilter = "all" | "tolerant" | "sensitive";
type AllergyFilter = "all" | "hypoallergenic";
type SortMode = "default" | "size-asc" | "size-desc" | "name-asc" | "energy-desc" | "kid-friendly";

const SIZE_LABELS: Record<BreedSize, string> = {
  toy: "זעיר",
  small: "קטן",
  medium: "בינוני",
  large: "גדול",
  giant: "ענק",
};

const SIZE_ORDER: BreedSize[] = ["toy", "small", "medium", "large", "giant"];

function energyBucket(e: number): EnergyFilter {
  if (e <= 4) return "low";
  if (e <= 7) return "medium";
  return "high";
}

function matchesFilters(
  b: Breed,
  q: string,
  size: SizeFilter,
  energy: EnergyFilter,
  heat: HeatFilter,
  allergy: AllergyFilter,
  kidsOnly: boolean
): boolean {
  if (q) {
    const hay = (b.name + " " + b.nameEn + " " + b.tagline).toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (size !== "all" && b.size !== size) return false;
  if (energy !== "all" && energyBucket(b.traits.energy) !== energy) return false;
  if (heat === "tolerant" && b.traits.heatTolerance < 6) return false;
  if (heat === "sensitive" && b.traits.heatTolerance >= 6) return false;
  if (allergy === "hypoallergenic" && !b.hypoallergenic) return false;
  if (kidsOnly && b.traits.kidFriendly < 8) return false;
  return true;
}

function sortBreeds(list: Breed[], mode: SortMode): Breed[] {
  const copy = [...list];
  switch (mode) {
    case "size-asc":
      return copy.sort(
        (a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size)
      );
    case "size-desc":
      return copy.sort(
        (a, b) => SIZE_ORDER.indexOf(b.size) - SIZE_ORDER.indexOf(a.size)
      );
    case "name-asc":
      return copy.sort((a, b) => a.name.localeCompare(b.name, "he"));
    case "energy-desc":
      return copy.sort((a, b) => b.traits.energy - a.traits.energy);
    case "kid-friendly":
      return copy.sort((a, b) => b.traits.kidFriendly - a.traits.kidFriendly);
    case "default":
    default:
      return copy;
  }
}

export function BreedsBrowse() {
  const [query, setQuery] = useState("");
  const [size, setSize] = useState<SizeFilter>("all");
  const [energy, setEnergy] = useState<EnergyFilter>("all");
  const [heat, setHeat] = useState<HeatFilter>("all");
  const [allergy, setAllergy] = useState<AllergyFilter>("all");
  const [kidsOnly, setKidsOnly] = useState(false);
  const [sort, setSort] = useState<SortMode>("default");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filtered = useMemo(() => {
    const list = BREEDS.filter((b) =>
      matchesFilters(b, deferredQuery, size, energy, heat, allergy, kidsOnly)
    );
    return sortBreeds(list, sort);
  }, [deferredQuery, size, energy, heat, allergy, kidsOnly, sort]);

  const activeFilterCount =
    (size !== "all" ? 1 : 0) +
    (energy !== "all" ? 1 : 0) +
    (heat !== "all" ? 1 : 0) +
    (allergy !== "all" ? 1 : 0) +
    (kidsOnly ? 1 : 0);

  function resetFilters() {
    setSize("all");
    setEnergy("all");
    setHeat("all");
    setAllergy("all");
    setKidsOnly(false);
  }

  return (
    <div>
      {/* Search + filter toggle */}
      <div className="rounded-[28px] border-[3px] border-border bg-surface p-4 md:p-5 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)]">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <div className="relative flex-1">
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-soft"
              strokeWidth={2.5}
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חיפוש לפי שם הגזע (עברית / English)"
              aria-label="חיפוש גזע"
              className="w-full bg-bg-soft border-[3px] border-border-strong rounded-[18px] pr-10 pl-3 py-2.5 font-display text-base text-ink placeholder:text-ink-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 bg-bg-soft text-ink border-[3px] border-border-strong px-4 py-2.5 rounded-[16px] font-display font-extrabold shadow-[var(--shadow-clay-sm)] hover:bg-primary-tint transition-colors"
              aria-expanded={filtersOpen}
            >
              <FilterIcon className="w-4 h-4" strokeWidth={2.5} />
              סינון
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 bg-primary text-white rounded-full text-xs">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              aria-label="מיון"
              className="bg-bg-soft border-[3px] border-border-strong rounded-[16px] px-3 py-2.5 font-display font-bold text-ink shadow-[var(--shadow-clay-sm)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              <option value="default">סדר רגיל</option>
              <option value="name-asc">לפי שם (א-ת)</option>
              <option value="size-asc">קטן → גדול</option>
              <option value="size-desc">גדול → קטן</option>
              <option value="energy-desc">הכי אנרגטי</option>
              <option value="kid-friendly">הכי משפחתי</option>
            </select>
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence initial={false}>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 mt-4 border-t-2 border-border">
                <FilterChips
                  label="גודל"
                  value={size}
                  onChange={(v) => setSize(v as SizeFilter)}
                  options={[
                    { value: "all", label: "הכל" },
                    { value: "toy", label: "זעיר" },
                    { value: "small", label: "קטן" },
                    { value: "medium", label: "בינוני" },
                    { value: "large", label: "גדול" },
                    { value: "giant", label: "ענק" },
                  ]}
                />
                <FilterChips
                  label="רמת אנרגיה"
                  value={energy}
                  onChange={(v) => setEnergy(v as EnergyFilter)}
                  options={[
                    { value: "all", label: "הכל" },
                    { value: "low", label: "רגוע" },
                    { value: "medium", label: "מתון" },
                    { value: "high", label: "גבוה" },
                  ]}
                />
                <FilterChips
                  label="עמידות בחום"
                  value={heat}
                  onChange={(v) => setHeat(v as HeatFilter)}
                  options={[
                    { value: "all", label: "הכל" },
                    { value: "tolerant", label: "עמיד בחום" },
                    { value: "sensitive", label: "רגיש לחום" },
                  ]}
                />
                <FilterChips
                  label="אלרגיה"
                  value={allergy}
                  onChange={(v) => setAllergy(v as AllergyFilter)}
                  options={[
                    { value: "all", label: "הכל" },
                    { value: "hypoallergenic", label: "היפואלרגניים בלבד" },
                  ]}
                />
                <label className="flex items-center gap-2 cursor-pointer select-none mt-1">
                  <input
                    type="checkbox"
                    checked={kidsOnly}
                    onChange={(e) => setKidsOnly(e.target.checked)}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                  <span className="font-display font-bold text-ink">
                    מותאם לילדים בלבד (8+)
                  </span>
                </label>
                {activeFilterCount > 0 && (
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-sm text-primary-deep font-display font-extrabold hover:text-primary transition-colors"
                    >
                      ניקוי כל הסינונים
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Result count */}
      <div className="mt-5 mb-4 text-sm text-ink-soft font-display font-bold">
        מציג <span className="text-primary-deep">{filtered.length}</span> מתוך{" "}
        {BREEDS.length} גזעים
      </div>

      {/* Results grid */}
      {filtered.length === 0 ? (
        <div className="rounded-[28px] border-[3px] border-warning/40 bg-warning-tint p-8 text-center shadow-[var(--shadow-clay)]">
          <p className="text-lg font-display font-bold text-ink">
            לא נמצאו גזעים שמתאימים לסינון הנוכחי 🐾
          </p>
          <button
            type="button"
            onClick={() => {
              resetFilters();
              setQuery("");
            }}
            className="mt-3 inline-flex items-center gap-1 text-primary-deep font-display font-extrabold"
          >
            ניקוי הכל
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((b) => (
              <motion.div
                key={b.slug}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <BreedTile breed={b} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

function FilterChips({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div>
      <div className="text-xs font-display font-extrabold text-ink-soft uppercase tracking-wide mb-1.5">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "px-3 py-1 rounded-full border-2 text-sm font-display font-bold transition-colors cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                active
                  ? "bg-primary text-white border-primary-deep shadow-[0_2px_0_var(--color-primary-deep)]"
                  : "bg-bg-soft text-ink border-border-strong hover:bg-primary-tint"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BreedTile({ breed }: { breed: Breed }) {
  return (
    <Link
      href={`/breed/${breed.slug}`}
      className="group block rounded-[22px] border-[3px] border-border bg-surface p-3 text-center shadow-[var(--shadow-clay),var(--shadow-inner-clay)] hover:-translate-y-1 hover:border-border-strong transition-all"
    >
      <div className="flex justify-center mb-2.5 group-hover:scale-105 transition-transform">
        <BreedPhoto breed={breed} size={140} rounded="rounded-[18px]" />
      </div>
      <div className="font-display font-extrabold text-sm text-ink leading-tight">
        {breed.name}
      </div>
      <div className="mt-1.5 flex items-center justify-center gap-1.5 flex-wrap">
        <Pill tone="neutral" className="!px-2 !py-0.5 !text-[10px] !shadow-none">
          {SIZE_LABELS[breed.size]}
        </Pill>
        {breed.hypoallergenic && (
          <Pill
            tone="success"
            icon={<Sparkles className="w-2.5 h-2.5" strokeWidth={3} />}
            className="!px-2 !py-0.5 !text-[10px] !shadow-none"
          >
            היפו
          </Pill>
        )}
        {breed.traits.heatTolerance >= 7 && (
          <Pill
            tone="warning"
            icon={<Shield className="w-2.5 h-2.5" strokeWidth={3} />}
            className="!px-2 !py-0.5 !text-[10px] !shadow-none"
          >
            עמיד בחום
          </Pill>
        )}
      </div>
    </Link>
  );
}
