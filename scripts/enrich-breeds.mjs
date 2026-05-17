/**
 * Enriches data/breeds.json with:
 *   - imageUrl: lead photo (Wikimedia Commons, via Wikipedia summary API)
 *   - imageWidth, imageHeight: dimensions of the thumbnail
 *   - wikipediaHe: Hebrew Wikipedia URL (when available)
 *   - wikipediaEn: English Wikipedia URL
 *
 * Run from project root:
 *   node scripts/enrich-breeds.mjs
 *
 * Wikipedia summary API returns CC-licensed thumbnails. We prefer English
 * Wikipedia for photos (better selection) and Hebrew for the article link.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const BREEDS_PATH = path.join(ROOT, "data", "breeds.json");

/**
 * Manual overrides where the auto-derived title doesn't match Wikipedia.
 * Keys are breed slugs from breeds.json.
 */
const TITLE_OVERRIDES = {
  en: {
    "poodle-mini": "Miniature_Poodle",
    "schnauzer-mini": "Miniature_Schnauzer",
    "cattle-dog": "Australian_Cattle_Dog",
    "great-dane": "Great_Dane",
    "english-bulldog": "Bulldog",
    "french-bulldog": "French_Bulldog",
    "german-shepherd": "German_Shepherd",
    "border-collie": "Border_Collie",
    "australian-shepherd": "Australian_Shepherd",
    "shiba-inu": "Shiba_Inu",
    "cane-corso": "Cane_Corso",
    "jack-russell": "Jack_Russell_Terrier",
    "yorkshire": "Yorkshire_Terrier",
    "shih-tzu": "Shih_Tzu",
    "cavalier": "Cavalier_King_Charles_Spaniel",
    "cocker": "English_Cocker_Spaniel",
    canaan: "Canaan_Dog",
    "bichon-frise": "Bichon_Frise",
    malinois: "Malinois_dog",
    husky: "Siberian_Husky",
    bernese: "Bernese_Mountain_Dog",
    samoyed: "Samoyed_dog",
    pomeranian: "Pomeranian_dog",
    boxer: "Boxer_(dog)",
    rottweiler: "Rottweiler",
    doberman: "Dobermann",
    vizsla: "Vizsla",
    dalmatian: "Dalmatian_(dog)",
    greyhound: "Greyhound",
    labrador: "Labrador_Retriever",
    golden: "Golden_Retriever",
    "poodle-standard": "Standard_Poodle",
    maltese: "Maltese_dog",
    chihuahua: "Chihuahua_(dog)",
    beagle: "Beagle",
    dachshund: "Dachshund",
    pug: "Pug",
  },
  he: {
    labrador: "לברדור_רטריבר",
    golden: "גולדן_רטריבר",
    "german-shepherd": "רועה_גרמני",
    malinois: "מלינואה_בלגי",
    "french-bulldog": "בולדוג_צרפתי",
    "poodle-standard": "פודל",
    "poodle-mini": "פודל",
    "bichon-frise": "בישון_פריזה",
    maltese: "מלטז",
    chihuahua: "צ'יוואווה",
    yorkshire: "יורקשייר_טרייר",
    "shih-tzu": "שיצו",
    cavalier: "קוואלייר_קינג_צ'רלס_ספנייל",
    cocker: "קוקר_ספנייל_אנגלי",
    beagle: "ביגל",
    dachshund: "תחש_(כלב)",
    pug: "פאג",
    boxer: "בוקסר_(כלב)",
    "border-collie": "בורדר_קולי",
    "australian-shepherd": "רועה_אוסטרלי",
    husky: "האסקי_סיבירי",
    vizsla: "וייזסלה",
    doberman: "דוברמן",
    rottweiler: "רוטוויילר",
    canaan: "כלב_כנעני",
    "jack-russell": "ג'ק_ראסל_טרייר",
    "schnauzer-mini": "שנאוצר_ננסי",
    pomeranian: "פומרניאן",
    bernese: "כלב_הר_ברני",
    "shiba-inu": "שיבא_אינו",
    samoyed: "סאמוייד",
    dalmatian: "דלמטי",
    greyhound: "גרייהאונד",
    "cattle-dog": "כלב_בקר_אוסטרלי",
    "great-dane": "דוג_גרמני",
    "english-bulldog": "בולדוג_אנגלי",
    "cane-corso": "קאנה_קורסו",
  },
};

async function fetchSummary(lang, title) {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "DoGame/0.1 (https://dogame.app; contact@dogame.app)",
      Accept: "application/json",
    },
  });
  if (!res.ok) return null;
  return await res.json();
}

async function enrich(breed) {
  const enTitle = TITLE_OVERRIDES.en[breed.slug] ?? breed.nameEn.replace(/ /g, "_");
  const heTitle = TITLE_OVERRIDES.he[breed.slug];

  const enData = await fetchSummary("en", enTitle);
  if (!enData) {
    console.warn(`  ⚠ no English summary for ${breed.slug} (${enTitle})`);
  }

  const heData = heTitle ? await fetchSummary("he", heTitle) : null;

  // Prefer the original full image, fall back to thumbnail
  const imageSource =
    enData?.originalimage?.source ||
    enData?.thumbnail?.source ||
    heData?.originalimage?.source ||
    heData?.thumbnail?.source ||
    null;
  const imageWidth =
    enData?.originalimage?.width ||
    enData?.thumbnail?.width ||
    heData?.originalimage?.width ||
    heData?.thumbnail?.width ||
    null;
  const imageHeight =
    enData?.originalimage?.height ||
    enData?.thumbnail?.height ||
    heData?.originalimage?.height ||
    heData?.thumbnail?.height ||
    null;

  const wikipediaHe = heData?.content_urls?.desktop?.page ?? null;
  const wikipediaEn = enData?.content_urls?.desktop?.page ?? null;

  return {
    ...breed,
    imageUrl: imageSource,
    imageWidth,
    imageHeight,
    wikipediaHe,
    wikipediaEn,
  };
}

async function main() {
  const raw = await readFile(BREEDS_PATH, "utf-8");
  const breeds = JSON.parse(raw);

  console.log(`Enriching ${breeds.length} breeds...`);
  const enriched = [];
  let i = 0;
  for (const breed of breeds) {
    i += 1;
    process.stdout.write(`  [${i}/${breeds.length}] ${breed.slug}... `);
    try {
      const result = await enrich(breed);
      const ok = result.imageUrl ? "✓ image" : "✗ no image";
      const wikiOk = result.wikipediaHe ? "+ he wiki" : result.wikipediaEn ? "+ en wiki only" : "no wiki";
      console.log(`${ok} ${wikiOk}`);
      enriched.push(result);
    } catch (e) {
      console.log(`✗ error: ${e.message}`);
      enriched.push(breed);
    }
    // gentle rate limit — be nice to wikipedia
    await new Promise((r) => setTimeout(r, 100));
  }

  await writeFile(BREEDS_PATH, JSON.stringify(enriched, null, 2) + "\n", "utf-8");
  console.log(`\n✓ Wrote ${BREEDS_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
