"use client";

import dynamic from "next/dynamic";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

/**
 * The player is a sizeable chunk of JS that nobody needs until they actually
 * click play, so it is pulled in on open rather than bundled into the hero.
 */
const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), {
  ssr: false,
});

/** How long the grid takes to expand before the video is faded in over it. */
const EXPAND_MS = 550;

/**
 * Expands a ruled grid out to the player's box, then cross-fades the video in
 * over it.
 *
 * Mounted only while the modal is open, so "closed" is simply its initial
 * state and there is nothing to reset on the way out.
 */
function ExpandingPlayer({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const [videoIn, setVideoIn] = useState(false);

  useEffect(() => {
    // Next frame, so the closed clip-path is committed and the change
    // animates rather than collapsing into the initial paint.
    const raf = requestAnimationFrame(() => setExpanded(true));
    const timer = setTimeout(() => setVideoIn(true), EXPAND_MS);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  const rule =
    "absolute bg-rule transition-all duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)]";

  // Closed, the four rules sit on the edges of a 60px square in the middle.
  const closed = "calc(50% - 30px)";
  // Open, they sit 1px *outside* the player, so the rule stays visible
  // instead of being covered by the video.
  const open = "-1px";

  return (
    <div className="relative aspect-video w-full max-w-6xl">
      {/* The inner grid, drawn in as the frame opens. Clipped with the same
          centred-square geometry as the rules below, so the two reveal in
          lockstep. Same solid rule colour, so crossings do not compound. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0",
          "[background-image:repeating-linear-gradient(to_right,var(--color-rule)_0_1px,transparent_1px_calc(100%/8)),repeating-linear-gradient(to_bottom,var(--color-rule)_0_1px,transparent_1px_calc(100%/5))]",
          "transition-[clip-path] duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          expanded
            ? "[clip-path:inset(0)]"
            : "[clip-path:inset(calc(50%_-_30px))]",
        )}
      />

      {/* Four rules running edge to edge of the viewport, opening from that
          small square out to the player's box. Positional rather than scaled,
          so they stay exactly 1px the whole way out. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span
          className={cn(rule, "-right-[100vw] -left-[100vw] h-px")}
          style={{ top: expanded ? open : closed }}
        />
        <span
          className={cn(rule, "-right-[100vw] -left-[100vw] h-px")}
          style={{ bottom: expanded ? open : closed }}
        />
        <span
          className={cn(rule, "-top-[100vh] -bottom-[100vh] w-px")}
          style={{ left: expanded ? open : closed }}
        />
        <span
          className={cn(rule, "-top-[100vh] -bottom-[100vh] w-px")}
          style={{ right: expanded ? open : closed }}
        />
      </div>

      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-500 ease-out",
          videoIn ? "opacity-100" : "opacity-0",
        )}
      >
        {children}
      </div>
    </div>
  );
}

type VideoModalProps = {
  /** Mux asset. Takes precedence when both are supplied. */
  playbackId?: string;
  /** YouTube video id, used until the Mux asset exists. */
  youtubeId?: string;
  open: boolean;
  onClose: () => void;
  title?: string;
};

/**
 * Full-screen player overlay.
 *
 * Built on a native `<dialog>`, which gives focus trapping, Escape-to-close,
 * inertness of the page behind it and top-layer stacking without any of it
 * being reimplemented in JS.
 *
 * Opens from a 60px square in the middle: four rules run out to the player's
 * box while a grid is drawn in behind them, then the video cross-fades over
 * the top.
 */
export function VideoModal({
  playbackId,
  youtubeId,
  open,
  onClose,
  title = "KOMBA Fight Club",
}: VideoModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Kept in a ref so the listener below can subscribe once and still call the
  // latest handler.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  /**
   * The dialog can close without React initiating it — Escape, or the form
   * method="dialog" path. `close` does *not* bubble, so React's synthetic
   * onClose prop cannot be relied on to catch those; without a real listener
   * the parent's `open` state silently desyncs and the modal will not reopen.
   */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleNativeClose = () => onCloseRef.current();
    dialog.addEventListener("close", handleNativeClose);
    return () => dialog.removeEventListener("close", handleNativeClose);
  }, []);

  // Drive the dialog from the `open` prop, never the other way round.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  /**
   * Scroll lock.
   *
   * It has to go on the *scrolling element*, which here is <html>: this
   * document has `height: 100%` on html, so body is not the scroller and
   * `body { overflow: hidden }` does nothing at all. Setting both is the
   * portable form. Tied to `open` with a cleanup, so the lock is always
   * released however the dialog was dismissed.
   */
  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const previousRoot = root.style.overflow;
    const previousBody = document.body.style.overflow;

    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      root.style.overflow = previousRoot;
      document.body.style.overflow = previousBody;
    };
  }, [open]);

  const player = playbackId ? (
    <MuxPlayer
      playbackId={playbackId}
      streamType="on-demand"
      autoPlay
      accentColor="#7a1fff"
      metadata={{ video_title: title }}
      className="size-full"
    />
  ) : youtubeId ? (
    <iframe
      // nocookie so YouTube sets nothing until playback actually starts.
      src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
      title={title}
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
      className="size-full border-0"
    />
  ) : null;

  return (
    <dialog
      ref={dialogRef}
      onClick={(event) => {
        // Clicks land on the dialog itself only when they miss its contents.
        if (event.target === dialogRef.current) onClose();
      }}
      className="bg-void/90 m-0 h-full max-h-none w-full max-w-none place-items-center overflow-hidden p-4 text-white backdrop:bg-transparent open:grid md:p-10"
      aria-label={title}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close video"
        className="absolute top-4 right-4 z-10 flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5 backdrop-blur-md transition-colors hover:bg-white/15 md:top-8 md:right-8"
      >
        <Icon name="close" className="size-5" />
      </button>

      {!open ? null : player ? (
        <ExpandingPlayer>{player}</ExpandingPlayer>
      ) : (
        <p className="text-ink-200 text-sm">
          No video configured — set a Mux playback ID or a YouTube id.
        </p>
      )}
    </dialog>
  );
}
