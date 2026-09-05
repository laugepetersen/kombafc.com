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
const PLACEMENTS = 76;

/**
 * Extra photographs packed into the last stretch of corridor, wider of the
 * centre line than the rest. Without them the field thins out exactly as the
 * last photograph is arriving and it turns up on an empty screen — these are
 * still streaming past the edges while it comes in.
 */
const TAIL = 18;

/** Widest and narrowest a card is drawn, before perspective has its say. */
const CARD_MIN_W = 170;
const CARD_MAX_W = 430;

/** How far apart along the corridor consecutive photographs sit. */
const DEPTH_STEP = 145;

/** How far across and up the field is scattered, in pixels at the lens plane. */
const SPREAD_X = 3800;
const SPREAD_Y = 2500;

/**
 * The field is laid on a coarse grid and then jittered inside each cell,
 * rather than scattered outright. Pure noise clumps: run it and half the
 * screen ends up crowded while the other half is empty, and no amount of
 * reseeding fixes it because the clumping is the point of noise.
 */
const COLS = 7;
const ROWS = 5;

/**
 * Pixels the scene slides at the far edge of the pointer's travel.
 *
 * A slide is the whole of it, and it is already depth-correct: the field moves
 * by this much in world space, and perspective then divides that by each
 * photograph's own distance, so what is near the lens travels far across the
 * screen and what is deep in the corridor barely stirs.
 *
 * It was briefly given a turn as well, on the theory that a slide alone reads
 * flat. That was wrong twice over — a turn is a pan, which moves everything by
 * roughly the same amount on screen and so carries no parallax at all, and it
 * pivots on the field's own origin rather than the lens. The last photograph
 * sits eleven and a half thousand pixels from that origin, so three degrees
 * swung it about six hundred across the screen at the very moment it was meant
 * to have arrived and settled.
 */
const DRIFT = 34;

/**
 * Where the drift starts easing off, as a fraction of the flight. By the end
 * the last photograph fills the screen and is the thing being looked at rather
 * than part of the field — and being closest to the lens, it is exactly what
 * the drift would throw around hardest if it were left on.
 */
const SETTLE_FROM = 0.72;

/** Where a photograph fades up out of the distance, and where it passes. */
const FOG_IN_START = -3600;
const FOG_IN_END = -2100;
const PASS_START = 220;
const PASS_END = 620;

/** Beyond this the corridor is behind you. Perspective, in pixels. */
const LENS = 1200;

/**
 * Steps of corridor between the deepest of the field and the photograph at the
 * end of it. Wide enough that every other card is past PASS_END by the time
 * the camera stops — at three steps the deepest few were still inside their
 * fade-out when it arrived, and hung there over the top of it.
 */
const FINALE_GAP = 8;

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

/** How much of the corridor the tail is packed into, in pixels. */
const TAIL_DEPTH = 2600;

/** Where a photograph hangs, and how big it is drawn. */
function placeAt(index: number) {
  const width = CARD_MIN_W + noise(index * 3.1) * (CARD_MAX_W - CARD_MIN_W);
  // A mix of uprights and landscapes rather than one shape repeated — the
  // field reads as photographs pinned in space, not as a grid of tiles.
  const aspect = [0.75, 1.34, 1][Math.floor(noise(index * 5.7) * 3)];

  const cell = index % (COLS * ROWS);
  const col = cell % COLS;
  const row = Math.floor(cell / COLS);
  // More than a cell of jitter, so neighbours overlap and the grid
  // underneath never shows even to someone looking for it.
  const jitterX = (noise(index * 2.3) - 0.5) * 1.25;
  const jitterY = (noise(index * 7.9) - 0.5) * 1.25;

  // Rounded, and not for tidiness: these go straight into inline styles, and
  // the DOM serialises a sub-pixel float to three decimals on the way back
  // out. React then compares its own full-precision number against that
  // rounded string during hydration and calls every card a mismatch.
  // The tail sits in the last stretch of corridor and further out from the
  // centre, so it sweeps the edges of the frame rather than the middle.
  const isTail = index >= PLACEMENTS;
  const spreadX = isTail ? SPREAD_X * 1.35 : SPREAD_X;
  const spreadY = isTail ? SPREAD_Y * 1.35 : SPREAD_Y;
  const z = isTail
    ? FINALE_Z + 700 + Math.round(noise(index * 13.7) * TAIL_DEPTH)
    : Math.round(-(index + noise(index * 11.3) * 1.8) * DEPTH_STEP);

  return {
    x: Math.round(((col + 0.5 + jitterX) / COLS - 0.5) * spreadX),
    y: Math.round(((row + 0.5 + jitterY) / ROWS - 0.5) * spreadY),
    // Jittered off the step so they do not arrive on a beat.
    z,
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
  // Firm rather than floaty: light enough to arrive with the pointer instead
  // of catching up with it a beat later, damped just short of overshooting.
  const spring = { stiffness: 190, damping: 26, mass: 0.22 };
  const easedX = useSpring(pointerX, spring);
  const easedY = useSpring(pointerY, spring);

  // Falls away to nothing over the last of the flight, so the photograph you
  // arrive at holds still instead of swinging under the pointer.
  const settle = useTransform(progress, (p) => 1 - ramp(p, SETTLE_FROM, 1));
  const driftX = useTransform([easedX, settle], ([v, s]: number[]) => v * s);
  const driftY = useTransform([easedY, settle], ([v, s]: number[]) => v * s);

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
        {Array.from({ length: PLACEMENTS + TAIL }, (_, index) => (
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
