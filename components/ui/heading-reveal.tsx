"use client";

import {
  type MotionValue,
  motion,
  useInView,
  useScroll,
  useTransform,
} from "motion/react";
import {
  type ElementType,
  Fragment,
  type ReactNode,
  useRef,
  useSyncExternalStore,
} from "react";

/**
 * Three ways a heading arrives.
 *
 * These own the motion and nothing else — the caller supplies the type
 * treatment through `className`, so the same reveal works on any step of the
 * scale. That split is also why `className` is applied raw rather than through
 * `cn`: tailwind-merge files every `text-*` class it does not recognise under
 * text-colour, so a caller passing `text-relief text-paint-room` would have
 * one of them silently dropped on the way in.
 *
 * All three replay whenever they come back into view, and hold still under
 * prefers-reduced-motion.
 */

/** Decelerating with a long tail. Type settling rather than snapping. */
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

/* -- Lines clipped in from below ------------------------------------------ */

export function LineReveal({
  lines,
  className,
}: {
  /** Where the breaks go. This reveal needs to know its own lines. */
  lines: string[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const reduce = useReducedMotion();
  const shown = inView || reduce;

  return (
    <div ref={ref} className={className}>
      {/* Flex, so the masks' negative margins are honoured rather than
          collapsed, and the leading is the heading line gap outright. */}
      <span className="flex flex-col gap-(--heading-line-gap)">
        {lines.map((line, index) => (
          // The mask, hugging the ink rather than the line box: padded only as
          // far as the italic overhang and the descenders need, and pulled
          // back out in margin so it contributes nothing to the leading.
          <span
            key={line}
            className="-mx-[0.3em] -mb-[0.14em] block overflow-hidden px-[0.3em] pb-[0.14em]"
          >
            <motion.span
              // Trimmed to cap height and baseline, which is what makes this
              // read as a crop. At the heading's leading of 1 the ink fills
              // only the middle two thirds of an untrimmed line box, so a line
              // translated by its own box height is already fully in view for
              // most of the travel — it looks like type sliding up rather than
              // type being uncovered. Trimmed, the box is the ink.
              className="text-trim block"
              // No mount animation: it starts parked below and only moves once
              // it has actually been scrolled to.
              initial={false}
              // Just past the mask, counting its bottom padding, and no more.
              animate={{ y: shown ? "0%" : "125%" }}
              transition={{
                duration: 0.55,
                delay: shown ? index * 0.1 : 0,
                ease: EASE,
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </span>
    </div>
  );
}

/* -- Filling word by word, tied to the scroll ----------------------------- */

/**
 * Neutral greys, not steps off the ink ramp: those carry a blue-violet cast by
 * design, which tints type — the same reason `text-chrome` mixes its own.
 */
const FILL_FROM = "#4a4a4a";
const FILL_TO = "#ffffff";

function FillWord({
  progress,
  range,
  color,
  reduce,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  color: [string, string];
  reduce: boolean;
  children: ReactNode;
}) {
  const filled = useTransform(progress, range, color);
  return (
    <motion.span style={reduce ? { color: color[1] } : { color: filled }}>
      {children}
    </motion.span>
  );
}

export function ScrollFill({
  text,
  as,
  className,
  from = FILL_FROM,
  to = FILL_TO,
}: {
  text: string;
  /** A section heading should not render as a <p>. */
  as?: ElementType;
  className?: string;
  from?: string;
  to?: string;
}) {
  const Comp = (as ?? "p") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const words = text.split(" ");

  // Runs while the heading crosses the lower half of the viewport, so the fill
  // has finished by the time it reaches reading height rather than still
  // catching up with the reader.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.35"],
  });

  return (
    <Comp ref={ref} className={className}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <FillWord
            progress={scrollYProgress}
            // Each word's slice overlaps its neighbour's, so the fill reads as
            // a wave washing across rather than as separate steps.
            range={[index / words.length, (index + 1.6) / words.length]}
            color={[from, to]}
            reduce={reduce}
          >
            {word}
          </FillWord>{" "}
        </Fragment>
      ))}
    </Comp>
  );
}

/* -- Words rising out of blur --------------------------------------------- */

export function BlurRise({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const shown = inView || reduce;
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <motion.span
            className="inline-block"
            initial={false}
            animate={
              shown
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: "0.3em", filter: "blur(10px)" }
            }
            transition={{
              duration: 0.6,
              delay: shown ? index * 0.05 : 0,
              ease: EASE,
            }}
          >
            {word}
          </motion.span>{" "}
        </Fragment>
      ))}
    </p>
  );
}
