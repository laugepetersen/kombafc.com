import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

const base =
  "inline-flex h-12 items-center justify-center px-6 font-body text-base font-medium tracking-[0.02em] transition-[filter,background-color,backdrop-filter,border-color] duration-200";

const variants = {
  /** Filled violet. One per view — this is the primary ask. */
  primary: cn(
    "from-violet-600 to-violet-500 bg-gradient-to-r text-white",
    "[text-shadow:0_0_2px_rgb(255_255_255/0.2)]",
    "drop-shadow-[0_0_3px_rgb(122_31_255/0.2)] hover:brightness-110",
  ),
  /**
   * Outlined. Transparent at rest so it reads as an outline beside the filled
   * primary; on hover it takes a wash of the page colour and blurs whatever is
   * behind it. Over the dot field that reads as the button frosting over,
   * which a flat fill cannot do.
   */
  secondary: cn(
    "border-violet-300 border backdrop-blur-none",
    "shadow-[0_0_6px_0_rgb(157_92_255/0.2),inset_0_0_8px_0_rgb(0_0_0/0.2)]",
    "hover:bg-void/10 hover:backdrop-blur-md",
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
