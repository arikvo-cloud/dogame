import type { AnswerMap } from "./types";

/**
 * Pre-filled quiz answers for common Israeli lifestyles.
 * Skip the long quiz by picking a persona that fits — users can still tweak
 * follow-up questions or restart anytime.
 */
export interface Persona {
  id: string;
  emoji: string;
  title: string;
  description: string;
  /** Answers filled in for this persona — quiz engine will continue from here */
  answers: AnswerMap;
}

export const PERSONAS: Persona[] = [
  {
    id: "young-family",
    emoji: "👨‍👩‍👧",
    title: "משפחה צעירה עם ילדים",
    description: "דירה / בית עם גינה קטנה, ילדים בגיל הרך, ניסיון מועט",
    answers: {
      housing: "apartment-large",
      "alone-hours": "few",
      household: "kids-young",
      experience: "some",
      "activity-level": "moderate",
      "exercise-commitment": "moderate",
      "shedding-tolerance": "low",
      "kids-age-detail": "preschool",
      "bark-tolerance": "moderate",
      "size-preference": "medium",
      "training-investment": "basic",
    },
  },
  {
    id: "active-single",
    emoji: "🏃",
    title: "אקטיבי שגר לבד",
    description: "אוהב טיולים וריצה, מחפש שותף לפעילות, פעיל כל יום",
    answers: {
      housing: "apartment-large",
      "alone-hours": "workday",
      household: "alone",
      experience: "some",
      "activity-level": "active",
      "exercise-commitment": "good",
      "shedding-tolerance": "ok",
      "size-preference": "medium",
      "training-investment": "basic",
      "noise-environment": "nature",
    },
  },
  {
    id: "apartment-couple",
    emoji: "💕",
    title: "זוג בדירה",
    description: "דירה קטנה במרכז, שעות עבודה רגילות, רוצים כלב נוח",
    answers: {
      housing: "apartment-small",
      "alone-hours": "workday",
      household: "couple",
      experience: "none",
      "activity-level": "moderate",
      "exercise-commitment": "moderate",
      "shedding-tolerance": "low",
      "size-preference": "small",
      "training-investment": "basic",
      "bark-tolerance": "silent",
      climate: "warm",
    },
  },
  {
    id: "senior-companion",
    emoji: "🧓",
    title: "כלב חברה למבוגר",
    description: "אדם מבוגר שמחפש חבר קרוב לבית, פעילות מתונה",
    answers: {
      housing: "apartment-large",
      "alone-hours": "rarely",
      household: "alone",
      experience: "some",
      "activity-level": "low",
      "exercise-commitment": "minimal",
      "shedding-tolerance": "low",
      "size-preference": "small",
      "training-investment": "basic",
      "bark-tolerance": "moderate",
      "dog-personality": "cuddly",
    },
  },
  {
    id: "family-garden",
    emoji: "🏡",
    title: "משפחה עם בית וגינה",
    description: "בית עם גינה, ילדים גדולים, יכולת לפעילות רצינית",
    answers: {
      housing: "house-garden",
      "alone-hours": "few",
      household: "kids-older",
      experience: "some",
      "activity-level": "active",
      "exercise-commitment": "good",
      "shedding-tolerance": "fine",
      "size-preference": "large-plus",
      "training-investment": "professional",
      guarding: "warning",
    },
  },
  {
    id: "experienced-pro",
    emoji: "🎓",
    title: "בעלים מנוסה / מאלף",
    description: "ניסיון רב, מחפש אתגר אמיתי, יכול להשקיע באילוף מתקדם",
    answers: {
      experience: "expert",
      household: "couple",
      "alone-hours": "few",
      "activity-level": "very-active",
      "exercise-commitment": "high",
      "training-investment": "expert",
      "size-preference": "medium",
      "shedding-tolerance": "fine",
      housing: "house-garden",
      "bark-tolerance": "fine",
    },
  },
];
