import type { Metadata, Viewport } from "next";
import { Heebo, Rubik } from "next/font/google";
import { MotionProvider } from "@/components/providers/MotionProvider";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
  weight: ["700", "800", "900"],
  display: "swap",
});

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dogame.pages.dev";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "DoGame · מצא את הכלב המושלם בשבילך",
  description:
    "משחק אינטראקטיבי שעוזר לך למצוא את גזע הכלב המתאים לסגנון החיים שלך — לפני שמביאים כלב הביתה.",
  keywords: ["כלבים", "גזעי כלבים", "אימוץ", "בחירת כלב", "כלב משפחתי"],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.svg" }],
  },
  openGraph: {
    title: "DoGame · מצא את הכלב המושלם בשבילך",
    description: "משחק התאמת גזע — בחירה אחראית של כלב לסגנון החיים שלך.",
    locale: "he_IL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DoGame · מצא את הכלב המושלם בשבילך",
    description: "משחק התאמת גזע — בחירה אחראית של כלב לסגנון החיים שלך.",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF7ED",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} ${rubik.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:right-3 focus-visible:z-50 focus-visible:bg-primary focus-visible:text-white focus-visible:px-4 focus-visible:py-2 focus-visible:rounded-[14px] focus-visible:border-[3px] focus-visible:border-primary-deep focus-visible:font-display focus-visible:font-extrabold"
        >
          דלג לתוכן
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
