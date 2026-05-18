import Link from "next/link";
import { Suspense } from "react";
import { CompareParamsReader } from "@/components/breeds/CompareParamsReader";
import { SiteNav } from "@/components/providers/SiteNav";

export const metadata = {
  title: "השוואת גזעים · DoGame",
  description:
    "השוואה זה לצד זה של שני גזעי כלבים — תכונות, גודל, אנרגיה, טיפוח, התאמה לדירה ולילדים.",
  alternates: { canonical: "/compare/" },
  openGraph: {
    title: "השוואת גזעי כלבים · DoGame",
    description: "בחר/י 2 גזעים וקבל/י השוואה מלאה זה לצד זה.",
    locale: "he_IL",
  },
};

export default function ComparePage() {
  return (
    <main id="main" className="min-h-dvh bg-clay">
      <SiteNav />
      <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">

        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-ink leading-tight">
            השוואת{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10 text-primary-deep">גזעים</span>
              <span
                aria-hidden
                className="absolute -bottom-1 right-0 left-0 h-3 md:h-4 -z-0 rounded-full"
                style={{ background: "#FED7AA" }}
              />
            </span>
          </h1>
          <p className="mt-4 text-ink-soft text-lg max-w-xl mx-auto font-medium">
            בחר/י 2 גזעים וקבל/י השוואה מלאה — גודל, אנרגיה, אילוף, טיפוח ועוד.
          </p>
        </header>

        <Suspense
          fallback={
            <div className="text-center py-12 text-ink-soft font-display font-bold">
              טוען השוואה...
            </div>
          }
        >
          <CompareParamsReader />
        </Suspense>
      </div>
    </main>
  );
}
