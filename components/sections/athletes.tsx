"use client";

import {
  type MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useRef } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Kicker } from "@/components/ui/kicker";
import { LineRise } from "@/components/ui/line-rise";
import { fighters } from "@/content/fighters";
import { cn } from "@/lib/utils";

/**
 * The athletes, as a field rather than a grid.
 *
 * Eight portraits scattered around the copy at four different sizes, and the
 * copy dead centre on top of them. The roster page already has the grid; a
 * second one on the home page would answer "who fights here" with the same
 * shape twice. This says it the other way round — the faces are the room the
 * sentence is standing in.
 *
 * No rule at the top and no frame around it. Every module above this one is
 * boxed or ruled, and a field whose whole point is that it has no edges cannot
 * be drawn inside one. The section's own spacing and the dark it fades into
 * are the separation.
 *
 * Nothing in the field is reachable and nothing in it is announced: it is
 * `aria-hidden`, pointer-transparent, and the two buttons are the only way
 * anywhere from here.
 */

/**
 * How far the nearest card travels each way over a full pass of the section,
 * in pixels. Everything else is a fraction of it, by depth — which is the
 * whole trick. A field of portraits that all move together is a wallpaper; the
 * near ones outrunning the far ones is what makes it a space with the copy
 * standing in it.
 */
const TRAVEL = 72;

type Scatter = {
  /** Which fighter, off the roster — one source for the names and the crops. */
  id: string;
  /**
   * Where it sits and how wide it is, as literal utilities.
   *
   * Literal because Tailwind scans source text for whole class names: a string
   * built from numbers at runtime is never generated and the card lands at the
   * top-left corner at its intrinsic width. The percentages are the one thing
   * on the page that is not on the 4px grid, and cannot be — a scatter is
   * placed against the box it is in, which is a different size on every screen.
   *
   * Visibility rides along in the same string. Eight cards need a screen wide
   * enough to have a periphery; a phone gets the four that sit at the edges of
   * it, and the rest arrive as there is room for them.
   */
  place: string;
  /**
   * 0 far, 1 near. Sets the dim and the parallax together, so a card cannot
   * end up small and bright or large and faint — the two things that make a
   * scatter read as a collage rather than as depth.
   */
  depth: number;
  /** Degrees. Small — enough to read as dropped, not as a scrapbook. */
  tilt: number;
};

/**
 * The eight, in reading order across the box.
 *
 * Peripheral by construction, and the periphery is a different shape at every
 * width, so four of them carry a second position rather than four of them
 * carrying one that only ever suited the widest screen:
 *
 * - From lg, all eight: one down each side at mid height, two over the top
 *   edge, two under the bottom, and one bleeding off each of the left and
 *   right. The middle of the box is left to the copy.
 * - md drops the two smallest, which are the two the copy would sit on
 *   soonest as the box narrows.
 * - A phone keeps four and moves them to its own four corners — top-centre and
 *   top-right, bottom-left and bottom-right — because at 375 the copy runs the
 *   full width of the column and the only periphery left is above and below it.
 *   Two of the four bleed off the side, which is what stops four cards on a
 *   narrow screen reading as a two-by-two grid.
 *
 * They overlap each other and they overlap the copy's outer edges, which is
 * what "behind" means — the scrim below is what keeps that legible rather than
 * a hole cut in the field.
 *
 * Short names on the small cards. At 112px a caption is two lines or one, and
 * which it is should be the card's decision rather than the surname's.
 */
const scatter: Scatter[] = [
  {
    id: "kristoffer-bjorkskog",
    place: "left-[-5%] top-[8%] w-44 lg:w-52 max-md:hidden",
    depth: 0.7,
    tilt: -3,
  },
  {
    id: "benjamin-sesay",
    place:
      "left-[-6%] top-[62%] w-32 md:top-[52%] md:left-[8%] md:w-48 lg:w-56",
    depth: 0.9,
    tilt: 2,
  },
  {
    id: "luca-coker",
    place: "left-[26%] top-[-6%] w-28 md:w-32 lg:w-36",
    depth: 0.25,
    tilt: 4,
  },
  {
    id: "bedirhan-ceran",
    place:
      "left-[52%] top-[78%] w-32 md:top-[76%] md:left-[38%] md:w-36 lg:w-40",
    depth: 0.4,
    tilt: -2,
  },
  {
    id: "younes-sadi",
    place: "left-[62%] top-[4%] w-36 max-lg:hidden",
    depth: 0.3,
    tilt: 3,
  },
  {
    id: "tais-odonnell",
    place: "left-[72%] top-[58%] w-40 lg:w-44 max-md:hidden",
    depth: 0.55,
    tilt: -4,
  },
  {
    id: "youssef-assouik",
    place:
      "left-[80%] top-[6%] w-32 md:top-[14%] md:left-[88%] md:w-44 lg:w-52",
    depth: 0.8,
    tilt: 2,
  },
  {
    id: "niclas-larsen",
    place: "left-[56%] top-[88%] w-32 max-lg:hidden",
    depth: 0.2,
    tilt: -3,
  },
];

/**
 * The largest a card ever renders. The widths above run 112 to 224, so one
 * string covers the set — next/image still picks per device pixel ratio off
 * it, and a card asking for one size too many is cheaper than eight cards
 * each asking for their own.
 */
const SIZES = "(min-width: 1024px) 224px, (min-width: 768px) 192px, 144px";

/**
 * The dark the copy is read against, and it goes where the copy goes: an
 * ellipse at the middle of the box, held near-solid across the width of the
 * text and gone by the time it reaches the outer cards.
 *
 * Two stops rather than one ramp. A straight falloff from the centre is at
 * half strength halfway out, which is exactly where the ends of the heading
 * are — the hold is what keeps the whole measure covered instead of only the
 * middle of it.
 *
 * The radii come off custom properties because the box changes shape, not just
 * size: a phone is taller than it is wide with a full-width column of copy in
 * it, and the ellipse that suits 1440 leaves the ends of a phone's lines
 * standing on bare portrait.
 *
 * `rgb(5 5 8 / a)` is --color-void written out — a gradient stop needs the
 * channels and the alpha together, and this is how the corridor's own veils
 * are written.
 */
const SCRIM =
  "radial-gradient(ellipse var(--scrim-x) var(--scrim-y) at 50% 50%," +
  " rgb(5 5 8 / 0.92) 0%, rgb(5 5 8 / 0.88) 45%, transparent 100%)";

/**
 * Where the field stops. Not a hard edge — the cards at the top and the bottom
 * are deliberately half outside the box, and a clip alone slices them off
 * along a straight line the whole width of the screen. Faded, they run out of
 * the section instead of being cut out of it.
 *
 * Only the top and bottom. Left and right are the viewport's own edges, and a
 * portrait disappearing off the side of the screen already reads as the field
 * carrying on past it.
 */
const FIELD_FADE =
  "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)";

function ScatterCard({
  card,
  progress,
  still,
}: {
  card: Scatter;
  progress: MotionValue<number>;
  /** Reduced motion: the field is placed, and then it holds. */
  still: boolean;
}) {
  const fighter = fighters.find((f) => f.id === card.id);

  /* Lagging behind the page on the way in and leading it on the way out, by
     depth — so scrolling down pulls the near cards up past the copy while the
     far ones barely move. The range is written as a pair rather than gated
     with a condition, so the hook runs the same either way. */
  const reach = still ? 0 : TRAVEL * card.depth;
  const y = useTransform(progress, [0, 1], [reach, -reach]);

  if (!fighter) return null;

  return (
    <motion.div
      className={cn("absolute", card.place)}
      // Dim with distance, over the void: 0.45 at the back of the field to
      // 0.80 at the front. Nothing reaches full — the field is the room, and a
      // portrait at full strength beside a heading competes with it.
      style={{ y, rotate: card.tilt, opacity: 0.35 + card.depth * 0.5 }}
    >
      {/* The roster card, at a quarter of the size: the same panel, the same
          mount around the photograph, the same notch off the top-right. The
          belt, the record and the handle are all gone — at 112px they are
          noise, and the page they belong on is one button away. */}
      <div className="bg-panel">
        {/* 4px of the card's own ink on three sides, and none at the bottom
            where the caption is the frame. The notch is shallower than the
            roster's for the same reason the mount is: both are proportions of
            a card, and this one is a third of the width. */}
        <div className="p-1 pb-0">
          <div className="corner-notch relative aspect-[4/5] [--corner-notch:10px] lg:[--corner-notch:16px]">
            <Image
              src={fighter.imageSrc}
              alt=""
              fill
              sizes={SIZES}
              // The field is decoration and it is behind a scrim. Half the
              // bytes at this size is not a difference anyone can see, and
              // there are eight of them.
              quality={50}
              className="object-cover object-top"
            />
          </div>
        </div>

        <div className="p-2">
          {/* Not plain-6 — that step is 15px on a phone, on a card 112 wide.
              The scale's own two steps down, which is where a caption lives. */}
          <p className="font-body text-sm leading-tight font-medium text-white lg:text-base">
            {fighter.firstName} {fighter.lastName}
          </p>
          <p className="text-ink-300 mt-0.5 text-xs leading-tight lg:text-sm">
            {fighter.division}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function Athletes() {
  const field = useRef<HTMLDivElement>(null);

  // The whole pass: nought as the section's top clears the bottom of the
  // frame, one as its bottom clears the top. The field is the target rather
  // than the section because it is inset-0 of it — the same box, and the only
  // child this component holds a ref to.
  const { scrollYProgress } = useScroll({
    target: field,
    offset: ["start end", "end start"],
  });

  // null until it is known, which is the server render and the first client
  // one. Anything but a definite yes moves.
  const still = useReducedMotion() === true;

  return (
    // A floor, not a height. The copy is what the section is for and it sets
    // the height on its own once the type is large enough; the floor is what
    // gives the field somewhere to be on a screen where it does not.
    //
    // Clipped, or the cards that run off the left and the right would widen
    // the document and put a horizontal scrollbar on the page.
    <Section
      spacing="lg"
      container={false}
      className="relative flex min-h-160 flex-col justify-center overflow-clip md:min-h-180 lg:min-h-200"
    >
      {/* A second dim on the whole field below md, on top of each card's own.
          The per-card opacity is a depth cue and it is the same cue at every
          size; how far back the field as a whole should sit is a different
          question, and on a phone the answer is further. There is no periphery
          on a 375 column — the copy runs the full width of it — so a card that
          reads as background beside a 1440 heading is a card standing on top of
          a 375 one. Two of the four a phone shows are the belt portraits, which
          are the brightest files in the set, and at 0.75 they were outshining
          the heading. 0.65 over the top puts the whole field behind the type
          again without flattening the near-to-far order inside it.

          One step back at md and off at lg, which is the same argument twice:
          how far the field has to stand down is how little room there is to
          stand down into, and the periphery grows with the screen. */}
      <div
        ref={field}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-65 md:opacity-85 lg:opacity-100"
        style={{ maskImage: FIELD_FADE }}
      >
        {scatter.map((card) => (
          <ScatterCard
            key={card.id}
            card={card}
            progress={scrollYProgress}
            still={still}
          />
        ))}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [--scrim-x:95%] [--scrim-y:55%] md:[--scrim-x:46%] md:[--scrim-y:56%]"
        style={{ background: SCRIM }}
      />

      {/* Centred on both axes, and the only block on the home page that is.
          Every other module ranges its copy off an edge — left in the text-and-
          image block, right in the format grid — because each of those has a
          column or a corner to hold. This one has a field all the way round it,
          and there is no edge to range from. */}
      <Container className="relative flex flex-col items-center text-center">
        <Kicker>The athletes</Kicker>

        {/* display-2, the step the home page's section headings share.

            The measure is on the heading rather than a wrapper, where `ch`
            resolves against its own type size — set on the box it would come
            off the 15px body font and cut the line to a third of the width.

            27ch is room for two lines and not three. At 20 the question came
            out as DO YOU HAVE WHAT IT / TAKES TO BECOME THE / NEXT ATHLETE? —
            three lines ending on a pronoun and a determiner, which is a
            heading held together by nothing.

            The break at the clause is not reachable and the measure is not
            what is stopping it. Set at display-2's xl step the four candidate
            lines come out at "Do you have what it takes to" 670px, "…what it
            takes" 606, "to become the next athlete?" 668 and "become the next
            athlete?" 604 — so a box that holds the second line but refuses the
            TO on the first has a two-pixel window to sit in, and any font that
            lands or any retune of the ratio closes it. The split infinitive is
            the honest one: two lines within 66px of each other, and the
            question mark closing the shorter.

            Below md the container is narrower than the measure and does the
            wrapping itself, which is what it is for. */}
        <LineRise
          as="h2"
          text="Do you have what it takes to become the next athlete?"
          className="display-2 mt-6 max-w-[27ch] md:mt-8"
        />

        <p className="text-ink-200 mt-4 max-w-[46ch] text-base leading-[1.4] md:mt-6">
          World, European and Nordic champions, out of karate, Thai boxing and
          kickboxing — that was 1.0. The 2.0 card is still being written.
        </p>

        {/* Two asks, and they are not the same weight. The roster is where
            somebody who has read this far is going, so it takes the violet;
            applying is the smaller door and it takes the outline. The pair
            wraps to a column on a narrow phone rather than shrinking, so
            neither label ever sets on two lines. */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 md:mt-12">
          <Button href="/athletes">See athletes</Button>
          <Button href="/fight-apply" variant="outline-white">
            Become an athlete
          </Button>
        </div>
      </Container>
    </Section>
  );
}
