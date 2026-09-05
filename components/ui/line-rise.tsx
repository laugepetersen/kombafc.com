"use client";

import { type TextSplit, splitText } from "kugiri";
import { type ElementType, useEffect, useRef } from "react";

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
  as,
  className,
}: {
  text: string;
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
    let cleanup: (() => void) | undefined;
    let width = 0;
    let frame = 0;
    let cancelled = false;

    const cut = () => {
      split?.revert();
      split = splitText(target, {
        type: ["lines"],
        // A tight leading leaves descenders outside the line box, and a clip
        // at the box edge would shave them off at rest as well as in flight.
        mask: { lines: MASK_REACH },
      });
      width = target.clientWidth;
    };

    // Fonts first. Split before they land and the lines are cut where the
    // fallback wrapped, which is not where the real face will.
    document.fonts.ready.then(() => {
      if (cancelled) return;
      cut();

      // Replays on every entry, like the other reveals. Removing the attribute
      // on the way out parks the lines again, so coming back is a fresh run
      // rather than a heading that is already up.
      const inView = new IntersectionObserver(
        ([entry]) => {
          target.dataset.lineRise = entry.isIntersecting ? "running" : "";
        },
        { threshold: 0.55 },
      );
      inView.observe(target);

      // A split is a snapshot of one layout. When the box changes width the
      // lines it was cut into are no longer the lines the browser would paint,
      // so it has to be cut again — folded into a frame, because a drag emits
      // a stream of these, and ignoring height, which moves no wrap.
      const onResize = new ResizeObserver(() => {
        if (target.clientWidth === width) return;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          if (cancelled) return;
          cut();
        });
      });
      onResize.observe(target);

      cleanup = () => {
        inView.disconnect();
        onResize.disconnect();
      };
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      cleanup?.();
      split?.revert();
    };
  }, [text]);

  // data-line-rise from the start, so the lines are parked the moment they are
  // cut rather than flashing at rest for a frame first.
  return (
    <Comp ref={ref} data-line-rise="" className={className}>
      {text}
    </Comp>
  );
}
