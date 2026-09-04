import { Hero } from "@/components/sections/hero";
import { FrameSpacer, Ressurect } from "@/components/sections/ressurect";
import { NoiseLab } from "@/components/sections/noise-lab";
import { Sponsors } from "@/components/sections/sponsors";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FrameSpacer />
      <Ressurect />
      <Sponsors />
      {/* SCAFFOLDING — delete this line and noise-lab.tsx to drop the experiment. */}
      <NoiseLab />
    </>
  );
}
