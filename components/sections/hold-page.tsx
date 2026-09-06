import Image from "next/image";
import type { ReactNode } from "react";

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
        /* A still of the thing the page is holding.

           Cover from md, where the frame is landscape and a landscape source
           fills it without being blown up. Contained below that, and this is
           the whole of why the two differ: covering a 375x812 window with a
           16:9 render scales it to more than four times the width of the
           screen, so a phone got a fragment of the card magnified until the
           lit face filled the display and the heading sat on top of the
           brightest thing on the page. Contained, the card arrives whole and
           at its own size.

           Held to the bottom on a phone rather than centred, so the picture is
           under the copy instead of behind it — the column is centred in the
           frame, and a contained band is centred too, which is the one place
           it should not be.

           `priority`: it is the largest thing above the fold on a page with
           almost nothing else on it, so leaving it to lazy-load spends the
           first paint on an empty screen. */
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="max-md:object-contain max-md:object-bottom md:object-cover"
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
            long, short at two — one step down the scale at every breakpoint,
            so the front page keeps the largest type on the site.

            text-relief on the block and text-trim on each line: both are
            custom text-* utilities, and two of those in one class list is the
            one thing `cn` cannot be trusted with. So these two class strings
            are written out whole and chosen between, rather than merged. See
            CLAUDE.md. */}
        <LineRise
          as="h1"
          className="font-heading text-relief mt-6 space-y-(--heading-line-gap) font-black uppercase italic md:mt-8"
        >
          {lines.map((line, index) => (
            <span
              key={index}
              className={
                index === heroLine(lines)
                  ? // space-y hangs its margin on the upper sibling, so this
                    // line owns the gap beneath it — and being the largest,
                    // its em would open the widest one on the stack without
                    // the tightening.
                    "text-trim line-gap-tight block text-xl tracking-[-0.02em] sm:text-3xl md:text-4xl lg:text-5xl"
                  : "text-trim block text-lg tracking-[-0.02em] sm:text-xl md:text-2xl lg:text-3xl"
              }
            >
              {line}
            </span>
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
