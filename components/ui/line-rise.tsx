"use client";

import { type TextSplit, splitText } from "kugiri";
import { type ElementType, type ReactNode, useEffect, useRef } from "react";

/**
 * A heading that rises into place a line at a time, warming from grey to white
 * as it goes. Nothing else changes about it — the bloom and the inner shadow
 * are the ones it wears at rest.
 *
 * The split is kugiri's, which cuts at the line boxes the browser actually
 * painted rather than guessing where the breaks should fall. That matters
 * here: the reveal has to mask each line separately, and a hand-written list
 * of lines is only right at the width it was written for. It also means the
 * heading can wrap however it likes at any breakpoint and the reveal follows.
 *
 * The motion itself lives in the stylesheet, off the line index kugiri writes
 * as a custom property. This only splits, watches, and sets one attribute.
 */

/** How far the clip reaches past each line box, for descenders and accents. */
const MASK_REACH = "0.3em";

export function LineRise({
  text,
  children,
  as,
  className,
}: {
  /** The heading, when it is one run of type at one size. */
  text?: string;
  /**
   * Or its markup, when the lines are not alike — the hero sets each of its
   * three at a different size. kugiri splits inside block children and keeps
   * what is on them, so each stays the size it was given.
   */
  children?: ReactNode;
  /** A section heading should not render as a <p>. */
  as?: ElementType;
  className?: string;
}) {
  const Comp = (as ?? "p") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    let split: TextSplit | null = null;
    let width = 0;
    let frame = 0;
    let cancelled = false;
    let onScreen = false;

    // Held here and re-applied after every cut. A cut replaces the line
    // elements, and the new ones come out of the stylesheet parked — so a
    // re-cut while the heading is on screen would leave it stuck below its
    // own baseline with nothing left to trigger it.
    const apply = () => {
      target.dataset.lineRise = onScreen ? "running" : "";
    };

    const cut = () => {
      split?.revert();
      split = splitText(target, {
        type: ["lines"],
        // A tight leading leaves descenders outside the line box, and a clip
        // at the box edge would shave them off at rest as well as in flight.
        mask: { lines: MASK_REACH },
      });
      width = target.clientWidth;
      apply();
    };

    /* Both observers are set up now rather than inside the wait for the fonts.
       They do not need the split to exist — and hanging them off a promise
       meant that if anything about that wait went differently the heading was
       left with no way of ever being told it had been scrolled to.

       Once only: it stops watching the moment it has fired. A heading that
       re-runs every time it is scrolled back past draws attention to itself a
       second and third time for nothing, and it is one less observer alive.

       The bottom of the root is pulled up, so the heading has to be properly
       on screen rather than clipping the bottom edge — start it there and the
       reveal is over by the time it is somewhere anyone is looking. */
    const inView = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        onScreen = true;
        apply();
        inView.disconnect();
      },
      { threshold: 0.8, rootMargin: "0px 0px -18% 0px" },
    );
    inView.observe(target);

    /* A split is a snapshot of one layout. When the box changes width the
       lines it was cut into are no longer the lines the browser would paint,
       so it has to be cut again — folded into a frame, because a drag emits a
       stream of these, and ignoring height, which moves no wrap. */
    const onResize = new ResizeObserver(() => {
      if (!split || target.clientWidth === width) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (cancelled) return;
        cut();
      });
    });
    onResize.observe(target);

    // Fonts first. Split before they land and the lines are cut where the
    // fallback wrapped, which is not where the real face will.
    document.fonts.ready.then(() => {
      if (cancelled) return;
      cut();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      inView.disconnect();
      onResize.disconnect();
      split?.revert();
    };
  }, [text, children]);

  // data-line-rise from the start, so the lines are parked the moment they are
  // cut rather than flashing at rest for a frame first.
  return (
    <Comp ref={ref} data-line-rise="" className={className}>
      {children ?? text}
    </Comp>
  );
}
