import Image from "next/image";
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { LineRise } from "@/components/ui/line-rise";
import { OutletMark } from "@/components/ui/outlet-mark";
import {
  type Coverage,
  formatDate,
  type NewsItem,
  outlets,
} from "@/content/news";

/**
 * One item from the feed, at its own address.
 *
 * For a piece somebody else wrote, this page is a pointer with manners. It
 * says what the article is about in our words, credits the outlet and the
 * writer three times over, quotes at most one line, and then sends the reader
 * to them. It never carries the article. The reasoning is in content/news.ts
 * and it is not a style preference — a page that reprints a journalist's work
 * is both an infringement and a good way to lose the next piece of coverage.
 *
 * So the page is built to give the click away. The one button on it goes
 * off-site, and the source card it sits in is the widest, brightest thing
 * below the headline.
 *
 * Set narrow. This is the only reading page on the site — everything else is a
 * grid or a poster — and 800px is where a paragraph stops being a line the eye
 * has to travel back across.
 */

/** The lead photograph, where the outlet nominated one. */
function Lead({ item }: { item: NewsItem }) {
  if (!item.thumbnail) return null;

  return (
    <figure className="mt-8 md:mt-10">
      {/* Full width of the reading column, on one ratio for every item.
          Sixteen by nine because that is what most of them already are — both
          TV 2 stills, all four DR crops — so the frame the page draws is the
          frame four of the five outlets shot, and only the 3:2 files give up a
          tenth of their height to it.

          It was the picture's own ratio before, height-capped and centred. That
          respected each file and cost the page its edge: eleven articles opened
          on eleven differently shaped boxes, none of them lining up with the
          column their words were set in.

          The cost lands on one item — a 640x1136 frame off a vertical reel,
          which a centre crop takes the middle band of. Worth it against ten
          that gain, and the fix if it ever needs one is a focal point on the
          thumbnail rather than a second shape on the page.

          Four square corners. The chamfer is a card treatment — it says the
          thing wearing it is an object on the page — and a lead photograph is
          not an object on the page, it is the top of the article. */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={item.thumbnail.src}
          alt=""
          fill
          sizes="(min-width: 800px) 800px, 100vw"
          className="object-cover"
        />
      </div>
      {/* Credited under the frame rather than only in the card below, because a
          photograph is the one thing on this page a reader might take for ours
          if nothing beside it says otherwise — and on eight of these it *is*
          ours, standing in for an outlet whose CDN will not serve one. So the
          credit comes off the picture rather than off the article's outlet;
          read the wrong one and the page hands a publication a photograph it
          never shot. */}
      <figcaption className="text-ink-300 font-body mt-3 text-xs tracking-[0.02em]">
        Photograph: {item.thumbnail.credit}
      </figcaption>
    </figure>
  );
}

/**
 * The hand-off. Coverage only; a post has no source.
 *
 * The picture, then three things: whose mark is on it, what they called it, and
 * the way out. It has been a five-row stack 660px tall and a centred block
 * after that; this is the same information laid out the way every other row on
 * this site is — crop on the left, type on the right, aligned to the column the
 * article was read in.
 *
 * Everything that was not one of those three is gone. The byline and the date
 * are printed under the headline at the top of this page and again in the feed
 * that led here; a third setting of them in the closing block was the page
 * repeating itself at the moment it should be handing over. "Published by" went
 * the same way — it labelled a logo, and a logo is a label.
 *
 * Four square corners. The chamfer is a card treatment and this is not really a
 * card any more; it is the row the article came from, closing it.
 */
function SourceCard({ item }: { item: Coverage }) {
  const outlet = outlets[item.outlet];

  return (
    // 6px of the panel's own ink around the photograph, the fighter cards'
    // mount, so the picture reads as set into the block rather than as the
    // block's own left edge. Here it runs on three sides and the copy is the
    // frame on the fourth — the same trick turned ninety degrees.
    //
    // items-stretch, so the crop is as tall as whatever the type beside it
    // comes to. That is the whole layout: the copy sets the height, the picture
    // takes it, and its width falls out of the ratio.
    <aside className="bg-panel mt-12 flex flex-col p-1.5 md:mt-16 md:flex-row md:items-stretch">
      {item.thumbnail ? (
        // From md: height comes from the stretch, the width is set, and the
        // crop fills whatever that comes to.
        //
        // The obvious version of that — an aspect-ratio box with no width, so
        // the ratio resolves it off the height — does not work here and cannot.
        // A flex item's base size is computed from `width: auto` *before* the
        // stretch gives it a height, so the ratio has nothing to divide and the
        // box lays out at zero. Measured: 0 wide, 210 tall. Two numbers, one of
        // them fixed, is the only way round it in one pass.
        //
        // Below md the row stacks and the picture takes the full width on its
        // own ratio. It has to: at 375 the crop was 160 of the 343, which left
        // the button 150px to sit in and it does not fit in 150px — the label
        // was cut off at both ends. There is no width that works for both a
        // picture and a 260px button on a phone, so the two stop sharing a row.
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden md:aspect-auto md:w-56">
          <Image
            src={item.thumbnail.src}
            alt=""
            fill
            sizes="(min-width: 768px) 224px, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      {/* The copy's own padding is what holds it off the picture and off the
          three edges the mount does not reach. min-w-0 so a long Danish
          headline wraps inside its share of the row rather than pushing the
          crop off the left of it. */}
      <div className="min-w-0 px-5 py-4 md:px-6 md:py-5">
        {/* The mark alone. It was captioned "Published by", which is a caption
            explaining a logo to somebody who can see the logo. */}
        <OutletMark outlet={item.outlet} height={16} titled={false} />

        {/* Their headline, verbatim and in their own language, inside quotation
            marks and marked up as a citation. Set in the body face rather than
            the display one: this is somebody else's line being reported, and
            putting it in KOMBA's own italic uppercase would be wearing it.

            Pure white and a step up the scale — with the byline and the date
            gone it is the only sentence in the block, so it can carry the size
            the block used to spread across five rows. */}
        <blockquote cite={item.sourceUrl} className="mt-3">
          <p className="plain-5 text-white">“{item.sourceHeadline}”</p>
        </blockquote>

        {/* The page's only button, and it leaves. `noreferrer` would strip the
            referrer off a click we actually want the outlet to see in their
            analytics, so this one carries `noopener` alone.

            Label and icon share an inline-flex of their own rather than sitting
            as two children of the button. Button wraps whatever it is given in
            a single `relative` span, and the site's base rule makes every svg a
            block — so an icon dropped in beside the words breaks to its own
            line inside that span. Measured: the arrow sat under the label. */}
        <Button
          href={item.sourceUrl}
          target="_blank"
          rel="noopener"
          className="mt-5"
        >
          <span className="inline-flex items-center gap-2">
            Read it at {outlet.name}
            <Icon name="arrow_outward" className="size-5" />
          </span>
        </Button>
      </div>
    </aside>
  );
}

export function NewsArticle({ item }: { item: NewsItem }) {
  const isCoverage = item.kind === "coverage";

  return (
    <Section spacing="lg" container="narrow" className="pt-32 md:pt-40">
      {/* Back before forward. The feed is the only way anyone reached this
          page, and on a phone the browser's own control is a gesture rather
          than a target. */}
      <Link
        href="/news"
        className="tap text-ink-300 font-body inline-flex items-center gap-1.5 text-sm hover:text-white"
      >
        <Icon name="arrow_outward" className="size-4 -rotate-135" />
        All news
      </Link>

      {/* Our headline, not theirs — this is our page and it is written in our
          language. Theirs is quoted in full further down, where the credit
          belongs.

          No eyebrow over it. It carried the piece's own label — Gallery,
          Profile, Interview — which is a word for something the headline and
          the summary under it have already said, set in the loudest colour on
          the page to say it.

          Not inside a StaggerReveal any more. That wrapper fades and lifts each
          child as a block, and a block fade over a heading that is already
          revealing itself a line at a time buries the reveal underneath it —
          both fire off the same viewport boundary, so the lines were rising
          behind an opacity ramp that had not finished. LineRise owns the
          entrance now, which is what it is for. */}
      <div className="mt-8 flex flex-col items-start">
        <LineRise as="h1" text={item.title} className="display-3" />

        <p className="text-ink-300 font-body mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          {isCoverage ? (
            <>
              <span className="text-ink-100">{outlets[item.outlet].name}</span>
              {item.published ? <span aria-hidden="true">·</span> : null}
            </>
          ) : null}
          {item.published ? (
            <time dateTime={item.published}>{formatDate(item.published)}</time>
          ) : null}
        </p>
      </div>

      <Lead item={item} />

      {/* Our account. `space-y` rather than a margin on the paragraph, so the
          rhythm belongs to the column and a single-paragraph item cannot end up
          with a trailing gap.

          No rule above it any more. It was drawn to separate the heading from
          the body when there was nothing between them; with a full-width
          picture and its credit sitting in that gap, a hairline underneath was
          a second divider under something already divided. */}
      <div className="mt-8 space-y-5 text-base md:mt-10 md:text-lg">
        {item.body.map((paragraph) => (
          <p key={paragraph} className="text-ink-100">
            {paragraph}
          </p>
        ))}
      </div>

      {/* One line of theirs, with the speaker named. The rule down the left is
          the only decoration it gets — a pull quote set in the display face
          would compete with the h1 for the page. */}
      {isCoverage && item.pullQuote ? (
        <figure className="mt-10 border-l-2 border-violet-500/60 pl-6 md:mt-12">
          <blockquote className="plain-5 text-white">
            “{item.pullQuote.text}”
          </blockquote>
          <figcaption className="text-ink-300 font-body mt-3 text-sm">
            {item.pullQuote.speaker}
          </figcaption>
        </figure>
      ) : null}

      {isCoverage ? <SourceCard item={item} /> : null}
    </Section>
  );
}
