import Image from "next/image";

import { SectionFrame } from "@/components/layout/section-frame";
import { Button } from "@/components/ui/button";
import { LineRise } from "@/components/ui/line-rise";
import { Kicker } from "@/components/ui/kicker";

/**
 * Spacer module. Carries no content — it exists so the vertical rules keep
 * running between the hero and the module below, and the gap reads as part of
 * the frame rather than as empty page.
 */
export function FrameSpacer({ className }: { className?: string }) {
  // Opens the run. Frames draw their own bottom edge and leave the top to the
  // frame above, and `first:` cannot reach this one — the hero is the first
  // child of the page, so this is never `:first-child` however first it is in
  // the grid. The opener is set here instead, where it is actually known.
  return (
    <SectionFrame
      className={className ?? "h-20"}
      // Opens the run and closes nothing. `first:` cannot reach this one — the
      // hero is the page's first child, so this is never `:first-child`
      // however first it is in the grid. And its bottom rule is stood down
      // because the block below draws that seam itself: a spacer has no ground
      // of its own, so a rule drawn here would sit on bare page immediately
      // above a coloured panel, which is the dark line under a light block
      // this whole arrangement exists to avoid.
      outerClassName="[&>[data-frame-rule]]:border-t [&>[data-frame-rule]]:border-b-0"
    />
  );
}

export function Ressurect() {
  return (
    // Draws both its own edges rather than leaving the top to the frame above.
    // The panel inside has a ground, and the point of the rules being overlays
    // is that they take the colour of what they cross — which only works if
    // the frame that owns the colour is the frame drawing the line. The spacer
    // above stands its bottom rule down so this seam still carries one.
    <SectionFrame outerClassName="[&>[data-frame-rule]]:border-t">
      <div className="grid lg:grid-cols-2">
        {/* The panel ground — a step up off the void, and the same one the
            partner panels carry, since they are the same layout. The dot field that used to lift this panel, the
            gradient that buried it and the violet wash that tinted it are all
            gone with it — the first two only existed to make the field
            readable, and the third would stop this being the token colour. */}
        <div className="border-rule bg-panel flex flex-col justify-center border-t px-6 py-12 md:px-12 md:py-16 lg:border-t-0 lg:border-r lg:px-12 xl:px-15 xl:py-20">
          <div className="flex flex-col">
            <Kicker>The Ressurect</Kicker>

            {/* text-relief, not text-chrome: the gradient is the h1's alone.
                Class list is a plain string — see the note in CLAUDE.md about
                what `cn` does to two custom text-* utilities. */}
            <LineRise
              as="h2"
              text={"We\u2019re aiming to set our mark Q1, 2027."}
              /* text-xl at the base step only. Every heading on the site is a step down at `md` and
                above and was level with the hero below it — measured on a 375
                window: the hero's largest line 29.3px, this one 29.3, and
                Previous show's 36.6, so the page's h1 was the *smallest* of
                the three. The hero cannot come up to meet them: "A new fight
                format." is 299px at text-2xl against a 343px container and
                374 at text-3xl, so it is already at the largest step that
                sets on one line. So the sections come down instead. */
              className="text-relief mt-6 text-xl font-black tracking-[-0.01em] uppercase italic md:mt-8 md:text-3xl xl:text-4xl"
            />

            <p className="text-ink-200 mt-8 max-w-96 text-base leading-[1.4]">
              We have been silent for almost a year, but not out of the game.
              Just needed some time to prepare, for the next big thing..
            </p>

            <div className="mt-8 md:mt-12">
              <Button href="/partnerships">Become Partner</Button>
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
