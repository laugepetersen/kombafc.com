"use client";

import { useMotionValue } from "motion/react";

import { GalleryFlythrough } from "@/components/ui/gallery-flythrough";

/**
 * The same stills the home page flies through, mirrored here rather than
 * imported from that section — a section exporting its content to another
 * section is a dependency in the wrong direction, and this is a derivation
 * from a naming scheme rather than a list anybody maintains by hand. If the
 * shoot is ever recut, both counts move.
 *
 * show-13 is held out for the same reason it is there: it is the finale.
 */
const FINALE_INDEX = 13;
const STILL_COUNT = 29;

/**
 * How many of them this page actually asks for.
 *
 * The home page flies the length of the corridor and meets all twenty-eight.
 * This one stands still, and a still frame can only hold what is in it:
 * measured at STANDING_POINT, twenty cards are on stage and sixteen of those
 * are above fifteen per cent opacity. The other twelve photographs were being
 * fetched to be drawn nowhere — twenty-six requests against a backdrop that
 * can show sixteen, on five routes whose whole content is a heading and a
 * field.
 *
 * Sixteen rather than twenty because the last four are the ones fading out of
 * the dark at the back, where a repeat cannot be told from a photograph. The
 * component cycles whatever list it is given across the slots and already
 * pushes duplicates apart, so a shorter list costs density nothing.
 */
const PARKED_COUNT = 22;

const allPhotos = Array.from({ length: STILL_COUNT }, (_, i) => i + 1)
  .filter((n) => n !== FINALE_INDEX)
  .map((n) => `/show/show-${String(n).padStart(2, "0")}.webp`);

/* Sampled across the night rather than taken off the front of it. The files
   run in shot order, so the first sixteen are the first half of the evening —
   all walk-ins and no bouts. */
const photos = Array.from(
  { length: PARKED_COUNT },
  (_, i) =>
    allPhotos[Math.round((i * (allPhotos.length - 1)) / (PARKED_COUNT - 1))],
);

/**
 * Where in the corridor this parks.
 *
 * The home page's copy is a flight: scroll drives `progress` from nought to
 * one and the camera travels the length of the field. This one is a single
 * frame of that, held still — so the only thing that has to be chosen is
 * where to stand.
 *
 * 0.32, picked by looking. Far enough in that the near cards have gone past
 * the lens, and near enough that the field still reaches the edges of the
 * frame — at 0.45 the corridor has thinned to a handful of cards clustered
 * mid-screen, which reads as a few photographs rather than as depth.
 *
 * It also has to stay under `SETTLE_FROM` (0.72), which is where the component
 * begins damping the pointer drift out so the photograph you arrive at can
 * hold still. Past that this would be a background that stopped answering the
 * mouse, which is the one thing it is here to do.
 */
const STANDING_POINT = 0.32;

/**
 * The hold pages' backdrop: the show gallery, parked.
 *
 * One backdrop for all six of them, not one each. They are the same page with
 * different words on it — every route that is written but not open — and six
 * different grounds would say they are six different kinds of waiting.
 *
 * No clips. Every card holding footage is a live video decoder and browsers
 * hand out only a few — worth it on the home page where the corridor is the
 * content, and not worth it behind a form.
 *
 * The finale is required by the component but never reached from a standing
 * point this far back; it is passed as the still that would end the run.
 */
export function HoldBackdrop() {
  // A constant, not state. The component wants a MotionValue because the home
  // page hands it a scroll-driven one; here it never changes, so this is just
  // the shape of the argument rather than anything that moves.
  const progress = useMotionValue(STANDING_POINT);

  return (
    <GalleryFlythrough
      photos={photos}
      finale={{
        src: `/show/show-${String(FINALE_INDEX).padStart(2, "0")}.webp`,
        alt: "The night at K.B. Hallen",
      }}
      label="Photographs from the grand opening at K.B. Hallen"
      progress={progress}
      // The same value the camera is pinned to, so the field is thinned at
      // exactly the depth it is being looked at from. On the home page the
      // camera moves and this is left off — a card crossing the copy there is
      // over it for a moment, and the copy is travelling too. Here it would sit
      // on the heading for as long as anyone reads it.
      clearAt={STANDING_POINT}
      className="absolute inset-0"
    />
  );
}
