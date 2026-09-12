import Image from "next/image";
import { Fragment } from "react";

import { Section } from "@/components/layout/section";
import { SectionFrame } from "@/components/layout/section-frame";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Kicker } from "@/components/ui/kicker";
import { LineRise } from "@/components/ui/line-rise";
import { cn } from "@/lib/utils";

/**
 * The three ways in, one to a row.
 *
 * A centred page header over a run of text-and-image blocks, mirrored down the
 * page: photograph left, then right, then left. The alternation is what stops
 * three rows of one construction reading as a table — and it makes the eye
 * cross the page at each package rather than run down a single column of copy
 * with pictures stacked beside it.
 *
 * Each row is its own SectionFrame, so the rule between two packages runs the
 * full width of the viewport while the verticals stay on the 1280 column. One
 * frame with three inner borders would have stopped those rules at the column
 * edge, which is not how any other seam on the site is drawn.
 *
 * A spacer frame sits between two rows rather than padding on either of them,
 * for the same reason the home page puts one above its text-and-image block:
 * the verticals have to keep running through the gap, or the gap stops being
 * part of the frame and starts being a hole in it.
 */

/**
 * Where an enquiry goes: the contact page, not an inbox.
 *
 * These three CTAs used to be `mailto:` links carrying the tier in the
 * subject, so a reply knew which conversation it was joining. Lauge's call to
 * send them to /contact instead, and it costs that: the tier is not in the
 * mail any more, and the two desks on the contact page are the only sorting
 * that survives. What it buys is one door — nothing on the site names an
 * inbox in two places, and a reader who is not ready to open a mail client
 * gets a page rather than a composer they have to close.
 */
const ENQUIRY = "/contact";

/** Half the 1280 column at the widest, full width once the row stacks. */
const SIZES = "(min-width: 1280px) 640px, (min-width: 1024px) 50vw, 100vw";

type Tier = {
  name: string;
  price: string;
  /** One line on who the tier is for. */
  summary: string;
  includes: string[];
  /**
   * The tier below, carried up. Its own field rather than the last line of
   * `includes` because it is not one of the things in the package — it is
   * every thing in another one, which is why it leads the list rather than
   * closing it and why it is the only line set in the ramp.
   */
  carries?: string;
  image: string;
  /** The photograph carries the tier's own argument, so it is described. */
  alt: string;
  /** Where the crop holds, when centred is wrong for that frame. */
  position?: string;
  /**
   * Takes the filled CTA. Exactly one per view — see the note on the violet
   * fill in the button.
   */
};

const tiers: Tier[] = [
  {
    name: "Network",
    price: "25.000 DKK / year",
    summary:
      "The room and the people in it. No logo and no placement — a seat on every card, and the table afterwards.",
    includes: [
      "Tickets and drinks at every show",
      "A standing discount on further tickets",
      "Straight past the queue",
      "The yearly partner dinner",
    ],
    image: "/show/show-17.webp",
    alt: "The crowd in the stands at K.B. Hallen during KOMBA 1.0",
  },
  {
    name: "Sponsor",
    price: "From 50.000 DKK / event",
    summary:
      "Your mark on the night. At the venue and in our marketing, on top of everything Network opens.",
    includes: [
      "VIP — more seats, more access",
      "Logo digitally as part of our marketing",
      "Logo at the venue",
    ],
    carries: "Everything in Network",
    image: "/show/show-01.webp",
    alt: "The lit ring and the screens above it, seen from the stands at K.B. Hallen",
    // The ring sits low in the frame under the screens, and a centred crop in
    // a landscape box spends the top half of it on roof.
    position: "object-[50%_55%]",
  },
  {
    name: "Partner",
    price: "Inquiry",
    summary:
      "Built into the show rather than placed beside it, with the VIP end of the room opened up on top.",
    includes: [
      "Your brand written into the show itself",
      "Prime placement, venue and broadcast",
      "Extended VIP — exclusive seats and access",
    ],
    carries: "Everything in Network",
    image: "/show/show-05.webp",
    alt: "A performer under a spotlight during the halftime show",
  },
];

/**
 * The gap between two packages. Carries no content — it exists so the vertical
 * rules keep running between one row and the next, and the space reads as part
 * of the frame rather than as the page showing through a hole in it.
 *
 * Same 80px the home page's text-and-image block is given above it, and the
 * same as the top padding of the section that follows it there. Flat, not
 * stepped: it is the gap the frame carries at every width on that page.
 *
 * Its bottom rule is stood down. The row below draws that seam itself, on its
 * own panel, and two 1px rules in a translucent colour composite to a 2px one.
 */
function RowSpacer() {
  return (
    <SectionFrame
      className="h-20"
      outerClassName="[&>[data-frame-rule]]:border-b-0"
    />
  );
}

function PackageRow({ tier, index }: { tier: Tier; index: number }) {
  const { name, price, summary, includes, carries, image, alt, position } =
    tier;

  // The second row, and every other one after it. Only from lg: stacked, the
  // photograph is always on top, because a picture that arrives after its own
  // heading on one row and before it on the next reads as a mistake rather
  // than as a mirror.
  const imageRight = index % 2 === 1;

  return (
    // Every row draws both its own edges rather than leaving the top to the
    // frame above. A spacer sits between two packages and has no ground of its
    // own, so a seam drawn there would land on bare page immediately above a
    // coloured panel and read as a dark line under a lighter block — the whole
    // reason these rules are overlays. Drawn here it lands on this row's own
    // panel and takes its colour. The spacer stands its bottom rule down to
    // keep the seam at one pixel.
    //
    // `first:` cannot reach the opening row either: the page's heading section
    // sits above it, so it is never `:first-child` however first it is in the
    // run of frames.
    <SectionFrame outerClassName="[&>[data-frame-rule]]:border-t">
      <div className="grid lg:grid-cols-2">
        {/* Square on a phone, no ratio side by side. Stacked, the floor gave a
            375-wide column a 288px band, which is a letterbox rather than a
            photograph; 1:1 is the shape it wants, and it is the home page's
            block too, so the two read as one layout. From lg the rows stretch
            again — the copy opposite sets the height and the photograph fills
            it — and the floor is what a fill image cannot supply for itself,
            since it contributes no height of its own. */}
        <div
          className={cn(
            "relative aspect-square lg:aspect-auto lg:min-h-96",
            imageRight && "lg:order-last",
          )}
        >
          <Image
            src={image}
            alt={alt}
            fill
            sizes={SIZES}
            className={cn("object-cover", position)}
          />
        </div>

        {/* The panel ground, as the text-and-image block is built: the
            panel is what separates the copy from the photograph beside it, and
            the rule on the edge they meet on is the frame's own.

            The seam is always the panel's, never the photograph's, because a
            border paints over its own element's background: on the panel it is
            white/10 over the panel ground, and on the image column it would be
            white/10 over bare page — the same rule rendering as two different
            greys depending on which way the row is mirrored.

            Which leaves where it lands. A border sits inside its box, so the
            panel on the right draws the pixel *after* the column boundary and
            the panel on the left the pixel *before* it: mirror the row and the
            seam jumps a pixel across the page. `-ml-px` pulls the right-hand
            panel back over the boundary so its border lands on the same pixel
            the left-hand one does, and the seam holds still down the run. It
            is also the pixel the home page's block uses, so the two agree.

            One pixel of the photograph goes under it. A 1px line cannot in
            fact be centred on the boundary — 1280 is even, so dead centre is a
            half pixel and a rule drawn there splits across two of them at half
            strength. Consistent and crisp beats centred and fogged. */}
        <div
          className={cn(
            "border-rule bg-panel flex flex-col justify-center px-6 py-10 md:px-12 md:py-14 xl:px-15 xl:py-16",
            imageRight ? "lg:border-r" : "lg:-ml-px lg:border-l",
          )}
        >
          <h2 className="display-4">{name}</h2>

          {/* The ask, on its own line under the name rather than ranged off to
              the right of it — with a whole row to itself a package is read
              downwards, and a price hung on the far edge is the one thing on
              the panel that lines up with nothing.

              Body size and regular weight, but white: it sits directly under
              the name and belongs to it, so it holds the same ink and steps
              down only in size and weight. */}
          <p className="font-body mt-3 text-base leading-[1.4] text-white">
            {price}
          </p>

          {/* What the package is: body size, body colour. It went a step up
              for a while, which made it the largest run of text on the panel
              and had it competing with the name for the top of the block —
              this is the explanation, not the headline. */}
          <p className="text-ink-200 mt-5 max-w-[46ch] text-base leading-[1.4]">
            {summary}
          </p>

          <ul className="mt-6 flex flex-col gap-2.5">
            {/* First, because it is the largest thing in the package: what the
                tier below already gave you. Set in the same ramp the check
                beside it is painted with — `text-chrome-violet` and the
                `#chrome-violet` paint server are the one gradient — so the
                line reads as belonging to the mark rather than to the list.

                A plain string, not `cn`: `text-chrome-violet` is a custom
                text-* utility and tailwind-merge cannot be trusted with those.
                It also sets `color: transparent` and clips the fill to the
                glyphs, so it must not be given a text colour to fight with —
                see the note in CLAUDE.md. */}
            {carries ? (
              <li className="flex items-start gap-2.5">
                <Icon name="check" violet className="mt-px size-5 shrink-0" />
                <span className="text-chrome-violet leading-[1.4] font-medium">
                  {carries}
                </span>
              </li>
            ) : null}

            {includes.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                {/* Given no label the icon hides itself, which is what this one
                    wants — the line beside it is the content, and a list read
                    out as "check, check, check" adds nothing. */}
                <Icon name="check" violet className="mt-px size-5 shrink-0" />
                {/* A step under body, white and medium. Smaller than the
                    paragraph above it because it is a list rather than prose,
                    and heavier and whiter to buy that size back — these are
                    the lines somebody scanning the panel actually compares
                    between packages. */}
                <span className="leading-[1.4] font-medium text-white">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          {/* self-start so the CTA is sized by its label rather than stretched
              to the panel. */}
          <Button href={ENQUIRY} className="mt-8 self-start">
            Contact us
          </Button>
        </div>
      </div>
    </SectionFrame>
  );
}

export function Partners() {
  return (
    <>
      {/* The top padding is clearance, not rhythm: the nav pill floats over
          this page and comes to about 76px, which no section preset clears on
          a phone. The bottom is set on its own too, because what follows is a
          rule rather than more page — the gap belongs to the header rather
          than sitting between two blocks. */}
      <Section
        spacing="none"
        className="pt-32 pb-12 md:pt-40 md:pb-16 xl:pb-20"
      >
        {/* Left on a phone, centred from md. A centred column needs slack
              either side to read as centred rather than as text that happens to
              be in the middle — at 343 wide with a six-line heading filling it
              there is none, so every line is ragged at both ends and the block
              has no edge to sit on. Ranged left it has one, and the eyebrow,
              the heading and the blocks below all start on the same line. */}
        <div className="flex flex-col items-start text-left md:items-center md:text-center">
          <Kicker>Partnerships</Kicker>

          {/* The measure is on the heading rather than on a wrapper around it,
              so the centring is the type's own and the lines break where the
              `ch` runs out instead of wherever the column happens to end. */}
          <LineRise
            as="h1"
            text="Together, we shape the future of Striking Sports In Scandinavia."
            className="display-1 mt-6 max-w-[20ch] md:mt-8"
          />
        </div>
      </Section>

      {tiers.map((tier, index) => (
        <Fragment key={tier.name}>
          {index > 0 ? <RowSpacer /> : null}
          <PackageRow tier={tier} index={index} />
        </Fragment>
      ))}

      {/* The closer. Without it the last package's panel butts straight into
          the footer and the verticals stop dead against it — the frame ends
          mid-sentence and the footer's own top padding, which carries no rules,
          reads as a hole rather than as the footer beginning.

          A spacer frame rather than padding on the row above, for the same
          reason the home page puts one between the hero and the text-and-image
          block: the rules have to keep running through the gap or the gap is
          not part of the frame.

          Its height is RowSpacer's, exactly. It was on the section rhythm's
          bottom step instead — 80px on a phone and 128 from md — which agreed
          with the gaps between the packages at one width and was half again as
          deep as them at every other. Three panels separated by 80 and then
          closed by 128 reads as the page trailing off rather than ending, and
          the run only looks even when the last gap is the same gap.

          It gives up its bottom rule. SectionFrame closes the last frame in the
          document on the assumption that nothing follows it; the footer draws a
          rule of its own along its top, and the two together make a 2px seam
          where every other rule on the site is 1. */}
      <SectionFrame
        className="h-20"
        outerClassName="last:[&>[data-frame-rule]]:border-b-0"
      />
    </>
  );
}
