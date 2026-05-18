import Link from "next/link";
import { QuizContainer } from "@/components/quiz/QuizContainer";
import { SiteNav } from "@/components/providers/SiteNav";

export const metadata = {
  title: "השאלון · DoGame",
  description: "ענה על השאלות כדי למצוא את הגזע המתאים לסגנון החיים שלך.",
};

export default function QuizPage() {
  return (
    <main id="main" className="min-h-dvh bg-clay">
      <SiteNav />
      <div className="px-4 py-8 md:py-12">
        <QuizContainer />
      </div>
    </main>
  );
}
