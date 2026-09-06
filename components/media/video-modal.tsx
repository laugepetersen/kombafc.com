"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

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
 * Entering and leaving are different gestures, not the same one reversed.
 *
 * Opening draws the player out of a point, which is worth watching once.
 * Reversing that on the way out makes the user sit through the geometry a
 * second time to get to something they have already dismissed, so leaving is
 * a straight fade instead — shorter, and it clears the screen immediately.
 */
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)"; // decelerate
const EXPAND_MS = 850;
const EXIT_MS = 260;

/** The overlay fades over this, starting immediately, so it never just pops. */
const OVERLAY_MS = 500;
/** Matches EXIT_MS so the overlay and the frame land together. */
const OVERLAY_EXIT_MS = EXIT_MS;

/** Closed geometry: collapsed to a point dead centre of the player. */
const CLOSED_INSET = "50%";
/** Open, the rules sit 1px outside the player so they stay visible. */
const OPEN_OFFSET = "-1px";

/**
 * Dims the page behind the modal.
 *
 * Mounted only while open, so its first paint is the transparent state and the
 * fade actually runs — a background colour set on the dialog itself would jump
 * straight to full the moment showModal() flips it out of display:none.
 */
function Overlay({ exiting }: { exiting: boolean }) {
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
        shown && !exiting ? "opacity-100" : "opacity-0",
      )}
      style={{
        transitionDuration: `${exiting ? OVERLAY_EXIT_MS : OVERLAY_MS}ms`,
      }}
    />
  );
}

/**
 * Opens the player out of a point dead centre: four rules, a placeholder
 * panel and the video all travelling on one duration. Leaving is a fade.
 *
 * Mounted only while the modal is open, so "closed" is simply its initial
 * state and there is nothing to reset on the way out.
 */
function ExpandingPlayer({
  playbackId,
  youtubeId,
  title,
  exiting,
}: {
  playbackId?: string;
  youtubeId?: string;
  title: string;
  exiting: boolean;
}) {
  const [entered, setEntered] = useState(false);

  /**
   * The video is revealed on its load event, not on a timer. A fixed delay
   * blinks an empty frame in whenever the network is slower than the
   * animation. Mounted per open, so this starts false every time.
   */
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Two frames, not a delay: the first lets the closed state paint, the
    // second flips to open so the transition has something to animate from.
    // A single frame risks both landing in one paint and the move being
    // skipped entirely.
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setEntered(true));
    });

    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, []);

  // Geometry follows `entered` alone. Exiting fades the whole thing out
  // rather than collapsing it back, so the frame never re-animates.
  const open = entered;
  const showVideo = open && loaded;

  // Duration and easing come from the constants above rather than utility
  // classes, so the timing the modal schedules its close against cannot drift
  // from the timing the transition actually runs at.
  const motion = {
    transitionDuration: `${EXPAND_MS}ms`,
    transitionTimingFunction: EASE,
  };
  const rule = "absolute bg-rule transition-all";

  const player = playbackId ? (
    <MuxPlayer
      playbackId={playbackId}
      streamType="on-demand"
      autoPlay
      accentColor="#7a1fff"
      metadata={{ video_title: title }}
      onLoadedData={() => setLoaded(true)}
      className="size-full"
    />
  ) : (
    <iframe
      // nocookie so YouTube sets nothing until playback actually starts.
      src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
      title={title}
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
      onLoad={() => setLoaded(true)}
      className="size-full border-0"
    />
  );

  return (
    <div
      data-player-box
      className={cn(
        "relative aspect-video w-full max-w-6xl transition-opacity ease-out",
        exiting && "opacity-0",
      )}
      style={{ transitionDuration: `${EXIT_MS}ms` }}
    >
      {/* Placeholder panel, opening on the same geometry as everything else.
          Carries a travelling sheen until the video loads, so the frame reads
          as waiting on something rather than as an empty black box. */}
      <div
        aria-hidden="true"
        className={cn(
          "bg-ink-900 pointer-events-none absolute inset-0 transition-[clip-path]",
          !loaded && "sheen",
          open ? "[clip-path:inset(0)]" : "[clip-path:inset(50%)]",
        )}
        style={motion}
      />

      {/* Four rules running edge to edge of the viewport, opening from a point
          dead centre out to the player's box. Positional rather than scaled,
          so they stay exactly 1px the whole way. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span
          className={cn(rule, "-right-[100vw] -left-[100vw] h-px")}
          style={{ ...motion, top: open ? OPEN_OFFSET : CLOSED_INSET }}
        />
        <span
          className={cn(rule, "-right-[100vw] -left-[100vw] h-px")}
          style={{ ...motion, bottom: open ? OPEN_OFFSET : CLOSED_INSET }}
        />
        <span
          className={cn(rule, "-top-[100vh] -bottom-[100vh] w-px")}
          style={{ ...motion, left: open ? OPEN_OFFSET : CLOSED_INSET }}
        />
        <span
          className={cn(rule, "-top-[100vh] -bottom-[100vh] w-px")}
          style={{ ...motion, right: open ? OPEN_OFFSET : CLOSED_INSET }}
        />
      </div>

      {/* The clip follows the frame so the video travels with it; the opacity
          waits on the load, so a slow network shows the sheen for longer
          rather than blinking an empty player in on schedule. */}
      <div
        className={cn(
          "absolute inset-0 transition-[clip-path,opacity] ease-out",
          open ? "[clip-path:inset(0)]" : "[clip-path:inset(50%)]",
          showVideo ? "opacity-100" : "opacity-0",
        )}
        style={motion}
      >
        {player}
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
 * Built on a native `<dialog>`, which gives focus trapping, inertness of the
 * page behind it and top-layer stacking without any of it being reimplemented
 * in JS.
 */
export function VideoModal({
  playbackId,
  youtubeId,
  open,
  onClose,
  title = "KOMBA Fight Club",
}: VideoModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [exiting, setExiting] = useState(false);

  // Kept in a ref so the listeners below can subscribe once and still call the
  // latest handler.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  /** Plays the exit animation first, then actually closes the dialog. */
  const requestClose = useCallback(() => {
    if (exitTimer.current) return; // already leaving
    setExiting(true);
    exitTimer.current = setTimeout(() => {
      exitTimer.current = null;
      dialogRef.current?.close();
    }, EXIT_MS);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    /**
     * `close` does *not* bubble, so React's synthetic onClose prop cannot be
     * relied on to catch a native close; without a real listener the parent's
     * `open` state silently desyncs and the modal will not reopen.
     */
    const handleNativeClose = () => {
      setExiting(false);
      onCloseRef.current();
    };

    /**
     * Escape dismisses a dialog instantly by default, which would skip the
     * exit animation. Cancel that and route it through the same close path as
     * the button and the backdrop.
     */
    const handleCancel = (event: Event) => {
      event.preventDefault();
      requestClose();
    };

    dialog.addEventListener("close", handleNativeClose);
    dialog.addEventListener("cancel", handleCancel);

    return () => {
      dialog.removeEventListener("close", handleNativeClose);
      dialog.removeEventListener("cancel", handleCancel);
    };
  }, [requestClose]);

  useEffect(
    () => () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    },
    [],
  );

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
   * Scroll lock — on the scrolling element and nothing else.
   *
   * It used to go on <html> and <body> both, on the theory that one of them
   * is bound to be the scroller. The <body> half is what broke the pinned
   * sections behind it: `overflow: hidden` makes an element a scroll
   * container, so <body> became the nearest scrollport for every
   * `position: sticky` on the page, and that box does not scroll — the pins
   * released and every section inside them snapped back to its static
   * position while the player was open. Measured on the previous show: the
   * sticky screen went from a top of 0 to -1611, taking the heading off
   * screen and parking its reveal, which then replayed on close.
   *
   * Locking <html> alone does not do that, because overflow on the root
   * propagates to the viewport and leaves the root itself visible — no new
   * scroll container, so sticky still measures against the viewport. Going
   * through scrollingElement keeps it right in the quirks-mode case too,
   * where <body> is the scroller and is already the sticky ancestor.
   *
   * Tied to `open` with a cleanup, so the lock is always released however the
   * dialog was dismissed.
   *
   * Cleared outright rather than saved-and-restored, and that is the whole of
   * the fix for a leak that left the page unscrollable after a video.
   *
   * This used to read the inline overflow on the way in and put that value
   * back on the way out. The trouble is that two players can be alive at once
   * for a frame — the watch grid gives its modal a `key` per video, so
   * choosing a fight unmounts one instance and mounts another — and if the
   * incoming one reads the value before the outgoing one has restored it, it
   * saves "hidden" as the state to return to. From then on every close
   * "restores" the lock, the page cannot be scrolled, and the next open saves
   * "hidden" again: the bug repairs itself into permanence, which is why it
   * looked intermittent rather than broken.
   *
   * Nothing else on the site writes inline overflow on the root, so "" is the
   * resting state and the cleanup can simply assert it. No saved value, no
   * shared counter, nothing that can drift: two attempts at this were a module
   * -scope depth count and then a set of tokens, and both of them found new
   * ways to miss the one state that unlocks the page. An unconditional clear
   * cannot. During the watch grid's keyed swap the outgoing player clears it a
   * frame before the incoming one sets it again, and React runs the whole
   * commit's cleanups before its effects, so the page is never actually
   * scrollable while a player is up.
   */
  useEffect(() => {
    if (!open) return;

    const scroller = (document.scrollingElement ??
      document.documentElement) as HTMLElement;

    scroller.style.overflow = "hidden";

    return () => {
      scroller.style.overflow = "";
    };
  }, [open]);

  const hasSource = Boolean(playbackId || youtubeId);

  return (
    <dialog
      ref={dialogRef}
      onClick={(event) => {
        // Anything outside the player dismisses. Tested by ancestry rather
        // than `target === dialog`, because the overlay covers the dialog and
        // would otherwise swallow every backdrop click.
        if (!(event.target as HTMLElement).closest("[data-player-box]")) {
          requestClose();
        }
      }}
      className="m-0 h-full max-h-none w-full max-w-none place-items-center overflow-hidden bg-transparent p-4 text-white backdrop:bg-transparent open:grid md:p-10"
      aria-label={title}
    >
      {open ? <Overlay exiting={exiting} /> : null}

      <button
        type="button"
        onClick={requestClose}
        aria-label="Close video"
        className={cn(
          "border-rule absolute top-4 right-4 z-10 flex size-11 items-center justify-center rounded-full border bg-white/5 backdrop-blur-md transition-[background-color,opacity] ease-out hover:bg-white/15 md:top-8 md:right-8",
          exiting && "opacity-0",
        )}
        style={{ transitionDuration: `${EXIT_MS}ms` }}
      >
        <Icon name="close" className="size-5" />
      </button>

      {!open ? null : hasSource ? (
        <ExpandingPlayer
          playbackId={playbackId}
          youtubeId={youtubeId}
          title={title}
          exiting={exiting}
        />
      ) : (
        <p className="text-ink-200 text-sm">
          No video configured — set a Mux playback ID or a YouTube id.
        </p>
      )}
    </dialog>
  );
}
