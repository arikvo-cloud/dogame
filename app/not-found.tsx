"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Home, Search } from "lucide-react";
import { DogMascot } from "@/components/quiz/DogMascot";

export default function NotFound() {
  return (
    <main id="main" className="min-h-dvh bg-clay py-16 px-4 flex items-center justify-center">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 14 }}
          className="inline-block"
        >
          <div className="relative">
            <div className="bg-surface rounded-full p-5 border-[4px] border-border-strong shadow-[var(--shadow-clay-xl)] inline-block">
              <DogMascot mood="thinking" size={160} />
            </div>
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute -top-4 -right-6 bg-warning text-ink border-[3px] border-warning-deep rounded-full px-4 py-1.5 font-display font-black text-lg shadow-[0_3px_0_var(--color-warning-deep)]"
            >
              ?
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-6xl md:text-8xl font-black text-primary-deep leading-none"
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="mt-4 text-2xl md:text-4xl font-black text-ink leading-tight">
            איבדנו את העקבות 🐾
          </h2>
          <p className="mt-3 text-ink-soft text-lg max-w-md mx-auto font-medium">
            הדף הזה ברח לטיול ארוך. אבל אל דאגה — יש לנו עוד 37 גזעים לגלות!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 items-center justify-center"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-white border-[3px] border-primary-deep px-6 py-3.5 rounded-[20px] font-display font-extrabold text-lg shadow-[var(--shadow-glow-primary)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[var(--shadow-clay-press)] transition-all"
          >
            <Home className="w-5 h-5" strokeWidth={2.5} />
            לעמוד הבית
          </Link>
          <Link
            href="/breeds"
            className="inline-flex items-center gap-2 bg-surface text-ink border-[3px] border-border-strong px-6 py-3.5 rounded-[20px] font-display font-extrabold text-lg shadow-[var(--shadow-clay)] hover:-translate-y-0.5 transition-transform"
          >
            <Search className="w-5 h-5" strokeWidth={2.5} />
            לדפדף בגזעים
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
