"use client";

import { useActionState, useEffect, useRef } from "react";

import { type NotifyState, subscribeToAnnouncements } from "@/app/actions";
import { Button, type ButtonSize } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

/**
 * One frosted well with the CTA seated inside it: 4px of clearance on every
 * side, which is the shell's own padding on three of them and the field's
 * edge on the fourth.
 *
 * Right angles throughout, on the well and on the CTA both. The site's corner
 * treatments are the chamfer and the pill, and a radius here would be a third
 * one introduced for a single control.
 *
 * 44px control, 52px well, 54 across the hairline.
 */
const shell = cn(
  "flex flex-col gap-1 border p-1 backdrop-blur-[12px]",
  "sm:flex-row sm:items-center",
  "border-rule bg-white/5",
  // The field itself has no ring — it hands its focus state up to the well, so
  // what lights up is the whole control rather than a box inside a box.
  "transition-colors duration-200 focus-within:border-white/40",
);

/**
 * The form's own box, which is a well only from `sm` up.
 *
 * Seating the CTA inside the well is a row idea. Stacked, it put a filled
 * violet bar inside a 4px frosted frame — the button wearing the well as a
 * mount, with a hairline tracing it 4px out on three sides and the field
 * sitting on top like a second control in the same box. Two controls in one
 * frame reads as one control, which is the opposite of what a form wants on a
 * phone.
 *
 * So below `sm` the form carries no border at all. It is a column, the field
 * brings its own well (`fieldWell`), and the CTA stands free underneath at a
 * 12px gap — outside the frame, plainly a separate thing to press.
 */
const formShell = cn(
  "flex flex-col gap-3",
  "sm:flex-row sm:items-center sm:gap-1",
  "sm:border-rule sm:border sm:bg-white/5 sm:p-1 sm:backdrop-blur-[12px]",
  "sm:transition-colors sm:duration-200 sm:focus-within:border-white/40",
);

/**
 * The field's well below `sm`, and nothing at all from `sm` up.
 *
 * `sm:contents` drops the wrapper out of the layout entirely at the
 * breakpoint, so the input goes back to being a direct flex child of the form
 * and seats itself in the form's well exactly as it did before. One input, two
 * arrangements, and no second copy of it to keep in step.
 */
const fieldWell = cn(
  "flex border p-1 backdrop-blur-[12px]",
  "border-rule bg-white/5",
  "transition-colors duration-200 focus-within:border-white/40",
  "sm:contents",
);

/**
 * `size` is the CTA's, and the well follows it: the shell is 4px of clearance
 * around whatever the control is, so a 36px button gives a 44px well where a
 * 44px one gives 52. A hold page takes the larger — the form is that page's
 * whole purpose — and the footer takes the smaller, where it sits beside a
 * heading rather than under one.
 *
 * `source` is which form this is, carried through to the record the webhook
 * writes. It has a default because the footer's copy asks the same thing on
 * every page and there is nothing more specific to say about it; the holds
 * each pass their own, because for them the page *is* the question.
 */
export function NotifyForm({
  size = "default",
  source = "footer",
  className,
}: {
  size?: ButtonSize;
  source?: string;
  className?: string;
}) {
  // The CTA's own heights, to the class, because the field and the button sit
  // in one shell and any drift between them shows as a step in the middle of
  // it. See the note on `sizes` in button.tsx.
  const control = size === "sm" ? "h-9" : "h-11";
  const [state, action, pending] = useActionState<NotifyState, FormData>(
    subscribeToAnnouncements,
    { status: "idle" },
  );

  const confirmationRef = useRef<HTMLDivElement>(null);

  // The submit button is what had focus, and it is gone the moment this
  // succeeds — leaving the keyboard back at the top of the document. Focus
  // follows the replacement instead, which is also what reads it out.
  useEffect(() => {
    if (state.status === "ok") confirmationRef.current?.focus();
  }, [state.status]);

  const failed = state.status === "error";

  return (
    <div className={cn("w-full max-w-lg", className)}>
      {state.status === "ok" ? (
        <div
          ref={confirmationRef}
          role="status"
          tabIndex={-1}
          className={cn(shell, "outline-none")}
        >
          <div
            className={cn(
              "flex w-full items-center justify-center gap-3",
              control,
            )}
          >
            {/* The violet ramp off the shared paint server, not a flat
                violet-300 — every purple on the site is the one gradient. */}
            <Icon name="mark_email_read" violet className="size-5" />
            <p className="font-body text-sm font-medium tracking-[0.02em]">
              You are on the list. Watch your inbox.
            </p>
          </div>
        </div>
      ) : (
        <form action={action} className={formShell}>
          <label htmlFor="notify-email" className="sr-only">
            Email address
          </label>

          <div className={fieldWell}>
            {/* min-w-0 so the field can be squeezed by the button rather than
                forcing the shell wider than its container — a flex item
                defaults to min-width:auto, which for an input is its size
                attribute. */}
            <input
              id="notify-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="your@email.com"
              disabled={pending}
              aria-invalid={failed || undefined}
              aria-describedby="notify-message"
              className={cn(
                "placeholder:text-ink-300 font-body w-full min-w-0 flex-1 bg-transparent px-4 text-base text-white outline-none disabled:opacity-60",
                // 16px on a phone, and it is the browser's number rather than
                // ours. Safari zooms the page in on any field it is about to
                // focus that sets its text under 16px, and does not zoom back
                // out afterwards — so filling this in left the reader on a
                // magnified page with the header off the side of it. The scale
                // puts `text-base` at 15, one short. Held to the scale from md,
                // where nothing zooms.
                "max-md:text-[16px]",
                control,
              )}
            />
          </div>

          {/* Which form this is. Hidden, so it rides along with the address
              and the action does not have to be told twice — but hidden means
              client-supplied, and the action treats it as such. */}
          <input type="hidden" name="source" value={source} />

          {/* Invisible to people and to assistive tech, and out of the tab
              order — see the honeypot note in the action. `hidden` rather than
              off-screen positioning: a display:none input is still submitted,
              so the trap works without leaving a real field on the page. */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          {/* A floor rather than a fixed width, and only as wide as the
              longer of the two labels needs — it is here so the well does not
              resize the moment "Notify me" becomes "Sending", not to pad the
              control out. At 36 it was doing the second thing. */}
          <Button
            type="submit"
            size={size}
            disabled={pending}
            className="disabled:opacity-70 max-sm:w-full sm:min-w-28 sm:shrink-0"
          >
            {pending ? "Sending" : "Notify me"}
          </Button>
        </form>
      )}

      {/* Errors only, and empty the rest of the time — but always rendered. A
          live region has to be in the document before its content changes to
          be announced when it does, so this cannot be mounted on demand. Empty
          it collapses to nothing, which is why the margin is conditional too:
          on a zero-height box it would otherwise still push the readout down
          by 12px for a message that is not there. Not `hidden` either — a
          display:none region is not reliably announced when it comes back. */}
      <p
        id="notify-message"
        aria-live="polite"
        className={cn("text-destructive text-xs", failed && "mt-3")}
      >
        {failed ? state.message : null}
      </p>
    </div>
  );
}
