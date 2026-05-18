import Link from "next/link";
import { FavoritesView } from "@/components/favorites/FavoritesView";
import { SiteNav } from "@/components/providers/SiteNav";

export const metadata = {
  title: "המועדפים שלי · DoGame",
  description: "הגזעים השמורים שלך — לעיון מאוחר ולהשוואה.",
  alternates: { canonical: "/favorites/" },
};

export default function FavoritesPage() {
  return (
    <main id="main" className="min-h-dvh bg-clay">
      <SiteNav />
      <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">

        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-ink leading-tight">
            המועדפים{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10 text-primary-deep">שלי</span>
              <span
                aria-hidden
                className="absolute -bottom-1 right-0 left-0 h-3 md:h-4 -z-0 rounded-full"
                style={{ background: "#FED7AA" }}
              />
            </span>
          </h1>
          <p className="mt-4 text-ink-soft text-lg max-w-xl mx-auto font-medium">
            גזעים שסימנת בלב 💛. נשמרים מקומית בדפדפן שלך.
          </p>
        </header>

        <FavoritesView />
      </div>
    </main>
  );
}
