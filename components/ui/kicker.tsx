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
        className="h-[22px] w-2 -scale-x-100"
      />
      <EncryptedText
        text={children}
        // Quicker than the component's own default: a label is short, and at
        // 80ms a decrypt that reads well on a heading drags on three words.
        revealDelayMs={60}
        flipDelayMs={60}
        className="text-chrome-violet font-body text-[0.8125rem] leading-none font-medium tracking-[0.06em] uppercase"
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
      <img
        src="/brand/bracket.svg"
        alt=""
        width={8}
        height={22}
        aria-hidden="true"
        className="h-[22px] w-2"
      />
    </Comp>
  );
}
