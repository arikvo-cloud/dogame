"use client";

import { useState, useDeferredValue, useMemo } from "react";
import { Search, X } from "lucide-react";
import { BREEDS } from "@/lib/breeds/data";
import { BreedPhoto } from "@/components/breed/BreedPhoto";
import { cn } from "@/lib/cn";
import type { Breed } from "@/lib/breeds/types";

interface Props {
  /** Side label (e.g. "גזע 1") */
  label: string;
  /** Currently selected slug, or null if no selection */
  value: string | null;
  onChange: (slug: string) => void;
  /** Slug to exclude from picker (avoid selecting same breed twice) */
  excludeSlug?: string | null;
  className?: string;
}

/**
 * Picker UI for choosing one breed.
 * Shows current selection as a clay card; clicking opens a searchable list.
 */
export function BreedComparePicker({
  label,
  value,
  onChange,
  excludeSlug,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const selected = value ? BREEDS.find((b) => b.slug === value) ?? null : null;

  const visible = useMemo(() => {
    const filtered = BREEDS.filter(
      (b) => b.slug !== excludeSlug && b.slug !== value
    );
    if (!deferredQuery) return filtered;
    return filtered.filter((b) =>
      (b.name + " " + b.nameEn).toLowerCase().includes(deferredQuery)
    );
  }, [deferredQuery, excludeSlug, value]);

  return (
    <div className={cn("relative", className)}>
      <div className="text-xs font-display font-extrabold text-ink-soft uppercase tracking-wide mb-2">
        {label}
      </div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full rounded-[24px] border-[3px] bg-surface p-4 text-right shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)] transition-all hover:-translate-y-0.5",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
          selected ? "border-primary-deep" : "border-border-strong"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected ? (
          <div className="flex items-center gap-3">
            <BreedPhoto breed={selected} size={64} rounded="rounded-[16px]" />
            <div className="flex-1 min-w-0">
              <div className="font-display font-black text-lg text-ink leading-tight">
                {selected.name}
              </div>
              <div className="text-xs text-ink-soft font-display font-bold truncate">
                {selected.tagline}
              </div>
            </div>
            <span className="text-primary-deep font-display font-extrabold text-sm shrink-0">
              החלף
            </span>
          </div>
        ) : (
          <div className="text-ink-soft font-display font-bold py-3 text-center">
            בחר/י גזע…
          </div>
        )}
      </button>

      {open && (
        <div
          className="absolute z-30 inset-x-0 mt-2 rounded-[20px] border-[3px] border-border-strong bg-surface shadow-[var(--shadow-clay-xl)] overflow-hidden"
          role="listbox"
        >
          <div className="p-3 border-b-2 border-border">
            <div className="relative">
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft"
                strokeWidth={2.5}
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="חיפוש שם הגזע"
                autoFocus
                className="w-full bg-bg-soft border-2 border-border-strong rounded-[14px] pr-9 pl-3 py-2 font-display text-sm text-ink placeholder:text-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="חיפוש גזע"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1 text-ink-soft"
                  aria-label="נקה"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
          <ul className="max-h-72 overflow-y-auto">
            {visible.length === 0 ? (
              <li className="p-4 text-center text-ink-soft text-sm font-medium">
                לא נמצא גזע 🐾
              </li>
            ) : (
              visible.map((b) => (
                <li key={b.slug}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(b.slug);
                      setOpen(false);
                      setQuery("");
                    }}
                    className="w-full flex items-center gap-3 p-2.5 hover:bg-primary-tint text-right transition-colors"
                    role="option"
                    aria-selected={false}
                  >
                    <BreedPhoto breed={b} size={48} rounded="rounded-[12px]" />
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-extrabold text-sm text-ink leading-tight">
                        {b.name}
                      </div>
                      <div className="text-xs text-ink-soft truncate">{b.nameEn}</div>
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export function getDefaultCompareBreeds(): [Breed, Breed] {
  // Default pair: labrador vs canaan — a Western retriever vs the Israeli breed
  const a = BREEDS.find((b) => b.slug === "labrador") ?? BREEDS[0];
  const b = BREEDS.find((br) => br.slug === "canaan") ?? BREEDS[1];
  return [a, b];
}
