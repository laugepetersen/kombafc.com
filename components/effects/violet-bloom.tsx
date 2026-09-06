/**
 * The violet bloom the footer sits in, and now the events hold as well.
 *
 * Four layers. Three radial gradients whose centres are all parked *below* the
 * bottom edge, so what is in frame is only the top of each falloff — a radial
 * centred in its box reads as a disc painted on the page; cut off at its own
 * waist it reads as a light source somewhere under the fold. Then a vertical
 * wash under the lot of them.
 *
 * Every ramp passes through violet-950 before it reaches transparent, and that
 * is the whole trick. Run one straight out to transparent and the last stop
 * draws a visible ellipse across the panel — the light stops having a falloff
 * and starts having an outline. Taken down to the darkest step on the ramp
 * first, the tail is already page-dark by the time it fades, so there is
 * nothing left to see an edge of.
 *
 * The three differ on purpose. The core is wide, off-centre and carries the
 * lift; the lobes sit either side at different depths, widths and stops, so
 * the ramp on the left is not the ramp on the right and the horizon comes out
 * uneven rather than as a symmetrical arch. That asymmetry is the only reason
 * there are three of these instead of one.
 *
 * Every stop is a share of the box rather than a length, so the same light
 * fills a footer panel and a whole viewport without a second set of numbers.
 * That is what makes it portable, and it is why this is a component rather
 * than a utility in globals.css: what the two callers share is the stack of
 * layers *and* the element they sit on, and a utility only carries the first.
 * It still reads the ramp through `var()`, so retuning the violets carries
 * everywhere without a second edit.
 */
const bloom = [
  /* Core. 124% down and 44% across — off both centres, so the brightest point
     is not where the eye goes looking for it. violet-300 never actually shows
     at that depth; it is what the visible stops ramp towards, which is what
     keeps the bottom edge lit from beyond the frame rather than topping out
     inside it.

     Both centres and the radius come from registered custom properties, which
     is what lets `bloom-alive` tween them — the numbers written here *are* the
     resting values, and the fallbacks say so for anyone reading this without
     the stylesheet open. See the note on --bloom-sink in globals.css.

     The radius is a multiplier on the two figures rather than a size of its
     own, so the core keeps its proportions as it draws in. */
  `radial-gradient(
     calc(86% * var(--bloom-spread, 1)) calc(82% * var(--bloom-spread, 1))
     at var(--bloom-drift, 44%) var(--bloom-sink, 124%),
     var(--color-violet-300) 0%,
     var(--color-violet-400) 14%,
     var(--color-violet-500) 27%,
     var(--color-violet-600) 40%,
     var(--color-violet-800) 58%,
     var(--color-violet-950) 76%,
     transparent 94%)`,

  /* Left lobe — nearer the surface, so the horizon lifts on this side before
     the core reaches it. Its own clock for the rise, so the two never lift
     together, but the core's scale, so they draw in and open out as one
     light. */
  `radial-gradient(
     calc(54% * var(--bloom-spread, 1)) calc(62% * var(--bloom-spread, 1))
     at 6% var(--bloom-lobe, 116%),
     color-mix(in oklab, var(--color-violet-500) 55%, transparent) 0%,
     color-mix(in oklab, var(--color-violet-800) 60%, transparent) 44%,
     transparent 80%)`,

  /* Right lobe — deeper, darker and narrower, which drags that side back down
     and stops the two halves mirroring. The one layer that never moves and
     never scales: with all three going the horizon reads as a wobble, and
     something has to stay still for the rest to be seen moving against. */
  `radial-gradient(42% 46% at 94% 110%,
     color-mix(in oklab, var(--color-violet-700) 70%, transparent) 0%,
     transparent 78%)`,

  /* The wash. Carries no light of its own — it only tints the half of the
     panel the radials have not reached, so they arrive into violet rather
     than into black. */
  `linear-gradient(to bottom,
     transparent 0%,
     color-mix(in oklab, var(--color-violet-950) 55%, transparent) 62%,
     color-mix(in oklab, var(--color-violet-900) 70%, transparent) 100%)`,
].join(",");

/**
 * Full-bleed, and it expects a positioned ancestor to fill — every caller so
 * far is a `relative` section that also clips, which is what keeps the parts
 * of the radials that sit below the fold from lengthening the page.
 *
 * The breathing is not optional. It was a prop while the events hold had a
 * dome of its own swelling over the top of this, and two clocks on one screen
 * read as a wobble — that dome is gone, both callers wanted it on, and a flag
 * that every caller passes is not a choice, it is a default written the long
 * way round. `bloom-alive` carries the five clocks; see globals.css.
 *
 * The resting state is the brightest state — every keyframe moves away from
 * it — so the motion only ever takes prominence away from the light, never
 * adds it.
 */
export function VioletBloom() {
  return (
    <div
      aria-hidden="true"
      className="bloom-alive pointer-events-none absolute inset-0"
      style={{ backgroundImage: bloom }}
    />
  );
}
