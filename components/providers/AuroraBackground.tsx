/**
 * Aurora mesh background — 5 slowly drifting blobs + subtle grain.
 * Pure CSS animation, GPU-composited. Respects prefers-reduced-motion.
 *
 * Place once at the top of each page (inside the main, before content),
 * the page itself uses `.bg-clay` which provides the base color + isolation.
 */
export function AuroraBackground() {
  return (
    <div aria-hidden className="aurora">
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
      <div className="aurora-blob aurora-blob-4" />
      <div className="aurora-blob aurora-blob-5" />
      <div className="grain" />
    </div>
  );
}
