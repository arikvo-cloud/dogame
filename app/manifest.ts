import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DoGame · התאמת גזע כלב לסגנון החיים שלך",
    short_name: "DoGame",
    description:
      "משחק אינטראקטיבי שעוזר לך למצוא את גזע הכלב המתאים לסגנון החיים שלך.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FFF7ED",
    theme_color: "#F97316",
    lang: "he",
    dir: "rtl",
    categories: ["lifestyle", "education", "utilities"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "התחל שאלון",
        short_name: "שאלון",
        url: "/quiz",
      },
      {
        name: "כל הגזעים",
        short_name: "גזעים",
        url: "/breeds",
      },
      {
        name: "המועדפים שלי",
        short_name: "מועדפים",
        url: "/favorites",
      },
    ],
  };
}
