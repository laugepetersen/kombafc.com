import { CTA_FILL } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

/**
 * The hero's own ask: a titled banner with the primary CTA welded into its
 * right-hand end.
 *
 * It is the header pill's shell — white at 5%, a 12px backdrop blur and the
 * same travelling ring — cut at two corners and split in two. That is
 * deliberate rather than decorative: the pill is the most-looked-at edge on
 * the site, and a hero CTA built out of the same glass reads as part of the
 * same object rather than as a second idea about what a floating control is.
 *
 * Two halves, one frame. The left names what you are about to watch, the right
 * is the button, and the button runs edge to edge — no margin, no inset, no
 * rounding of its own. A filled CTA floating inside a frosted well is the
 * shape the signup form uses, and using it again here would make this read as
 * a field with a submit rather than as a poster with a play.
 *
 * The ring is a layer over the top rather than the box's own background with
 * the panel covering its middle. That was the first build and it was wrong
 * twice over: the conic filled the whole box, so 95%-transparent glass passed
 * it straight through as a grey wash with a beam crossing the words, and the
 * only way to stop it was to darken the panel until the blur had nothing left
 * to show. Clipped to a ring and laid on top, the gradient exists only where
 * the edge is, the glass goes back to the pill's own white/5, and what the
 * blur samples is the hero's footage rather than a gradient.
 *
 * A button rather than a link, because it opens a player over this page. The
 * site makes that argument twice already — in `Button` and in `ShowBar` — and
 * it is the same one: an anchor is a promise about where you are going.
 */
export function BannerCta({
  lines,
  action,
  onClick,
  className,
}: {
  /**
   * The title, one string per line.
   *
   * Given as lines rather than as one string that wraps, because where it
   * breaks is the whole of the thing's proportion — two lines set the banner's
   * height and square the left half against the button beside it. Left to
   * wrap it would be one long line on a desktop and three at 360px.
   */
  lines: readonly string[];
  /** The label on the violet half. */
  action: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group tap relative inline-flex text-left",
        // The cut. Shallower on a phone, where the banner is a third of the
        // width and a deep chamfer starts eating into the words.
        "corner-notch-pair [--corner-notch:10px] md:[--corner-notch:12px]",
        className,
      )}
    >
      {/* The glass, and the two halves it holds. Clipped by the button's own
          chamfer rather than carrying one, so there is a single shape on the
          element that owns the size and nothing to keep in step with it. */}
      <span className="flex items-stretch bg-white/5 backdrop-blur-[12px]">
        {/* The title. Eurostile's black italic, the same face the hero's
            heading above it is set in — a second display voice between the two
            would read as two headings rather than as a heading and its ask.

            The leading comes off --heading-leading like the display scale's,
            not a hand-picked 1.1, and there is no gap between the lines on top
            of it: at these sizes the size utilities carry the body leading of
            1.5, so a two-line title set itself much looser than every other
            bold heading on the site. Line height alone now, so the two lines
            stack exactly as a wrapped heading would. */}
        <span className="font-heading flex flex-col justify-center py-3 pr-5 pl-4 text-sm leading-(--heading-leading) font-black tracking-[-0.01em] text-white uppercase italic md:py-3.5 md:pr-7 md:pl-5 md:text-base">
          {lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </span>

        {/* The ask, welded to the right-hand end. `self-stretch` is what makes
            it edge to edge — without it the violet is only as tall as its own
            label and the glass shows above and below it, which is the inset
            button this is deliberately not.

            `CTA_FILL` rather than a violet mixed to match: the same gradient
            as every primary button on the site, and the same one the billing
            chips on the watch grid wear. It runs to the right, so its light
            end lands on the outer edge of the banner. */}
        <span
          className={cn(
            "font-body flex shrink-0 items-center gap-2 self-stretch px-5 text-sm font-medium tracking-[0.02em] md:gap-2.5 md:px-7 md:text-base",
            // The lift the filled CTA answers hover with, driven off the whole
            // banner rather than off this half — the frame is one control and
            // the pointer is never only on part of it.
            "transition-[filter] duration-300 group-hover:brightness-110",
            CTA_FILL,
          )}
        >
          <Icon name="play_arrow" className="size-4 md:size-5" />
          {action}
        </span>
      </span>

      {/* The ring, over everything. Last in the box and painted on top, so it
          is not in the glass's backdrop and draws its 1px over the violet's
          outer edge as well — one outline around the whole banner rather than
          an outline around the left half and a violet block butted against it.
          Off the pointer, since it covers the control. */}
      <span
        aria-hidden="true"
        className="notch-shine-ring shine-fill pointer-events-none absolute inset-0"
      />
    </button>
  );
}
