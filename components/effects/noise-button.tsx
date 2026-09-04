"use client";

import Link from "next/link";
import { type ReactNode, useState } from "react";

import { PixelNoise } from "@/components/effects/pixel-noise";

/**
 * Primary CTA whose dot field only runs while pointed at. The canvas stays mounted
 * so there is no first-hover stutter, but `enabled` stops the loop when idle:
 * fading out a canvas that is still churning behind opacity 0 costs exactly
 * what showing it costs. Focus counts as hover, or the effect would be
 * mouse-only.
 *
 * Still a copy of Button's look rather than a prop on it. Worth folding into
 * Button as a variant once it is used somewhere real rather than only in the
 * styleguide.
 */

/** Hoisted: passed inline these would be new arrays every render, and
 *  PixelNoise would rebuild its grid on each one. */
const WHITE = ["#ffffff", "#d2d2d7", "#a3a3ac"];
const OPACITIES = [0, 0, 0, 0.08, 0.15, 0.28, 0.45, 0.7];

export function NoiseButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="font-body relative inline-flex h-12 items-center justify-center overflow-clip bg-gradient-to-r from-violet-600 to-violet-500 px-6 text-base font-medium tracking-[0.02em] text-white drop-shadow-[0_0_3px_rgb(122_31_255/0.2)] [text-shadow:0_0_2px_rgb(255_255_255/0.2)]"
    >
      <span
        // Inset by 1px. Flush to the edge the dots read as breaking out of
        // the button rather than sitting inside it.
        className="absolute inset-px transition-opacity duration-300 ease-out"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        {/* No blend mode: overlay pushed the white dots back towards the violet
            fill underneath, which is what made them turn violet on hover. */}
        <PixelNoise
          enabled={hovered}
          // Tight pitch and single-pixel dots: at 48px tall anything coarser
          // reads as a pattern rather than as texture in the surface.
          pitch={4}
          dotSize={1}
          churn={0.2}
          fps={20}
          fadeUpwards={false}
          colors={WHITE}
          opacities={OPACITIES}
        />
      </span>

      <span className="relative">{children}</span>
    </Link>
  );
}
