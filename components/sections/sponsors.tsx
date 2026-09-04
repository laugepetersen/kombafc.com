import { SectionFrame } from "@/components/layout/section-frame";
import { Marquee } from "@/components/ui/marquee";

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

export function Sponsors() {
  return (
    <SectionFrame>
      <div className="flex flex-col items-center gap-10 py-16 md:py-20">
        <p className="text-ink-200 max-w-72 px-6 text-center text-base leading-[1.4] tracking-[0.01em]">
          <span className="text-white">Proudly sponsored by partners</span>
          <br />
          who believe in what we do
        </p>

        {/* Fades to void, which is what the section sits on — a fade to any
            other value would show a seam against the page. */}
        <Marquee className="w-full" durationSeconds={45}>
          {sponsors.map(({ name, src, width, height }) => (
            /* eslint-disable-next-line @next/next/no-img-element -- fixed-size
               logo marks; next/image would add a wrapper and a second hop for
               SVGs it will not optimise anyway. */
            <img
              key={name}
              src={src}
              alt={name}
              width={width}
              height={height}
              style={{ height, width }}
              className="max-w-none shrink-0 opacity-[0.64] transition-opacity duration-200 hover:opacity-100"
            />
          ))}
        </Marquee>
      </div>
    </SectionFrame>
  );
}
