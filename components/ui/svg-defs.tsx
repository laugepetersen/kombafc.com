/**
 * The document's shared SVG defs: paint and filters CSS cannot express, held
 * once and referenced by id, so they cost nothing on a page that never uses
 * them.
 *
 * -- text-inner-shadow --
 *
 * CSS has no inset text-shadow, so this builds one: take the glyph alpha,
 * offset and blur it, punch that out of the original alpha to leave only the
 * band just inside the edge, tint it, and lay it back over the glyph.
 *
 * Values mirror the Figma layer — x 1, y 2, blur 3, black at 20%. Figma's blur
 * is roughly twice a Gaussian standard deviation, hence 1.5.
 *
 * -- chrome-violet --
 *
 * The eyebrow's violet ramp as a paint server, so an inline icon can wear the
 * same gradient the type does. `background-clip: text` cannot reach an SVG
 * path, and a `currentColor` fill has only one colour to give.
 *
 * The stops are the ones on `--chrome-violet` in globals.css, written out
 * again because an SVG gradient cannot read a comma-separated CSS stop list —
 * change one, change both. The run is straight down where the eyebrow's is
 * 174deg; six degrees of tilt over a 32px icon is nothing to see.
 */
export function SvgDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      className="pointer-events-none absolute"
    >
      <defs>
        <linearGradient id="chrome-violet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="24%" stopColor="var(--color-violet-300)" />
          <stop offset="47%" stopColor="var(--color-violet-200)" />
          <stop offset="76%" stopColor="var(--color-violet-300)" />
        </linearGradient>

        {/* sRGB rather than the linearRGB default, or the shadow washes out. */}
        <filter
          id="text-inner-shadow"
          colorInterpolationFilters="sRGB"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feOffset in="SourceAlpha" dx="1" dy="2" result="offset" />
          <feGaussianBlur in="offset" stdDeviation="1.5" result="blurred" />
          {/* Everything of the glyph the blurred copy does *not* cover: the
              lip along the top-left inside edge. */}
          <feComposite
            in="SourceAlpha"
            in2="blurred"
            operator="out"
            result="lip"
          />
          <feFlood floodColor="#000000" floodOpacity="0.2" result="tint" />
          <feComposite in="tint" in2="lip" operator="in" result="shadow" />
          <feComposite in="shadow" in2="SourceGraphic" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}
