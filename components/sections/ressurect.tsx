import Image from "next/image";

import { PixelNoise } from "@/components/effects/pixel-noise";
import { SectionFrame } from "@/components/layout/section-frame";
import { Button } from "@/components/ui/button";
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
          <div className="absolute inset-0 -z-20">
            <PixelNoise />
          </div>

          {/* Knocks the field back where the copy sits and lets it come through
              towards the opposite corner, so it reads as depth behind the text
              rather than texture across it. */}
          <div
            aria-hidden="true"
            className="from-void to-void/30 absolute inset-0 -z-10 bg-gradient-to-bl"
          />

          <Kicker>The Ressurect</Kicker>

          <h2 className="text-chrome text-paint-room mt-6 text-2xl font-black tracking-[-0.01em] uppercase italic md:mt-8 md:text-3xl xl:text-4xl">
            We&rsquo;re aiming
            <br />
            to set our mark
            <br />
            Q1, 2027.
          </h2>

          <div className="text-ink-200 mt-8 flex max-w-96 flex-col gap-4 text-base leading-[1.4]">
            <p>
              We have been silent for almost a year, but not out of the game.
            </p>
            <p>Just needed some time to prepare, for the next big thing..</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 md:mt-12">
            <Button href="/partners">Become Partner</Button>
            <Button href="/about" variant="secondary">
              About Us
            </Button>
          </div>
        </div>

        {/* Square when stacked; from md the grid row stretches it to match the
            text column, which is taller than 1:1 once the copy wraps. */}
        <div className="relative aspect-square max-lg:order-first lg:aspect-auto">
          <Image
            src="/ressurect.webp"
            alt="A KOMBA fighter in the ring, flags raised after the bout"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </SectionFrame>
  );
}
