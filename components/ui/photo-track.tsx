"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { type RefObject, useSyncExternalStore } from "react";

/**
 * A line of photographs receding into the distance, surfed by scrolling.
 *
 * The geometry is Componentry's collection-surfer — cards stepped along a
 * diagonal in 3D and turned to face the viewer obliquely — but rebuilt rather
 * than restyled. Theirs takes over the page: `position: fixed` over a 50,000px
 * spacer, so it cannot be a section among other sections. It also imports
 * framer-motion rather than motion/react, hardcodes its own copy and Unsplash
 * URLs, and measures every card with getBoundingClientRect inside a transform,
 * which is a forced layout per card per frame.
 *
 * This one is driven by its own section's progress across the viewport, so it
 * surfs while the section passes and is finished when it leaves — no page
 * hijack, no infinite spacer.
 */

/** Card face, in pixels. Portrait, near enough 3:4. */
const CARD_W = 170;
const CARD_H = 227;

/**
 * The step from one card to the next: right, up, and away. Proportional to the
 * card, so changing the card size keeps the arrangement.
 */
const STEP_X = CARD_W * 0.8;
const STEP_Y = CARD_W * -0.28;
const STEP_Z = CARD_W * -0.96;

/** How far the track turns to face the viewer. */
const FACE_ANGLE = -50;

/** Cards visible at rest — the rest are what the scroll surfs through. */
const IN_FRAME = 4;

/**
 * Where the line sits in its frame. Cards hang off a point at the centre of
 * the box, which puts whichever card is currently at the front in the middle
 * of it; this drops the line down and to the left so the front card lands near
 * the bottom-left corner and the rest run away from it to the top right.
 */
const BASE_X = -280;
const BASE_Y = -30;

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

export type TrackPhoto = {
  src: string;
  /** Describe the picture. The track is content, not decoration. */
  alt: string;
};

export function PhotoTrack({
  photos,
  /** The section whose travel across the viewport drives the surf. */
  progressRef,
  className,
}: {
  photos: TrackPhoto[];
  progressRef: RefObject<HTMLElement | null>;
  className?: string;
}) {
  const reduce = useReducedMotion();

  // Tied to the section rather than the page: the track moves while the
  // section crosses the viewport and is done when it leaves.
  const { scrollYProgress } = useScroll({
    target: progressRef,
    offset: ["start end", "end start"],
  });

  // Enough give to take the edge off a trackpad, not enough to lag behind it.
  const smoothed = useSpring(scrollYProgress, {
    mass: 0.1,
    stiffness: 110,
    damping: 20,
  });

  const travel = Math.max(0, photos.length - IN_FRAME);
  const x = useTransform(smoothed, [0, 1], [BASE_X, BASE_X - travel * STEP_X]);
  const y = useTransform(smoothed, [0, 1], [BASE_Y, BASE_Y - travel * STEP_Y]);
  const z = useTransform(smoothed, [0, 1], [0, -travel * STEP_Z]);

  return (
    <div
      className={`flex items-center justify-center ${className ?? ""}`}
      style={{
        perspective: "2000px",
        // The vanishing point, up and left of the scene. Cards step right as
        // they recede, so they read as running off to the top right while
        // still converging — anchoring it near the cards also keeps the
        // keystone from the oblique angle reasonable. Put the origin at a
        // corner of the box instead and the near card is magnified off-screen.
        perspectiveOrigin: "10% 10%",
      }}
    >
      {/* A point, not a box: every card hangs off this one spot, so moving it
          moves the whole line without disturbing the arrangement. */}
      <motion.div
        className="relative h-0 w-0"
        style={
          reduce
            ? { x: BASE_X, y: BASE_Y, transformStyle: "preserve-3d" }
            : { x, y, z, transformStyle: "preserve-3d" }
        }
      >
        {photos.map((photo, index) => (
          <div
            key={photo.src}
            className="bg-ink-900 absolute overflow-hidden"
            style={{
              width: CARD_W,
              height: CARD_H,
              // Drawn as one transform rather than a stack of utilities: the
              // order matters, and the browser keeps it on the compositor.
              transform: `translate3d(${index * STEP_X}px, ${index * STEP_Y}px, ${index * STEP_Z}px) rotateY(${FACE_ANGLE}deg)`,
              // Near cards over far ones. Perspective alone would sort them,
              // but only if every card shared one stacking context.
              zIndex: photos.length - index,
            }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="170px"
              className="object-cover"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
