"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Home, Search, GitCompare, Info, Heart, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { FavoritesBadge } from "./FavoritesBadge";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { cn } from "@/lib/cn";

interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "ראשי", icon: Home },
  { href: "/quiz", label: "התחל משחק", icon: Sparkles },
  { href: "/breeds", label: "כל הגזעים", icon: Search },
  { href: "/compare", label: "השוואת גזעים", icon: GitCompare },
  { href: "/favorites", label: "המועדפים שלי", icon: Heart },
  { href: "/about", label: "על הפרויקט", icon: Info },
];

/**
 * Site-wide navigation. On desktop, shows inline links. On mobile,
 * collapses to a hamburger button that opens a slide-in drawer.
 */
export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <nav className="px-3 sm:px-4 py-3 sm:py-4 sticky top-0 z-30 backdrop-blur-md bg-bg/70 border-b border-border/60">
      <div className="mx-auto max-w-6xl flex items-center justify-between gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-display font-black text-lg sm:text-xl text-ink group whitespace-nowrap"
        >
          <span className="text-xl sm:text-2xl transition-transform group-hover:rotate-12">🐾</span>
          DoGame
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/breeds" className={deskLink(pathname, "/breeds")}>
            כל הגזעים
          </Link>
          <Link href="/compare" className={deskLink(pathname, "/compare")}>
            השוואה
          </Link>
          <Link href="/about" className={deskLink(pathname, "/about")}>
            על הפרויקט
          </Link>
          <ThemeSwitcher />
          <FavoritesBadge />
          <Link
            href="/quiz"
            className="inline-flex items-center gap-1 bg-primary text-white border-[3px] border-primary-deep px-4 py-2 rounded-[16px] font-display font-extrabold shadow-[0_3px_0_var(--color-primary-deep)] hover:-translate-y-px active:translate-y-0.5 active:shadow-[0_1px_0_var(--color-primary-deep)] transition-all"
          >
            התחל משחק
          </Link>
        </div>

        {/* Mobile: hamburger + theme + heart */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeSwitcher />
          <FavoritesBadge />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="פתח תפריט"
            aria-expanded={open}
            className="inline-flex items-center justify-center w-10 h-10 rounded-[12px] bg-surface text-ink border-[3px] border-border-strong shadow-[var(--shadow-clay-sm)] hover:border-primary-soft transition-colors"
          >
            <Menu className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              aria-label="סגור תפריט"
              className="fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 z-50 h-dvh w-[78vw] max-w-xs bg-surface border-l-[3px] border-border-strong shadow-[var(--shadow-clay-xl)] md:hidden flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="תפריט ראשי"
            >
              <div className="flex items-center justify-between p-4 border-b-2 border-border">
                <div className="inline-flex items-center gap-2 font-display font-black text-lg text-ink">
                  <span className="text-2xl">🐾</span>
                  DoGame
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="סגור"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-[12px] bg-bg-soft text-ink border-2 border-border-strong"
                >
                  <X className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>

              <ul className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
                {NAV_LINKS.map((link) => {
                  const active =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname?.startsWith(link.href);
                  const Icon = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 rounded-[16px] px-3.5 py-3 font-display font-extrabold transition-colors",
                          active
                            ? "bg-primary text-white border-[3px] border-primary-deep shadow-[0_3px_0_var(--color-primary-deep)]"
                            : "bg-bg-soft text-ink border-[3px] border-border-strong hover:bg-primary-tint"
                        )}
                      >
                        <Icon className="w-5 h-5" strokeWidth={2.5} />
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="p-4 border-t-2 border-border bg-bg-soft/50">
                <p className="text-xs text-ink-soft text-center font-medium">
                  🐾 נבנה באהבה לכלבי ישראל
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

function deskLink(pathname: string | null, target: string) {
  const active = pathname?.startsWith(target);
  return cn(
    "text-sm md:text-base font-display font-bold transition-colors",
    active ? "text-primary-deep" : "text-ink-soft hover:text-primary-deep"
  );
}
