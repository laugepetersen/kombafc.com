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

const base =
  "relative inline-flex h-12 items-center justify-center overflow-clip px-6 font-body text-base font-medium tracking-[0.02em] transition-[filter,background-color,backdrop-filter,border-color] duration-200";

const variants = {
  /** Filled violet. One per view — this is the primary ask. */
  primary: cn(
    "from-violet-600 to-violet-500 bg-gradient-to-r text-white",
    "[text-shadow:0_0_2px_rgb(255_255_255/0.2)]",
    "drop-shadow-[0_0_3px_rgb(122_31_255/0.2)] hover:brightness-110",
  ),
  /**
   * Outlined. Transparent at rest so it reads as a plain outline beside the
   * filled primary; on hover it takes a wash of the page colour and blurs what
   * is behind it, which over the dot field reads as the button frosting over.
   */
  secondary: cn(
    "border-violet-300 border backdrop-blur-none",
    "shadow-[0_0_6px_0_rgb(157_92_255/0.2)]",
    "hover:bg-void/10 hover:backdrop-blur-md",
  ),
} as const;

export type ButtonVariant = keyof typeof variants;

/** Module scope: inline these would be new arrays every render, and PixelNoise
 *  would rebuild its grid on each one. */
const FIELD_COLORS: Record<ButtonVariant, string[]> = {
  primary: ["#ffffff", "#d2d2d7", "#a3a3ac"],
  secondary: ["#7a1fff", "#9d5cff", "#c0a0ff"],
};
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
      {/* Inset by 1px: flush to the edge the dots read as breaking out of the
          button rather than sitting inside it. */}
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
          colors={FIELD_COLORS[variant]}
          opacities={FIELD_OPACITIES}
        />
      </span>

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
