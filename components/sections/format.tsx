import Image from "next/image";

import { Section } from "@/components/layout/section";
import { Icon, type IconName } from "@/components/ui/icon";
import { Kicker } from "@/components/ui/kicker";
import { LineRise } from "@/components/ui/line-rise";
import { StaggerReveal } from "@/components/ui/stagger-reveal";

/**
 * What KOMBA 2.0 is — four cards, each a photograph fading into a line of
 * copy.
 *
 * Unruled on purpose. Every module above this one is drawn on the frame, and
 * a fifth boxed grid immediately after the photograph corridor reads as more
 * of the same page rather than as the answer to it. One hairline marks the
 * return and the panels sit on the page from there.
 *
 * Two rows of a third and two thirds, mirrored: narrow then wide, wide then
 * narrow. The alternation is what keeps four panels from reading as a table —
 * and it puts the wide slot under whichever of the pair has the photograph
 * worth the room.
 *
 * Card copy is Lauge's, off the format and venue slides. Three of the slide's
 * bullets are not cards: "new rules" and "understandable" are what the heading
 * says, and "pros only, small gloves" came out on Lauge's call.
 */
type Card = {
  title: string;
  body: string;
  icon: IconName;
  /** From the night at K.B. Hallen. Decorative — the title carries the point. */
  image: string;
  /**
   * Where the crop holds. A near-square card off a 3:2 frame throws most of
   * the picture away, so which part it keeps is a decision per photograph
   * rather than one default that happens to suit the first one.
   */
  position: string;
  /**
   * Rendered width at each layout, so next/image fetches one size too many.
   * A third of the 1280 column less its share of the two 16px gaps is 416px;
   * two thirds is 848.
   */
  sizes: string;
};

/** The rules: a narrow slot, then a wide one. */
const rules: Card[] = [
  {
    title: "Ground & pound",
    body: "The best of MMA, allowed inside a striking fight.",
    icon: "sports_mma",
    // No photograph of a ground and pound exists — it was not in the 1.0 rule
    // set. This is the closest the night got: a knee out of a clinch.
    image: "/show/show-11.webp",
    position: "object-top",
    sizes: "(min-width: 1280px) 416px, (min-width: 768px) 50vw, 100vw",
  },
  {
    title: "Cross-sport",
    body: "Karate, Thai boxing, kickboxing — every striking sport meets in the same ring.",
    icon: "sports_martial_arts",
    image: "/show/show-07.webp",
    position: "object-top",
    sizes: "(min-width: 1280px) 848px, (min-width: 768px) 50vw, 100vw",
  },
];

/** The show, mirrored: the wide slot first this time. */
const show: Card[] = [
  {
    title: "Halftime shows",
    body: "KUNDO x G-SHOCK opened the first one. Every night has a show inside the show.",
    icon: "music_note",
    image: "/show/show-19.webp",
    // Held a third down rather than centred: centred, the wide crop lands on
    // the coat and cuts the head and the microphone off the top.
    position: "object-[50%_30%]",
    sizes: "(min-width: 1280px) 848px, (min-width: 768px) 50vw, 100vw",
  },
  {
    title: "Lights, volume & experience",
    body: "Digital screens, VFX, sound design and a livestream, all built around the fight.",
    icon: "graphic_eq",
    image: "/show/show-28.webp",
    position: "object-center",
    sizes: "(min-width: 1280px) 416px, (min-width: 768px) 50vw, 100vw",
  },
];

/**
 * The photograph fills the whole panel and the copy is read over it. Full
 * strength to 25% of the run, a straight fall over the middle half, and clear
 * from 75% on — so the corner the type starts in is properly covered, the far
 * quarter is untouched picture, and neither end is spent on a ramp that is
 * barely doing anything.
 *
 * Both holds come from where the stops sit rather than from extra stops in
 * the middle: a gradient paints its opening colour back to the start of the
 * run and its closing colour on to the end, so 25% and 75% give a solid
 * quarter and a clear quarter off two stops.
 *
 * Tilted 10deg rather than run straight down, so the fall leans from the left
 * of the panel to the right instead of running level across it. 20deg leaned
 * far enough to read as a wedge taken out of the corner.
 *
 * Lands on --color-panel, the card's own fill and the step the text-and-
 * image block above is built on — a few notches up off the page rather than
 * the page's own black, and the colour the fade has to arrive at or it stops a
 * shade short and draws a line.
 */
const FADE = "linear-gradient(10deg, var(--color-panel) 25%, transparent 75%)";

function FormatCard({ title, body, icon, image, position, sizes }: Card) {
  return (
    // No border and no radius: one step up off the void is what makes it a
    // panel, and the gap around it is what separates one from the next. No
    // overflow either — the image fills the box exactly, and the clip was only
    // ever there to hold the hover zoom in.
    <article className="bg-panel relative flex h-full min-h-90 flex-col justify-end md:min-h-108">
      {/* 6px of the card's own ink all the way round the photograph — the
          fighter cards' mount, and the same 6px — so the picture reads as set
          into the panel rather than as the panel itself.

          The fade is untouched and does not need to be. It lands on
          --color-panel, which is what the mount is made of, so the two ends of
          the card behave differently and both correctly: down in the corner
          where the type sits the picture has already become panel before it
          reaches the inset and there is no edge to see, and up in the clear
          quarter the mount is a crisp 6px line, which is the point of it. */}
      <div className="absolute inset-1.5" aria-hidden="true">
        <Image
          src={image}
          alt=""
          fill
          sizes={sizes}
          className={`object-cover ${position}`}
        />
        <div className="absolute inset-0" style={{ background: FADE }} />
      </div>

      <div className="relative p-6 md:p-8">
        <Icon name={icon} violet className="size-8" />

        {/* plain, not display: the card is read rather than announced, and the
            relief the poster register carries fogs the counters at this size. */}
        <h3 className="plain-6 mt-5">{title}</h3>

        <p className="text-ink-200 mt-3 max-w-[38ch] text-base leading-[1.4]">
          {body}
        </p>
      </div>
    </article>
  );
}

export function Format() {
  return (
    // Section, not SectionFrame: this one wants the horizontal tick that marks
    // the end of the corridor and none of the verticals that would box it.
    <Section spacing="lg" className="border-rule border-t">
      {/* Ranged right from md. items-end sets the eyebrow and the heading box
          against the right edge; text-right is what squares the heading's own
          lines inside that box, or they would ragged-right inside a block that
          had merely been moved across. */}
      <div className="flex flex-col md:items-end md:text-right">
        <Kicker>The format</Kicker>

        {/* The poster register, at the fourth step: Eurostile black italic
            with the relief, and the sizes that go with it. The measure opens
            with the drop — `ch` tracks the type, so 18 of them would hold the
            same four lines at two thirds the width and read as a column. */}
        <LineRise
          as="h2"
          text="Every striking sport. Maximum entertainment. Anyone can follow."
          className="display-4 mt-6 max-w-[24ch] md:mt-8"
        />
      </div>

      {/* Two rows rather than one grid with spans. StaggerReveal wraps each
          child in a box of its own, so a span would have to live on a wrapper
          this component does not hand out — which is why the third and two
          thirds are reached through a child selector rather than set on the
          card.

          Split only from lg. A third of the tablet column is 219px, which
          wraps every title and squeezes the photograph into a portrait slot,
          so md gets two equal panels and the mirror starts where there is room
          for it. */}
      <StaggerReveal className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-3 lg:[&>*:last-child]:col-span-2">
        {rules.map((card) => (
          <FormatCard key={card.title} {...card} />
        ))}
      </StaggerReveal>

      <StaggerReveal className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:[&>*:first-child]:col-span-2">
        {show.map((card) => (
          <FormatCard key={card.title} {...card} />
        ))}
      </StaggerReveal>
    </Section>
  );
}
