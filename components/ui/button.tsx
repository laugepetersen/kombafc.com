import Link from "next/link";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/* Both variants hover by lighting up rather than by changing colour, so the
   only properties in flight are the filter and the glow. tap owns the
   transition for all of them alongside the press, on a 300ms fade rather than
   its 200ms default — a CTA lighting up wants to read slower than a nav item
   dimming. */
const base =
  "tap corner-cut relative inline-flex items-center justify-center font-body font-medium tracking-[0.02em] [--tap-fade:300ms]";

/* Height, padding and type in one place: a button's size is a single
   decision, and splitting it invites a 36px box wearing 16px type.

   Both heights are grid steps. Neither label is a hand-picked pixel value —
   text-base and text-sm are consecutive steps on the modular scale, so sm is
   base divided by --text-ratio and follows it if the ratio is ever retuned. */
const sizes = {
  default: "h-11 px-6 text-base",
  sm: "h-9 px-4 text-sm [--corner-cut:calc(var(--spacing)*2)]",
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

/* The outline CTA's label. text-chrome supplies the ramp and the bloom; a
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

const variants = {
  /** Filled violet. One per view — this is the primary ask. */
  primary: cn(
    "[--cta-glow:157_92_255]",
    "from-violet-600 to-violet-500 bg-gradient-to-r text-white",
    "[text-shadow:0_0_2px_rgb(255_255_255/0.2)]",
    glow,
    glowHover,
    "hover:brightness-110",
  ),
  /**
   * Outlined, and transparent at every state — no fill, no backdrop. White
   * rather than violet, so the violet in a view belongs to the primary ask
   * and to the eyebrow; the shine is text-chrome on the label instead.
   *
   * It keeps the wider glow at rest — the look worth having all the time
   * rather than only under a pointer a touch device never has — but not the
   * brightness that used to carry it. Two reasons: brightness cannot lift
   * white, which already sits at the ceiling, and turning it up on the label
   * drags the dim end of the chrome ramp towards the bright end, flattening
   * the very gradient that makes it read as metal. So the lift is the rule
   * instead, held back at rest and taken to full on hover.
   */
  secondary: cn(
    // Not pure white: the glow's alphas describe its falloff and are shared
    // with the primary, so the way to take white's extra punch back out of
    // it is to dim the light itself rather than to fork the shape.
    "[--cta-glow:190_190_190]",
    "border-white/60 border hover:border-white",
    glowLit,
  ),
} as const;

export type ButtonVariant = keyof typeof variants;

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
  variant = "primary",
  size = "default",
  children,
  className,
  ...rest
}: ButtonProps) {
  const classes = cn(base, sizes[size], variants[variant], className);

  // One custom text-* utility through cn, which is the only count that is
  // safe — see the note in CLAUDE.md.
  const label = (
    <span className={cn("relative", variant === "secondary" && chromeLabel)}>
      {children}
    </span>
  );

  if (rest.href !== undefined) {
    const { href, ...link } = rest;
    return (
      <Link href={href} className={classes} {...link}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {label}
    </button>
  );
}
