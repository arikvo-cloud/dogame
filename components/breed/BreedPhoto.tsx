import Image from "next/image";
import type { Breed } from "@/lib/breeds/types";
import { cn } from "@/lib/cn";
import { proxyImage } from "@/lib/image-proxy";
import { BreedPhotoKenBurns } from "./BreedPhotoKenBurns";

interface Props {
  breed: Breed;
  /** Rendered size in CSS pixels */
  size: number;
  /** Border radius class (e.g. "rounded-[20px]") */
  rounded?: string;
  className?: string;
  /** Above-the-fold? Adds priority + disables lazy loading */
  priority?: boolean;
  /** Subtle "ken-burns" zoom on entrance — opt-in for hero usage only */
  kenBurns?: boolean;
}

/**
 * Breed photo. Default export is a Server Component that renders a static
 * `<Image>`. When `kenBurns` is true, falls through to the client variant
 * with a slow zoom on entrance.
 */
export function BreedPhoto({
  breed,
  size,
  rounded = "rounded-[22px]",
  className,
  priority,
  kenBurns = false,
}: Props) {
  if (kenBurns) {
    return (
      <BreedPhotoKenBurns
        breed={breed}
        size={size}
        rounded={rounded}
        className={className}
        priority={priority}
      />
    );
  }

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
      <Image
        src={proxyImage(breed.imageUrl, { w: size, h: size })}
        alt={`תמונה של ${breed.name}`}
        fill
        sizes={`${size}px`}
        className="object-cover"
        priority={priority}
        unoptimized
      />
    </div>
  );
}
