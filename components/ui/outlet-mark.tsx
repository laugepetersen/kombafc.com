import { type Outlet, outlets, type OutletId } from "@/content/news";
import { cn } from "@/lib/utils";

/**
 * Another publication's logo, on our page.
 *
 * Sized by height and never by width, because height is the only dimension a
 * press wall can share: these marks arrive at whatever proportion their owner
 * drew them at, and matching widths would set a wordmark and a roundel at
 * wildly different optical sizes. `w-auto` off a fixed height, with the file's
 * real dimensions on the element so the box is reserved before the image lands.
 *
 * The invert is per-outlet and lives on the data, not here — see the note on
 * `invertLogo` in content/news.ts.
 *
 * A plain `img`, not next/image, and for the same reason the eyebrow's bracket
 * is one: these are fixed-size marks a few kilobytes each, so the optimiser has
 * nothing to save and would add a wrapper and a second hop to fetch it. It also
 * sidesteps `dangerouslyAllowSVG` — two of the five marks are SVG, and turning
 * that flag on site-wide to render a logo is a poor trade.
 *
 * `alt` is empty wherever the outlet's name is already set beside the mark; a
 * screen reader that reads "Fighting.dk" off the image and then "Fighting.dk"
 * off the credit line has been told the same thing twice. Pass
 * `titled={false}` where it stands alone.
 */
export function OutletMark({
  outlet,
  height = 20,
  titled = true,
  className,
}: {
  outlet: OutletId;
  /** Rendered height in pixels. The width follows the file. */
  height?: number;
  /** Is the outlet's name already set next to it? */
  titled?: boolean;
  className?: string;
}) {
  const { name, logo, logoWidth, logoHeight, invertLogo, logoScale } = outlets[
    outlet
  ] as Outlet;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- see above.
    <img
      src={logo}
      alt={titled ? "" : name}
      width={logoWidth}
      height={logoHeight}
      // The caller asks for a nominal height and each mark applies its own
      // optical correction to it, so a row of five is level without every call
      // site having to know which logo is a wordmark and which is a monogram.
      style={{ height: height * (logoScale ?? 1) }}
      className={cn("w-auto", invertLogo && "invert", className)}
    />
  );
}
