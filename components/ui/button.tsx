"use client";

import Link from "next/link";
import { type ComponentPropsWithoutRef, type ReactNode, useState } from "react";

import { PixelNoise } from "@/components/effects/pixel-noise";
import { cn } from "@/lib/utils";

/* The dot field inside the violet fill. White, not the field's own violet:
   the fill is already violet-600 to violet-500, so violet dots on it have
   nowhere to go. Its own opacity ramp too, well under the default — that one
   is tuned for a full panel behind copy, and the same values across 44px of
   button read as static rather than as a shimmer.

   The white fill does not get one. These colours are the field's whole tuning
   and they are invisible on it; dark dots would be a second treatment invented
   for one button rather than the same one in another colour. */
const DOT_COLORS = ["#ffffff", "#d2d2d7", "#a3a3ac"];
const DOT_OPACITIES = [0, 0, 0, 0, 0.05, 0.08, 0.12, 0.18, 0.26, 0.36];

/* Every variant hovers by lighting up rather than by changing colour, so the
   only properties in flight are the filter and the glow. tap owns the
   transition for all of them alongside the press, on a 300ms fade rather than
   its 200ms default — a CTA lighting up wants to read slower than a nav item
   dimming. */
const base =
  "tap relative inline-flex items-center justify-center overflow-hidden font-body font-medium tracking-[0.02em] [--tap-fade:300ms]";

/* Height, padding and type in one place: a button's size is a single
   decision, and splitting it invites a 36px box wearing 16px type.

   Both heights are grid steps. Neither label is a hand-picked pixel value —
   text-base and text-sm are consecutive steps on the modular scale, so sm is
   base divided by --text-ratio and follows it if the ratio is ever retuned. */
const sizes = {
  default: "h-11 px-6 text-base",
  // One height, at every width. It briefly grew to 44 on a phone to clear the
  // floor for a target a thumb has to find — and a small button that is not
  // small on the device most people hold is not the variant it says it is.
  // Lauge's call; the floor is noted rather than met here.
  sm: "h-9 px-4 text-sm",
} as const;

export type ButtonSize = keyof typeof sizes;

/* Shared by both variants, so the light behaves the same whichever button it
   is coming off. Two layers rather than one: a tight core and a wide, dim
   bloom, which is what gives it a falloff — a single shadow just reads as a
   hard ring offset from the edge. Both layers run at very low alpha and pull
   their spread in negative, so the glow sits close to the button and reads as
   the edge catching light rather than as a halo around it.

   Only the colour differs between the variants, so it arrives on --cta-glow
   as bare channels — the alphas describe the falloff, not the hue. */
const glow =
  "shadow-[0_0_8px_-3px_rgb(var(--cta-glow)/0.08),0_0_18px_-2px_rgb(var(--cta-glow)/0.06)]";
const glowHover =
  "hover:shadow-[0_0_10px_-3px_rgb(var(--cta-glow)/0.14),0_0_26px_0_rgb(var(--cta-glow)/0.10)]";

/* The white outline's label. text-chrome supplies the ramp and the bloom; a
   button wants both quieter than a heading does — white held across two
   thirds of the glyphs with only the tail going grey, no travelling angle
   (animate-none parks it at the 135deg the ramp starts from), and the bloom
   pulled well back so a two-word label does not halo. */
const chromeLabel =
  "text-chrome animate-none [--chrome-hold:65%] [--chrome-to:#d4d4d4] [--chrome-glow:0.18]";

/* The same values as glowHover without the hover: prefix, written out rather
   than derived from it. Tailwind scans source text for whole class names, so
   a string built at runtime is never generated and the shadow silently does
   nothing. */
const glowLit =
  "shadow-[0_0_10px_-3px_rgb(var(--cta-glow)/0.14),0_0_26px_0_rgb(var(--cta-glow)/0.10)]";

/* One step past glowLit, for the outline that has neither a border colour to
   firm up nor a fill to brighten. Dimming its ring to leave room for a lift
   would cost the thing the ring is there for — at 1px over black, every
   percent of alpha taken off the gradient is a percent of the pink — so the
   light around it does the answering instead. */
const glowLitHover =
  "hover:shadow-[0_0_12px_-3px_rgb(var(--cta-glow)/0.22),0_0_34px_0_rgb(var(--cta-glow)/0.16)]";

/**
 * Four, on two axes: filled or outlined, violet or white.
 *
 *   fill-violet     the primary ask, one per view
 *   fill-white      the same weight, off the palette's other end
 *   outline-violet  the blush ramp, on a gradient ring and on the label
 *   outline-white   the quiet one
 *
 * Named for what they look like rather than for the job they do. With one
 * filled and one outlined the role names carried it; with four, `secondary`
 * says nothing about which of the three non-primary buttons is meant, and a
 * call site that has to be cross-referenced against this file to know what it
 * renders is a call site that will be got wrong.
 */
/**
 * The primary fill's paint, with none of its behaviour.
 *
 * Exported because the violet fill is not the button's alone any more — the
 * billing chips on the watch grid are the same violet block of colour, and two
 * places writing out `violet-600 → violet-500` is two places to retune and one
 * of them to forget. The button below consumes this too, so there is no
 * "matching" version that can quietly stop matching.
 *
 * The paint only: no glow, no hover lift, no dot field. Those belong to a
 * control that can be pressed, and a chip is a label.
 */
export const CTA_FILL = cn(
  "from-violet-600 to-violet-500 bg-gradient-to-r text-white",
  "[text-shadow:0_0_2px_rgb(255_255_255/0.2)]",
);

const variants = {
  /** Filled violet. One per view — this is the primary ask, and the default. */
  "fill-violet": cn(
    "[--cta-glow:157_92_255]",
    CTA_FILL,
    glow,
    glowHover,
    "hover:brightness-110",
  ),
  /**
   * The same weight in white, for a view whose violet is spoken for — over
   * video, or beside the violet fill where two of those would compete.
   *
   * A ramp rather than flat white, mirroring the violet's: white into ink-100,
   * which is the same pair `text-chrome` runs the outline label on. The label
   * is void, not black — the page's own ground, so the button reads as a piece
   * of the page turned over rather than as ink on paper.
   *
   * Its lift lands on the grey end alone. White is already at the ceiling and
   * brightness cannot raise it, so 110 flattens the ramp towards white instead
   * of brightening it — which is the same read arrived at from the other side.
   */
  "fill-white": cn(
    // Not pure white: the glow's alphas describe its falloff and are shared
    // with the violet fill, so the way to take white's extra punch back out of
    // it is to dim the light itself rather than to fork the shape.
    "[--cta-glow:190_190_190]",
    "from-white to-ink-100 text-void bg-gradient-to-r",
    glow,
    glowHover,
    "hover:brightness-110",
  ),
  /**
   * Outlined in the blush ramp, carrying no fill at any state — the ring, the
   * label and the glow are the whole button, and what is behind it shows
   * through untouched.
   *
   * The ring is a gradient rather than a flat border, off the same
   * --chrome-blush the label is painted with, so the edge and the type are one
   * ramp seen twice rather than two colours that happen to be close. Whiter
   * and pinker than the eyebrow's own violet: at 1px the eyebrow ramp reads as
   * a lilac line, and the white through the middle is what makes this one
   * catch the light.
   *
   * chrome-ring draws it as a pseudo element, which `base` already has the
   * positioning context and the clip for — so the ring follows the chamfer and
   * the pill rather than being a rectangle behind them.
   */
  "outline-violet": cn(
    "[--cta-glow:240_168_255]",
    "chrome-ring [--ring-image:linear-gradient(174deg,var(--chrome-blush))]",
    glowLit,
    glowLitHover,
  ),
  /**
   * Outlined, and transparent at every state — no fill, no backdrop. White
   * rather than violet, so the violet in a view belongs to the ask and to the
   * eyebrow; the shine is text-chrome on the label instead.
   *
   * It keeps the wider glow at rest — the look worth having all the time
   * rather than only under a pointer a touch device never has — but not the
   * brightness that used to carry it. Two reasons: brightness cannot lift
   * white, which already sits at the ceiling, and turning it up on the label
   * drags the dim end of the chrome ramp towards the bright end, flattening
   * the very gradient that makes it read as metal. So the lift is the rule
   * instead, held back at rest and taken to full on hover.
   */
  "outline-white": cn(
    // See the note on the white fill's glow.
    "[--cta-glow:190_190_190]",
    "border-white/60 border hover:border-white",
    glowLit,
  ),
} as const;

export type ButtonVariant = keyof typeof variants;

/* What the label is painted with. Both outlines carry a gradient — their own
   — and both fills carry a flat colour set alongside the fill itself, so they
   are empty here.

   One entry each, and never two: these are custom `text-*` utilities, and two
   of those through `cn` leaves only the last. See CLAUDE.md. */
const labels: Record<ButtonVariant, string> = {
  "fill-violet": "",
  "fill-white": "",
  "outline-violet": "text-chrome-blush",
  "outline-white": chromeLabel,
};

/**
 * Either a link or a button, and it renders as whichever it is. A CTA that
 * opens a player is not a destination, and an anchor with its default
 * prevented is a link that lies about where it goes — to a screen reader, to
 * a middle click, to anything that reads the page rather than looks at it.
 */
type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
} & (
  | ({ href: string } & Omit<
      ComponentPropsWithoutRef<typeof Link>,
      "href" | "className"
    >)
  | ({ href?: undefined } & Omit<
      ComponentPropsWithoutRef<"button">,
      "className"
    >)
);

export function Button({
  variant = "fill-violet",
  size = "default",
  children,
  className,
  ...rest
}: ButtonProps) {
  /* Only the violet fill has a field, so only it has anything to track — the
     other three would otherwise re-render on every hover for a layer they do
     not have. */
  const hasField = variant === "fill-violet";
  const [lit, setLit] = useState(false);

  const classes = cn(base, sizes[size], variants[variant], className);

  const label = (
    <>
      {/* The violet fill only. On an outline there is no fill to sit on, so
          the dots would land on whatever the button happens to be over. The
          label carries `relative` already, which is what keeps it above this
          without either needing a z-index.

          Hidden until the pointer arrives, and — the half a `group-hover:`
          would miss — not drawn either. A canvas fading behind an opacity of
          nought still churns its cells twenty times a second for something
          nobody can see, which is what PixelNoise's `enabled` is for. Toggling
          it holds the last frame rather than tearing the grid down, so the
          pattern does not jump the moment the field comes back.

          Hover alone, no focus: the brightness and the glow this sits beside
          are hover-only too, and a decoration that turns up in one state its
          own button does not respond to reads as a bug. */}
      {hasField ? (
        <PixelNoise
          className={cn(
            "absolute inset-0 transition-opacity duration-300",
            lit ? "opacity-100" : "opacity-0",
          )}
          colors={DOT_COLORS}
          opacities={DOT_OPACITIES}
          enabled={lit}
        />
      ) : null}

      {/* One custom text-* utility through cn, which is the only count that is
          safe — see the note in CLAUDE.md, and the labels map. */}
      <span className={cn("relative", labels[variant])}>{children}</span>
    </>
  );

  /* The caller's own pointer handlers are pulled out of the rest and called
     rather than spread over: ours after the spread would swallow theirs, and
     ours before it would have theirs swallow the field. Done inside each
     branch because that is where the element type is known — an anchor's
     handler and a button's do not share a signature. */
  if (rest.href !== undefined) {
    const { href, onPointerEnter, onPointerLeave, ...link } = rest;
    return (
      <Link
        href={href}
        className={classes}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);
          if (hasField) setLit(true);
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          if (hasField) setLit(false);
        }}
        {...link}
      >
        {label}
      </Link>
    );
  }

  const { onPointerEnter, onPointerLeave, ...button } = rest;
  return (
    <button
      type="button"
      className={classes}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (hasField) setLit(true);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        if (hasField) setLit(false);
      }}
      {...button}
    >
      {label}
    </button>
  );
}
