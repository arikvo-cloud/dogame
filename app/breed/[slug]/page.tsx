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
import { SiteNav } from "@/components/providers/SiteNav";
import { AuroraBackground } from "@/components/providers/AuroraBackground";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

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
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">

        {/* Hero */}
        <header
          className="relative rounded-[36px] border-[3px] bg-surface p-6 md:p-10 text-center shadow-[var(--shadow-clay-xl),var(--shadow-inner-clay)]"
          style={{ borderColor: breed.accent }}
        >
          <div className="absolute top-4 right-4 z-10">
            <FavoriteButton slug={breed.slug} breedName={breed.name} size="md" />
          </div>
          <div className="flex justify-center">
            <BreedPhoto
              breed={breed}
              size={176}
              rounded="rounded-[32px]"
              priority
              kenBurns
            />
          </div>
          <h1 className="mt-5 text-4xl md:text-5xl font-black text-ink leading-tight">
            {breed.name}
          </h1>
          <p className="text-base text-ink-mute font-display font-bold mt-1">{breed.nameEn}</p>
          <p className="mt-4 text-lg text-ink-soft max-w-prose mx-auto font-medium">
            {breed.tagline}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm">
            <span className="inline-flex items-center gap-1.5 bg-bg-soft border-2 border-border-strong px-3 py-1.5 rounded-full font-display font-bold text-ink shadow-[var(--shadow-clay-sm)]">
              <Scale className="w-4 h-4" strokeWidth={2.5} />
              {breed.weightKg[0]}-{breed.weightKg[1]} ק"ג
            </span>
            <span className="inline-flex items-center gap-1.5 bg-bg-soft border-2 border-border-strong px-3 py-1.5 rounded-full font-display font-bold text-ink shadow-[var(--shadow-clay-sm)]">
              <Clock className="w-4 h-4" strokeWidth={2.5} />
              {breed.lifeExpectancy[0]}-{breed.lifeExpectancy[1]} שנים
            </span>
            <span className="inline-flex items-center gap-1.5 bg-bg-soft border-2 border-border-strong px-3 py-1.5 rounded-full font-display font-bold text-ink shadow-[var(--shadow-clay-sm)]">
              <Activity className="w-4 h-4" strokeWidth={2.5} />
              {breed.exerciseMinPerDay} דק'/יום
            </span>
            {breed.hypoallergenic && (
              <span className="inline-flex items-center gap-1.5 bg-success text-white border-2 border-success/80 px-3 py-1.5 rounded-full font-display font-extrabold shadow-[0_3px_0_rgba(20,83,45,0.5)]">
                <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                היפואלרגני
              </span>
            )}
            {wiki && (
              <a
                href={wiki.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-accent text-white border-2 border-accent-deep px-3 py-1.5 rounded-full font-display font-extrabold shadow-[0_3px_0_var(--color-accent-deep)] hover:-translate-y-px transition-transform"
              >
                <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
                ויקיפדיה {wiki.lang === "he" ? "(עברית)" : "(EN)"}
              </a>
            )}
          </div>
        </header>

        {/* Description */}
        <Reveal from="up">
          <section className="mt-6 rounded-[28px] border-[3px] border-border bg-surface p-6 md:p-8 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)]">
            <h2 className="font-display font-black text-2xl text-ink mb-3">
              על {breed.name}
            </h2>
            <p className="text-ink leading-relaxed text-lg font-medium">{breed.description}</p>
          </section>
        </Reveal>

        {/* Gallery */}
        {breed.gallery && breed.gallery.length > 0 && (
          <Reveal from="up">
            <section className="mt-6 rounded-[28px] border-[3px] border-border bg-surface p-6 md:p-8 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)]">
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
          <section className="mt-6 rounded-[28px] border-[3px] border-border bg-surface p-6 md:p-8 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)]">
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

        {/* AI Q&A chat */}
        <Reveal from="up">
          <div className="mt-6">
            <BreedChat breed={breed} />
          </div>
        </Reveal>

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
              className="inline-flex items-center gap-2 bg-primary text-white border-[3px] border-primary-deep font-display font-extrabold px-8 py-4 rounded-[22px] text-lg shadow-[var(--shadow-glow-primary)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[var(--shadow-clay-press)] transition-all"
            >
              בדוק התאמה אישית במשחק
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
