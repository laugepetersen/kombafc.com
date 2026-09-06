import Image from "next/image";
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { LineRise } from "@/components/ui/line-rise";
import { OutletMark } from "@/components/ui/outlet-mark";
import { type Coverage, formatDate, type NewsItem, news } from "@/content/news";

/**
 * The feed.
 *
 * One heading and a ruled list, on the reading column rather than the full
 * 1280 — this is a page of prose, not a grid, and eighteen headlines set across
 * the wide column were eighteen lines the eye had to travel back across. There
 * was an eyebrow, a paragraph of introduction, a wall of outlet marks and two
 * subheads over the list; all of it is gone. What is left is what a reader came
 * for.
 *
 * Every row links to our own page for the piece, not straight out to the
 * outlet. That is deliberate and it is the whole reason the detail pages exist:
 * a card that jumps a reader off kombafc.com on the first click has spent the
 * coverage rather than banked it. The link out is on the detail page, once,
 * where it is the only call to action on the screen.
 */

/** 128px on a phone, 208 from md. Both on the grid, both under the column. */
const THUMB_SIZES = "(min-width: 768px) 208px, 128px";

function Thumbnail({ item }: { item: NewsItem }) {
  if (!item.thumbnail) return null;

  return (
    // The crop is the row's, not the picture's. These arrive at every ratio
    // there is — a 16:9 broadcast still, a 468x263 crop, a portrait phone frame
    // off a reel — and a box that changed shape per item would leave the column
    // of headlines beside it stepping in and out.
    //
    // shrink-0 because it is a flex item next to a text block that will happily
    // take the whole row: without it a long headline squeezes the picture and
    // every row's image is a different width.
    <div className="corner-notch bg-ink-800 relative aspect-[16/10] w-32 shrink-0 overflow-hidden [--corner-notch:10px] md:w-52 md:[--corner-notch:12px]">
      <Image
        src={item.thumbnail.src}
        alt=""
        fill
        sizes={THUMB_SIZES}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
    </div>
  );
}

/**
 * Outlet, writer and date on one line, in that order.
 *
 * It used to be two: a label and a date in a margin column, and the credit
 * under the summary. The label is gone — "Interview" over an interview is the
 * page telling the reader what they can already see — and with it the reason
 * for a margin at all, so the date joined the credit it belongs with. One line
 * of small type under each entry, which is what a press list is.
 */
function Credit({ item }: { item: Coverage }) {
  return (
    <p className="text-ink-300 font-body mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
      {/* The mark, and not the mark plus the name. Both said the same thing
          twice in the same line — a logo is a name already drawn, and setting
          it again in words beside it is the row explaining its own picture.
          The mark wins because with five outlets in one list, a reader picks
          the publication out of a wall of small type by shape long before they
          read it.

          `titled={false}` is what makes that safe rather than just tidy: the
          mark is now the only place the outlet is named, so the image has to
          carry the name as its alt text instead of being decorative beside a
          label that no longer exists. */}
      <OutletMark
        outlet={item.outlet}
        height={13}
        titled={false}
        className="opacity-70 transition-opacity group-hover:opacity-100"
      />
      {/* The mark is one item in the line, so it takes a separator after it
          like any other. It was set off on the gap alone for a moment on the
          theory that a dot hanging off a logo reads as part of it; the line is
          a list of three things and the dot is what says so. */}
      {item.byline ? (
        <>
          <span aria-hidden="true">·</span>
          <span>{item.byline}</span>
        </>
      ) : null}
      {item.published ? (
        <>
          <span aria-hidden="true">·</span>
          <time dateTime={item.published}>{formatDate(item.published)}</time>
        </>
      ) : null}
    </p>
  );
}

function Row({ item }: { item: NewsItem }) {
  return (
    // No `tap`. That utility is for a control — it presses, and a row of type
    // this long shrinking under a finger reads as the page flinching rather
    // than as a link being taken. The row answers with the rule under the
    // headline and the crop breathing behind it.
    <Link
      href={`/news/${item.slug}`}
      className="group border-rule flex items-start gap-4 border-t py-6 md:gap-6 md:py-8"
    >
      <Thumbnail item={item} />

      <div className="min-w-0">
        {/* h2 straight under the page's h1 — there is no tier between them any
            more. Plain rather than display: a column of eighteen italic
            uppercase headings is a wall, and these are other people's pieces
            being reported, not our own shouting.

            The underline is drawn rather than set, and it is on a span inside
            the heading rather than on the heading itself. Three reasons, in the
            order they were found. `underline` puts the rule at the font's own
            baseline offset, which on this face is close enough to the
            descenders to cut through them — a background gradient sized to one
            pixel and pinned to the bottom of a 2px pad clears them. The h2 is a
            block filling the column, so painted there the rule ran the whole
            width and carried on well past the end of the words; on an inline
            span it stops where the text does. And `box-decoration-clone` gives
            each line fragment of a wrapped headline its own box, so a title
            that breaks gets a rule under both lines rather than one rule under
            the block.

            0% to 100% of that box, so it wipes in from the left on the same
            300ms the crop behind it takes. */}
        <h2 className="plain-5">
          <span className="bg-[linear-gradient(currentColor,currentColor)] box-decoration-clone bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat pb-0.5 transition-[background-size] duration-300 ease-out group-hover:bg-[length:100%_1px]">
            {item.title}
          </span>
        </h2>

        {/* 16px, not 8. The headline carries a hover rule 2px under its
            baseline, so at mt-2 the summary was 10px off a line that only
            appears half the time — close enough to read as the second line of
            the headline when the rule was not there, and crowded by it when it
            was. At 16 the two are plainly a heading and a standfirst, and the
            credit's 10px underneath binds itself to the summary rather than
            floating between the three. */}
        <p className="text-ink-200 mt-4 text-sm md:text-base">{item.summary}</p>

        {item.kind === "coverage" ? (
          <Credit item={item} />
        ) : (
          <p className="text-ink-300 font-body mt-2.5 text-sm">
            <span className="text-ink-100">KOMBA FC</span>
            {item.published ? (
              <>
                <span aria-hidden="true" className="mx-2">
                  ·
                </span>
                <time dateTime={item.published}>
                  {formatDate(item.published)}
                </time>
              </>
            ) : null}
          </p>
        )}
      </div>
    </Link>
  );
}

export function NewsIndex() {
  return (
    // Clearance for the floating nav pill, same as the roster page.
    <Section spacing="lg" container="narrow" className="pt-32 md:pt-40">
      <LineRise as="h1" text="News" className="display-2" />

      {/* Rows draw their own top edge and nothing else. The list used to close
          itself with a rule underneath the last one, which boxed the run — and
          a box is what a table wants, not a feed. Open at the bottom, the last
          entry reads as the end of the list rather than as the last cell in
          something. */}
      <ul className="mt-10 md:mt-12">
        {news.map((item) => (
          <li key={item.slug}>
            <Row item={item} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
