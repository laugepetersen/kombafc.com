"use client";

import { useState } from "react";

import { Container } from "@/components/layout/container";
import { BackgroundVideo } from "@/components/media/background-video";
import { VideoModal } from "@/components/media/video-modal";
import { BannerCta } from "@/components/ui/banner-cta";
import { LineRise } from "@/components/ui/line-rise";

/**
 * Inlined at build time. The short looping backdrop and the full-length film
 * are separate Mux assets: the backdrop is capped at 720p and silent, the
 * feature is only fetched once someone presses play.
 */
const BACKGROUND_PLAYBACK_ID =
  process.env.NEXT_PUBLIC_MUX_BACKGROUND_PLAYBACK_ID;
const FEATURE_PLAYBACK_ID = process.env.NEXT_PUBLIC_MUX_HERO_PLAYBACK_ID;

/** Interim source for the modal. Ignored once FEATURE_PLAYBACK_ID is set. */
const FEATURE_YOUTUBE_ID = "VKWcRp_3Mgc";

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
          least and the frame edge needs it most. */}
      <div
        className="from-void/50 to-void/30 absolute inset-0 bg-gradient-to-b"
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
        <LineRise
          as="h1"
          className="font-heading text-relief space-y-(--heading-line-gap) font-black uppercase italic"
        >
          <span className="text-trim block text-lg tracking-[-0.02em] sm:text-2xl md:text-3xl lg:text-4xl">
            The best strikers.
          </span>
          {/* The tightening goes here, not on the line below it: space-y puts
              the margin on the upper sibling, so this line owns the gap
              underneath itself — and being the largest of the three, its em
              makes that gap the widest on the stack. */}
          <span className="text-trim line-gap-tight block text-2xl tracking-[-0.02em] sm:text-4xl md:text-5xl lg:text-6xl">
            A new fight format.
          </span>
          <span className="text-trim block text-lg tracking-[-0.02em] sm:text-2xl md:text-3xl lg:text-4xl">
            In Scandinavia.
          </span>
        </LineRise>

        {/* The ask, as the banner rather than as a pill. It names the thing it
            plays — a rounded "Watch the film" said nothing about which film,
            and the hero's one job is to sell the last show. */}
        <BannerCta
          lines={["KOMBA 1.0", "Aftermovie"]}
          action="Watch Now"
          onClick={() => setPlayerOpen(true)}
          className="mt-10"
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
