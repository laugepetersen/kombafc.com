import Link from "next/link";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/* Both variants hover by lighting up rather than by changing colour, so the
   only properties in flight are the filter and the glow. tap owns the
   transition for all of them alongside the press, on a 300ms fade rather than
   its 200ms default — a CTA lighting up wants to read slower than a nav item
   dimming. */
const base =
  "tap relative inline-flex h-12 items-center justify-center px-6 font-body text-base font-medium tracking-[0.02em] [--tap-fade:300ms]";

/* Shared by both variants, so the light behaves the same whichever button it
   is coming off. Two layers rather than one: a tight core and a wide, dim
   bloom, which is what gives it a falloff — a single shadow just reads as a
   hard ring offset from the edge. Both layers run at very low alpha and pull
   their spread in negative, so the glow sits close to the button and reads as
   the edge catching light rather than as a halo around it. */
const glow =
  "shadow-[0_0_8px_-3px_rgb(157_92_255/0.08),0_0_18px_-2px_rgb(157_92_255/0.06)]";
const glowHover =
  "hover:shadow-[0_0_10px_-3px_rgb(157_92_255/0.14),0_0_26px_0_rgb(157_92_255/0.10)]";

/* The same values without the hover: prefix, written out rather than derived
   from the line above. Tailwind scans source text for whole class names, so a
   string built at runtime is never generated and the shadow silently does
   nothing. */
const glowLit =
  "shadow-[0_0_10px_-3px_rgb(157_92_255/0.14),0_0_26px_0_rgb(157_92_255/0.10)]";

const variants = {
  /** Filled violet. One per view — this is the primary ask. */
  primary: cn(
    "from-violet-600 to-violet-500 bg-gradient-to-r text-white",
    "[text-shadow:0_0_2px_rgb(255_255_255/0.2)]",
    glow,
    glowHover,
    "hover:brightness-110",
  ),
  /**
   * Outlined, and transparent at every state — no fill, no backdrop. It wears
   * at rest what it used to hold back for hover: the brighter violet and the
   * wider glow, which is the look worth having all the time rather than only
   * under a pointer that a touch device never has. Hover still lifts, from a
   * higher starting point.
   */
  secondary: cn(
    "border-violet-300 border brightness-125",
    glowLit,
    "hover:brightness-140",
  ),
} as const;

export type ButtonVariant = keyof typeof variants;

type ButtonProps = {
  variant?: ButtonVariant;
  href: string;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className">;

export function Button({
  variant = "primary",
  href,
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], className)}
      {...rest}
    >
      <span
        className={cn(
          "relative",
          variant === "secondary" && "text-chrome-violet",
        )}
      >
        {children}
      </span>
    </Link>
  );
}
