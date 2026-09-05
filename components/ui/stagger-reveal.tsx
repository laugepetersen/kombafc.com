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
 * Each direct child is wrapped, so spacing belongs on this component (a flex
 * gap or space-y) rather than as margins on the children: a margin inside a
 * `crop` mask is height the mask has to clip through before the content
 * appears.
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

export type StaggerVariant = "crop" | "fade" | "rise";

type ItemProps = {
  shown: boolean;
  delay: number;
  children: ReactNode;
};

/**
 * The masked one. The clip is dropped once the element has landed — left on,
 * it would cut off anything that paints outside the box afterwards, which on
 * a row of CTAs means their glow and the travel of the magnetic hover.
 */
function CropItem({ shown, delay, children }: ItemProps) {
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
        animate={{ y: shown ? "0%" : "110%" }}
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

/** Fade with just enough travel to give it a direction. */
function RiseItem({ shown, delay, children }: ItemProps) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 12 }}
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
  variant = "crop",
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
  const shown = inView || reduce;

  const Item = items[variant];

  return (
    <div ref={ref} className={className}>
      {Children.toArray(children).map((child, index) => (
        <Item key={index} shown={shown} delay={shown ? index * step : 0}>
          {child}
        </Item>
      ))}
    </div>
  );
}
