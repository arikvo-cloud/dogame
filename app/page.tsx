import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { BREEDS } from "@/lib/breeds/data";
import { BreedPhoto } from "@/components/breed/BreedPhoto";
import { SiteNav } from "@/components/providers/SiteNav";
import { proxyImage } from "@/lib/image-proxy";
import { BrutMarquee } from "@/components/landing/BrutMarquee";
import { HeroHeadline } from "@/components/landing/HeroHeadline";
import { BrutCounter } from "@/components/landing/BrutCounter";
import { CursorLabel } from "@/components/landing/CursorLabel";
import { WipeMask } from "@/components/landing/WipeMask";

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
  ],
};

export default function HomePage() {
  const featured = BREEDS.slice(0, 12);
  const hero = featured[0];

  return (
    <main id="main" className="bg-white text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <WipeMask />
      <CursorLabel />
      <SiteNav />

      {/* === MASTHEAD BAR — black band with mono meta === */}
      <div className="border-b-2 border-black bg-black text-white brut-scan">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-1.5 font-mono uppercase text-[10px] tracking-[0.18em]">
          <span>ISSUE / 042 · מאי 2026</span>
          <span className="hidden sm:inline">{BREEDS.length} BREEDS / 4 REGIONS / 1 GOAL</span>
          <span className="text-[color:var(--color-primary)] animate-blink">● LIVE</span>
        </div>
      </div>

      {/* === NEWS TICKER === */}
      <BrutMarquee
        items={[
          "איזה כלב מתאים לך?",
          `${BREEDS.length} גזעים זמינים`,
          "שאלון של 3–5 דקות",
          "ללא הרשמה · ללא תשלום",
          "המתודולוגיה: 10 צירי תכונות",
          "מותאם לאקלים הישראלי",
          "הכנעני · הגזע הלאומי",
          "מסקר ועד תוצאה — שלוש דקות",
        ]}
      />

      {/* === HERO — asymmetric, no center alignment === */}
      <section className="border-b-2 border-black">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-8 md:border-l-2 md:border-black p-5 md:p-10 flex flex-col justify-between min-h-[60vh] md:min-h-[80vh]">
            <div>
              <div className="font-mono uppercase text-xs tracking-[0.18em] inline-flex items-center gap-2">
                <span className="w-3 h-3 bg-black inline-block" />
                <span>הפרק.</span>
                <span className="opacity-60">/ 01</span>
              </div>
              <HeroHeadline
                words={[
                  { text: "איזה" },
                  { text: "כלב" },
                  { text: "מתאים", highlight: true },
                  { text: "לך?" },
                ]}
              />
              <p className="mt-8 font-mono text-base md:text-lg leading-relaxed max-w-2xl text-black">
                שאלון של 3–5 דקות. ללא הרשמה. ללא תשלום.
                האלגוריתם משווה את התשובות שלך מול {BREEDS.length} גזעים — ומחזיר 3 התאמות אישיות.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3 items-center">
              <Link href="/quiz" className="brut-btn brut-btn-alarm text-base">
                התחל את השאלון ▶
              </Link>
              <Link href="/breeds" className="brut-btn brut-btn-ghost text-base">
                ←  או דפדף בגזעים
              </Link>
            </div>
          </div>

          <div className="md:col-span-4 border-t-2 md:border-t-0 md:border-l-2 border-black relative bg-[#F5F5F5]">
            <div className="relative aspect-[4/5] md:aspect-auto md:h-full">
              {hero.imageUrl && (
                <Image
                  src={proxyImage(hero.imageUrl, { w: 700, h: 875, fit: "contain" })}
                  alt={`תמונה של ${hero.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain"
                  priority
                  unoptimized
                />
              )}
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-white border-t-2 border-black px-4 py-2.5 flex items-center justify-between">
              <Link
                href={`/breed/${hero.slug}`}
                className="font-display font-black text-xl text-black hover:underline"
              >
                {hero.name}
              </Link>
              <span className="font-mono uppercase text-[10px] tracking-[0.12em] opacity-70">
                לדוגמה
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* === STATS STRIP === */}
      <section className="border-b-2 border-black">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4">
          <StatBrut label="גזעים" to={BREEDS.length} padTo={2} />
          <StatBrut label="צירי תכונות" to={10} padTo={2} border />
          <StatBrut label="חוקי סינון" to={5} padTo={2} border />
          <StatBrut label="דקות בלבד" fixed="3–5" border accent />
        </div>
      </section>

      {/* === FEATURED GRID === */}
      <section className="border-b-2 border-black">
        <div className="mx-auto max-w-7xl px-4 md:px-10 py-8 md:py-14">
          <div className="flex items-baseline justify-between border-b-2 border-black pb-3 mb-6">
            <h2 className="font-display font-black text-3xl md:text-5xl tracking-[-0.04em]">
              הגזעים
            </h2>
            <Link
              href="/breeds"
              className="font-mono uppercase text-xs tracking-[0.14em] hover:underline inline-flex items-center gap-2"
            >
              לכל ה-{BREEDS.length} <ArrowLeft className="w-3 h-3" strokeWidth={3} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-0 border-2 border-black divide-x-2 divide-y-2 divide-black">
            {featured.map((b, i) => (
              <Link
                key={b.slug}
                href={`/breed/${b.slug}`}
                data-cursor-label="VIEW"
                className="group block relative bg-white brut-cell"
              >
                <div className="aspect-square relative overflow-hidden">
                  <BreedPhoto
                    breed={b}
                    size={300}
                    rounded="rounded-none"
                    className="!w-full !h-full !border-0"
                  />
                </div>
                <div className="border-t-2 border-black px-3 py-2 bg-white group-hover:bg-[color:var(--color-primary)] group-hover:text-white brut-cell">
                  <div className="font-display font-black text-sm md:text-base leading-tight truncate">
                    {b.name}
                  </div>
                  <div className="font-mono uppercase text-[9px] tracking-[0.12em] opacity-70 truncate">
                    {String(i + 1).padStart(2, "0")} / {b.nameEn}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === BIG TYPE — single-statement section === */}
      <section className="border-b-2 border-black bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 md:px-10 py-14 md:py-24">
          <p className="font-display font-black leading-[0.9] tracking-[-0.04em] text-[clamp(2.5rem,7vw,6.5rem)]">
            לא לפי{" "}
            <span className="inline-block bg-white text-black px-3">
              מי הכי חמוד.
            </span>{" "}
            לפי מה שמתאים{" "}
            <span className="text-[color:var(--color-primary)]">לחיים שלך</span>.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <div className="h-[2px] flex-1 bg-white" />
            <span className="font-mono uppercase text-[11px] tracking-[0.16em]">
              N°042 · המתודולוגיה
            </span>
            <div className="h-[2px] flex-1 bg-white" />
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-white divide-y-2 md:divide-y-0 md:divide-x-2 divide-white">
            <MethodCell num="01" title="אחריות לפני אהבה" text="10–15 שנים. החלטה גדולה. השאלון עוזר להבין אם זה הזמן הנכון." />
            <MethodCell num="02" title="מאפיינים אמיתיים" text="10 צירי תכונות — גודל, אנרגיה, אילוף, אקלים. לא 'מי הכי חמוד'." />
            <MethodCell num="03" title="מותאם לישראל" text="חום, מגורים בדירה, ואפילו הכנעני — הגזע הלאומי שלנו." />
          </div>
        </div>
      </section>

      {/* === FINAL CTA === */}
      <section className="border-b-2 border-black bg-[color:var(--color-acid)]">
        <div className="mx-auto max-w-7xl px-4 md:px-10 py-16 md:py-24 text-center">
          <h2 className="font-display font-black leading-[0.85] tracking-[-0.04em] text-[clamp(3rem,10vw,8rem)]">
            דקות. לא שעות.
          </h2>
          <p className="mt-6 font-mono uppercase text-xs md:text-sm tracking-[0.16em]">
            3–5 דקות · ללא הרשמה · ללא תשלום
          </p>
          <Link
            href="/quiz"
            className="brut-btn brut-btn-alarm mt-10 text-xl md:text-2xl py-5 px-10"
          >
            התחל את השאלון ▶
          </Link>
        </div>
      </section>

      <footer className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-3 font-mono uppercase text-[11px] tracking-[0.14em]">
          <span>© 2026 DoGame · ISRAEL</span>
          <span className="text-[color:var(--color-primary)]">● BUILD 042</span>
        </div>
      </footer>
    </main>
  );
}

function StatBrut({
  label,
  to,
  padTo,
  fixed,
  border,
  accent,
}: {
  label: string;
  to?: number;
  padTo?: number;
  fixed?: string;
  border?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={
        "p-5 md:p-8 " +
        (border ? "md:border-l-2 md:border-black " : "") +
        (accent ? "bg-[color:var(--color-acid)] " : "bg-white ")
      }
    >
      <div className="font-mono uppercase text-[10px] tracking-[0.16em] opacity-70">
        {label}
      </div>
      <div className="mt-2 font-display font-black text-5xl md:text-7xl leading-none tabular-nums tracking-[-0.04em] brut-counter">
        <BrutCounter to={to} padTo={padTo} fixed={fixed} />
      </div>
    </div>
  );
}

function MethodCell({
  num,
  title,
  text,
}: {
  num: string;
  title: string;
  text: string;
}) {
  return (
    <div className="p-6 md:p-8">
      <div className="font-mono uppercase text-[11px] tracking-[0.18em] text-[color:var(--color-primary)]">
        {num}
      </div>
      <h3 className="mt-3 font-display font-black text-2xl md:text-3xl leading-tight">
        {title}
      </h3>
      <p className="mt-3 font-mono text-sm md:text-base leading-relaxed">
        {text}
      </p>
    </div>
  );
}
