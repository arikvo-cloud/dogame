"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Sparkles, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Pinned scroll-driven storytelling section.
 * Three "panels" rotate through a single pinned container as the user scrolls:
 *   1. The problem (1/3 of dogs returned)
 *   2. The cause (mismatch)
 *   3. The solution (DoGame's approach)
 *
 * Each panel uses scrub-linked animations so the content tracks the scroll
 * position 1:1, giving a cinematic, deliberate feel.
 */
export function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Respect reduced-motion: skip the pin/scrub experience entirely.
      const mql =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (mql) return;

      // Skip the pinned experience on tiny screens — it gets cramped.
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "+=300%",
              scrub: 0.7,
              pin: true,
              anticipatePin: 1,
            },
          });

          // Panel 1: appear
          tl.from(".story-panel-1 .story-num", {
            scale: 0.5,
            opacity: 0,
            duration: 0.5,
          })
            .from(
              ".story-panel-1 .story-head, .story-panel-1 .story-body, .story-panel-1 .story-emoji",
              { y: 40, opacity: 0, duration: 0.5, stagger: 0.1 },
              "<+=0.15"
            )

            // Panel 1 → 2 swap
            .to(".story-panel-1", { opacity: 0, y: -30, duration: 0.5 })
            .fromTo(
              ".story-panel-2",
              { opacity: 0, y: 50 },
              { opacity: 1, y: 0, duration: 0.5 },
              "<"
            )
            .from(".story-panel-2 .story-num", {
              scale: 0.5,
              opacity: 0,
              duration: 0.4,
            })
            .from(
              ".story-panel-2 .story-head, .story-panel-2 .story-body, .story-panel-2 .story-emoji",
              { y: 40, opacity: 0, duration: 0.5, stagger: 0.1 },
              "<+=0.1"
            )

            // Panel 2 → 3 swap
            .to(".story-panel-2", { opacity: 0, y: -30, duration: 0.5 })
            .fromTo(
              ".story-panel-3",
              { opacity: 0, y: 50 },
              { opacity: 1, y: 0, duration: 0.5 },
              "<"
            )
            .from(".story-panel-3 .story-num", {
              scale: 0.5,
              opacity: 0,
              duration: 0.4,
            })
            .from(
              ".story-panel-3 .story-head, .story-panel-3 .story-body, .story-panel-3 .story-emoji",
              { y: 40, opacity: 0, duration: 0.5, stagger: 0.1 },
              "<+=0.1"
            )
            // Hold a beat on panel 3 to read
            .to({}, { duration: 0.6 });
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative h-dvh overflow-hidden bg-bg-soft border-y-[3px] border-border"
    >
      {/* Decorative ambient blur */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-primary/20 rounded-full blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-32 w-[360px] h-[360px] bg-accent/20 rounded-full blur-3xl"
      />

      {/* Stacked panels — only one visible at a time via GSAP */}
      <div className="relative h-full max-w-3xl mx-auto px-4 flex items-center justify-center">
        <StoryPanel
          className="story-panel-1"
          number="01"
          emoji="💔"
          eyebrow="הבעיה"
          headline={
            <>
              ⅓ מהכלבים <span className="text-danger">חוזרים למחסות</span> בשנה הראשונה
            </>
          }
          body="זה לא קורה כי המשפחות אכזריות. זה קורה כי הכלב לא היה מתאים לחיים שלהם — וזה מתגלה רק אחרי שהוא כבר חלק מהבית."
        />
        <StoryPanel
          className="story-panel-2 opacity-0"
          number="02"
          emoji="🤝"
          eyebrow="הסיבה"
          headline={
            <>
              אי-התאמה בין <span className="text-primary-deep">סגנון חיים</span> לבין הגזע
            </>
          }
          body='כלב פעיל בדירה קטנה. כלב עצמאי במשפחה שמחפשת חיבוקים. גזע סיברי בקיץ הישראלי. רוב האנשים לא יודעים מה הם לא יודעים — ואין להם איך לבדוק לפני.'
        />
        <StoryPanel
          className="story-panel-3 opacity-0"
          number="03"
          emoji="🐾"
          eyebrow="הפתרון"
          headline={
            <>
              <span className="text-leaf-dark">DoGame</span> עוזר לבחור נכון — לפני הכל
            </>
          }
          body="שאלון של 3 דקות, 10 צירי תכונות, 37 גזעים. תקבל המלצה ספציפית עם הסבר למה — ועם אפשרות לאמץ במקום לרכוש."
          cta
        />
      </div>

      {/* Scroll hint at bottom (visible until pin completes) */}
      <div
        aria-hidden
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-ink-soft text-xs font-display font-bold opacity-70 pointer-events-none"
      >
        <span>גלילה למטה</span>
        <span className="block w-px h-6 bg-ink-soft animate-bounce" />
      </div>
    </section>
  );
}

function StoryPanel({
  number,
  emoji,
  eyebrow,
  headline,
  body,
  className,
  cta,
}: {
  number: string;
  emoji: string;
  eyebrow: string;
  headline: React.ReactNode;
  body: string;
  className?: string;
  cta?: boolean;
}) {
  return (
    <div
      className={
        "absolute inset-0 flex flex-col items-center justify-center text-center px-4 " +
        (className ?? "")
      }
    >
      <div className="story-num inline-flex items-center gap-2 text-ink-soft font-display font-extrabold text-sm mb-3">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-surface border-[3px] border-border-strong text-ink shadow-[var(--shadow-clay-sm)]">
          {number}
        </span>
        <span className="uppercase tracking-wide">{eyebrow}</span>
      </div>
      <div className="story-emoji text-6xl md:text-7xl mb-4 select-none">{emoji}</div>
      <h2 className="story-head text-3xl md:text-5xl font-black text-ink leading-tight max-w-2xl">
        {headline}
      </h2>
      <p className="story-body mt-5 text-ink-soft text-lg md:text-xl font-medium max-w-xl leading-relaxed">
        {body}
      </p>
      {cta && (
        <Link
          href="/quiz"
          className="story-body mt-7 inline-flex items-center gap-2 bg-primary text-white border-[3px] border-primary-deep px-6 py-3 rounded-[20px] font-display font-extrabold text-lg shadow-[var(--shadow-glow-primary)] hover:-translate-y-0.5 transition-transform"
        >
          התחל עכשיו
          <ArrowLeft className="w-5 h-5" />
        </Link>
      )}
    </div>
  );
}
