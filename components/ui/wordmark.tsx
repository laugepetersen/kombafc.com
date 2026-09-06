import { cn } from "@/lib/utils";

/**
 * The brand, in its two pieces, each in its own file and each at its own
 * ratio.
 *
 * Three files, three names, and they are not interchangeable:
 *
 * - `mark` is the K alone. The logomark.
 * - `wordmark` is KOMBA alone. The letters, no K.
 * - `logo` is the two together at the spacing the brand sets between them.
 *
 * Each has its own ratio, which is the reason they cannot share one file with
 * a crop: the mark is 130×55 and the other two are wide bands.
 *
 * `logo` replaced an older lockup of the same drawing that carried too much
 * air between the K and the letters — fine at 126px wide, and at 1280 it
 * opened to about a hundred pixels of gap that read as a mistake rather than
 * as spacing. The header points at this one now.
 */
const parts = {
  /** The K on its own. */
  mark: { src: "/brand/komba-mark.svg", width: 130, height: 55 },
  /** KOMBA, letters only. */
  wordmark: { src: "/brand/komba-wordmark.svg", width: 88, height: 12 },
  /** Both, at the spacing the brand sets between them. */
  logo: { src: "/brand/komba-logo.svg", width: 122, height: 12 },
} as const;

export type WordmarkPart = keyof typeof parts;

/**
 * The KOMBA brand at any size, in any colour.
 *
 * Stencilled rather than drawn — the same trick the sponsor logos use. Both
 * files have `fill="white"` baked into every path, so an `<img>` of one is
 * white and nothing but white: right over the dark page, invisible on the
 * footer's card. Taken as a mask the SVG supplies only the shape and the
 * colour comes from `background-color`, so one asset serves both grounds and
 * the brand file itself is never edited. Set the colour with a `bg-*` class.
 *
 * The box carries the part's own aspect ratio and the mask is sized to fill
 * it, so it scales to whatever width it is given without distorting. Give it a
 * width; it works out its own height.
 *
 * `role="img"` with a name, because at footer size this is the brand being
 * said out loud rather than decoration — a screen reader should have it.
 */
export function Wordmark({
  part = "wordmark",
  className,
}: {
  part?: WordmarkPart;
  className?: string;
}) {
  const { src, width, height } = parts[part];

  return (
    <div
      role="img"
      aria-label="KOMBA"
      className={cn("w-full", className)}
      style={{
        aspectRatio: `${width} / ${height}`,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    />
  );
}
