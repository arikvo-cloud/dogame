import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteNav } from "@/components/providers/SiteNav";
import { AuroraBackground } from "@/components/providers/AuroraBackground";
import { SectionMark } from "@/components/ui/SectionMark";
import { Reveal } from "@/components/ui/Reveal";

export const metadata = {
  title: "אימוץ מול קנייה · DoGame",
  description: "אימוץ כלב בישראל — מה כדאי לדעת לפני שמביאים כלב הביתה. סטטיסטיקות, תהליך, ומיתוסים נפוצים.",
  alternates: { canonical: "/about-adoption" },
};

export default function AboutAdoptionPage() {
  return (
    <main id="main" className="min-h-dvh bg-clay">
      <AuroraBackground />
      <SiteNav />
      <article className="mx-auto max-w-3xl px-4 py-10 md:py-16">
        <header className="mb-12">
          <SectionMark numeral="00" label="המאמר" />
          <h1 className="mt-5 font-extrabold font-display text-ink leading-[0.95] tracking-tight text-[clamp(2.5rem,7vw,5rem)]">
            אימוץ מול{" "}
            <span className="italic text-primary-deep font-medium">קנייה</span>
          </h1>
          <p className="mt-5 text-ink-mute text-lg italic font-display">מה כדאי לדעת לפני שמביאים כלב הביתה.</p>
          <hr className="magazine-rule mt-8" />
        </header>

        <Reveal from="up">
          <p className="drop-cap text-lg md:text-xl text-ink leading-relaxed font-medium">
            בישראל יש אלפי כלבים שמחכים לבית בכל זמן נתון. רובם תערובות בריאות, צעירות, וחברותיות שהגיעו למקלטים בעקבות מצבי חיים שאין להם קשר לכלב עצמו — מעבר דירה, משבר כלכלי, מחלה במשפחה. אימוץ הוא הדרך הזולה, האחראית והאתית ביותר להביא כלב הביתה.
          </p>
        </Reveal>

        <Reveal from="up">
          <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-px bg-border md:rounded-[20px] overflow-hidden md:border-2 md:border-border">
            <StatPanel num="1/3" label="מהכלבים חוזרים למקלט בשנה הראשונה" />
            <StatPanel num="0₪" label="אימוץ ברוב המקלטים — רק עלות חיסונים ועיקור" />
            <StatPanel num="60%" label="מהכלבים בישראל הם תערובות" />
          </section>
          <p className="mt-3 text-xs text-ink-mute italic">* נתונים מקורבים. מבוסס על דיווחי אגודות רווחת חיות בישראל, 2024.</p>
        </Reveal>

        <Reveal from="up">
          <h2 className="mt-14 text-3xl md:text-4xl font-extrabold font-display text-ink leading-tight">
            תהליך האימוץ — איך זה עובד?
          </h2>
          <ol className="mt-6 space-y-6">
            <Step n="01" title="בחירת מקלט">
              בוחרים מקלט באזור המגורים שלכם. רוב המקלטים מאפשרים להגיע ולהכיר את הכלבים, חלקם דורשים תיאום מראש.
            </Step>
            <Step n="02" title="הכרות עם הכלב">
              פוגשים את הכלב בסביבה רגועה. שואלים את הצוות על האופי, ההיסטוריה, וצרכים מיוחדים. רוב המקלטים מאפשרים אימוץ-ניסיון של שבוע-שבועיים.
            </Step>
            <Step n="03" title="חתימה והבאה הביתה">
              חותמים על הסכם אימוץ, מקבלים מסמכי וטרינריה, ומביאים את הכלב הביתה. לוקח לרוב הכלבים 2-4 שבועות להסתגל לסביבה חדשה.
            </Step>
          </ol>
        </Reveal>

        <Reveal from="up">
          <h2 className="mt-14 text-3xl md:text-4xl font-extrabold font-display text-ink leading-tight">
            מיתוסים נפוצים
          </h2>
          <dl className="mt-6 space-y-6">
            <Myth title="&ldquo;כלבי מקלט הם בעייתיים&rdquo;">
              רוב הכלבים במקלטים הגיעו לשם בגלל בעיות במשפחה, לא בגללם. הם רק זקוקים לבית יציב.
            </Myth>
            <Myth title="&ldquo;גורים מקנייה זה יותר בטוח&rdquo;">
              גורים ממכרי גורים סובלים פעמים רבות מבעיות גנטיות. כלב תערובת בריא בדרך כלל יותר מגזעי-יחוס.
            </Myth>
            <Myth title="&ldquo;אני רוצה גזע מסוים&rdquo;">
              גם גזעים נדירים מגיעים למקלטים. שווה לבדוק אצל מקלט גזעי באזור.
            </Myth>
          </dl>
        </Reveal>

        <Reveal from="scale">
          <div className="mt-16 rounded-[28px] border-2 border-primary-deep bg-primary-tint p-8 md:p-10 text-center shadow-[var(--shadow-clay-xl)]">
            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-ink leading-tight">
              מוכנים להתחיל?
            </h2>
            <p className="mt-3 text-ink-soft text-base md:text-lg max-w-prose mx-auto">
              צפו ב-50 כלבים המחכים ברגע זה לבית במקלטים ברחבי הארץ.
            </p>
            <Link
              href="/adopt"
              data-paw-zone
              className="mt-6 inline-flex items-center gap-2 bg-primary text-white border-2 border-primary-deep px-7 py-3.5 rounded-[20px] shadow-[var(--shadow-glow-primary)] hover:-translate-y-0.5 active:translate-y-1 transition-all font-display font-extrabold"
            >
              לכלבים זמינים
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </Reveal>

        <p className="mt-12 text-xs text-ink-mute italic max-w-prose">
          * פרטי הכלבים והמקלטים באתר הם דוגמאות איוריות. לאימוץ בפועל, פנו ישירות לאחת מאגודות הרווחה בישראל (adopt.org.il).
        </p>
      </article>
    </main>
  );
}

function StatPanel({ num, label }: { num: string; label: string }) {
  return (
    <div className="bg-surface p-7 text-center">
      <div className="serif-numeral text-[clamp(3rem,7vw,5rem)] text-primary-deep tabular-nums">{num}</div>
      <div className="mt-3 text-sm text-ink-soft font-display font-bold leading-tight">{label}</div>
    </div>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[auto_1fr] gap-5 items-baseline border-t border-border pt-5">
      <div className="serif-numeral text-3xl md:text-4xl text-primary-deep/40 tabular-nums">{n}</div>
      <div>
        <h3 className="font-display font-extrabold text-xl md:text-2xl text-ink leading-tight">{title}</h3>
        <p className="mt-2 text-ink-soft text-base md:text-lg leading-relaxed font-medium">{children}</p>
      </div>
    </li>
  );
}

function Myth({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-5">
      <dt className="font-display font-extrabold text-lg md:text-xl text-ink italic">{title}</dt>
      <dd className="mt-2 text-ink-soft text-base md:text-lg leading-relaxed font-medium">{children}</dd>
    </div>
  );
}
