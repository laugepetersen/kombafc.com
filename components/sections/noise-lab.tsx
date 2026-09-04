import Image from "next/image";
import type { ReactNode } from "react";

import { NoiseButton } from "@/components/effects/noise-button";
import { PixelNoise } from "@/components/effects/pixel-noise";
import { SectionFrame } from "@/components/layout/section-frame";
import { Kicker } from "@/components/ui/kicker";

/**
 * SCAFFOLDING — a scratch page for the dot-noise effect, not a real section.
 *
 * Grouped so like is compared with like: fields on their own, inside controls,
 * over media, and standing in for a panel fill. Nothing outside this file and
 * noise-button.tsx imports PixelNoise, so deleting both plus the line in
 * app/page.tsx removes the experiment whole.
 */

const VIOLET = ["#7a1fff", "#9d5cff", "#c0a0ff", "#5311c4"];
const NEUTRAL = ["#d2d2d7", "#a3a3ac", "#75757f"];
const SPARSE = [0, 0, 0, 0, 0, 0.08, 0.16, 0.3];
const FAINT = [0, 0, 0, 0, 0, 0, 0.06, 0.12, 0.2];

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

/** `isolate` keeps a blend mode from reaching past the tile to the page. */
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

/**
 * The Ressurect copy at panel scale, so background options are judged on
 * legibility against real type rather than in the abstract.
 */
function Panel({
  background,
  children,
}: {
  background: string;
  children?: ReactNode;
}) {
  return (
    <div className={`relative isolate overflow-clip ${background}`}>
      {children}
      <div className="relative flex flex-col gap-4 p-8">
        <Kicker>The Ressurect</Kicker>
        <p className="text-chrome font-heading text-2xl font-black uppercase italic">
          We&rsquo;re aiming
          <br />
          to set our mark
        </p>
        <p className="text-ink-200 max-w-80 text-base leading-[1.4]">
          We have been silent for almost a year, but not out of the game.
        </p>
      </div>
    </div>
  );
}

export function NoiseLab() {
  return (
    <SectionFrame>
      <div className="flex flex-col gap-16 px-6 py-16 md:px-12 md:py-20">
        <Kicker>Noise lab</Kicker>

        <Group title="Fields">
          <Swatch label="A — Default" note="Violet ramp, fading upward.">
            <div className="bg-void h-56 overflow-clip">
              <PixelNoise />
            </div>
          </Swatch>
          <Swatch label="B — Dense" note="Tighter pitch, faster churn.">
            <div className="bg-void h-56 overflow-clip">
              <PixelNoise pitch={4} churn={0.25} fps={24} />
            </div>
          </Swatch>
        </Group>

        <Group title="Inside a control">
          <Swatch label="C — Primary" note="Overlay blend over the fill.">
            <div className="bg-void flex h-40 items-center justify-center">
              <NoiseButton href="/partners">Become Partner</NoiseButton>
            </div>
          </Swatch>
          <Swatch label="D — On hover only" note="Loop stops when idle.">
            <div className="bg-void flex h-40 items-center justify-center gap-4">
              <NoiseButton href="/partners" onHoverOnly>
                Become Partner
              </NoiseButton>
              <NoiseButton href="/about" variant="secondary" onHoverOnly>
                About Us
              </NoiseButton>
            </div>
          </Swatch>
        </Group>

        <Group title="Over a photograph">
          <Swatch
            label="E — Screen, violet"
            note="Dots as light. Shows in shadow, gone in highlight."
          >
            <Media>
              <PixelNoise
                className="mix-blend-screen"
                colors={VIOLET}
                opacities={SPARSE}
              />
            </Media>
          </Swatch>
          <Swatch
            label="F — Overlay, violet"
            note="Tints with the image rather than sitting on it."
          >
            <Media>
              <PixelNoise
                className="mix-blend-overlay"
                colors={VIOLET}
                pitch={5}
              />
            </Media>
          </Swatch>
          <Swatch
            label="G — Soft light"
            note="Gentlest. Reads as emulsion, not an effect."
          >
            <Media>
              <PixelNoise
                className="mix-blend-soft-light"
                colors={VIOLET}
                pitch={5}
                churn={0.12}
              />
            </Media>
          </Swatch>
          <Swatch
            label="H — Colour dodge, sparse"
            note="Hot specks. Strongest of the four."
          >
            <Media>
              <PixelNoise
                className="mix-blend-color-dodge"
                colors={["#c0a0ff", "#ffffff"]}
                pitch={7}
                opacities={[0, 0, 0, 0, 0, 0, 0.1, 0.25]}
              />
            </Media>
          </Swatch>
        </Group>

        <Group title="Over the video">
          <Swatch label="I — Screen, neutral" note="Reads as grain.">
            <Media video>
              <PixelNoise
                className="mix-blend-screen"
                colors={NEUTRAL}
                pitch={5}
                churn={0.18}
                opacities={SPARSE}
                fadeUpwards={false}
              />
            </Media>
          </Swatch>
          <Swatch
            label="J — Overlay, violet"
            note="Pushes the footage violet as it moves."
          >
            <Media video>
              <PixelNoise
                className="mix-blend-overlay"
                colors={VIOLET}
                pitch={5}
                churn={0.15}
                fadeUpwards={false}
              />
            </Media>
          </Swatch>
          <Swatch
            label="K — Soft light, violet"
            note="Barely there. Survives bright frames."
          >
            <Media video>
              <PixelNoise
                className="mix-blend-soft-light"
                colors={VIOLET}
                pitch={4}
                churn={0.2}
                fadeUpwards={false}
              />
            </Media>
          </Swatch>
          <Swatch
            label="L — Violet wash + screen"
            note="Flat tint under the dots, for a graded look."
          >
            <Media video>
              <div className="absolute inset-0 bg-violet-700/25" />
              <PixelNoise
                className="mix-blend-screen"
                colors={NEUTRAL}
                pitch={5}
                opacities={SPARSE}
                fadeUpwards={false}
              />
            </Media>
          </Swatch>
        </Group>

        <Group title="As a panel fill — replacing violet-200/5">
          <Swatch label="M — Current" note="Control: flat violet-200 at 5%.">
            <Panel background="bg-violet-200/5" />
          </Swatch>
          <Swatch
            label="N — Noise only"
            note="No flat fill. Texture carries the panel."
          >
            <Panel background="bg-transparent">
              <div className="absolute inset-0">
                <PixelNoise
                  colors={VIOLET}
                  pitch={6}
                  churn={0.05}
                  fps={12}
                  opacities={FAINT}
                  fadeUpwards={false}
                />
              </div>
            </Panel>
          </Swatch>
          <Swatch
            label="O — Flat + noise"
            note="Both. Keeps the lift, adds movement."
          >
            <Panel background="bg-violet-200/5">
              <div className="absolute inset-0">
                <PixelNoise
                  colors={VIOLET}
                  pitch={6}
                  churn={0.05}
                  fps={12}
                  opacities={FAINT}
                  fadeUpwards={false}
                />
              </div>
            </Panel>
          </Swatch>
          <Swatch
            label="P — Noise, fading up"
            note="Densest at the base, like the reference."
          >
            <Panel background="bg-transparent">
              <div className="absolute inset-0">
                <PixelNoise
                  colors={VIOLET}
                  pitch={6}
                  churn={0.06}
                  fps={12}
                  opacities={[0, 0, 0, 0, 0.08, 0.16, 0.28]}
                />
              </div>
            </Panel>
          </Swatch>
        </Group>
      </div>
    </SectionFrame>
  );
}
