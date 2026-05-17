/**
 * Enrich each breed in data/breeds.json with a small image gallery
 * (additional Wikimedia Commons images beyond the lead photo).
 *
 * Strategy:
 *   1. Use the Wikipedia API `prop=images` to list image filenames on the article.
 *   2. Filter to JPG/PNG only; skip icons, flags, maps, audio.
 *   3. Resolve each filename to a direct upload.wikimedia.org URL via `imageinfo`.
 *   4. Keep up to 4 photos.
 *
 * Re-run from project root:
 *   node scripts/enrich-galleries.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const BREEDS_PATH = path.join(ROOT, "data", "breeds.json");
const MAX_GALLERY = 4;

const HEADERS = {
  "User-Agent": "DoGame/0.1 (https://dogame.pages.dev; contact@dogame.app)",
  Accept: "application/json",
};

// Files containing these substrings are usually not breed photos
const SKIP_RE = /(svg|icon|flag|map|chart|logo|audio|sound|coat-of-arms|coat_of_arms|ogg|wav|disambig|wiktionary|commons-logo|edit-icon|symbol)/i;

async function getArticleTitleForBreed(breed) {
  // Re-extract title from the stored wiki URL (more reliable than re-running overrides)
  const url = breed.wikipediaEn ?? breed.wikipediaHe;
  if (!url) return null;
  // Title is the last path segment, percent-decoded, underscores intact
  const m = url.match(/wiki\/([^?#]+)/);
  if (!m) return null;
  return decodeURIComponent(m[1]);
}

async function listImageFilenames(lang, title) {
  const url = `https://${lang}.wikipedia.org/w/api.php?action=query&prop=images&imlimit=40&format=json&origin=*&titles=${encodeURIComponent(title)}`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) return [];
  const data = await res.json();
  const pages = data?.query?.pages;
  if (!pages) return [];
  const page = Object.values(pages)[0];
  return (page?.images ?? []).map((img) => img.title); // "File:XYZ.jpg"
}

async function resolveImageUrl(lang, fileTitle) {
  const url = `https://${lang}.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url|size&iiurlwidth=800&format=json&origin=*&titles=${encodeURIComponent(fileTitle)}`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = data?.query?.pages;
  if (!pages) return null;
  const page = Object.values(pages)[0];
  const info = page?.imageinfo?.[0];
  if (!info) return null;
  return {
    url: info.thumburl ?? info.url,
    width: info.thumbwidth ?? info.width,
    height: info.thumbheight ?? info.height,
  };
}

async function buildGallery(lang, title, leadUrl) {
  const filenames = await listImageFilenames(lang, title);
  const filtered = filenames.filter((f) => {
    if (SKIP_RE.test(f)) return false;
    if (!/\.(jpe?g|png)$/i.test(f)) return false;
    return true;
  });

  const gallery = [];
  for (const f of filtered) {
    if (gallery.length >= MAX_GALLERY) break;
    const info = await resolveImageUrl(lang, f);
    if (!info) continue;
    if (leadUrl && info.url === leadUrl) continue; // skip duplicate of lead photo
    // Lightweight aspect / size sanity check
    if (info.width < 240 || info.height < 240) continue;
    gallery.push(info);
    await new Promise((r) => setTimeout(r, 80));
  }
  return gallery;
}

async function main() {
  const raw = await readFile(BREEDS_PATH, "utf-8");
  const breeds = JSON.parse(raw);

  console.log(`Building galleries for ${breeds.length} breeds...`);
  let i = 0;
  const out = [];
  for (const breed of breeds) {
    i += 1;
    process.stdout.write(`  [${i}/${breeds.length}] ${breed.slug}... `);
    try {
      const title = await getArticleTitleForBreed(breed);
      if (!title) {
        console.log("✗ no title");
        out.push(breed);
        continue;
      }
      // Prefer English (richer image lists), fall back to Hebrew
      let gallery = await buildGallery("en", title, breed.imageUrl);
      if (gallery.length === 0 && breed.wikipediaHe) {
        const heTitleMatch = breed.wikipediaHe.match(/wiki\/([^?#]+)/);
        if (heTitleMatch) {
          gallery = await buildGallery(
            "he",
            decodeURIComponent(heTitleMatch[1]),
            breed.imageUrl
          );
        }
      }
      console.log(`✓ ${gallery.length} photos`);
      out.push({ ...breed, gallery });
    } catch (e) {
      console.log(`✗ ${e.message}`);
      out.push(breed);
    }
    await new Promise((r) => setTimeout(r, 120));
  }

  await writeFile(BREEDS_PATH, JSON.stringify(out, null, 2) + "\n", "utf-8");
  console.log(`\n✓ Wrote ${BREEDS_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
