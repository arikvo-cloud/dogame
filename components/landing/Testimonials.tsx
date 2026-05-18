"use client";

import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";
import { Pill } from "@/components/ui/Pill";

interface Testimonial {
  quote: string;
  author: string;
  context: string;
  emoji: string;
  breed?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "התלבטנו בין 6 גזעים. השאלון הסתיים תוך 4 דקות והתאמתו לי בולדוג צרפתי — שאפילו לא חשבנו עליו. עכשיו הוא בבית והכל פשוט מתאים.",
    author: "מיכל",
    context: "תל אביב · אמא ל-2 ילדים",
    emoji: "🐶",
    breed: "בולדוג צרפתי",
  },
  {
    quote:
      "החיפוש בגוגל היה הומבריב מהומה. כאן קיבלתי 5 גזעים מתאימים עם הסבר למה כל אחד. דייקנות שלא הצלחנו להגיע אליה אצל מאלפים.",
    author: "יוסי",
    context: "חיפה · רץ מרתון",
    emoji: "🏃",
    breed: "וייזסלה",
  },
  {
    quote:
      'הצ\'אט של ה-AI ענה לי על שאלה ספציפית: "האם הוא יסתדר עם החתולה שלי?" — קיבלתי תשובה מנומקת, לא העתק-הדבק מויקיפדיה.',
    author: "נועה",
    context: "ירושלים · בעלים של חתולה",
    emoji: "🐱",
  },
  {
    quote:
      "אהבתי שזה לא דוחק לרכישת גורים. הקישורים לאגודות אימוץ שיכנעו אותי לבדוק קודם — ובסוף אימצנו כלב מעורב מנפלא!",
    author: "תמר",
    context: "באר שבע · אימצה מתנו'בה",
    emoji: "💚",
  },
];

const STATS = [
  { number: "37", suffix: "+", label: "גזעים במאגר" },
  { number: "10", suffix: "", label: "צירי תכונות" },
  { number: "3-5", suffix: "", label: "דקות בלבד" },
  { number: "100%", suffix: "", label: "חינמי" },
];

export function Testimonials() {
  return (
    <section className="px-4 py-16 md:py-24 bg-bg-soft border-y-[3px] border-border">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Pill tone="success">💬 מה אומרים</Pill>
          <h2 className="mt-4 text-3xl md:text-5xl font-black text-ink">
            משפחות שכבר בחרו נכון
          </h2>
          <p className="mt-4 text-ink-soft text-lg md:text-xl max-w-2xl mx-auto font-medium">
            הסיפורים האלה הם דוגמאות אופייניות מהאופן שבו אנשים השתמשו ב-DoGame.
            <span className="block mt-1 text-xs opacity-70">
              * דוגמאות איוריות, לא חוות-דעת אמיתיות
            </span>
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                delay: i * 0.1,
                type: "spring",
                stiffness: 180,
                damping: 22,
              }}
              className="relative rounded-[28px] border-[3px] border-border bg-surface p-6 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)]"
            >
              <div
                aria-hidden
                className="absolute -top-3 -right-3 inline-flex items-center justify-center w-10 h-10 rounded-[12px] bg-primary text-white border-[3px] border-primary-deep shadow-[0_3px_0_var(--color-primary-deep)]"
              >
                <Quote className="w-4 h-4" strokeWidth={3} />
              </div>
              <div aria-hidden className="flex items-center gap-1 mb-3">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star
                    key={s}
                    className="w-3.5 h-3.5 text-mustard fill-mustard"
                    strokeWidth={0}
                  />
                ))}
              </div>
              <blockquote className="text-ink text-base md:text-lg leading-relaxed font-medium">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 pt-4 border-t-2 border-dashed border-border flex items-center gap-3">
                <span
                  aria-hidden
                  className="inline-flex items-center justify-center w-10 h-10 rounded-[12px] bg-primary-tint border-2 border-border-strong text-2xl"
                >
                  {t.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-extrabold text-ink text-sm">
                    {t.author}
                  </div>
                  <div className="text-xs text-ink-soft font-medium">{t.context}</div>
                </div>
                {t.breed && (
                  <span className="text-xs font-display font-bold text-primary-deep bg-primary-tint border border-primary-soft rounded-full px-2.5 py-1">
                    {t.breed}
                  </span>
                )}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="rounded-[28px] border-[3px] border-primary-deep bg-gradient-to-br from-primary-tint via-surface to-accent-tint p-6 md:p-7 shadow-[var(--shadow-clay-xl),var(--shadow-inner-clay)]"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-3xl md:text-4xl font-black text-primary-deep font-display leading-none">
                  {s.number}
                  <span className="text-base">{s.suffix}</span>
                </div>
                <div className="mt-1 text-xs md:text-sm text-ink-soft font-display font-bold">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
