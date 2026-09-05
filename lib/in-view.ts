"use client";

import { useInView } from "motion/react";
import { type RefObject, useState } from "react";

/**
 * One viewport rule for every entrance on the site.
 *
 * Two boundaries, deliberately not the same one. Something starts when an edge
 * of it is a little way inside the frame, and only parks again once none of it
 * is left on screen. Share one boundary between the two and the line that
 * starts a run is the line that resets it — a scroll that rests on that line,
 * or a rubber-band, or a trackpad easing across it, flips the thing back and
 * forth. The gap between the two is what stops that.
 *
 * The start is an edge crossing a line, not a fraction of the box. A fraction
 * is a share of the element, so a three-line heading has to travel three times
 * as far into the frame as a one-line one before it reaches the same share —
 * the same reveal going off at a different height for every length of text.
 * Nought with the root inset top and bottom instead: whichever edge arrives
 * first has to be the same distance in, whatever the element is.
 */
export const ENTER_MARGIN = "-12% 0px -12% 0px";

/**
 * True from the moment the element is far enough into the frame until the
 * moment it has left it entirely. Replays: it goes false again on the way out,
 * so coming back to something plays it rather than finding it already up.
 *
 * Anything that reads it can only ever park while off screen, which is the
 * point — a reset that lands in view is a flicker.
 */
export function useReplayInView(ref: RefObject<Element | null>) {
  const entered = useInView(ref, { amount: 0, margin: ENTER_MARGIN });
  // Against the frame itself: true while any part of it is on screen at all.
  const anyPartOnScreen = useInView(ref, { amount: 0 });

  // Adjusted during render rather than in an effect, which is the sanctioned
  // way to derive state from a change and saves a frame of the wrong state.
  const [inView, setInView] = useState(false);
  if (entered && !inView) setInView(true);
  if (!anyPartOnScreen && inView) setInView(false);

  return inView;
}
