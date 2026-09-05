import Image from "next/image";

import { PixelNoise } from "@/components/effects/pixel-noise";
import { SectionFrame } from "@/components/layout/section-frame";
import { Button } from "@/components/ui/button";
import { ScrollFill } from "@/components/ui/heading-reveal";
import { Kicker } from "@/components/ui/kicker";

/**
 * Spacer module. Carries no content — it exists so the vertical rules keep
 * running between the hero and the module below, and the gap reads as part of
 * the frame rather than as empty page.
 */
export function FrameSpacer({ className }: { className?: string }) {
  return <SectionFrame className={className ?? "h-20"} />;
}

export function Ressurect() {
  return (
    <SectionFrame markers>
      <div className="grid lg:grid-cols-2">
        <div className="border-rule relative isolate flex flex-col justify-center overflow-clip border-t px-6 py-12 md:px-12 md:py-16 lg:border-t-0 lg:border-r lg:px-12 xl:px-15 xl:py-20">
          {/* Replaces the flat violet-200/5 that used to lift this panel. */}
          <div className="absolute inset-0 -z-30">
            <PixelNoise />
          </div>

          {/* Dims the field. Solid page colour at the top right where the copy
              sits, easing to half strength at the bottom left, so the noise
              only comes through towards the far corner and reads as depth
              behind the text rather than texture across it. */}
          <div
            aria-hidden="true"
            className="from-void to-void/50 absolute inset-0 -z-20 bg-gradient-to-bl"
          />

          {/* A wash of the same pale violet the hairline rules are cut from,
              5% at the top right to 10% at the bottom left. Sits above the dim
              rather than being folded into it: the dim is there to bury the
              noise, this is there to tint the panel, and they want to be
              tuned separately. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-bl from-violet-200/5 to-violet-200/10"
          />

          <div className="flex flex-col">
            <Kicker>The Ressurect</Kicker>

            {/* text-relief, not text-chrome: the gradient is the h1's alone.
                Class list is a plain string — see the note in CLAUDE.md about
                what `cn` does to two custom text-* utilities. */}
            <ScrollFill
              as="h2"
              text={"We\u2019re aiming to set our mark Q1, 2027."}
              className="text-relief mt-6 text-2xl font-black tracking-[-0.01em] uppercase italic md:mt-8 md:text-3xl xl:text-4xl"
            />

            <p className="text-ink-200 mt-8 max-w-96 text-base leading-[1.4]">
              We have been silent for almost a year, but not out of the game.
              Just needed some time to prepare, for the next big thing..
            </p>

            <div className="mt-8 flex flex-wrap gap-4 md:mt-12">
              <Button href="/partners">Become Partner</Button>
              <Button href="/about" variant="secondary">
                About Us
              </Button>
            </div>
          </div>
        </div>

        {/* No ratio here on purpose. Grid rows stretch, so whichever column
            is taller sets the height and the other fills it — the photograph
            grows with the copy, and short copy is pulled down to the
            photograph. The floor is what a fill image cannot supply for
            itself: it contributes no height, so without it the column would
            collapse to nothing once stacked, and on desktop the panel would
            be free to shrink to whatever the copy happened to need. */}
        <div className="relative min-h-125 max-lg:order-first">
          <Image
            src="/ressurect.webp"
            alt="A KOMBA fighter in the ring, flags raised after the bout"
            fill
            // The split is at lg, not md — below it the image is full width.
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </SectionFrame>
  );
}
