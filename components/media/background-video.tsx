"use client";

import { MuxBackgroundVideo } from "@mux/mux-background-video/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

type BackgroundVideoProps = {
  /**
   * Mux playback ID. When absent the poster is shown on its own, so the
   * section still looks right before the asset exists.
   */
  playbackId?: string;
  /**
   * Plain file fallback, used when no Mux asset is configured yet. Single
   * bitrate, so keep it short and small — it is a stopgap, not the shipping
   * path.
   */
  src?: string;
  /** Painted immediately and used as the fallback whenever video is suppressed. */
  poster: string;
  /** Caps the rendition Mux serves. 720p is plenty for a backdrop. */
  maxResolution?: string;
  className?: string;
};

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

type NetworkInformation = EventTarget & {
  saveData?: boolean;
  effectiveType?: string;
};

function getConnection(): NetworkInformation | undefined {
  return (navigator as Navigator & { connection?: NetworkInformation })
    .connection;
}

function subscribe(onChange: () => void) {
  const motion = window.matchMedia(REDUCED_MOTION);
  const connection = getConnection();

  motion.addEventListener("change", onChange);
  connection?.addEventListener("change", onChange);

  return () => {
    motion.removeEventListener("change", onChange);
    connection?.removeEventListener("change", onChange);
  };
}

/** Cheap enough to recompute per render, and returns a primitive so the
 *  store stays referentially stable. */
function getSnapshot() {
  if (window.matchMedia(REDUCED_MOTION).matches) return false;

  const connection = getConnection();
  if (connection?.saveData) return false;
  if (
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g"
  ) {
    return false;
  }

  return true;
}

/**
 * Whether it is reasonable to pull video at all.
 *
 * All three signals are browser-only, so this goes through
 * useSyncExternalStore: the server snapshot is always false, which keeps
 * hydration honest, and switching Data Saver or reduced-motion on takes effect
 * immediately rather than only on the next full load.
 */
function useShouldLoadVideo(enabled: boolean) {
  const permitted = useSyncExternalStore(subscribe, getSnapshot, () => false);
  return enabled && permitted;
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
  src,
  poster,
  maxResolution = "720p",
  className,
}: BackgroundVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [inView, setInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const shouldLoad = useShouldLoadVideo(Boolean(playbackId || src)) && inView;

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

  // Shared by both paths so the Mux and plain-file players cannot drift.
  const videoAttrs = {
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    preload: "none" as const,
    onPlaying: () => setIsPlaying(true),
    className: cn(
      "absolute inset-0 size-full object-cover transition-opacity duration-700",
      isPlaying ? "opacity-100" : "opacity-0",
    ),
  };

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
          {...videoAttrs}
        />
      ) : shouldLoad && src ? (
        <video ref={videoRef} src={src} poster={poster} {...videoAttrs} />
      ) : null}
    </div>
  );
}
