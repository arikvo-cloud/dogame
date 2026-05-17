import Link from "next/link";
import { FavoritesView } from "@/components/favorites/FavoritesView";

export const metadata = {
  title: "המועדפים שלי · DoGame",
  description: "הגזעים השמורים שלך — לעיון מאוחר ולהשוואה.",
  alternates: { canonical: "/favorites/" },
};

export default function FavoritesPage() {
  return (
    <main id="main" className="min-h-dvh bg-clay py-8 md:py-12 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-display font-extrabold text-lg text-ink hover:text-primary-deep transition-colors"
          >
            <span className="text-2xl">🐾</span> DoGame
          </Link>
          <Link
            href="/breeds"
            className="text-sm text-ink-soft hover:text-primary-deep font-display font-bold transition-colors"
          >
            ← כל הגזעים
          </Link>
        </div>

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
