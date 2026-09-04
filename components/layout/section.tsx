import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { Container, type ContainerWidth } from "@/components/layout/container";
import { cn } from "@/lib/utils";

/**
 * Vertical rhythm presets. The values live in globals.css so the spacing
 * between every section on the site can be retuned from one place.
 */
const spacings = {
  none: "",
  sm: "py-[var(--section-sm)] md:py-[var(--section-sm-lg)]",
  md: "py-[var(--section-md)] md:py-[var(--section-md-lg)]",
  lg: "py-[var(--section-lg)] md:py-[var(--section-lg-lg)]",
} as const;

export type SectionSpacing = keyof typeof spacings;

type SectionProps<T extends ElementType> = {
  as?: T;
  spacing?: SectionSpacing;
  /**
   * Wraps children in a `Container`. Pass `false` for full-bleed content
   * (a background video, an edge-to-edge marquee) and place your own
   * `Container` around the parts that should stay constrained.
   */
  container?: boolean | ContainerWidth;
  className?: string;
  containerClassName?: string;
  children?: ReactNode;
} & Omit<
  ComponentPropsWithoutRef<T>,
  "as" | "spacing" | "container" | "className" | "children"
>;

/**
 * Vertical constraint plus an optional `Container`. Owns the space *between*
 * sections and the section's own background; sets nothing horizontal itself.
 */
export function Section<T extends ElementType = "section">({
  as,
  spacing = "md",
  container = true,
  className,
  containerClassName,
  children,
  ...rest
}: SectionProps<T>) {
  const Comp = (as ?? "section") as ElementType;

  return (
    <Comp className={cn(spacings[spacing], className)} {...rest}>
      {container === false ? (
        children
      ) : (
        <Container
          width={container === true ? "default" : container}
          className={containerClassName}
        >
          {children}
        </Container>
      )}
    </Comp>
  );
}
