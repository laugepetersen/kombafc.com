import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Width presets. Each one only flips the `--container-content` custom
 * property — the `container-content` utility reads it and handles the
 * max-width and gutters, so there is a single source of truth in globals.css.
 */
const widths = {
  default: "", // 1280px content
  narrow: "container-narrow", // 800px, for long-form copy
  wide: "container-wide", // 1600px, for wide media
} as const;

export type ContainerWidth = keyof typeof widths;

type ContainerProps<T extends ElementType> = {
  as?: T;
  width?: ContainerWidth;
  className?: string;
  children?: ReactNode;
} & Omit<
  ComponentPropsWithoutRef<T>,
  "as" | "width" | "className" | "children"
>;

/**
 * Horizontal constraint. Centres content at the configured width with a
 * 16px gutter on mobile and 32px from `md` up.
 *
 * Deliberately sets no vertical spacing — that belongs to `Section`.
 */
export function Container<T extends ElementType = "div">({
  as,
  width = "default",
  className,
  children,
  ...rest
}: ContainerProps<T>) {
  const Comp = (as ?? "div") as ElementType;

  return (
    <Comp
      className={cn("container-content", widths[width], className)}
      {...rest}
    >
      {children}
    </Comp>
  );
}
