"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { Icon } from "@/components/ui/icon";

/**
 * The player is a sizeable chunk of JS that nobody needs until they actually
 * click play, so it is pulled in on open rather than bundled into the hero.
 */
const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), {
  ssr: false,
});

type VideoModalProps = {
  playbackId?: string;
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
 */
export function VideoModal({
  playbackId,
  open,
  onClose,
  title = "KOMBA Fight Club",
}: VideoModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Only ever mount the player once the modal has actually been opened, so a
  // page that is never interacted with pays nothing for it.
  const [hasOpened, setHasOpened] = useState(false);

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
      setHasOpened(true);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // showModal() does not stop the page behind from scrolling. Tying the lock
  // to `open` with a cleanup means it is always released, however the dialog
  // was dismissed.
  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClick={(event) => {
        // Clicks land on the dialog itself only when they miss its contents.
        if (event.target === dialogRef.current) onClose();
      }}
      className="bg-void/95 m-0 h-full max-h-none w-full max-w-none place-items-center overflow-hidden p-4 text-white backdrop:bg-black/80 open:grid md:p-10"
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

      {hasOpened && playbackId ? (
        <div className="aspect-video w-full max-w-6xl">
          <MuxPlayer
            playbackId={playbackId}
            streamType="on-demand"
            autoPlay={open}
            accentColor="#7a1fff"
            metadata={{ video_title: title }}
            className="size-full"
          />
        </div>
      ) : (
        <p className="text-ink-200 text-sm">
          No video configured yet — set NEXT_PUBLIC_MUX_HERO_PLAYBACK_ID.
        </p>
      )}
    </dialog>
  );
}
