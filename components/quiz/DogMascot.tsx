"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export type MascotMood =
  | "smile"
  | "thinking"
  | "curious"
  | "wave"
  | "run"
  | "ball"
  | "brush"
  | "graduation"
  | "sun"
  | "shield";

interface DogMascotProps {
  mood?: MascotMood;
  className?: string;
  size?: number;
  /** Disable idle animations (blink, breathing). Useful when in a small space. */
  idle?: boolean;
}

/**
 * Inline SVG mascot — a friendly golden cartoon dog.
 * Idle: breathing scale, periodic blink, tail wag.
 * Mood changes eyes + optional prop (ball/shield/etc.).
 */
export function DogMascot({
  mood = "smile",
  className,
  size = 140,
  idle = true,
}: DogMascotProps) {
  const reduced = useReducedMotion();
  const [blink, setBlink] = useState(false);

  // Random blinks every 2.5-5s
  useEffect(() => {
    if (!idle || reduced) return;
    let mounted = true;
    function scheduleBlink() {
      const delay = 2500 + Math.random() * 2500;
      setTimeout(() => {
        if (!mounted) return;
        setBlink(true);
        setTimeout(() => mounted && setBlink(false), 160);
        scheduleBlink();
      }, delay);
    }
    scheduleBlink();
    return () => {
      mounted = false;
    };
  }, [idle, reduced]);

  const animateProps =
    idle && !reduced
      ? { scale: [1, 1.025, 1], y: [0, -2, 0] }
      : undefined;

  return (
    <motion.div
      className={cn("relative inline-flex items-end justify-center", className)}
      style={{ width: size, height: size }}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={
        animateProps
          ? { scale: 1, opacity: 1, ...{} }
          : { scale: 1, opacity: 1 }
      }
      transition={{ type: "spring", stiffness: 180, damping: 14 }}
    >
      <motion.svg
        viewBox="0 0 160 160"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        animate={animateProps}
        transition={
          animateProps
            ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      >
        <defs>
          <radialGradient id="furGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#F1C46E" />
            <stop offset="100%" stopColor="#C97B4B" />
          </radialGradient>
          <radialGradient id="muzzleGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#FBF7F0" />
            <stop offset="100%" stopColor="#F0E2C5" />
          </radialGradient>
        </defs>

        {/* Body shadow */}
        <ellipse cx="80" cy="148" rx="40" ry="6" fill="#3D2817" opacity="0.18" />

        {/* Tail */}
        <motion.path
          d="M120 110 Q140 100 138 80 Q136 70 130 70"
          stroke="url(#furGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          style={{ originX: "120px", originY: "110px" }}
          animate={!reduced ? { rotate: [-12, 12, -12] } : undefined}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Body */}
        <ellipse cx="80" cy="115" rx="45" ry="28" fill="url(#furGrad)" />

        {/* Front legs */}
        <rect x="58" y="125" width="12" height="22" rx="6" fill="url(#furGrad)" />
        <rect x="90" y="125" width="12" height="22" rx="6" fill="url(#furGrad)" />

        {/* Head */}
        <circle cx="80" cy="68" r="42" fill="url(#furGrad)" />

        {/* Ears */}
        <motion.path
          d="M40 50 Q30 75 45 92 Q52 85 55 65 Z"
          fill="#A35D35"
          animate={
            mood === "curious" && !reduced ? { rotate: [-6, 6, -6] } : undefined
          }
          style={{ originX: "45px", originY: "55px" }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        <path
          d="M120 50 Q130 75 115 92 Q108 85 105 65 Z"
          fill="#A35D35"
        />

        {/* Muzzle */}
        <ellipse cx="80" cy="80" rx="22" ry="18" fill="url(#muzzleGrad)" />

        {/* Nose */}
        <ellipse cx="80" cy="70" rx="6" ry="5" fill="#3D2817" />
        <ellipse cx="78" cy="68" rx="1.6" ry="1" fill="#FBF7F0" opacity="0.7" />

        {/* Eyes — based on mood + blink */}
        {blink ? renderClosedEyes() : renderEyes(mood)}

        {/* Mouth */}
        {renderMouth(mood)}

        {/* Cheeks */}
        <circle cx="55" cy="80" r="4" fill="#E8826B" opacity="0.45" />
        <circle cx="105" cy="80" r="4" fill="#E8826B" opacity="0.45" />

        {/* Optional prop */}
        {renderProp(mood, reduced)}
      </motion.svg>
    </motion.div>
  );
}

function renderClosedEyes() {
  return (
    <g>
      <path d="M56 62 Q62 65 68 62" stroke="#3D2817" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M94 62 Q100 65 106 62" stroke="#3D2817" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>
  );
}

function renderEyes(mood: MascotMood) {
  if (mood === "thinking") {
    return (
      <g>
        <path d="M58 60 Q63 56 68 60" stroke="#3D2817" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="100" cy="62" r="4" fill="#3D2817" />
        <circle cx="101" cy="61" r="1.2" fill="#FBF7F0" />
      </g>
    );
  }
  if (mood === "curious") {
    return (
      <g>
        <circle cx="62" cy="62" r="5" fill="#3D2817" />
        <circle cx="63" cy="61" r="1.6" fill="#FBF7F0" />
        <circle cx="100" cy="60" r="3.5" fill="#3D2817" />
        <circle cx="101" cy="59" r="1" fill="#FBF7F0" />
      </g>
    );
  }
  return (
    <g>
      <circle cx="62" cy="62" r="4" fill="#3D2817" />
      <circle cx="63" cy="61" r="1.2" fill="#FBF7F0" />
      <circle cx="100" cy="62" r="4" fill="#3D2817" />
      <circle cx="101" cy="61" r="1.2" fill="#FBF7F0" />
    </g>
  );
}

function renderMouth(mood: MascotMood) {
  if (mood === "thinking") {
    return (
      <path
        d="M75 88 Q80 90 85 88"
        stroke="#3D2817"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    );
  }
  return (
    <g>
      <path
        d="M70 86 Q80 95 90 86"
        stroke="#3D2817"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M77 88 Q80 95 83 88 Z" fill="#E8826B" opacity="0.85" />
    </g>
  );
}

function renderProp(mood: MascotMood, reduced: boolean | null) {
  if (mood === "ball") {
    return (
      <motion.circle
        cx="35"
        cy="120"
        r="10"
        fill="#E8826B"
        animate={!reduced ? { y: [-6, 0, -6] } : undefined}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
    );
  }
  if (mood === "graduation") {
    return (
      <g transform="translate(50, 18)">
        <rect x="0" y="14" width="40" height="6" fill="#3D2817" />
        <rect x="6" y="6" width="28" height="10" fill="#3D2817" />
        <circle cx="34" cy="22" r="2" fill="#E8B14A" />
      </g>
    );
  }
  if (mood === "sun") {
    return (
      <motion.circle
        cx="135"
        cy="30"
        r="10"
        fill="#E8B14A"
        animate={!reduced ? { scale: [1, 1.1, 1] } : undefined}
        transition={{ duration: 2, repeat: Infinity }}
      />
    );
  }
  if (mood === "brush") {
    return (
      <g transform="translate(20, 90) rotate(-20)">
        <rect x="0" y="0" width="14" height="20" rx="2" fill="#7BA05B" />
        <rect x="0" y="-6" width="14" height="6" fill="#3D2817" />
      </g>
    );
  }
  if (mood === "shield") {
    return (
      <g transform="translate(28, 90)">
        <path
          d="M0 0 L18 0 L18 12 Q18 20 9 24 Q0 20 0 12 Z"
          fill="#7BA05B"
          stroke="#3D2817"
          strokeWidth="1.5"
        />
      </g>
    );
  }
  return null;
}
