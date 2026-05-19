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
