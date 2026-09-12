import Image from "next/image";

import { Section } from "@/components/layout/section";
import { SectionFrame } from "@/components/layout/section-frame";
import { CARD_FADE } from "@/components/sections/format";
import { Icon, type IconName } from "@/components/ui/icon";
import { Kicker } from "@/components/ui/kicker";
import { LineRise } from "@/components/ui/line-rise";
import { StaggerReveal } from "@/components/ui/stagger-reveal";

/**
 * Who KOMBA is, in three blocks: the claim, the vision and the character. The
 * people who started it are the two blocks after this one — `CoFounders` and
 * `Founder`, which give them portraits rather than a credit row of chips.
 *
 * Every line of copy on the page is Lauge's, verbatim. He gave five taglines
 * and three sentences, and the page is the arrangement of them rather than a
 * rewrite: one tagline is the h1, one heads the vision block, and the other
 * three are the creed cards. Each is used exactly once — five slogans stacked
 * in one list would only expose how much they overlap, where spread across the
 * page each lands somewhere it has to do a different job.
 *
 * The format grid on the home page is the sibling this page's cards are built
 * from, and the thing it deliberately does not repeat: that grid answers what
 * a KOMBA night *is*, so this one stays on who is putting it on.
 */

/** The vision block's photograph — a family at the sponsor wall. */
const VISION = {
  src: "/show/show-25.webp",
  alt: "A family photographed at the sponsor wall at KOMBA 1.0",
};

type Creed = {
  /** One of Lauge's five, and the whole of the card. */
  line: string;
  icon: IconName;
  /** From the night at K.B. Hallen. Decorative — the line carries the point. */
  image: string;
  /** Where the crop holds, per photograph rather than one default for all. */
  position: string;
};

/**
 * Three cards, one for each word of "we are bold, different and redefining".
 *
 * A tagline and nothing under it, where the format card carries a title and a
 * body. That is the difference between the two grids and it is the right one:
 * those cards explain a rule, these state a position, and a slogan with an
 * explanatory sentence beneath it stops being a slogan.
 */
const creed: Creed[] = [
  {
    line: "New Era of Striking Sports.",
    icon: "bolt",
    image: "/show/show-20.webp",
    // The head kick sits in the upper half of the frame with the press pit
    // below it, and a near-square crop centred throws the kick away.
    position: "object-[50%_35%]",
  },
  {
    line: "Elevated Fight Experience.",
    icon: "stadium",
    image: "/show/show-22.webp",
    // The commentary desk, which is the half of the experience that is not the
    // fight. Held high: centred, the crop lands on the mixing desk.
    position: "object-[50%_30%]",
  },
  {
    line: "Redefining The Fight Experience.",
    icon: "autorenew",
    image: "/show/show-03.webp",
    position: "object-center",
  },
];

function CreedCard({ line, icon, image, position }: Creed) {
  return (
    // The format card exactly — panel ground, a 4px mount on a phone and 6
    // from md, the same fade off the same constant. Only what sits in the
    // corner differs.
    <article className="bg-panel relative flex h-full min-h-90 flex-col justify-end md:min-h-108">
      <div className="absolute inset-1 md:inset-1.5" aria-hidden="true">
        <Image
          src={image}
          alt=""
          fill
          // A third of the 1280 column, less its share of the two 16px gaps
          // and the 6px mount either side. Below that the column is narrower
          // than its maximum, so the steps are read off the viewport: thirds
          // once the row splits three ways, halves while it is two, and the
          // whole screen once it stacks.
          sizes="(min-width: 1280px) 384px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className={`object-cover ${position}`}
        />
        <div className="absolute inset-0" style={{ background: CARD_FADE }} />
      </div>

      <div className="relative p-6 md:p-8">
        <Icon name={icon} violet className="size-8" />

        {/* display, where the format card is plain — the two grids differ on
            exactly this. A card that explains something is read; a card that
            is one slogan is announced, and the poster register is what
            announcing sounds like on this site. */}
        <h3 className="display-5 mt-5 max-w-[16ch]">{line}</h3>
      </div>
    </article>
  );
}

export function About() {
  return (
    <>
      {/* The header, on the partnerships page's clearance rather than a
          section preset: the nav pill floats over this page and comes to about
          76px, which no preset clears on a phone. */}
      <Section
        spacing="none"
        className="pt-32 pb-12 md:pt-40 md:pb-16 xl:pb-20"
      >
        {/* Left on a phone, centred from md — a centred column needs slack
            either side to read as centred rather than as text that happens to
            sit in the middle, and at 343 wide there is none. */}
        <div className="flex flex-col items-start text-left md:items-center md:text-center">
          <Kicker>About</Kicker>

          {/* Two lines, forced, rather than a measure that happens to break
              them there. It is two sentences and they are the two halves of
              the claim — left to wrap, the column decided, and at 1280 it came
              out as "All Strikers. One" over "Arena.", which reads as a line
              that ran out rather than as a pair. The hero's caveat does not
              apply here: both halves fit a 375 column at the step's own phone
              size, so the break the design wants is a break the line can
              actually take. */}
          <LineRise as="h1" className="display-1 mt-6 md:mt-8">
            <span className="block">All Strikers.</span>
            <span className="block">One Arena.</span>
          </LineRise>

          {/* Lauge's own sentence, and now the only one under the h1 — the
              paragraph that used to footnote it was written here rather than
              given, and the block says more without it.

              The measure is the type's own rather than a wrapper's, so the
              lines break where the `ch` runs out instead of wherever the
              column happens to end. */}
          <p className="text-ink-200 mt-6 max-w-[54ch] text-base leading-[1.4] md:mt-8">
            KOMBA is a unique experience where the best strikers in all combat
            sports clash to put on an entertaining show.
          </p>
        </div>
      </Section>

      {/* The one ruled block on the page, and it draws both its own edges —
          `first:` cannot reach it, because the header above is the page's
          first child however first this is in the run of frames. A single
          banded module between two unruled sections is the tick that says the
          page has changed subject, which is the job the hairline over the home
          page's format grid does. */}
      <SectionFrame outerClassName="[&>[data-frame-rule]]:border-t">
        <div className="grid lg:grid-cols-2">
          {/* The site's text-and-image block, as the home page builds it: the
              panel ground is what separates the copy from the photograph, and
              the seam between them is the panel's own border rather than the
              image's — a border paints over its own element's background, so
              on the panel it is white/10 over panel and on the image column it
              would be white/10 over bare page. */}
          <div className="border-rule bg-panel flex flex-col justify-center border-t px-6 py-12 md:px-12 md:py-16 lg:border-t-0 lg:border-r lg:px-12 xl:px-15 xl:py-20">
            <Kicker>The vision</Kicker>

            <LineRise
              as="h2"
              text="The Experience For Fight Fans."
              className="display-2 mt-6 md:mt-8"
            />

            {/* mt-4 on a phone: 32px is the gap between two blocks, and this
                paragraph is not a block — it is the second half of what the
                heading says. Back to 32 from md, where the panel is wide
                enough for the larger gap to read as intended. */}
            <p className="text-ink-200 mt-4 max-w-96 text-base leading-[1.4] md:mt-8">
              We envision an immersive experience gathering both fight fans and
              newcomers around a shared interest.
            </p>

            {/* PLACEHOLDER — see the note in the header. Lauge's sentence
                above says who it is for; this says what "immersive" and
                "newcomers" have to mean in practice, which is the half a
                vision statement always leaves out.

                Wider measure than the line above it: at max-w-96 the panel
                would carry two paragraphs at the same 384px and read as one
                block that had been cut in half. */}
            <p className="text-ink-300 mt-4 max-w-[46ch] text-sm leading-[1.5] md:mt-6 md:text-base">
              In practice that means a night you can walk into knowing nothing.
              No federation glossary, no eight belts in one weight class, no
              waiting out six rounds for something to happen. The rules are
              short enough to explain between fights, and the show around them
              is built so the hour between the walkouts is worth the ticket on
              its own.
            </p>
          </div>

          {/* Square on a phone and a floor from lg, the home page's block
              exactly. Stacked, the floor would give a 375-wide column a
              portrait crop of a landscape frame; side by side the copy sets
              the row's height and the photograph fills it, and the floor is
              the height a fill image cannot supply for itself. */}
          <div className="relative aspect-square max-lg:order-first lg:aspect-auto lg:min-h-125">
            <Image
              src={VISION.src}
              alt={VISION.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-[50%_40%]"
            />
          </div>
        </div>
      </SectionFrame>
    </>
  );
}

/**
 * The creed, and the three who wrote it — split out of `About` rather than
 * left under it.
 *
 * The page grew a middle. Four blocks arguing the concept, the rules and the
 * production now sit between the vision and the people, and they have to: a
 * reader who has just been told what KOMBA is wants to know what that means
 * before being told who is behind it. Composition is how the route orders
 * them, so the two halves of this page are two exports rather than one
 * component the page can only place whole.
 *
 * The pair stays together — the creed states the position and the chips say
 * who holds it, and nothing belongs between them.
 */
export function Creed() {
  return (
    <>
      {/* No rule of its own: the frame above drew the bottom edge, and a
          second hairline a pixel under it composites to a 2px one. Still true
          in the new order — the block that now runs above this one closes on
          the frame as well. */}
      <Section spacing="lg">
        <div className="flex flex-col">
          <Kicker>Who we are</Kicker>

          <LineRise
            as="h2"
            text="We are bold, different and redefining."
            className="display-2 mt-6 max-w-[20ch] md:mt-8"
          />
        </div>

        {/* Three equal thirds from lg, with the last card taking the full row
            at md — a third of the tablet column is 219px, which is a portrait
            slot rather than a card, so the split waits for the room. */}
        <StaggerReveal className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-3 md:[&>*:last-child]:col-span-2 lg:[&>*:last-child]:col-span-1">
          {creed.map((card) => (
            <CreedCard key={card.line} {...card} />
          ))}
        </StaggerReveal>
      </Section>
    </>
  );
}
