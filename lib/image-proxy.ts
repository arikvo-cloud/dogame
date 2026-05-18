/**
 * Wraps Wikimedia URLs through images.weserv.nl — a free image-resizing
 * proxy that returns WebP at exactly the size we need, with CDN caching.
 *
 * This is the biggest single performance win for DoGame, because Wikipedia's
 * `upload.wikimedia.org` URLs are full-resolution originals (often 1-2 MB
 * each), and we display them at 96-400 px in many places (marquee, gallery,
 * featured grid, match cards…).
 *
 * The proxy:
 *   - Resizes (width=, height=, fit=cover, dpr=2)
 *   - Re-encodes to WebP (output=webp) at quality 80
 *   - Edge-cached on Cloudflare's network
 *   - Free, no key, no rate-limit for reasonable usage
 *
 * Pass through:
 *   - Local /public assets
 *   - Already-proxied URLs
 *   - Empty/null inputs
 */

const WESERV = "https://images.weserv.nl/";

export interface ProxyOpts {
  /** Target width in CSS pixels (proxy multiplies by dpr for retina) */
  w?: number;
  /** Target height. If omitted, aspect is preserved. */
  h?: number;
  /** Fit strategy. Default "cover" for square thumbnails. */
  fit?: "cover" | "contain" | "inside";
  /** Output quality 1-100, default 78 */
  q?: number;
  /** Output format, default "webp" */
  output?: "webp" | "jpg" | "png";
}

export function proxyImage(url: string | null | undefined, opts: ProxyOpts = {}): string {
  if (!url) return "";
  // Only proxy upload.wikimedia.org — local + already-proxied: pass through
  if (!url.includes("upload.wikimedia.org")) return url;

  const params = new URLSearchParams();
  // weserv expects the URL WITHOUT the protocol
  params.set("url", url.replace(/^https?:\/\//, ""));
  if (opts.w) params.set("w", String(opts.w));
  if (opts.h) params.set("h", String(opts.h));
  params.set("fit", opts.fit ?? "cover");
  params.set("q", String(opts.q ?? 78));
  params.set("output", opts.output ?? "webp");
  // 2x DPR — proxy serves @2x for retina screens
  params.set("dpr", "2");

  return `${WESERV}?${params.toString()}`;
}
