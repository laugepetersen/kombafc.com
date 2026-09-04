import Image from "next/image";

import { NoiseButton } from "@/components/effects/noise-button";
import { PixelNoise } from "@/components/effects/pixel-noise";
import { SectionFrame } from "@/components/layout/section-frame";
import { Kicker } from "@/components/ui/kicker";

/**
 * SCAFFOLDING — a scratch page for the dot-noise effect, not a real section.
 *
 * Eight placements to compare before committing to one. Nothing else imports
 * PixelNoise, so deleting this file and its line in app/page.tsx removes the
 * experiment entirely.
 */
function Swatch({
  label,
  note,
  children,
}: {
  label: string;
  note: string;
  children: React.ReactNode;
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

export function NoiseLab() {
  return (
    <SectionFrame>
      <div className="flex flex-col gap-12 px-6 py-16 md:px-12 md:py-20">
        <Kicker>Noise lab</Kicker>

        <div className="grid gap-12 lg:grid-cols-2">
          <Swatch label="A — Field" note="Default. Violet ramp, fading upward.">
            <div className="bg-void relative h-64 overflow-clip">
              <PixelNoise />
            </div>
          </Swatch>

          <Swatch
            label="B — Dense"
            note="Tighter pitch, faster churn. Reads as static."
          >
            <div className="bg-void relative h-64 overflow-clip">
              <PixelNoise pitch={4} dotSize={2} churn={0.25} fps={24} />
            </div>
          </Swatch>

          <Swatch
            label="C — Inside a primary CTA"
            note="Field clipped to the button, over the fill and under the label."
          >
            <div className="bg-void flex h-64 items-center justify-center">
              <NoiseButton href="/partners">Become Partner</NoiseButton>
            </div>
          </Swatch>

          <Swatch
            label="D — Neutral"
            note="Ink instead of violet, for use over photography."
          >
            <div className="bg-void relative h-64 overflow-clip">
              <PixelNoise
                colors={["#d2d2d7", "#a3a3ac", "#75757f"]}
                pitch={5}
                churn={0.12}
              />
            </div>
          </Swatch>

          <Swatch
            label="E — Inside a secondary CTA"
            note="Violet dots on the transparent variant, no blend needed."
          >
            <div className="bg-void flex h-64 items-center justify-center">
              <NoiseButton href="/about" variant="secondary">
                About Us
              </NoiseButton>
            </div>
          </Swatch>

          <Swatch
            label="F — Inside a CTA, on hover only"
            note="Both variants. Loop stops when idle, not just fades out."
          >
            <div className="bg-void flex h-64 items-center justify-center gap-4">
              <NoiseButton href="/partners" onHoverOnly>
                Become Partner
              </NoiseButton>
              <NoiseButton href="/about" variant="secondary" onHoverOnly>
                About Us
              </NoiseButton>
            </div>
          </Swatch>

          <Swatch
            label="G — Over an image"
            note="screen blend, so the dots read as light on the photo instead of dirt."
          >
            <div className="relative h-64 overflow-clip">
              <Image
                src="/ressurect.webp"
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0">
                <PixelNoise
                  className="mix-blend-screen"
                  pitch={6}
                  churn={0.1}
                  opacities={[0, 0, 0, 0, 0.08, 0.15, 0.3, 0.5]}
                />
              </div>
            </div>
          </Swatch>

          <Swatch
            label="H — Over the video"
            note="Same treatment on moving footage. Neutral dots, so it reads as grain."
          >
            <div className="bg-void relative h-64 overflow-clip">
              <video
                src="/hero-loop.mp4"
                poster="/hero-poster.webp"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0">
                <PixelNoise
                  className="mix-blend-screen"
                  colors={["#d2d2d7", "#c0a0ff", "#a3a3ac"]}
                  pitch={5}
                  dotSize={2}
                  churn={0.18}
                  fadeUpwards={false}
                  opacities={[0, 0, 0, 0, 0, 0.1, 0.2, 0.35]}
                />
              </div>
            </div>
          </Swatch>
        </div>
      </div>
    </SectionFrame>
  );
}
