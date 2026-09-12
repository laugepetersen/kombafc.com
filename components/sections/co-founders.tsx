import Image from "next/image";

import { SectionFrame } from "@/components/layout/section-frame";

/**
 * The two co-founders who are not the front figure.
 *
 * They were a pair of 60px chips in a "Created by" row until now, which put
 * them at the size of a credit line under a block that gives Youssef a
 * portrait, a pull quote and three paragraphs. This is the same device as his
 * at half the scale: portrait beside a panel, name, billing — one row split
 * two ways rather than his one row held whole.
 *
 * Half is measured, not eyeballed. His picture column is `min-h-160` (640px)
 * from lg and his name is `display-2`; each of these is a 320px square beside
 * its panel at xl, with the name two steps down the scale at `display-4` — 30px
 * against his 48. The cell only splits at lg: two of them side by side put a
 * 480px column around each, and an image and a panel inside that leaves 176px
 * of measure for a three-word name.
 *
 * The billing is theirs, given by Lauge: head of product and commercial
 * director, each under the co-founder they share. It is punctuated the way
 * Youssef's is — a middot between the two jobs, not a second line.
 *
 * PLACEHOLDER, and it is a gap rather than an invention: there is no sourced
 * copy for either of them, so the panel carries the name and the billing and
 * stops. `line` is the slot a sentence each goes in when Lauge writes them —
 * one line under the billing, at the panel's own width.
 */
type CoFounder = {
  name: string;
  role: string;
  imageSrc: string;
  line?: string;
};

const coFounders: CoFounder[] = [
  {
    name: "Lauge Milling Petersen",
    role: "Co-founder · Head of product",
    imageSrc: "/team/lauge-petersen.webp",
  },
  {
    name: "Houdaifa Harrar",
    role: "Co-founder · Commercial director",
    imageSrc: "/team/houdaifa-harrar.webp",
  },
];

/**
 * Where the pair's rules go, on the container for the reason the founder
 * strip's were: which cell starts a row is a fact about the grid at a given
 * width, not about the cell. Stacked on a phone, side by side from md — so
 * the second cell takes a horizontal rule while they are stacked and a
 * vertical one once they are not.
 */
const PAIR = [
  "grid md:grid-cols-2",
  "[&>*:nth-child(2)]:border-rule [&>*:nth-child(2)]:border-t",
  "md:[&>*:nth-child(2)]:border-t-0 md:[&>*:nth-child(2)]:border-l",
].join(" ");

/**
 * Square where the cell splits, 4:3 while it is stacked, and that is the
 * portraits' call both times: the files are 480px squares cropped from full
 * portraits, so a *taller* box would be showing an upscale down one axis —
 * while a square one stacked on a phone is a 343px picture of a man above two
 * lines of text, which is his block, not half of it.
 *
 * 320 CSS px is still a 2x screen asking for 640 off a 480 file. A bigger
 * export is the fix, not a smaller box.
 */
const SIZES = "(min-width: 1280px) 320px, (min-width: 768px) 50vw, 100vw";

export function CoFounders() {
  return (
    <SectionFrame outerClassName="[&>[data-frame-rule]]:border-t">
      <div className={PAIR}>
        {coFounders.map((person) => (
          <article key={person.name} className="grid lg:grid-cols-2">
            <div className="bg-ink-800 relative aspect-[4/3] lg:aspect-square">
              <Image
                src={person.imageSrc}
                // The name is set beside it as text; describing the portrait
                // here would only have it announced twice.
                alt=""
                fill
                sizes={SIZES}
                className="object-cover object-top"
              />
            </div>

            <div className="bg-panel border-rule flex flex-col justify-center border-t px-6 py-8 md:px-8 md:py-10 lg:border-t-0 lg:border-l">
              <h3 className="display-4">{person.name}</h3>

              <p className="font-body text-chrome-violet mt-3 text-sm leading-[1.4] font-medium tracking-[0.04em] uppercase brightness-125">
                {person.role}
              </p>

              {person.line ? (
                <p className="text-ink-200 mt-4 max-w-[32ch] text-base leading-[1.5]">
                  {person.line}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </SectionFrame>
  );
}
