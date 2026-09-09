import { SectionFrame } from "@/components/layout/section-frame";
import { Marquee } from "@/components/ui/marquee";
import { StaggerReveal } from "@/components/ui/stagger-reveal";

/**
 * The roster, minus G-SHOCK — that one is placed by `everyFourth` below rather
 * than sitting in the list. Six long, and that is load-bearing: see
 * `everyFourth`.
 *
 * Each logo keeps its own dimensions rather than being forced to one height.
 * Heights are the 4px grid between 20 and 32, ranked by how much ink the
 * artwork actually lays down — measured by rasterising each mask and summing
 * alpha, not guessed from the viewBox. The heavy slabs (G-SHOCK, Tolk Danmark,
 * both near-solid wordmarks) take 20, the sparse lockups (Flypenge's globe,
 * Skousen's script) take 32, the rest 28. Width is then whatever the artwork's
 * own ratio asks for, so nothing is stretched.
 *
 * Equalising the ink outright rather than ranking it was the first attempt and
 * it overcorrects — Flypenge is sparse enough that matching areas puts it at
 * 48px, taller than anything else on the page. Ranked instead, the set spans
 * 409 to 1498 ink px, against 314 to 1641 for the comp roster this replaced.
 */
const sponsors = [
  {
    name: "Cy Consult",
    src: "/sponsors/cy-consult.svg",
    width: 108,
    height: 28,
  },
  { name: "Flypenge", src: "/sponsors/flypenge.svg", width: 71, height: 32 },
  {
    name: "Kronborg Byg",
    src: "/sponsors/kronborg-byg.svg",
    width: 65,
    height: 28,
  },
  { name: "Skousen", src: "/sponsors/skousen.svg", width: 65, height: 32 },
  { name: "Tandex", src: "/sponsors/tandex.svg", width: 77, height: 28 },
  {
    name: "Tolk Danmark",
    src: "/sponsors/tolkdanmark.svg",
    width: 166,
    height: 20,
  },
];

/**
 * Kept out of the roster so `everyFourth` can place it. Sized by the same rule
 * as the rest and deliberately not enlarged — it is the title partner, but the
 * prominence is meant to come from coming round twice as often, not from
 * being twice the size.
 */
const gShock = {
  name: "G-SHOCK",
  src: "/sponsors/g-shock.svg",
  width: 118,
  height: 20,
};

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
 * Drops G-SHOCK into every fourth slot. It is the title partner, so it comes
 * round more often than a seventh of the time — three others, then the mark,
 * repeated.
 *
 * Which is why the roster above is six long rather than any other number: it
 * divides into groups of three exactly, so the run ends on a G-SHOCK and the
 * cadence survives the loop back to the top. The marquee carries the row twice
 * and travels half its own width, so a list whose length is not a multiple of
 * four would put two G-SHOCKs within a slot of each other at the seam — the one
 * place the repeat is meant to be invisible.
 *
 * The mobile rows take three each and come out four long, so every fourth holds
 * there too.
 */
function everyFourth(roster: Sponsor[]): Sponsor[] {
  return roster.flatMap((sponsor, index) =>
    index % 3 === 2 ? [sponsor, gShock] : [sponsor],
  );
}

/**
 * Half the roster, for the phone's two rows. Alternating rather than split down
 * the middle, so neither row is all wordmarks and the other all square marks —
 * the widths run 65 to 166 and taking the list in halves put most of the wide
 * ones together.
 *
 * Split first and interleave second: filtering the finished list by parity
 * instead would land both G-SHOCKs on the same row and leave the other with
 * none, since they sit at the two odd indices.
 */
function sponsorRow(offset: number) {
  return everyFourth(sponsors.filter((_, index) => index % 2 === offset)).map(
    (sponsor, index) => (
      <SponsorMark key={`${sponsor.name}-${index}`} {...sponsor} />
    ),
  );
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

            Eight marks on a 375 screen is a row you watch four of at a time and
            wait out the rest of. Split in half and counter-run, the same eight
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
            {everyFourth(sponsors).map((sponsor, index) => (
              <SponsorMark key={`${sponsor.name}-${index}`} {...sponsor} />
            ))}
          </Marquee>
        </div>
      </StaggerReveal>
    </SectionFrame>
  );
}
