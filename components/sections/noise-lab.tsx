import Image from "next/image";
import type { ReactNode } from "react";

import { NoiseButton } from "@/components/effects/noise-button";
import { PixelNoise } from "@/components/effects/pixel-noise";
import { SectionFrame } from "@/components/layout/section-frame";
import { Kicker } from "@/components/ui/kicker";

/**
 * SCAFFOLDING — a scratch page for the dot-noise effect, not a real section.
 *
 * Trimmed to the shortlist: the default field, the hover CTA, and screen blend
 * over media in both tones. Overlay, soft-light, colour-dodge, the dense field
 * and the panel-fill comparison were all cut.
 *
 * Nothing outside this file and noise-button.tsx imports PixelNoise, so
 * deleting both plus the line in app/page.tsx removes the experiment whole.
 */

/** Module scope, not inline: passed as literals these would be new arrays on
 *  every render and PixelNoise would rebuild its grid on each one. */
const VIOLET = ["#7a1fff", "#9d5cff", "#c0a0ff", "#5311c4"];
const WHITE = ["#ffffff", "#d2d2d7", "#c0a0ff"];
const SPARSE = [0, 0, 0, 0, 0, 0.08, 0.16, 0.3];

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8">
      <h3 className="border-rule text-ink-200 border-b pb-3 font-mono text-xs tracking-[0.2em] uppercase">
        {title}
      </h3>
      <div className="grid gap-10 lg:grid-cols-2">{children}</div>
    </div>
  );
}

function Swatch({
  label,
  note,
  children,
}: {
  label: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="font-heading text-sm tracking-[0.2em] text-violet-400 uppercase">
          {label}
        </p>
        <p className="text-ink-300 text-sm">{note}</p>
      </div>
      {children}
    </div>
  );
}

/** `isolate` keeps the blend from reaching past the tile to the page. */
function Media({
  video = false,
  children,
}: {
  video?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="bg-void relative isolate h-56 overflow-clip">
      {video ? (
        <video
          src="/hero-loop.mp4"
          poster="/hero-poster.webp"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <Image
          src="/ressurect.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}

export function NoiseLab() {
  return (
    <SectionFrame>
      <div className="flex flex-col gap-16 px-6 py-16 md:px-12 md:py-20">
        <Kicker>Noise lab</Kicker>

        <Group title="Field">
          <Swatch label="A — Default" note="Violet ramp, fading upward.">
            <div className="bg-void h-56 overflow-clip">
              <PixelNoise />
            </div>
          </Swatch>
        </Group>

        <Group title="Inside a control">
          <Swatch
            label="B — Primary CTA, on hover"
            note="White dots, no blend. Loop stops when idle."
          >
            <div className="bg-void flex h-40 items-center justify-center">
              <NoiseButton href="/partners">Become Partner</NoiseButton>
            </div>
          </Swatch>
        </Group>

        <Group title="Over a photograph — screen">
          <Swatch label="C — Violet" note="Dots as light in the shadows.">
            <Media>
              <PixelNoise
                className="mix-blend-screen"
                colors={VIOLET}
                opacities={SPARSE}
              />
            </Media>
          </Swatch>
          <Swatch label="D — White" note="Same, reading as clean grain.">
            <Media>
              <PixelNoise
                className="mix-blend-screen"
                colors={WHITE}
                opacities={SPARSE}
              />
            </Media>
          </Swatch>
        </Group>

        <Group title="Over the video — screen">
          <Swatch label="E — Violet" note="Tints the footage as it moves.">
            <Media video>
              <PixelNoise
                className="mix-blend-screen"
                colors={VIOLET}
                pitch={5}
                churn={0.18}
                opacities={SPARSE}
                fadeUpwards={false}
              />
            </Media>
          </Swatch>
          <Swatch label="F — White" note="Neutral grain over the footage.">
            <Media video>
              <PixelNoise
                className="mix-blend-screen"
                colors={WHITE}
                pitch={5}
                churn={0.18}
                opacities={SPARSE}
                fadeUpwards={false}
              />
            </Media>
          </Swatch>
        </Group>
      </div>
    </SectionFrame>
  );
}
