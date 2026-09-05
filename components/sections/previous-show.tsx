"use client";

import { useRef } from "react";

import { SectionFrame } from "@/components/layout/section-frame";
import { Button } from "@/components/ui/button";
import { ScrollFill } from "@/components/ui/heading-reveal";
import { Kicker } from "@/components/ui/kicker";
import { PhotoTrack, type TrackPhoto } from "@/components/ui/photo-track";
import { StaggerReveal } from "@/components/ui/stagger-reveal";

/**
 * Roster shots standing in for the show gallery. Swapped for the night's own
 * photography once it lands.
 */
const photos: TrackPhoto[] = [
  {
    src: "/fighters/youssef-assouik.webp",
    alt: "Youssef Assouik with his belts",
  },
  { src: "/fighters/niclas-larsen.webp", alt: "Niclas Larsen" },
  { src: "/fighters/yassine-mahssoun.webp", alt: "Yassine Mahssoun" },
  { src: "/fighters/aleksander-bjerrum.webp", alt: "Aleksander Bjerrum" },
  { src: "/fighters/bedirhan-ceran.webp", alt: "Bedirhan Ceran" },
  { src: "/fighters/mathilde-kornval.webp", alt: "Mathilde Kornval" },
  { src: "/fighters/luca-coker.webp", alt: "Luca Coker" },
  { src: "/fighters/sakir-bakirov.webp", alt: "Sakir Bakirov" },
  { src: "/fighters/younes-sadi.webp", alt: "Younes Sadi" },
  { src: "/fighters/tais-o-donell.webp", alt: "Tais O'Donell" },
];

export function PreviousShow() {
  // What the track surfs against: this element's travel across the viewport.
  const ref = useRef<HTMLDivElement>(null);

  return (
    <SectionFrame markers>
      <div
        ref={ref}
        className="grid gap-12 px-6 py-16 md:px-12 lg:grid-cols-2 lg:items-center lg:py-24 xl:px-15"
      >
        <StaggerReveal className="flex flex-col items-start">
          <Kicker>Previous show</Kicker>

          {/* text-relief, not text-chrome: the gradient is the h1's alone. */}
          <ScrollFill
            as="h2"
            text="Rewatch the grand opening in K.B. Hallen."
            className="text-relief mt-6 max-w-[16ch] text-2xl font-black tracking-[-0.01em] uppercase italic md:mt-8 md:text-3xl xl:text-4xl"
          />

          <div className="mt-8 md:mt-12">
            <Button href="/rewatch" variant="secondary">
              Rewatch
            </Button>
          </div>
        </StaggerReveal>

        {/* The track paints past its column on every side — cards run off to
            the right as they recede, and the near one hangs below the line of
            the copy. Clipped here, and faded out towards the far end so the
            line dissolves into the section instead of stopping at an edge. */}
        <div className="relative -mr-6 h-[380px] overflow-clip md:-mr-12 lg:h-[520px] xl:-mr-15">
          <div className="absolute inset-0 [mask-image:linear-gradient(to_top_right,#000_30%,transparent_88%)]">
            <PhotoTrack
              photos={photos}
              progressRef={ref}
              className="absolute inset-0"
            />
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
