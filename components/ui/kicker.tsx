import type { ElementType } from "react";

import { EncryptedText } from "@/components/ui/encrypted-text";
import { cn } from "@/lib/utils";

/**
 * Bracketed section label. The brackets are the Figma asset, mirrored in CSS
 * for the closing side — both sides export as the same glyph.
 */
export function Kicker({
  children,
  as,
  className,
}: {
  children: string;
  /** Labelling a section rather than sitting above one? Then it is a heading. */
  as?: ElementType;
  className?: string;
}) {
  const Comp = (as ?? "p") as ElementType;

  return (
    // brightness-125 so the brackets and the type come up together. It was
    // here to match the outline CTA, which wore the same lift at rest; that
    // button is white now and the eyebrow is where the violet family lives,
    // so the lift is its own.
    <Comp className={cn("flex items-center gap-2 brightness-125", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size
          decorative rule; next/image would add a wrapper and a second hop. */}
      <img
        src="/brand/bracket.svg"
        alt=""
        width={8}
        height={22}
        aria-hidden="true"
        // React preloads every eager image it renders on the server, and a
        // `<link rel="preload" as="image">` for this one went into the head of
        // every page on the site. Most of them do not have an eyebrow above
        // the fold, so the preload sat there unclaimed and Chrome warned about
        // it once per bracket — three times a page, on a 1.5KB decoration.
        //
        // `lazy` is React's own opt-out: it preloads eager images only. The
        // cost is that a bracket on a hold page fetches after layout rather
        // than before it, which for two 8x22 glyphs beside a word is not a
        // thing anybody sees — and it is one request, cached from then on.
        loading="lazy"
        className="h-[22px] w-2 -scale-x-100"
      />
      <EncryptedText
        text={children}
        // Quicker than the component's own default: a label is short, and at
        // 80ms a decrypt that reads well on a heading drags on three words.
        revealDelayMs={60}
        flipDelayMs={60}
        className="text-chrome-violet font-body text-sm leading-none font-medium tracking-[0.06em] uppercase"
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
      <img
        src="/brand/bracket.svg"
        alt=""
        width={8}
        height={22}
        aria-hidden="true"
        // See the note on its mirror above.
        loading="lazy"
        className="h-[22px] w-2"
      />
    </Comp>
  );
}
