import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Sparkles,
  Shield,
  Clock,
  CheckCircle2,
  Star,
} from "lucide-react";
import { DogMascot } from "@/components/quiz/DogMascot";
import { BREEDS } from "@/lib/breeds/data";
import { Pill } from "@/components/ui/Pill";
import { BreedPhoto } from "@/components/breed/BreedPhoto";
import { SiteNav } from "@/components/providers/SiteNav";
import { ScrollStory } from "@/components/landing/ScrollStory";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { CountUp } from "@/components/ui/CountUp";
import { AnimatedHeadline } from "@/components/ui/AnimatedHeadline";
import { FloatingPaws } from "@/components/ui/FloatingPaws";
import { HeroParallax } from "@/components/landing/HeroParallax";

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <SiteNav />

      {/* === Hero === */}
      <section className="px-4 pt-10 pb-20 md:pt-16 md:pb-28 relative overflow-hidden">
        <FloatingPaws count={10} />
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center relative">
          <div className="order-2 md:order-1">
            <Reveal from="up" delay={0.05}>
              <Pill tone="accent" icon={<Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />}>
                משחק חינמי · 100% בעברית
              </Pill>
            </Reveal>

            <div className="mt-5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] text-ink">
              <AnimatedHeadline
                as="h1"
                delay={0.2}
                className="leading-[1.05]"
                words={[
                  { text: "איזה" },
                  { text: "כלב" },
                  { text: "באמת" },
                  { text: "מתאים לך?", accent: true, underline: true },
                ]}
              />
            </div>

            <Reveal from="up" delay={0.7}>
              <p className="mt-6 text-lg md:text-xl text-ink-soft leading-relaxed max-w-prose font-medium">
                ענה על שאלון קצר על סגנון החיים שלך וקבל המלצה אישית
                ל-3-5 גזעים שיתאימו לך בדיוק.{" "}
                <span className="text-ink font-bold">בלי לחץ, בלי תשלום</span> — רק מידע
                מבוסס שיעזור לך לבחור נכון לפני שמביאים כלב הביתה.
              </p>
            </Reveal>

            <Reveal from="up" delay={0.85}>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <MagneticButton>
                  <Link
                    href="/quiz"
                    className="group inline-flex items-center justify-center gap-2 bg-primary text-white border-[3px] border-primary-deep px-7 py-4 rounded-[22px] shadow-[var(--shadow-glow-primary)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[var(--shadow-clay-press)] font-display font-extrabold text-lg transition-all"
                  >
                    בוא נתחיל
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </Link>
                </MagneticButton>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 bg-surface text-ink border-[3px] border-border px-7 py-4 rounded-[22px] font-display font-extrabold text-lg shadow-[var(--shadow-clay)] hover:-translate-y-0.5 hover:border-border-strong active:translate-y-1 transition-all"
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

          {/* Hero mascot with parallax */}
          <HeroParallax className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-10 bg-gradient-to-tr from-primary/30 via-peach/30 to-accent/25 blur-3xl rounded-full animate-blob"
              />
              <div className="relative bg-surface border-[4px] border-border-strong rounded-full p-10 md:p-14 shadow-[var(--shadow-clay-xl),var(--shadow-inner-clay)]">
                <DogMascot mood="smile" size={220} />
              </div>
              <div className="hidden md:flex absolute -top-2 -right-2 z-10 items-center gap-1.5 bg-success text-white border-2 border-success/80 px-3 py-1.5 rounded-full font-display font-extrabold text-sm shadow-[0_3px_0_rgba(20,83,45,0.4)] animate-float-slow">
                <CheckCircle2 className="w-4 h-4" strokeWidth={3} />
                100% חינמי
              </div>
              <div
                className="hidden md:flex absolute -bottom-2 -left-2 z-10 items-center gap-1.5 bg-accent text-white border-2 border-accent-deep px-3 py-1.5 rounded-full font-display font-extrabold text-sm shadow-[0_3px_0_var(--color-accent-deep)] animate-float-slow"
                style={{ animationDelay: "1s" }}
              >
                <Star className="w-4 h-4 fill-current" strokeWidth={0} />
                3-5 גזעים
              </div>
            </div>
          </HeroParallax>
        </div>
      </section>

      {/* === Stats strip === */}
      <section className="px-4 pb-12 -mt-8 md:-mt-12 relative z-10">
        <div className="mx-auto max-w-4xl">
          <Reveal from="up">
            <div className="rounded-[24px] border-[3px] border-border bg-surface px-6 py-5 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)] flex flex-wrap items-center justify-around gap-6 text-center">
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
      <ScrollStory />

      {/* === Why (3 cards) === */}
      <section className="px-4 py-16 md:py-24 bg-bg-soft border-y-[3px] border-border relative overflow-hidden">
        <FloatingPaws count={6} />
        <div className="mx-auto max-w-6xl relative">
          <Reveal from="up">
            <div className="text-center mb-12">
              <Pill tone="primary">✨ הגישה שלנו</Pill>
              <h2 className="mt-4 text-3xl md:text-5xl font-black text-ink">
                למה DoGame עובד?
              </h2>
              <p className="mt-4 text-ink-soft text-lg md:text-xl max-w-2xl mx-auto font-medium">
                שלושה עקרונות שמובילים את ההמלצה — מבוססת על מאפיינים אמיתיים, לא על
                "מי הכי חמוד".
              </p>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-5" stagger={0.12}>
            {[
              {
                Icon: Heart,
                title: "אחריות לפני אהבה",
                text:
                  "כלב הוא 10-15 שנות התחייבות. השאלון עוזר לך להבין אם זה הזמן הנכון, ואיזה גזע באמת יתאים.",
                tone: "primary" as const,
              },
              {
                Icon: Sparkles,
                title: "מאפיינים אמיתיים",
                text:
                  "10 צירי תכונות (גודל, אנרגיה, אילוף, אקלים) — לא רק 'איזה כלב הכי חמוד'.",
                tone: "accent" as const,
              },
              {
                Icon: Shield,
                title: "מותאם לישראל",
                text:
                  "השאלון מתחשב בחום הישראלי, מגורים בדירה, ואפילו בגזע הלאומי שלנו (כלב כנעני).",
                tone: "primary" as const,
              },
            ].map(({ Icon, title, text, tone }) => (
              <StaggerItem
                key={title}
                className="rounded-[28px] border-[3px] border-border bg-surface p-7 text-center shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)] hover:-translate-y-1 transition-transform"
              >
                <div
                  className={
                    "inline-flex items-center justify-center w-16 h-16 rounded-[20px] border-[3px] mb-4 shadow-[inset_0_2px_0_rgba(255,255,255,0.5),0_3px_0_var(--color-primary-deep)] " +
                    (tone === "accent"
                      ? "bg-accent text-white border-accent-deep"
                      : "bg-primary text-white border-primary-deep")
                  }
                >
                  <Icon className="w-7 h-7" strokeWidth={2.5} />
                </div>
                <h3 className="font-display font-black text-xl text-ink">{title}</h3>
                <p className="mt-2 text-ink-soft leading-relaxed font-medium">{text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* === How it works === */}
      <section className="px-4 py-16 md:py-24 relative overflow-hidden">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="text-center mb-12">
              <Pill tone="accent">🎯 פשוט וקל</Pill>
              <h2 className="mt-4 text-3xl md:text-5xl font-black text-ink">איך זה עובד?</h2>
              <p className="mt-4 text-ink-soft text-lg md:text-xl">שלוש דקות. שלושה שלבים.</p>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6" stagger={0.15}>
            {[
              {
                num: "1",
                title: "ענה על שאלון קצר",
                text:
                  "שאלות על המגורים שלך, רמת הפעילות, ניסיון קודם וההעדפות. השאלון מסתגל לתשובות שלך.",
              },
              {
                num: "2",
                title: "האלגוריתם עובד",
                text:
                  "10 צירי תכונות, כללי סינון חכמים, חישוב התאמה משוקלל מול 37 גזעים פופולריים.",
              },
              {
                num: "3",
                title: "קבל המלצה אישית",
                text:
                  "3-5 גזעים מתאימים עם אחוז התאמה, חוזקות, נקודות לתשומת לב, ומדריך טיפול.",
              },
            ].map(({ num, title, text }) => (
              <StaggerItem key={num} className="relative">
                <div className="relative rounded-[28px] border-[3px] border-border bg-surface p-6 pt-8 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)] hover:-translate-y-1 transition-transform h-full">
                  <div
                    aria-hidden
                    className="absolute -top-5 -right-3 w-16 h-16 inline-flex items-center justify-center rounded-[18px] bg-primary text-white border-[3px] border-primary-deep font-display font-black text-3xl shadow-[0_4px_0_var(--color-primary-deep)]"
                  >
                    {num}
                  </div>
                  <h3 className="font-display font-black text-xl text-ink mb-2 mt-4">
                    {title}
                  </h3>
                  <p className="text-ink-soft leading-relaxed font-medium">{text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* === Featured breeds === */}
      <section className="px-4 py-16 md:py-24 bg-bg-soft border-y-[3px] border-border">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
              <div>
                <Pill tone="primary">🐶 הכירו</Pill>
                <h2 className="mt-3 text-3xl md:text-5xl font-black text-ink">
                  כמה מהגזעים במאגר
                </h2>
                <p className="mt-2 text-ink-soft font-medium">37 גזעים פופולריים בישראל</p>
              </div>
              <Link
                href="/breeds"
                className="inline-flex items-center gap-1 text-primary-deep hover:text-primary font-display font-extrabold transition-colors"
              >
                לראות את כל הגזעים
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
          <Stagger
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            stagger={0.06}
          >
            {featuredBreeds.map((b) => (
              <StaggerItem key={b.slug}>
                <Link
                  href={`/breed/${b.slug}`}
                  className="group block rounded-[22px] border-[3px] border-border bg-surface p-3 text-center shadow-[var(--shadow-clay),var(--shadow-inner-clay)] hover:-translate-y-1 hover:border-border-strong transition-all"
                >
                  <div className="flex justify-center mb-2.5 group-hover:scale-105 transition-transform">
                    <BreedPhoto breed={b} size={96} rounded="rounded-[18px]" />
                  </div>
                  <div className="font-display font-extrabold text-sm text-ink leading-tight">
                    {b.name}
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
          <div className="mx-auto max-w-3xl text-center relative rounded-[40px] border-[4px] border-primary-deep bg-gradient-to-br from-primary-tint via-surface to-accent-tint p-8 md:p-14 shadow-[var(--shadow-clay-xl),var(--shadow-inner-clay)] overflow-hidden">
            <FloatingPaws count={6} />
            <div className="relative">
              <div className="flex justify-center mb-4">
                <div className="bg-surface rounded-full p-3 border-[3px] border-border-strong shadow-[var(--shadow-clay-lg)]">
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
                  className="group inline-flex items-center gap-2 bg-primary text-white border-[3px] border-primary-deep px-8 py-4 rounded-[24px] shadow-[var(--shadow-glow-primary)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[var(--shadow-clay-press)] font-display font-extrabold text-xl transition-all"
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
