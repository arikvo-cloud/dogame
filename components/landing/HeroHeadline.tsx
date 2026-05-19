"use client";

import { useEffect, useState } from "react";

interface HeroHeadlineProps {
  /** Words to reveal in sequence. The string between curly braces is the
   *  highlighted word that gets the red block treatment. */
  words: Array<{ text: string; highlight?: boolean }>;
}

/** Words snap in one at a time with step-based animation.
 *  Delays compound — first word at 100ms, then +180ms each. */
export function HeroHeadline({ words }: HeroHeadlineProps) {
  // Trigger animation on mount (rather than CSS-only) so it respects route changes
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 40);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <h1 className="mt-6 font-display font-black text-black leading-[0.85] tracking-[-0.04em] text-[clamp(3.5rem,12vw,11rem)] break-words">
      {words.map((w, i) => (
        <span
          key={i}
          className="brut-word"
          style={{
            animationDelay: ready ? `${100 + i * 180}ms` : "9999s",
            display: "inline-block",
            marginInlineEnd: "0.25em",
          }}
        >
          {w.highlight ? (
            <span className="inline-block bg-[color:var(--color-primary)] text-white px-3 py-1">
              {w.text}
            </span>
          ) : (
            w.text
          )}
        </span>
      ))}
    </h1>
  );
}
