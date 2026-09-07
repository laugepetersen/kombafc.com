import Image from "next/image";
import { Fragment, type ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { HoldBackdrop } from "@/components/sections/hold-backdrop";
import { Kicker } from "@/components/ui/kicker";
import { LineRise } from "@/components/ui/line-rise";
import { NotifyForm } from "@/components/ui/notify-form";

/**
 * A page while there is nothing to put on it.
 *
 * Six routes are written into the menu and none of them have anything to show
 * yet — events, the pass, the shop, watch, about, contact. The choice was one
 * shell wearing six sets of words or six pages that look nearly alike, and
 * nearly alike is the worse of the two: a reader who opens two of them learns
 * that the site is unfinished in six separate ways rather than in one.
 *
 * So it is a shell. Everything that differs is a string.
 *
 * A hold page with nothing of its own to show, so it shows the last thing
 * there was: the gallery from the home page, parked at a single frame and
 * drifting with the pointer. It had a built backdrop before — a violet bloom,
 * the dot field and a wash over both — which was depth stood in for on a page
 * that had none.
 *
 * One viewport tall, with the footer under it.
 *
 * A floor rather than a fixed height, though. Pin it to the viewport and any
 * short window — a phone on its side, a laptop under a bookmarks bar and a
 * dock — gets a centred stack taller than the box it is centred in, which
 * overflows in both directions at once and is then cut off by the clip this
 * needs for its backdrop. Given a floor it stays exactly one screen wherever
 * it fits and grows where it does not.
 *
 * dvh, not vh, so collapsing browser chrome does not resize it mid-scroll.
 */
type HoldPageProps = {
  /** The bracketed eyebrow. One word, or two — it decrypts on arrival. */
  kicker: string;
  /**
   * Two or three, and the tuple says so rather than a comment asking for it.
   *
   * Exactly one of them is set largest and carries the sentence the page is
   * about; the rest are set small around it. At three that is the middle —
   * setup, statement, promise. At two the statement leads and the promise
   * follows, because a small line sitting alone above a large one reads as a
   * word that got away rather than as a setup for it.
   *
   * Two is not a lesser version of three. Some of these pages only have the
   * one thing to say and a padding line in front of it costs the page its
   * nerve — which is why the tuple widened rather than the third slot going
   * optional-with-a-default.
   *
   * Not `children`, because the sizes are the shell's decision and not the
   * page's — hand a route the markup and six of them drift apart on the one
   * thing they most need to share.
   */
  lines: readonly [string, string] | readonly [string, string, string];
  /**
   * A still to hold behind this page instead of the show gallery.
   *
   * Optional, and the default is the gallery on purpose — the whole argument
   * for one shell is that six unfinished pages should read as one unfinished
   * site rather than six. A page only takes its own backdrop when it has a
   * picture of the thing it is holding, which is a better answer than the
   * archive to "what is coming". The pass has one; the other five do not.
   */
  image?: { src: string; alt: string };
} & (
  | {
      /**
       * Which page this signup came from, so the list can be read back as
       * interest in a thing rather than as one pile. Required, and the union
       * is what makes it so: a page that forgets it does not fall back to
       * something plausible, it fails to compile. The fallback would have been
       * the form's own default of "footer", and a shop signup filed under
       * `footer` is worse than no label at all — it is a wrong one, and
       * nothing downstream could tell.
       */
      source: string;
      children?: never;
    }
  | {
      source?: never;
      /**
       * What to do about it, when it is not the signup form. Contact is the
       * one — somebody who opened it wants to reach a person now, and being
       * told they will be emailed later is not an answer.
       */
      children: ReactNode;
    }
);

/**
 * Which line carries the sentence. The middle of three, the first of two — see
 * the note on `lines`.
 */
function heroLine(lines: HoldPageProps["lines"]) {
  return lines.length === 3 ? 1 : 0;
}

export function HoldPage({
  kicker,
  lines,
  image,
  source,
  children,
}: HoldPageProps) {
  return (
    <section className="relative flex min-h-dvh flex-col overflow-clip">
      {image ? (
        /* A still of the thing the page is holding, filling the frame at every
           width.

           It was contained below md, on the argument that covering a 375x812
           window with a 16:9 render scales it past four times the width of the
           screen — so a phone got a fragment of the card, magnified. True, and
           the wrong trade: contained, the picture arrives as a band across the
           middle of a mostly empty page and stops being a backdrop at all. It
           is a backdrop, so it covers, and the crop is the price. Lauge's call.

           `priority`: it is the largest thing above the fold on a page with
           almost nothing else on it, so leaving it to lazy-load spends the
           first paint on an empty screen. */
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        /* The show gallery, parked. The home page flies the length of it on
           scroll; this is one frame of that held still, and the only thing it
           still does is drift with the pointer.

           It replaced a bloom, a dot field and a wash over both — three built
           layers standing in for depth on a page that had none. There is real
           depth in the archive, and a hold page whose whole job is to say the
           next thing is coming is better served by the last one. */
        <HoldBackdrop />
      )}

      {/* The dark the copy sits on. It has to hold the heading legible against
          whatever card happens to be under it and no more than that — at
          100/85/55 it was doing far more, and a backdrop nobody can see is a
          backdrop not worth loading twenty-nine photographs for. Pulled back
          to two thirds at the top, where the type is, and a third at the foot,
          where there is nothing to read and the pictures can come through.

          A still gets a heavier, flatter wash than the gallery does. The
          gallery is twenty-nine dim photographs and the scrim only has to keep
          the type off them; a single render is lit for its own subject and
          arrives far brighter than any of them, with the brightest part dead
          centre where the heading goes. Same shape, more of it. */}
      <div
        aria-hidden="true"
        className={
          image
            ? "from-void/85 via-void/70 to-void/55 pointer-events-none absolute inset-0 bg-gradient-to-b"
            : "from-void/65 via-void/45 to-void/30 pointer-events-none absolute inset-0 bg-gradient-to-b"
        }
      />

      {/* A second pass on a still, and only there: the card in the render
          carries its own violet bloom, which the flat wash above thins evenly
          without touching the fact that the middle of the frame is the bright
          part. This darkens from the centre out, so the glow sits behind the
          copy rather than competing with it. */}
      {image ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgb(5 5 8 / 0.55) 0%, transparent 100%)",
          }}
        />
      ) : null}

      {/* The padding is not rhythm, it is clearance: the nav pill floats over
          this page and comes to about 76px, so nothing may be centred into the
          top of the frame without it. Which is why it is not symmetric — the
          obstruction is at the top only, and matching it at the bottom costs
          another 112px of height on a page whose whole ambition is to fit in
          one screen. Roughly 50px of laptop reclaimed for nothing given up. */}
      {/* `pointer-events-none`, with it handed back to the one thing in here
          anybody clicks. The gallery listens for pointer moves on its own root
          and that root is a *sibling* underneath this column, not an ancestor
          of it — pointer events bubble up, never sideways, so anything the
          column swallows the backdrop never hears about. Which was the whole
          screen, and the parallax was dead everywhere but the margins. The
          header does the same thing for the same reason: see the note on the
          bar there. */}
      <Container className="pointer-events-none relative flex flex-1 flex-col items-center justify-center pt-24 pb-16 text-center md:pt-28 md:pb-20">
        <Kicker>{kicker}</Kicker>

        {/* Same beat as the home hero — short, long, short at three lines, and
            long, short at two — and now the same step, display-1, rather than
            one below it.

            The step down was deliberate once: the front page was meant to keep
            the largest type on the site. It cost more than it bought. An h1 is
            the page's title and there was no rule saying what one takes, so
            the site had grown three answers to that question — display-1 here,
            display-2 on five routes, display-3 on an article — and a reader
            moving between them met a different-sized title each time for no
            reason they could see. The front page is still the front page; it
            has a hero, a film and three sentences to say it with.

            And, like the hero, level below sm: the beat is a display effect
            and a 375px screen has no room to play it. Every line at text-xl,
            which the longest of them — "There is no front desk." at 281px —
            clears inside 343 of container. The step-down still holds there,
            against the hero's text-2xl.

            text-relief on the block and text-trim on each line: both are
            custom text-* utilities, and two of those in one class list is the
            one thing `cn` cannot be trusted with. So these two class strings
            are written out whole and chosen between, rather than merged. See
            CLAUDE.md.

            Inline below sm, block from it. The sentences are separate lines by
            design — that is the beat the copy is written to — but a forced
            break only reads as one when the line it forces actually fits. On a
            375 window they do not, so each sentence broke where the column ran
            out *and* again where the design said, and the stack came out as
            statements alternating with orphans: "The store is not / open. /
            You'll get first / pick." Run together they are one paragraph that
            wraps where it wants and strands nothing. kugiri cuts at the line
            boxes the browser painted, so the reveal follows either way. */}
        <LineRise
          as="h1"
          className="display-1 text-trim mt-6 sm:space-y-(--heading-line-gap) md:mt-8"
        >
          {lines.map((line, index) => (
            <Fragment key={index}>
              {/* A space between the sentences, and it has to be written. JSX
                  drops the whitespace between two elements on separate lines,
                  so inline they would run together. Inert while they are
                  blocks. */}
              {index > 0 ? " " : null}
              <span
                className={
                  index === heroLine(lines)
                    ? // space-y hangs its margin on the upper sibling, so this
                      // line owns the gap beneath it — and being the largest,
                      // its em would open the widest one on the stack without
                      // the tightening.
                      //
                      // From sm, which is where it *is* the largest. Below that
                      // every line is set alike, so the gaps are already even
                      // and tightening one of them only kinks the stack.
                      // No size of its own: display-1's, the whole way up. It
                      // carried `lg:text-5xl`, which is what display-1 is at
                      // md anyway — and being an lg it then sat on top of the
                      // xl step too, so the statement stopped growing at 1024
                      // and never reached 6xl.
                      "text-trim sm:line-gap-tight inline tracking-[-0.02em] sm:block"
                    : // display-2's ladder, one step under the statement at
                      // every width — 31.1 / 37.3 / 44.8 against 37.3 / 44.8 /
                      // 53.8. It was two steps under, which on a two-line hold
                      // page read as a caption stuck to a heading rather than
                      // as the second half of what it says.
                      //
                      // Written out rather than taken as `display-2`, because
                      // the step is only wanted from sm: below that the lines
                      // are inline and flow as one paragraph, and a paragraph
                      // cannot be two sizes.
                      "text-trim inline tracking-[-0.02em] sm:block sm:text-3xl md:text-4xl xl:text-5xl"
                }
              >
                {line}
              </span>
            </Fragment>
          ))}
        </LineRise>

        {/* Straight from the heading to the ask. The gap is wider than the one
            a paragraph would open above itself, because it is now carrying the
            whole break between the statement and the thing to do about it —
            32px under a three-line heading reads as the form being part of it.

            max-w-lg is the form's own width, hoisted here so that whatever a
            page puts in this slot is measured the same. Centred inside it, so
            a button half the width of a signup well still lands on the middle
            of the page rather than on the left of the box. */}
        <div className="pointer-events-auto mt-10 flex w-full max-w-lg justify-center md:mt-12">
          {children ?? <NotifyForm source={source} />}
        </div>
      </Container>
    </section>
  );
}
