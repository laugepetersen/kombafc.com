"use client";

import { motion, useSpring } from "motion/react";
import Link from "next/link";
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { PixelNoise } from "@/components/effects/pixel-noise";
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
   filter is the only thing in flight. Slow enough to read as a fade rather
   than a state flip. */
const base =
  "relative inline-flex h-12 items-center justify-center overflow-clip px-6 font-body text-base font-medium tracking-[0.02em] transition-[filter,border-color] duration-300 ease-out";

const variants = {
  /** Filled violet. One per view — this is the primary ask. */
  primary: cn(
    "from-violet-600 to-violet-500 bg-gradient-to-r text-white",
    "[text-shadow:0_0_2px_rgb(255_255_255/0.2)]",
    "hover:brightness-110",
  ),
  /**
   * Outlined, and transparent at every state — no fill, no backdrop. On hover
   * it does what the primary does and simply brightens. Starting dimmer, it
   * takes a heavier hand than the primary's 110 to read as the same lift.
   */
  secondary: "border-violet-300 border hover:brightness-125",
} as const;

export type ButtonVariant = keyof typeof variants;

/** Module scope: inline these would be new arrays every render, and PixelNoise
 *  would rebuild its grid on each one. */
const FIELD_COLORS = ["#ffffff", "#d2d2d7", "#a3a3ac"];
const FIELD_OPACITIES = [0, 0, 0, 0.08, 0.15, 0.28, 0.45, 0.7];

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
  const [hovered, setHovered] = useState(false);

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
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <MotionLink
      ref={ref}
      href={href}
      style={{ x, y }}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={follow}
      onMouseLeave={release}
      onFocus={() => setHovered(true)}
      onBlur={release}
      className={cn(base, variants[variant], className)}
      {...rest}
    >
      {/* Filled variant only. The outline has nothing solid to hold a texture,
          so dots inside it read as loose specks rather than as a surface. */}
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="absolute inset-px transition-opacity duration-300 ease-out"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <PixelNoise
            enabled={hovered}
            // Tight pitch and single-pixel dots: at 48px tall anything coarser
            // reads as a pattern rather than as texture in the surface.
            pitch={4}
            dotSize={1}
            churn={0.2}
            fps={20}
            fadeUpwards={false}
            colors={FIELD_COLORS}
            opacities={FIELD_OPACITIES}
          />
        </span>
      )}

      {/* Neutral rather than the violet chrome: with a violet outline around
          it too, the label was the second violet mass in a small button. */}
      <span
        className={cn("relative", variant === "secondary" && "text-ink-100")}
      >
        {children}
      </span>
    </MotionLink>
  );
}
