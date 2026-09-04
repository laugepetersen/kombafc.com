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

/**
 * Everything opens as one move: the rules, the fill and the video all travel
 * on the same duration and easing, starting the moment the modal opens.
 */
const EXPAND_MS = 850;
/** The overlay fades over this, starting immediately, so it never just pops. */
const OVERLAY_MS = 500;

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Closed geometry: collapsed to a point dead centre of the player. */
const CLOSED_INSET = "50%";

/**
 * Dims the page behind the modal.
 *
 * Mounted only while open, so its first paint is the transparent state and the
 * fade actually runs — a background colour set on the dialog itself would jump
 * straight to full the moment showModal() flips it out of display:none.
 */
function Overlay() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-void/94 fixed inset-0 transition-opacity ease-out",
        shown ? "opacity-100" : "opacity-0",
      )}
      style={{ transitionDuration: `${OVERLAY_MS}ms` }}
    />
  );
}

/**
 * Expands a ruled grid out to the player's box, then cross-fades the video in
 * over it.
 *
 * Mounted only while the modal is open, so "closed" is simply its initial
 * state and there is nothing to reset on the way out.
 */
function ExpandingPlayer({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Two frames, not a delay: the first lets the closed state paint, the
    // second flips to open so the transition has something to animate from.
    // A single frame risks both landing in one paint and the move being
    // skipped entirely.
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setExpanded(true));
    });

    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, []);

  // Duration and easing come from the constants above rather than utility
  // classes, so the timing the effect schedules cannot drift from the timing
  // the transition actually runs at.
  const motion = {
    transitionDuration: `${EXPAND_MS}ms`,
    transitionTimingFunction: EASE,
  };
  const rule = "absolute bg-rule transition-all";

  const closed = CLOSED_INSET;
  // Open, they sit 1px *outside* the player, so the rule stays visible
  // instead of being covered by the video.
  const open = "-1px";

  return (
    <div className="relative aspect-video w-full max-w-6xl">
      {/* Solid fill, opening on the same geometry as everything else. Gives
          the frame something to hold while the video renders in, instead of
          the page showing through a box that is already open. */}
      <div
        aria-hidden="true"
        className={cn(
          "bg-void pointer-events-none absolute inset-0 transition-[clip-path]",
          expanded ? "[clip-path:inset(0)]" : "[clip-path:inset(50%)]",
        )}
        style={motion}
      />

      {/* Four rules running edge to edge of the viewport, opening from a
          point dead centre out to the player's box. Positional rather than scaled,
          so they stay exactly 1px the whole way out. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span
          className={cn(rule, "-right-[100vw] -left-[100vw] h-px")}
          style={{ ...motion, top: expanded ? open : closed }}
        />
        <span
          className={cn(rule, "-right-[100vw] -left-[100vw] h-px")}
          style={{ ...motion, bottom: expanded ? open : closed }}
        />
        <span
          className={cn(rule, "-top-[100vh] -bottom-[100vh] w-px")}
          style={{ ...motion, left: expanded ? open : closed }}
        />
        <span
          className={cn(rule, "-top-[100vh] -bottom-[100vh] w-px")}
          style={{ ...motion, right: expanded ? open : closed }}
        />
      </div>

      {/* Clipped by the same geometry as the grid, so the video opens out of
          the square with everything else instead of fading in over a frame
          that has already arrived. */}
      <div
        className={cn(
          "absolute inset-0 transition-[clip-path,opacity] ease-out",
          expanded
            ? "opacity-100 [clip-path:inset(0)]"
            : "opacity-0 [clip-path:inset(50%)]",
        )}
        style={motion}
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
 * Opens from a point dead centre: the rules, the fill and the video all
 * travel out together on one duration, while the overlay fades up behind them.
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
      className="m-0 h-full max-h-none w-full max-w-none place-items-center overflow-hidden bg-transparent p-4 text-white backdrop:bg-transparent open:grid md:p-10"
      aria-label={title}
    >
      {open ? <Overlay /> : null}

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
