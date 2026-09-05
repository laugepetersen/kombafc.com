"use client";

import {
  type MotionValue,
  motion,
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

import { useReplayInView } from "@/lib/in-view";

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

/**
 * Kugiri's own demo curve, and its timing with it: a quintic ease-out over a
 * second, a tenth of a second between lines. Softer off the mark than the
 * exponential it replaces, which left too much of the travel in the first few
 * frames and read as a snap however long the duration was.
 */
const EASE = [0.23, 1, 0.32, 1] as const;
const DURATION = 1;
const STAGGER = 0.1;

/**
 * The two ends of the fill, shared by every reveal here. Neutral greys, not
 * steps off the ink ramp: those carry a blue-violet cast by design, which
 * tints type — the same reason `text-chrome` mixes its own.
 */
const FILL_FROM = "#4a4a4a";
const FILL_TO = "#ffffff";

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
  lineClassNames,
  play,
  className,
}: {
  /** Where the breaks go. This reveal needs to know its own lines. */
  lines: string[];
  /**
   * Per-line classes, positional, for when the lines are not alike — a label
   * over a caption rather than one run of heading.
   */
  lineClassNames?: string[];
  /**
   * Drive the reveal from outside rather than from the viewport, for a run
   * that loops on a timer instead of playing when it is scrolled to. Left
   * off, it watches for itself as everything else here does.
   */
  play?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // The site's one viewport rule: in when an edge is far enough inside the
  // frame, out only once none of the heading is left on screen.
  const inView = useReplayInView(ref);
  const reduce = useReducedMotion();
  /* Given a `play`, that is the whole story — including under reduced motion,
     where holding every line up would stack a looping run's states on top of
     one another. Whoever drives it is responsible for not moving; the
     duration below goes to nought either way. */
  const shown = play ?? (inView || reduce);

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
              /* A template literal, not cn: tailwind-merge files every
                 text-* class it does not recognise under text-colour, so
                 text-trim next to a caller's text-white would be dropped in
                 silence. See CLAUDE.md. */
              className={`text-trim block ${lineClassNames?.[index] ?? ""}`}
              // No mount animation: it starts parked below and only moves once
              // it has actually been scrolled to.
              initial={false}
              // Just past the mask, counting its bottom padding, and no more.
              // Warms from grey to white on the way up, the same fill
              // ScrollFill uses — and because text-relief blooms off
              // currentcolor, the glow comes up with it rather than sitting
              // white around grey type.
              // Fading as it rises, not only clipped by the mask. The mask
              // alone gives a hard edge travelling up the line; the demo this
              // is taken from fades too, and that is most of why it reads as
              // smooth rather than as a wipe. It warmed from grey to white as
              // well for a while — right to look at, but a second
              // interpolation per line for something the fade already says.
              animate={{
                y: shown ? "0%" : "125%",
                opacity: shown ? 1 : 0,
              }}
              transition={{
                duration: reduce ? 0 : DURATION,
                delay: shown ? index * STAGGER : 0,
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
