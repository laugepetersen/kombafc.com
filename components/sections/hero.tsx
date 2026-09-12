"use client";

import { useState } from "react";

import { Container } from "@/components/layout/container";
import { BackgroundVideo } from "@/components/media/background-video";
import { VideoModal } from "@/components/media/video-modal";
import { LineRise } from "@/components/ui/line-rise";
import { ShowBar } from "@/components/ui/show-bar";
import { showFacts } from "@/content/show";

/**
 * Inlined at build time. The short looping backdrop and the full-length film
 * are separate Mux assets: the backdrop is capped at 720p and silent, the
 * feature is only fetched once someone presses play.
 */
const BACKGROUND_PLAYBACK_ID =
  process.env.NEXT_PUBLIC_MUX_BACKGROUND_PLAYBACK_ID;
const FEATURE_PLAYBACK_ID = process.env.NEXT_PUBLIC_MUX_HERO_PLAYBACK_ID;

/**
 * The 1.0 aftermovie, off the KOMBA channel. Interim source for the modal —
 * ignored once FEATURE_PLAYBACK_ID is set.
 *
 * It used to point at the main event, which is a 38-minute full fight: the bar
 * said "Watch 1.0 Aftermovie" and opened something else entirely.
 */
const FEATURE_YOUTUBE_ID = "W1G2qjzBW04";

/**
 * Mux renders a poster straight off the asset, which avoids shipping a
 * separate full-size image. Falls back to a still while the asset is pending.
 */
const poster = BACKGROUND_PLAYBACK_ID
  ? `https://image.mux.com/${BACKGROUND_PLAYBACK_ID}/thumbnail.webp?width=1920&time=0`
  : "/hero-poster.webp";

export function Hero() {
  const [playerOpen, setPlayerOpen] = useState(false);

  return (
    // Full viewport height, floored at 600px so an unusually short window
    // cannot squash it into the section below — but never above the screen
    // itself, which is what the min() is for. A bare 600 did the squashing it
    // was there to prevent: on a phone turned sideways, 812x375, the hero came
    // out 600 tall in a 375 window and the card stack's bottom edge sat 177px
    // under the fold. A hero taller than the screen is not a hero.
    //
    // dvh rather than vh, so mobile browser chrome collapsing does not resize
    // it mid-scroll.
    <section className="hero-parallax-root relative flex h-dvh min-h-[min(600px,100dvh)] items-center justify-center overflow-clip">
      <BackgroundVideo
        className="hero-parallax-media"
        playbackId={BACKGROUND_PLAYBACK_ID}
        // Interim 6s loop. Drops out the moment a Mux playback ID is set.
        src={BACKGROUND_PLAYBACK_ID ? undefined : "/hero-loop.mp4"}
        poster={poster}
      />

      {/* Legibility scrim, and only that now — it used to land on solid
          --color-void at the bottom so the hero dissolved into the section
          below, and the video is meant to end on a clean cut instead. Still
          heavier at the top than the bottom, which is where the copy needs it
          least and the frame edge needs it most.

          Pulled back from 50/30 to 30/15. Half the veil was insurance the
          heading does not need: it carries `text-relief`, which is a bloom and
          an inner shadow built for exactly this, and the bar along the foot
          brings its own scrim for the one piece of small type down there. What
          the old value cost was the footage — the shot is lit dark to begin
          with, and a third of it again on top read as a still rather than as a
          room with the lights up. */}
      <div
        className="from-void/30 to-void/15 absolute inset-0 bg-gradient-to-b"
        aria-hidden="true"
      />

      {/* Deepens as the hero leaves. Its own layer rather than a filter on the
          video: opacity composites, brightness() repaints the whole frame. */}
      <div
        className="bg-void hero-parallax-veil absolute inset-0"
        aria-hidden="true"
      />

      {/* No parallax on the copy — only the backdrop moves as the hero
          leaves. */}
      <Container className="relative flex flex-col items-center text-center">
        {/* Each line is trimmed to its caps, so the leading between them is set
            explicitly here. In em, so it scales with each line rather than
            being a fixed gap that only looks right at one breakpoint.

            text-relief, the same as every other heading: a bloom and an inner
            shadow over a solid fill. It wore text-chrome, which paints a
            gradient clipped to the glyphs on top of that — two passes over the
            same type, and with both ends of the ramp already set to white
            there was no gradient left for the second one to show. */}
        {/* display-hero, the one step that is not on the ladder — see the note
            on it in globals.css. display-1 is what an h1 takes and every route
            has one, so it cannot also be the size that makes a full screen of
            video land; this is the hero's own, level with display-1 on a phone
            and a step clear of it at every breakpoint after.

            On the wrapper rather than the lines, because it is the register as
            much as the size: the voice (Eurostile, black, italic, uppercase,
            the relief) in one word instead of five, so this heading cannot
            drift from the rest of the site's the next time one is retuned. */}
        <LineRise
          as="h1"
          className="display-hero text-trim sm:space-y-(--heading-line-gap)"
        >
          {/* No size below sm — the lines take the step's own, which is the
              point of putting it on the wrapper. The ladder answers how big a
              heading is on a phone; hand-setting these was picking a number
              instead of asking it.

              The two-step drop resumes at sm, where there is room to read it.
              At 375 it is not a hierarchy, it is a heading with two captions
              stuck to it — so the lines sit level there.

              And inline, so they are not lines at all below sm. The three
              sentences are separate lines by design, but a forced break only
              reads as one when the line it forces actually fits: on a 375
              window each sentence broke where the column ran out *and* again
              where the design said, which came out as statements alternating
              with orphans. Run together they are one paragraph that wraps where
              it wants. kugiri cuts at the line boxes the browser painted, so
              the reveal follows either way. The `{" "}` between them is
              load-bearing — JSX drops the whitespace between two elements on
              separate lines, so inline they would run together. */}
          <span className="text-trim inline tracking-[-0.02em] sm:block sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
            The best strikers.
          </span>{" "}
          {/* The tightening goes here, not on the line below it: space-y puts
              the margin on the upper sibling, so this line owns the gap
              underneath itself — and being the largest of the three, its em
              makes that gap the widest on the stack.

              From sm, because that is where it is the largest. Level with its
              neighbours the gap is already even, and tightening one of three
              equal gaps just puts a kink in the stack. */}
          <span className="text-trim sm:line-gap-tight inline tracking-[-0.02em] sm:block">
            A new fight format.
          </span>{" "}
          <span className="text-trim inline tracking-[-0.02em] sm:block sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
            In Scandinavia.
          </span>
        </LineRise>
      </Container>

      {/* The ask, and the only one on the hero now.

          The same bar the flythrough carries at the foot of its pinned screen
          — same block, same facts — which is what makes it read as the site's
          way of talking about the show rather than as two designs for it. It
          replaces the banner that sat under the heading: the banner said the
          same thing in the same words with a second violet block, and a hero
          with two CTAs makes the reader choose before it has said what for.

          `onClick`, not `href`: this one opens the film over the page rather
          than leaving for the archive, which is the flythrough's job.

          No `progress` either — there is no scroll under it to report, so the
          rule along its top stays the plain hairline the component falls back
          to. Outside the Container, like the flythrough's: it runs to both
          edges and carries its own gutters inside. */}
      <ShowBar
        action="Watch 1.0 Aftermovie"
        onClick={() => setPlayerOpen(true)}
        // The hero has no violet of its own, so the ask takes the site's. The
        // flythrough's bar stays white — it sits over a violet-lit corridor.
        accent="violet"
        facts={showFacts}
        className="absolute inset-x-0 bottom-0"
      />

      <VideoModal
        playbackId={FEATURE_PLAYBACK_ID}
        youtubeId={FEATURE_YOUTUBE_ID}
        open={playerOpen}
        onClose={() => setPlayerOpen(false)}
        title="KOMBA 1.0 — Aftermovie"
      />
    </section>
  );
}
