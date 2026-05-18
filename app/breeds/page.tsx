import Link from "next/link";
import { BreedsBrowse } from "@/components/breeds/BreedsBrowse";
import { BREEDS } from "@/lib/breeds/data";
import { SiteNav } from "@/components/providers/SiteNav";
import { AuroraBackground } from "@/components/providers/AuroraBackground";

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
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">

        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-ink leading-tight">
            כל{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10 text-primary-deep">הגזעים</span>
              <span
                aria-hidden
                className="absolute -bottom-1 right-0 left-0 h-3 md:h-4 -z-0 rounded-full"
                style={{ background: "#FED7AA" }}
              />
            </span>
          </h1>
          <p className="mt-4 text-ink-soft text-lg md:text-xl max-w-2xl mx-auto font-medium">
            דפדף ב-{BREEDS.length} גזעי כלבים פופולריים בישראל. חיפוש לפי שם או
            סינון לפי תכונות כדי למצוא את הגזע המתאים.
          </p>
        </header>

        <BreedsBrowse />
      </div>
    </main>
  );
}
