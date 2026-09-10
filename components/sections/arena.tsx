import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Icon } from "@/components/ui/icon";
import { Kicker } from "@/components/ui/kicker";
import { LineRise } from "@/components/ui/line-rise";
import { Marquee } from "@/components/ui/marquee";
import { StaggerReveal } from "@/components/ui/stagger-reveal";

/**
 * The claim in the page's h1, argued rather than asserted.
 *
 * "All strikers. One arena." is the whole promotion in four words, and until
 * this block the About page said it once at the top and never came back to it.
 * This is the coming back: what the sports actually do instead, why that is
 * strange, and what a card looks like when it stops.
 *
 * Not another text-and-image row. Three of those already run down this page —
 * the vision block, the founder, and the two that follow this one — and a
 * fourth would turn the argument into furniture. So the prose sits in two
 * columns under a wide heading, the pictures come after it as a pair rather
 * than beside it, and the band of sport names runs the full width of the
 * window with nothing else on the line.
 *
 * PLACEHOLDER: the copy is written here, not given by Lauge. The one number in
 * it — five countries on the 1.0 card — is the v1 site's own, off
 * `content/legacy-data.ts`.
 */

type Frame = {
  src: string;
  alt: string;
  /** Where the crop holds, per photograph. */
  position?: string;
};

/**
 * Two frames of the same argument: what crosses the ropes, and what happens
 * once it has. The flags are the border being crossed and the exchange is the
 * styles meeting, which is the order the copy above makes the point in.
 */
const frames: Frame[] = [
  {
    src: "/show/show-06.webp",
    alt: "A fighter stands in the ring with an arm raised, a Finnish flag on one side of him and a Danish flag on the other",
    // The flags are at the bottom corners of the frame and his raised arm is
    // at the top, so a centred crop of a 3:2 picture into a 4:3 box keeps the
    // middle and loses both halves of the point.
    position: "object-[50%_45%]",
  },
  {
    src: "/show/show-13.webp",
    alt: "Two fighters exchanging punches on the ropes at K.B. Hallen, the referee a step away",
    position: "object-center",
  },
];

/**
 * The band.
 *
 * PLACEHOLDER, and the one on this page most worth Lauge's eye: these are
 * striking sports, not a list of what has been in a KOMBA ring. Three of them
 * have — Muay Thai, kickboxing and K-1 are what the 1.0 card was billed as —
 * and the rest are the argument rather than the roster. Cut it to the sports
 * actually being invited before this goes to production, or the band promises
 * a card the matchmaking has not booked.
 */
const disciplines = [
  "Muay Thai",
  "Kickboxing",
  "K-1",
  "Karate",
  "Taekwondo",
  "Sanda",
  "Boxing",
  "Savate",
  "Lethwei",
];

export function Arena() {
  return (
    <>
      {/* No rule of its own. The vision block above closes with the frame's
          own bottom edge, and a second hairline a pixel under it composites to
          a 2px one — which is why every seam on this site is drawn once, by
          whichever side has a ground to draw it on. */}
      <Section spacing="lg">
        <div className="flex flex-col">
          <Kicker>One arena</Kicker>

          <LineRise
            as="h2"
            text="Every striking sport has a best. They never meet."
            className="display-2 mt-6 max-w-[20ch] md:mt-8"
          />
        </div>

        {/* Two columns from lg, and a wide gutter between them — this is the
            longest run of prose on the site, and set across the whole 1280 it
            would be a 140-character measure nobody finishes. Columns rather
            than a grid: the run is one argument that happens to be two
            paragraphs, so it should flow, not be dealt out. */}
        <StaggerReveal className="mt-10 md:mt-12">
          <div className="text-ink-200 space-y-6 text-base leading-[1.5] lg:columns-2 lg:gap-16 lg:space-y-0 xl:gap-24">
            <p className="break-inside-avoid lg:mb-6">
              Karate has world champions. So do Thai boxing, kickboxing, K-1,
              sanda and taekwondo — and almost none of them ever share a ring.
              Every sport keeps its own federations, its own scoring, its own
              belts and its own idea of what a good fight looks like. Two of the
              best strikers alive can spend a career training forty minutes
              apart in Copenhagen and never once find out.
            </p>
            <p className="break-inside-avoid">
              KOMBA is where that stops. One ring, one rule set, and a card
              matched so the styles have to answer each other — the karateka’s
              timing against the Thai boxer’s clinch, the kickboxer’s volume
              against someone who has spent fifteen years learning to walk
              through it. It is the question the sport has been politely
              avoiding, and we ask it on a Saturday night in front of a room.
            </p>
          </div>
        </StaggerReveal>

        {/* The pair. Stacked on a phone and side by side from md, on the 16px
            the card grids use — these are two halves of one statement, not two
            panels that happen to be adjacent, and a wider gap would separate
            them into exactly that. */}
        <StaggerReveal className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2">
          {frames.map((frame) => (
            <div
              key={frame.src}
              className="bg-panel relative aspect-[4/3] overflow-hidden"
            >
              <Image
                src={frame.src}
                alt={frame.alt}
                fill
                // Half the 1280 column less its share of the gap.
                sizes="(min-width: 1280px) 632px, (min-width: 768px) 50vw, 100vw"
                className={`object-cover ${frame.position ?? ""}`}
              />
            </div>
          ))}
        </StaggerReveal>

        {/* The caption belongs to the pair above it, so it is set small and
            hung under them rather than given the body column's size — a
            paragraph at 16px under two photographs reads as the next section
            starting. */}
        <p className="text-ink-300 mt-4 flex items-start gap-2 text-sm leading-[1.4]">
          <Icon name="public" className="mt-px size-4 shrink-0" />
          <span>
            KOMBA 1.0 put fighters from five countries — Denmark, Finland,
            Sweden, Turkey and Morocco — on one card at K.B. Hallen.
          </span>
        </p>
      </Section>

      {/* Full-bleed, and the only thing on its line. A band of sport names that
          stops at the 1280 column is a widget; run to both edges it is the
          page saying the words. Rules top and bottom rather than a Section's
          own spacing, so it reads as a strip laid into the page. */}
      <section
        aria-label="The striking sports"
        className="border-rule overflow-hidden border-y py-8 md:py-10"
      >
        <Container className="mb-6 md:mb-8">
          <Kicker>All strikers</Kicker>
        </Container>

        <Marquee
          durationSeconds={52}
          // 40px between names on a phone, 64 from md — set on the row rather
          // than left at the component's 60px default, which is tuned for
          // sponsor marks rather than for words that already carry their own
          // side bearings.
          gapClassName="gap-10 pe-10 md:gap-16 md:pe-16"
        >
          {disciplines.map((name, index) => (
            <span
              key={name}
              className={
                // Solid and hollow, alternating. Purely rhythm: nine names in
                // one colour is a band of texture the eye slides off, and the
                // outline is the poster device the wordmark already uses. No
                // claim is encoded in which is which — see the note above.
                //
                // The stroke goes on with a transparent fill, so the glyph is
                // its own outline rather than a second copy behind it.
                index % 2 === 0
                  ? "font-heading text-2xl leading-none font-black whitespace-nowrap text-white/80 uppercase italic md:text-4xl xl:text-5xl"
                  : "font-heading text-2xl leading-none font-black whitespace-nowrap text-transparent uppercase italic [-webkit-text-stroke:1px_var(--color-ink-400)] md:text-4xl xl:text-5xl"
              }
            >
              {name}
            </span>
          ))}
        </Marquee>
      </section>
    </>
  );
}
