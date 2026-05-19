import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Heart,
  XCircle,
  Clock,
  Scale,
  Activity,
  ExternalLink,
} from "lucide-react";
import {
  allBreedSlugs,
  bestWikipediaUrl,
  getBreedBySlug,
} from "@/lib/breeds/data";
import { BreedTraits } from "@/components/breed/BreedTraits";
import { InfoList } from "@/components/breed/InfoList";
import { BreedPhoto } from "@/components/breed/BreedPhoto";
import { BreedGallery } from "@/components/breed/BreedGallery";
import { FavoriteButton } from "@/components/breed/FavoriteButton";
import { CostEstimator } from "@/components/breed/CostEstimator";
import { BreedChat } from "@/components/breed/BreedChat";
import { LazyMount } from "@/components/ui/LazyMount";
import { SiteNav } from "@/components/providers/SiteNav";
import { AuroraBackground } from "@/components/providers/AuroraBackground";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { dogsForBreed } from "@/lib/dogs/helpers";
import { DogCard } from "@/components/dogs/DogCard";
import { SectionMark } from "@/components/ui/SectionMark";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allBreedSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const breed = getBreedBySlug(slug);
  if (!breed) return { title: "גזע לא נמצא · DoGame" };
  const desc = `${breed.tagline}. ${breed.description.slice(0, 140)}`;
  return {
    title: `${breed.name} (${breed.nameEn}) · DoGame`,
    description: desc,
    alternates: { canonical: `/breed/${breed.slug}/` },
    openGraph: {
      title: `${breed.name} · DoGame`,
      description: breed.tagline,
      locale: "he_IL",
      type: "article",
      images: breed.imageUrl
        ? [{ url: breed.imageUrl, alt: `תמונה של ${breed.name}` }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${breed.name} · DoGame`,
      description: breed.tagline,
      images: breed.imageUrl ? [breed.imageUrl] : undefined,
    },
  };
}

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dogame.pages.dev";

export default async function BreedPage({ params }: PageProps) {
  const { slug } = await params;
  const breed = getBreedBySlug(slug);
  if (!breed) notFound();
  const wiki = bestWikipediaUrl(breed);

  // JSON-LD structured data for the breed page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${breed.name} (${breed.nameEn})`,
    description: breed.description,
    inLanguage: "he",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/breed/${breed.slug}/`,
    },
    image: breed.imageUrl ?? undefined,
    publisher: {
      "@type": "Organization",
      name: "DoGame",
      url: BASE_URL,
    },
    about: {
      "@type": "Thing",
      name: breed.name,
      alternateName: breed.nameEn,
      sameAs: [wiki?.url].filter(Boolean),
    },
  };

  return (
    <main id="main" className="min-h-dvh bg-clay">
      <AuroraBackground />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteNav />
      <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">

        {/* Hero — editorial photo-dominant */}
        <header className="relative grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6 md:gap-10 items-center">
          {/* Photo half — below text on mobile, on the desktop side */}
          <div className="relative order-2 md:order-1">
            <div
              className="relative aspect-[5/4] md:aspect-[4/5] rounded-[28px] overflow-hidden border border-border shadow-[var(--shadow-clay-xl)]"
              style={{ background: `${breed.accent}30` }}
            >
              <BreedPhoto
                breed={breed}
                size={700}
                rounded="rounded-none"
                className="!w-full !h-full !rounded-none !border-0 !shadow-none"
                priority
                kenBurns
                fit="contain"
              />
            </div>
            <div className="absolute top-4 right-4 z-10">
              <FavoriteButton slug={breed.slug} breedName={breed.name} size="md" />
            </div>
          </div>

          {/* Text half — above photo on mobile */}
          <div className="order-1 md:order-2 text-right">
            <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-display font-bold text-ink-mute">
              <span className="block w-6 h-px bg-ink-mute" aria-hidden />
              פרופיל גזע
            </div>
            <h1 className="mt-3 text-5xl md:text-6xl lg:text-7xl font-extrabold font-display text-ink leading-[0.95]">
              {breed.name}
            </h1>
            <p className="mt-2 text-base text-ink-mute font-display font-medium italic">
              {breed.nameEn}
            </p>
            <p className="mt-5 text-lg md:text-xl text-ink-soft leading-relaxed font-medium">
              {breed.tagline}
            </p>

            <dl className="mt-6 grid grid-cols-3 gap-3 max-w-md">
              <div className="border-t-2 border-border pt-3">
                <dt className="text-[10px] uppercase tracking-wide font-display font-bold text-ink-mute">משקל</dt>
                <dd className="mt-1 text-base font-display font-extrabold text-ink">
                  {breed.weightKg[0]}–{breed.weightKg[1]}<span className="text-xs text-ink-mute"> ק"ג</span>
                </dd>
              </div>
              <div className="border-t-2 border-border pt-3">
                <dt className="text-[10px] uppercase tracking-wide font-display font-bold text-ink-mute">תוחלת חיים</dt>
                <dd className="mt-1 text-base font-display font-extrabold text-ink">
                  {breed.lifeExpectancy[0]}–{breed.lifeExpectancy[1]}<span className="text-xs text-ink-mute"> שנים</span>
                </dd>
              </div>
              <div className="border-t-2 border-border pt-3">
                <dt className="text-[10px] uppercase tracking-wide font-display font-bold text-ink-mute">פעילות</dt>
                <dd className="mt-1 text-base font-display font-extrabold text-ink">
                  {breed.exerciseMinPerDay}<span className="text-xs text-ink-mute"> דק'/יום</span>
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {breed.hypoallergenic && (
                <span className="inline-flex items-center gap-1.5 bg-success-tint text-success-deep border border-success/40 px-3 py-1 rounded-full font-display font-extrabold text-xs">
                  <Sparkles className="w-3 h-3" strokeWidth={2.5} />
                  היפואלרגני
                </span>
              )}
              {wiki && (
                <a
                  href={wiki.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-accent-tint text-accent-deep border border-accent-soft px-3 py-1 rounded-full font-display font-extrabold text-xs hover:bg-accent hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3 h-3" strokeWidth={2.5} />
                  ויקיפדיה
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Description */}
        <Reveal from="up">
          <section className="mt-6 rounded-[28px] border-2 border-border bg-surface p-6 md:p-8 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)]">
            <h2 className="font-display font-black text-2xl text-ink mb-3">
              על {breed.name}
            </h2>
            <p className="text-ink leading-relaxed text-lg font-medium">{breed.description}</p>
          </section>
        </Reveal>

        {/* Available now */}
        {(() => {
          const availableDogs = dogsForBreed(breed.slug, 3);
          if (availableDogs.length === 0) return null;
          return (
            <Reveal from="up">
              <section className="mt-6 rounded-[28px] border-2 border-primary-deep bg-primary-tint p-6 md:p-8 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)]">
                <SectionMark numeral={`${availableDogs.length}`} label={`${breed.name} מחכים לבית`} />
                <p className="mt-3 text-ink-soft text-base md:text-lg font-medium max-w-prose">
                  {availableDogs.length} כלבים מהגזע הזה (או תערובות) זמינים לאימוץ ברגע זה.
                </p>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {availableDogs.map((d) => <DogCard key={d.id} dog={d} />)}
                </div>
              </section>
            </Reveal>
          );
        })()}

        {/* Gallery */}
        {breed.gallery && breed.gallery.length > 0 && (
          <Reveal from="up">
            <section className="mt-6 rounded-[28px] border-2 border-border bg-surface p-6 md:p-8 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)]">
              <h2 className="font-display font-black text-2xl text-ink mb-4">גלריה</h2>
              <p className="text-sm text-ink-soft font-medium mb-4">
                לחץ על תמונה כדי להגדיל. תמונות מ-Wikimedia Commons תחת רישיון CC.
              </p>
              <BreedGallery breed={breed} />
            </section>
          </Reveal>
        )}

        {/* Traits */}
        <Reveal from="up">
          <section className="mt-6 rounded-[28px] border-2 border-border bg-surface p-6 md:p-8 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)]">
            <h2 className="font-display font-black text-2xl text-ink mb-5">פרופיל תכונות</h2>
            <BreedTraits traits={breed.traits} />
          </section>
        </Reveal>

        {/* Cost estimator */}
        <Reveal from="up">
          <div className="mt-6">
            <CostEstimator breed={breed} />
          </div>
        </Reveal>

        {/* AI Q&A chat — heavy component, deferred until in view */}
        <LazyMount rootMargin="300px" minHeight={320}>
          <Reveal from="up">
            <div className="mt-6">
              <BreedChat breed={breed} />
            </div>
          </Reveal>
        </LazyMount>

        {/* Care + mistakes grid */}
        <Stagger className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5" stagger={0.1}>
          <StaggerItem>
            <InfoList
              title="טיפים לטיפול נכון"
              Icon={Heart}
              items={breed.careTips}
              variant="success"
            />
          </StaggerItem>
          <StaggerItem>
            <InfoList
              title="טעויות נפוצות"
              Icon={AlertTriangle}
              items={breed.commonMistakes}
              variant="warning"
            />
          </StaggerItem>
          <StaggerItem>
            <InfoList
              title="מתאים במיוחד ל..."
              Icon={Sparkles}
              items={breed.goodFor}
              variant="primary"
            />
          </StaggerItem>
          <StaggerItem>
            <InfoList
              title="פחות מתאים ל..."
              Icon={XCircle}
              items={breed.notIdealFor}
              variant="accent"
            />
          </StaggerItem>
        </Stagger>

        <Reveal from="scale">
          <div className="mt-10 text-center">
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 bg-primary text-white border-2 border-primary-deep font-display font-extrabold px-8 py-4 rounded-[22px] text-lg shadow-[var(--shadow-glow-primary)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[var(--shadow-clay-press)] transition-all"
            >
              בדוק התאמה אישית במשחק
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
