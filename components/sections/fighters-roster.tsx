import Image from "next/image";

import { Section } from "@/components/layout/section";
import { CometCard } from "@/components/ui/comet-card";
import { Flag } from "@/components/ui/flag";
import { Icon } from "@/components/ui/icon";
import { Kicker } from "@/components/ui/kicker";
import { LineRise } from "@/components/ui/line-rise";
import { type Fighter, fighters } from "@/content/fighters";

/**
 * The KOMBA 1.0 roster.
 *
 * Almost no page furniture on purpose: an eyebrow, one word, and twelve
 * faces. Everything the page has to say that the grid cannot — which card
 * this is, and when — is in the eyebrow, so there is no paragraph competing
 * with the portraits for the top of the screen.
 *
 * The eyebrow is doing real work, not decoration. This is last year's card and
 * the site is between events; without the date on it the page reads as the
 * current roster.
 */

/** Two up, three, then four. 292px at the widest, on a 2:3 portrait. */
const SIZES =
  "(min-width: 1280px) 292px, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw";

/** The separator on the fight line, so its three parts cannot drift apart. */
function Dot() {
  return (
    <span aria-hidden="true" className="text-ink-400 mx-1.5">
      ·
    </span>
  );
}

function FighterCard({
  firstName,
  lastName,
  title,
  division,
  flags,
  record,
  instagram,
  imageSrc,
}: Fighter) {
  return (
    // Two boxes stacked, not one with the type laid over it: the photograph
    // stops at its own edge and the caption sits on the card's ink underneath.
    // There is no scrim between them because there is nothing to scrim — the
    // names are never on the picture.
    <article className="bg-panel flex h-full flex-col">
      {/* 6px of the card's own ink on three sides, so the photograph reads as
          mounted on the card rather than as the card's own top edge. Nothing
          at the bottom — the caption is the frame on that side.

          The photograph's notch is 4px shallower than the panel's, which is
          what holds the mount even around the corner: two parallel 45 degree
          cuts 4px apart in notch size sit 4/√2 = 5.7px apart, against the 6px
          the straight edges carry. Matching the notches would open the
          diagonal to 8.5px and the mount would read wider at the corner than
          anywhere else.

          Its own wrapper rather than padding on the box below: an absolutely
          positioned child fills its containing block's padding box, so `fill`
          would step straight over padding set there. */}
      <div className="p-1.5 pb-0">
        {/* 4:5 off a 2:3 source — every file is 1200x1800 — so the box keeps
            five sixths of the frame's height. Held to the top, not centred:
            the portraits are shot standing with headroom, and a centred crop
            spends that sixth on the headroom and takes the feet with it. */}
        <div className="corner-notch relative aspect-[4/5] [--corner-notch:16px] md:[--corner-notch:28px]">
          <Image
            src={imageSrc}
            alt=""
            fill
            sizes={SIZES}
            className="object-cover object-top"
          />
        </div>
      </div>

      <div className="p-3 md:p-4">
        {/* The belt, over the name — a label for who this is rather than a
            subtitle under it.

            A step under the fight line below it and told apart from both by the
            violet, the caps and the tracking. It is a label rather than a fact
            about the fight, so it is the one line in the block that is not set
            at the body size.

            `text-chrome-violet` and the same brightness-125 the eyebrow wears,
            so the two violets on the site are one violet. A plain string rather
            than `cn` — tailwind-merge eats custom `text-*` utilities, see
            CLAUDE.md.

            Everyone on the list as it stands has a belt, but the line is held
            open rather than dropped for anyone who does not: without it their
            name would ride up and sit a line above everyone else's on the row.
            A hard space rather than a min-height, so an empty line is measured
            off the same type as a full one and the two cannot come out a
            fraction apart.

            The height is held, and that is the whole cost of putting this back
            on top. Under the name it could wrap freely; over it, a title that
            takes two lines pushes its own name down and out of step with its
            neighbours' across the row, which is why it was moved under in the
            first place.

            So the room is reserved rather than the text cut — a clipped belt
            reading UNITE WORLD CHAMPI is worse than either. Two line boxes
            below md and one from md, because that is where the measurements
            fall: at 375 the cards are 164px and four of the thirteen wrap —
            2021 WORLD CHAMPION, UNITE WORLD CHAMPION and both EUROPEAN
            CHAMPIONs — while from 768 the cards are 224px and none of them do.
            36px and 20px are the line boxes this type already makes, measured,
            not padding picked to look right.

            The reserve sits above the type, not below it — the box is a column
            and the text is pushed to the end of it. Held at the top instead, a
            one-line belt on a phone left 16px of nothing between itself and the
            name while the two-line card beside it had none, and the two cards
            read as differently spaced rather than as the same card. Pushed
            down, every belt sits the same 12px off its own name and the spare
            line falls under the photograph, where extra room reads as room. */}
        <p className="text-chrome-violet font-body flex h-9 flex-col justify-end overflow-hidden text-sm font-medium tracking-[0.08em] uppercase brightness-125 md:h-5">
          {title ?? "\u00A0"}
        </p>

        {/* h2, not h3: these are the page's content under its one h1, and the
            plain register keeps a wall of names from shouting at once.

            The spacing runs the other way now — 12px up to the belt, 6px down
            to the fight line. The belt is a label over the block and the
            division is a fact about the person named, so the name binds
            downward and the label stands off above it.

            The flag rides the name rather than the line below. It says where
            this person is from, which is a fact about them and not about the
            fight — and beside the division it read as a third item in a list of
            match details.

            Inline, in the text flow, rather than a flex item: beside a name
            long enough to break it would centre itself against the two-line
            block and float away from the word it belongs to.

            12x16 rather than the 9x12 the fight line carried: this line is set
            half again as large, and a flag sized to the smaller one sits under
            the caps beside it. inline-block because the base rule makes every
            svg on the site a block, and align-middle hangs it off the x-height,
            which is what the nudge corrects.

            More than one where a fighter holds more than one — Ceran is Danish
            and Turkish. 8px off the name and 4px between themselves, so a pair
            reads as one group belonging to the name rather than as two marks
            equally far from it and from each other.

            The margins do the spacing and there is no space character in front
            of them, which also means the browser has nowhere to break: a flag
            cannot end up stranded on a line of its own under the name it
            belongs to.

            Flown only where the site already states a nationality: a surname is
            not a passport, and guessing one for a named person is worse than
            flying no flag at all. */}
        <h2 className="plain-6 mt-3">
          {firstName} {lastName}
          {flags?.map((code, index) => (
            <Flag
              key={code}
              code={code}
              className={`inline-block h-3 w-4 -translate-y-0.5 align-middle ${index === 0 ? "ml-2" : "ml-1"}`}
            />
          ))}
        </h2>

        {/* Division and record on one line — the two facts about the fight,
            with the flag gone up to the name where the fact about the person
            belongs. Stacked they would push the handle off the bottom of the
            card on a phone.

            Text flow, not a flex row. "Super middleweight" wraps at two cards
            to the row on a phone, and as a flex item the dot then centred
            itself against a two-line block and floated away from the word it
            belongs to. Inline, it wraps with it.

            The record is held together with its own separator so a break can
            fall before the dot but never after it. */}
        <p className="text-ink-200 mt-1.5 text-base">
          {division}
          {record ? (
            <span className="whitespace-nowrap">
              <Dot />
              {record.w}-{record.l}-{record.d}
            </span>
          ) : null}
        </p>

        {instagram ? (
          <a
            href={`https://instagram.com/${instagram}`}
            target="_blank"
            rel="noreferrer"
            className="text-ink-300 mt-3 inline-flex items-center gap-1 text-sm transition-colors hover:text-white"
          >
            {/* Material has no brand marks, so this is the at rather than the
                Instagram glyph — the handle beside it is what names the
                place. Swapping in the real mark is one path if the brand
                recognition is worth breaking the icon rule for. */}
            <Icon name="alternate_email" className="size-4" />
            {instagram}
          </a>
        ) : null}
      </div>
    </article>
  );
}

export function FightersRoster() {
  return (
    // The top padding is clearance, not rhythm: the nav pill floats over this
    // page and comes to about 76px, which the section's own spacing does not
    // clear on a phone.
    <Section spacing="lg" className="pt-32 md:pt-40">
      <div className="flex flex-col items-start">
        {/* Two words, and it stays two. The bracket glyphs are a fixed 22px
            centred on the row, so a label long enough to wrap at phone widths
            leaves them floating short at both ends. */}
        <Kicker>1.0 selection</Kicker>

        <LineRise as="h1" text="Athletes" className="display-2 mt-6 md:mt-8" />
      </div>

      {/* A list, because that is what it is. Each card lifts and leans out of
          its own cell, so the cell is given a stacking order to lift into —
          without it the card would still be painted under every sibling that
          comes after it in the grid. */}
      <ul className="mt-12 grid grid-cols-2 gap-4 md:mt-16 md:grid-cols-3 lg:grid-cols-4">
        {fighters.map((fighter) => (
          <li key={fighter.id} className="relative hover:z-10">
            {/* The notch goes on the comet card's own moving box, not on the
                panel inside it: the glare sheet is a sibling of the panel, so
                a clip on the panel alone leaves the glare painting a lit
                triangle over the corner that was cut away. Clipped here, the
                cut takes the panel and the glare together — and scales with
                the card on hover, which it would not from the outer box. */}
            <CometCard cardClassName="corner-notch [--corner-notch:20px] md:[--corner-notch:32px]">
              <FighterCard {...fighter} />
            </CometCard>
          </li>
        ))}
      </ul>
    </Section>
  );
}
