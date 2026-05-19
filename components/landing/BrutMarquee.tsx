import { Fragment } from "react";

interface BrutMarqueeProps {
  /** Each entry becomes a ticker chip separated by ▮ */
  items: string[];
}

/** News-ticker style horizontal scroll. Pure CSS animation, continuous loop.
 *  Items are repeated twice to make the loop seamless. */
export function BrutMarquee({ items }: BrutMarqueeProps) {
  return (
    <div className="border-b-2 border-black bg-white overflow-hidden">
      <div className="brut-ticker">
        {[0, 1].map((rep) => (
          <Fragment key={rep}>
            {items.map((item, i) => (
              <span
                key={`${rep}-${i}`}
                className="inline-flex items-center gap-3 px-5 py-1.5 font-mono uppercase text-[11px] tracking-[0.18em] shrink-0"
                aria-hidden={rep === 1}
              >
                <span className="text-[color:var(--color-primary)]">▮</span>
                {item}
              </span>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
