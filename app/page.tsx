import { Athletes } from "@/components/sections/athletes";
import { Format } from "@/components/sections/format";
import { Hero } from "@/components/sections/hero";
import { PreviousShow } from "@/components/sections/previous-show";
import { FrameSpacer, Ressurect } from "@/components/sections/ressurect";
import { Sponsors } from "@/components/sections/sponsors";
import { StrikingSports } from "@/components/sections/striking-sports";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FrameSpacer />
      <Ressurect />
      <Sponsors />
      <PreviousShow />
      <Format />
      {/* Last, and after the format rather than before it: the page says what
          the night is, then who is in it, and ends on the two doors out —
          the roster, and the form for getting onto it. */}
      <Athletes />

      {/* Last thing before the footer. A top rule of its own because the
          Athletes block above closes on a Section, which draws none — and no
          bottom one, because the footer opens with its own `border-t`. One
          hairline a seam, like everywhere else.

          It sat under the hero first. Down here it does a different job: the
          page has just asked the reader to join the roster, and the band is
          the list of what they might already fight. */}
      <StrikingSports className="border-t" />
    </>
  );
}
