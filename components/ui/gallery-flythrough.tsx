"use client";

import {
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useSyncExternalStore } from "react";

/**
 * A corridor of photographs you fly through.
 *
 * The behaviour ReactBits' InfiniteGallery has — a grid in 3D space, the
 * camera driven forward by scroll, the whole scene drifting with the pointer,
 * distance fogged out — but built on CSS 3D rather than pulling three.js in
 * for one section. Theirs is a WebGL component behind a paid licence; this is
 * a dozen transformed elements and costs nothing at runtime.
 *
 * Only one thing actually moves: the world translates on z as the camera
 * advances, and drifts on x and y with the pointer. The photographs hold still
 * at their own coordinates and only change opacity, so a fly-through of any
 * length is a handful of composited layers rather than per-frame layout.
 */

/**
 * How many photographs hang in the corridor. More than the roster holds, so
 * the list is cycled — the field wants to be dense enough that there is always
 * something arriving and something going by, which a dozen is not.
 */
const PLACEMENTS = 48;

/** Widest and narrowest a card is drawn, before perspective has its say. */
const CARD_MIN_W = 170;
const CARD_MAX_W = 430;

/** How far apart along the corridor consecutive photographs sit. */
const DEPTH_STEP = 175;

/** How far across and up the field is scattered, in pixels at the lens plane. */
const SPREAD_X = 2800;
const SPREAD_Y = 1700;

/**
 * The field is laid on a coarse grid and then jittered inside each cell,
 * rather than scattered outright. Pure noise clumps: run it and half the
 * screen ends up crowded while the other half is empty, and no amount of
 * reseeding fixes it because the clumping is the point of noise.
 */
const COLS = 6;
const ROWS = 4;

/** Pixels the scene drifts at the far edge of the pointer's travel. */
const DRIFT = 46;

/** Where a photograph fades up out of the distance, and where it passes. */
const FOG_IN_START = -2600;
const FOG_IN_END = -1500;
const PASS_START = 220;
const PASS_END = 620;

/** Beyond this the corridor is behind you. Perspective, in pixels. */
const LENS = 1200;

/**
 * Steps of empty corridor between the last of the field and the photograph at
 * the end of it, so that one arrives on its own rather than in the crowd.
 */
const FINALE_GAP = 3;

/** Where the last photograph hangs, and where the camera comes to rest. */
const FINALE_Z = -(PLACEMENTS + FINALE_GAP) * DEPTH_STEP;

function ramp(v: number, from: number, to: number) {
  return Math.min(1, Math.max(0, (v - from) / (to - from)));
}

/**
 * Deterministic noise. The field has to be scattered rather than ordered, but
 * it also has to be the same scatter on the server, on the client and on every
 * re-render — so this is a hash of the index, not Math.random.
 */
function noise(seed: number) {
  const n = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return n - Math.floor(n);
}

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

/** Where a photograph hangs, and how big it is drawn. */
function placeAt(index: number) {
  const width = CARD_MIN_W + noise(index * 3.1) * (CARD_MAX_W - CARD_MIN_W);
  // A mix of uprights and landscapes rather than one shape repeated — the
  // field reads as photographs pinned in space, not as a grid of tiles.
  const aspect = [0.75, 1.34, 1][Math.floor(noise(index * 5.7) * 3)];

  const cell = index % (COLS * ROWS);
  const col = cell % COLS;
  const row = Math.floor(cell / COLS);
  // Nearly a whole cell of jitter, so the grid underneath never shows.
  const jitterX = (noise(index * 2.3) - 0.5) * 0.9;
  const jitterY = (noise(index * 7.9) - 0.5) * 0.9;

  // Rounded, and not for tidiness: these go straight into inline styles, and
  // the DOM serialises a sub-pixel float to three decimals on the way back
  // out. React then compares its own full-precision number against that
  // rounded string during hydration and calls every card a mismatch.
  return {
    x: Math.round(((col + 0.5 + jitterX) / COLS - 0.5) * SPREAD_X),
    y: Math.round(((row + 0.5 + jitterY) / ROWS - 0.5) * SPREAD_Y),
    // Jittered off the step so they do not arrive on a beat.
    z: Math.round(-(index + noise(index * 11.3) * 0.7) * DEPTH_STEP),
    width: Math.round(width),
    height: Math.round(width / aspect),
  };
}

function GalleryImage({
  src,
  index,
  camera,
}: {
  src: string;
  index: number;
  camera: MotionValue<number>;
}) {
  const { x, y, z, width, height } = placeAt(index);

  // Written out rather than handed to useTransform as an input range: a range
  // that stops short of the end of its input reverses past that point instead
  // of holding, which is not what fog does.
  const opacity = useTransform(camera, (c) => {
    // How far in front of the camera this photograph still is. Negative is
    // ahead, zero is level with the lens plane, positive is going past.
    const depth = c + z;
    return Math.min(
      ramp(depth, FOG_IN_START, FOG_IN_END),
      1 - ramp(depth, PASS_START, PASS_END),
    );
  });

  return (
    <motion.div
      className="bg-ink-900 absolute overflow-hidden"
      style={{
        width,
        height,
        // Centred on its own coordinate rather than hung off its top-left, so
        // the field is symmetrical about the line the camera travels.
        left: -width / 2,
        top: -height / 2,
        transform: `translate3d(${x}px, ${y}px, ${z}px)`,
        opacity,
      }}
    >
      {/* Empty alt on purpose. Individually these are ambience, not content —
          the field as a whole is labelled on the container instead, so a
          screen reader hears one thing rather than forty-eight. */}
      <Image src={src} alt="" fill sizes="430px" className="object-cover" />
    </motion.div>
  );
}

/**
 * The end of the corridor. Dead centre and sized to the viewport, so when the
 * camera reaches its plane it is drawn at exactly 1:1 and fills the screen —
 * no crossfade to a separate layer, you simply arrive at it. Fades up out of
 * the distance like everything else and then never leaves.
 */
function FinaleCard({
  src,
  alt,
  camera,
}: {
  src: string;
  alt: string;
  camera: MotionValue<number>;
}) {
  const opacity = useTransform(camera, (c) =>
    ramp(c + FINALE_Z, FOG_IN_START, FOG_IN_END),
  );

  return (
    <motion.div
      className="absolute overflow-hidden"
      style={{
        width: "100vw",
        height: "100dvh",
        left: "-50vw",
        top: "-50dvh",
        transform: `translate3d(0px, 0px, ${FINALE_Z}px)`,
        opacity,
      }}
    >
      <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
    </motion.div>
  );
}

export function GalleryFlythrough({
  photos,
  finale,
  label,
  progress,
  className,
}: {
  photos: string[];
  /** The photograph at the end, the one you arrive at. */
  finale: { src: string; alt: string };
  /** What the field as a whole is, for anyone who cannot see it. */
  label: string;
  /** 0 at the mouth of the corridor, 1 at the plane of the last photograph. */
  progress: MotionValue<number>;
  className?: string;
}) {
  const reduce = useReducedMotion();

  // Stops exactly on the last photograph's plane, which is what makes it land
  // at 1:1 and fill the screen rather than nearly doing so.
  const distance = -FINALE_Z;
  const camera = useTransform(progress, (p) => p * distance);

  // Pointer drift. Held at zero under reduced motion, where a scene that moves
  // when the pointer does is exactly what is being asked about.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const driftX = useSpring(pointerX, { stiffness: 60, damping: 18, mass: 0.6 });
  const driftY = useSpring(pointerY, { stiffness: 60, damping: 18, mass: 0.6 });

  const handlePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    // -1 to 1 across the box, so drift is the same whatever the window size.
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * -2 * DRIFT);
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * -2 * DRIFT);
  };

  const releasePointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div
      className={className}
      role="img"
      aria-label={label}
      onPointerMove={handlePointer}
      onPointerLeave={releasePointer}
      style={{ perspective: `${LENS}px` }}
    >
      {/* The camera. Everything else in here holds still. */}
      <motion.div
        className="absolute top-1/2 left-1/2 h-0 w-0"
        style={{
          x: driftX,
          y: driftY,
          z: camera,
          transformStyle: "preserve-3d",
        }}
      >
        {Array.from({ length: PLACEMENTS }, (_, index) => (
          <GalleryImage
            key={index}
            src={photos[index % photos.length]}
            index={index}
            camera={camera}
          />
        ))}

        <FinaleCard src={finale.src} alt={finale.alt} camera={camera} />
      </motion.div>
    </div>
  );
}
