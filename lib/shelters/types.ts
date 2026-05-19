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
