"use client";

import { type MotionValue, motion } from "motion/react";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

import { LineReveal } from "@/components/ui/heading-reveal";
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
 * The facts sit still side by side when there is room for all of them. Below
 * md there is room for one, so they take it in turns instead, each arriving on
 * the site's line reveal and dropping back out before the next comes up.
 *
 * The rule along the top is the only other thing that moves, and it is not an
 * animation: it is how far into the scroll below you are, drawn on the line
 * that was already there.
 */

/** How long a fact holds the strip on small screens, once it has arrived. */
const DWELL_MS = 2600;

/**
 * And how long it has to get out of the way. The reveal runs a second with a
 * tenth between its lines, so the next one waits that out rather than rising
 * through the one that is still falling — stacked in the same cell, the two
 * would cross at half opacity in the middle of the strip.
 */
const CLEAR_MS = 1100;

/** Below Tailwind's md, which is where the row becomes a single strip. */
const STACKED = "(max-width: 47.999rem)";
const REDUCED = "(prefers-reduced-motion: reduce)";

export type ShowFact = {
  /** The fact — a place, a count, a name. */
  label: string;
  /** What it is. One short line under it. */
  detail: string;
};

/** The two lines, sized the same wherever they are drawn. */
const LABEL_CLASS = "text-base font-medium text-white";
const DETAIL_CLASS = "text-ink-200 text-xs lg:text-sm";

function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    useCallback(() => window.matchMedia(query).matches, [query]),
    () => false,
  );
}

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
  const stacked = useMediaQuery(STACKED);
  const reduce = useMediaQuery(REDUCED);
  const cycling = stacked && !reduce && facts.length > 1;

  /* Two states rather than one index, because the run has a gap in it: the
     fact on screen goes down and out, nothing is up for a moment, then the
     next comes in. An index alone cannot say "none of them". */
  const [index, setIndex] = useState(0);
  const [up, setUp] = useState(true);

  useEffect(() => {
    if (!cycling) return;

    const id = window.setTimeout(
      () => {
        if (up) {
          setUp(false);
          return;
        }
        setIndex((i) => (i + 1) % facts.length);
        setUp(true);
      },
      up ? DWELL_MS : CLEAR_MS,
    );

    return () => window.clearTimeout(id);
  }, [cycling, up, facts.length]);

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

        <div className="relative min-w-0 flex-1">
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

          {/* items-center rather than items-start: every fact is a label over
              a detail, so they are the same height and their tops line up
              either way — this also centres the run in the bar. */}
          <ul className="hidden h-full min-w-0 items-center overflow-hidden md:flex">
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
                  "relative shrink-0 grow px-5 lg:px-8",
                  // The divider, on the header's proportions: 32px of a 72px
                  // bar is the same share as its 24 is of the 56px pill.
                  // Short and centred rather than a full-height border, which
                  // cuts the bar into boxes instead of dividing one.
                  index > 0 &&
                    "before:bg-rule before:absolute before:top-1/2 before:left-0 before:h-8 before:w-px before:-translate-y-1/2 before:content-['']",
                )}
              >
                <p className={`font-body whitespace-nowrap ${LABEL_CLASS}`}>
                  {fact.label}
                </p>
                <p className={`font-body whitespace-nowrap ${DETAIL_CLASS}`}>
                  {fact.detail}
                </p>
              </li>
            ))}
          </ul>

          {/* One strip below md, the facts taking it in turns. A grid with
              everything in the one cell rather than absolute positioning:
              they stack without being taken out of flow, so the strip is as
              tall as a fact instead of needing a height of its own. */}
          <div className="grid px-6 py-4 md:hidden">
            {facts.map((fact, i) => (
              <LineReveal
                key={fact.label}
                play={up && i === index}
                lines={[fact.label, fact.detail]}
                lineClassNames={[LABEL_CLASS, DETAIL_CLASS]}
                // Tighter than a heading's leading, which is what the reveal
                // is normally worn by, and set here rather than in the
                // component so the same variable still drives both.
                className="font-body col-start-1 row-start-1 [--heading-line-gap:0.35em]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
