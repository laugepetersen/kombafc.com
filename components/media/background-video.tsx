"use client";

import { MuxBackgroundVideo } from "@mux/mux-background-video/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type BackgroundVideoProps = {
  /**
   * Mux playback ID. When absent the poster is shown on its own, so the
   * section still looks right before the asset exists.
   */
  playbackId?: string;
  /** Painted immediately and used as the fallback whenever video is suppressed. */
  poster: string;
  /** Caps the rendition Mux serves. 720p is plenty for a backdrop. */
  maxResolution?: string;
  className?: string;
};

/**
 * Decides whether it is reasonable to pull video at all.
 *
 * Read once on mount rather than in render, since all three signals are
 * browser-only and would desync server and client markup.
 */
function useShouldLoadVideo(enabled: boolean) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    // Respect Data Saver and skip video outright on 2G.
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;

    if (connection?.saveData) return;
    if (
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g"
    ) {
      return;
    }

    setShouldLoad(true);
  }, [enabled]);

  return shouldLoad;
}

/**
 * Full-bleed looping background video over an always-present poster.
 *
 * The poster carries the first paint so the video never sits on the LCP path,
 * and the video fades in on top only once it is actually playing. Playback is
 * deferred until the section is near the viewport and paused whenever the tab
 * is hidden, so an off-screen or backgrounded hero costs nothing.
 */
export function BackgroundVideo({
  playbackId,
  poster,
  maxResolution = "720p",
  className,
}: BackgroundVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [inView, setInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const shouldLoad = useShouldLoadVideo(Boolean(playbackId)) && inView;

  // Start loading slightly before the section scrolls into view.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Don't decode frames for a tab nobody is looking at.
  useEffect(() => {
    if (!shouldLoad) return;

    const onVisibilityChange = () => {
      const video = videoRef.current;
      if (!video) return;

      if (document.hidden) {
        video.pause();
      } else {
        // Autoplay can be refused after a tab regains focus; ignore it and
        // leave the poster showing rather than throwing.
        void video.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [shouldLoad]);

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- poster is a
          fixed full-bleed backdrop, not a content image; next/image would add
          a wrapper and a second network hop for no benefit here. */}
      <img
        src={poster}
        alt=""
        className="absolute inset-0 size-full object-cover"
      />

      {shouldLoad && playbackId ? (
        <MuxBackgroundVideo
          ref={videoRef as never}
          src={`https://stream.mux.com/${playbackId}.m3u8`}
          poster={poster}
          maxResolution={maxResolution}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          onPlaying={() => setIsPlaying(true)}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-700",
            isPlaying ? "opacity-100" : "opacity-0",
          )}
        />
      ) : null}
    </div>
  );
}
