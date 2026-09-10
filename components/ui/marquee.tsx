import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Edge-faded infinite marquee.
 *
 * The track carries the row twice and travels exactly half its own width, so
 * the second copy arrives where the first started and the loop is seamless at
 * any content length. The duplicate is hidden from assistive tech — it is the
 * same content, and announcing it twice helps nobody.
 *
 * Under prefers-reduced-motion the animation stops and the row becomes
 * scrollable instead, so the content is still reachable.
 */
export function Marquee({
  children,
  durationSeconds = 40,
  reverse = false,
  className,
  fadeClassName = "from-void",
  gapClassName = "gap-15 pe-15",
}: {
  children: ReactNode;
  durationSeconds?: number;
  /**
   * Runs the row the other way.
   *
   * `animation-direction` rather than a second set of keyframes: the track is
   * the row plus a copy of itself and travels exactly half its own width, so
   * the loop is seamless played backwards for the same reason it is forwards.
   */
  reverse?: boolean;
  className?: string;
  /** Should match whatever the marquee sits on, or the fade shows a seam. */
  fadeClassName?: string;
  /**
   * The space between items, and the same step again as trailing padding on
   * the row.
   *
   * Both, always. The row is followed by a copy of itself, so the padding on
   * its end is the only thing standing between its last item and the copy's
   * first — set them differently and one gap in every lap is the wrong width,
   * which is exactly the seam the duplicate exists to hide.
   */
  gapClassName?: string;
}) {
  const row = (
    <div className={cn("flex shrink-0 items-center", gapClassName)}>
      {children}
    </div>
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden motion-reduce:overflow-x-auto",
        className,
      )}
    >
      <div
        className={cn(
          "animate-marquee flex w-max",
          reverse && "[animation-direction:reverse]",
        )}
        style={
          { "--marquee-duration": `${durationSeconds}s` } as React.CSSProperties
        }
      >
        {row}
        <div aria-hidden="true" className="flex shrink-0">
          {row}
        </div>
      </div>

      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r to-transparent",
          fadeClassName,
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l to-transparent",
          fadeClassName,
        )}
      />
    </div>
  );
}
