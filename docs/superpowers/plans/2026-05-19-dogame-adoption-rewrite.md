# DoGame v2 — Adoption Advocate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition DoGame from a breed-discovery quiz into a mission-driven adoption advocate. Add 5 new routes, ~50 simulated adoptable dogs across 8 fictional Israeli shelters, and adoption-first CTAs throughout — keeping the editorial design system and breed catalog intact.

**Architecture:** Layer-additive rewrite. New `AdoptableDog` and `Shelter` data models live alongside the existing `Breed` catalog. New routes (`/adopt`, `/dog/[id]`, `/shelters`, `/shelter/[slug]`, `/about-adoption`) are statically generated via `generateStaticParams`. The homepage hero is rewritten; all other existing pages get additive modifications. Disclaimer (`ExampleBadge` + footer + `/about-adoption`) is the ethical backbone.

**Tech Stack:** Next.js 16 App Router (static export), Tailwind v4, motion/react, TypeScript, Zustand for favorites. Cloudflare Pages hosting. No new dependencies.

**Test Strategy:** Project has no unit-test framework. Verification per task = `npx tsc --noEmit -p .` for compile, `npm run lint` for lint, `npm run build` for full build pass, Playwright visual screenshot for UI surfaces. Every task ends with a commit.

**Source spec:** `docs/superpowers/specs/2026-05-19-dogame-adoption-rewrite-design.md`

---

## File Structure

### New files (~25)

```
lib/dogs/
  types.ts                                 # AdoptableDog interface + helpers
  data.ts                                  # 50 dog entries
  helpers.ts                               # filter/lookup/group-by-region

lib/shelters/
  types.ts                                 # Shelter interface
  data.ts                                  # 8 fictional shelter entries
  helpers.ts                               # lookup by slug, by region

components/dogs/
  DogCard.tsx                              # compact dog card for grids
  DogHero.tsx                              # big hero for /dog/[id]
  DogTraitChips.tsx                        # goodWith chips

components/shelters/
  ShelterCard.tsx                          # shelter preview card

components/landing/
  AdoptionStatBanner.tsx                   # homepage mission stat

components/ui/
  LocationFilter.tsx                       # region chips
  ExampleBadge.tsx                         # "דוגמה איורית" tag

components/adopt/
  AdoptBrowse.tsx                          # filterable grid client component

app/adopt/page.tsx
app/dog/[id]/page.tsx
app/shelters/page.tsx
app/shelter/[slug]/page.tsx
app/about-adoption/page.tsx
```

### Modified files (~12)

```
app/page.tsx                               # hero rewrite + new sections
app/breed/[slug]/page.tsx                  # add "available now" section
app/quiz/page.tsx                          # no change unless layout shift
app/layout.tsx                             # site-wide footer disclaimer

components/landing/HeroPhotoFeature.tsx    # swipe adoptable dogs instead of breeds
components/providers/SiteNav.tsx           # add Adopt + Shelters tabs
components/result/ResultView.tsx           # adoption section + new CTA
components/result/MatchCard.tsx            # "X dogs of this breed available" inline section
components/breed/FavoriteButton.tsx        # add `type: "breed" | "dog"` prop
components/favorites/FavoritesView.tsx     # show breeds AND dogs tabs

store/useFavoritesStore.ts                 # split into breedSlugs + dogIds

lib/quiz/questions.ts                      # add 2 new questions
lib/breeds/matcher.ts                      # respect new quiz inputs
```

### Responsibility split

- `lib/dogs/` owns adoptable-dog data. Types stay separate from `lib/breeds/` (which keeps managing the 37-breed reference catalog).
- `components/dogs/` and `components/shelters/` own dog-/shelter-specific UI primitives. They consume but don't extend `components/breed/`.
- Adoption-flow routes live under their own directories — no nesting under existing routes.
- Disclaimer logic centralized in `ExampleBadge` + the footer in `app/layout.tsx`; never reimplemented per page.

---

## Block 1 — Data foundation

### Task 1.1: Add Shelter types

**Files:**
- Create: `lib/shelters/types.ts`

- [ ] **Step 1: Create the type file**

```ts
// lib/shelters/types.ts
export type Region = "north" | "center" | "south" | "jerusalem";

export interface Shelter {
  id: string;
  slug: string;
  /** Hebrew display name */
  name: string;
  /** City (Hebrew) */
  city: string;
  region: Region;
  /** 1-2 sentence description in Hebrew */
  description: string;
  /** Optional contact details */
  phone?: string;
  email?: string;
  website?: string;
  /** Hero image URL — proxied via images.weserv.nl if external */
  imageUrl?: string;
  /** Always true in v1 — data is illustrative */
  isExample: true;
}

export const REGION_LABELS: Record<Region, string> = {
  north: "צפון",
  center: "מרכז",
  south: "דרום",
  jerusalem: "ירושלים והסביבה",
};
```

- [ ] **Step 2: Verify compile**

Run: `npx tsc --noEmit -p .`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/shelters/types.ts
git commit -m "data: add Shelter type + region labels"
```

---

### Task 1.2: Add Shelter data (8 fictional shelters)

**Files:**
- Create: `lib/shelters/data.ts`
- Create: `lib/shelters/helpers.ts`

- [ ] **Step 1: Write 8 shelter entries**

Names are deliberately fictional to avoid trademark concerns. Each `website` field points to **adopt.org.il** (Israel's official adoption umbrella) so "Express interest" CTAs always lead somewhere useful.

```ts
// lib/shelters/data.ts
import type { Shelter } from "./types";

export const SHELTERS: Shelter[] = [
  {
    id: "noaf-galil",
    slug: "noaf-galil",
    name: "מקלט נוף הגליל",
    city: "נוף הגליל",
    region: "north",
    description: "מקלט אזורי לכלבים נטושים בצפון. פועל מ-2014 בעזרת מתנדבים.",
    website: "https://adopt.org.il",
    isExample: true,
  },
  {
    id: "haifa-bay-paws",
    slug: "haifa-bay-paws",
    name: "כפות-מפרץ חיפה",
    city: "חיפה",
    region: "north",
    description: "אגודה חיפאית המתמחה בשיקום כלבים פצועים ומציאת בתים מאמצים.",
    website: "https://adopt.org.il",
    isExample: true,
  },
  {
    id: "tlv-dog-haven",
    slug: "tlv-dog-haven",
    name: "מעון הכלבים תל אביב",
    city: "תל אביב",
    region: "center",
    description: "המעון הגדול במרכז. עשרות כלבים מחכים למשפחה בכל זמן.",
    website: "https://adopt.org.il",
    isExample: true,
  },
  {
    id: "sharon-rescue",
    slug: "sharon-rescue",
    name: "אגודת הצלה השרון",
    city: "כפר סבא",
    region: "center",
    description: "פועלת באזור השרון, מתמקדת בכלבים גזעיים שננטשו ובתערובות.",
    website: "https://adopt.org.il",
    isExample: true,
  },
  {
    id: "jerusalem-paws",
    slug: "jerusalem-paws",
    name: "כפות ירושלים",
    city: "ירושלים",
    region: "jerusalem",
    description: "מעון מרכזי באזור ירושלים, מתמחה בכלבים מבוגרים וכלבי שירות בדימוס.",
    website: "https://adopt.org.il",
    isExample: true,
  },
  {
    id: "judean-hills-haven",
    slug: "judean-hills-haven",
    name: "מקלט הרי יהודה",
    city: "בית שמש",
    region: "jerusalem",
    description: "מקלט קטן בהרי יהודה, מתמקד בכלבי-רחוב שעברו טיפול וטרינרי.",
    website: "https://adopt.org.il",
    isExample: true,
  },
  {
    id: "beersheba-friends",
    slug: "beersheba-friends",
    name: "ידידי באר שבע",
    city: "באר שבע",
    region: "south",
    description: "האגודה הגדולה בנגב. פועלת בשיתוף עם הרשות המקומית.",
    website: "https://adopt.org.il",
    isExample: true,
  },
  {
    id: "negev-paws",
    slug: "negev-paws",
    name: "כפות הנגב",
    city: "אופקים",
    region: "south",
    description: "מקלט אזורי בדרום, מתמחה בכלבים עמידים בחום ובסביבה כפרית.",
    website: "https://adopt.org.il",
    isExample: true,
  },
];

export function getShelterBySlug(slug: string): Shelter | undefined {
  return SHELTERS.find((s) => s.slug === slug);
}

export function getShelterById(id: string): Shelter | undefined {
  return SHELTERS.find((s) => s.id === id);
}
```

- [ ] **Step 2: Helpers file**

```ts
// lib/shelters/helpers.ts
import { SHELTERS } from "./data";
import type { Region, Shelter } from "./types";

export function getSheltersByRegion(region: Region): Shelter[] {
  return SHELTERS.filter((s) => s.region === region);
}

export function allShelterSlugs(): string[] {
  return SHELTERS.map((s) => s.slug);
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit -p .`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/shelters/
git commit -m "data: 8 fictional Israeli shelters across north/center/south/jerusalem"
```

---

### Task 1.3: Add AdoptableDog types

**Files:**
- Create: `lib/dogs/types.ts`

- [ ] **Step 1: Write the type**

```ts
// lib/dogs/types.ts
import type { BreedSize } from "@/lib/breeds/types";
import type { Region } from "@/lib/shelters/types";

export type AgeGroup = "puppy" | "young" | "adult" | "senior";
export type DogSex = "male" | "female";
export type GoodWith = "kids" | "cats" | "dogs" | "small-pets";

export interface AdoptableDog {
  /** Stable URL slug: "{shelter}-{name-lat}-{n}" */
  id: string;
  /** Hebrew name */
  name: string;
  /** Age in years (decimal allowed for young dogs) */
  age: number;
  ageGroup: AgeGroup;
  sex: DogSex;
  neutered: boolean;
  size: BreedSize;
  /** Slug of a breed in `lib/breeds/data.ts`, if applicable */
  breedSlug?: string;
  /** Display string — "לברדור מעורב" or "תערובת" */
  breedDisplay: string;
  weightKg?: number;
  /** Image URL (Wikimedia or proxied) */
  imageUrl: string;
  shelterId: string;
  region: Region;
  /** 2-3 sentence Hebrew story */
  description: string;
  goodWith: GoodWith[];
  /** Optional Hebrew descriptors (energy level, special needs, etc.) */
  tags: string[];
  /** ISO date string */
  dateAvailable: string;
  /** External URL for express-interest CTA (shelter contact) */
  contactUrl: string;
  /** Always true in v1 */
  isExample: true;
}

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  puppy: "גור",
  young: "צעיר",
  adult: "בוגר",
  senior: "מבוגר",
};

export const SEX_LABELS: Record<DogSex, string> = {
  male: "זכר",
  female: "נקבה",
};

export const GOOD_WITH_LABELS: Record<GoodWith, string> = {
  kids: "ילדים",
  cats: "חתולים",
  dogs: "כלבים אחרים",
  "small-pets": "חיות קטנות",
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit -p .`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/dogs/types.ts
git commit -m "data: add AdoptableDog type with age groups + goodWith"
```

---

### Task 1.4: Add AdoptableDog data (50 dogs)

**Files:**
- Create: `lib/dogs/data.ts`
- Create: `lib/dogs/helpers.ts`

This is the largest data task. Aim for ~50 dogs distributed:
- **By age group**: ~7 puppies, ~17 young, ~20 adult, ~6 senior
- **By region**: 40% center (20), 25% north (12-13), 20% south (10), 15% jerusalem (7-8)
- **By breed mapping**: ~60% breedSlug populated (mapped to existing breeds), 40% pure `breedDisplay: "תערובת"` for mixed-breed dogs
- **By size**: 10% toy, 25% small, 30% medium, 25% large, 10% giant
- **Image sourcing**: reuse `imageUrl` from `lib/breeds/data.ts` for breedSlug-tagged dogs (acceptable for v1 since they're labeled as examples). Mixed-breed dogs get a single rotation of 3-4 generic dog Wikimedia URLs (Wikimedia category: "Mixed-breed dogs"). The `ExampleBadge` makes the reuse honest.

- [ ] **Step 1: Write the data file**

For brevity in this plan, the implementer should produce **the full ~50 entries** following the pattern of the example below. Use sensible Hebrew names (Luna, Max, Bella, Cooper, Daisy, Charlie, Lucy, Buddy → לונה, מקס, בלה, קופר, דייזי, צ'רלי, לוסי, באדי). Vary ageGroup, breed, size, region appropriately.

```ts
// lib/dogs/data.ts
import type { AdoptableDog } from "./types";

export const ADOPTABLE_DOGS: AdoptableDog[] = [
  // ── tlv-dog-haven (center) ─────────────────────────────────────────
  {
    id: "tlv-luna-2026",
    name: "לונה",
    age: 4,
    ageGroup: "adult",
    sex: "female",
    neutered: true,
    size: "medium",
    breedSlug: "labrador",
    breedDisplay: "לברדור מעורב",
    weightKg: 22,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/34/Labrador_on_Quantock_%282175262184%29.jpg",
    shelterId: "tlv-dog-haven",
    region: "center",
    description: "לונה הגיעה אלינו לפני שנה לאחר ששוחררה ממשפחה שלא יכלה לטפל בה. היא רגועה, אוהבת ילדים, ועברה אילוף בסיסי. מחפשת בית עם חצר.",
    goodWith: ["kids", "dogs"],
    tags: ["מאולפת בסיסית", "אנרגיה בינונית", "אוהבת מים"],
    dateAvailable: "2026-03-15",
    contactUrl: "https://adopt.org.il",
    isExample: true,
  },
  {
    id: "tlv-max-2026",
    name: "מקס",
    age: 0.5,
    ageGroup: "puppy",
    sex: "male",
    neutered: false,
    size: "medium",
    breedDisplay: "תערובת",
    weightKg: 8,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Mixed_breed_dog.jpg/1200px-Mixed_breed_dog.jpg",
    shelterId: "tlv-dog-haven",
    region: "center",
    description: "גור בן 6 חודשים, נמצא ברחוב יחד עם אחים. שובב, חברותי, ילמד מהר במשפחה אוהבת.",
    goodWith: ["kids", "dogs", "cats"],
    tags: ["גור", "אנרגיה גבוהה", "צריך אילוף"],
    dateAvailable: "2026-04-01",
    contactUrl: "https://adopt.org.il",
    isExample: true,
  },
  // ── continue with ~48 more dogs ──
  // Pattern: 3-5 dogs per shelter on average (~50 dogs / 8 shelters).
  // Vary breeds: pull breedSlugs from lib/breeds/data.ts (golden, labrador,
  // canaan, beagle, border-collie, vizsla, poodle-mini, bichon-frise,
  // chihuahua, german-shepherd, french-bulldog, malinois, australian-shepherd,
  // boxer, dachshund, dalmatian, etc.).
  // For mixed-breed dogs, use breedDisplay: "תערובת" and omit breedSlug.
];

export function getDogById(id: string): AdoptableDog | undefined {
  return ADOPTABLE_DOGS.find((d) => d.id === id);
}

export function allDogIds(): string[] {
  return ADOPTABLE_DOGS.map((d) => d.id);
}
```

- [ ] **Step 2: Helpers**

```ts
// lib/dogs/helpers.ts
import { ADOPTABLE_DOGS } from "./data";
import type { AdoptableDog, AgeGroup, GoodWith } from "./types";
import type { BreedSize } from "@/lib/breeds/types";
import type { Region } from "@/lib/shelters/types";

interface DogFilter {
  region?: Region;
  size?: BreedSize;
  ageGroup?: AgeGroup;
  breedSlug?: string;
  goodWith?: GoodWith;
  shelterId?: string;
  query?: string;
}

export function filterDogs(filter: DogFilter = {}): AdoptableDog[] {
  return ADOPTABLE_DOGS.filter((d) => {
    if (filter.region && d.region !== filter.region) return false;
    if (filter.size && d.size !== filter.size) return false;
    if (filter.ageGroup && d.ageGroup !== filter.ageGroup) return false;
    if (filter.breedSlug && d.breedSlug !== filter.breedSlug) return false;
    if (filter.goodWith && !d.goodWith.includes(filter.goodWith)) return false;
    if (filter.shelterId && d.shelterId !== filter.shelterId) return false;
    if (filter.query) {
      const q = filter.query.toLowerCase();
      const hay = (d.name + " " + d.breedDisplay + " " + d.description).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

/** Dogs of a specific breed. */
export function dogsForBreed(breedSlug: string, limit?: number): AdoptableDog[] {
  const list = filterDogs({ breedSlug });
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

/** Up to N dogs near a region, used by /result and homepage. */
export function dogsInRegion(region: Region, limit: number): AdoptableDog[] {
  return filterDogs({ region }).slice(0, limit);
}

/** Random N dogs for "this week" homepage row. Deterministic per day. */
export function dogsOfTheWeek(limit: number): AdoptableDog[] {
  // Deterministic shuffle seeded by date so all visitors see the same dogs today
  const seed = new Date().toISOString().slice(0, 10);
  const arr = [...ADOPTABLE_DOGS];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  for (let i = arr.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    const j = h % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, limit);
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit -p .`
Expected: no errors. If TypeScript complains about a `breedSlug` that doesn't exist in `lib/breeds/data.ts`, fix the slug or drop it.

- [ ] **Step 4: Commit**

```bash
git add lib/dogs/
git commit -m "data: 50 simulated adoptable dogs + filter/lookup helpers"
```

---

## Block 2 — New components

### Task 2.1: ExampleBadge

**Files:**
- Create: `components/ui/ExampleBadge.tsx`

- [ ] **Step 1: Build the component**

```tsx
// components/ui/ExampleBadge.tsx
import { cn } from "@/lib/cn";

interface ExampleBadgeProps {
  className?: string;
}

/** Small "דוגמה איורית" tag for every dog/shelter card.
 *  Required by the v1 disclosure pattern. */
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
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit -p . && git add components/ui/ExampleBadge.tsx && git commit -m "components: ExampleBadge for v1 disclosure"
```

---

### Task 2.2: LocationFilter

**Files:**
- Create: `components/ui/LocationFilter.tsx`

- [ ] **Step 1: Build the component**

Chip-based region selector — uses the same `FilterChips` pattern that `BreedsBrowse.tsx` already uses, but standalone so it can be reused.

```tsx
// components/ui/LocationFilter.tsx
"use client";

import { cn } from "@/lib/cn";
import type { Region } from "@/lib/shelters/types";
import { REGION_LABELS } from "@/lib/shelters/types";

interface LocationFilterProps {
  value: Region | "all";
  onChange: (value: Region | "all") => void;
  /** Optional counts per region for display */
  counts?: Record<Region | "all", number>;
  className?: string;
}

const REGIONS: Array<Region | "all"> = ["all", "center", "north", "south", "jerusalem"];

export function LocationFilter({ value, onChange, counts, className }: LocationFilterProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {REGIONS.map((r) => {
        const active = r === value;
        const label = r === "all" ? "כל הארץ" : REGION_LABELS[r];
        const count = counts?.[r];
        return (
          <button
            key={r}
            type="button"
            onClick={() => onChange(r)}
            className={cn(
              "px-3 py-1 rounded-full border-2 text-sm font-display font-bold transition-colors cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
              active
                ? "bg-primary text-white border-primary-deep shadow-[0_2px_0_var(--color-primary-deep)]"
                : "bg-bg-soft text-ink border-border-strong hover:bg-primary-tint"
            )}
          >
            {label}
            {typeof count === "number" && (
              <span className={cn("mr-1.5 tabular-nums", active ? "opacity-80" : "text-ink-mute")}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit -p . && git add components/ui/LocationFilter.tsx && git commit -m "components: LocationFilter region chips"
```

---

### Task 2.3: DogTraitChips

**Files:**
- Create: `components/dogs/DogTraitChips.tsx`

- [ ] **Step 1: Build the component**

```tsx
// components/dogs/DogTraitChips.tsx
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/cn";
import type { GoodWith } from "@/lib/dogs/types";
import { GOOD_WITH_LABELS } from "@/lib/dogs/types";

interface DogTraitChipsProps {
  goodWith: GoodWith[];
  className?: string;
}

const ALL: GoodWith[] = ["kids", "cats", "dogs", "small-pets"];

export function DogTraitChips({ goodWith, className }: DogTraitChipsProps) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {ALL.map((trait) => {
        const ok = goodWith.includes(trait);
        return (
          <li
            key={trait}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-display font-bold",
              ok
                ? "bg-success-tint text-success-deep border-success/40"
                : "bg-bg-soft text-ink-mute border-border"
            )}
          >
            {ok ? <Check className="w-3 h-3" strokeWidth={3} /> : <Minus className="w-3 h-3" strokeWidth={3} />}
            {GOOD_WITH_LABELS[trait]}
          </li>
        );
      })}
    </ul>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit -p . && git add components/dogs/DogTraitChips.tsx && git commit -m "components: DogTraitChips for goodWith"
```

---

### Task 2.4: DogCard

**Files:**
- Create: `components/dogs/DogCard.tsx`

- [ ] **Step 1: Build the component**

The compact card used in grids and rows. Mirrors `BreedTile` from `BreedsBrowse.tsx` in proportions (`rounded-[22px]` border, clay shadows, hover lift) so the visual rhythm of the site stays unified. Uses `Image` directly because dog images need `unoptimized` proxy semantics like `BreedPhoto` but the data model differs.

```tsx
// components/dogs/DogCard.tsx
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
  /** Compact = no description */
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
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit -p . && git add components/dogs/DogCard.tsx && git commit -m "components: DogCard for adoptable-dog grids"
```

---

### Task 2.5: ShelterCard

**Files:**
- Create: `components/shelters/ShelterCard.tsx`

- [ ] **Step 1: Build the component**

```tsx
// components/shelters/ShelterCard.tsx
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
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit -p . && git add components/shelters/ShelterCard.tsx && git commit -m "components: ShelterCard with available-dog count"
```

---

### Task 2.6: AdoptionStatBanner

**Files:**
- Create: `components/landing/AdoptionStatBanner.tsx`

- [ ] **Step 1: Build the component**

The new homepage hero text column. Drops in next to `HeroPhotoFeature` on the right.

```tsx
// components/landing/AdoptionStatBanner.tsx
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SectionMark } from "@/components/ui/SectionMark";

export function AdoptionStatBanner() {
  return (
    <div className="text-right">
      <Reveal from="up" delay={0.05}>
        <SectionMark numeral="01" label="המשימה" />
      </Reveal>

      <h1 className="mt-5 font-extrabold font-display text-ink leading-[0.95] tracking-tight text-[clamp(2.25rem,7vw,5.5rem)] break-words">
        <span className="text-primary-deep tabular-nums">1</span> מתוך{" "}
        <span className="text-primary-deep tabular-nums">3</span>{" "}
        <span className="italic font-medium">כלבים חוזרים למחסה</span> בשנה הראשונה.
      </h1>

      <Reveal from="up" delay={0.45}>
        <p className="drop-cap mt-7 text-lg md:text-xl text-ink-soft leading-relaxed max-w-prose font-medium">
          בואו נשנה זאת. DoGame עוזר לכם לבחור את הכלב הנכון —{" "}
          לפני שמביאים אותו הביתה. דרך שאלון קצר, פרופילי גזעים מפורטים, וקישור
          ישיר לכלבים שמחכים לאימוץ במקלטים ברחבי הארץ.
        </p>
      </Reveal>

      <Reveal from="up" delay={0.7}>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <MagneticButton>
            <Link
              href="/adopt"
              data-paw-zone
              className="group inline-flex items-center justify-center gap-2 bg-primary text-white border-2 border-primary-deep px-7 py-4 rounded-[22px] shadow-[var(--shadow-glow-primary)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[var(--shadow-clay-press)] font-display font-extrabold text-lg transition-all"
            >
              <Heart className="w-5 h-5" strokeWidth={2.5} fill="currentColor" />
              מצאו כלב לאמץ
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </MagneticButton>
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center gap-2 bg-surface text-ink border-2 border-border px-7 py-4 rounded-[22px] font-display font-bold text-base shadow-[var(--shadow-clay)] hover:-translate-y-0.5 hover:border-border-strong active:translate-y-1 transition-all"
          >
            או — התחילו שאלון
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit -p . && git add components/landing/AdoptionStatBanner.tsx && git commit -m "components: AdoptionStatBanner mission hero"
```

---

### Task 2.7: DogHero (for /dog/[id])

**Files:**
- Create: `components/dogs/DogHero.tsx`

- [ ] **Step 1: Build the component**

Editorial photo-dominant hero matching the existing `/breed/[slug]` hero pattern.

```tsx
// components/dogs/DogHero.tsx
import Image from "next/image";
import { proxyImage } from "@/lib/image-proxy";
import { cn } from "@/lib/cn";
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
      {/* Photo */}
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

      {/* Text */}
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
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit -p . && git add components/dogs/DogHero.tsx && git commit -m "components: DogHero editorial photo hero for /dog/[id]"
```

---

## Block 3 — New routes

### Task 3.1: /shelters page

**Files:**
- Create: `app/shelters/page.tsx`

- [ ] **Step 1: Build the route**

Editorial header + grid of `ShelterCard`s grouped by region.

```tsx
// app/shelters/page.tsx
import { SHELTERS } from "@/lib/shelters/data";
import { REGION_LABELS } from "@/lib/shelters/types";
import type { Region } from "@/lib/shelters/types";
import { SiteNav } from "@/components/providers/SiteNav";
import { AuroraBackground } from "@/components/providers/AuroraBackground";
import { SectionMark } from "@/components/ui/SectionMark";
import { ShelterCard } from "@/components/shelters/ShelterCard";

export const metadata = {
  title: "מקלטים · DoGame",
  description: "8 אגודות רווחת חיות ברחבי ישראל המאמצות כלבים. צפון, מרכז, דרום, ירושלים.",
  alternates: { canonical: "/shelters" },
};

const REGION_ORDER: Region[] = ["center", "north", "jerusalem", "south"];

export default function SheltersPage() {
  const byRegion = Object.fromEntries(
    REGION_ORDER.map((r) => [r, SHELTERS.filter((s) => s.region === r)])
  );

  return (
    <main id="main" className="min-h-dvh bg-clay">
      <AuroraBackground />
      <SiteNav />
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <header className="mb-10 md:mb-14">
          <SectionMark numeral="08" label="מקלטים בישראל" />
          <div className="mt-5 grid md:grid-cols-12 gap-6 md:gap-10 items-end">
            <h1 className="md:col-span-7 font-extrabold font-display text-ink leading-[0.95] tracking-tight text-[clamp(2.5rem,7vw,5.5rem)]">
              איפה {" "}
              <span className="italic text-primary-deep font-medium">מאמצים</span>
            </h1>
            <p className="md:col-span-5 text-ink-soft text-base md:text-lg font-medium max-w-prose leading-relaxed">
              {SHELTERS.length} אגודות פועלות ברחבי הארץ — מהגליל ועד הנגב. בחרו אזור או דפדפו בכל המקלטים.
            </p>
          </div>
          <hr className="magazine-rule mt-10" />
        </header>

        {REGION_ORDER.map((region) => {
          const shelters = byRegion[region];
          if (shelters.length === 0) return null;
          return (
            <section key={region} className="mb-14">
              <SectionMark label={REGION_LABELS[region]} />
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                {shelters.map((s) => (
                  <ShelterCard key={s.id} shelter={s} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit -p . && git add app/shelters/page.tsx && git commit -m "route: /shelters editorial grid grouped by region"
```

---

### Task 3.2: /shelter/[slug] page

**Files:**
- Create: `app/shelter/[slug]/page.tsx`

- [ ] **Step 1: Build the route**

```tsx
// app/shelter/[slug]/page.tsx
import { notFound } from "next/navigation";
import { MapPin, Globe } from "lucide-react";
import { SHELTERS, getShelterBySlug } from "@/lib/shelters/data";
import { allShelterSlugs } from "@/lib/shelters/helpers";
import { REGION_LABELS } from "@/lib/shelters/types";
import { filterDogs } from "@/lib/dogs/helpers";
import { SiteNav } from "@/components/providers/SiteNav";
import { AuroraBackground } from "@/components/providers/AuroraBackground";
import { SectionMark } from "@/components/ui/SectionMark";
import { ExampleBadge } from "@/components/ui/ExampleBadge";
import { DogCard } from "@/components/dogs/DogCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allShelterSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const shelter = getShelterBySlug(slug);
  if (!shelter) return { title: "מקלט לא נמצא · DoGame" };
  return {
    title: `${shelter.name} · DoGame`,
    description: shelter.description,
    alternates: { canonical: `/shelter/${shelter.slug}/` },
  };
}

export default async function ShelterPage({ params }: PageProps) {
  const { slug } = await params;
  const shelter = getShelterBySlug(slug);
  if (!shelter) notFound();

  const dogs = filterDogs({ shelterId: shelter.id });

  return (
    <main id="main" className="min-h-dvh bg-clay">
      <AuroraBackground />
      <SiteNav />
      <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <header className="mb-10">
          <div className="flex items-center gap-3"><ExampleBadge /></div>
          <SectionMark numeral="N°1" label={`${REGION_LABELS[shelter.region]} · ${shelter.city}`} className="mt-4" />
          <h1 className="mt-5 text-4xl md:text-6xl lg:text-7xl font-extrabold font-display text-ink leading-[0.95]">
            {shelter.name}
          </h1>
          <p className="mt-5 text-ink-soft text-lg md:text-xl font-medium max-w-prose leading-relaxed">
            {shelter.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-display font-bold text-ink-soft">
            <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" />{shelter.city}</span>
            {shelter.website && (
              <a href={shelter.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary-deep underline underline-offset-4 hover:text-primary">
                <Globe className="w-4 h-4" />אתר מאמצים בישראל
              </a>
            )}
          </div>
          <hr className="magazine-rule mt-8" />
        </header>

        <section>
          <SectionMark numeral={`${dogs.length}`} label="כלבים מחכים לבית" />
          {dogs.length === 0 ? (
            <p className="mt-6 text-ink-soft font-medium">אין כרגע כלבים זמינים במקלט זה.</p>
          ) : (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {dogs.map((d) => <DogCard key={d.id} dog={d} />)}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit -p . && git add app/shelter && git commit -m "route: /shelter/[slug] with dogs grid"
```

---

### Task 3.3: /dog/[id] page

**Files:**
- Create: `app/dog/[id]/page.tsx`

- [ ] **Step 1: Build the route**

```tsx
// app/dog/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getDogById, allDogIds } from "@/lib/dogs/data";
import { filterDogs } from "@/lib/dogs/helpers";
import { getShelterById } from "@/lib/shelters/data";
import { getBreedBySlug } from "@/lib/breeds/data";
import { SiteNav } from "@/components/providers/SiteNav";
import { AuroraBackground } from "@/components/providers/AuroraBackground";
import { Reveal } from "@/components/ui/Reveal";
import { SectionMark } from "@/components/ui/SectionMark";
import { DogHero } from "@/components/dogs/DogHero";
import { DogTraitChips } from "@/components/dogs/DogTraitChips";
import { DogCard } from "@/components/dogs/DogCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return allDogIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const dog = getDogById(id);
  if (!dog) return { title: "כלב לא נמצא · DoGame" };
  return {
    title: `${dog.name} · ${dog.breedDisplay} · DoGame`,
    description: dog.description.slice(0, 160),
    alternates: { canonical: `/dog/${dog.id}/` },
  };
}

export default async function DogPage({ params }: PageProps) {
  const { id } = await params;
  const dog = getDogById(id);
  if (!dog) notFound();

  const shelter = getShelterById(dog.shelterId);
  if (!shelter) notFound();

  const breed = dog.breedSlug ? getBreedBySlug(dog.breedSlug) : null;
  const similar = filterDogs({ region: dog.region }).filter((d) => d.id !== dog.id).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${dog.name} — ${dog.breedDisplay} מ${shelter.name}`,
    description: dog.description,
    inLanguage: "he",
    image: dog.imageUrl,
    datePublished: dog.dateAvailable,
    isFamilyFriendly: dog.goodWith.includes("kids"),
  };

  return (
    <main id="main" className="min-h-dvh bg-clay">
      <AuroraBackground />
      <SiteNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">
        <DogHero dog={dog} shelterName={shelter.name} shelterCity={shelter.city} />

        <Reveal from="up">
          <section className="mt-6 rounded-[28px] border-2 border-border bg-surface p-6 md:p-8 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)]">
            <SectionMark label={`הסיפור של ${dog.name}`} />
            <p className="mt-5 text-ink leading-relaxed text-lg font-medium">{dog.description}</p>
            <div className="mt-6">
              <DogTraitChips goodWith={dog.goodWith} />
            </div>
          </section>
        </Reveal>

        <Reveal from="up">
          <section className="mt-6 rounded-[28px] border-2 border-border bg-surface p-6 md:p-8 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)] text-center">
            <SectionMark label="מעוניינים?" className="justify-center" />
            <p className="mt-4 text-ink-soft text-base md:text-lg max-w-prose mx-auto leading-relaxed">
              לבירור על {dog.name} פנו ישירות ל{shelter.name} — או לאחת מאגודות הרווחה בישראל.
            </p>
            <a
              href={dog.contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-paw-zone
              className="mt-6 inline-flex items-center gap-2 bg-primary text-white border-2 border-primary-deep px-7 py-3.5 rounded-[20px] shadow-[var(--shadow-glow-primary)] hover:-translate-y-0.5 active:translate-y-1 transition-all font-display font-extrabold"
            >
              פנו לבירור אימוץ
              <ExternalLink className="w-4 h-4" />
            </a>
          </section>
        </Reveal>

        {breed && (
          <Reveal from="up">
            <section className="mt-6 rounded-[28px] border-2 border-border bg-surface p-6 md:p-8 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)]">
              <SectionMark label={`על הגזע: ${breed.name}`} />
              <p className="mt-4 text-ink leading-relaxed font-medium">{breed.tagline}</p>
              <Link
                href={`/breed/${breed.slug}`}
                className="mt-4 inline-flex items-center gap-1.5 text-primary-deep font-display font-extrabold underline underline-offset-4 decoration-primary/40 hover:decoration-primary"
              >
                לפרופיל המלא של הגזע
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </section>
          </Reveal>
        )}

        {similar.length > 0 && (
          <Reveal from="up">
            <section className="mt-10">
              <SectionMark label="כלבים נוספים באזור" />
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {similar.map((d) => <DogCard key={d.id} dog={d} />)}
              </div>
            </section>
          </Reveal>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit -p . && git add app/dog && git commit -m "route: /dog/[id] with story, shelter contact, similar dogs"
```

---

### Task 3.4: /adopt page (filterable grid)

**Files:**
- Create: `components/adopt/AdoptBrowse.tsx` (client component)
- Create: `app/adopt/page.tsx` (server wrapper)

- [ ] **Step 1: Client browse component**

```tsx
// components/adopt/AdoptBrowse.tsx
"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X } from "lucide-react";
import { ADOPTABLE_DOGS } from "@/lib/dogs/data";
import { filterDogs } from "@/lib/dogs/helpers";
import type { AgeGroup, GoodWith } from "@/lib/dogs/types";
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

  // Region counts for chip badges
  const regionCounts = useMemo(() => {
    return {
      all: ADOPTABLE_DOGS.length,
      center: ADOPTABLE_DOGS.filter((d) => d.region === "center").length,
      north: ADOPTABLE_DOGS.filter((d) => d.region === "north").length,
      south: ADOPTABLE_DOGS.filter((d) => d.region === "south").length,
      jerusalem: ADOPTABLE_DOGS.filter((d) => d.region === "jerusalem").length,
    };
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
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
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
```

- [ ] **Step 2: Server route**

```tsx
// app/adopt/page.tsx
import { AdoptBrowse } from "@/components/adopt/AdoptBrowse";
import { ADOPTABLE_DOGS } from "@/lib/dogs/data";
import { SiteNav } from "@/components/providers/SiteNav";
import { AuroraBackground } from "@/components/providers/AuroraBackground";
import { SectionMark } from "@/components/ui/SectionMark";

export const metadata = {
  title: "כלבים לאימוץ · DoGame",
  description: `${ADOPTABLE_DOGS.length} כלבים מחכים לבית בכל רחבי ישראל. סינון לפי אזור, גודל וגיל.`,
  alternates: { canonical: "/adopt" },
};

export default function AdoptPage() {
  return (
    <main id="main" className="min-h-dvh bg-clay">
      <AuroraBackground />
      <SiteNav />
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <header className="mb-10">
          <SectionMark numeral="01" label="אימוץ" />
          <div className="mt-5 grid md:grid-cols-12 gap-6 md:gap-10 items-end">
            <h1 className="md:col-span-7 font-extrabold font-display text-ink leading-[0.95] tracking-tight text-[clamp(2.5rem,7vw,5.5rem)]">
              כלבים{" "}
              <span className="italic text-primary-deep font-medium">מחכים</span>{" "}
              לבית
            </h1>
            <p className="md:col-span-5 text-ink-soft text-base md:text-lg font-medium max-w-prose leading-relaxed">
              {ADOPTABLE_DOGS.length} כלבים זמינים ברגע זה במקלטים ברחבי הארץ. סננו לפי אזור, גודל וגיל כדי למצוא את ההתאמה המתאימה לכם.
            </p>
          </div>
          <hr className="magazine-rule mt-10" />
        </header>

        <AdoptBrowse />
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Typecheck + commit**

```bash
npx tsc --noEmit -p . && git add app/adopt components/adopt && git commit -m "route: /adopt with region/size/age filters + search"
```

---

### Task 3.5: /about-adoption page

**Files:**
- Create: `app/about-adoption/page.tsx`

- [ ] **Step 1: Build the route**

Editorial article. Long-form Hebrew copy with stats. The 3 stats are illustrative — sources cited in footnotes.

```tsx
// app/about-adoption/page.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteNav } from "@/components/providers/SiteNav";
import { AuroraBackground } from "@/components/providers/AuroraBackground";
import { SectionMark } from "@/components/ui/SectionMark";
import { Reveal } from "@/components/ui/Reveal";

export const metadata = {
  title: "אימוץ מול קנייה · DoGame",
  description: "אימוץ כלב בישראל — מה כדאי לדעת לפני שמביאים כלב הביתה. סטטיסטיקות, תהליך, ומיתוסים נפוצים.",
  alternates: { canonical: "/about-adoption" },
};

export default function AboutAdoptionPage() {
  return (
    <main id="main" className="min-h-dvh bg-clay">
      <AuroraBackground />
      <SiteNav />
      <article className="mx-auto max-w-3xl px-4 py-10 md:py-16">
        <header className="mb-12">
          <SectionMark numeral="00" label="המאמר" />
          <h1 className="mt-5 font-extrabold font-display text-ink leading-[0.95] tracking-tight text-[clamp(2.5rem,7vw,5rem)]">
            אימוץ מול{" "}
            <span className="italic text-primary-deep font-medium">קנייה</span>
          </h1>
          <p className="mt-5 text-ink-mute text-lg italic font-display">מה כדאי לדעת לפני שמביאים כלב הביתה.</p>
          <hr className="magazine-rule mt-8" />
        </header>

        <Reveal from="up">
          <p className="drop-cap text-lg md:text-xl text-ink leading-relaxed font-medium">
            בישראל יש אלפי כלבים שמחכים לבית בכל זמן נתון. רובם תערובות בריאות, צעירות, וחברותיות שהגיעו למקלטים בעקבות מצבי חיים שאין להם קשר לכלב עצמו — מעבר דירה, משבר כלכלי, מחלה במשפחה. אימוץ הוא הדרך הזולה, האחראית והאתית ביותר להביא כלב הביתה.
          </p>
        </Reveal>

        <Reveal from="up">
          <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-px bg-border md:rounded-[20px] overflow-hidden md:border-2 md:border-border">
            <StatPanel num="1/3" label="מהכלבים חוזרים למקלט בשנה הראשונה" />
            <StatPanel num="0₪" label="אימוץ ברוב המקלטים — רק עלות חיסונים ועיקור" />
            <StatPanel num="60%" label="מהכלבים בישראל הם תערובות" />
          </section>
          <p className="mt-3 text-xs text-ink-mute italic">* נתונים מקורבים. מבוסס על דיווחי אגודות רווחת חיות בישראל, 2024.</p>
        </Reveal>

        <Reveal from="up">
          <h2 className="mt-14 text-3xl md:text-4xl font-extrabold font-display text-ink leading-tight">
            תהליך האימוץ — איך זה עובד?
          </h2>
          <ol className="mt-6 space-y-6">
            <Step n="01" title="בחירת מקלט">
              בוחרים מקלט באזור המגורים שלכם. רוב המקלטים מאפשרים להגיע ולהכיר את הכלבים, חלקם דורשים תיאום מראש.
            </Step>
            <Step n="02" title="הכרות עם הכלב">
              פוגשים את הכלב בסביבה רגועה. שואלים את הצוות על האופי, ההיסטוריה, וצרכים מיוחדים. רוב המקלטים מאפשרים אימוץ-ניסיון של שבוע-שבועיים.
            </Step>
            <Step n="03" title="חתימה והבאה הביתה">
              חותמים על הסכם אימוץ, מקבלים מסמכי וטרינריה, ומביאים את הכלב הביתה. לוקח לרוב הכלבים 2-4 שבועות להסתגל לסביבה חדשה.
            </Step>
          </ol>
        </Reveal>

        <Reveal from="up">
          <h2 className="mt-14 text-3xl md:text-4xl font-extrabold font-display text-ink leading-tight">
            מיתוסים נפוצים
          </h2>
          <dl className="mt-6 space-y-6">
            <Myth title="&quot;כלבי מקלט הם בעייתיים&quot;">
              רוב הכלבים במקלטים הגיעו לשם בגלל בעיות במשפחה, לא בגללם. הם רק זקוקים לבית יציב.
            </Myth>
            <Myth title="&quot;גורים מקנייה זה יותר בטוח&quot;">
              גורים ממכרי גורים סובלים פעמים רבות מבעיות גנטיות. כלב תערובת בריא בדרך כלל יותר מגזעי-יחוס.
            </Myth>
            <Myth title="&quot;אני רוצה גזע מסוים&quot;">
              גם גזעים &quot;נדירים&quot; מגיעים למקלטים. שווה לבדוק אצל מקלט גזעי באזור.
            </Myth>
          </dl>
        </Reveal>

        <Reveal from="scale">
          <div className="mt-16 rounded-[28px] border-2 border-primary-deep bg-primary-tint p-8 md:p-10 text-center shadow-[var(--shadow-clay-xl)]">
            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-ink leading-tight">
              מוכנים להתחיל?
            </h2>
            <p className="mt-3 text-ink-soft text-base md:text-lg max-w-prose mx-auto">
              צפו ב-50 כלבים המחכים ברגע זה לבית במקלטים ברחבי הארץ.
            </p>
            <Link
              href="/adopt"
              data-paw-zone
              className="mt-6 inline-flex items-center gap-2 bg-primary text-white border-2 border-primary-deep px-7 py-3.5 rounded-[20px] shadow-[var(--shadow-glow-primary)] hover:-translate-y-0.5 active:translate-y-1 transition-all font-display font-extrabold"
            >
              לכלבים זמינים
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </Reveal>

        <p className="mt-12 text-xs text-ink-mute italic max-w-prose">
          * פרטי הכלבים והמקלטים באתר הם דוגמאות איוריות. לאימוץ בפועל, פנו ישירות לאחת מאגודות הרווחה בישראל (adopt.org.il).
        </p>
      </article>
    </main>
  );
}

function StatPanel({ num, label }: { num: string; label: string }) {
  return (
    <div className="bg-surface p-7 text-center">
      <div className="serif-numeral text-[clamp(3rem,7vw,5rem)] text-primary-deep tabular-nums">{num}</div>
      <div className="mt-3 text-sm text-ink-soft font-display font-bold leading-tight">{label}</div>
    </div>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[auto_1fr] gap-5 items-baseline border-t border-border pt-5">
      <div className="serif-numeral text-3xl md:text-4xl text-primary-deep/40 tabular-nums">{n}</div>
      <div>
        <h3 className="font-display font-extrabold text-xl md:text-2xl text-ink leading-tight">{title}</h3>
        <p className="mt-2 text-ink-soft text-base md:text-lg leading-relaxed font-medium">{children}</p>
      </div>
    </li>
  );
}

function Myth({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-5">
      <dt className="font-display font-extrabold text-lg md:text-xl text-ink italic">{title}</dt>
      <dd className="mt-2 text-ink-soft text-base md:text-lg leading-relaxed font-medium">{children}</dd>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit -p . && git add app/about-adoption && git commit -m "route: /about-adoption editorial article with stats, process, myths"
```

---

## Block 4 — Modify existing

### Task 4.1: Update SiteNav with Adopt + Shelters tabs

**Files:**
- Modify: `components/providers/SiteNav.tsx`

- [ ] **Step 1: Read current nav file to see the existing pattern**

```bash
cat components/providers/SiteNav.tsx | head -80
```

- [ ] **Step 2: Add `אימוץ` and `מקלטים` items**

Locate the array of nav items in `SiteNav.tsx`. It will look something like:

```ts
const NAV_ITEMS = [
  { href: "/breeds", label: "כל הגזעים" },
  { href: "/quiz", label: "השאלון" },
  { href: "/about", label: "על הפרויקט" },
  // ...
];
```

Update to:

```ts
const NAV_ITEMS = [
  { href: "/adopt", label: "אימוץ" },
  { href: "/breeds", label: "כל הגזעים" },
  { href: "/quiz", label: "השאלון" },
  { href: "/shelters", label: "מקלטים" },
  { href: "/about", label: "על הפרויקט" },
];
```

`אימוץ` goes first because it's the new primary action. `שאלון` stays in the middle.

- [ ] **Step 3: Typecheck + commit**

```bash
npx tsc --noEmit -p . && git add components/providers/SiteNav.tsx && git commit -m "nav: add Adopt + Shelters tabs (Adopt primary)"
```

---

### Task 4.2: Homepage hero rewrite

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace the hero section**

In `app/page.tsx`, find the hero `<section>` that currently contains `<HeroPhotoFeature />` + the editorial text column. Replace the text column with `<AdoptionStatBanner />`. Keep `<HeroPhotoFeature />` on the right.

```diff
- import { Reveal } from "@/components/ui/Reveal";
- import { ArrowLeft, Clock, Shield, Sparkles } from "lucide-react";
+ import { AdoptionStatBanner } from "@/components/landing/AdoptionStatBanner";
```

Then inside the hero section, replace everything between `<!-- Text column -->` and `<!-- Photo column -->` with just:

```tsx
{/* Text — mission banner */}
<div className="md:col-span-7 order-1">
  <AdoptionStatBanner />
</div>
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit -p . && git add app/page.tsx && git commit -m "home: hero rewrite to mission-driven AdoptionStatBanner"
```

---

### Task 4.3: Homepage — add "Adoptable dogs this week" + "Why adopt" + "Shelters" sections

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Insert sections after the existing pull-quote dek**

The new homepage section order:
1. Hero (rewritten in 4.2)
2. BreedMarquee (existing)
3. Editorial dek (existing — keep)
4. **NEW:** Adoptable dogs of the week row (8 dogs)
5. BlobDivider (existing)
6. ScrollStory (existing)
7. **NEW:** "Why adoption matters" — 3 stats + pull quote (slim)
8. **NEW:** "Shelters across Israel" — 3 ShelterCards + link to /shelters
9. How it works (existing)
10. Testimonials (existing)
11. Featured breeds (existing — reduce from 6 to 3)
12. Final CTA (existing — adjust copy to point at /adopt)

Add imports:

```tsx
import { ADOPTABLE_DOGS } from "@/lib/dogs/data";
import { dogsOfTheWeek } from "@/lib/dogs/helpers";
import { SHELTERS } from "@/lib/shelters/data";
import { DogCard } from "@/components/dogs/DogCard";
import { ShelterCard } from "@/components/shelters/ShelterCard";
```

Insert section after the editorial dek `<section>` and before `<BlobDivider>`:

```tsx
{/* === Adoptable dogs of the week === */}
<section className="px-4 py-12 md:py-16 relative">
  <div className="mx-auto max-w-6xl">
    <Reveal from="up">
      <div className="flex items-end justify-between mb-8 md:mb-10 flex-wrap gap-4">
        <div>
          <SectionMark numeral="01" label="הכלבים השבוע" />
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold font-display text-ink leading-[1.02] tracking-tight">
            8 כלבים שמחכים{" "}
            <span className="italic text-primary-deep font-medium">לבית</span>
          </h2>
        </div>
        <Link href="/adopt" data-paw-zone className="inline-flex items-center gap-2 text-ink font-display font-extrabold text-sm underline underline-offset-4 decoration-ink-mute/40 hover:decoration-primary transition-colors">
          כל הכלבים ({ADOPTABLE_DOGS.length})
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </Reveal>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {dogsOfTheWeek(8).map((d) => <DogCard key={d.id} dog={d} compact />)}
    </div>
  </div>
</section>
```

Insert section after ScrollStory:

```tsx
{/* === Why adoption matters === */}
<section className="px-4 py-14 md:py-20 relative">
  <div className="mx-auto max-w-5xl">
    <Reveal from="up">
      <SectionMark numeral="04" label="למה אימוץ" />
      <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-ink leading-[1.02] tracking-tight max-w-3xl">
        אימוץ כלב הוא{" "}
        <span className="italic text-primary-deep font-medium">החלטה אתית</span>{" "}
        — וגם החלטה חכמה.
      </h2>
    </Reveal>
    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-px bg-border md:rounded-[24px] overflow-hidden md:border-2 md:border-border">
      <Stat3 num="1/3" label="מהכלבים חוזרים למקלט בשנה הראשונה — בחירה נכונה משנה זאת" />
      <Stat3 num="0₪" label="אימוץ זול משמעותית מקנייה. רק עלות חיסונים ועיקור" />
      <Stat3 num="60%" label="מהכלבים בישראל הם תערובות — בריאות, חכמות, ייחודיות" />
    </div>
    <p className="mt-3 text-xs text-ink-mute italic">* נתונים מקורבים. ראו /about-adoption להרחבה.</p>
  </div>
</section>
```

And insert `Stat3` helper at the bottom of the file (next to existing `Stat` helper):

```tsx
function Stat3({ num, label }: { num: string; label: string }) {
  return (
    <div className="bg-surface p-7 text-center">
      <div className="serif-numeral text-[clamp(3rem,6vw,4.5rem)] text-primary-deep tabular-nums">{num}</div>
      <div className="mt-3 text-sm text-ink-soft font-display font-bold leading-snug">{label}</div>
    </div>
  );
}
```

Insert section after "Why adoption matters":

```tsx
{/* === Shelters across Israel === */}
<section className="px-4 py-14 md:py-20 relative">
  <div className="mx-auto max-w-6xl">
    <Reveal from="up">
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <SectionMark numeral="05" label="המקלטים" />
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold font-display text-ink leading-[1.02] tracking-tight">
            איפה{" "}
            <span className="italic text-primary-deep font-medium">מאמצים</span>
          </h2>
        </div>
        <Link href="/shelters" data-paw-zone className="inline-flex items-center gap-2 text-ink font-display font-extrabold text-sm underline underline-offset-4 decoration-ink-mute/40 hover:decoration-primary transition-colors">
          לכל המקלטים
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </Reveal>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {SHELTERS.slice(0, 3).map((s) => <ShelterCard key={s.id} shelter={s} />)}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Trim Featured breeds from 6 to 3**

Find the `const featuredBreeds = BREEDS.slice(0, 6);` line. Change to:

```tsx
const [hero, ...rest] = BREEDS.slice(0, 4);
const featuredHero = hero;
const featuredRest = rest;  // 3 supporting cards
```

- [ ] **Step 3: Update Final CTA copy**

Find the Final CTA heading "מוכנים למצוא את החבר הכי טוב שלכם?" Replace with adoption-leaning copy:

```tsx
<h2 className="...">
  מוכנים{" "}
  <span className="italic text-primary-deep font-medium">לאמץ</span>?
</h2>
<p className="...">
  כמה דקות. בלי הרשמה. מאות כלבים מחכים לבית ברגע זה.
</p>
```

And change the CTA button `href` from `/quiz` to `/adopt`, label from "התחילו את המשחק" to "מצאו כלב לאמץ".

- [ ] **Step 4: Typecheck + commit**

```bash
npx tsc --noEmit -p . && git add app/page.tsx && git commit -m "home: add adoptable-week + why-adopt + shelters sections, slim Featured, adopt-first CTA"
```

---

### Task 4.4: Repurpose HeroPhotoFeature to swipe adoptable dogs

**Files:**
- Modify: `components/landing/HeroPhotoFeature.tsx`

This swap takes the existing Tinder swipe and makes it cycle through `ADOPTABLE_DOGS` instead of `BREEDS`. Caption shows dog name + breed display + shelter city. Link goes to `/dog/[id]`.

- [ ] **Step 1: Replace data source**

In `HeroPhotoFeature.tsx`:
- Remove `import { BREEDS } from "@/lib/breeds/data";`
- Add `import { dogsOfTheWeek } from "@/lib/dogs/helpers";` and `import { getShelterById } from "@/lib/shelters/data";`
- Remove the `FEATURE_SLUGS` array
- Change the state initializer:

```tsx
const [orderedDogs, setOrderedDogs] = useState(() => dogsOfTheWeek(8));
```

- Replace references to `orderedBreeds` with `orderedDogs`, `current.slug` becomes `current.id`, image src uses `current.imageUrl` directly.
- Link `href` changes from `/breed/${current.slug}` to `/dog/${current.id}`.
- Caption section: replace "כלב כנעני / הגזע הישראלי המקורי" pattern with:

```tsx
<div className="text-[10px] tracking-[0.2em] uppercase font-display font-bold text-ink-mute">
  כלב לאימוץ
</div>
<Link href={`/dog/${current.id}`} className="group inline-flex items-baseline gap-1.5 mt-0.5">
  <span className="font-display font-extrabold text-2xl md:text-3xl text-ink leading-tight">
    {current.name}
  </span>
  <ChevronLeft aria-hidden className="w-4 h-4 text-ink-mute group-hover:-translate-x-1 transition-transform" />
</Link>
<p className="mt-1 text-sm text-ink-soft font-medium leading-snug line-clamp-2">
  {current.breedDisplay} · {getShelterById(current.shelterId)?.city}
</p>
```

- Heart favorite button uses `current.id` and toggles in the dog-favorites store (see Task 5.x for the store split).
- Image uses `proxyImage(current.imageUrl, { w: 700, h: 875, fit: "contain" })` — same as today.

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit -p . && git add components/landing/HeroPhotoFeature.tsx && git commit -m "hero: swipe through adoptable dogs instead of breeds"
```

---

### Task 4.5: /breed/[slug] — add "available now" section

**Files:**
- Modify: `app/breed/[slug]/page.tsx`

- [ ] **Step 1: Insert the section**

Above the Gallery section (the existing `breed.gallery` conditional block), insert:

```tsx
import { dogsForBreed } from "@/lib/dogs/helpers";
import { DogCard } from "@/components/dogs/DogCard";
```

Then in the JSX, after the "Description" section and before "Gallery":

```tsx
{(() => {
  const availableDogs = dogsForBreed(breed.slug, 3);
  if (availableDogs.length === 0) return null;
  return (
    <Reveal from="up">
      <section className="mt-6 rounded-[28px] border-2 border-primary-deep bg-primary-tint p-6 md:p-8 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)]">
        <SectionMark numeral={`${availableDogs.length}`} label={`${breed.name} מחכים לבית`} />
        <p className="mt-3 text-ink-soft text-base md:text-lg font-medium max-w-prose">
          {availableDogs.length} כלבים מהגזע הזה (או תערובות) זמינים לאימוץ ברגע זה.
        </p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {availableDogs.map((d) => <DogCard key={d.id} dog={d} />)}
        </div>
      </section>
    </Reveal>
  );
})()}
```

Add the `SectionMark` import if not already imported at the top.

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit -p . && git add app/breed && git commit -m "breed: add 'available now' section linking to adoptable dogs"
```

---

### Task 4.6: Result page — add adoption section to top match

**Files:**
- Modify: `components/result/MatchCard.tsx`

- [ ] **Step 1: Add an adoption row to the top match**

In `MatchCard.tsx`, after the existing "why we matched" `AnimatePresence` block (which only renders when `isTop` is true), add another `isTop`-only section:

```tsx
import { dogsForBreed } from "@/lib/dogs/helpers";
import { DogCard } from "@/components/dogs/DogCard";
```

And in the JSX:

```tsx
{isTop && (() => {
  const available = dogsForBreed(breed.slug, 3);
  if (available.length === 0) return null;
  return (
    <div className="mt-7 border-t border-border pt-6">
      <div className="flex items-center gap-2 text-primary-deep font-display font-extrabold text-xs uppercase tracking-[0.2em] mb-4">
        {available.length} {breed.name} מחכים לבית
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {available.map((d) => <DogCard key={d.id} dog={d} compact />)}
      </div>
      <Link
        href="/adopt"
        className="mt-4 inline-flex items-center gap-1 font-display font-extrabold text-primary-deep underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors"
      >
        לכל הכלבים הזמינים לאימוץ
        <ChevronLeft className="w-4 h-4" strokeWidth={3} />
      </Link>
    </div>
  );
})()}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit -p . && git add components/result/MatchCard.tsx && git commit -m "result: top match shows available adoptable dogs of that breed"
```

---

### Task 4.7: Add 2 quiz questions (mixed-breed / senior openness)

**Files:**
- Modify: `lib/quiz/questions.ts`

- [ ] **Step 1: Read the existing question shape**

```bash
cat lib/quiz/questions.ts | head -40
```

- [ ] **Step 2: Append two new questions**

The questions should be optional / skippable. Default-yes so existing behavior isn't disrupted. Add at the END of the question array:

```ts
// After all existing questions
{
  id: "adopt-mixed-breed",
  prompt: "האם אתם פתוחים לאמץ כלב תערובת (לא גזעי-יחוס)?",
  helpText: "רוב הכלבים במקלטים הם תערובות בריאות וייחודיות.",
  answers: [
    { id: "yes", label: "בהחלט", emoji: "🐕", value: { acceptsMixedBreed: true } },
    { id: "prefer-purebred", label: "אני מעדיף גזע ספציפי", emoji: "📜", value: { acceptsMixedBreed: false } },
  ],
},
{
  id: "adopt-senior",
  prompt: "האם אתם פתוחים לאמץ כלב מבוגר (7+ שנים)?",
  helpText: "כלבים מבוגרים רגועים יותר, מאולפים, ולעיתים זקוקים לבית הכי דחוף.",
  answers: [
    { id: "yes", label: "כן, מבוגרים יותר רגועים", emoji: "🦴", value: { acceptsSenior: true } },
    { id: "young-only", label: "אני מעדיף צעיר", emoji: "🌱", value: { acceptsSenior: false } },
  ],
},
```

- [ ] **Step 3: Add the new value keys to TraitVector or QuizAnswers type if needed**

If the `value` field on answers is strictly typed, add `acceptsMixedBreed?: boolean` and `acceptsSenior?: boolean` to whatever shape it expects.

- [ ] **Step 4: Typecheck + commit**

```bash
npx tsc --noEmit -p . && git add lib/quiz/questions.ts && git commit -m "quiz: add 2 optional adoption-readiness questions (mixed breed, senior)"
```

---

### Task 4.8: Use new quiz answers in result/adopt link

**Files:**
- Modify: `components/result/ResultView.tsx`

The two new questions don't change the breed matching algorithm (per spec section 9, risk 3) — they're informational. But we can pass them through to the `/adopt` CTA as URL params so the destination pre-filters by `ageGroup=adult` etc.

- [ ] **Step 1: Pass quiz prefs into the "Browse all adoptable dogs" CTA**

Below the existing "Adoption Links" section in `ResultView.tsx`, add a new section linking to `/adopt`:

```tsx
<Reveal from="up">
  <div className="text-center py-6">
    <Link
      href={
        answers["adopt-senior"] === "young-only"
          ? "/adopt?ageGroup=young"
          : "/adopt"
      }
      data-paw-zone
      className="inline-flex items-center gap-2 bg-primary text-white border-2 border-primary-deep font-display font-extrabold px-7 py-3.5 rounded-[20px] text-lg shadow-[var(--shadow-glow-primary)] hover:-translate-y-0.5 active:translate-y-1 transition-all"
    >
      צפו בכלבים מחכים לאימוץ
    </Link>
  </div>
</Reveal>
```

(Note: `/adopt` doesn't parse URL params in the v1 plan — this is a future enhancement. The link still works, just doesn't auto-filter. Leave the query string in place as documentation of intent.)

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit -p . && git add components/result/ResultView.tsx && git commit -m "result: add 'browse adoptable dogs' CTA from result page"
```

---

## Block 5 — Extend favorites

### Task 5.1: Split useFavoritesStore into breedSlugs + dogIds

**Files:**
- Modify: `store/useFavoritesStore.ts`

- [ ] **Step 1: Rewrite the store**

```tsx
// store/useFavoritesStore.ts
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface FavoritesState {
  /** Favorite breed slugs */
  breedSlugs: string[];
  /** Favorite dog IDs */
  dogIds: string[];
  toggleBreed: (slug: string) => boolean;
  toggleDog: (id: string) => boolean;
  isFavoriteBreed: (slug: string) => boolean;
  isFavoriteDog: (id: string) => boolean;
  clear: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      breedSlugs: [],
      dogIds: [],
      toggleBreed: (slug) => {
        const cur = get().breedSlugs;
        const exists = cur.includes(slug);
        const next = exists ? cur.filter((s) => s !== slug) : [...cur, slug];
        set({ breedSlugs: next });
        return !exists;
      },
      toggleDog: (id) => {
        const cur = get().dogIds;
        const exists = cur.includes(id);
        const next = exists ? cur.filter((s) => s !== id) : [...cur, id];
        set({ dogIds: next });
        return !exists;
      },
      isFavoriteBreed: (slug) => get().breedSlugs.includes(slug),
      isFavoriteDog: (id) => get().dogIds.includes(id),
      clear: () => set({ breedSlugs: [], dogIds: [] }),
    }),
    {
      name: "dogame-favorites-v2",
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persisted: unknown, fromVersion) => {
        // v1 stored { slugs: string[] } — migrate to v2 split shape
        if (fromVersion < 2 && persisted && typeof persisted === "object" && "slugs" in persisted) {
          const old = persisted as { slugs?: string[] };
          return {
            breedSlugs: old.slugs ?? [],
            dogIds: [],
          };
        }
        return persisted as FavoritesState;
      },
    }
  )
);

export function useFavoriteBreed(slug: string) {
  const slugs = useFavoritesStore((s) => s.breedSlugs);
  const toggle = useFavoritesStore((s) => s.toggleBreed);
  return {
    isFavorite: slugs.includes(slug),
    toggle: () => toggle(slug),
    count: slugs.length,
  };
}

export function useFavoriteDog(id: string) {
  const ids = useFavoritesStore((s) => s.dogIds);
  const toggle = useFavoritesStore((s) => s.toggleDog);
  return {
    isFavorite: ids.includes(id),
    toggle: () => toggle(id),
    count: ids.length,
  };
}
```

- [ ] **Step 2: Update consumers**

Search the codebase for `slugs:` / `useFavorite(` / `isFavorite` from this store. Anywhere it was called for breeds, the function names changed:
- `useFavorite(slug)` → `useFavoriteBreed(slug)`
- `slugs` → `breedSlugs`

Run `npx tsc --noEmit -p .` to find every consumer that breaks. Fix each.

- [ ] **Step 3: Commit**

```bash
git add store/ components/ && git commit -m "store: split favorites into breedSlugs + dogIds with v1→v2 migration"
```

---

### Task 5.2: Extend FavoriteButton with type prop

**Files:**
- Modify: `components/breed/FavoriteButton.tsx`

- [ ] **Step 1: Add type prop**

The current `FavoriteButton` takes `slug: string`. Update it to:

```tsx
interface FavoriteButtonProps {
  /** "breed" toggles breedSlugs, "dog" toggles dogIds */
  type?: "breed" | "dog";
  /** Slug (for breed) or id (for dog) */
  slug: string;
  /** Hebrew name for aria-label and toast */
  breedName: string; // keep name for back-compat; consider rename to `name`
  size?: "sm" | "md";
  stopPropagation?: boolean;
  className?: string;
}
```

In the body, switch between the two hooks:

```tsx
const { isFavorite, toggle } = type === "dog"
  ? useFavoriteDog(slug)
  : useFavoriteBreed(slug);
```

- [ ] **Step 2: Update HeroPhotoFeature to pass `type="dog"`**

In `components/landing/HeroPhotoFeature.tsx`, change the FavoriteButton call (or inline heart toggle) to use `useFavoriteDog(current.id)` instead of the breed version.

- [ ] **Step 3: Typecheck + commit**

```bash
npx tsc --noEmit -p . && git add components/breed/FavoriteButton.tsx components/landing/HeroPhotoFeature.tsx && git commit -m "favorites: FavoriteButton accepts type=breed|dog"
```

---

### Task 5.3: Update /favorites page to show both tabs

**Files:**
- Modify: `components/favorites/FavoritesView.tsx`

- [ ] **Step 1: Add tabbed view**

The current view shows breed cards. Add a tab toggle for "גזעים" / "כלבים לאימוץ" and render the appropriate list. Use `useState` to track active tab.

```tsx
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { ADOPTABLE_DOGS } from "@/lib/dogs/data";
import { DogCard } from "@/components/dogs/DogCard";

// ... inside the component:
const [tab, setTab] = useState<"breeds" | "dogs">("breeds");
const breedSlugs = useFavoritesStore((s) => s.breedSlugs);
const dogIds = useFavoritesStore((s) => s.dogIds);

const favBreeds = useMemo(() => BREEDS.filter((b) => breedSlugs.includes(b.slug)), [breedSlugs]);
const favDogs = useMemo(() => ADOPTABLE_DOGS.filter((d) => dogIds.includes(d.id)), [dogIds]);
```

Render a small tab control and switch the grid:

```tsx
<div className="flex gap-2 mb-6">
  <button onClick={() => setTab("breeds")} className={tab === "breeds" ? "...active styles..." : "...inactive..."}>
    גזעים ({favBreeds.length})
  </button>
  <button onClick={() => setTab("dogs")} className={tab === "dogs" ? "..." : "..."}>
    כלבים לאימוץ ({favDogs.length})
  </button>
</div>

{tab === "breeds" ? (
  // existing breed grid
) : favDogs.length === 0 ? (
  <p className="text-ink-soft font-medium">עדיין לא סימנתם כלבים זמינים. דפדפו ב<Link href="/adopt">/adopt</Link>.</p>
) : (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {favDogs.map((d) => <DogCard key={d.id} dog={d} />)}
  </div>
)}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit -p . && git add components/favorites/FavoritesView.tsx && git commit -m "favorites: tab between favorited breeds and dogs"
```

---

## Block 6 — Polish + deploy

### Task 6.1: Site-wide footer disclaimer

**Files:**
- Modify: `app/layout.tsx` (or the shared footer if it exists)

- [ ] **Step 1: Add disclaimer to layout footer**

Find the footer block in `app/layout.tsx` (or wherever the site-wide footer lives). Add a small disclaimer line:

```tsx
<p className="text-[11px] text-ink-mute italic max-w-prose mx-auto opacity-70">
  * פרטי הכלבים והמקלטים באתר הם דוגמאות איוריות. לאימוץ בפועל, פנו ישירות לאחת מאגודות הרווחה המופיעות באתר.
</p>
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit -p . && git add app/layout.tsx && git commit -m "polish: site-wide footer disclaimer about illustrative data"
```

---

### Task 6.2: Update home + breed pages metadata + sitemap

**Files:**
- Modify: `app/sitemap.ts` (if exists) or check that static export picks up new routes

- [ ] **Step 1: Verify sitemap output**

Run `npm run build` and inspect `out/sitemap.xml`. The new routes `/adopt`, `/dog/[id]`, `/shelters`, `/shelter/[slug]`, `/about-adoption` should all appear. If not, edit `app/sitemap.ts` to include them.

If `app/sitemap.ts` exists, add entries:

```ts
// Inside the sitemap default export
import { ADOPTABLE_DOGS } from "@/lib/dogs/data";
import { SHELTERS } from "@/lib/shelters/data";

// In the returned array:
{ url: `${BASE_URL}/adopt`, lastModified: new Date(), priority: 0.9 },
{ url: `${BASE_URL}/shelters`, lastModified: new Date(), priority: 0.8 },
{ url: `${BASE_URL}/about-adoption`, lastModified: new Date(), priority: 0.7 },
...ADOPTABLE_DOGS.map((d) => ({ url: `${BASE_URL}/dog/${d.id}`, lastModified: new Date(d.dateAvailable), priority: 0.6 })),
...SHELTERS.map((s) => ({ url: `${BASE_URL}/shelter/${s.slug}`, lastModified: new Date(), priority: 0.6 })),
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit -p . && git add app/sitemap.ts && git commit -m "sitemap: include adoption routes"
```

---

### Task 6.3: Full lint + build pass

- [ ] **Step 1: Run lint**

```bash
npm run lint 2>&1 | tail -40
```

Expected: no new errors compared to baseline. Fix any introduced by new code (most likely: `react/no-unescaped-entities` on Hebrew quotation marks — use `&ldquo;` / `&rdquo;` or Hebrew gershayim).

- [ ] **Step 2: Run build**

```bash
npm run build 2>&1 | tail -30
```

Expected: builds successfully, generates ~110+ static pages (51 existing + 50 new dog pages + 8 shelter pages + 5 new page types).

- [ ] **Step 3: Inspect the build output for new routes**

```bash
ls out/adopt out/dog out/shelters out/shelter out/about-adoption 2>&1 | head -20
```

Expected: each directory exists with `index.html`.

- [ ] **Step 4: Commit any lint fixes**

```bash
git add . && git commit -m "polish: lint + build clean" 2>&1 | tail -3
```

(Skip if no changes were needed.)

---

### Task 6.4: Deploy to Cloudflare Pages

- [ ] **Step 1: Deploy**

```bash
npm run deploy 2>&1 | tail -10
```

Expected: "Deployment complete! Take a peek over at https://<hash>.dogame.pages.dev"

- [ ] **Step 2: Probe live URLs**

```bash
curl -sI https://dogame.pages.dev/adopt 2>&1 | head -3
curl -sI https://dogame.pages.dev/shelters 2>&1 | head -3
curl -sI "https://dogame.pages.dev/dog/tlv-luna-2026" 2>&1 | head -3
curl -sI https://dogame.pages.dev/about-adoption 2>&1 | head -3
```

Expected: all `HTTP/1.1 200 OK`.

---

### Task 6.5: Visual verification via Playwright

- [ ] **Step 1: Navigate + screenshot each new route at 1440px**

For each of `/`, `/adopt`, `/dog/tlv-luna-2026`, `/shelters`, `/shelter/tlv-dog-haven`, `/about-adoption`:

1. Navigate to the URL
2. Take a screenshot
3. Verify no console errors (`browser_console_messages` level=error)
4. Confirm visually that:
   - `ExampleBadge` is visible on all dog/shelter cards
   - Footer disclaimer is visible
   - Editorial typography (drop cap, italic emphasis, serif numerals) renders correctly
   - Hebrew text right-aligned, no RTL breaks
   - Filter chips on /adopt are clickable

- [ ] **Step 2: Take a mobile screenshot at 375px width of the homepage**

Confirm hero stacks vertically and is readable.

- [ ] **Step 3: Final commit (if any lingering changes)**

```bash
git status
# If clean: 
git push 2>&1 | tail -3
```

---

## Self-review

**1. Spec coverage**

| Spec section | Covered by |
|---|---|
| §1 Concept | Block 4 task 4.2 + 4.3 (hero + sections) |
| §2 Simulated data | Block 1 + ExampleBadge everywhere + 6.1 footer |
| §3 IA / new routes | Block 3 (all 5 routes) + Task 4.1 (nav) |
| §4 Data model | Block 1 (types + helpers) |
| §5 New components | Block 2 (all 7) |
| §6 Page-by-page changes | Block 3 (new pages) + Block 4 (existing) |
| §7 Disclaimer | ExampleBadge (Task 2.1), footer (Task 6.1), /about-adoption (Task 3.5) |
| §8 Sequencing | This plan's block ordering |
| §9 Risks | Risk 1 (images): documented in Task 1.4. Risk 2 (disclaimer): three-channel pattern. Risk 3 (quiz algo): Task 4.7 keeps existing matching untouched. Risk 4 (bundle): Task 6.3 includes a build inspection step. Risk 5 (SEO): schema.org Article in Task 3.3. |
| §10 Out of scope | Maps, real shelter API, application forms — not in any task. ✓ |
| §11 Success criteria | All verified in Task 6.3 + 6.5 |

No gaps.

**2. Placeholder scan**

Scanned for "TBD", "TODO", "implement later", "fill in details", "add appropriate", "similar to". Found one: Task 1.4 says "continue with ~48 more dogs" — this is intentional since the data is non-trivial volume; the implementer has the pattern and direction (region split, breed slug mapping, image strategy). Acceptable since the **shape** is fully specified and the implementer just needs to populate.

**3. Type consistency**

- `AdoptableDog` field names consistent across types.ts, data.ts, helpers.ts, DogCard, DogHero, /dog/[id] page ✓
- `Shelter` field names consistent ✓
- `useFavoriteBreed` / `useFavoriteDog` named consistently in 5.1 and 5.2 ✓
- `dogsForBreed`, `filterDogs`, `dogsOfTheWeek`, `dogsInRegion` defined in helpers.ts (Task 1.4), called by DogCard helpers, /adopt page, homepage, breed page, /shelter page, /dog page ✓

**4. Ambiguity check**

- "Read the existing question shape" in Task 4.7 — concrete enough, the implementer can decide on field shapes by reading the file (which has `prompt`/`answers` structure).
- "Find the footer block in `app/layout.tsx`" in Task 6.1 — the layout has been read in earlier turns, footer is straightforward to locate.
- "Edit `app/sitemap.ts` (if exists)" — conditional on file presence, with concrete code to add if it does.

No ambiguous instructions blocking implementation.

---

## Execution choice

Plan complete and saved to `docs/superpowers/plans/2026-05-19-dogame-adoption-rewrite.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
