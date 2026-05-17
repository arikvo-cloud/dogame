import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DogMascot } from "@/components/quiz/DogMascot";

export const metadata = {
  title: "על הפרויקט · DoGame",
  description:
    "DoGame הוא משחק חינמי שעוזר לאנשים השוקלים לאמץ או לרכוש כלב להבין איזה גזע יתאים לסגנון החיים שלהם.",
};

export default function AboutPage() {
  return (
    <main id="main" className="min-h-dvh bg-clay py-8 md:py-16 px-4">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-display font-extrabold text-xl text-ink mb-8 hover:text-primary-deep transition-colors"
        >
          <span className="text-2xl">🐾</span> DoGame
        </Link>

        <div className="rounded-[36px] border-[3px] border-border bg-surface p-8 md:p-12 shadow-[var(--shadow-clay-xl),var(--shadow-inner-clay)]">
          <div className="flex justify-center">
            <div className="bg-bg-soft rounded-full p-3 border-[3px] border-border-strong shadow-[var(--shadow-clay-lg)]">
              <DogMascot mood="thinking" size={140} />
            </div>
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-black text-ink text-center">
            על הפרויקט
          </h1>

          <div className="mt-8 space-y-6 text-ink leading-relaxed text-lg">
            <section>
              <h2 className="font-display font-black text-2xl mb-3 text-primary-deep">למה DoGame?</h2>
              <p className="text-ink-soft font-medium">
                לפי הסטטיסטיקה העולמית, כשליש מהכלבים שמאומצים או נרכשים מוחזרים
                למחסות במהלך השנה הראשונה. הסיבה הנפוצה ביותר היא{" "}
                <strong className="text-ink">אי-התאמה</strong> בין סגנון החיים של
                המשפחה לבין הצרכים האמיתיים של הגזע.
              </p>
              <p className="text-ink-soft font-medium mt-3">
                DoGame בנוי כדי לעזור לאנשים{" "}
                <strong className="text-ink">לפני</strong> שהם מביאים כלב הביתה —
                להבין באופן ברור איזה גזע יתאים להם, ולמה.
              </p>
            </section>

            <section>
              <h2 className="font-display font-black text-2xl mb-3 text-primary-deep">איך זה עובד?</h2>
              <p className="text-ink-soft font-medium">
                השאלון מורכב מ-9 עד 15 שאלות שמסתגלות לתשובות שלך. כל תשובה משפיעה
                על וקטור ההעדפות שלך לאורך 10 צירי תכונות: גודל, רמת אנרגיה, קלות
                אילוף, דרישות תחזוקה, השלת פרווה, התאמה לילדים, התאמה לחיות אחרות,
                התאמה לדירה, עמידות בחום ורמת נביחה.
              </p>
              <p className="text-ink-soft font-medium mt-3">
                לאחר השאלון, אלגוריתם משוקלל מחשב את ההתאמה שלך מול 35+ גזעים
                פופולריים בישראל. בנוסף, כללי החלטה חכמים מסננים גזעים שלא מתאימים
                בכלל (אלרגיה, חום קיצוני, וכו') לפני חישוב הציון.
              </p>
            </section>

            <section>
              <h2 className="font-display font-black text-2xl mb-3 text-primary-deep">למה לסמוך על ההמלצה?</h2>
              <p className="text-ink-soft font-medium">
                ההמלצה היא נקודת התחלה — לא תחליף לייעוץ מקצועי. אנחנו ממליצים
                לאחר קבלת התוצאות לפנות למאלף או לוטרינר ולקרוא לעומק על הגזע
                שמתאים לך.
              </p>
            </section>

            <section className="rounded-[24px] border-[3px] border-accent-soft bg-accent-tint p-5">
              <h2 className="font-display font-black text-xl mb-2 text-accent-deep">🔐 פרטיות</h2>
              <p className="text-ink-soft font-medium">
                אין רישום, אין שמירת נתונים בענן, אין עוקבני פרסום. התשובות שלך
                נשמרות באופן מקומי בדפדפן (localStorage) כדי שלא תאבד את ההתקדמות
                אם תרענן את הדף. אתה יכול למחוק אותן בלחיצה אחת (&quot;התחל
                מחדש&quot;).
              </p>
            </section>

            <section>
              <h2 className="font-display font-black text-2xl mb-3 text-primary-deep">מה הלאה?</h2>
              <p className="text-ink-soft font-medium">
                בעתיד אנחנו מתכננים להוסיף חיבור לאגודות אימוץ ישראליות (לאפשר
                לראות כלבים זמינים שמתאימים לפרופיל שלך), מצב מקצועי לוטרינרים
                ולמאלפים, ועוד.
              </p>
            </section>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 bg-primary text-white border-[3px] border-primary-deep px-8 py-4 rounded-[22px] shadow-[var(--shadow-glow-primary)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[var(--shadow-clay-press)] font-display font-extrabold text-lg transition-all"
            >
              התחל את המשחק
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
