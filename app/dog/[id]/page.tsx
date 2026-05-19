import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getDogById, allDogIds } from "@/lib/dogs/data";
import { filterDogs } from "@/lib/dogs/helpers";
import { getShelterById } from "@/lib/shelters/data";
import { getBreedBySlug } from "@/lib/breeds/data";
import { SiteNav } from "@/components/providers/SiteNav";
import { AuroraBackground } from "@/components/providers/AuroraBackground";
import { Reveal } from "@/components/ui/Reveal";
import { SectionMark } from "@/components/ui/SectionMark";
import { DogHero } from "@/components/dogs/DogHero";
import { DogTraitChips } from "@/components/dogs/DogTraitChips";
import { DogCard } from "@/components/dogs/DogCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return allDogIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const dog = getDogById(id);
  if (!dog) return { title: "כלב לא נמצא · DoGame" };
  return {
    title: `${dog.name} · ${dog.breedDisplay} · DoGame`,
    description: dog.description.slice(0, 160),
    alternates: { canonical: `/dog/${dog.id}/` },
  };
}

export default async function DogPage({ params }: PageProps) {
  const { id } = await params;
  const dog = getDogById(id);
  if (!dog) notFound();

  const shelter = getShelterById(dog.shelterId);
  if (!shelter) notFound();

  const breed = dog.breedSlug ? getBreedBySlug(dog.breedSlug) : null;
  const similar = filterDogs({ region: dog.region }).filter((d) => d.id !== dog.id).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${dog.name} — ${dog.breedDisplay} מ${shelter.name}`,
    description: dog.description,
    inLanguage: "he",
    image: dog.imageUrl,
    datePublished: dog.dateAvailable,
    isFamilyFriendly: dog.goodWith.includes("kids"),
  };

  return (
    <main id="main" className="min-h-dvh bg-clay">
      <AuroraBackground />
      <SiteNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">
        <DogHero dog={dog} shelterName={shelter.name} shelterCity={shelter.city} />

        <Reveal from="up">
          <section className="mt-6 rounded-[28px] border-2 border-border bg-surface p-6 md:p-8 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)]">
            <SectionMark label={`הסיפור של ${dog.name}`} />
            <p className="mt-5 text-ink leading-relaxed text-lg font-medium">{dog.description}</p>
            <div className="mt-6">
              <DogTraitChips goodWith={dog.goodWith} />
            </div>
          </section>
        </Reveal>

        <Reveal from="up">
          <section className="mt-6 rounded-[28px] border-2 border-border bg-surface p-6 md:p-8 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)] text-center">
            <SectionMark label="מעוניינים?" className="justify-center" />
            <p className="mt-4 text-ink-soft text-base md:text-lg max-w-prose mx-auto leading-relaxed">
              לבירור על {dog.name} פנו ישירות ל{shelter.name} — או לאחת מאגודות הרווחה בישראל.
            </p>
            <a
              href={dog.contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-paw-zone
              className="mt-6 inline-flex items-center gap-2 bg-primary text-white border-2 border-primary-deep px-7 py-3.5 rounded-[20px] shadow-[var(--shadow-glow-primary)] hover:-translate-y-0.5 active:translate-y-1 transition-all font-display font-extrabold"
            >
              פנו לבירור אימוץ
              <ExternalLink className="w-4 h-4" />
            </a>
          </section>
        </Reveal>

        {breed && (
          <Reveal from="up">
            <section className="mt-6 rounded-[28px] border-2 border-border bg-surface p-6 md:p-8 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)]">
              <SectionMark label={`על הגזע: ${breed.name}`} />
              <p className="mt-4 text-ink leading-relaxed font-medium">{breed.tagline}</p>
              <Link
                href={`/breed/${breed.slug}`}
                className="mt-4 inline-flex items-center gap-1.5 text-primary-deep font-display font-extrabold underline underline-offset-4 decoration-primary/40 hover:decoration-primary"
              >
                לפרופיל המלא של הגזע
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </section>
          </Reveal>
        )}

        {similar.length > 0 && (
          <Reveal from="up">
            <section className="mt-10">
              <SectionMark label="כלבים נוספים באזור" />
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {similar.map((d) => <DogCard key={d.id} dog={d} />)}
              </div>
            </section>
          </Reveal>
        )}
      </div>
    </main>
  );
}
