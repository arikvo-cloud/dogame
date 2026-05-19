import { AdoptBrowse } from "@/components/adopt/AdoptBrowse";
import { ADOPTABLE_DOGS } from "@/lib/dogs/data";
import { SiteNav } from "@/components/providers/SiteNav";
import { AuroraBackground } from "@/components/providers/AuroraBackground";
import { SectionMark } from "@/components/ui/SectionMark";

export const metadata = {
  title: "כלבים לאימוץ · DoGame",
  description: `${ADOPTABLE_DOGS.length} כלבים מחכים לבית בכל רחבי ישראל. סינון לפי אזור, גודל וגיל.`,
  alternates: { canonical: "/adopt" },
};

export default function AdoptPage() {
  return (
    <main id="main" className="min-h-dvh bg-clay">
      <AuroraBackground />
      <SiteNav />
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <header className="mb-10">
          <SectionMark numeral="01" label="אימוץ" />
          <div className="mt-5 grid md:grid-cols-12 gap-6 md:gap-10 items-end">
            <h1 className="md:col-span-7 font-extrabold font-display text-ink leading-[0.95] tracking-tight text-[clamp(2.5rem,7vw,5.5rem)]">
              כלבים{" "}
              <span className="italic text-primary-deep font-medium">מחכים</span>{" "}
              לבית
            </h1>
            <p className="md:col-span-5 text-ink-soft text-base md:text-lg font-medium max-w-prose leading-relaxed">
              {ADOPTABLE_DOGS.length} כלבים זמינים ברגע זה במקלטים ברחבי הארץ. סננו לפי אזור, גודל וגיל כדי למצוא את ההתאמה המתאימה לכם.
            </p>
          </div>
          <hr className="magazine-rule mt-10" />
        </header>

        <AdoptBrowse />
      </div>
    </main>
  );
}
