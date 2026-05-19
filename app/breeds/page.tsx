import { BreedsBrowse } from "@/components/breeds/BreedsBrowse";
import { BREEDS } from "@/lib/breeds/data";
import { SiteNav } from "@/components/providers/SiteNav";
import { AuroraBackground } from "@/components/providers/AuroraBackground";
import { SectionMark } from "@/components/ui/SectionMark";

export const metadata = {
  title: "כל הגזעים · DoGame",
  description: `דפדף ב-${BREEDS.length} גזעי כלבים פופולריים בישראל — חיפוש לפי שם, סינון לפי גודל, אנרגיה, היפואלרגניים, התאמה לילדים ועוד.`,
  alternates: {
    canonical: "/breeds",
  },
  openGraph: {
    title: "כל הגזעים · DoGame",
    description: `${BREEDS.length} גזעי כלבים בעברית — עם תמונות, קישורי ויקיפדיה, ופרופיל תכונות מלא.`,
  },
};

export default function BreedsIndexPage() {
  return (
    <main id="main" className="min-h-dvh bg-clay">
      <AuroraBackground />
      <SiteNav />
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <header className="mb-10 md:mb-14">
          <SectionMark numeral="A→Z" label="קטלוג הגזעים" />
          <div className="mt-5 grid md:grid-cols-12 gap-6 md:gap-10 items-end">
            <h1 className="md:col-span-7 font-extrabold font-display text-ink leading-[0.95] tracking-tight text-[clamp(2.5rem,7vw,5.5rem)]">
              כל{" "}
              <span className="italic text-primary-deep font-medium">הגזעים</span>
            </h1>
            <p className="md:col-span-5 text-ink-soft text-base md:text-lg font-medium max-w-prose leading-relaxed">
              דפדפו ב-{BREEDS.length} גזעי כלבים פופולריים בישראל. חיפוש לפי שם,
              או סינון לפי תכונות כדי למצוא את הגזע המתאים לסגנון החיים שלכם.
            </p>
          </div>
          <hr className="magazine-rule mt-10" />
        </header>

        <BreedsBrowse />
      </div>
    </main>
  );
}
