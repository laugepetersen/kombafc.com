import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

/**
 * The ruled grid the page is built on.
 *
 * Draws two things that have to line up across every module: a horizontal rule
 * running the full width of the viewport, and vertical rules at the edges of
 * the 1280px column — the verticals as an overlay, so they take the colour of
 * whatever they cross rather than of the page behind it. Stack any number of these and the verticals read as one
 * continuous line down the page, with the horizontals ticking off each module —
 * which is what lets a spacer module above a content module look like part of
 * the same frame rather than a gap between two boxes.
 *
 * Only a bottom rule is drawn, with the top left to the previous frame's
 * bottom — two adjacent 1px rules in a translucent colour would otherwise
 * composite to twice the intended value at every seam. The first frame in a
 * run opens itself.
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
      className={cn(
        "relative",
        // Each frame draws its own *bottom* edge and only the first draws a
        // top one, so a seam between two frames carries exactly one rule —
        // two adjacent 1px lines in a translucent colour read as a 2px rule,
        // which is why one edge has to be left to the neighbour.
        //
        // Bottom rather than top, and that is the whole point: the rule is an
        // overlay on the frame that owns it, so drawing the bottom means a
        // panel with a ground of its own gets the line laid *over* that
        // ground. Drawn as the next frame's top it landed a pixel below the
        // panel, on bare page, and read as a dark line under a lighter block.
        "first:[&>[data-frame-rule]]:border-t",
        outerClassName,
      )}
      {...rest}
    >
      <Container>
        <div className={cn("relative", className)}>
          {children}

          {/* The verticals, drawn over the content rather than as a border on
              the box around it.
 
              As a `border-x` they sat outside every background inside this
              frame: a panel with a ground of its own started one pixel in, so
              the rule composited white/10 over page colour and read as a dark
              line beside a lighter panel — the opposite of a hairline. Laid
              over the top it takes the colour of whatever it crosses, which on
              a coloured panel is that panel and on bare page is the page.
 
              It also stops the rule adding two pixels to the frame's width,
              so the column inside is the column the grid says it is.
 
              The modal keeps a real border. This trick needs something behind
              it worth taking colour from, and a hairline laid over a playing
              video is a hairline nobody can see. */}
          <span
            aria-hidden="true"
            className="border-rule pointer-events-none absolute inset-0 border-x"
          />

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

      {/* The horizontal rule, laid over the section rather than bordered onto
          it, for the same reason the verticals are: on the box it sat outside
          every background inside the frame, so a panel with a ground of its
          own ended a pixel above it and the rule read as a dark line under a
          lighter block. Over the top it takes the colour of whatever it
          crosses — the panel where there is one, the page where there is not.

          Full-bleed, unlike the verticals: this one is the tick between
          modules and has always run the width of the window, where those mark
          the edges of the 1280 column. */}
      <span
        data-frame-rule
        aria-hidden="true"
        className="border-rule pointer-events-none absolute inset-0 border-b"
      />
    </Comp>
  );
}
