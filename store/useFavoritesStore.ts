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
        if (fromVersion < 2 && persisted && typeof persisted === "object" && "slugs" in persisted) {
          const old = persisted as { slugs?: string[] };
          return {
            breedSlugs: old.slugs ?? [],
            dogIds: [],
          } as Partial<FavoritesState>;
        }
        return persisted as FavoritesState;
      },
    }
  )
);

/** Hook for breed favorite — returns isFavorite + toggle + count. */
export function useFavoriteBreed(slug: string) {
  const slugs = useFavoritesStore((s) => s.breedSlugs);
  const toggle = useFavoritesStore((s) => s.toggleBreed);
  return {
    isFavorite: slugs.includes(slug),
    toggle: () => toggle(slug),
    count: slugs.length,
  };
}

/** Hook for dog favorite. */
export function useFavoriteDog(id: string) {
  const ids = useFavoritesStore((s) => s.dogIds);
  const toggle = useFavoritesStore((s) => s.toggleDog);
  return {
    isFavorite: ids.includes(id),
    toggle: () => toggle(id),
    count: ids.length,
  };
}

/** Back-compat alias. Existing code that calls useFavorite(slug) still works for breeds. */
export const useFavorite = useFavoriteBreed;
