"use client";

import { motion } from "motion/react";
import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { cn } from "@/lib/utils";

/**
 * A deck of cards that rotates, the card at the back coming forward on an
 * interval.
 *
 * Rewritten from Aceternity's card-stack rather than vendored as-is. Theirs
 * held the timer in a module-level `let`, so two stacks on one page shared a
 * single handle and unmounting either stopped the other; it animated `top`,
 * which lays out and paints every card each frame where a transform does
 * neither; it baked in a 240px box and a light/dark neutral palette; and it
 * had no reduced-motion path. The stacking maths is unchanged.
 *
 * The cards share one grid cell rather than being absolutely positioned, so
 * the stack sizes itself to its widest card and every card takes that width.
 * Absolute cards would leave the container no height at all, and letting each
 * card size itself would make the box jump as names of different lengths
 * reach the front.
 *
 * Cards behind are scaled from their top edge and lifted, so each one shows as
 * a sliver above the card in front. That means the stack paints outside its
 * own box — leave headroom above it, or an ancestor will clip it.
 */

const motionQuery = "(prefers-reduced-motion: reduce)";

function subscribeMotion(onChange: () => void) {
  const mq = window.matchMedia(motionQuery);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export type StackItem = {
  id: string;
  content: ReactNode;
};

type CardStackProps = {
  items: StackItem[];
  /** Pixels each card behind is lifted above the one in front of it. */
  offset?: number;
  /** Fraction of its size each card behind gives up. */
  scaleFactor?: number;
  intervalMs?: number;
  className?: string;
};

export function CardStack({
  items,
  offset = 4,
  scaleFactor = 0.12,
  intervalMs = 5000,
  className,
}: CardStackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [cards, setCards] = useState(items);

  const reduceMotion = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(motionQuery).matches,
    () => false,
  );

  useEffect(() => {
    // A single card has nothing to rotate through, and under reduced motion
    // the deck is a static stack rather than something that moves on its own.
    if (reduceMotion || cards.length < 2) return;

    const el = ref.current;
    if (!el) return;

    /**
     * Only while somebody could be looking at it.
     *
     * The deck lives in the hero and the page runs seven screens past it, so
     * an unconditional timer went on turning cards over — a React render and a
     * spring on every card in the stack, every five seconds — for the whole of
     * the rest of the page, and on into a backgrounded tab. Nothing of it was
     * ever seen: a stack rotated off screen just presents a different card
     * when you come back to it, which is not the effect.
     */
    let id: ReturnType<typeof setInterval> | undefined;
    let onScreen = false;

    const sync = () => {
      const run = onScreen && !document.hidden;

      if (run && id === undefined) {
        id = setInterval(() => {
          setCards((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)]);
        }, intervalMs);
      } else if (!run && id !== undefined) {
        clearInterval(id);
        id = undefined;
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    observer.observe(el);
    document.addEventListener("visibilitychange", sync);

    return () => {
      clearInterval(id);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
    // `cards` changes identity every tick but never length, so this holds one
    // timer for the life of the stack rather than tearing it down each cycle.
  }, [reduceMotion, cards.length, intervalMs]);

  return (
    // No `isolate` here, deliberately. It would contain the cards' z-indexes
    // neatly, but `isolation: isolate` also establishes a backdrop root, and a
    // card using backdrop-filter would then have nothing behind it to sample —
    // the blur would silently do nothing. The cards are grid siblings, so
    // their z-indexes already order them against each other.
    <div ref={ref} className={cn("inline-grid", className)}>
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          className="col-start-1 row-start-1"
          // The cards are translucent, so anything drawn on the ones behind
          // reads straight through the front one. They are marked instead of
          // hidden, and each card decides for itself what to hold back — the
          // panel has to stay, it is the part that shows as a sliver.
          data-behind={index > 0 ? "" : undefined}
          aria-hidden={index > 0 || undefined}
          // z-index is not animated: the card coming forward has to be on top
          // for the whole of its travel, not halfway through it.
          style={{
            transformOrigin: "top center",
            zIndex: cards.length - index,
          }}
          animate={{ y: index * -offset, scale: 1 - index * scaleFactor }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
        >
          {card.content}
        </motion.div>
      ))}
    </div>
  );
}
