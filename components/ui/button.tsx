"use client";

import { motion, useSpring } from "motion/react";
import Link from "next/link";
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useRef,
  useSyncExternalStore,
} from "react";

import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

/**
 * How far the button follows the cursor, as a fraction of the distance from
 * its own centre. Deliberately small — past about a quarter the label starts
 * to feel detached from the box it sits in.
 */
const MAGNET_STRENGTH = 0.2;

/** Soft and slightly underdamped, so it settles rather than snapping back. */
const SPRING = { stiffness: 150, damping: 15, mass: 0.1 };

/* Both variants hover by lighting up rather than by changing colour, so the
   only properties in flight are the filter and the glow. Slow enough to read
   as a fade rather than a state flip. */
const base =
  "relative inline-flex h-12 items-center justify-center px-6 font-body text-base font-medium tracking-[0.02em] transition-[filter,box-shadow,border-color] duration-300 ease-out";

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
   * Outlined, and transparent at every state — no fill, no backdrop. On hover
   * it does what the primary does: brightens, and pushes its glow out further.
   * Starting dimmer, it takes a heavier hand than the primary's 110 to read as
   * the same amount of lift.
   */
  secondary: cn(
    "border-violet-300 border",
    glow,
    glowHover,
    "hover:brightness-125",
  ),
} as const;

export type ButtonVariant = keyof typeof variants;

const motionQuery = "(prefers-reduced-motion: reduce)";

function subscribeMotion(onChange: () => void) {
  const mq = window.matchMedia(motionQuery);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

type ButtonProps = {
  variant?: ButtonVariant;
  href: string;
  children: ReactNode;
  className?: string;
  // motion redefines the drag and animation handlers with its own signatures,
  // which collide with React's. They are not used here, so they are dropped
  // from the passthrough rather than cast around.
} & Omit<
  ComponentPropsWithoutRef<typeof Link>,
  | "href"
  | "className"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
>;

export function Button({
  variant = "primary",
  href,
  children,
  className,
  ...rest
}: ButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const reduceMotion = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(motionQuery).matches,
    () => false,
  );

  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  const follow = (event: React.MouseEvent) => {
    const el = ref.current;
    if (!el || reduceMotion) return;

    const rect = el.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * MAGNET_STRENGTH);
    y.set((event.clientY - (rect.top + rect.height / 2)) * MAGNET_STRENGTH);
  };

  const release = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <MotionLink
      ref={ref}
      href={href}
      style={{ x, y }}
      onMouseMove={follow}
      onMouseLeave={release}
      onBlur={release}
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
    </MotionLink>
  );
}
