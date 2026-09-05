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
    </>
  );
}
