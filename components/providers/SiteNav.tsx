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

/** Minimal storytelling nav — soft border, backdrop blur, purple-pink CTA */
export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu on route change
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className="sticky top-0 z-30 transition-shadow duration-200"
      style={{
        background: "rgba(250,245,255,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid var(--color-border)`,
        boxShadow: scrolled ? "var(--shadow-clay)" : "none",
      }}
    >
      <div className="mx-auto max-w-5xl flex items-center h-14 px-5 gap-4">
        {/* Logo — RTL: appears on the right side visually */}
        <Link
          href="/"
          className="flex items-center gap-1.5 font-bold text-base text-[var(--color-primary)] hover:opacity-80 transition-opacity select-none"
          style={{ fontFamily: "var(--font-rubik), sans-serif" }}
        >
          <span
            className="w-7 h-7 rounded-[10px] gradient-brand inline-flex items-center justify-center text-white text-xs font-bold"
            aria-hidden
          >
            D
          </span>
          DoGame
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href ||
              pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "relative px-3 py-1.5 text-sm font-medium rounded-[10px] transition-colors duration-150",
                  active
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-ink-soft)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-tint)]",
                ].join(" ")}
              >
                {link.label}
                {active && (
                  <span
                    className="absolute bottom-0 inset-x-3 h-0.5 rounded-full gradient-brand"
                    aria-hidden
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Primary CTA — desktop */}
        <Link
          href="/quiz"
          className="hidden md:inline-flex btn-primary text-sm px-5 py-2.5"
        >
          התחל משחק ←
        </Link>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="פתח תפריט"
          aria-expanded={open}
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-[10px] text-[var(--color-ink-soft)] hover:bg-[var(--color-primary-tint)] hover:text-[var(--color-primary)] transition-colors"
        >
          <Menu className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>

      {/* Mobile overlay menu */}
      {open && (
        <div
          className="fixed inset-0 z-50"
          style={{
            background: "rgba(250,245,255,0.97)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          {/* Header row */}
          <div
            className="h-14 flex items-center px-5 gap-4"
            style={{ borderBottom: "1px solid var(--color-border)" }}
          >
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 font-bold text-base text-[var(--color-primary)]"
              style={{ fontFamily: "var(--font-rubik), sans-serif" }}
            >
              <span
                className="w-7 h-7 rounded-[10px] gradient-brand inline-flex items-center justify-center text-white text-xs font-bold"
                aria-hidden
              >
                D
              </span>
              DoGame
            </Link>
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="סגור תפריט"
              className="inline-flex items-center justify-center w-9 h-9 rounded-[10px] text-[var(--color-ink-soft)] hover:bg-[var(--color-primary-tint)] hover:text-[var(--color-primary)] transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>

          {/* Links */}
          <div className="p-5 flex flex-col gap-2">
            {NAV_LINKS.map((link) => {
              const active =
                pathname === link.href ||
                pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "px-4 py-3.5 rounded-[14px] font-bold text-2xl transition-colors",
                    active
                      ? "text-[var(--color-primary)] bg-[var(--color-primary-tint)]"
                      : "text-[var(--color-ink)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-tint)]",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* CTA in mobile menu */}
            <div className="mt-3">
              <Link
                href="/quiz"
                className="btn-primary w-full justify-center text-lg py-4"
              >
                התחל משחק ←
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
