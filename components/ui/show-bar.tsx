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
      className={cn(
        // Dark enough to read white type against a lit photograph, blurred so
        // what passes behind it stays a suggestion. Same treatment as the
        // header, which is the site's other bar over moving media.
        "border-rule bg-void/70 border-t backdrop-blur-[12px]",
        "pb-[env(safe-area-inset-bottom)]",
        className,
      )}
    >
      {/* Reversed on small screens: the ask goes to the bottom edge, where a
          thumb is, and the fact sits above it. Side by side from md. */}
      <div className="flex flex-col-reverse md:flex-row md:items-stretch">
        <button
          type="button"
          onClick={onAction}
          // No corner-cut: the block runs to the edge of the screen, and a
          // bevel on a full-bleed edge reads as a rendering fault rather than
          // as the site's mark. tap still gives it the press.
          className="tap text-void font-body flex h-14 shrink-0 items-center justify-center gap-2 bg-white px-6 text-sm font-medium tracking-[0.02em] hover:brightness-90 md:h-24 md:px-8 md:text-base lg:px-10"
        >
          <Icon name="play_arrow" className="size-5" />
          {action}
        </button>

        {/* items-center rather than items-start: every fact is a label over a
            detail, so they are the same height and their tops line up either
            way — this also centres the run in the bar. */}
        <ul className="divide-rule flex min-w-0 flex-1 items-center overflow-hidden md:divide-x">
          {facts.map((fact, index) => {
            const lit = index === active || reduce;

            return (
              <li
                key={fact.label}
                // One at a time on small screens. Three two-line facts side by
                // side at 375px is three cramped columns; stacked, the bar
                // eats a quarter of the screen. The cycle already picks one.
                // shrink-0 and nowrap: a fact is a fixed phrase, and left
                // to shrink they all took an equal share of the bar and
                // ellipsised in the middle of a word.
                className={cn(
                  // grow/basis-0 rather than sized to content: left to hug
                  // their own text the three of them bunched up against the
                  // white block with a third of the bar empty after them.
                  // Even shares put the rules at even thirds and the bar
                  // reads as one object. shrink-0 stays, so a long fact
                  // overruns into the ul's clip rather than ellipsising.
                  "shrink-0 px-6 py-4 md:grow md:basis-0 md:px-5 lg:px-8",
                  index !== active && "hidden md:block",
                )}
              >
                {/* origin-top-left, so the ones that are down a size stay
                    pinned to the same top and the same left as the lit one.
                    Scaling about the centre would float them all inwards and
                    the row would look like it was breathing. */}
                <div
                  className={cn(
                    "origin-top-left transition-transform duration-500 ease-out",
                    lit ? "scale-100" : "scale-90",
                  )}
                >
                  <p
                    className={cn(
                      "font-body font-medium whitespace-nowrap transition-colors duration-500 ease-out lg:text-lg",
                      lit ? "text-white" : "text-ink-300",
                    )}
                  >
                    {fact.label}
                  </p>
                  <p
                    className={cn(
                      "font-body text-xs whitespace-nowrap transition-colors duration-500 ease-out lg:text-sm",
                      lit ? "text-ink-200" : "text-ink-400",
                    )}
                  >
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
