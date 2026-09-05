"use client";

import { type MotionValue, motion } from "motion/react";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

/**
 * The bar across the foot of the screen: the ask on the left, the night's
 * facts beside it.
 *
 * Edge to edge and pinned to the bottom of whatever it is dropped into, so on
 * a pinned section it stays under the photographs for the whole flight rather
 * than scrolling with them. The white block is a segment of the bar rather
 * than a Button — it is full-bleed and full-height, which is a different
 * object from the site's inline CTAs, bevel and all.
 *
 * Nothing here keeps its own time. The facts held the light in turn on a timer
 * for a while; standing over a section that is already flying past, a second
 * thing on its own clock was one too many. The only thing that moves is the
 * rule along the top, and that is the section's own progress rather than an
 * animation — it is where you are in the flight, drawn on the line that was
 * already there.
 */

export type ShowFact = {
  /** The fact — a place, a count, a name. */
  label: string;
  /** What it is. One short line under it. */
  detail: string;
};

export function ShowBar({
  action,
  onAction,
  facts,
  progress,
  className,
}: {
  /** The label on the white block. */
  action: string;
  onAction: () => void;
  facts: ShowFact[];
  /**
   * Nought to one across whatever scroll the bar is sitting over. Given one,
   * the rule along the top fills white to say how far in you are. Left off,
   * it is a plain hairline.
   */
  progress?: MotionValue<number>;
  className?: string;
}) {
  return (
    <div
      className={cn("pb-[env(safe-area-inset-bottom)]", className)}
      /* The ground, and the header's scrim upside down: void rising out of the
         bottom edge and gone by the top of the bar. A backdrop-filter was here
         first and had almost nothing to blur against near-black photographs —
         it read as a flat grey patch. No taller than the bar, so what is
         passing behind meets the rule rather than a band of dark above it. */
      style={{
        background: "linear-gradient(to top, rgb(5 5 8 / 0.8), transparent)",
      }}
    >
      {/* Reversed on small screens: the ask goes to the bottom edge, where a
          thumb is, and the fact sits above it. Side by side from md, where the
          row owns the height and both halves take all of it. */}
      <div className="relative flex flex-col-reverse md:h-18 md:flex-row">
        <button
          type="button"
          onClick={onAction}
          /* No border of its own, and none above it: the rule belongs to the
             facts, so the block runs the full height of the bar and its top
             edge is the same line the rule is drawn on.

             No corner-cut either — the block runs to the edge of the screen,
             and a bevel on a full-bleed edge reads as a rendering fault
             rather than as the site's mark. tap still gives it the press. */
          className="tap text-void font-body flex h-14 shrink-0 items-center justify-center gap-2 bg-white px-6 text-base font-medium tracking-[0.02em] hover:brightness-90 md:h-full md:px-8 lg:px-10"
        >
          <Icon name="play_arrow" className="size-5" />
          {action}
        </button>

        {/* items-center rather than items-start: every fact is a label over a
            detail, so they are the same height and their tops line up either
            way — this also centres the run in the bar. */}
        <ul className="relative flex min-w-0 flex-1 items-center overflow-hidden">
          {/* The hairline, and the flight drawn along it. Two absolute rules
              rather than a border and a child: a border is painted inside the
              box and cannot be filled part-way, and the fill has to sit on
              exactly the line the rule is on, not a pixel under it. */}
          <span
            aria-hidden="true"
            className="bg-rule absolute inset-x-0 top-0 h-px"
          />
          {progress ? (
            <motion.span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px origin-left bg-white"
              style={{ scaleX: progress }}
            />
          ) : null}
          {facts.map((fact, index) => (
            <li
              key={fact.label}
              className={cn(
                // grow, so the three of them spread across the bar rather
                // than bunching against the white block with a third of it
                // empty after them. Grown from their content width rather
                // than from nothing: even thirds are narrower than the
                // longest fact between md and lg, and shrink-0 means a fact
                // that does not fit runs into the ul's clip rather than
                // ellipsising. This way the slack is shared and nothing is
                // ever cut.
                "relative shrink-0 px-6 py-3 md:grow md:px-5 md:py-0 lg:px-8",
                // The first one only, on small screens. Three two-line facts
                // side by side at 375px is three cramped columns, and stacked
                // they eat a quarter of the screen.
                index > 0 && "hidden md:block",
                // The divider, on the header's proportions: 32px of a 72px
                // bar is the same share as its 24 is of the 56px pill. Short
                // and centred rather than a full-height border, which cuts
                // the bar into boxes instead of dividing one.
                index > 0 &&
                  "md:before:bg-rule md:before:absolute md:before:top-1/2 md:before:left-0 md:before:h-8 md:before:w-px md:before:-translate-y-1/2 md:before:content-['']",
              )}
            >
              <p className="font-body text-base font-medium whitespace-nowrap text-white">
                {fact.label}
              </p>
              <p className="font-body text-ink-200 text-xs whitespace-nowrap lg:text-sm">
                {fact.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
