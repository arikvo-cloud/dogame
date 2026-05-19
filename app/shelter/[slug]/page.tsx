import { notFound } from "next/navigation";
import { MapPin, Globe } from "lucide-react";
import { getShelterBySlug } from "@/lib/shelters/data";
import { allShelterSlugs } from "@/lib/shelters/helpers";
import { REGION_LABELS } from "@/lib/shelters/types";
import { filterDogs } from "@/lib/dogs/helpers";
import { SiteNav } from "@/components/providers/SiteNav";
import { AuroraBackground } from "@/components/providers/AuroraBackground";
import { SectionMark } from "@/components/ui/SectionMark";
import { ExampleBadge } from "@/components/ui/ExampleBadge";
import { DogCard } from "@/components/dogs/DogCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allShelterSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const shelter = getShelterBySlug(slug);
  if (!shelter) return { title: "מקלט לא נמצא · DoGame" };
  return {
    title: `${shelter.name} · DoGame`,
    description: shelter.description,
    alternates: { canonical: `/shelter/${shelter.slug}/` },
  };
}

export default async function ShelterPage({ params }: PageProps) {
  const { slug } = await params;
  const shelter = getShelterBySlug(slug);
  if (!shelter) notFound();

  const dogs = filterDogs({ shelterId: shelter.id });

  return (
    <main id="main" className="min-h-dvh bg-clay">
      <AuroraBackground />
      <SiteNav />
      <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <header className="mb-10">
          <div className="flex items-center gap-3"><ExampleBadge /></div>
          <SectionMark numeral="N°1" label={`${REGION_LABELS[shelter.region]} · ${shelter.city}`} className="mt-4" />
          <h1 className="mt-5 text-4xl md:text-6xl lg:text-7xl font-extrabold font-display text-ink leading-[0.95]">
            {shelter.name}
          </h1>
          <p className="mt-5 text-ink-soft text-lg md:text-xl font-medium max-w-prose leading-relaxed">
            {shelter.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-display font-bold text-ink-soft">
            <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" />{shelter.city}</span>
            {shelter.website && (
              <a href={shelter.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary-deep underline underline-offset-4 hover:text-primary">
                <Globe className="w-4 h-4" />אתר מאמצים בישראל
              </a>
            )}
          </div>
          <hr className="magazine-rule mt-8" />
        </header>

        <section>
          <SectionMark numeral={`${dogs.length}`} label="כלבים מחכים לבית" />
          {dogs.length === 0 ? (
            <p className="mt-6 text-ink-soft font-medium">אין כרגע כלבים זמינים במקלט זה.</p>
          ) : (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {dogs.map((d) => <DogCard key={d.id} dog={d} />)}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
