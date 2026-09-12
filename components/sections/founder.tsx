import Image from "next/image";

import { Section } from "@/components/layout/section";
import { SectionFrame } from "@/components/layout/section-frame";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Kicker } from "@/components/ui/kicker";
import { LineRise } from "@/components/ui/line-rise";
import { StaggerReveal } from "@/components/ui/stagger-reveal";
import {
  honours,
  intro,
  portrait,
  pullQuote,
  role,
  story,
} from "@/content/founder";

/**
 * Youssef Assouik, at the length a front figure is owed.
 *
 * The page's one portrait block, and the only place on the site where a person
 * gets more than a chip. That is the point of it: everything above this is
 * KOMBA arguing for itself, and an argument is worth less than the person
 * standing behind it. The three founder chips introduce the three; this says
 * which of them the room already knows.
 *
 * Two modules rather than one long panel:
 *
 * 1. The portrait and the prose, side by side — the site's text-and-image
 *    block on a taller floor, because this photograph is 2:3 and the vision
 *    block's is 3:2.
 * 2. The belts, as a ruled list, ending on the way through to the press page.
 *
 * Split because they are read differently. Prose is read; a list of belts is
 * checked. One panel holding both would set the scannable half at reading
 * width.
 *
 * Every fact here comes off `content/founder.ts`, which carries the source for
 * each one in a comment beside it. Nothing checkable about a living person is
 * written in this file.
 */

/** Half the 1280 column at the widest, the whole of it once the row stacks. */
const SIZES = "(min-width: 1024px) 640px, 100vw";

export function Founder() {
  return (
    <>
      {/* Draws its own top edge. The block above it is a plain Section with no
          rule of its own, so `first:` has nothing to hand this one. */}
      <SectionFrame outerClassName="[&>[data-frame-rule]]:border-t">
        <div className="grid lg:grid-cols-2">
          {/* 3:4 on a phone rather than the vision block's square: this is a
              standing portrait on a studio backdrop, and a square crop of it
              takes his head off or his belts off depending on where it holds.
              From lg the copy sets the row's height and the picture fills it,
              with a floor under it because a fill image contributes none. */}
          <div className="bg-ink-800 relative aspect-[3/4] max-lg:order-first lg:aspect-auto lg:min-h-160">
            <Image
              src={portrait.src}
              alt={portrait.alt}
              fill
              sizes={SIZES}
              priority={false}
              // Held high. The frame is 2:3 and the column from lg is taller
              // than it is wide but not by that much, so a centred crop starts
              // eating the top of his head before it takes anything off the
              // belts.
              className="object-cover object-[50%_20%]"
            />
          </div>

          <div className="border-rule bg-panel flex flex-col justify-center border-t px-6 py-12 md:px-12 md:py-16 lg:border-t-0 lg:border-l lg:px-12 xl:px-15 xl:py-20">
            <LineRise as="h2" text="Youssef Assouik." className="display-2" />

            {/* The billing, straight under the name and set apart from the
                prose — it is a caption on the heading rather than the first
                line of the story, and at body size in ink-200 it would read as
                the latter. */}
            <p className="font-body text-chrome-violet mt-4 text-sm leading-[1.4] font-medium tracking-[0.04em] uppercase brightness-125">
              {role}
            </p>

            <p className="text-ink-100 mt-6 max-w-[46ch] text-base leading-[1.5] md:mt-8">
              {intro}
            </p>

            {/* The rule is on the left and the quote is set in from it, which
                is the one place on the page a hairline is used as punctuation
                rather than as a seam. A blockquote with no mark on it reads as
                a paragraph that has changed its mind about being italic. */}
            <blockquote className="border-rule mt-8 border-l-2 pl-5 md:mt-10 md:pl-6">
              <p className="font-heading text-lg leading-[1.3] font-bold text-white italic md:text-xl">
                “{pullQuote.text}”
              </p>
              <footer className="text-ink-300 mt-3 text-sm">
                {pullQuote.attribution}
              </footer>
            </blockquote>

            {/* space-y rather than a margin on each paragraph: they are one
                run of prose and the gap between them is a property of the run.
                24px, which is the reading rhythm the news detail pages use —
                32 opens a column of three paragraphs into three blocks. */}
            <div className="mt-8 space-y-6 md:mt-10">
              {story.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-ink-200 max-w-[52ch] text-base leading-[1.5]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </SectionFrame>

      <Section spacing="lg">
        <div className="flex items-center gap-3">
          <Icon name="military_tech" violet className="size-8" />
          <Kicker as="h3">The belts</Kicker>
        </div>

        {/* Two columns from lg, and the list fills them column-first rather
            than row-first — `columns` keeps the years running down one side
            and then down the other, where a grid would deal them left, right,
            left and break the chronology in half at every row. */}
        <StaggerReveal className="mt-8 md:mt-10">
          <ol className="lg:columns-2 lg:gap-12">
            {honours.map((honour) => (
              <li
                key={`${honour.year}-${honour.body}-${honour.division ?? ""}`}
                // break-inside so a two-line entry is never split across the
                // fold of the two columns.
                className="border-rule flex break-inside-avoid items-baseline gap-4 border-t py-4 md:gap-6 md:py-5"
              >
                {/* Fixed width so the seven years form a column of their own
                    and the titles all start on the same line. tabular-nums
                    would be the belt and braces, but Aeonik's figures are
                    already even width — the box is what does the work. */}
                <span className="text-chrome-violet font-heading w-14 shrink-0 text-sm font-bold brightness-125 md:text-base">
                  {honour.year}
                </span>

                <span className="min-w-0">
                  <span className="font-body block text-base leading-[1.3] font-medium text-white">
                    {honour.body} {honour.title}
                  </span>
                  <span className="text-ink-300 mt-1 block text-sm leading-[1.4]">
                    {[honour.division, honour.note].filter(Boolean).join(" · ")}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </StaggerReveal>

        {/* The way out. The press page is where the claims on this block are
            answered by somebody who is not us, which is the whole reason to
            send a reader there rather than repeat the articles here. */}
        <div className="border-rule mt-10 border-t pt-10 md:mt-12 md:pt-12">
          <p className="text-ink-200 max-w-[52ch] text-base leading-[1.5]">
            DR and TV 2 have both spent a piece on him — on the belts, and more
            often on the gym. Their words, on their pages.
          </p>
          <Button href="/news" variant="outline-white" className="mt-6">
            Read the coverage
          </Button>
        </div>
      </Section>
    </>
  );
}
