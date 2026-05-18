import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Cloudflare Pages — all routes are SSG (no SSR / API).
  output: "export",

  images: {
    // All breed photos are routed through images.weserv.nl (see
    // lib/image-proxy.ts) which gives us WebP + proper resizing + edge
    // caching — works on Cloudflare Pages without a Next image server.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/**",
      },
      {
        protocol: "https",
        hostname: "images.weserv.nl",
        pathname: "/**",
      },
    ],
  },

  // /breed/[slug] becomes /breed/labrador/index.html etc. — friendlier on
  // static hosts that don't auto-resolve extensions.
  trailingSlash: true,
};

export default nextConfig;
