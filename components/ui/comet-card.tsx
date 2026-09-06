"use client";

import {
  type MotionValue,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { type ReactNode, useRef, useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

/**
 * A card that leans towards the pointer, lifts, and catches a highlight where
 * the pointer is.
 *
 * Rewritten from Aceternity's comet-card rather than vendored as-is. Theirs
 * had no reduced-motion path at all — a card that tilts, springs and lifts
 * under the pointer is the exact thing that setting exists to turn off; it
 * carried a hard-coded four-layer drop shadow up to 520px of spread, drawn in
 * black, which is invisible on this palette and is nineteen shadows to paint
 * on the roster; and it rounded its corners at 16px, which nothing else on
 * this site does. The tilt maths, the spring and the glare are unchanged.
 *
 * The glare is dialled back from theirs. White at 0.9 through an overlay blend
 * is tuned for a card on a white page; over a photograph on this one it blows
 * the highlights out rather than reading as a sheen.
 */
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

export function CometCard({
  rotateDepth = 17.5,
  translateDepth = 20,
  className,
  cardClassName,
  children,
}: {
  /** Degrees of lean at the edge of the card. */
  rotateDepth?: number;
  /** Pixels the card slides towards the pointer. */
  translateDepth?: number;
  /** On the outer box, which holds the perspective and never moves. */
  className?: string;
  /**
   * On the moving box — the one that leans, lifts, and carries the glare.
   *
   * Anything that shapes the card itself belongs here rather than on the
   * children. A clip put on the outer box crops the card as it scales past
   * it; a clip put on the children alone leaves the glare sheet unclipped,
   * and it goes on painting over a corner the card no longer has.
   */
  cardClassName?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Pointer position over the card, as -0.5 to 0.5 on each axis.
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x);
  const springY = useSpring(y);

  const rotateX = useTransform(
    springY,
    [-0.5, 0.5],
    [`-${rotateDepth}deg`, `${rotateDepth}deg`],
  );
  const rotateY = useTransform(
    springX,
    [-0.5, 0.5],
    [`${rotateDepth}deg`, `-${rotateDepth}deg`],
  );
  const translateX = useTransform(
    springX,
    [-0.5, 0.5],
    [`-${translateDepth}px`, `${translateDepth}px`],
  );
  const translateY = useTransform(
    springY,
    [-0.5, 0.5],
    [`${translateDepth}px`, `-${translateDepth}px`],
  );

  const glareX = useTransform(springX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(springY, [-0.5, 0.5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgb(255 255 255 / 0.5) 10%, rgb(255 255 255 / 0.35) 25%, rgb(255 255 255 / 0) 75%)`;

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    // Mouse only. It was on `mousemove`, and a phone fires one of those at the
    // tap point before the click — so tapping a fighter leaned the card
    // towards the finger and left it leaning: `mouseleave` is a mouse event
    // and does not arrive until you tap something else. A lean towards the
    // pointer is a hover affordance, and a touch device has no pointer to
    // lean towards.
    if (event.pointerType !== "mouse") return;

    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  // Held flat rather than unmounted: the card keeps its box, its glare layer
  // and its DOM, and only stops answering the pointer.
  const rest = { rotateX: 0, rotateY: 0, translateX: 0, translateY: 0 };
  const live = { rotateX, rotateY, translateX, translateY };

  return (
    <div className={cn("perspective-distant transform-3d", className)}>
      <motion.div
        ref={ref}
        onPointerMove={reduce ? undefined : handlePointerMove}
        onPointerLeave={reduce ? undefined : reset}
        style={(reduce ? rest : live) as Record<string, MotionValue | number>}
        initial={{ scale: 1, z: 0 }}
        whileHover={
          reduce
            ? undefined
            : { scale: 1.05, z: 50, transition: { duration: 0.2 } }
        }
        className={cn("relative", cardClassName)}
      >
        {children}

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-50 mix-blend-overlay"
          style={{ background: reduce ? "none" : glare, opacity: 0.6 }}
        />
      </motion.div>
    </div>
  );
}
