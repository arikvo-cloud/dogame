import { SHELTERS } from "@/lib/shelters/data";
import { REGION_LABELS } from "@/lib/shelters/types";
import type { Region } from "@/lib/shelters/types";
import { SiteNav } from "@/components/providers/SiteNav";
import { AuroraBackground } from "@/components/providers/AuroraBackground";
import { SectionMark } from "@/components/ui/SectionMark";
import { ShelterCard } from "@/components/shelters/ShelterCard";

export const metadata = {
  title: "מקלטים · DoGame",
  description: "8 אגודות רווחת חיות ברחבי ישראל המאמצות כלבים. צפון, מרכז, דרום, ירושלים.",
  alternates: { canonical: "/shelters" },
};

const REGION_ORDER: Region[] = ["center", "north", "jerusalem", "south"];

export default function SheltersPage() {
  const byRegion = Object.fromEntries(
    REGION_ORDER.map((r) => [r, SHELTERS.filter((s) => s.region === r)])
  );

  return (
    <main id="main" className="min-h-dvh bg-clay">
      <AuroraBackground />
      <SiteNav />
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <header className="mb-10 md:mb-14">
          <SectionMark numeral="08" label="מקלטים בישראל" />
          <div className="mt-5 grid md:grid-cols-12 gap-6 md:gap-10 items-end">
            <h1 className="md:col-span-7 font-extrabold font-display text-ink leading-[0.95] tracking-tight text-[clamp(2.5rem,7vw,5.5rem)]">
              איפה{" "}
              <span className="italic text-primary-deep font-medium">מאמצים</span>
            </h1>
            <p className="md:col-span-5 text-ink-soft text-base md:text-lg font-medium max-w-prose leading-relaxed">
              {SHELTERS.length} אגודות פועלות ברחבי הארץ — מהגליל ועד הנגב. בחרו אזור או דפדפו בכל המקלטים.
            </p>
          </div>
          <hr className="magazine-rule mt-10" />
        </header>

        {REGION_ORDER.map((region) => {
          const shelters = byRegion[region];
          if (shelters.length === 0) return null;
          return (
            <section key={region} className="mb-14">
              <SectionMark label={REGION_LABELS[region]} />
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                {shelters.map((s) => (
                  <ShelterCard key={s.id} shelter={s} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
