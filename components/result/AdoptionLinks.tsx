"use client";

import { motion } from "motion/react";
import { ExternalLink, Search, HeartHandshake, MapPin } from "lucide-react";
import type { Breed } from "@/lib/breeds/types";
import { track } from "@/lib/track";

interface Props {
  breed: Breed;
}

/**
 * Smart deep-links to Israeli adoption resources for a specific breed.
 * Since most Israeli shelters don't expose APIs, we craft search URLs
 * that take the user directly to a filtered listing for that breed.
 */
function buildLinks(breed: Breed) {
  const queryHe = encodeURIComponent(breed.name);
  return [
    {
      id: "yad4",
      label: 'יד4 — אגודת צער בעלי חיים',
      description: "מאגר אימוץ ארצי, מסונן לפי גזע",
      url: `https://yad4.co.il/searchresults/?searchterm=${queryHe}`,
      icon: HeartHandshake,
      tone: "primary" as const,
    },
    {
      id: "spca",
      label: "SPCA ישראל",
      description: "אגודת צער בעלי חיים בישראל — גורים וכלבים בוגרים",
      url: `https://www.spca.co.il/dogs/?s=${queryHe}`,
      icon: HeartHandshake,
      tone: "primary" as const,
    },
    {
      id: "facebook",
      label: "קבוצת אימוץ בפייסבוק",
      description: `חיפוש "${breed.name} אימוץ" בפייסבוק`,
      url: `https://www.facebook.com/search/posts/?q=${encodeURIComponent(`${breed.name} אימוץ`)}`,
      icon: Search,
      tone: "accent" as const,
    },
    {
      id: "google",
      label: "חיפוש כללי בגוגל",
      description: `${breed.name} לאימוץ בישראל`,
      url: `https://www.google.com/search?q=${encodeURIComponent(`${breed.name} לאימוץ בישראל`)}&tbs=qdr:m`,
      icon: Search,
      tone: "accent" as const,
    },
    {
      id: "maps",
      label: "כלביות באזור שלך",
      description: "Google Maps — כלביות וצמ\"ח קרובות אליך",
      url: `https://www.google.com/maps/search/${encodeURIComponent("כלבייה צער בעלי חיים")}`,
      icon: MapPin,
      tone: "accent" as const,
    },
  ];
}

export function AdoptionLinks({ breed }: Props) {
  const links = buildLinks(breed);

  return (
    <section className="rounded-[28px] border-2 border-leaf-dark bg-leaf/15 p-6 md:p-8 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)]">
      <div className="flex items-start gap-3 mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-[16px] bg-leaf text-white border-2 border-leaf-dark shadow-[0_3px_0_var(--color-leaf-dark)]">
          <HeartHandshake className="w-6 h-6" strokeWidth={2.5} aria-hidden />
        </div>
        <div className="flex-1">
          <h2 className="font-display font-black text-xl md:text-2xl text-ink leading-tight">
            רוצה לאמץ {breed.name}?
          </h2>
          <p className="text-sm text-ink-soft font-medium mt-0.5">
            לפני שרוכשים — בדקו אם יש כלב מתאים לאימוץ. הצלת חיים, חיסכון
            ניכר, וגם הכלב ה&quot;מעורב&quot; יכול להיות מושלם בשבילך.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
        {links.map((link, i) => (
          <motion.a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track.adoptionClick(link.id, breed.slug)}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 * i, duration: 0.3 }}
            whileHover={{ y: -2 }}
            className="group flex items-center gap-3 rounded-[16px] bg-surface border-2 border-border-strong px-3.5 py-3 shadow-[var(--shadow-clay-sm),var(--shadow-inner-clay)] hover:border-leaf-dark transition-colors"
          >
            <span
              aria-hidden
              className={
                "shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-[12px] border-2 " +
                (link.tone === "primary"
                  ? "bg-leaf/20 text-leaf-dark border-leaf-dark/40"
                  : "bg-accent-tint text-accent-deep border-accent-soft")
              }
            >
              <link.icon className="w-5 h-5" strokeWidth={2.5} />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-display font-extrabold text-ink text-sm leading-tight">
                {link.label}
              </span>
              <span className="block text-xs text-ink-soft font-medium leading-tight mt-0.5">
                {link.description}
              </span>
            </span>
            <ExternalLink
              className="w-4 h-4 text-ink-soft group-hover:text-leaf-dark transition-colors shrink-0"
              strokeWidth={2.5}
              aria-hidden
            />
          </motion.a>
        ))}
      </div>

      <p className="mt-4 text-[11px] text-ink-soft font-medium text-center leading-relaxed">
        🐾 שני אחי שני מהכלבים שאהבת — אדם וכלב במחזה האימוץ זה מתחיל בהצלת חיים.
        אגודות כמו <strong>תנו&apos;בה</strong> ו-<strong>SPCA</strong> אורגנו לעזרה.
      </p>
    </section>
  );
}
