"use client";

import {
  type MotionValue,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import Link from "next/link";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

import { LineReveal } from "@/components/ui/heading-reveal";
import { CTA_FILL } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

/**
 * The bar across the foot of the screen: the ask on the left, the night's
 * facts beside it.
 *
 * Pinned to the bottom of whatever it is dropped into, so on a pinned section
 * it stays under the photographs for the whole flight rather than scrolling
 * with them. Its furniture sits on the container's line at every width, the
 * same line every other block on the page starts from. The scrim behind it is
 * full-bleed regardless — the dark at the foot of the screen is the page's,
 * not the bar's, and stopping it at a gutter would draw an edge that is not
 * there.
 *
 * The white block is a segment of the bar rather than a Button — full-height,
 * square, and running to the bottom of the screen, which is a different object
 * from the site's inline CTAs, bevel and all.
 *
 * The facts sit still side by side when there is room for all of them. Below
 * md there is room for one, so they take it in turns instead, each arriving on
 * the site's line reveal and dropping back out before the next comes up.
 *
 * The rule along the top is the only other thing that moves, and it is not an
 * animation: it is how far into the scroll below you are, drawn on the line
 * that was already there.
 */

/** How long a fact holds the strip on small screens, once it has arrived. */
const DWELL_MS = 2600;

/**
 * And how long it has to get out of the way. The reveal runs a second with a
 * tenth between its lines, so the next one waits that out rather than rising
 * through the one that is still falling — stacked in the same cell, the two
 * would cross at half opacity in the middle of the strip.
 */
const CLEAR_MS = 1100;

/**
 * Where the flight counts as over and the white line clears itself away, and
 * where it comes back on the way up. Two numbers rather than one, the same
 * reason every entrance on the site has two: on a single boundary a scroll
 * resting on it — or a trackpad easing across — would pull the line in and
 * out repeatedly.
 */
const CLEARED_AT = 0.999;
const RESTORED_AT = 0.985;

/**
 * How much of the line's head is the fade, in pixels rather than a share of
 * it. A ramp across the whole drawn length — which is what scaling a box with
 * a gradient in it gives you — is a line that is barely there at ten per cent
 * and half lit at the end. The head wants to be the same softness however far
 * along it is, so the fill is sized by width and the stop is absolute.
 */
const HEAD_FADE = "24px";

/** How long the line takes to retract, on the site's easing. */
const CLEAR_S = 0.7;
const CLEAR_EASE = [0.23, 1, 0.32, 1] as const;

/** Below Tailwind's md, which is where the row becomes a single strip. */
const STACKED = "(max-width: 47.999rem)";
const REDUCED = "(prefers-reduced-motion: reduce)";

export type ShowFact = {
  /** The fact — a place, a count, a name. */
  label: string;
  /** What it is. One short line under it. */
  detail: string;
};

/** The two lines, sized the same wherever they are drawn. */
const LABEL_CLASS = "text-base font-medium text-white";
const DETAIL_CLASS = "text-ink-200 text-xs lg:text-sm";

function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    useCallback(() => window.matchMedia(query).matches, [query]),
    () => false,
  );
}

/**
 * The block itself, as whichever element its job makes it.
 *
 * Split out so the choice is made in one place rather than duplicated down two
 * near-identical branches of the bar's markup — the styling, the two lines and
 * the icon are the same either way, and only the tag and its one prop differ.
 */
function Segment({
  href,
  onClick,
  className,
  children,
}: {
  href?: string;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}) {
  if (href !== undefined) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}

export function ShowBar({
  action,
  href,
  onClick,
  accent = "white",
  facts,
  progress,
  className,
}: {
  /**
   * The label on the block, and one line of it. It carried an optional second
   * for a while — the verb over the name of the film — and both bars say
   * enough in one: "Watch 1.0 Aftermovie", "Rewatch KOMBA 1.0".
   */
  action: string;
  /**
   * Where the block goes, when it goes anywhere. An anchor, not a button with
   * a handler: a link is what gives a middle click a new tab, a right click a
   * copyable address and a screen reader the word "link"; a button wired to
   * `router.push` is a destination in disguise, and the site already makes
   * that argument in `Button`.
   *
   * The converse holds too, which is what `onClick` is for. The hero's bar
   * opens a player over the page it is already on — that is not a navigation
   * and dressing it as one would promise an address it cannot give.
   */
  href?: string;
  /** Pressed instead of followed. Exactly one of this and `href`. */
  onClick?: () => void;
  /**
   * Which paint the block wears.
   *
   * White by default, which is what a bar sitting *over* the site's own violet
   * moments wants — the flythrough runs a violet-lit corridor behind it and a
   * violet block on top of that is one violet too many. The hero has no violet
   * of its own, and there the block is the page's primary ask, so it takes the
   * primary ask's gradient.
   */
  accent?: "white" | "violet";
  facts: ShowFact[];
  /**
   * Nought to one across whatever scroll the bar is sitting over. Given one,
   * the rule along the top fills white to say how far in you are. Left off,
   * it is a plain hairline.
   */
  progress?: MotionValue<number>;
  className?: string;
}) {
  /* Held here rather than derived in a transform, because it is a state with
     a transition rather than a value that follows the scroll: the line
     retracts on its own clock once the corridor is done, and comes back the
     same way. A fallback value keeps the hook count fixed when no progress is
     given at all. */
  const idle = useMotionValue(0);
  /* The head's position, as a slide rather than a length. Sizing the fill by
     width would put the fade where it belongs in one line — but motion does
     not drive `width` from a motion value the way it drives a transform, and
     it silently stops writing the property at all. Confirmed side by side: a
     derived value bound to scaleX tracked the scroll, the same value bound to
     width sat at its mount reading. So the fill is the full width of the
     track, slid left by however much is left to go, with the container
     clipping what hangs off the end. */
  const slide = useTransform(progress ?? idle, (v) => `${(v - 1) * 100}%`);
  const [cleared, setCleared] = useState(false);
  useMotionValueEvent(progress ?? idle, "change", (v) => {
    setCleared((was) => (was ? v >= RESTORED_AT : v >= CLEARED_AT));
  });

  const stacked = useMediaQuery(STACKED);
  const reduce = useMediaQuery(REDUCED);
  const cycling = stacked && !reduce && facts.length > 1;

  /* Two states rather than one index, because the run has a gap in it: the
     fact on screen goes down and out, nothing is up for a moment, then the
     next comes in. An index alone cannot say "none of them". */
  const [index, setIndex] = useState(0);
  const [up, setUp] = useState(true);

  useEffect(() => {
    if (!cycling) return;

    const id = window.setTimeout(
      () => {
        if (up) {
          setUp(false);
          return;
        }
        setIndex((i) => (i + 1) % facts.length);
        setUp(true);
      },
      up ? DWELL_MS : CLEAR_MS,
    );

    return () => window.clearTimeout(id);
  }, [cycling, up, facts.length]);

  return (
    <div
      className={cn("pb-[env(safe-area-inset-bottom)]", className)}
      /* The ground, and the header's scrim upside down: void rising out of the
         bottom edge and gone by the top of the bar. A backdrop-filter was here
         first and had almost nothing to blur against near-black photographs —
         it read as a flat grey patch. No taller than the bar, so what is
         passing behind meets the rule rather than a band of dark above it. */
      style={{
        background: "linear-gradient(to top, rgb(5 5 8 / 0.8), transparent)",
      }}
    >
      {/* On the container's line at every width. It used to zero the gutter
          below md so the block ran to the edge of the screen, on the argument
          that the edge is where a thumb is — but the bar is the only thing on
          the site that left the grid to make that argument, and a full-bleed
          band under a page whose every other edge lines up reads as the one
          element that got away rather than as a deliberate exception.

          The scrim behind it stays full-bleed, which is the part that has to
          be: the dark at the foot of the screen belongs to the page, and
          stopping it at a gutter would draw an edge that is not there. */}
      <Container>
        {/* Reversed on small screens: the ask goes to the bottom edge, where a
            thumb is, and the fact sits above it. Side by side from md, where
            the row owns the height and both halves take all of it. */}
        <div className="relative flex flex-col-reverse md:h-18 md:flex-row">
          {/* The ask.

              No border of its own, and none above it: the rule belongs to the
              facts, so the block runs the full height of the bar and its top
              edge is the same line the rule is drawn on.

              No bevel either. `tap` still gives it the press.

              px-6 all the way up, which is what every other CTA on the site is
              set at. It was on 32 and then 40, and at that width the label sat
              in the middle of a panel rather than in a button.

              The paint is the caller's — see `accent`. Violet is CTA_FILL, the
              same gradient as every primary button on the site and the same one
              the billing chips carry; the glow and the hover lift stay behind
              with `Button`, because this runs to the edge of the screen and a
              halo on a full-bleed block has nowhere to fall.

              56px on a phone and the bar's own height from md.

              No `tap`. The press is for a control you can see the whole of —
              this one is a segment welded into a bar that runs the width of the
              container, and shrinking it two per cent pulls it away from the
              rule and the strip it is butted against, so the bar comes apart
              for 90ms every time it is pressed.

              Which also settles a conflict that was already here: `tap` sets a
              `transition` shorthand and so does the brightness fade below it,
              and two of those on one element resolve by stylesheet order with
              one dropped silently. See CLAUDE.md.

              The two things `tap` did that are not the press stay, written out.
              Neither is an effect — they are the absence of the browser's own:
              iOS paints a grey box over a tapped control, which on a violet
              gradient is very visible, and `manipulation` drops the wait for a
              double-tap that would otherwise sit between the finger and the
              film. */}
          <Segment
            href={href}
            onClick={onClick}
            className={cn(
              "font-body flex h-14 shrink-0 touch-manipulation items-center justify-center gap-2 px-6 text-base font-medium tracking-[0.02em] transition-[filter] duration-300 [-webkit-tap-highlight-color:transparent] md:h-full",
              accent === "violet"
                ? cn(CTA_FILL, "hover:brightness-110")
                : "text-void bg-white hover:brightness-90",
            )}
          >
            <Icon name="play_arrow" className="size-5 shrink-0" />
            {action}
          </Segment>

          {/* The rule closes the strip on the sides as well as the top.

              Which sides depends on where the ask is. Side by side from md the
              block is the left-hand end of the bar, so only the right needs
              drawing. Stacked, the block is *below* rather than beside, which
              leaves the strip open at both ends — so both get the rule there,
              and the run of facts is a closed box on the container's line
              rather than a line of type trailing off into the gutter.

              Nothing on the bottom either way: from md that edge is the screen,
              and stacked it is the block. */}
          <div className="border-rule relative min-w-0 flex-1 max-md:border-x md:border-r">
            {/* The hairline, and the flight drawn along it. Two absolute rules
                rather than a border and a child: a border is painted inside the
                box and cannot be filled part-way, and the fill has to sit on
                exactly the line the rule is on, not a pixel under it. */}
            <span
              aria-hidden="true"
              className="bg-rule absolute inset-x-0 top-0 h-px"
            />
            {progress ? (
              /* Two boxes, because the line is scaled twice about two different
                 points and one element has only one origin. The outer is the
                 exit — held at full width for the whole flight and taken to
                 nothing about its right edge once the corridor is done, so the
                 line runs off the end of itself rather than fading on the spot.
                 The inner is the flight, grown from the left. */
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px origin-right overflow-hidden"
                initial={false}
                animate={{ scaleX: cleared ? 0 : 1 }}
                transition={{ duration: CLEAR_S, ease: CLEAR_EASE }}
              >
                {/* Fading out towards its own head, so the leading edge reads
                    as light reaching along the rule rather than as a bar with
                    an end on it. Full width and unscaled, so the stop stays the
                    same 24px whatever has been drawn — a scaled box takes its
                    gradient with it and the fade would stretch with the line. */}
                <motion.span
                  className="absolute inset-0"
                  style={{
                    x: slide,
                    background: `linear-gradient(to right, #fff calc(100% - ${HEAD_FADE}), transparent)`,
                  }}
                />
              </motion.span>
            ) : null}

            {/* items-center rather than items-start: every fact is a label over
                a detail, so they are the same height and their tops line up
                either way — this also centres the run in the bar. */}
            <ul className="hidden h-full min-w-0 items-center overflow-hidden md:flex">
              {facts.map((fact, index) => (
                <li
                  key={fact.label}
                  className={cn(
                    // grow, so the three of them spread across the bar rather
                    // than bunching against the white block with a third of it
                    // empty after them. Grown from their content width rather
                    // than from nothing: even thirds are narrower than the
                    // longest fact between md and lg, and shrink-0 means a fact
                    // that does not fit runs into the ul's clip rather than
                    // ellipsising. This way the slack is shared and nothing is
                    // ever cut.
                    "relative shrink-0 grow px-5 lg:px-8",
                    // The divider, on the header's proportions: 32px of a 72px
                    // bar is the same share as its 24 is of the 56px pill.
                    // Short and centred rather than a full-height border, which
                    // cuts the bar into boxes instead of dividing one.
                    index > 0 &&
                      "before:bg-rule before:absolute before:top-1/2 before:left-0 before:h-8 before:w-px before:-translate-y-1/2 before:content-['']",
                  )}
                >
                  <p className={`font-body whitespace-nowrap ${LABEL_CLASS}`}>
                    {fact.label}
                  </p>
                  <p className={`font-body whitespace-nowrap ${DETAIL_CLASS}`}>
                    {fact.detail}
                  </p>
                </li>
              ))}
            </ul>

            {/* One strip below md, the facts taking it in turns. A grid with
                everything in the one cell rather than absolute positioning:
                they stack without being taken out of flow, so the strip is as
                tall as a fact instead of needing a height of its own. */}
            <div className="grid px-6 py-4 md:hidden">
              {facts.map((fact, i) => (
                <LineReveal
                  key={fact.label}
                  play={up && i === index}
                  lines={[fact.label, fact.detail]}
                  lineClassNames={[LABEL_CLASS, DETAIL_CLASS]}
                  // Tighter than a heading's leading, which is what the reveal
                  // is normally worn by, and set here rather than in the
                  // component so the same variable still drives both.
                  className="font-body col-start-1 row-start-1 [--heading-line-gap:0.35em]"
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
