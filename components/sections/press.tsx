import Image from "next/image";
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Kicker } from "@/components/ui/kicker";
import { LineRise } from "@/components/ui/line-rise";
import { OutletMark } from "@/components/ui/outlet-mark";
import {
  type Coverage,
  formatDate,
  news,
  type OutletId,
  outlets,
} from "@/content/news";

/**
 * Somebody else saying it.
 *
 * Everything above this block is KOMBA making claims about KOMBA, which is
 * what an About page is for and also its whole weakness. This is the answer to
 * it, and it costs nothing to build because the work is already done: the news
 * page carries eighteen pieces, sourced article by article, and this is three
 * of them plus the wall of marks.
 *
 * Three, and picked rather than sliced off the top of the list. Two on the
 * founder and one on the show is the same balance the page itself strikes —
 * and it is the founder pieces that do the work here, because they are the
 * ones that predate the promotion. A press wall of coverage *of your own
 * launch* proves you sent out a press release. One that goes back four years
 * proves the man behind it was already worth writing about.
 *
 * Every row links to our page for the piece rather than out to the outlet,
 * which is the rule `components/sections/news-index.tsx` sets and the reason
 * the detail pages exist at all.
 */

/**
 * The three, by slug, in the order they should read: the profile that explains
 * him, the piece about the job he does when he is not fighting, and the night
 * itself.
 *
 * By slug rather than by index, so re-ordering the feed cannot silently change
 * what this block shows.
 */
const FEATURED = [
  "from-a-knife-to-a-world-title",
  "world-champion-and-pedagogue",
  "the-gallery-from-komba-1-0",
] as const;

/**
 * The wall, in the order the marks sit best rather than the order the object
 * declares them: two wordmarks, the roundel, then the two short ones. `OutletId`
 * keeps it honest — a renamed outlet is a type error here rather than a blank
 * space on the page.
 */
const wall: OutletId[] = [
  "dr",
  "tv2-echo",
  "fighting-dk",
  "kbhallen",
  "presse-fotos",
];

/** A third of the 1280 column less its share of two 16px gaps. */
const SIZES = "(min-width: 1280px) 416px, (min-width: 768px) 33vw, 100vw";

function featured(): Coverage[] {
  return FEATURED.map((slug) => {
    const item = news.find((entry) => entry.slug === slug);
    // Narrowed rather than asserted: the three picked are all coverage, and a
    // slug edited to point at one of our own posts should drop out of the wall
    // rather than render a card with no outlet on it.
    return item?.kind === "coverage" ? item : undefined;
  }).filter((item): item is Coverage => item !== undefined);
}

function PressCard({ item }: { item: Coverage }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      // No `tap`. A card this size shrinking under a finger reads as the page
      // flinching; the crop breathing behind the mark is the answer instead,
      // which is what the news index does too.
      className="group flex flex-col"
    >
      <div className="bg-panel relative aspect-[16/10] overflow-hidden">
        {item.thumbnail ? (
          <Image
            src={item.thumbnail.src}
            alt=""
            fill
            sizes={SIZES}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : null}
      </div>

      {/* The mark is the loudest thing under the picture, at the size a credit
          is set at rather than at a logo's. `titled={false}` because there is
          no outlet name in words anywhere on this card — the mark has to carry
          it as alt text or a screen reader gets an unattributed headline. */}
      <div className="mt-4 flex items-center gap-3">
        <OutletMark
          outlet={item.outlet}
          height={14}
          titled={false}
          className="opacity-70 transition-opacity group-hover:opacity-100"
        />
        {item.published ? (
          <>
            <span aria-hidden="true" className="text-ink-400 text-sm">
              ·
            </span>
            <time
              dateTime={item.published}
              className="text-ink-300 font-body text-sm"
            >
              {formatDate(item.published)}
            </time>
          </>
        ) : null}
      </div>

      {/* Our headline, not theirs. Their own is on the detail page, verbatim
          and in their language, which is where a citation belongs. */}
      <h3 className="plain-6 mt-2 text-white">
        {/* The news index's underline, verbatim — a background gradient drawn
            under the line rather than `underline`, on a span inside the heading
            rather than on the heading itself. The reasons are written out over
            there and all three still apply here: the rule clears the
            descenders, `box-decoration-clone` draws it on every line of a
            headline that wraps, and it can be grown from nothing. Two rows on
            one site that underline on hover should underline the same way. */}
        <span className="bg-[linear-gradient(currentColor,currentColor)] box-decoration-clone bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat pb-0.5 transition-[background-size] duration-300 ease-out group-hover:bg-[length:100%_1px]">
          {item.title}
        </span>
      </h3>

      <p className="text-ink-200 mt-2 max-w-[42ch] text-sm leading-[1.4]">
        {item.summary}
      </p>
    </Link>
  );
}

export function Press() {
  const items = featured();

  return (
    <Section spacing="lg" className="border-rule border-t">
      <div className="flex flex-col">
        <Kicker>In the press</Kicker>

        <LineRise
          as="h2"
          text="Not our word for it."
          className="display-2 mt-6 md:mt-8"
        />

        <p className="text-ink-200 mt-6 max-w-[54ch] text-base leading-[1.5] md:mt-8">
          DR and TV 2 were writing about Youssef Assouik years before there was
          a promotion to write about, and the Danish fight press covered every
          bout of KOMBA 1.0 from the apron. Their pieces, credited and linked,
          are on the news page.
        </p>
      </div>

      {/* The wall. Height-matched with each mark's own optical correction —
          see the note in `OutletMark` — and dimmed at rest so a row of five
          logos does not outshine the heading above it. */}
      <ul className="border-rule mt-10 flex flex-wrap items-center gap-x-10 gap-y-6 border-y py-8 md:mt-12 md:gap-x-16 md:py-10">
        {wall.map((id) => (
          <li key={id}>
            <a
              href={outlets[id].home}
              target="_blank"
              rel="noreferrer"
              className="block opacity-60 transition-opacity hover:opacity-100"
            >
              <OutletMark outlet={id} height={22} titled={false} />
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-3 md:gap-6 lg:gap-8">
        {items.map((item) => (
          <PressCard key={item.slug} item={item} />
        ))}
      </div>

      <div className="mt-12 md:mt-16">
        <Button href="/news" variant="outline-white">
          All coverage
        </Button>
      </div>
    </Section>
  );
}
