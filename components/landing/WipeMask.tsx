"use client";

import { useEffect, useState } from "react";

/** Black bars wipe in from top + bottom, meet in the middle, then retract.
 *  Plays once on page load. Cleans itself up after the animation finishes
 *  to avoid covering the viewport even briefly. */
export function WipeMask() {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setMounted(false), 1000);
    return () => window.clearTimeout(t);
  }, []);

  if (!mounted) return null;
  return <div aria-hidden className="brut-wipe-mask" />;
}
