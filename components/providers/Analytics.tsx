import Script from "next/script";

/**
 * Privacy-friendly Plausible analytics.
 * - No cookies, no personal data, GDPR-compliant
 * - Only loaded in production (NODE_ENV=production)
 * - Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN to enable; otherwise renders nothing.
 *
 * Custom events can be fired via `window.plausible('Event Name', { props })`.
 * See `lib/track.ts` for typed wrappers.
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "dogame.pages.dev";
  // Skip in dev to avoid polluting analytics during development
  if (process.env.NODE_ENV !== "production") return null;
  return (
    <>
      <Script
        defer
        data-domain={domain}
        src="https://plausible.io/js/script.tagged-events.js"
        strategy="afterInteractive"
      />
      <Script id="plausible-init" strategy="afterInteractive">
        {`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) };`}
      </Script>
    </>
  );
}
