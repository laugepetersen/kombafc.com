"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

/**
 * The bar across the foot of the screen: the ask on the left, the night's
 * facts beside it, one of them lit at a time.
 *
 * Edge to edge and pinned to the bottom of whatever it is dropped into, so on
 * a pinned section it stays under the photographs for the whole flight rather
 * than scrolling with them. The white block is a segment of the bar rather
 * than a Button — it is full-bleed and full-height, which is a different
 * object from the site's inline CTAs, bevel and all.
 *
 * The highlight moves on a timer instead of on hover: this sits over a section
 * a reader is scrolling through, not pointing at.
 */

/** How long each fact holds the light. */
const DWELL_MS = 3200;

/**
 * Between one fact's move and the next one's. Small — the run should read as
 * the row settling in order rather than as three separate animations.
 */
const STAGGER_MS = 70;

/** Kugiri's curve, the site's easing for anything that arrives. */
const EASE = "cubic-bezier(0.23,1,0.32,1)";

export type ShowFact = {
  /** The fact — a place, a count, a name. */
  label: string;
  /** What it is. One short line under it. */
  detail: string;
};

const motionQuery = "(prefers-reduced-motion: reduce)";

function subscribeMotion(onChange: () => void) {
  const mq = window.matchMedia(motionQuery);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(motionQuery).matches,
    () => false,
  );
}

export function ShowBar({
  action,
  onAction,
  facts,
  className,
}: {
  /** The label on the white block. */
  action: string;
  onAction: () => void;
  facts: ShowFact[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  /* Just "is any of it on screen", not the shared entrance rule. That rule
     starts things once an edge is twelve per cent inside the frame, and a bar
     pinned to the bottom edge lives entirely in the last eleven per cent of
     it — it would never cross the line, and the timer would never start.
     Nothing is entering here anyway: this only keeps the interval off while
     the section is elsewhere. */
  const inView = useInView(ref, { amount: 0 });
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!inView || reduce || facts.length < 2) return;

    const id = setInterval(
      () => setActive((i) => (i + 1) % facts.length),
      DWELL_MS,
    );

    return () => {
      clearInterval(id);
      // Back to the first on the way out, so the run reads from the top the
      // next time the section is reached rather than resuming mid-cycle.
      setActive(0);
    };
  }, [inView, reduce, facts.length]);

  return (
    <div
      ref={ref}
      className={cn("pb-[env(safe-area-inset-bottom)]", className)}
    >
      {/* The ground, and the header's treatment upside down: a scrim rising
          out of the bottom edge rather than a panel with a blur behind it. A
          backdrop-filter over near-black photographs has almost nothing to
          blur and reads as a flat grey patch. This holds its strength across
          the bar and falls off above it, so the corridor dissolves into the
          page edge instead of meeting a lit box.

          The scrim is the bar's own height plus the fade, so the stop lands
          on the bar's top edge at either breakpoint — the bar is twice as
          tall stacked as it is in a row, and a percentage stop put the fade
          inside it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[calc(100%+7rem)]"
        style={{
          background: `linear-gradient(to top,
            rgb(5 5 8 / 0.92) 0px,
            rgb(5 5 8 / 0.86) calc(100% - 7rem),
            transparent 100%)`,
        }}
      />

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
        <ul className="border-rule flex min-w-0 flex-1 items-center overflow-hidden border-t">
          {facts.map((fact, index) => {
            const lit = index === active || reduce;

            return (
              <li
                key={fact.label}
                className={cn(
                  // grow, so the three of them spread across the bar
                  // rather than bunching against the white block with a third
                  // of it empty after them. Grown from their content width
                  // rather than from nothing: even thirds are narrower than
                  // the longest fact between md and lg, and shrink-0 means a
                  // fact that does not fit runs into the ul's clip rather
                  // than ellipsising. This way the slack is shared and
                  // nothing is ever cut.
                  "relative shrink-0 px-6 md:grow md:px-5 lg:px-8",
                  // One at a time on small screens. Three two-line facts side
                  // by side at 375px is three cramped columns; stacked, the
                  // bar eats a quarter of the screen. The cycle already picks
                  // one.
                  index !== active && "hidden md:block",
                  // The divider, the header's: a short centred rule rather
                  // than a full-height border, which cuts the bar into boxes
                  // instead of dividing one.
                  index > 0 &&
                    "md:before:bg-rule md:before:absolute md:before:top-1/2 md:before:left-0 md:before:h-6 md:before:w-px md:before:-translate-y-1/2 md:before:content-['']",
                )}
              >
                {/* Opacity and a nudge down the page, offset one fact from
                    the next, so the row resettles in order. The one with the
                    light is the one at the top. */}
                <div
                  className={cn(
                    "py-3 transition-[translate,opacity] duration-500 md:py-0",
                    lit
                      ? "translate-y-0 opacity-100"
                      : "translate-y-1.5 opacity-45",
                  )}
                  style={{
                    transitionDelay: `${index * STAGGER_MS}ms`,
                    transitionTimingFunction: EASE,
                  }}
                >
                  <p className="font-body text-base font-medium whitespace-nowrap text-white">
                    {fact.label}
                  </p>
                  <p className="font-body text-ink-200 text-xs whitespace-nowrap lg:text-sm">
                    {fact.detail}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
