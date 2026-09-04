import { EncryptedText } from "@/components/ui/encrypted-text";
import { cn } from "@/lib/utils";

/**
 * Bracketed section label. The brackets are the Figma asset, mirrored in CSS
 * for the closing side — both sides export as the same glyph.
 */
export function Kicker({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <p className={cn("flex items-center gap-2", className)}>
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
    </p>
  );
}
