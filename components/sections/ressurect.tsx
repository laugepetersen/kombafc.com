import Image from "next/image";

import { SectionFrame } from "@/components/layout/section-frame";
import { Button } from "@/components/ui/button";
import { Kicker } from "@/components/ui/kicker";

/**
 * Spacer module. Carries no content — it exists so the vertical rules keep
 * running between the hero and the module below, and the gap reads as part of
 * the frame rather than as empty page.
 */
export function FrameSpacer({ className }: { className?: string }) {
  return <SectionFrame className={className ?? "h-20"} />;
}

export function Ressurect() {
  return (
    <SectionFrame markers>
      <div className="grid md:grid-cols-2">
        <div className="flex flex-col justify-center bg-violet-200/5 px-6 py-12 md:px-12 md:py-16 lg:px-15 lg:py-20">
          <Kicker>The Ressurect</Kicker>

          <h2 className="text-chrome mt-6 text-xl leading-none font-black tracking-[-0.01em] uppercase italic sm:text-2xl md:mt-8 md:text-3xl lg:text-4xl">
            <span className="text-trim block">We&rsquo;re aiming</span>
            <span className="text-trim mt-[0.14em] block">to set our mark</span>
            <span className="text-trim mt-[0.14em] block">Q1, 2027.</span>
          </h2>

          <div className="text-ink-200 mt-4 flex max-w-96 flex-col gap-4 text-base leading-[1.4] md:mt-4">
            <p>
              We have been silent for almost a year, but not out of the game.
            </p>
            <p>Just needed some time to prepare, for the next big thing..</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 md:mt-12">
            <Button href="/partners">Become Partner</Button>
            <Button href="/about" variant="secondary">
              About Us
            </Button>
          </div>
        </div>

        {/* Square when stacked; from md the grid row stretches it to match the
            text column, which is taller than 1:1 once the copy wraps. */}
        <div className="relative aspect-square max-md:order-first md:aspect-auto">
          <Image
            src="/ressurect.webp"
            alt="A KOMBA fighter in the ring, flags raised after the bout"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </SectionFrame>
  );
}
