"use client";

import { useInView } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Icon } from "@/components/ui/icon";
import { Kicker } from "@/components/ui/kicker";
import { LineRise } from "@/components/ui/line-rise";
import { Marquee } from "@/components/ui/marquee";

/**
 * The stories off KOMBA 1.0, on two lanes running opposite ways.
 *
 * Counter-running is what makes a field out of a queue — the same argument the
 * sponsor marks make on a phone. One lane is a conveyor belt and you wait it
 * out; two going different ways have no direction to follow, so the eye picks
 * a card instead of tracking the row.
 *
 * Full-bleed, unlike every other block on the page. A wall of stories that
 * stops at the 1280 column reads as a widget dropped into the page; run to
 * both edges it reads as the page itself, and the marquee's own fades are what
 * end it rather than the gutter.
 *
 * Every card wears the poster's chip — avatar, handle, badge — because that is
 * what makes it read as somebody's story rather than as more of the site's own
 * footage. It is the tagged account off the top of a reposted story, not the
 * bar of KOMBA's own above it: the point of the wall is that the night was
 * filmed by the room.
 *
 * PLACEHOLDER CONTENT. One still, one clip and one handle, dealt out across
 * both lanes at the mix Lauge described — more than half of them footage. The
 * shape is what is being built here, not the set: the real stories are an edit
 * of `lanes` and nothing else.
 */

/** The one sample of each, until the real set lands. */
const SAMPLE_STILL = "/show/show-16.webp";
const SAMPLE_CLIP = "/show/clip-01.mp4";

/**
 * Instagram's badge blue, written down rather than tokenised.
 *
 * It is a brand colour, not one of ours — the same argument `brand-icon.tsx`
 * makes about the social marks. Painted in the KOMBA violet it would be a
 * violet star, and a badge nobody recognises is not a badge.
 */
const BADGE_BLUE = "#3797f0";

type Poster = {
  /** Without the @ — the chip draws it the way the app does. */
  handle: string;
  avatar: string;
  verified?: boolean;
};

type Story = Poster &
  (
    | { kind: "clip"; src: string; poster: string }
    | { kind: "still"; src: string }
  );

/** The stand-in account. Every card carries it until the real names arrive. */
const SAMPLE_POSTER: Poster = {
  handle: "komba.fc",
  avatar: SAMPLE_STILL,
  verified: true,
};

const clip: Story = {
  ...SAMPLE_POSTER,
  kind: "clip",
  src: SAMPLE_CLIP,
  poster: SAMPLE_STILL,
};

const still: Story = { ...SAMPLE_POSTER, kind: "still", src: SAMPLE_STILL };

/**
 * Nine to a lane, which is not a look — it is the shortest row that covers the
 * window it will be read on.
 *
 * The track is the row plus a copy of itself and travels exactly half its own
 * width, so the row itself has to be at least as wide as the window: come up
 * short and the end of the copy arrives on stage mid-lap with bare page behind
 * it. A card and its gap is 214px at the desktop step, so nine of them come to
 * 1926 — clear of a 1920 window, and the number to raise for anything wider.
 *
 * Six of the nine are footage either way, which is the mix Lauge described.
 */
const lanes: Story[][] = [
  [clip, still, clip, clip, still, clip, still, clip, clip],
  [still, clip, clip, still, clip, clip, still, clip, clip],
];

/**
 * How long a lane takes to travel its own width, and the two are deliberately
 * not the same number.
 *
 * Matched, the lanes would come back into phase every lap and the wall would
 * pulse. A ratio that does not divide keeps the two out of step, so a card
 * never sits under the same neighbour twice.
 */
const DURATIONS = [64, 79];

/** The card's rendered width at each step, for `next/image` to size against. */
const SIZES = "(min-width: 1024px) 198px, (min-width: 768px) 169px, 135px";

function PosterChip({ handle, avatar, verified }: Poster) {
  return (
    <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-1.5 p-2 md:gap-2 md:p-3">
      {/* The ring is the chip's whole outline. A profile picture dropped on a
          photograph with no edge of its own reads as part of the photograph,
          and at 20px there is no room for anything heavier than a hairline. */}
      <div className="relative size-5 shrink-0 overflow-hidden rounded-full ring-1 ring-white/70 md:size-6">
        <Image src={avatar} alt="" fill sizes="24px" className="object-cover" />
      </div>

      {/* Truncates rather than wraps: a handle long enough to take a second
          line would push the picture down the card, and the chip is a label on
          the story rather than a line of copy in it. */}
      <span className="font-body truncate text-xs leading-none font-semibold text-white md:text-sm">
        {handle}
      </span>

      {verified ? (
        <Icon
          name="verified"
          className="size-3 shrink-0 md:size-3.5"
          style={{ color: BADGE_BLUE }}
        />
      ) : null}
    </div>
  );
}

function StoryCard({ story, awake }: { story: Story; awake: boolean }) {
  const { handle, avatar, verified } = story;

  return (
    // 9:16, because that is what a story is — and what the clips already are,
    // 406x720 out of somebody's phone, so the card is the footage's own shape
    // and nothing is cropped to make it fit. The height is the card's and the
    // ratio sets the width, so a lane is sized by one number.
    <div className="bg-panel relative h-60 shrink-0 overflow-hidden md:h-75 lg:h-88">
      <div className="relative aspect-[9/16] h-full">
        {story.kind === "still" ? (
          // Empty alt throughout. One story out of eighteen is not content on
          // its own; the wall is labelled once, by the heading above it.
          <Image
            src={story.src}
            alt=""
            fill
            sizes={SIZES}
            className="object-cover"
          />
        ) : awake ? (
          // `preload="none"` on top of the mount gate: a browser that gets the
          // element a frame early still fetches nothing until it plays.
          //
          // The poster is what a card falls back to when it cannot have a
          // decoder. A wall of autoplaying clips runs out of those long before
          // it runs out of room, and a card that loses the draw should be a
          // frozen frame rather than a black hole.
          <video
            src={story.src}
            poster={story.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            className="size-full object-cover"
          />
        ) : (
          <Image
            src={story.poster}
            alt=""
            fill
            sizes={SIZES}
            className="object-cover"
          />
        )}

        {/* Under the chip and over the picture. A handle set straight on
            footage is legible until the frame it lands on turns bright, and
            these frames are somebody else's — a quarter of the card falling to
            nothing is what makes the chip readable on all of them. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/60 to-transparent"
        />

        <PosterChip handle={handle} avatar={avatar} verified={verified} />
      </div>
    </div>
  );
}

export function Stories() {
  const ref = useRef<HTMLDivElement>(null);

  /**
   * A fetch gate, not an entrance — which is why it is `useInView` directly
   * rather than the site's shared rule.
   *
   * `<video autoPlay>` is fetched and decoded the moment it is in the DOM,
   * wherever it is on the page: this block is the last thing on it, and left
   * ungated it would pull every clip while the reader is still on the header.
   * The flythrough makes the same argument about the same tag.
   *
   * One way only. The shared rule parks again once the block is off screen,
   * and a video torn down on the way past would refetch on the way back.
   */
  const awake = useInView(ref, { once: true, margin: "300px" });

  return (
    <Section spacing="lg" container={false}>
      <Container>
        <Kicker>Stories</Kicker>

        <LineRise
          as="h2"
          text="Stories from the night at K.B. Hallen."
          className="display-2 mt-6 max-w-[20ch] md:mt-8"
        />
      </Container>

      {/* 16px between cards, the gap the format grid puts between its panels —
          a story wall wants the density of a phone's own tray, not the 60px
          the sponsor marks stand apart at. */}
      <div ref={ref} className="mt-12 flex flex-col gap-4 md:mt-16">
        {lanes.map((lane, index) => (
          <Marquee
            key={index}
            className="w-full"
            durationSeconds={DURATIONS[index]}
            reverse={index % 2 === 1}
            gapClassName="gap-4 pe-4"
          >
            {lane.map((story, position) => (
              <StoryCard key={position} story={story} awake={awake} />
            ))}
          </Marquee>
        ))}
      </div>
    </Section>
  );
}
