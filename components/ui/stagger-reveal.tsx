"use client";

import { motion, useInView } from "motion/react";
import {
  Children,
  type ReactNode,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

/**
 * Brings a block in one element at a time — kicker, then heading, then copy,
 * then the buttons — each piece watching for its own arrival rather than the
 * block firing them all off one trigger. Played on entry rather than tied to
 * scroll position, so each piece runs at its own pace however fast the page is
 * moving.
 *
 * The run follows the reader. Coming down the page the pieces arrive from
 * below, top one first; coming back up they arrive from above, bottom one
 * first. Either way the block assembles in the direction of travel rather than
 * against it.
 *
 * Each direct child is wrapped. Margins on the children survive that, because
 * a wrapper is a flex item and so its own formatting context — but a margin
 * inside a `crop` mask is height the mask has to clip through before anything
 * appears, so that variant wants its spacing as a gap here instead.
 *
 * Replays whenever the block comes back into view. Holds still under
 * prefers-reduced-motion.
 */

/** Decelerating with a long tail, matching the heading reveals. */
const EASE = [0.16, 1, 0.3, 1] as const;

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

/* -- Which way the reader is going ---------------------------------------- */

/**
 * One listener for the page rather than one per block, and it only notifies on
 * an actual change of direction — otherwise every block on the page would
 * re-render on every scroll event.
 */
let scrollingDown = true;
let lastY = 0;
const directionListeners = new Set<() => void>();

function handleScroll() {
  const y = window.scrollY;
  // Ignore the jitter at either end of the document, where rubber-banding
  // reports direction changes the reader did not make.
  if (Math.abs(y - lastY) < 2) return;

  const next = y > lastY;
  lastY = y;

  if (next !== scrollingDown) {
    scrollingDown = next;
    for (const notify of directionListeners) notify();
  }
}

function subscribeDirection(onChange: () => void) {
  if (directionListeners.size === 0) {
    lastY = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
  }
  directionListeners.add(onChange);

  return () => {
    directionListeners.delete(onChange);
    if (directionListeners.size === 0) {
      window.removeEventListener("scroll", handleScroll);
    }
  };
}

function useScrollingDown() {
  return useSyncExternalStore(
    subscribeDirection,
    () => scrollingDown,
    () => true,
  );
}

/* -- Items ---------------------------------------------------------------- */

export type StaggerVariant = "crop" | "fade" | "rise";

/**
 * Each piece watches for itself.
 *
 * One observer on the container looked right on a short block and did nothing
 * useful on a tall one: the container crosses its threshold while the lower
 * pieces are already well inside the viewport, so they had finished arriving
 * before the reader ever saw them. An observer each is what makes this
 * element-by-element, and IntersectionObserver is cheap enough that a handful
 * of them costs nothing worth counting.
 *
 * With the trigger per piece, the scroll does most of the staggering on its
 * own — the delay below only separates pieces that cross the line together,
 * which is what happens on a short block or a fast flick.
 */
function Item({
  variant,
  index,
  count,
  step,
  children,
}: {
  variant: StaggerVariant;
  index: number;
  count: number;
  step: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Enough of the piece to be worth animating, but not so much that a tall
  // paragraph has to be nearly fully read before it starts.
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const scrollingDownNow = useScrollingDown();
  const shown = inView || reduce;

  // Taken once, as the piece enters, and held for the run. Read live it would
  // flip the animation mid-flight the moment the reader changed their mind.
  // Adjusted during render, which is the sanctioned way to derive state from a
  // change rather than an effect a frame later.
  const [wasInView, setWasInView] = useState(inView);
  const [fromBelow, setFromBelow] = useState(true);
  if (wasInView !== inView) {
    setWasInView(inView);
    if (inView) setFromBelow(scrollingDownNow);
  }

  // The clip on the masked variant is dropped once the piece has landed. Left
  // on, it would keep cutting whatever paints outside the box, which on a row
  // of CTAs means their glow and the travel of the magnetic hover.
  const [landed, setLanded] = useState(false);
  const [wasShown, setWasShown] = useState(shown);
  if (wasShown !== shown) {
    setWasShown(shown);
    if (landed) setLanded(false);
  }

  // Parked out of view the offset follows the reader live, so the piece is
  // already waiting on the side it is going to arrive from — set only at entry
  // it would still be parked below while the reader came up to it, and travel
  // the wrong way. Frozen at entry, or a change of mind would reverse the
  // travel halfway through the run.
  const direction = shown ? (fromBelow ? 1 : -1) : scrollingDownNow ? 1 : -1;

  // Coming down the page the top piece leads; coming up, the bottom one does,
  // so a block that crosses the line all at once still builds towards the eye.
  const delay = shown ? (fromBelow ? index : count - 1 - index) * step : 0;

  if (variant === "crop") {
    return (
      <span ref={ref} className={landed ? "block" : "block overflow-hidden"}>
        <motion.div
          initial={false}
          animate={{ y: shown ? "0%" : `${110 * direction}%` }}
          transition={{ duration: 0.6, delay, ease: EASE }}
          onAnimationComplete={() => setLanded(shown)}
        >
          {children}
        </motion.div>
      </span>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={{
        opacity: shown ? 1 : 0,
        // `fade` moves nothing; `rise` takes just enough travel to have a
        // direction without reading as motion.
        ...(variant === "rise" ? { y: shown ? 0 : 12 * direction } : null),
      }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerReveal({
  variant = "rise",
  step = 0.06,
  className,
  children,
}: {
  variant?: StaggerVariant;
  /**
   * Seconds between pieces that enter together. Deliberately short — with a
   * trigger on each piece this only breaks a tie, it is not carrying the
   * whole cascade any more.
   */
  step?: number;
  className?: string;
  children: ReactNode;
}) {
  const list = Children.toArray(children);

  return (
    <div className={className}>
      {list.map((child, index) => (
        <Item
          key={index}
          variant={variant}
          index={index}
          count={list.length}
          step={step}
        >
          {child}
        </Item>
      ))}
    </div>
  );
}
