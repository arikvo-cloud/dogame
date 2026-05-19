"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Heart, Zap, Sun, Users, ArrowLeft } from "lucide-react";
import { BREEDS } from "@/lib/breeds/data";
import { SiteNav } from "@/components/providers/SiteNav";
import { proxyImage } from "@/lib/image-proxy";

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

const FEATURED_COUNT = 6;
const STORY_BREED_INDEX = 3;

const BENEFITS = [
  {
    icon: Zap,
    title: "גודל ואנרגיה",
    body: "כלב קטן בדירה או גדול עם ריצות? נמצא את ההתאמה הנכונה לאורח החיים שלך.",
  },
  {
    icon: Sun,
    title: "התאמה לאקלים",
    body: "מגיע לישראל — השאלון מתחשב בחום, בלחות ובעונות השנה.",
  },
  {
    icon: Users,
    title: "אופי משפחתי",
    body: "ילדים, חתולים, שכנים? בוחנים את טמפרמנט הגזע לפני שמביאים הביתה.",
  },
];

// spring easing for motion/react — `as const` keeps `type` as a string literal
const springTransition = { type: "spring", stiffness: 260, damping: 28 } as const;

// Fade-up reveal, used throughout
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const featured = BREEDS.slice(0, FEATURED_COUNT);
  const storyBreed = BREEDS[STORY_BREED_INDEX];

  return (
    <main id="main" className="bg-[var(--color-bg)] text-[var(--color-ink)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />

      <SiteNav />

      {/* ======================================================
          HERO — single column, large type, gradient word
      ====================================================== */}
      <section className="relative overflow-hidden">
        {/* Soft radial purple-pink hero glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 gradient-hero-radial"
        />

        <div className="relative mx-auto max-w-3xl px-5 pt-20 pb-16 text-center">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ ...springTransition, delay: 0.05 }}
            className="font-display font-bold text-[clamp(2.6rem,6vw,5rem)] leading-[1.08] tracking-[-0.025em]"
          >
            איזה כלב{" "}
            <span className="gradient-brand-text">מתאים</span>{" "}
            לך?
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ ...springTransition, delay: 0.12 }}
            className="mt-5 text-[clamp(1rem,2.5vw,1.2rem)] text-[var(--color-ink-mute)] leading-[1.6] max-w-xl mx-auto"
          >
            שאלון של 3–5 דקות שמשווה את סגנון החיים שלך מול{" "}
            <strong className="text-[var(--color-ink)] font-semibold">
              {BREEDS.length} גזעים
            </strong>{" "}
            ומחזיר לך 3 התאמות אישיות.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ ...springTransition, delay: 0.20 }}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link href="/quiz" className="btn-primary text-base px-8 py-4">
              התחל את השאלון ←
            </Link>
            <Link href="/breeds" className="btn-ghost text-base px-6 py-4">
              דפדף בגזעים
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ ...springTransition, delay: 0.28 }}
            className="mt-5 text-sm text-[var(--color-ink-faint)] tracking-wide"
          >
            5 דקות · ללא הרשמה · ללא תשלום
          </motion.p>
        </div>
      </section>

      {/* ======================================================
          STORY SECTION 1 — "המסע שלך מתחיל כאן"
      ====================================================== */}
      <section className="mx-auto max-w-5xl px-5 py-16 md:py-24">
        <div className="bg-[var(--color-muted)] rounded-[20px] overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0 border border-[var(--color-border)]"
          style={{ boxShadow: "var(--shadow-clay-lg)" }}
        >
          {/* Text side */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
            variants={fadeUp}
            transition={{ ...springTransition, delay: 0.05 }}
            className="p-8 md:p-12 flex flex-col justify-center"
          >
            <span
              className="inline-block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)] mb-4"
              style={{ fontFamily: "var(--font-jakarta), sans-serif" }}
            >
              הסיפור שלך
            </span>
            <h2 className="font-display font-bold text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.12] tracking-[-0.02em] mb-4">
              המסע שלך{" "}
              <span className="gradient-brand-text">מתחיל כאן</span>
            </h2>
            <p className="text-base text-[var(--color-ink-soft)] leading-[1.65] max-w-sm">
              לפני שמביאים כלב הביתה, שווה להבין מה באמת מתאים לחיים שלך — לא רק מי הכי חמוד. השאלון עוזר לך לחשוב נכון.
            </p>
          </motion.div>

          {/* Breed photo side */}
          {storyBreed?.imageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
              transition={{ ...springTransition, delay: 0.14 }}
              className="relative aspect-[4/3] md:aspect-auto md:min-h-[360px] bg-[var(--color-surface)]"
            >
              <Image
                src={proxyImage(storyBreed.imageUrl, { w: 800, h: 600, fit: "contain" })}
                alt={`תמונה של ${storyBreed.name}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-4 md:p-6"
                unoptimized
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* ======================================================
          STORY SECTION 2 — "מה הופך כלב למתאים?" (3 benefits)
      ====================================================== */}
      <section className="mx-auto max-w-5xl px-5 pb-16 md:pb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1, margin: "0px 0px -8% 0px" }}
          variants={fadeUp}
          transition={{ ...springTransition }}
          className="text-center mb-10"
        >
          <h2 className="font-display font-bold text-[clamp(1.7rem,3.5vw,2.5rem)] tracking-[-0.02em]">
            מה הופך כלב{" "}
            <span className="gradient-brand-text">למתאים?</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1, margin: "0px 0px -8% 0px" }}
              variants={fadeUp}
              transition={{ ...springTransition, delay: i * 0.08 }}
              className="card-soft p-7 text-center"
            >
              {/* Icon in gradient circle */}
              <div
                className="w-12 h-12 mx-auto mb-5 rounded-full flex items-center justify-center gradient-brand"
              >
                <b.icon className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <h3 className="font-display font-bold text-xl mb-2 tracking-[-0.01em]">
                {b.title}
              </h3>
              <p className="text-sm text-[var(--color-ink-mute)] leading-[1.65]">
                {b.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ======================================================
          FEATURED BREEDS ROW
      ====================================================== */}
      <section className="bg-[var(--color-muted)] border-y border-[var(--color-border)] py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1, margin: "0px 0px -8% 0px" }}
            variants={fadeUp}
            transition={{ ...springTransition }}
            className="flex items-baseline justify-between mb-8"
          >
            <h2 className="font-display font-bold text-[clamp(1.4rem,3vw,2rem)] tracking-[-0.02em]">
              גזעים מובחרים
            </h2>
            <Link
              href="/breeds"
              className="text-sm text-[var(--color-primary)] font-medium flex items-center gap-1 hover:underline"
            >
              לכל ה-{BREEDS.length}
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {featured.map((breed, i) => (
              <motion.div
                key={breed.slug}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.05, margin: "0px 0px -8% 0px" }}
                variants={fadeUp}
                transition={{ ...springTransition, delay: i * 0.05 }}
              >
                <Link
                  href={`/breed/${breed.slug}`}
                  className="group block breed-card bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[16px] overflow-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                >
                  <div className="aspect-square relative overflow-hidden">
                    {breed.imageUrl ? (
                      <Image
                        src={proxyImage(breed.imageUrl, { w: 280, h: 280, fit: "cover" })}
                        alt={`תמונה של ${breed.name}`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-4xl"
                        style={{ background: `${breed.accent}30` }}
                      >
                        {breed.emoji}
                      </div>
                    )}
                  </div>
                  <div className="px-3 py-2.5">
                    <p className="font-semibold text-sm leading-tight truncate text-[var(--color-ink)]">
                      {breed.name}
                    </p>
                    <p className="text-xs text-[var(--color-ink-faint)] truncate mt-0.5">
                      {breed.nameEn}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          FINAL CTA BAND
      ====================================================== */}
      <section className="py-20 md:py-28 gradient-brand relative overflow-hidden">
        {/* Subtle radial highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(255,255,255,0.10) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ ...springTransition }}
          >
            <Heart className="w-10 h-10 text-white/70 mx-auto mb-5" strokeWidth={1.5} />
            <h2 className="font-display font-bold text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-[-0.025em] text-white mb-5">
              מוכנים לגלות?
            </h2>
            <p className="text-white/80 text-[1.05rem] mb-8 leading-[1.6]">
              3–5 דקות · ללא הרשמה · ללא תשלום
            </p>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 bg-white text-[var(--color-primary-deep)] font-bold text-base px-8 py-4 rounded-[16px] hover:bg-[var(--color-primary-tint)] transition-colors duration-200"
              style={{ boxShadow: "0 4px 20px rgba(15,23,42,0.18)" }}
            >
              התחל את השאלון ←
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ======================================================
          FOOTER
      ====================================================== */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="mx-auto max-w-5xl px-5 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-[var(--color-ink-faint)]">
          <span>© 2026 DoGame</span>
          <span>בחר את הכלב שמתאים לחיים שלך</span>
        </div>
      </footer>
    </main>
  );
}
