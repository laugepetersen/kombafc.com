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
 * then the buttons — once the block reaches the viewport. Played on entry
 * rather than tied to scroll position, so it runs at its own pace and reads
 * the same however fast the page is moving.
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

type ItemProps = {
  shown: boolean;
  delay: number;
  /** 1 when the piece arrives from below, -1 when it arrives from above. */
  direction: 1 | -1;
  children: ReactNode;
};

/**
 * The masked one. The clip is dropped once the element has landed — left on,
 * it would cut off anything that paints outside the box afterwards, which on
 * a row of CTAs means their glow and the travel of the magnetic hover.
 */
function CropItem({ shown, delay, direction, children }: ItemProps) {
  const [landed, setLanded] = useState(false);
  const [wasShown, setWasShown] = useState(shown);

  // Adjusted during render rather than in an effect. The clip has to be back
  // the instant the block starts leaving — waiting for an effect would let a
  // re-entry begin against a stale unclipped mask, and the elements would be
  // visible for the first frames of a reveal that is supposed to uncover them.
  if (wasShown !== shown) {
    setWasShown(shown);
    if (landed) setLanded(false);
  }

  return (
    <span className={landed ? "block" : "block overflow-hidden"}>
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

function FadeItem({ shown, delay, children }: ItemProps) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: shown ? 1 : 0 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Fade with just enough travel to give it a direction. The default: it reads
 * as the block settling rather than as anything animating, which is what a
 * page full of these needs.
 */
function RiseItem({ shown, delay, direction, children }: ItemProps) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 12 * direction }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const items = {
  crop: CropItem,
  fade: FadeItem,
  rise: RiseItem,
} satisfies Record<StaggerVariant, (props: ItemProps) => ReactNode>;

export function StaggerReveal({
  variant = "rise",
  step = 0.08,
  className,
  children,
}: {
  variant?: StaggerVariant;
  /** Seconds between one child starting and the next. */
  step?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // A low threshold: a tall block would otherwise have to be most of the way
  // up the viewport before it started, by which point the reader is past it.
  const inView = useInView(ref, { amount: 0.25 });
  const reduce = useReducedMotion();
  const scrollingDownNow = useScrollingDown();
  const shown = inView || reduce;

  // Taken once, as the block enters, and held for the run. Read live it would
  // flip the animation mid-flight the moment the reader changed their mind.
  // Adjusted during render, which is the sanctioned way to derive state from a
  // change rather than an effect a frame later.
  const [wasInView, setWasInView] = useState(inView);
  const [fromBelow, setFromBelow] = useState(true);

  if (wasInView !== inView) {
    setWasInView(inView);
    if (inView) setFromBelow(scrollingDownNow);
  }

  const Item = items[variant];
  const list = Children.toArray(children);

  // Parked out of view the offset follows the reader live, so the block is
  // already waiting on the side it is going to arrive from — set only at entry
  // it would still be parked below while the reader came up to it, and travel
  // the wrong way. Frozen to the captured direction once on screen, or a change
  // of mind would reverse the travel halfway through the run.
  const direction: 1 | -1 = shown
    ? fromBelow
      ? 1
      : -1
    : scrollingDownNow
      ? 1
      : -1;

  return (
    <div ref={ref} className={className}>
      {list.map((child, index) => (
        <Item
          key={index}
          shown={shown}
          direction={direction}
          // Coming down the page the top piece leads; coming up, the bottom
          // one does, so the block builds towards the reader either way.
          delay={
            shown ? (fromBelow ? index : list.length - 1 - index) * step : 0
          }
        >
          {child}
        </Item>
      ))}
    </div>
  );
}
