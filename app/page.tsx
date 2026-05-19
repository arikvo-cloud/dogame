import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DogMascot } from "@/components/quiz/DogMascot";
import { BREEDS } from "@/lib/breeds/data";
import { AdoptionStatBanner } from "@/components/landing/AdoptionStatBanner";
import { ADOPTABLE_DOGS } from "@/lib/dogs/data";
import { dogsOfTheWeek } from "@/lib/dogs/helpers";
import { SHELTERS } from "@/lib/shelters/data";
import { DogCard } from "@/components/dogs/DogCard";
import { ShelterCard } from "@/components/shelters/ShelterCard";
import { BreedPhoto } from "@/components/breed/BreedPhoto";
import { SiteNav } from "@/components/providers/SiteNav";
import { AuroraBackground } from "@/components/providers/AuroraBackground";
import { ScrollStory } from "@/components/landing/ScrollStory";
import { Testimonials } from "@/components/landing/Testimonials";
import { BreedMarquee } from "@/components/landing/BreedMarquee";
import { HeroPhotoFeature } from "@/components/landing/HeroPhotoFeature";
import { BlobDivider } from "@/components/landing/BlobDivider";
import { LazyMount } from "@/components/ui/LazyMount";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { CountUp } from "@/components/ui/CountUp";
import { IssueMark } from "@/components/ui/IssueMark";
import { SectionMark } from "@/components/ui/SectionMark";

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
  const [hero, ...rest] = BREEDS.slice(0, 4);
  const featuredHero = hero;
  const featuredRest = rest;

  return (
    <main id="main" className="bg-clay">
      <AuroraBackground />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <SiteNav />

      {/* === Editorial masthead === */}
      <div className="px-4 pt-6 md:pt-8 relative">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-4">
          <IssueMark
            issue="042"
            edition="מאי 2026"
            volume="מהדורה ישראלית"
          />
          <span className="hidden md:block text-[10px] uppercase tracking-[0.24em] font-display font-bold text-ink-mute">
            המדריך המאויר לבחירת כלב
          </span>
        </div>
        <hr className="magazine-rule mx-auto max-w-6xl mt-4" />
      </div>

      {/* === Hero — feature spread === */}
      <section className="px-4 pt-8 pb-14 md:pt-12 md:pb-20 relative">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-14 items-start">
          {/* Text column — 7/12 on desktop for editorial weight */}
          <div className="md:col-span-7 order-1">
            <AdoptionStatBanner />
          </div>

          {/* Photo column — 5/12 on desktop, with editorial caption */}
          <div className="w-full md:col-span-5 order-2" data-paw-zone>
            <HeroPhotoFeature />
            <div className="mt-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] font-display font-bold text-ink-mute">
              <span className="block h-px flex-1 bg-ink-mute opacity-40" />
              <span>החליקו לתמונה הבאה</span>
            </div>
          </div>
        </div>
      </section>

      {/* === Auto-scrolling breed marquee === */}
      <BreedMarquee />

      {/* === Editorial dek (replaces stats strip) === */}
      <section className="px-4 py-10 md:py-14 relative">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal from="up">
            <p className="pull-quote">
              לא לפי &ldquo;מי הכי חמוד&rdquo; — אלא לפי מה שמתאים לחיים שלכם
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-mute font-display font-bold tabular-nums">
              <span>
                <CountUp to={37} suffix="+ גזעים" />
              </span>
              <span aria-hidden className="text-ink-faint">·</span>
              <span>10 צירי תכונות</span>
              <span aria-hidden className="text-ink-faint">·</span>
              <span>5 חוקי סינון</span>
              <span aria-hidden className="text-ink-faint">·</span>
              <span>3–5 דקות</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* === Adoptable dogs of the week === */}
      <section className="px-4 py-12 md:py-16 relative">
        <div className="mx-auto max-w-6xl">
          <Reveal from="up">
            <div className="flex items-end justify-between mb-8 md:mb-10 flex-wrap gap-4">
              <div>
                <SectionMark numeral="01" label="הכלבים השבוע" />
                <h2 className="mt-4 text-3xl md:text-5xl font-extrabold font-display text-ink leading-[1.02] tracking-tight">
                  8 כלבים שמחכים{" "}
                  <span className="italic text-primary-deep font-medium">לבית</span>
                </h2>
              </div>
              <Link href="/adopt" data-paw-zone className="inline-flex items-center gap-2 text-ink font-display font-extrabold text-sm underline underline-offset-4 decoration-ink-mute/40 hover:decoration-primary transition-colors">
                כל הכלבים ({ADOPTABLE_DOGS.length})
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dogsOfTheWeek(8).map((d) => <DogCard key={d.id} dog={d} compact />)}
          </div>
        </div>
      </section>

      <BlobDivider tone="warm" />

      {/* === Pinned scroll story (kept — strong differentiator) === */}
      <LazyMount rootMargin="400px" minHeight="100dvh">
        <ScrollStory />
      </LazyMount>

      {/* === Why — asymmetric editorial spread === */}
      <section className="px-4 py-16 md:py-24 relative bg-bg-soft">
        <div className="mx-auto max-w-6xl">
          <Reveal from="up">
            <SectionMark numeral="01" label="הגישה שלנו" />
            <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-ink leading-[1.02] tracking-tight max-w-3xl">
              שלושה עקרונות שמובילים{" "}
              <span className="italic text-primary-deep font-medium">כל המלצה</span>
            </h2>
            <p className="mt-5 text-ink-soft text-lg md:text-xl font-medium max-w-prose">
              אנחנו לא מנחשים. כל גזע נמדד מול הסגנון שלך
              ב-10 מימדים — חינוך, אנרגיה, אקלים, רגישות לילדים — וכל
              אלה משוקללים לפני שמדבר על התאמה.
            </p>
          </Reveal>

          {/* Asymmetric grid: 1 large feature + 2 stacked smaller */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-px bg-border md:rounded-[28px] overflow-hidden md:border-2 md:border-border">
            <Reveal from="up" delay={0.1} className="md:col-span-2">
              <WhyCard
                num="01"
                title="אחריות לפני אהבה"
                text="כלב הוא 10–15 שנות התחייבות. השאלון עוזר לכם להבין אם זה הזמן הנכון, ואיזה גזע באמת יתאים — לפני שמביאים כלב הביתה."
                large
              />
            </Reveal>
            <div className="flex flex-col gap-px bg-border">
              <Reveal from="up" delay={0.2}>
                <WhyCard
                  num="02"
                  title="מאפיינים אמיתיים"
                  text="10 צירי תכונות — גודל, אנרגיה, אילוף, אקלים — לא רק 'מי הכי חמוד'."
                />
              </Reveal>
              <Reveal from="up" delay={0.3}>
                <WhyCard
                  num="03"
                  title="מותאם לישראל"
                  text="חום, מגורים בדירה, ואפילו הכלב הכנעני — הגזע הלאומי שלנו."
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <BlobDivider tone="warm" flip />

      {/* === How it works — oversized serif stepper === */}
      <section className="px-4 py-16 md:py-24 relative">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionMark numeral="02" label="התהליך" />
            <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-ink leading-[1.02] tracking-tight">
              שלושה שלבים —{" "}
              <span className="italic text-primary-deep font-medium">שלוש דקות</span>
            </h2>
          </Reveal>

          <Stagger className="mt-14 divide-y divide-border" stagger={0.12}>
            {[
              {
                num: "01",
                title: "עונים על שאלון קצר",
                text: "שאלות על המגורים שלכם, רמת הפעילות, ניסיון קודם וההעדפות. השאלון מסתגל לתשובות שלכם בזמן אמת.",
              },
              {
                num: "02",
                title: "האלגוריתם עובד",
                text: "10 צירי תכונות, חוקי סינון חכמים, חישוב משוקלל מול 37 גזעים פופולריים בישראל.",
              },
              {
                num: "03",
                title: "מקבלים המלצה אישית",
                text: "3–5 גזעים מתאימים עם אחוז התאמה, חוזקות, נקודות לתשומת לב, ומדריך טיפול מפורט.",
              },
            ].map(({ num, title, text }) => (
              <StaggerItem
                key={num}
                className="grid grid-cols-[auto_1fr] gap-6 md:gap-12 items-baseline py-8 md:py-12"
              >
                <div className="serif-numeral text-[clamp(4.5rem,11vw,9rem)] text-primary-deep/15">
                  {num}
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-2xl md:text-4xl text-ink leading-tight tracking-tight">
                    {title}
                  </h3>
                  <p className="mt-4 text-ink-soft text-base md:text-lg leading-relaxed font-medium max-w-2xl">
                    {text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <BlobDivider tone="primary" />

      {/* === Testimonials === */}
      <LazyMount rootMargin="200px" minHeight={500}>
        <Testimonials />
      </LazyMount>

      {/* === Featured breeds — magazine spread (1 hero + 5 supporting) === */}
      <section className="px-4 py-16 md:py-24 relative">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex items-end justify-between mb-10 md:mb-14 flex-wrap gap-4">
              <div>
                <SectionMark numeral="03" label="הגזעים" />
                <h2 className="mt-5 text-4xl md:text-6xl font-extrabold font-display text-ink leading-[1.02] tracking-tight">
                  מי שכבר{" "}
                  <span className="italic text-primary-deep font-medium">
                    מחכה לכם
                  </span>
                </h2>
                <p className="mt-4 text-ink-soft text-lg font-medium max-w-prose">
                  37 גזעים פופולריים בישראל — כל אחד עם פרופיל מלא.
                </p>
              </div>
              <Link
                href="/breeds"
                data-paw-zone
                className="inline-flex items-center gap-2 text-ink font-display font-extrabold text-sm underline underline-offset-4 decoration-ink-mute/40 hover:decoration-primary transition-colors"
              >
                לכל הגזעים
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>

          {/* Magazine layout: 1 hero card (col-span-2 on desktop) + 5 supporting.
              fit="contain" lets the whole dog be visible against its accent-tinted bg. */}
          <Stagger className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5" stagger={0.08}>
            <StaggerItem className="col-span-2 md:row-span-2">
              <Link
                href={`/breed/${featuredHero.slug}`}
                data-paw-zone
                className="group relative flex flex-col h-full rounded-[28px] border-2 border-border bg-surface overflow-hidden shadow-[var(--shadow-clay-xl),var(--shadow-inner-clay)] lift-on-hover hover:border-primary-soft"
              >
                <div className="relative aspect-[4/3] md:aspect-[5/4] overflow-hidden">
                  <BreedPhoto
                    breed={featuredHero}
                    size={900}
                    rounded="rounded-none"
                    fit="contain"
                    className="!w-full !h-full !rounded-none !border-0 !shadow-none transition-transform duration-[900ms] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  <SectionMark numeral="N°1" label="המומלץ השבוע" />
                  <div className="mt-3 font-display font-extrabold text-2xl md:text-4xl text-ink leading-tight tracking-tight">
                    {featuredHero.name}
                  </div>
                  <p className="mt-3 text-base md:text-lg text-ink-soft font-medium leading-relaxed line-clamp-3 max-w-prose">
                    {featuredHero.tagline}
                  </p>
                  <div className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm text-primary-deep font-display font-extrabold">
                    קראו את הפרופיל המלא
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </StaggerItem>

            {featuredRest.map((b) => (
              <StaggerItem key={b.slug}>
                <Link
                  href={`/breed/${b.slug}`}
                  data-paw-zone
                  className="group relative flex flex-col h-full rounded-[22px] border-2 border-border bg-surface overflow-hidden shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)] lift-on-hover hover:border-primary-soft"
                >
                  <div className="relative aspect-[5/4] overflow-hidden">
                    <BreedPhoto
                      breed={b}
                      size={400}
                      rounded="rounded-none"
                      fit="contain"
                      className="!w-full !h-full !rounded-none !border-0 !shadow-none transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="font-display font-extrabold text-base md:text-lg text-ink leading-tight">
                      {b.name}
                    </div>
                    <p className="mt-1 text-xs md:text-sm text-ink-soft font-medium line-clamp-2">
                      {b.tagline}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* === Why adoption matters === */}
      <section className="px-4 py-14 md:py-20 relative">
        <div className="mx-auto max-w-5xl">
          <Reveal from="up">
            <SectionMark numeral="04" label="למה אימוץ" />
            <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-ink leading-[1.02] tracking-tight max-w-3xl">
              אימוץ כלב הוא{" "}
              <span className="italic text-primary-deep font-medium">החלטה אתית</span>{" "}
              — וגם החלטה חכמה.
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-px bg-border md:rounded-[24px] overflow-hidden md:border-2 md:border-border">
            <Stat3 num="1/3" label="מהכלבים חוזרים למקלט בשנה הראשונה — בחירה נכונה משנה זאת" />
            <Stat3 num="0₪" label="אימוץ זול משמעותית מקנייה. רק עלות חיסונים ועיקור" />
            <Stat3 num="60%" label="מהכלבים בישראל הם תערובות — בריאות, חכמות, ייחודיות" />
          </div>
          <p className="mt-3 text-xs text-ink-mute italic">* נתונים מקורבים. ראו /about-adoption להרחבה.</p>
        </div>
      </section>

      {/* === Shelters across Israel === */}
      <section className="px-4 py-14 md:py-20 relative">
        <div className="mx-auto max-w-6xl">
          <Reveal from="up">
            <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
              <div>
                <SectionMark numeral="05" label="המקלטים" />
                <h2 className="mt-4 text-3xl md:text-5xl font-extrabold font-display text-ink leading-[1.02] tracking-tight">
                  איפה{" "}
                  <span className="italic text-primary-deep font-medium">מאמצים</span>
                </h2>
              </div>
              <Link href="/shelters" data-paw-zone className="inline-flex items-center gap-2 text-ink font-display font-extrabold text-sm underline underline-offset-4 decoration-ink-mute/40 hover:decoration-primary transition-colors">
                לכל המקלטים
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SHELTERS.slice(0, 3).map((s) => <ShelterCard key={s.id} shelter={s} />)}
          </div>
        </div>
      </section>

      <BlobDivider tone="warm" />

      {/* === Final CTA — magazine call-out === */}
      <section className="px-4 py-20 md:py-28">
        <Reveal from="up">
          <div className="mx-auto max-w-4xl text-center relative">
            <div className="flex justify-center mb-6">
              <div className="bg-surface rounded-full p-3 border-2 border-border-strong shadow-[var(--shadow-clay-lg)]">
                <DogMascot mood="ball" size={120} />
              </div>
            </div>
            <SectionMark numeral="06" label="המסקנה" className="justify-center" />
            <h2 className="mt-5 text-5xl md:text-7xl lg:text-8xl font-extrabold font-display text-ink leading-[0.95] tracking-tight max-w-3xl mx-auto">
              מוכנים{" "}
              <span className="italic text-primary-deep font-medium">לאמץ</span>?
            </h2>
            <p className="mt-6 text-ink-soft text-lg md:text-xl font-medium max-w-xl mx-auto">
              כמה דקות. בלי הרשמה. מאות כלבים מחכים לבית ברגע זה.
            </p>
            <MagneticButton className="mt-9">
              <Link
                href="/adopt"
                data-paw-zone
                className="group inline-flex items-center gap-2 bg-primary text-white border-2 border-primary-deep px-9 py-5 rounded-[24px] shadow-[var(--shadow-glow-primary)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[var(--shadow-clay-press)] font-display font-extrabold text-xl transition-all"
              >
                מצאו כלב לאמץ
                <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </MagneticButton>
          </div>
        </Reveal>
      </section>

      <footer className="px-4 py-10 text-center text-ink-soft text-sm font-display font-bold border-t border-border/60">
        <hr className="magazine-rule mx-auto max-w-6xl mb-6" />
        <p>DoGame · נבנה באהבה לכלבי ישראל ולמשפחות שלהם</p>
      </footer>
    </main>
  );
}

function Stat3({ num, label }: { num: string; label: string }) {
  return (
    <div className="bg-surface p-7 text-center">
      <div className="serif-numeral text-[clamp(3rem,6vw,4.5rem)] text-primary-deep tabular-nums">{num}</div>
      <div className="mt-3 text-sm text-ink-soft font-display font-bold leading-snug">{label}</div>
    </div>
  );
}

function WhyCard({
  num,
  title,
  text,
  large = false,
}: {
  num: string;
  title: string;
  text: string;
  large?: boolean;
}) {
  return (
    <div
      className={`bg-surface h-full p-7 md:p-10 group ${
        large ? "md:py-14" : ""
      }`}
    >
      <div
        className={`serif-numeral text-primary-deep/25 ${
          large ? "text-[clamp(5rem,9vw,8rem)]" : "text-[clamp(3rem,5vw,5rem)]"
        }`}
      >
        {num}
      </div>
      <h3
        className={`mt-5 font-display font-extrabold text-ink leading-tight tracking-tight ${
          large ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
        }`}
      >
        {title}
      </h3>
      <p
        className={`mt-4 text-ink-soft leading-relaxed font-medium ${
          large ? "text-base md:text-lg max-w-md" : "text-sm md:text-base"
        }`}
      >
        {text}
      </p>
    </div>
  );
}
