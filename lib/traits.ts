/**
 * 10 trait axes used to score breed compatibility.
 * Each axis is scored 0-10 on both the user-preference vector and the breed vector.
 * Distance is computed per-axis, weighted, and aggregated.
 */

export type TraitKey =
  | "size"
  | "energy"
  | "trainability"
  | "grooming"
  | "shedding"
  | "kidFriendly"
  | "petFriendly"
  | "apartmentOk"
  | "heatTolerance"
  | "barkLevel";

export interface TraitDef {
  key: TraitKey;
  label: string;
  lowLabel: string;
  highLabel: string;
  /** Default weight used by the matcher. Some answers can override per-axis weight. */
  weight: number;
  /** Plain-language explanation shown in tooltips */
  description: string;
}

export const TRAITS: Record<TraitKey, TraitDef> = {
  size: {
    key: "size",
    label: "גודל",
    lowLabel: "קטן",
    highLabel: "ענק",
    weight: 1.2,
    description: "הגודל הפיזי הבוגר של הכלב, מ-toy (פחות מ-5 ק\"ג) עד giant (40+ ק\"ג).",
  },
  energy: {
    key: "energy",
    label: "רמת אנרגיה",
    lowLabel: "רגוע",
    highLabel: "פעיל מאוד",
    weight: 1.4,
    description: "כמה פעילות יומית הגזע צורך — מ-30 דק' הליכה ועד שעות של ריצה ומשחק.",
  },
  trainability: {
    key: "trainability",
    label: "קלות אילוף",
    lowLabel: "אתגרי",
    highLabel: "קל מאוד",
    weight: 1.3,
    description: "כמה הגזע אינטליגנטי ונכון לשמוע פקודות. גבוה = מהיר ללמוד.",
  },
  grooming: {
    key: "grooming",
    label: "דרישות תחזוקה",
    lowLabel: "מינימלית",
    highLabel: "גבוהה",
    weight: 1.0,
    description: "כמה סירוק, רחיצה ותספורת מקצועית הגזע צריך. גבוה = יקר ועתיר זמן.",
  },
  shedding: {
    key: "shedding",
    label: "השלת פרווה",
    lowLabel: "אין/מועטה",
    highLabel: "רבה",
    weight: 1.0,
    description: "כמה פרווה הגזע משיר. גבוה = פרווה בכל הבית, השפעה על אלרגיות.",
  },
  kidFriendly: {
    key: "kidFriendly",
    label: "התאמה לילדים",
    lowLabel: "פחות",
    highLabel: "מצוין",
    weight: 1.1,
    description: "כמה הגזע סבלני, עדין ובטוח לסביבת ילדים — במיוחד הקטנים.",
  },
  petFriendly: {
    key: "petFriendly",
    label: "התאמה לחיות אחרות",
    lowLabel: "פחות",
    highLabel: "מצוין",
    weight: 0.9,
    description: "כמה קל לגזע לחיות לצד חתולים, כלבים אחרים או חיות קטנות.",
  },
  apartmentOk: {
    key: "apartmentOk",
    label: "התאמה לדירה",
    lowLabel: "פחות",
    highLabel: "מצוין",
    weight: 1.0,
    description: "כמה הגזע מסתדר בלי גינה — אם הוא רגוע מספיק ולא צריך הרבה מקום.",
  },
  heatTolerance: {
    key: "heatTolerance",
    label: "עמידות בחום",
    lowLabel: "רגיש",
    highLabel: "עמיד",
    weight: 1.3,
    description: "כמה הגזע מסתדר בחום הישראלי. נמוך = מסוכן בלי מיזוג בקיץ.",
  },
  barkLevel: {
    key: "barkLevel",
    label: "רמת נביחה",
    lowLabel: "שקט",
    highLabel: "ווקאלי",
    weight: 0.8,
    description: "כמה הגזע נובח. גבוה = יכול להיות בעיה עם שכנים רגישים.",
  },
};

export const TRAIT_KEYS = Object.keys(TRAITS) as TraitKey[];

export type TraitVector = Record<TraitKey, number>;

export const ZERO_VECTOR: TraitVector = TRAIT_KEYS.reduce((acc, k) => {
  acc[k] = 5;
  return acc;
}, {} as TraitVector);
