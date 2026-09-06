"use client";

import {
  type MotionValue,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

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
const CARDS = 98;

/**
 * From here on the cards are drawn small and pushed off the centre line, so
 * the last stretch sweeps the edges of the frame and leaves the middle to the
 * photograph arriving down it.
 *
 * They are not a separate run: they sit on the same depth progression as
 * everything else. Packed into their own stretch of corridor they overlapped
 * the field and doubled its density — forty-one photographs on screen where
 * the rest of the flight held around twenty, and then nothing.
 */
const TAIL_FROM = 78;

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

/**
 * A photograph starts going the moment it reaches the lens and is gone not
 * long after. Held on longer than this and one that is nearly level with the
 * camera stays fully lit while perspective blows it up to fill the frame — so
 * it hangs, enormous, over whatever is behind it, which at the end of the
 * corridor is the photograph being arrived at.
 */
const PASS_START = 60;
const PASS_END = 340;

/** Beyond this the corridor is behind you. Perspective, in pixels. */
const LENS = 1200;

/**
 * Keeping the middle of the frame clear, for a camera that is parked.
 *
 * The flight does not need this: a card drifting over the copy is over it for
 * a few hundred milliseconds and the copy is moving too. A still does — the
 * hold pages stand at one point in the corridor and never move, so whatever
 * lands on the heading is on the heading for as long as anybody is reading it.
 *
 * Both numbers are at the lens plane, which is where perspective has already
 * been applied, so they are CSS pixels and do not move with the viewport.
 *
 * Two conditions rather than one, because a rule on position alone took seven
 * cards out and left a hole in the middle of the field. Only what is drawn big
 * enough to read *through* is worth removing; the small faint ones behind the
 * type are the texture the backdrop is there for.
 *
 * Measured at the hold pages' standing point: 47 cards on stage become 42. The
 * three that were actually on the copy — 154, 139 and 194px tall, at 183, 328
 * and 506px from the centre — and two more that were inside the depth window
 * but outside the fade, so already at nought opacity and costing a layer for
 * nothing. What is left in the zone tops out at 119px and 42% opacity, which
 * is the texture staying where it should be.
 */
const PARKED_CLEAR_RADIUS = 560;
const PARKED_CLEAR_MIN_DRAWN = 130;

/**
 * How far into the corridor the camera already is when the section opens.
 *
 * Starting at the mouth of it looks empty, and not for want of photographs: at
 * zero depth their offsets project almost one to one, so a field scattered
 * wide enough to fly through has most of itself outside the frame, and the
 * first few cards are level with the lens where they are fading out anyway.
 * A couple of hundred pixels along, everything has receded far enough to fit
 * and the screen is full — which is why the first flick of scroll used to fill
 * it, and why the frame you landed on had less on it than the one a moment
 * later. This just starts where that already is.
 */
const START_AT = 760;

/**
 * Steps of corridor between the deepest of the field and the photograph at the
 * end of it. Wide enough that every other card is past PASS_END by the time
 * the camera stops — at three steps the deepest few were still inside their
 * fade-out when it arrived, and hung there over the top of it.
 */
const FINALE_GAP = 8;

/** The corridor end to end, before either end of the flight is trimmed. */
const CORRIDOR = (CARDS + FINALE_GAP) * DEPTH_STEP;

/**
 * How much comes off each end of the flight.
 *
 * The section was five screens of scroll and it read as long. Nearly half of
 * that was an approach — cards going past the lens before the field had
 * gathered — and the last tenth was the run-out after it had thinned again.
 * Cutting both leaves the stretch that is worth flying through, at the same
 * distance of corridor per pixel scrolled, so what is left reads exactly as it
 * did. Settled on the sliders below; anything here changes the section's
 * height with it.
 */
export const LEAD_IN = 0.3;
export const RUN_OUT = 0.1;

const FULL_TRAVEL = CORRIDOR - START_AT;

/** The corridor at full length, in screens of scroll. */
export const FULL_SCREENS = 5;

/**
 * Where the camera opens and where it comes to rest, for a given trim.
 *
 * A function rather than two constants because the section can be dropped
 * into a different trim — the tuning panel below md does exactly that — and
 * because the finale's plane is the far end of this, so the two cannot be
 * allowed to disagree.
 */
export function flightRange(leadIn: number, runOut: number) {
  return {
    from: Math.round(START_AT + leadIn * FULL_TRAVEL),
    to: Math.round(CORRIDOR - runOut * FULL_TRAVEL),
  };
}

/**
 * Screens of scroll that trim wants. Keeping this derived is what stops the
 * section's height and the trim drifting apart: change one and the camera
 * covers a different distance per pixel scrolled, which is the whole feel of
 * the thing.
 */
export function flightScreens(leadIn: number, runOut: number) {
  return FULL_SCREENS * (1 - leadIn - runOut);
}

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

/**
 * The tail is drawn small and thrown wide. Perspective magnifies whatever is
 * near the lens, so a full-sized card in the last stretch arrives as a slab
 * across the middle of the frame — which is where the last photograph and the
 * copy both are. Small and far out, they sweep the edges instead.
 */
const TAIL_MIN_W = 150;
const TAIL_MAX_W = 290;

/** Footage is drawn at a fixed, generous size — it is there to be watched. */
const CLIP_W = 460;

/**
 * And held off the centre line, though far less than it once was. It used to
 * be pushed right out to three quarters, back when the copy was in the middle
 * of the frame and a 460px card coming up to the lens landed across it. The
 * copy is in the bottom-left corner now, so the middle is free — this is
 * enough to stop the three of them queueing up on the same line, and no more.
 */
const CLIP_SPREAD = 0.16;
const CLIP_KEEP_OUT = 0.3;

/**
 * The tail is scattered far *tighter* than the field, not wider. It only ever
 * shows in the last stretch, where it is close to the lens and perspective is
 * multiplying every offset — thrown as wide as the field it lands entirely off
 * the screen, which is exactly what happened at twice the field's spread.
 * Around this, a card drifts in from near the middle while it is still deep,
 * sweeps out to the edge as it comes up, and leaves.
 */
const TAIL_SPREAD = 0.45;

/**
 * How far the tail is held off the centre line, as a fraction of its spread.
 * The grid runs across the middle columns like everything else, so without
 * this a third of the tail lands on the centre — which is the one part of the
 * frame that has to stay clear, since the copy and the arriving photograph are
 * both there.
 */
const TAIL_KEEP_OUT = 0.4;

/**
 * What counts as a big card when the roster is dealt out, so that no
 * photograph ends up having only ever drawn small ones.
 *
 * It used to hold cards this wide off the centre line as well, wherever they
 * were in the corridor — a slab across the middle of the frame was a slab
 * across the copy. With the copy in the bottom-left corner that rule was
 * emptying the middle for nothing: every card worth looking at was being sent
 * to the edges, which is exactly where the field looked cluttered.
 */
const BIG_FROM = 300;

/**
 * Thinning the opening.
 *
 * The field is at its most crowded before the corridor has opened out: cards
 * that are within a couple of steps of each other in depth and land on nearly
 * the same spot arrive together, draw over one another, and cost a composited
 * layer each for the one of them you can see. This takes a share of them out —
 * the smaller of each crowded pair, worst pair first, until the quota is
 * filled.
 *
 * The whole corridor is scanned rather than only its opening. Sorting by how
 * crowded a pair is already puts the opening first — that is where they pile
 * up — and stopping the scan early left pairs eighty pixels apart standing at
 * the far end simply because nothing looked at them.
 */
const THIN_SHARE = 0.16;
const THIN_UNTIL = CARDS;

/** What counts as crowded: close enough in depth, and close enough across. */
const CROWD_Z = 520;
const CROWD_XY = 1150;

/**
 * And the room the footage gets to itself, on both counts.
 *
 * A still that arrives at the same depth as a clip and lands on the same part
 * of the frame draws over the one thing on that screen that is moving — at
 * best it is a photograph you cannot see, at worst it is the video you
 * cannot. Deeper than the crowding test above and tighter across: a clip is on
 * screen for longer than a still, so what matters is anything sharing its
 * stretch of corridor — but only if it is close enough to land on it.
 */
const CLIP_ROOM_Z = 1300;
const CLIP_ROOM_XY = 720;

/**
 * How far apart down the corridor the same photograph may be used twice.
 * Comfortably past the fog window, so its two turns are never in the frame
 * together — at the window itself they still overlapped at the edges.
 */
const MIN_APART = 3600;

/** Where a photograph hangs, and how big it is drawn. */
function placeAt(index: number, isClip = false) {
  const isTail = index >= TAIL_FROM;
  const narrowest = isTail ? TAIL_MIN_W : CARD_MIN_W;
  const widest = isTail ? TAIL_MAX_W : CARD_MAX_W;
  // Footage is drawn large and near enough the middle to actually be watched.
  // Left to the same lottery as the stills it lands in a 180px box off the
  // edge of the frame, which is a decoder running for nothing.
  const width = isClip
    ? CLIP_W
    : narrowest + noise(index * 3.1) * (widest - narrowest);
  // A mix of uprights and landscapes rather than one shape repeated — the
  // field reads as photographs pinned in space, not as a grid of tiles.
  const aspect = [0.75, 1.34, 1][Math.floor(noise(index * 5.7) * 3)];

  /* Strides rather than a raster. Walking the cells in order gave every card
     the column next to its neighbour's, and the handful nearest the lens —
     which are magnified enough to be most of what you see — were therefore
     always a short run of adjacent columns sweeping across the frame. That is
     the right-hand pile-up in the opening stretch: 87% of the visible card
     area on the right through the first fifth, peaking at 95, with the world
     itself very nearly symmetrical.

     Three and two are coprime with seven and five, so each still visits every
     column and every row before repeating and the field covers the same 35
     cells — but consecutive cards land across the grid from one another
     rather than side by side. */
  const col = (index * 3) % COLS;
  const row = (index * 2) % ROWS;
  // Just under a cell of jitter. Past a full cell, neighbours start landing on
  // top of one another — a clump of cards drawing over each other where one is
  // visible, which costs a composited layer each and shows nothing for them.
  const jitterX = (noise(index * 2.3) - 0.5) * 0.9;
  const jitterY = (noise(index * 7.9) - 0.5) * 0.9;

  // Rounded, and not for tidiness: these go straight into inline styles, and
  // the DOM serialises a sub-pixel float to three decimals on the way back
  // out. React then compares its own full-precision number against that
  // rounded string during hydration and calls every card a mismatch.
  // The tail sits in the last stretch of corridor and much further out from
  // the centre, so it sweeps the edges of the frame rather than the middle.
  const spreadX = isTail ? SPREAD_X * TAIL_SPREAD : SPREAD_X;
  const spreadY = isTail ? SPREAD_Y * TAIL_SPREAD : SPREAD_Y;
  // -0.5 to 0.5 across the grid. The tail gets pushed out of the middle of
  // that range without losing its scatter: the whole span is remapped into
  // the outer band rather than clamped, which would pile it on one radius.
  const gridX = (col + 0.5 + jitterX) / COLS - 0.5;
  const ny = (row + 0.5 + jitterY) / ROWS - 0.5;

  /* The grid says how far from the centre line a card sits; its index says
     which side. Perspective magnifies an offset by how close the card is, so
     the three or four nearest the lens are most of what is on screen — and
     which side the frame leans is decided by those few alone. Left to the
     grid's own signs that is luck, and in the opening stretch the luck was
     bad: one card at a world x of 251 was taking 43% of the frame on the
     right, with six of the next seven beside it. Alternating guarantees the
     run is split however it is sampled. The magnitudes are still the grid's,
     so the field covers the same width. */
  const nx = (index % 2 === 0 ? -1 : 1) * Math.abs(gridX);
  const outward = (v: number, keepOut: number) =>
    (v < 0 ? -1 : 1) * (keepOut + Math.abs(v) * (1 - keepOut));

  // The tail is pushed off the centre on one axis only, alternating. Pushed
  // out on both it piles into the four corners, which is exactly where the
  // clumps were — this sends half of it to the sides and half to the top and
  // bottom, so it sweeps the edges instead of stacking in the corners. It
  // still earns that: the last photograph grows down the middle, and the tail
  // has to leave it room.
  //
  // The field itself is pushed nowhere. Everything wide enough to notice used
  // to be sent sideways to clear the copy in the centre of the frame; the copy
  // is in a corner now, and that rule was leaving the middle empty while the
  // edges did all the work.
  const pushX = (isTail && index % 2 === 0) || isClip;
  const pushY = isTail && index % 2 === 1;
  const keepOut = isClip ? CLIP_KEEP_OUT : TAIL_KEEP_OUT;
  const scale = isClip ? CLIP_SPREAD : 1;

  const px = pushX ? outward(nx, keepOut) : nx;
  const py = pushY ? outward(ny, keepOut) : ny;

  /* One quadrant kept clear of slabs rather than the whole centre line. The
     copy sits low and to the left, so a card wide enough to matter that is
     heading for that corner is reflected out of it. A swap, not a push: a
     card near the middle stays near the middle, because its own coordinate
     barely changes sign — which is the difference between protecting the copy
     and emptying the frame around it.

     Most of them go up rather than across. Sending every one across doubled
     the right-hand side: through the first fifth of the flight the right half
     of the frame carried 87% of the visible card area, peaking at 95, and
     only 37 of the 98 cards were left of the centre line at all. Going up
     leaves the horizontal balance alone, so only every third one is allowed
     to cross. */
  const slab = isClip || width >= BIG_FROM;
  const inCopyCorner = slab && px < 0 && py > 0;
  const across = inCopyCorner && index % 3 === 0;

  return {
    x: Math.round((across ? -px : px) * spreadX * scale),
    y: Math.round((inCopyCorner && !across ? -py : py) * spreadY * scale),
    // Almost two steps of depth jitter, so neighbours trade places rather than
    // filing past at a fixed interval.
    z: Math.round(-(index + noise(index * 11.3) * 1.8) * DEPTH_STEP),
    width: Math.round(width),
    height: Math.round(width / aspect),
  };
}

type Frame = { w: number; h: number };

function subscribeFrame(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

let frameSnapshot: Frame | null = null;

/**
 * The window, as a value the parked pass can measure against.
 *
 * Cached and only rebuilt when the numbers actually move, because
 * useSyncExternalStore compares snapshots by identity and a fresh object every
 * read is an infinite loop.
 *
 * `null` on the server, and on the first client render with it — which is the
 * point. This only ever *removes* cards, so a null frame means the full field,
 * which is what the server can safely render and what the client hydrates
 * against. The trim lands on the pass after mount.
 */
function getFrame(): Frame {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (!frameSnapshot || frameSnapshot.w !== w || frameSnapshot.h !== h) {
    frameSnapshot = { w, h };
  }
  return frameSnapshot;
}

function useFrame() {
  return useSyncExternalStore(
    subscribeFrame,
    getFrame,
    () => null as Frame | null,
  );
}

/**
 * How far past the edge of the window a card has to be before it is dropped.
 *
 * The field slides with the pointer — DRIFT at the lens plane, magnified by
 * whatever the card's own depth does to it — so a card cleared for being just
 * outside the frame would pop in as soon as the mouse moved. This is that
 * travel with room over it.
 */
const FRAME_MARGIN = 120;

/**
 * Whether the corridor is anywhere near the screen./**
 * Whether the corridor is anywhere near the screen.
 *
 * The camera's own fade is not enough on its own: at rest the flight sits at
 * its opening frame, which is a full field of cards at full opacity — true of
 * the section wherever it happens to be on the page. On the home page that is
 * two screens below the fold, and two of the three clips are in that opening
 * frame, so they woke and fetched before anybody had scrolled.
 *
 * So the fade says which cards can be seen and this says whether the section
 * can. The same 200px of warning the poster component gives itself, and once
 * given it is never taken back — this is a latch for mounting media, not a
 * visibility flag.
 */
function useNearViewport(ref: React.RefObject<HTMLElement | null>) {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return near;
}

/**
 * Whether this card has ever been close enough to see.
 *
 * Footage is the whole reason this exists. A `<video autoPlay>` is fetched and
 * decoded the moment it is in the DOM, wherever it is on the page — measured on
 * the home page at `scrollY: 0`, with the corridor two screens down and not a
 * frame of it on stage: three clips and the finale, 2.77MB, all four buffered
 * end to end. The poster component directly above this defers on an
 * IntersectionObserver for exactly that reason, and none of it reached in here
 * because these cards are inside a pinned screen that *is* on stage — it is the
 * camera, not the viewport, that decides whether they can be seen.
 *
 * So it hangs off the fade instead, which is the thing that already knows. One
 * way only: it latches on the first frame the card is worth anything and never
 * lets go, because a video torn down and remounted every time it passes the
 * lens would refetch on every pass.
 */
function useAwake(opacity: MotionValue<number>, near: boolean) {
  const [seen, setSeen] = useState(() => opacity.get() > 0.01);

  useMotionValueEvent(opacity, "change", (value) => {
    if (value > 0.01) setSeen(true);
  });

  return near && seen;
}

function GalleryCard({
  src,
  index,
  camera,
  near,
  settled,
}: {
  src: string;
  index: number;
  camera: MotionValue<number>;
  /** Whether the corridor is on screen at all. See useNearViewport. */
  near: boolean;
  /**
   * Whether the field it belongs to has stopped changing shape.
   *
   * The parked pass needs the window's size to know which cards fall outside
   * the frame, and the window is not a thing the server has. So the first
   * render — server, and the client's hydrating pass with it — is the whole
   * field, and the trim only lands once `useFrame` has been read.
   *
   * Left to fetch through that, the browser asked for every photograph in the
   * untrimmed field before a single one was removed, and then asked again at
   * a different width when the trim reshuffled which card held which source:
   * measured on a 1728x1000 window, 38 requests across 22 files to draw 14
   * cards. So nothing is requested until the assignment it would be requested
   * for is the final one. It costs a paint on a backdrop behind a scrim.
   */
  settled: boolean;
}) {
  const isClip = src.endsWith(".mp4");
  const { x, y, z, width, height } = placeAt(index, isClip);

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

  const awake = useAwake(opacity, near && settled);

  return (
    <motion.div
      // No placeholder fill behind the picture. It reads as a slightly violet
      // box against the page while the source is still coming, and with a
      // hundred-odd of these the frame fills with empty boxes on first paint.
      // Nothing there is better than something wrong.
      className="absolute overflow-hidden"
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
      {isClip ? (
        // Only once the fade has it, and `preload="none"` so a browser that
        // mounts it a frame early still fetches nothing until it plays.
        awake ? (
          <video
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            className="size-full object-cover"
          />
        ) : null
      ) : settled ? (
        // Empty alt on purpose. Individually these are ambience, not content —
        // the field as a whole is labelled on the container instead, so a
        // screen reader hears one thing rather than a hundred.
        //
        // Eager, against the usual advice: they are all inside one pinned
        // screen rather than down the page, so lazy loading holds back the
        // ones that are only a scroll-tick away and the field arrives half
        // empty. There are only a couple of dozen distinct sources behind the
        // hundred-odd cards, so this is a couple of dozen requests.
        <Image
          src={src}
          alt=""
          fill
          /* The card's own box, with room for what perspective does to it.
             `430px` was the widest a card is ever drawn *before* the lens has
             had its say, handed to every one of them alike — so a card laid
             out at 170 and painted at 76 on screen asked for the same file as
             the slab arriving at the lens. On a 2x phone that resolves to
             860 and Next serves the 1080 bucket: measured, twenty cards on a
             hold page all fetching 29KB to be painted between 47 and 461px
             wide.

             1.4 is the magnification measured at the near end of the field —
             a 184px card drawn at 248 is the worst of them — so this is the
             box plus the most the perspective can add to it, and the cards
             that come right up to the lens still get their resolution. */
          sizes={`${Math.round(width * 1.4)}px`}
          /* The field, not a photograph anybody looks at squarely: a hundred
             of these drifting past behind a scrim, most of them under half
             opacity for most of their time on screen. 29KB to 18KB each at
             1080, measured, and the difference is not findable in motion.
             Declared in next.config — an undeclared quality is refused. */
          quality={50}
          loading="eager"
          className="object-cover"
        />
      ) : null}
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
  z,
  near,
}: {
  src: string;
  alt: string;
  camera: MotionValue<number>;
  /** Its plane, which is where the camera stops. */
  z: number;
  /** Whether the corridor is on screen at all. See useNearViewport. */
  near: boolean;
}) {
  const opacity = useTransform(camera, (c) =>
    ramp(c + z, FOG_IN_START, FOG_IN_END),
  );

  const awake = useAwake(opacity, near);

  return (
    <motion.div
      className="absolute overflow-hidden"
      style={{
        width: "100vw",
        // svh, matching the pin this sits inside. It was dvh, which resizes
        // the card mid-flight as the phone's chrome collapses — on the one
        // element whose whole job is to land at exactly 1:1 with the screen.
        height: "100svh",
        left: "-50vw",
        top: "-50svh",
        transform: `translate3d(0px, 0px, ${z}px)`,
        opacity,
      }}
    >
      {src.endsWith(".mp4") ? (
        // The 2MB one, and the one furthest down the corridor — so left
        // unmounted it is the whole of the saving. See useAwake.
        awake ? (
          <video
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-label={alt}
            className="size-full object-cover"
          />
        ) : null
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}
    </motion.div>
  );
}

export function GalleryFlythrough({
  photos,
  clips = [],
  finale,
  label,
  progress,
  leadIn = LEAD_IN,
  runOut = RUN_OUT,
  clearAt,
  className,
}: {
  photos: string[];
  /**
   * Footage, dropped into a handful of slots rather than cycled like the
   * stills. Every card holding one is a live decoder, and browsers give out
   * only a few of those — cycle three clips through a hundred cards and it is
   * a dozen at once, which stalls or silently refuses to play.
   */
  clips?: string[];
  /** The photograph at the end, the one you arrive at. */
  finale: { src: string; alt: string };
  /** What the field as a whole is, for anyone who cannot see it. */
  label: string;
  /** 0 at the mouth of the corridor, 1 at the plane of the last photograph. */
  progress: MotionValue<number>;
  /** How much of the corridor is cut off each end of the flight. */
  leadIn?: number;
  runOut?: number;
  /**
   * Park the framing at this point in the flight and clear the middle of it.
   *
   * For a still only. Given a progress value it works out where the camera is
   * standing, projects every card onto the lens plane at that one depth, and
   * drops the few that land large and central — see PARKED_CLEAR_RADIUS. Pass
   * it the same value the progress MotionValue is pinned to; hand it a moving
   * camera and it clears the frame for one instant of the flight and thins the
   * field for all the rest.
   */
  clearAt?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  // Only the parked pass reads this; the flight ignores it. See `covering`.
  const frame = useFrame();

  /* The flight is settled from the first render — its field is the same on the
     server as on the client, because nothing in it depends on the window. The
     parked pass has to wait to be told how big the frame is. */
  const settled = clearAt === undefined || frame !== null;
  const { from: flightFrom, to: flightTo } = flightRange(leadIn, runOut);
  const finaleZ = -flightTo;

  /* What is sitting on the copy, if the camera is parked.
     
     Projection is the one bit of maths the cards do not do for themselves: a
     card's world offset is magnified by how near the lens it is, so where it
     lands on screen is x * LENS / (LENS - depth), and its drawn size scales the
     same way. Everything here is the same arithmetic the browser is about to
     do with `perspective`, run once at this one depth instead of every frame at
     all of them. */
  const covering = useMemo(() => {
    const out = new Set<number>();
    if (clearAt === undefined) return out;

    const camera = flightFrom + clearAt * (flightTo - flightFrom);

    for (let index = 0; index < CARDS; index++) {
      const { x, y, z, width, height } = placeAt(index);
      const depth = camera + z;
      // Behind the lens or still in the fog: not on screen, nothing to clear.
      if (depth >= PASS_END || depth <= FOG_IN_START) continue;

      const scale = LENS / (LENS - depth);
      const dx = x * scale;
      const dy = y * scale;

      /* Off the side of the window, which until now nothing tested for.
         `offstage` drops what is outside the depth window and this dropped
         what sits on the copy, and between them they left every card that had
         simply been scattered past the edge of the frame — mounted, lit, and
         fetching a photograph nobody can see. It shows up as the field being
         thinner than the number of files it asks for: measured on a 1728x1000
         window, twenty cards lit and six of them outside the frame, so a
         backdrop drawing thirteen distinct photographs was loading
         seventeen.

         Only in the parked case, which is what this whole pass is. On the
         home page the camera travels the length of the corridor and a card
         at the edge now is down the middle of the frame in a moment. */
      if (frame) {
        const halfW = (width * scale) / 2;
        const halfH = (height * scale) / 2;
        if (
          Math.abs(dx) - halfW > frame.w / 2 + FRAME_MARGIN ||
          Math.abs(dy) - halfH > frame.h / 2 + FRAME_MARGIN
        ) {
          out.add(index);
          continue;
        }
      }

      const drawn = Math.max(width, height) * scale;
      if (drawn < PARKED_CLEAR_MIN_DRAWN) continue;

      if (Math.hypot(dx, dy) <= PARKED_CLEAR_RADIUS) out.add(index);
    }

    return out;
  }, [clearAt, flightFrom, flightTo, frame]);

  const { sourceFor, live } = useMemo(() => {
    /* Every crowded pair in the opening stretch, worst first, and the smaller
       of each one goes until the quota is met. Scored rather than thresholded
       so the number taken out is the number asked for: a threshold tight
       enough to catch only the bad cases takes out three, and one loose
       enough to matter takes out forty. Footage is never a candidate — there
       are only three of them and they are the point. */
    const dropped = new Set<number>();

    /* Anything outside the trimmed flight, first, and not against the quota —
       these are not thinning, they are cards that no longer have a moment.

       Too near and it is already past the lens when the section opens. At the
       other end the cut is FINALE_GAP short of the last photograph rather than
       at it: that gap is what empties the corridor before you arrive, so the
       screen is dark when the video fills it instead of having a still or two
       still coming past its corners. Trimming the flight moved the finale
       nearer without moving the field, which left the deepest card 32px in
       front of it. */
    const CLEAR_RUN = FINALE_GAP * DEPTH_STEP;
    const offstage = new Set<number>();
    for (let index = 0; index < CARDS; index++) {
      // A card's depth is its index whether it is holding footage or not, so
      // this does not need to know which slots the clips take.
      const depth = -placeAt(index).z;
      if (depth < flightFrom - PASS_END || depth > flightTo - CLEAR_RUN) {
        offstage.add(index);
      }
    }

    /* Then the clips, spread across what is left rather than across the field
       as written. Against the nominal field, a trim that opens the flight
       halfway down the corridor left two of the three behind the camera
       before the section had even started. Held inside the first four fifths
       of the run so none of them lands in the tail, where cards are drawn
       small and swept out to the edges. */
    const onStage: number[] = [];
    for (let index = 0; index < CARDS; index++) {
      if (!offstage.has(index)) onStage.push(index);
    }
    const reach = Math.max(0, Math.floor(onStage.length * 0.8) - 1);
    const clipSlots = new Map<number, string>(
      clips.map((clip, k) => [
        onStage[Math.round(((k + 1) / (clips.length + 1)) * reach)],
        clip,
      ]),
    );

    // The footage next: anything sharing its depth and its patch of frame
    // goes, whatever the quota. These count towards it rather than adding to
    // it, so the field loses the same share either way.
    for (const slot of clipSlots.keys()) {
      if (offstage.has(slot)) continue;
      const clip = placeAt(slot, true);
      for (let i = 0; i < CARDS; i++) {
        if (clipSlots.has(i) || offstage.has(i)) continue;
        const b = placeAt(i);
        if (Math.abs(b.z - clip.z) > CLIP_ROOM_Z) continue;
        if (Math.hypot(b.x - clip.x, b.y - clip.y) > CLIP_ROOM_XY) continue;
        dropped.add(i);
      }
    }

    const pairs: { i: number; j: number; crowd: number }[] = [];
    for (let i = 0; i < THIN_UNTIL; i++) {
      if (clipSlots.has(i) || dropped.has(i) || offstage.has(i)) continue;
      const a = placeAt(i);
      for (let j = i + 1; j < THIN_UNTIL; j++) {
        if (clipSlots.has(j) || dropped.has(j) || offstage.has(j)) continue;
        const b = placeAt(j);
        const dz = Math.abs(a.z - b.z);
        const across = Math.hypot(a.x - b.x, a.y - b.y);
        if (dz > CROWD_Z || across > CROWD_XY) continue;
        pairs.push({ i, j, crowd: 2 - dz / CROWD_Z - across / CROWD_XY });
      }
    }
    pairs.sort((p, q) => q.crowd - p.crowd || p.i - q.i || p.j - q.j);

    /* A share of the field that is actually flown past, not of the field as
       written. Against the nominal 98 this took out sixteen however short the
       flight was trimmed to, which on a trimmed corridor is most of it. */
    const quota = Math.round((CARDS - offstage.size) * THIN_SHARE);
    for (const { i, j } of pairs) {
      if (dropped.size >= quota) break;
      if (dropped.has(i) || dropped.has(j)) continue;
      dropped.add(placeAt(i).width <= placeAt(j).width ? i : j);
    }

    const slots: { index: number; z: number; width: number }[] = [];
    for (let index = 0; index < CARDS; index++) {
      if (clipSlots.has(index) || dropped.has(index) || offstage.has(index))
        continue;
      const { z, width } = placeAt(index);
      slots.push({ index, z, width });
    }

    /* Dealt in depth order, nearest first. The same photograph then comes back
       exactly one full pass of the roster later — around four thousand pixels
       further down the corridor — so its two turns are never in the frame
       together. Dealing by size instead read better on paper, one card from
       each size band per photograph, but said nothing about where the cards
       were: two turns could land a few hundred pixels apart and come past side
       by side, which is the same picture twice in one eyeful. */
    const source = new Map<number, number>();
    [...slots]
      .sort((a, b) => b.z - a.z)
      .forEach((slot, n) => source.set(slot.index, n % photos.length));

    /* That deal takes no view on prominence, and a few photographs come out of
       it having only ever drawn small cards. This hands each of those one big
       card from a photograph that has more than one, and takes the swap only
       if every photograph still repeats at least MIN_APART down the corridor.
       Guarding at more than the fog window is what keeps this from undoing the
       deal: at the window itself the repair buys prominence back and puts the
       duplicates on screen again. */
    const grouped = () => {
      const groups = new Map<number, typeof slots>();
      for (const slot of slots) {
        const key = source.get(slot.index)!;
        groups.set(key, [...(groups.get(key) ?? []), slot]);
      }
      return groups;
    };

    const stillApart = (groups: Map<number, typeof slots>) => {
      for (const list of groups.values()) {
        for (let a = 0; a < list.length; a++) {
          for (let b = a + 1; b < list.length; b++) {
            if (Math.abs(list[a].z - list[b].z) < MIN_APART) return false;
          }
        }
      }
      return true;
    };

    for (let pass = 0; pass < 8; pass++) {
      const groups = grouped();
      const poor = [...groups.entries()].filter(
        ([, list]) => Math.max(...list.map((s) => s.width)) < BIG_FROM,
      );
      if (poor.length === 0) break;

      let swapped = false;
      for (const [thin, thinList] of poor) {
        const spare = [...groups.entries()].filter(
          ([, list]) => list.filter((s) => s.width >= BIG_FROM).length > 1,
        );

        for (const [rich, richList] of spare) {
          const give = richList.find((s) => s.width >= BIG_FROM)!;
          const take = [...thinList].sort((a, b) => b.width - a.width)[0];

          source.set(give.index, thin);
          source.set(take.index, rich);
          if (stillApart(grouped())) {
            swapped = true;
            break;
          }
          source.set(give.index, rich);
          source.set(take.index, thin);
        }
        if (swapped) break;
      }
      if (!swapped) break;
    }

    const stills = new Map<number, string>();
    for (const slot of slots) {
      stills.set(slot.index, photos[source.get(slot.index)!]);
    }

    return {
      sourceFor: (index: number) => clipSlots.get(index) ?? stills.get(index)!,
      live: Array.from({ length: CARDS }, (_, i) => i).filter(
        (i) => !dropped.has(i) && !offstage.has(i) && !covering.has(i),
      ),
    };
  }, [photos, clips, flightFrom, flightTo, covering]);

  // Opens already inside the corridor and stops exactly on the last card's
  // plane, which is what makes that one land at 1:1 and fill the screen rather
  // than nearly doing so.
  const camera = useTransform(
    progress,
    (p) => flightFrom + p * (flightTo - flightFrom),
  );

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
    // Mouse only. A finger dragging the page through the pin is a scroll, not
    // a look around, and it reports pointermove the whole way — so on a phone
    // the camera swung sideways every time you scrolled, and stayed swung:
    // pointerleave is a mouse event and never arrives to put it back. The
    // drift is a hover affordance and belongs with the rest of them.
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    // -1 to 1 across the box, so drift is the same whatever the window size.
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * -2 * DRIFT);
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * -2 * DRIFT);
  };

  const releasePointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  // Only the media waits on this. Every card is mounted and positioned as
  // before — it is the `<video>` inside a handful of them that holds off.
  const rootRef = useRef<HTMLDivElement>(null);
  const near = useNearViewport(rootRef);

  return (
    <div
      ref={rootRef}
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
        {live.map((index) => (
          <GalleryCard
            key={index}
            src={sourceFor(index)}
            index={index}
            camera={camera}
            near={near}
            settled={settled}
          />
        ))}

        <FinaleCard
          src={finale.src}
          alt={finale.alt}
          camera={camera}
          z={finaleZ}
          near={near}
        />
      </motion.div>
    </div>
  );
}
