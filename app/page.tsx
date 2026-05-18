import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Sparkles,
  Shield,
  Clock,
} from "lucide-react";
import { DogMascot } from "@/components/quiz/DogMascot";
import { BREEDS } from "@/lib/breeds/data";
import { Pill } from "@/components/ui/Pill";
import { BreedPhoto } from "@/components/breed/BreedPhoto";
import { SiteNav } from "@/components/providers/SiteNav";
import { AuroraBackground } from "@/components/providers/AuroraBackground";
import { ScrollStory } from "@/components/landing/ScrollStory";
import { Testimonials } from "@/components/landing/Testimonials";
import { BreedMarquee } from "@/components/landing/BreedMarquee";
import { HeroPhotoFeature } from "@/components/landing/HeroPhotoFeature";
import { LazyMount } from "@/components/ui/LazyMount";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { CountUp } from "@/components/ui/CountUp";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dogame.pages.dev";

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "DoGame",
      description: "משחק אינטראקטיבי להתאמת גזע כלב לסגנון החיים שלך",
      inLanguage: "he",
    },
    {
      "@type": "WebApplication",
      name: "DoGame",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "ILS" },
      inLanguage: "he",
      url: BASE_URL,
    },
  ],
};

export default function HomePage() {
  const featuredBreeds = BREEDS.slice(0, 6);

  return (
    <main id="main" className="bg-clay">
      <AuroraBackground />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <SiteNav />

      {/* === Hero === */}
      <section className="px-4 pt-8 pb-16 md:pt-12 md:pb-20 relative">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Photo: appears below the text on mobile, on the desktop-left in RTL grid */}
          <div className="w-full order-2 md:order-1">
            <HeroPhotoFeature />
          </div>

          {/* Text: comes first on mobile so H1 + CTA are above the fold */}
          <div className="text-right order-1 md:order-2">
            <Reveal from="up" delay={0.05}>
              <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-display font-bold text-ink-mute">
                <span className="block w-6 h-px bg-ink-mute" aria-hidden />
                <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
                המדריך המאוים לבחירת כלב
              </div>
            </Reveal>

            <h1 className="mt-3 md:mt-5 font-extrabold font-display text-ink leading-[1.02] tracking-tight text-[clamp(1.75rem,6vw,4.5rem)] lg:text-7xl break-words">
              איזה כלב באמת{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary-deep">מתאים לך?</span>
                <span
                  aria-hidden
                  className="absolute right-0 left-0 -bottom-0.5 h-[0.2em] -z-0 rounded-full bg-peach"
                />
              </span>
            </h1>

            <Reveal from="up" delay={0.7}>
              <p className="mt-7 md:mt-8 text-lg md:text-2xl text-ink-soft leading-relaxed max-w-prose font-medium">
                ענה על שאלון קצר על סגנון החיים שלך וקבל המלצה אישית
                ל-3-5 גזעים שיתאימו לך בדיוק.{" "}
                <span className="text-ink font-bold">בלי לחץ, בלי תשלום</span> — רק מידע
                מבוסס שיעזור לך לבחור נכון.
              </p>
            </Reveal>

            <Reveal from="up" delay={0.85}>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <MagneticButton>
                  <Link
                    href="/quiz"
                    className="group inline-flex items-center justify-center gap-2 bg-primary text-white border-2 border-primary-deep px-7 py-4 rounded-[22px] shadow-[var(--shadow-glow-primary)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[var(--shadow-clay-press)] font-display font-extrabold text-lg transition-all"
                  >
                    בוא נתחיל
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </Link>
                </MagneticButton>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 bg-surface text-ink border-2 border-border px-7 py-4 rounded-[22px] font-display font-extrabold text-lg shadow-[var(--shadow-clay)] hover:-translate-y-0.5 hover:border-border-strong active:translate-y-1 transition-all"
                >
                  איך זה עובד?
                </Link>
              </div>
            </Reveal>

            <Reveal from="up" delay={1.0}>
              <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-soft font-display font-bold">
                <li className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary-deep" strokeWidth={2.5} />
                  3-5 דקות
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-primary-deep" strokeWidth={2.5} />
                  ללא הרשמה
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-primary-deep" strokeWidth={2.5} />
                  <CountUp to={37} suffix="+ גזעים" />
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* === Auto-scrolling breed marquee === */}
      <BreedMarquee />

      {/* === Stats strip === */}
      <section className="px-4 pb-12 -mt-8 md:-mt-12 relative z-10">
        <div className="mx-auto max-w-4xl">
          <Reveal from="up">
            <div className="rounded-[24px] border-2 border-border bg-surface px-6 py-5 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)] flex flex-wrap items-center justify-around gap-6 text-center">
              <Stat number={37} suffix="+" label="גזעים פופולריים" />
              <span aria-hidden className="w-px h-10 bg-border-strong opacity-50" />
              <Stat number={10} label="צירי תכונות" />
              <span aria-hidden className="w-px h-10 bg-border-strong opacity-50" />
              <Stat number={5} label="חוקי סינון חכמים" />
              <span aria-hidden className="w-px h-10 bg-border-strong opacity-50" />
              <Stat number={3} suffix="-5" label="דקות בלבד" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* === Pinned scroll story (replaces the static "Why" hero) === */}
      <LazyMount rootMargin="400px" minHeight="100dvh">
        <ScrollStory />
      </LazyMount>

      {/* === Why — editorial 3-column === */}
      <section className="px-4 py-14 md:py-20 border-y border-border relative">
        <div className="mx-auto max-w-6xl relative">
          <Reveal from="up">
            <div className="mb-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-display font-bold text-ink-mute">
                <span className="block w-6 h-px bg-ink-mute" aria-hidden />
                הגישה שלנו
              </div>
              <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-ink leading-[1.05] tracking-tight">
                שלושה עקרונות שמובילים{" "}
                <span className="text-primary-deep italic">כל המלצה</span>
              </h2>
              <p className="mt-5 text-ink-soft text-lg md:text-xl font-medium max-w-prose">
                אנחנו לא מנחשים לפי "מי הכי חמוד". כל גזע נמדד מול הסגנון שלך
                ב-10 מימדים — חינוך, אנרגיה, אקלים, רגישות לילדים — וכל אלה
                משוקללים לפני שמדבר על התאמה.
              </p>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border" stagger={0.1}>
            {[
              {
                num: "01",
                title: "אחריות לפני אהבה",
                text:
                  "כלב הוא 10-15 שנות התחייבות. השאלון עוזר לך להבין אם זה הזמן הנכון, ואיזה גזע באמת יתאים.",
              },
              {
                num: "02",
                title: "מאפיינים אמיתיים",
                text:
                  "10 צירי תכונות (גודל, אנרגיה, אילוף, אקלים) — לא רק \"איזה כלב הכי חמוד\".",
              },
              {
                num: "03",
                title: "מותאם לישראל",
                text:
                  "השאלון מתחשב בחום הישראלי, מגורים בדירה, ואפילו בגזע הלאומי שלנו — הכלב הכנעני.",
              },
            ].map(({ num, title, text }) => (
              <StaggerItem
                key={num}
                className="bg-bg p-7 md:p-9 group"
              >
                <div className="font-display font-extrabold text-5xl text-primary-deep/30 leading-none">
                  {num}
                </div>
                <h3 className="mt-5 font-display font-extrabold text-2xl text-ink leading-tight">
                  {title}
                </h3>
                <p className="mt-3 text-ink-soft leading-relaxed font-medium">{text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* === How it works — editorial stepper === */}
      <section className="px-4 py-14 md:py-20 relative">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-display font-bold text-ink-mute">
                <span className="block w-6 h-px bg-ink-mute" aria-hidden />
                איך זה עובד
              </div>
              <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-ink leading-[1.05] tracking-tight">
                שלושה שלבים — <span className="italic text-primary-deep">שלוש דקות</span>
              </h2>
            </div>
          </Reveal>

          <Stagger className="space-y-px bg-border" stagger={0.12}>
            {[
              {
                num: "01",
                title: "ענה על שאלון קצר",
                text:
                  "שאלות על המגורים שלך, רמת הפעילות, ניסיון קודם וההעדפות. השאלון מסתגל לתשובות שלך.",
              },
              {
                num: "02",
                title: "האלגוריתם עובד",
                text:
                  "10 צירי תכונות, כללי סינון חכמים, חישוב התאמה משוקלל מול 37 גזעים פופולריים.",
              },
              {
                num: "03",
                title: "קבל המלצה אישית",
                text:
                  "3-5 גזעים מתאימים עם אחוז התאמה, חוזקות, נקודות לתשומת לב, ומדריך טיפול.",
              },
            ].map(({ num, title, text }) => (
              <StaggerItem
                key={num}
                className="bg-bg grid grid-cols-[auto_1fr] gap-6 md:gap-12 items-baseline py-5 md:py-7 group"
              >
                <div className="font-display font-extrabold text-5xl md:text-7xl text-ink/15 leading-none tabular-nums">
                  {num}
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-2xl md:text-3xl text-ink leading-tight">
                    {title}
                  </h3>
                  <p className="mt-3 text-ink-soft text-base md:text-lg leading-relaxed font-medium max-w-2xl">
                    {text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* === Testimonials === */}
      <LazyMount rootMargin="200px" minHeight={500}>
        <Testimonials />
      </LazyMount>

      {/* === Featured breeds — magazine grid === */}
      <section className="px-4 py-14 md:py-20 relative">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex items-end justify-between mb-10 md:mb-14 flex-wrap gap-4">
              <div>
                <Pill tone="primary">🐶 הכירו</Pill>
                <h2 className="mt-3 text-4xl md:text-6xl font-black text-ink leading-tight tracking-tight">
                  הגזעים שכבר{" "}
                  <span className="relative inline-block whitespace-nowrap">
                    <span className="relative z-10 text-primary-deep">מחכים לך</span>
                    <span
                      aria-hidden
                      className="absolute -bottom-1 right-0 left-0 h-3 md:h-4 -z-0 rounded-full"
                      style={{ background: "#FED7AA" }}
                    />
                  </span>
                </h2>
                <p className="mt-3 text-ink-soft text-lg font-medium">
                  37 גזעים פופולריים בישראל — לחץ כדי לקרוא הכל
                </p>
              </div>
              <Link
                href="/breeds"
                className="inline-flex items-center gap-2 bg-surface text-ink border-2 border-border-strong px-5 py-2.5 rounded-[16px] shadow-[var(--shadow-clay-sm)] hover:-translate-y-px hover:border-primary-soft transition-all font-display font-extrabold text-sm"
              >
                לכל הגזעים
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
          <Stagger
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5"
            stagger={0.08}
          >
            {featuredBreeds.map((b) => (
              <StaggerItem key={b.slug}>
                <Link
                  href={`/breed/${b.slug}`}
                  className="group relative block rounded-[26px] border-2 border-border bg-surface overflow-hidden shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)] hover:-translate-y-2 hover:border-primary-soft transition-all"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <BreedPhoto
                      breed={b}
                      size={400}
                      rounded="rounded-none"
                      className="!w-full !h-full !rounded-none !border-0 !shadow-none scale-100 group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-4">
                    <div className="font-display font-black text-lg md:text-xl text-ink leading-tight">
                      {b.name}
                    </div>
                    <p className="mt-1 text-sm text-ink-soft font-medium line-clamp-2">
                      {b.tagline}
                    </p>
                    <div className="mt-3 inline-flex items-center gap-1 text-xs text-primary-deep font-display font-extrabold opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all">
                      קרא עוד
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* === Final CTA === */}
      <section className="px-4 py-16 md:py-24">
        <Reveal from="scale">
          <div className="mx-auto max-w-3xl text-center relative rounded-[40px] border-2 border-primary-deep bg-gradient-to-br from-primary-tint via-surface to-accent-tint p-8 md:p-14 shadow-[var(--shadow-clay-xl),var(--shadow-inner-clay)] overflow-hidden">
            <div className="relative">
              <div className="flex justify-center mb-4">
                <div className="bg-surface rounded-full p-3 border-2 border-border-strong shadow-[var(--shadow-clay-lg)]">
                  <DogMascot mood="ball" size={120} />
                </div>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-ink leading-tight">
                מוכן למצוא את החבר הכי טוב שלך?
              </h2>
              <p className="mt-4 text-ink-soft text-lg md:text-xl font-medium max-w-xl mx-auto">
                לחץ כאן כדי להתחיל. ללא הרשמה, ללא תשלום — רק כמה דקות שיכולות לחסוך
                שנים של אי-התאמה.
              </p>
              <MagneticButton className="mt-7">
                <Link
                  href="/quiz"
                  className="group inline-flex items-center gap-2 bg-primary text-white border-2 border-primary-deep px-8 py-4 rounded-[24px] shadow-[var(--shadow-glow-primary)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[var(--shadow-clay-press)] font-display font-extrabold text-xl transition-all"
                >
                  התחל את המשחק
                  <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                </Link>
              </MagneticButton>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="px-4 py-10 text-center text-ink-soft text-sm font-display font-bold border-t-2 border-border/60">
        <p>DoGame · נבנה באהבה לכלבי ישראל ולמשפחות שלהם 🐾</p>
      </footer>
    </main>
  );
}

function Stat({
  number,
  suffix,
  label,
}: {
  number: number;
  suffix?: string;
  label: string;
}) {
  return (
    <div>
      <div className="text-3xl md:text-4xl font-black text-primary-deep font-display leading-none">
        <CountUp to={number} suffix={suffix} />
      </div>
      <div className="mt-1 text-sm text-ink-soft font-display font-bold">{label}</div>
    </div>
  );
}
