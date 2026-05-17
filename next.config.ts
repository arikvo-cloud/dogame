import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Cloudflare Pages — all routes are SSG (no SSR / API).
  output: "export",

  images: {
    // Cloudflare Pages serves static files only; the Next.js image optimizer
    // requires a server, so we render Wikimedia photos as-is.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/**",
      },
    ],
  },

  // /breed/[slug] becomes /breed/labrador/index.html etc. — friendlier on
  // static hosts that don't auto-resolve extensions.
  trailingSlash: true,
};

export default nextConfig;
