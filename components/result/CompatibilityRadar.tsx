"use client";

import { motion } from "motion/react";
import { TRAITS, TRAIT_KEYS, type TraitVector } from "@/lib/traits";

interface Props {
  user: TraitVector;
  breed: TraitVector;
  size?: number;
}

/** Pure-SVG radar chart comparing user-preferences and breed traits. */
export function CompatibilityRadar({ user, breed, size = 260 }: Props) {
  const radius = size / 2 - 32;
  const cx = size / 2;
  const cy = size / 2;
  const axes = TRAIT_KEYS;
  const angleStep = (Math.PI * 2) / axes.length;

  function pointFor(value: number, idx: number) {
    const r = (value / 10) * radius;
    const angle = -Math.PI / 2 + idx * angleStep;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  const userPolygon = axes
    .map((k, i) => pointFor(user[k], i).join(","))
    .join(" ");
  const breedPolygon = axes
    .map((k, i) => pointFor(breed[k], i).join(","))
    .join(" ");

  const gridLevels = [2, 4, 6, 8, 10];

  return (
    <div className="flex flex-col items-center">
      <dl className="sr-only">
        {axes.map((k) => (
          <span key={k}>
            <dt>{TRAITS[k].label}</dt>
            <dd>
              {`ההעדפה שלך: ${user[k]} מתוך 10. הגזע: ${breed[k]} מתוך 10.`}
            </dd>
          </span>
        ))}
      </dl>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden
        role="img"
      >
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#FFFBF5" />
            <stop offset="100%" stopColor="#FFF7ED" />
          </radialGradient>
        </defs>

        {/* Background circle */}
        <circle cx={cx} cy={cy} r={radius + 4} fill="url(#bgGrad)" />

        {/* Grid polygons */}
        {gridLevels.map((level) => {
          const points = axes
            .map((_, i) => pointFor(level, i).join(","))
            .join(" ");
          return (
            <polygon
              key={level}
              points={points}
              fill="none"
              stroke="#FED7AA"
              strokeWidth={1.5}
            />
          );
        })}

        {/* Axes lines + labels */}
        {axes.map((k, i) => {
          const [labelX, labelY] = pointFor(11.8, i);
          return (
            <g key={k}>
              <line
                x1={cx}
                y1={cy}
                x2={pointFor(10, i)[0]}
                y2={pointFor(10, i)[1]}
                stroke="#FED7AA"
                strokeWidth={1.5}
              />
              <text
                x={labelX}
                y={labelY}
                fontSize={10}
                fill="#9A3412"
                textAnchor="middle"
                dominantBaseline="middle"
                fontWeight={700}
              >
                {TRAITS[k].label}
              </text>
            </g>
          );
        })}

        {/* Breed polygon (background) — animates as a fluid shape from center */}
        <motion.polygon
          points={breedPolygon}
          fill="#F97316"
          fillOpacity={0.32}
          stroke="#C2410C"
          strokeWidth={2.5}
          strokeLinejoin="round"
          style={{ originX: `${cx}px`, originY: `${cy}px` }}
          initial={{ scale: 0, opacity: 0, rotate: -90 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{
            duration: 0.85,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.15,
          }}
        />

        {/* User polygon (foreground) */}
        <motion.polygon
          points={userPolygon}
          fill="#2563EB"
          fillOpacity={0.22}
          stroke="#1D4ED8"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeDasharray="5 4"
          style={{ originX: `${cx}px`, originY: `${cy}px` }}
          initial={{ scale: 0, opacity: 0, rotate: 90 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{
            duration: 0.85,
            delay: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        />

        {/* Vertex pulse on the breed polygon */}
        {axes.map((k, i) => {
          const [px, py] = pointFor(breed[k], i);
          return (
            <motion.circle
              key={k}
              cx={px}
              cy={py}
              r={3}
              fill="#C2410C"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.6, 1], opacity: [0, 1, 1] }}
              transition={{ delay: 1.0 + i * 0.04, duration: 0.45 }}
            />
          );
        })}
      </svg>
      <div className="flex gap-4 mt-2 text-xs text-ink-soft font-display font-bold">
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded-md bg-primary border-2 border-primary-deep" />
          הגזע
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded-md bg-accent/40 border-2 border-accent-deep border-dashed" />
          ההעדפות שלך
        </div>
      </div>
    </div>
  );
}
