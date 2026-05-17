"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface FavoritesState {
  slugs: string[];
  toggle: (slug: string) => boolean; // returns new "isFavorite" state
  isFavorite: (slug: string) => boolean;
  clear: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      slugs: [],
      toggle: (slug) => {
        const cur = get().slugs;
        const exists = cur.includes(slug);
        const next = exists ? cur.filter((s) => s !== slug) : [...cur, slug];
        set({ slugs: next });
        return !exists;
      },
      isFavorite: (slug) => get().slugs.includes(slug),
      clear: () => set({ slugs: [] }),
    }),
    {
      name: "dogame-favorites-v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);

/** Hook returning isFavorite + a stable toggle handler bound to a slug. */
export function useFavorite(slug: string) {
  const slugs = useFavoritesStore((s) => s.slugs);
  const toggle = useFavoritesStore((s) => s.toggle);
  return {
    isFavorite: slugs.includes(slug),
    toggle: () => toggle(slug),
    count: slugs.length,
  };
}
