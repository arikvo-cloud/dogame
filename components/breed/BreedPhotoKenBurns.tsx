"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { Breed } from "@/lib/breeds/types";
import { cn } from "@/lib/cn";

interface Props {
  breed: Breed;
  size: number;
  rounded?: string;
  className?: string;
  priority?: boolean;
}

/**
 * Hero variant of BreedPhoto — slowly zooms from 1.15 → 1 over ~8s on mount.
 * Disabled for reduced-motion users.
 */
export function BreedPhotoKenBurns({
  breed,
  size,
  rounded = "rounded-[22px]",
  className,
  priority,
}: Props) {
  const reduced = useReducedMotion();
  const containerStyle = {
    width: size,
    height: size,
    background: `${breed.accent}30`,
  };

  if (!breed.imageUrl) {
    return (
      <div
        aria-hidden
        className={cn(
          "flex items-center justify-center border-[3px] border-border-strong",
          "shadow-[inset_0_2px_0_rgba(255,255,255,0.5),0_3px_0_var(--color-border-strong)]",
          rounded,
          className
        )}
        style={containerStyle}
      >
        <span className="text-5xl -mt-1">{breed.emoji}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden border-[3px] border-border-strong",
        "shadow-[inset_0_2px_0_rgba(255,255,255,0.5),0_3px_0_var(--color-border-strong)]",
        rounded,
        className
      )}
      style={containerStyle}
    >
      <motion.div
        className="absolute inset-0"
        initial={reduced ? false : { scale: 1.15 }}
        animate={reduced ? undefined : { scale: 1 }}
        transition={reduced ? undefined : { duration: 8, ease: "easeOut" }}
      >
        <Image
          src={breed.imageUrl}
          alt={`תמונה של ${breed.name}`}
          fill
          sizes={`${size}px`}
          className="object-cover"
          priority={priority}
        />
      </motion.div>
    </div>
  );
}
