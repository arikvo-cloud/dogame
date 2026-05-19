"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

interface NavLink {
  href: string;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { href: "/breeds", label: "גזעים" },
  { href: "/compare", label: "השוואה" },
  { href: "/favorites", label: "מועדפים" },
  { href: "/about", label: "על הפרויקט" },
];

/** Brutalist top nav — black border bar, mono accents, hard inverse hover. */
export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <nav className="sticky top-0 z-30 bg-white border-b-2 border-black">
      <div className="mx-auto max-w-7xl flex items-stretch h-14">
        {/* Logo cell */}
        <Link
          href="/"
          className="flex items-center gap-2 px-4 border-l-2 border-black font-mono uppercase font-bold text-sm tracking-[0.08em] hover:bg-black hover:text-white transition-colors"
        >
          <span>DOGAME</span>
          <span className="text-[color:var(--color-primary)]">▮</span>
          <span className="opacity-60">042</span>
        </Link>

        {/* Desktop links — each is a cell with hard divider */}
        <div className="hidden md:flex flex-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  "flex items-center px-5 border-l-2 border-black font-bold text-sm transition-colors " +
                  (active ? "bg-black text-white" : "hover:bg-black hover:text-white")
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Spacer for mobile */}
        <div className="flex-1 md:hidden" />

        {/* Right: primary CTA */}
        <Link
          href="/quiz"
          className="hidden md:flex items-center px-6 border-r-2 border-black bg-[color:var(--color-primary)] text-white font-bold text-sm uppercase tracking-wider hover:bg-black transition-colors"
        >
          התחל משחק ▶
        </Link>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="פתח תפריט"
          aria-expanded={open}
          className="md:hidden inline-flex items-center justify-center w-14 border-r-2 border-black bg-black text-white"
        >
          <Menu className="w-5 h-5" strokeWidth={3} />
        </button>
      </div>

      {/* Mobile overlay menu */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-white"
          onClick={() => setOpen(false)}
        >
          <div className="border-b-2 border-black h-14 flex items-stretch">
            <div className="flex-1 flex items-center px-4 font-mono uppercase font-bold text-sm tracking-[0.08em]">
              <span>DOGAME</span>
              <span className="text-[color:var(--color-primary)] mx-2">▮</span>
              <span className="opacity-60">042</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="סגור תפריט"
              className="inline-flex items-center justify-center w-14 border-r-2 border-black bg-black text-white"
            >
              <X className="w-5 h-5" strokeWidth={3} />
            </button>
          </div>
          <div className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-6 py-5 border-b-2 border-black font-display font-black text-3xl hover:bg-black hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/quiz"
              className="px-6 py-5 border-b-2 border-black bg-[color:var(--color-primary)] text-white font-display font-black text-3xl"
            >
              התחל משחק ▶
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
