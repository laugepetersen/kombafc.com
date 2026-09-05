"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { GalleryFlythrough } from "@/components/ui/gallery-flythrough";
import { ScrollFill } from "@/components/ui/heading-reveal";
import { Kicker } from "@/components/ui/kicker";

/**
 * The night itself, shot by Sebastian Stigsby. show-13 is held out of the
 * field — it is the one you end up inside.
 */
const FINALE_INDEX = 13;

const photos = Array.from({ length: 24 }, (_, i) => i + 1)
  .filter((n) => n !== FINALE_INDEX)
  .map((n) => `/show/show-${String(n).padStart(2, "0")}.webp`);

const finale = {
  src: `/show/show-${FINALE_INDEX}.webp`,
  alt: "Two fighters mid-exchange in the ring at K.B. Hallen, one covering on the ropes as the other lands, the referee close by",
};

/**
 * Where the camera comes to rest on the last photograph — the very end of the
 * pin. Stopping short of it leaves a stretch of scroll at the end where
 * nothing moves, which reads as the page having snagged.
 */
const ARRIVE_AT = 1;

/** Long enough that the corridor is flown through rather than endured. */
const SCROLL_LENGTH = "h-[500vh]";

function ramp(v: number, from: number, to: number) {
  return Math.min(1, Math.max(0, (v - from) / (to - from)));
}

export function PreviousShow() {
  const ref = useRef<HTMLDivElement>(null);

  // start start → end end: 0 the moment the pin takes hold and 1 as it lets
  // go, so progress is exactly the distance travelled while it is stuck.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  /* Every ramp is written out rather than given to useTransform as an input
     range. A range that stopped short of the end of its input climbed
     correctly and then came back down again instead of holding; the one range
     that ran all the way to 1 behaved. These clamp themselves. */
  const flight = useTransform(scrollYProgress, (v) => ramp(v, 0, ARRIVE_AT));

  // The vignette deepens on the approach, so the field falls away into the
  // dark and the last photograph arrives out of it rather than out of a crowd.
  const closingDark = useTransform(scrollYProgress, (v) =>
    ramp(v, ARRIVE_AT - 0.35, ARRIVE_AT),
  );

  return (
    // No frame and no rules: the pinned screen belongs to the photographs.
    <section ref={ref} className={`relative ${SCROLL_LENGTH}`}>
      <div className="bg-void sticky top-0 h-dvh overflow-clip">
        <GalleryFlythrough
          photos={photos}
          finale={finale}
          label="Photographs from the grand opening at K.B. Hallen, drifting past"
          progress={flight}
          className="absolute inset-0"
        />

        {/* Vignette. The field runs edge to edge and the copy sits on top of
              whatever happens to be passing, so the frame is darkened from the
              middle outwards: the corners go far enough down to read type
              against, and the photographs at the edges fall back instead of
              competing with whatever is arriving down the centre. Radial
              rather than a one-sided scrim — the copy is in a corner, and so
              is everything else that has to stay legible. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 68% 62% at 50% 50%, rgb(5 5 8 / 0.6) 0%, transparent 100%)",
          }}
        />

        {/* The same vignette again, brought up on the approach, so the middle
            closes down as the last photograph fills it and the copy holds. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: closingDark,
            background:
              "radial-gradient(ellipse 62% 56% at 50% 50%, rgb(5 5 8 / 0.28) 0%, transparent 100%)",
          }}
        />

        {/* Top left, on the container's own line so it starts where every
            other section's copy does. Never fades: it is the section's title
            and it stays over the photograph you arrive at. Pointer-transparent
            apart from the button, so the drift answers across the screen. */}
        {/* Dead centre of the frame, and centred in itself. */}
        <Container className="pointer-events-none relative flex h-full flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center">
            <Kicker>Previous show</Kicker>

            {/* text-relief, not text-chrome: the gradient is the h1's. The
                measure goes on the heading, where `ch` is its own type size —
                on the wrapper it resolves against the 16px body font and cuts
                the line to a third of the width. */}
            <ScrollFill
              as="h2"
              text="Rewatch the grand opening in K.B. Hallen."
              className="text-relief mt-6 max-w-[16ch] text-3xl font-black tracking-[-0.01em] uppercase italic md:mt-8 md:text-4xl xl:text-5xl"
            />

            <div className="pointer-events-auto mt-8 md:mt-12">
              <Button href="/rewatch" variant="secondary">
                Rewatch
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
