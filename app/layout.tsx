import type { Metadata, Viewport } from "next";
import { Heebo, Frank_Ruhl_Libre } from "next/font/google";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { Analytics } from "@/components/providers/Analytics";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

// Editorial Hebrew serif — used by Haaretz and other Israeli newspapers.
// Gives DoGame a "premium guide / magazine" feel for headings.
const frankRuhl = Frank_Ruhl_Libre({
  variable: "--font-frank-ruhl",
  subsets: ["hebrew", "latin"],
  weight: ["500", "700", "800", "900"],
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
      className={`${heebo.variable} ${frankRuhl.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Apply saved theme synchronously to avoid flash of wrong colors. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('dogame-theme-v1')||'system';var r=t==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;document.documentElement.setAttribute('data-theme',r);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:right-3 focus-visible:z-50 focus-visible:bg-primary focus-visible:text-white focus-visible:px-4 focus-visible:py-2 focus-visible:rounded-[14px] focus-visible:border-[3px] focus-visible:border-primary-deep focus-visible:font-display focus-visible:font-extrabold"
        >
          דלג לתוכן
        </a>
        <MotionProvider>{children}</MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
