"use client";

import Link from "next/link";
import { type ReactNode, useState } from "react";

import { PixelNoise } from "@/components/effects/pixel-noise";
import { cn } from "@/lib/utils";

/**
 * SCAFFOLDING — sample for the noise lab.
 *
 * Deliberately a copy of Button's look rather than a prop added to it: the
 * lab is meant to be deletable in one go, and the real Button should not grow
 * a slot for an experiment that may not survive. If a variant is chosen, fold
 * it into Button then and delete this.
 *
 * The field is clipped to the button box and sits above the fill but below the
 * label, so it reads as texture in the surface rather than something layered
 * over the whole control.
 */
const base =
  "relative inline-flex h-12 items-center justify-center overflow-clip px-6 font-body text-base font-medium tracking-[0.02em]";

export function NoiseButton({
  href,
  children,
  variant = "primary",
  onHoverOnly = false,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  onHoverOnly?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const showField = onHoverOnly ? hovered : true;

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={cn(
        base,
        variant === "primary" &&
          "bg-gradient-to-r from-violet-600 to-violet-500 text-white drop-shadow-[0_0_3px_rgb(122_31_255/0.2)] [text-shadow:0_0_2px_rgb(255_255_255/0.2)]",
        variant === "secondary" &&
          "border border-violet-300 shadow-[0_0_6px_0_rgb(157_92_255/0.2),inset_0_0_8px_0_rgb(0_0_0/0.2)]",
      )}
    >
      <span
        className="absolute inset-0 transition-opacity duration-300 ease-out"
        style={{ opacity: showField ? 1 : 0 }}
      >
        <PixelNoise
          enabled={showField}
          // Tight pitch and single-pixel dots: at 48px tall anything coarser
          // reads as a pattern rather than as texture in the surface.
          pitch={4}
          dotSize={1}
          churn={0.2}
          fps={20}
          fadeUpwards={false}
          colors={
            variant === "primary"
              ? ["#ffffff", "#ddccff", "#c0a0ff"]
              : ["#7a1fff", "#9d5cff", "#c0a0ff"]
          }
          opacities={[0, 0, 0, 0.08, 0.15, 0.28, 0.45, 0.7]}
          className={variant === "primary" ? "mix-blend-overlay" : undefined}
        />
      </span>

      <span
        className={cn(
          "relative",
          variant === "secondary" && "text-chrome-violet",
        )}
      >
        {children}
      </span>
    </Link>
  );
}
