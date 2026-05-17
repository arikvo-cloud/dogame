import Link from "next/link";
import { ResultView } from "@/components/result/ResultView";

export const metadata = {
  title: "התוצאות שלך · DoGame",
  description: "הגזעים שהכי מתאימים לסגנון החיים שלך.",
};

export default function ResultPage() {
  return (
    <main id="main" className="min-h-dvh bg-clay py-8 md:py-12 px-4">
      <div className="mx-auto max-w-5xl mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-ink-soft hover:text-primary-deep font-display font-extrabold transition-colors text-lg"
        >
          <span className="text-2xl">🐾</span> DoGame
        </Link>
        <Link
          href="/about"
          className="text-sm text-ink-soft hover:text-primary-deep transition-colors font-display font-bold"
        >
          על הפרויקט
        </Link>
      </div>
      <div className="mx-auto max-w-5xl">
        <ResultView />
      </div>
    </main>
  );
}
