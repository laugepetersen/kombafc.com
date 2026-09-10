import { Athletes } from "@/components/sections/athletes";
import { Format } from "@/components/sections/format";
import { Hero } from "@/components/sections/hero";
import { PreviousShow } from "@/components/sections/previous-show";
import { FrameSpacer, Ressurect } from "@/components/sections/ressurect";
import { Sponsors } from "@/components/sections/sponsors";

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
    </>
  );
}
