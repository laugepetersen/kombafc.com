"use client";

import { useState } from "react";

import { PixelNoise } from "@/components/effects/pixel-noise";
import { Button } from "@/components/ui/button";

/**
 * SCAFFOLDING — sample for the noise lab.
 *
 * A panel whose field only runs while pointed at. The canvas stays mounted so
 * there is no first-hover stutter, but `enabled` stops the loop when idle:
 * fading out a canvas that is still churning behind opacity 0 costs exactly
 * what showing it costs.
 *
 * Keyboard focus counts as hover here, or the effect would be mouse-only.
 */
export function NoiseCtaOnHover() {
  const [active, setActive] = useState(false);

  return (
    <div
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className="bg-ink-900 relative flex h-64 items-center justify-center overflow-clip"
    >
      <div
        className="absolute inset-0 transition-opacity duration-500 ease-out"
        style={{ opacity: active ? 1 : 0 }}
      >
        <PixelNoise
          enabled={active}
          pitch={6}
          churn={0.14}
          fps={20}
          fadeUpwards={false}
        />
      </div>

      <div className="relative flex flex-col items-center gap-6">
        <p className="font-heading text-2xl font-black uppercase italic">
          Hover me
        </p>
        <Button href="/partners" variant="secondary">
          Become Partner
        </Button>
      </div>
    </div>
  );
}
