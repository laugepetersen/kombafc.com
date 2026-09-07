import { SectionFrame } from "@/components/layout/section-frame";
import { Marquee } from "@/components/ui/marquee";
import { StaggerReveal } from "@/components/ui/stagger-reveal";

/**
 * Placeholder roster carried over from the comp. Each logo keeps its own
 * exported dimensions rather than being forced to one height — they are
 * optically balanced at these sizes, and normalising them makes the wide
 * wordmarks shrink and the square marks loom.
 */
const sponsors = [
  { name: "ADP", src: "/sponsors/adp.svg", width: 53, height: 24 },
  { name: "HP", src: "/sponsors/hp.svg", width: 32, height: 32 },
  { name: "Allstate", src: "/sponsors/allstate.svg", width: 110, height: 24 },
  {
    name: "Advance Auto Parts",
    src: "/sponsors/advance.svg",
    width: 103,
    height: 24,
  },
  { name: "Amazon", src: "/sponsors/amazon.svg", width: 79, height: 24 },
  { name: "AMETEK", src: "/sponsors/ametek.svg", width: 122, height: 20 },
  { name: "Bunge", src: "/sponsors/bunge.svg", width: 92, height: 24 },
  { name: "Carrier", src: "/sponsors/carrier.svg", width: 80, height: 32 },
  { name: "Garmin", src: "/sponsors/garmin.svg", width: 119, height: 32 },
  { name: "Honda", src: "/sponsors/honda.svg", width: 157, height: 20 },
];

type Sponsor = (typeof sponsors)[number];

/**
 * One mark. Stencilled rather than drawn: the SVG supplies the shape as a mask
 * and the colour comes from the ink ramp, so the logos sit on the palette
 * instead of being white marks dimmed with opacity.
 */
function SponsorMark({ name, src, width, height }: Sponsor) {
  return (
    <span
      role="img"
      aria-label={name}
      style={{
        width,
        height,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
      className="bg-ink-300 hover:bg-ink-100 shrink-0 transition-colors duration-200"
    />
  );
}

/**
 * Half the roster, for the phone's two rows. Alternating rather than split down
 * the middle, so neither row is all wordmarks and the other all square marks —
 * the widths run 32 to 157 and taking the list in halves put most of the wide
 * ones together.
 */
function sponsorRow(offset: number) {
  return sponsors
    .filter((_, index) => index % 2 === offset)
    .map((sponsor) => <SponsorMark key={sponsor.name} {...sponsor} />);
}

export function Sponsors() {
  return (
    <SectionFrame>
      {/* Items stretch rather than centre: the marquee has to run the full
          width, and each staggered child sits in a wrapper of its own. The
          copy centres itself instead. */}
      <StaggerReveal className="flex flex-col gap-10 py-16 md:py-20">
        {/* No px of its own. The Container above already holds the gutter, and
            24px more on each side of a 288px measure left 240px of line on a
            375px phone — narrow enough that the two-line break the <br/> is
            there to set could not be trusted to hold. Width belongs to the
            Container and the measure; see CLAUDE.md. */}
        <p className="text-ink-200 mx-auto max-w-72 text-center text-base leading-[1.4] tracking-[0.01em]">
          <span className="text-white">Proudly sponsored by partners</span>
          <br />
          who believe in what we do
        </p>

        {/* One row from md, two on a phone running opposite ways.

            Ten marks on a 375 screen is a row you watch four of at a time and
            wait out the rest of. Split in half and counter-run, the same ten
            are on screen at once and the two directions read as a field rather
            than as a queue — which is also what stops the halves looking like
            one row that has been cut.

            The mobile rows are half the length, and the track travels its own
            width, so half the duration keeps them moving at the pace the one
            row does rather than at half of it.

            Both are rendered and one is hidden, rather than a hook reading the
            width: this is a server component, and the breakpoint is the only
            thing that differs. */}
        {/* Both layouts in one box, and that box is what StaggerReveal counts.

            It wraps every direct child in a box of its own, so as two children
            the hidden one was still a flex item — nought tall, `display: none`
            inside it, and collecting the column's full 40px gap regardless. On
            a phone that read as a band of empty page under the marquee that
            nothing on screen accounted for. One child, one gap. */}
        <div>
          <div className="flex flex-col gap-6 md:hidden">
            <Marquee className="w-full" durationSeconds={22}>
              {sponsorRow(0)}
            </Marquee>
            <Marquee className="w-full" durationSeconds={22} reverse>
              {sponsorRow(1)}
            </Marquee>
          </div>

          {/* Fades to void, which is what the section sits on — a fade to any
              other value would show a seam against the page. */}
          <Marquee className="w-full max-md:hidden" durationSeconds={45}>
            {sponsors.map((sponsor) => (
              <SponsorMark key={sponsor.name} {...sponsor} />
            ))}
          </Marquee>
        </div>
      </StaggerReveal>
    </SectionFrame>
  );
}
