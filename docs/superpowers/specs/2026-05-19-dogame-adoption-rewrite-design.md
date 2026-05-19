# DoGame v2 — Adoption Advocate Rewrite

**Status**: Approved, ready for implementation plan
**Date**: 2026-05-19
**Stack**: Next.js 16 (App Router, static export), Tailwind v4, motion/react, RTL Hebrew
**Hosting**: Cloudflare Pages (dogame.pages.dev)

---

## 1. Concept

DoGame becomes **"the illustrated guide to choosing a dog — responsibly."**

A mission-driven framing — "1 in 3 dogs returns to a shelter in their first year, let's change that" — sits above the existing breeds-first information architecture. The site retains its quiz, breed catalog, and editorial design, but every CTA now funnels toward adoption at real Israeli shelters rather than generic "find your dog" outcomes.

**Tone**: serious-but-warm editorial, like a non-profit campaign written by a magazine. Statistics with sources. Real shelter names. "Adopt don't shop" implied through CTAs, never preached.

**Three discovery paths**, all funneling toward `/dog/[id]`:
1. **Adopt now** — homepage hero → `/adopt` → filter → dog page
2. **Quiz first** — homepage → `/quiz` → `/result` (with "adoptable now" cards) → dog page
3. **Browse breeds** — `/breeds` → `/breed/[slug]` ("available now" section) → dog page

---

## 2. Data is illustrative in v1

All adoptable dogs and shelters are **handcrafted simulated data**, clearly labeled "דוגמה איורית" on every card and in a persistent site-wide footer disclaimer.

This is a deliberate, ethical choice for v1: it lets us ship the full product experience in days rather than months of partnership-building, while being transparent that the data is not yet real. Phase 2 swaps in real shelter integrations without redesign.

---

## 3. Information architecture

**Top navigation** (RTL, 5 items):

```
אימוץ        גזעים        שאלון        מקלטים        על הפרויקט
(Adopt) NEW  (Breeds)     (Quiz)       (Shelters) NEW (About)
```

**Routes**:

| Route | Status | Purpose |
|---|---|---|
| `/` | rewritten | Mission hero + adoptable-dogs preview + condensed sections |
| `/adopt` | **NEW** | All adoptable dogs grid, filterable (region, size, age, breed) |
| `/dog/[id]` | **NEW** | Individual adoptable dog — story, shelter, express interest |
| `/shelters` | **NEW** | All shelters with available-dog counts |
| `/shelter/[slug]` | **NEW** | Individual shelter — about + their available dogs |
| `/about-adoption` | **NEW** | Editorial article on adopting in Israel |
| `/breeds` | unchanged | Existing breed catalog |
| `/breed/[slug]` | adds section | Adds "כלבים מהגזע הזה מחכים לבית" with 2-3 dog cards |
| `/quiz` | minor | Adds 2 optional questions (mixed breed?, senior?) |
| `/result` | adds section | Each match shows "X adoptable dogs of this breed" |
| `/favorites` | extended | Tracks both breeds and dogs |
| `/compare` | unchanged | |
| `/about` | unchanged | |

5 new pages. Generated statically via `generateStaticParams`. Adds ~58-65 pages to the static export (50 dogs + 8 shelters + 5 NEW page types).

---

## 4. Data model

### `AdoptableDog` (`lib/dogs/types.ts`)

```ts
interface AdoptableDog {
  id: string;                              // "tlv-spca-luna-2026"
  name: string;                            // "לונה"
  age: number;                             // years
  ageGroup: "puppy" | "young" | "adult" | "senior";
  sex: "male" | "female";
  neutered: boolean;
  size: BreedSize;                         // reuses existing type
  breedSlug?: string;                      // refs existing breed catalog (if known)
  breedDisplay: string;                    // "לברדור מעורב" / "תערובת"
  weightKg?: number;
  imageUrl: string;
  shelterId: string;
  region: "north" | "center" | "south" | "jerusalem";
  description: string;                     // 2-3 sentence Hebrew story
  goodWith: ("kids" | "cats" | "dogs" | "small-pets")[];
  tags: string[];                          // optional descriptors
  dateAvailable: string;                   // ISO
  contactUrl: string;                      // shelter's contact channel
  isExample: true;                         // always true in v1
}
```

### `Shelter` (`lib/shelters/types.ts`)

```ts
interface Shelter {
  id: string;
  slug: string;
  name: string;
  city: string;
  region: "north" | "center" | "south" | "jerusalem";
  description: string;
  phone?: string;
  email?: string;
  website?: string;
  imageUrl?: string;
  isExample: true;
}
```

### Data files

- `lib/dogs/data.ts` — ~50 dogs distributed across shelters, ages (10-15% puppy, 30% young, 40% adult, 15% senior), sizes, breeds (mix of breed-tagged and "תערובת"). Region split: 40% center, 25% north, 20% south, 15% jerusalem.
- `lib/shelters/data.ts` — 8 shelters. To avoid trademark or reputation issues with real organizations, **all shelter names in v1 are clearly fictional** (e.g., "מקלט נוף הגליל", "אגודה לחיות שדה" — names that read plausibly Israeli but don't match any real organization). The disclaimer + `ExampleBadge` reinforces this. `contactUrl` points to real Israeli adoption umbrella resources (e.g., adopt.org.il, gov.il pet adoption pages) so the "Express interest" CTA still leads to a useful destination.
- All shelters and dogs flagged `isExample: true`.

---

## 5. New components

| Component | Purpose | Used on |
|---|---|---|
| `DogCard` | Compact: photo, name, age, breedDisplay, shelter | /adopt, /breed/[slug], /shelter/[slug], homepage |
| `DogHero` | Big editorial hero for /dog/[id] | /dog/[id] |
| `DogTraitChips` | "Good with kids ✓ / cats ? / dogs ✓" | /dog/[id], DogCard hover |
| `ShelterCard` | Shelter preview with location + dog count | /shelters, homepage |
| `AdoptionStatBanner` | Hero mission stat + dek | / hero |
| `LocationFilter` | Region chips (Center/North/South/Jerusalem) | /adopt, /shelters |
| `ExampleBadge` | Tiny "דוגמה איורית" tag | every dog & shelter card |

### Components extended (not rewritten)

- `FavoriteButton` — gains a `type` prop (`"breed" \| "dog"`)
- `useFavoritesStore` — splits state into `breedSlugs: string[]` + `dogIds: string[]`, preserving existing keys with `JSON.parse` migration on first load
- `SiteNav` — adds Adopt + Shelters tabs

### Components reused as-is

IssueMark, SectionMark, BlobDivider, PawCursor, BreedPhoto, MagneticButton, Reveal/Stagger, Card, Pill, Toast, Confetti, CountUp, AnimatedHeadline, all quiz components, ScrollStory, BreedMarquee, Testimonials.

---

## 6. Page-by-page changes

### Homepage (`/`)
1. Editorial masthead (kept — `IssueMark` "N°042")
2. **Hero rewrite** — replaces the current text+Tinder-swipe split. New layout:
   - **Left column**: `AdoptionStatBanner` with mission stat ("1 מתוך 3 כלבים חוזרים למחסה...") + serif headline + dek + twin CTAs (`מצאו כלב לאמץ` primary / `התחילו שאלון` secondary). Drop cap preserved.
   - **Right column**: `HeroPhotoFeature` repurposed to swipe through **adoptable dogs** (not just breeds) — each card shows dog name + age + shelter, links to `/dog/[id]` instead of `/breed/[slug]`.
3. BlobDivider
4. **"Adoptable dogs this week"** — `DogCard` row of 8 dogs (different from hero swipe; links to /adopt and /dog/[id])
5. BlobDivider
6. ScrollStory (kept)
7. **"Why adoption matters"** — editorial spread with 3 stats + a pull quote
8. **"Shelters across Israel"** — 3-4 `ShelterCard`s with region indicators
9. How it works (kept, copy adjusted)
10. Testimonials (kept)
11. Featured breeds (kept but reduced from 6 to 3, copy says "explore breeds before adopting")
12. Final CTA — adoption-focused

### Quiz (`/quiz`)
- Adds 2 optional questions:
  - "האם אתם פתוחים לאמץ כלב תערובת?" (default: yes)
  - "האם אתם פתוחים לאמץ כלב מבוגר?" (default: yes)
- Matching algorithm respects these preferences (filters out senior/mixed if user says no)

### Result (`/result`)
- Top match card adds new section "X כלבים מהגזע הזה מחכים לבית" with `DogCard` mini cards
- New CTA: "Browse all adoptable dogs" → /adopt
- Existing share/save unchanged

### Breed detail (`/breed/[slug]`)
- New section after the photo hero: "כלבים מהגזע הזה מחכים לבית" — 2-3 `DogCard`s
- Falls back gracefully if no dogs of this breed are in the data
- Otherwise unchanged

### `/adopt` (NEW)
- Editorial header (SectionMark style)
- Filters: `LocationFilter` (region chips), size chips, age chips, breed search
- Grid of `DogCard`s, AnimatePresence with popLayout for filter transitions
- Empty state for "no matches"
- ~50 dogs total, no pagination needed in v1

### `/dog/[id]` (NEW)
- `DogHero`: big photo + name + breedDisplay + age + size
- "הסיפור של [name]" — description paragraph
- `DogTraitChips` row
- `ShelterCard` with location + contact
- "Express interest" CTA (links to shelter's `contactUrl`)
- "Similar dogs available" row (same region, similar size)
- Link to /breed/[slug] for breed context
- `Article` schema.org markup
- `ExampleBadge` prominently visible

### `/shelters` (NEW)
- Editorial list of all 8 shelters
- Each: name, city, region, description, count of available dogs, link

### `/shelter/[slug]` (NEW)
- Shelter info hero
- All available dogs at this shelter as `DogCard` grid
- Contact details

### `/about-adoption` (NEW)
- Editorial article: "אימוץ מול קנייה — מה כדאי לדעת"
- 3-4 statistics with sources
- Common misconceptions section
- "How adoption works in Israel" walkthrough
- CTAs back to /adopt and /shelters

---

## 7. Disclaimer + ethics

The simulated-data nature of v1 is disclosed through **three reinforcing channels**:

1. **`ExampleBadge`** in the top-right corner of every `DogCard` and `ShelterCard` — small but always visible.
2. **Persistent site-wide footer** disclaimer: "* פרטי הכלבים והמקלטים באתר הם דוגמאות איוריות. לאימוץ בפועל, פנו ישירות לאחת מאגודות הרווחה המופיעות באתר."
3. **`/about-adoption` page** has a dedicated section explaining DoGame's current data approach and pointing to real adoption channels.

The "Express interest" CTA on /dog/[id] links to the shelter's `contactUrl` (a real adoption-related URL where possible — e.g., the real SPCA Israel contact page — even though the specific dog is fictional).

---

## 8. Sequencing (6 work blocks)

| Block | Work | Est |
|---|---|---|
| 1. Data foundation | `AdoptableDog` + `Shelter` types, ~50 dogs, 8 shelters, image sourcing | 1 day |
| 2. New components | 7 new components (DogCard, DogHero, ShelterCard, etc.) | 1 day |
| 3. New routes | /adopt, /dog/[id], /shelters, /shelter/[slug], /about-adoption | 1.5 days |
| 4. Modify existing | Hero rewrite + breed page section + result page + quiz +2 Qs + nav | 1.5 days |
| 5. Extend favorites | FavoriteButton + store + /favorites updates | 0.5 day |
| 6. Polish + deploy | Disclaimer + schema markup + typecheck/lint + deploy + verify | 0.5 day |
| **Total** | | **~5-6 days** |

---

## 9. Risks + mitigations

1. **Image sourcing** — achieving 50 visually distinct, ethical-source dog photos is real work. *Mitigation*: fall back on existing 37 breed photos + variations, tag those dogs as "תערובת לברדור" etc. Less ideal but ships.

2. **Disclaimer credibility** — if labeling isn't prominent enough, the site could be perceived as misleading. *Mitigation*: three-channel disclosure (badge + footer + dedicated page).

3. **Quiz algorithm impact** — adding 2 questions adjusts `lib/breeds/matcher.ts`. *Mitigation*: new questions default to "open to all," so existing matches don't shift unless the user opts in.

4. **Bundle size** — 5 new routes + ~50 dog images add weight. Probably +30-50KB JS, images already lazy. *Mitigation*: measure with `next build`, lazy-load below-fold dog cards.

5. **`/dog/[id]` SEO** — 50 new pages with thin content. *Mitigation*: schema.org `Article` markup, real descriptive Hebrew text per dog (not boilerplate), `noindex` if the page proves too thin in audit.

---

## 10. Out of scope (phase 2 candidates)

- Real maps view on /shelters
- Actual scraping or API integration with real shelters
- Adoption application form inside DoGame
- Email signups for "new dogs at your shelter"
- Dedicated a11y audit pass on new pages (will follow existing patterns but no dedicated pass)

---

## 11. Success criteria

- All 5 new routes render statically and pass typecheck + lint
- Every dog/shelter card displays the `ExampleBadge`
- Site-wide footer disclaimer is present on every page
- Quiz still works for existing flows (the 2 new questions are optional)
- Mobile + desktop visual consistency at 375px and 1440px
- Zero new console errors on the live site after deploy
- Lighthouse scores don't regress more than 5 points on Performance, Accessibility, Best Practices, SEO
