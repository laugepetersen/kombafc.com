"use client";

import { useEffect } from "react";

/** Anything that can be pressed. The same set `tap` restricts :active to. */
const CONTROL = "a, button, [role='button']";

/**
 * Past this much travel the touch was a scroll, not a press, and the drawn
 * press is taken back. Chrome fires pointercancel at its own slop boundary and
 * that does most of the work; this catches Safari, which keeps sending moves.
 * 10px is under the 16px it takes most browsers to commit to a pan, so the
 * press lifts before the page starts moving rather than after.
 */
const SLOP = 10;

/**
 * The press, driven from pointer events rather than from `:active`.
 *
 * `tap` was written against `:active`, which is a mouse state. Touch only
 * pretends to have it: iOS Safari does not apply `:active` to a touch at all
 * unless the element happens to carry a touch listener, and Chrome applies it
 * only once it has ruled out a scroll — for a real tap, after the finger has
 * already left. So the whole press repertoire was dead on a phone: the site's
 * one piece of touch feedback, invisible on touch. The header had already had
 * to hand-draw its own press for the language trigger to get around it.
 *
 * One delegated listener rather than a hook per control: `tap` is on links,
 * buttons, the nav pill, the show bar and every card, and none of them should
 * have to know about this.
 *
 * Every `.tap` ancestor of the pressed control is marked, not just the nearest,
 * because that is what the CSS does on a mouse — `:has(:is(a, button):active)`
 * fires on all of them — and touch and mouse should not be two behaviours.
 */
export function TapPress() {
  useEffect(() => {
    let held: HTMLElement[] = [];
    let originX = 0;
    let originY = 0;

    const release = () => {
      if (!held.length) return;
      for (const el of held) el.removeAttribute("data-pressed");
      held = [];
    };

    const onPointerDown = (event: PointerEvent) => {
      // A press already in flight never survives the next one, whatever
      // released it — a pointerup that landed outside the window, say.
      release();
      // Left button only; touch and pen report 0 here as well.
      if (event.button !== 0) return;

      const control = (event.target as Element | null)?.closest?.(CONTROL);
      if (!control) return;

      originX = event.clientX;
      originY = event.clientY;

      for (
        let el = control.closest<HTMLElement>(".tap");
        el;
        el = el.parentElement?.closest<HTMLElement>(".tap") ?? null
      ) {
        el.setAttribute("data-pressed", "");
        held.push(el);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!held.length) return;
      if (Math.hypot(event.clientX - originX, event.clientY - originY) > SLOP) {
        release();
      }
    };

    // Capture on down, so a control that stops propagation cannot swallow the
    // press it is about to perform. The releases are capture too, for the
    // same reason.
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerup", release, true);
    document.addEventListener("pointercancel", release, true);
    // A press held while the page scrolls under it, and a press held while the
    // tab goes away — both end the press and neither sends a pointer event.
    window.addEventListener("scroll", release, true);
    window.addEventListener("blur", release);

    return () => {
      release();
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", release, true);
      document.removeEventListener("pointercancel", release, true);
      window.removeEventListener("scroll", release, true);
      window.removeEventListener("blur", release);
    };
  }, []);

  return null;
}
