import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

/**
 * The ruled grid the page is built on.
 *
 * Draws two things that have to line up across every module: a horizontal rule
 * running the full width of the viewport, and vertical rules at the edges of
 * the 1280px column. Stack any number of these and the verticals read as one
 * continuous line down the page, with the horizontals ticking off each module —
 * which is what lets a spacer module above a content module look like part of
 * the same frame rather than a gap between two boxes.
 *
 * Only a top rule is drawn, with the bottom left to the next frame's top. Two
 * adjacent 1px rules in a translucent colour would otherwise composite to twice
 * the intended value at every seam. The last frame in a run closes itself.
 *
 * Composes with Section and Container rather than replacing them: Section still
 * owns vertical rhythm, Container still owns width. This owns the rules.
 */
const markerPositions = [
  "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
  "top-0 right-0 translate-x-1/2 -translate-y-1/2",
  "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
  "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
];

type SectionFrameProps<T extends ElementType> = {
  as?: T;
  /** Survey squares pinned to the frame's four corners. */
  markers?: boolean;
  /** Applied to the framed column, which is where content and padding go. */
  className?: string;
  /** Applied to the full-bleed wrapper carrying the horizontal rule. */
  outerClassName?: string;
  children?: ReactNode;
} & Omit<
  ComponentPropsWithoutRef<T>,
  "as" | "markers" | "className" | "children"
>;

export function SectionFrame<T extends ElementType = "section">({
  as,
  markers = false,
  className,
  outerClassName,
  children,
  ...rest
}: SectionFrameProps<T>) {
  const Comp = (as ?? "section") as ElementType;

  return (
    <Comp
      className={cn("border-rule border-t last:border-b", outerClassName)}
      {...rest}
    >
      <Container>
        <div className={cn("border-rule relative border-x", className)}>
          {children}

          {markers
            ? markerPositions.map((position) => (
                <span
                  key={position}
                  aria-hidden="true"
                  className={cn(
                    "corner-marker pointer-events-none absolute size-[7px]",
                    position,
                  )}
                />
              ))
            : null}
        </div>
      </Container>
    </Comp>
  );
}
