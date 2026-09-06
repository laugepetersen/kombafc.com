"use client";

import { type TextSplit, splitText } from "kugiri";
import {
  type ElementType,
  isValidElement,
  type ReactNode,
  useEffect,
  useRef,
} from "react";

import { ENTER_MARGIN } from "@/lib/in-view";

/**
 * The words inside a node tree, flattened to one string.
 *
 * This is the effect's dependency, and it exists because `children` cannot be.
 * JSX builds a new element object on every render, so a heading given markup
 * rather than a string had a dependency that changed whenever anything in its
 * parent did — and the effect's cleanup reverts the split, so the heading was
 * re-cut and replayed from the start. On the home page that meant the hero
 * title ran its reveal again every time the player was closed, because closing
 * sets state on the hero and the hero re-renders.
 *
 * The words are what the split is actually a snapshot of, so they are what it
 * should watch. A change that leaves the words alone but moves the wrap — a
 * class, a breakpoint, a font landing — is already covered by the resize
 * observer below, which is the thing that watches for a different set of lines.
 */
function wordsOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(wordsOf).join("");
  if (isValidElement(node)) {
    return wordsOf((node.props as { children?: ReactNode }).children);
  }
  return "";
}

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

/**
 * How far each line's clip reaches past its box.
 *
 * Down the page for descenders and accents, which a leading set to the caps
 * leaves outside the line box. Across it for the italic: a slanted face hangs
 * past the inline box at both ends, and kugiri's own reach is across the line
 * only — by design, since a horizontal clip does nothing for a reveal that
 * travels vertically. Left at nought it shaved the lean off the first and last
 * glyph of every line.
 */
const MASK_REACH_Y = "0.3em";
const MASK_REACH_X = "0.4em";

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

  /* What the split is a snapshot of — see `wordsOf`. A string when the heading
     is given one, and the words out of the markup when it is not. */
  const words = text ?? wordsOf(children);

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
      split = splitText(target, { type: ["lines"], mask: "lines" });

      // kugiri writes the clip inline and leaves it to us to change or clear,
      // so the reach is set here rather than through its own option, which
      // only opens the cross axis.
      for (const mask of split.masks) {
        // Negative: inset() reaches inward, so a positive reach clips the ink
        // rather than making room for it.
        mask.style.clipPath = `inset(-${MASK_REACH_Y} -${MASK_REACH_X})`;
      }
      width = target.clientWidth;
      apply();
    };

    /* Both observers are set up now rather than inside the wait for the fonts.
       They do not need the split to exist — and hanging them off a promise
       meant that if anything about that wait went differently the heading was
       left with no way of ever being told it had been scrolled to.

       The site's one viewport rule, spelt out here rather than taken from
       the shared hook: this component drives an attribute rather than React
       state, so it wants the observers themselves. Enters on an edge far
       enough inside the frame, parks only once none of it is on screen —
       replayed, so coming back to a heading plays it rather than finding it
       already up. The reasoning is in lib/in-view.ts. */
    const enter = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        onScreen = true;
        apply();
      },
      { threshold: 0, rootMargin: ENTER_MARGIN },
    );
    enter.observe(target);

    // Against the frame itself, so this only fires once nothing of the
    // heading is left on screen.
    const leave = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) return;
        onScreen = false;
        apply();
      },
      { threshold: 0 },
    );
    leave.observe(target);

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
      enter.disconnect();
      leave.disconnect();
      onResize.disconnect();
      split?.revert();
    };
  }, [words]);

  // data-line-rise from the start, so the lines are parked the moment they are
  // cut rather than flashing at rest for a frame first.
  return (
    <Comp ref={ref} data-line-rise="" className={className}>
      {children ?? text}
    </Comp>
  );
}
