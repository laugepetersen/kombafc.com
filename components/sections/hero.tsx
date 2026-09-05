"use client";

import { useState } from "react";

import { Container } from "@/components/layout/container";
import { BackgroundVideo } from "@/components/media/background-video";
import { VideoModal } from "@/components/media/video-modal";
import { CardStack } from "@/components/ui/card-stack";
import { Icon } from "@/components/ui/icon";
import { PersonCard } from "@/components/ui/person-card";
import { team } from "@/content/team";

/**
 * Inlined at build time. The short looping backdrop and the full-length film
 * are separate Mux assets: the backdrop is capped at 720p and silent, the
 * feature is only fetched once someone presses play.
 */
const BACKGROUND_PLAYBACK_ID =
  process.env.NEXT_PUBLIC_MUX_BACKGROUND_PLAYBACK_ID;
const FEATURE_PLAYBACK_ID = process.env.NEXT_PUBLIC_MUX_HERO_PLAYBACK_ID;

/** Interim source for the modal. Ignored once FEATURE_PLAYBACK_ID is set. */
const FEATURE_YOUTUBE_ID = "yR3Cex1Cp10";

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
    // Full viewport height, floored at 600px so an unusually short or
    // landscape-phone window cannot squash it into the section below. dvh
    // rather than vh, so mobile browser chrome collapsing does not resize it
    // mid-scroll.
    <section className="hero-parallax-root relative flex h-dvh min-h-[600px] items-center justify-center overflow-clip">
      <BackgroundVideo
        className="hero-parallax-media"
        playbackId={BACKGROUND_PLAYBACK_ID}
        // Interim 6s loop. Drops out the moment a Mux playback ID is set.
        src={BACKGROUND_PLAYBACK_ID ? undefined : "/hero-loop.mp4"}
        poster={poster}
      />

      {/* Legibility scrim. Bottom lands on --color-void so the hero dissolves
          into the next section rather than ending on a hard edge. */}
      <div
        className="from-void/50 via-void/30 to-void absolute inset-0 bg-gradient-to-b"
        aria-hidden="true"
      />

      {/* Deepens as the hero leaves. Its own layer rather than a filter on the
          video: opacity composites, brightness() repaints the whole frame. */}
      <div
        className="bg-void hero-parallax-veil absolute inset-0"
        aria-hidden="true"
      />

      <Container className="hero-parallax-content relative flex flex-col items-center text-center">
        {/* Each line is trimmed to its caps, so the leading between them is set
            explicitly here. In em, so it scales with each line rather than
            being a fixed gap that only looks right at one breakpoint.

            text-chrome with both ends of its ramp at white: the gradient goes
            flat and the sweep has nothing left to move, so it is switched off
            rather than left recalculating every frame for no visible result.
            The bloom and the inner shadow are the rest of the utility and are
            untouched — this drops the colour travel, not the relief.

            Plain string, not cn: text-chrome and text-paint-room are two
            custom text-* utilities and tailwind-merge would keep only the
            last. See CLAUDE.md. */}
        <h1 className="font-heading text-chrome text-paint-room [--chrome-to:#ffffff] space-y-(--heading-line-gap) animate-none font-black uppercase italic">
          <span className="text-trim block text-lg tracking-[-0.02em] sm:text-2xl md:text-3xl lg:text-4xl">
            The best strikers.
          </span>
          <span className="text-trim block text-2xl tracking-[-0.02em] sm:text-4xl md:text-5xl lg:text-6xl">
            A new fight format.
          </span>
          {/* Set a third the size of the line above it, which leaves the
              standard gap reading loose underneath it. */}
          <span className="text-trim line-gap-tight block text-lg tracking-[-0.02em] sm:text-2xl md:text-3xl lg:text-4xl">
            In Scandinavia.
          </span>
        </h1>

        <button
          type="button"
          onClick={() => setPlayerOpen(true)}
          className="group mt-10 inline-flex items-center gap-4 rounded-full border border-white/15 bg-white/5 py-2 pr-6 pl-2 backdrop-blur-[12px] transition-colors hover:bg-white/10"
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-violet-500">
            <Icon name="play_arrow" className="size-5" />
          </span>
          <span className="font-body text-sm tracking-[0.06em] text-white/80 uppercase transition-colors group-hover:text-white">
            Watch the film
          </span>
        </button>
      </Container>

      {/* Bottom right, pinned to the container edge so it lines up with the
          page grid rather than floating against the viewport. The stack is
          only as wide as its widest card, so the row is what gets stretched
          across the container and the cards sit at its right end.
          
          Deliberately NOT on hero-parallax-content: that utility runs a
          scroll-driven animation, and an animated ancestor becomes the
          backdrop root for everything under it — the cards' backdrop-filter
          would then have only the container to sample, not the video, and the
          frosting would silently do nothing. The stack scrolls away with the
          hero regardless; it just does not take part in the exit. */}
      <Container className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-end md:bottom-12">
        <CardStack
          className="pointer-events-auto"
          items={team.map((person) => ({
            id: person.id,
            content: <PersonCard person={person} />,
          }))}
        />
      </Container>

      <VideoModal
        playbackId={FEATURE_PLAYBACK_ID}
        youtubeId={FEATURE_YOUTUBE_ID}
        open={playerOpen}
        onClose={() => setPlayerOpen(false)}
        title="KOMBA Fight Club — The Ressurect"
      />
    </section>
  );
}
