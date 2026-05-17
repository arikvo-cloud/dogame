import Link from "next/link";
import { QuizContainer } from "@/components/quiz/QuizContainer";

export const metadata = {
  title: "השאלון · DoGame",
  description: "ענה על השאלות כדי למצוא את הגזע המתאים לסגנון החיים שלך.",
};

export default function QuizPage() {
  return (
    <main id="main" className="min-h-dvh bg-clay py-8 md:py-14 px-4">
      <div className="mx-auto max-w-3xl mb-6 flex items-center justify-between">
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
      <QuizContainer />
    </main>
  );
}
