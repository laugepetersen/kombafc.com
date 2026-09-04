"use client";

import { useState } from "react";

import { Container } from "@/components/layout/container";
import { BackgroundVideo } from "@/components/media/background-video";
import { VideoModal } from "@/components/media/video-modal";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

/**
 * Inlined at build time. The short looping backdrop and the full-length film
 * are separate Mux assets: the backdrop is capped at 720p and silent, the
 * feature is only fetched once someone presses play.
 */
const BACKGROUND_PLAYBACK_ID =
  process.env.NEXT_PUBLIC_MUX_BACKGROUND_PLAYBACK_ID;
const FEATURE_PLAYBACK_ID = process.env.NEXT_PUBLIC_MUX_HERO_PLAYBACK_ID;

/** Dev aid: draws a red rule along the gradient wavefront so the sweep is
 *  visible while tuning. Flip to false to hide. */
const DEBUG_CHROME = true;

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
    <section className="relative flex min-h-[85svh] items-center justify-center overflow-hidden md:min-h-[850px]">
      <BackgroundVideo
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

      <Container className="relative flex flex-col items-center text-center">
        {/* Each line is trimmed to its caps, so the leading between them is set
            explicitly here. In em, so it scales with each line rather than
            being a fixed gap that only looks right at one breakpoint. */}
        <h1
          className={cn(
            "font-heading text-chrome space-y-(--heading-line-gap) px-4 font-black uppercase italic",
            DEBUG_CHROME && "chrome-debug",
          )}
        >
          <span className="text-trim block text-lg tracking-[-0.02em] sm:text-2xl md:text-3xl lg:text-4xl">
            The best strikers.
          </span>
          <span className="text-trim block text-2xl tracking-[-0.02em] sm:text-4xl md:text-5xl lg:text-6xl">
            A new fight format.
          </span>
          <span className="text-trim block text-lg tracking-[-0.02em] sm:text-2xl md:text-3xl lg:text-4xl">
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
