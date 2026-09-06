"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { Container } from "@/components/layout/container";
import {
  GalleryFlythrough,
  LEAD_IN,
  RUN_OUT,
  flightScreens,
} from "@/components/ui/gallery-flythrough";
import { LineRise } from "@/components/ui/line-rise";
import { Kicker } from "@/components/ui/kicker";
import { type ShowFact, ShowBar } from "@/components/ui/show-bar";

/**
 * The night itself, shot by Sebastian Stigsby. show-13 is held out of the
 * field — it is the one you end up inside.
 */
const FINALE_INDEX = 13;
const STILL_COUNT = 29;

const photos = Array.from({ length: STILL_COUNT }, (_, i) => i + 1)
  .filter((n) => n !== FINALE_INDEX)
  .map((n) => `/show/show-${String(n).padStart(2, "0")}.webp`);

/** Walk-ins and a winner, trimmed to six seconds and silent. */
const clips = ["/show/clip-01.mp4", "/show/clip-02.mp4", "/show/clip-03.mp4"];

/** The corridor ends on footage rather than a still. */
const finale = {
  src: "/show/scroll-end.mp4",
  alt: "Closing footage from the night at K.B. Hallen",
};

/** The night in three lines, lit one at a time along the foot of the screen. */
const FACTS: ShowFact[] = [
  { label: "A World Champion", detail: "and two European at stake." },
  { label: "1500 Spectators", detail: "and more broadcasting" },
  { label: "KUNDO x G-SHOCK", detail: "Halftime show" },
];

/**
 * Where the camera comes to rest on the last photograph — the very end of the
 * pin. Stopping short of it leaves a stretch of scroll at the end where
 * nothing moves, which reads as the page having snagged.
 */
const ARRIVE_AT = 1;

function ramp(v: number, from: number, to: number) {
  return Math.min(1, Math.max(0, (v - from) / (to - from)));
}

export function PreviousShow() {
  const ref = useRef<HTMLDivElement>(null);

  /* The section's height comes off the trim rather than being written down
     beside it. Change one without the other and the camera covers a different
     distance per pixel scrolled, which is the whole feel of the thing. */
  const screens = flightScreens(LEAD_IN, RUN_OUT);

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

  /* A second tracker, for the section's arrival rather than the flight
     through it. The one above is pinned to the pin — it reads nought for the
     whole of the approach and only starts counting once the sticky child has
     taken hold, which is exactly the stretch this needs. Start at the bottom
     of the frame to start at the top of it: nought the moment any of the
     section is on screen, one the moment it covers the screen. */
  const { scrollYProgress: arrival } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });

  // The corridor comes up out of the page's own background rather than
  // arriving lit — a full scrim of void over it, cleared exactly as the
  // section finishes taking the screen.
  const openingDark = useTransform(arrival, (v) => 1 - v);

  return (
    // No frame and no rules: the pinned screen belongs to the photographs.
    <section
      ref={ref}
      className="relative"
      /* svh on both halves of the pin, and they have to be the same unit. The
         track was `vh` — which on a phone is the *large* viewport, the one you
         get with the URL bar hidden — against a child on `dvh`, which shrinks
         as the bar comes back. So the sticky screen and the distance it has to
         travel through moved independently every time the chrome collapsed,
         and the camera covered a different length of corridor per pixel
         scrolled depending on which way you had last scrolled. svh is the one
         that never moves. */
      style={{ height: `${(screens * 100).toFixed(2)}svh` }}
    >
      <div className="bg-void sticky top-0 h-svh overflow-clip">
        <GalleryFlythrough
          photos={photos}
          clips={clips}
          finale={finale}
          label="Photographs from the grand opening at K.B. Hallen, drifting past"
          progress={flight}
          className="absolute inset-0"
        />

        {/* The dark the photographs fade up out of. Over the corridor and
            under the copy, so the title and the button are legible against it
            from the moment the section appears, while what is behind them is
            still coming up. */}
        <motion.div
          aria-hidden="true"
          className="bg-void pointer-events-none absolute inset-0"
          style={{ opacity: openingDark }}
        />

        {/* The veil the copy is read against, and it goes where the copy
            goes. Stacked, the copy is dead centre, so the frame is darkened
            from the middle outwards — the photographs at the edges fall back
            instead of competing with whatever is arriving down the centre. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 md:hidden"
          style={{
            background:
              "radial-gradient(ellipse 68% 62% at 50% 50%, rgb(5 5 8 / 0.6) 0%, transparent 100%)",
          }}
        />

        {/* Side by side, the copy is in the bottom-left corner, so the veil
            runs the diagonal instead: weighted on that corner and gone by two
            thirds of the way to the opposite one, which leaves the top-right
            of the corridor at full strength. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 max-md:hidden"
          style={{
            background:
              "linear-gradient(to top right, rgb(5 5 8 / 0.6) 0%, transparent 62%)",
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

        {/* Centred in the frame while it is the only thing on it, and into
            the bottom-left corner once there is room — on the container's own
            line, so it starts where every other section's copy does, and
            clear of the bar below it. Never fades: it is the section's title
            and it stays over the photograph you arrive at. Pointer-transparent
            throughout, so the drift answers across the whole screen. */}
        <Container className="pointer-events-none relative flex h-full flex-col items-center justify-center text-center md:items-start md:justify-end md:pb-32 md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <Kicker>Previous show</Kicker>

            {/* text-relief, not text-chrome: the gradient is the h1's. The
                measure goes on the heading, where `ch` is its own type size —
                on the wrapper it resolves against the 16px body font and cuts
                the line to a third of the width. */}
            <LineRise
              as="h2"
              text="Rewatch the grand opening in K.B. Hallen."
              /* text-xl at the base step only. Every heading on the site is a step down at `md` and
                above and was level with the hero below it — measured on a 375
                window: the hero's largest line 29.3px, this one 29.3, and
                Previous show's 36.6, so the page's h1 was the *smallest* of
                the three. The hero cannot come up to meet them: "A new fight
                format." is 299px at text-2xl against a 343px container and
                374 at text-3xl, so it is already at the largest step that
                sets on one line. So the sections come down instead.

                  The measure comes off with it below md, and that is what
                  actually settles the break. 16ch is 240px at this step and
                  the heading is centred in a column that shrinks to fit, so
                  the box came out 217 wide and still set as "Rewatch the /
                  grand opening in / K.B. Hallen." — a first line ending on a
                  determiner, which was the size's fault only in part. Given
                  the container's own 343 it is "Rewatch the grand / opening
                  in K.B. Hallen.", 241 and 275. The measure stays from md,
                  where the type is large enough for 16ch to be the wider
                  constraint anyway. */
              className="text-relief mt-6 max-w-[16ch] text-xl font-black tracking-[-0.01em] uppercase italic max-md:max-w-none md:mt-8 md:text-4xl xl:text-5xl"
            />
          </div>
        </Container>

        {/* The ask, moved out of the middle and onto the bottom edge, where it
            can stay put over the whole flight instead of sitting under the
            heading on one screen. Outside the Container: that one is
            pointer-transparent so the drift answers across it, and this has a
            button in it. */}
        {/* To the archive, not to a player over this page. The bar used to
            open the main event on top of the flight you were still scrolling
            through, which answered "rewatch KOMBA 1.0" with one fight of the
            ten. /watch is the whole card. */}
        <ShowBar
          action="Rewatch KOMBA 1.0"
          href="/watch"
          facts={FACTS}
          // The same value that drives the camera, so the rule along the top
          // of the bar is exactly how far down the corridor you are.
          progress={flight}
          className="absolute inset-x-0 bottom-0"
        />
      </div>
    </section>
  );
}
