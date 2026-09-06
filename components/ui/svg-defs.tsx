/**
 * SVG filter backing the `text-chrome` utility's inner shadow.
 *
 * CSS has no inset text-shadow, so this builds one: take the glyph alpha,
 * offset and blur it, punch that out of the original alpha to leave only the
 * band just inside the edge, tint it, and lay it back over the glyph.
 *
 * Values mirror the Figma layer — x 1, y 2, blur 3, black at 20%. Figma's blur
 * is roughly twice a Gaussian standard deviation, hence 1.5.
 *
 * Rendered once in the root layout; referenced by id, so it costs nothing on
 * pages that never use it.
 */
export function TextInnerShadowFilter() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      className="pointer-events-none absolute"
    >
      <defs>
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
