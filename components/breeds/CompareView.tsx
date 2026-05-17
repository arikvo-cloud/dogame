"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRightLeft,
  ExternalLink,
  Scale,
  Activity,
  Clock,
  Sparkles,
} from "lucide-react";
import { BREEDS, bestWikipediaUrl } from "@/lib/breeds/data";
import { BreedPhoto } from "@/components/breed/BreedPhoto";
import { BreedComparePicker, getDefaultCompareBreeds } from "./BreedComparePicker";
import { CompatibilityRadar } from "@/components/result/CompatibilityRadar";
import { TRAITS, TRAIT_KEYS } from "@/lib/traits";
import type { Breed } from "@/lib/breeds/types";
import { cn } from "@/lib/cn";

interface Props {
  initialA?: string;
  initialB?: string;
}

const SIZE_LABEL: Record<Breed["size"], string> = {
  toy: "זעיר",
  small: "קטן",
  medium: "בינוני",
  large: "גדול",
  giant: "ענק",
};

/**
 * Side-by-side breed comparison. The two selected breeds are reflected in the
 * URL query (`?a=labrador&b=golden`) so the comparison can be shared.
 */
export function CompareView({ initialA, initialB }: Props) {
  const [defaultA, defaultB] = getDefaultCompareBreeds();
  const [aSlug, setASlug] = useState<string>(initialA ?? defaultA.slug);
  const [bSlug, setBSlug] = useState<string>(initialB ?? defaultB.slug);

  const a = BREEDS.find((br) => br.slug === aSlug) ?? defaultA;
  const b = BREEDS.find((br) => br.slug === bSlug) ?? defaultB;

  // Sync URL (no history pollution — replaceState)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("a", a.slug);
    url.searchParams.set("b", b.slug);
    window.history.replaceState(null, "", url.toString());
  }, [a.slug, b.slug]);

  function swap() {
    setASlug(b.slug);
    setBSlug(a.slug);
  }

  const wikiA = bestWikipediaUrl(a);
  const wikiB = bestWikipediaUrl(b);

  return (
    <div className="space-y-8">
      {/* Picker row */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-5 items-center">
        <BreedComparePicker
          label="גזע ראשון"
          value={a.slug}
          onChange={setASlug}
          excludeSlug={b.slug}
        />
        <button
          type="button"
          onClick={swap}
          aria-label="החלף בין הגזעים"
          className="self-end md:self-auto inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent text-white border-[3px] border-accent-deep shadow-[0_3px_0_var(--color-accent-deep)] hover:rotate-180 transition-transform"
        >
          <ArrowRightLeft className="w-5 h-5" strokeWidth={2.5} />
        </button>
        <BreedComparePicker
          label="גזע שני"
          value={b.slug}
          onChange={setBSlug}
          excludeSlug={a.slug}
        />
      </div>

      {/* Hero photos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <BreedSpotlight breed={a} accent="primary" wiki={wikiA} />
        <BreedSpotlight breed={b} accent="accent" wiki={wikiB} />
      </div>

      {/* Combined radar */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="rounded-[28px] border-[3px] border-border bg-surface p-6 md:p-8 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)]"
      >
        <h2 className="font-display font-black text-2xl text-ink mb-2 text-center">
          השוואת פרופיל תכונות
        </h2>
        <p className="text-sm text-ink-soft font-medium text-center mb-4">
          השוואת 10 הצירים בין שני הגזעים
        </p>
        <div className="flex justify-center">
          <CompatibilityRadar user={a.traits} breed={b.traits} size={320} />
        </div>
        <div className="mt-4 flex justify-center gap-6 text-sm text-ink-soft font-display font-bold">
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block w-3.5 h-3.5 rounded-md border-2 border-accent-deep border-dashed bg-accent/40"
            />
            {a.name}
          </span>
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block w-3.5 h-3.5 rounded-md bg-primary border-2 border-primary-deep"
            />
            {b.name}
          </span>
        </div>
      </motion.section>

      {/* Head-to-head trait table */}
      <section className="rounded-[28px] border-[3px] border-border bg-surface p-6 md:p-8 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)]">
        <h2 className="font-display font-black text-2xl text-ink mb-5 text-center">
          טבלת השוואה
        </h2>
        <div className="overflow-hidden rounded-[18px] border-2 border-border">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-soft">
                <th className="text-right p-3 font-display font-extrabold text-ink text-sm">
                  תכונה
                </th>
                <th className="p-3 font-display font-extrabold text-primary-deep text-sm">
                  {a.name}
                </th>
                <th className="p-3 font-display font-extrabold text-accent-deep text-sm">
                  {b.name}
                </th>
              </tr>
            </thead>
            <tbody>
              <Row label="גודל" valueA={SIZE_LABEL[a.size]} valueB={SIZE_LABEL[b.size]} />
              <Row
                label="משקל"
                valueA={`${a.weightKg[0]}–${a.weightKg[1]} ק"ג`}
                valueB={`${b.weightKg[0]}–${b.weightKg[1]} ק"ג`}
              />
              <Row
                label="תוחלת חיים"
                valueA={`${a.lifeExpectancy[0]}–${a.lifeExpectancy[1]} שנים`}
                valueB={`${b.lifeExpectancy[0]}–${b.lifeExpectancy[1]} שנים`}
              />
              <Row
                label="פעילות יומית"
                valueA={`${a.exerciseMinPerDay} דק'`}
                valueB={`${b.exerciseMinPerDay} דק'`}
                aHigherIsMore={(x, y) => parseInt(x) > parseInt(y)}
              />
              <Row
                label="היפואלרגני"
                valueA={a.hypoallergenic ? "כן ✓" : "לא"}
                valueB={b.hypoallergenic ? "כן ✓" : "לא"}
              />
              {TRAIT_KEYS.map((k) => (
                <Row
                  key={k}
                  label={TRAITS[k].label}
                  valueA={`${a.traits[k]}/10`}
                  valueB={`${b.traits[k]}/10`}
                  aHigherIsMore={() => a.traits[k] > b.traits[k]}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch">
        <Link
          href={`/breed/${a.slug}`}
          className="inline-flex items-center justify-center gap-2 bg-surface text-ink border-[3px] border-border-strong px-5 py-3 rounded-[20px] font-display font-extrabold shadow-[var(--shadow-clay)] hover:-translate-y-0.5 transition-transform"
        >
          קרא עוד על {a.name}
        </Link>
        <Link
          href="/quiz"
          className="inline-flex items-center justify-center gap-2 bg-primary text-white border-[3px] border-primary-deep px-5 py-3 rounded-[20px] font-display font-extrabold shadow-[var(--shadow-glow-primary)] hover:-translate-y-0.5 transition-transform"
        >
          ענה על השאלון
        </Link>
        <Link
          href={`/breed/${b.slug}`}
          className="inline-flex items-center justify-center gap-2 bg-surface text-ink border-[3px] border-border-strong px-5 py-3 rounded-[20px] font-display font-extrabold shadow-[var(--shadow-clay)] hover:-translate-y-0.5 transition-transform"
        >
          קרא עוד על {b.name}
        </Link>
      </div>
    </div>
  );
}

function BreedSpotlight({
  breed,
  accent,
  wiki,
}: {
  breed: Breed;
  accent: "primary" | "accent";
  wiki: { url: string; lang: "he" | "en" } | null;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] border-[3px] bg-surface p-5 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)] text-center",
        accent === "primary" ? "border-primary-deep" : "border-accent-deep"
      )}
    >
      <div className="flex justify-center mb-4">
        <BreedPhoto breed={breed} size={160} rounded="rounded-[24px]" />
      </div>
      <h3
        className={cn(
          "font-display font-black text-2xl text-ink leading-tight",
          accent === "primary" ? "" : ""
        )}
      >
        {breed.name}
      </h3>
      <p className="text-xs text-ink-soft font-display font-bold">{breed.nameEn}</p>
      <p className="mt-2 text-sm text-ink-soft font-medium">{breed.tagline}</p>
      <div className="mt-3 flex items-center justify-center gap-2 flex-wrap text-xs text-ink-soft font-display font-bold">
        <span className="inline-flex items-center gap-1 bg-bg-soft border-2 border-border-strong px-2.5 py-0.5 rounded-full">
          <Scale className="w-3 h-3" strokeWidth={2.5} />
          {breed.weightKg[0]}–{breed.weightKg[1]} ק"ג
        </span>
        <span className="inline-flex items-center gap-1 bg-bg-soft border-2 border-border-strong px-2.5 py-0.5 rounded-full">
          <Activity className="w-3 h-3" strokeWidth={2.5} />
          {breed.exerciseMinPerDay} דק'
        </span>
        <span className="inline-flex items-center gap-1 bg-bg-soft border-2 border-border-strong px-2.5 py-0.5 rounded-full">
          <Clock className="w-3 h-3" strokeWidth={2.5} />
          {breed.lifeExpectancy[0]}–{breed.lifeExpectancy[1]}
        </span>
        {breed.hypoallergenic && (
          <span className="inline-flex items-center gap-1 bg-success text-white border-2 border-success/80 px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" strokeWidth={2.5} />
            היפו
          </span>
        )}
        {wiki && (
          <a
            href={wiki.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-accent text-white border-2 border-accent-deep px-2.5 py-0.5 rounded-full hover:-translate-y-px transition-transform"
          >
            <ExternalLink className="w-3 h-3" strokeWidth={2.5} />
            ויקיפדיה
          </a>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  valueA,
  valueB,
  aHigherIsMore,
}: {
  label: string;
  valueA: string;
  valueB: string;
  aHigherIsMore?: (a: string, b: string) => boolean;
}) {
  let highlightA = false;
  let highlightB = false;
  if (aHigherIsMore && valueA !== valueB) {
    highlightA = aHigherIsMore(valueA, valueB);
    highlightB = !highlightA;
  }
  return (
    <tr className="border-t-2 border-border">
      <td className="p-3 font-display font-bold text-ink text-sm bg-bg-soft/40">
        {label}
      </td>
      <td
        className={cn(
          "p-3 text-center font-display font-bold text-sm",
          highlightA ? "bg-primary-tint text-primary-deep" : "text-ink"
        )}
      >
        {valueA}
      </td>
      <td
        className={cn(
          "p-3 text-center font-display font-bold text-sm",
          highlightB ? "bg-accent-tint text-accent-deep" : "text-ink"
        )}
      >
        {valueB}
      </td>
    </tr>
  );
}
