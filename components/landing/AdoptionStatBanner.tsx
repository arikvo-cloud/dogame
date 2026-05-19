import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SectionMark } from "@/components/ui/SectionMark";

export function AdoptionStatBanner() {
  return (
    <div className="text-right">
      <Reveal from="up" delay={0.05}>
        <SectionMark numeral="01" label="המשימה" />
      </Reveal>

      <h1 className="mt-5 font-extrabold font-display text-ink leading-[0.95] tracking-tight text-[clamp(2.25rem,7vw,5.5rem)] break-words">
        <span className="text-primary-deep tabular-nums">1</span> מתוך{" "}
        <span className="text-primary-deep tabular-nums">3</span>{" "}
        <span className="italic font-medium">כלבים חוזרים למחסה</span> בשנה הראשונה.
      </h1>

      <Reveal from="up" delay={0.45}>
        <p className="drop-cap mt-7 text-lg md:text-xl text-ink-soft leading-relaxed max-w-prose font-medium">
          בואו נשנה זאת. DoGame עוזר לכם לבחור את הכלב הנכון —{" "}
          לפני שמביאים אותו הביתה. דרך שאלון קצר, פרופילי גזעים מפורטים, וקישור
          ישיר לכלבים שמחכים לאימוץ במקלטים ברחבי הארץ.
        </p>
      </Reveal>

      <Reveal from="up" delay={0.7}>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <MagneticButton>
            <Link
              href="/adopt"
              data-paw-zone
              className="group inline-flex items-center justify-center gap-2 bg-primary text-white border-2 border-primary-deep px-7 py-4 rounded-[22px] shadow-[var(--shadow-glow-primary)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[var(--shadow-clay-press)] font-display font-extrabold text-lg transition-all"
            >
              <Heart className="w-5 h-5" strokeWidth={2.5} fill="currentColor" />
              מצאו כלב לאמץ
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </MagneticButton>
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center gap-2 bg-surface text-ink border-2 border-border px-7 py-4 rounded-[22px] font-display font-bold text-base shadow-[var(--shadow-clay)] hover:-translate-y-0.5 hover:border-border-strong active:translate-y-1 transition-all"
          >
            או — התחילו שאלון
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
