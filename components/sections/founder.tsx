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
  milestones,
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
 * Three modules rather than one long panel:
 *
 * 1. The portrait and the prose, side by side — the site's text-and-image
 *    block on a taller floor, because this photograph is 2:3 and the vision
 *    block's is 3:2.
 * 2. The milestones, four across on the show bar's own device — a fact and one
 *    line saying what it is.
 * 3. The belts, as a ruled list, ending on the way through to the press page.
 *
 * Split because they are read differently. Prose is read; a strip of facts is
 * scanned; a list of belts is checked. One panel holding all three would set
 * the scannable parts at reading width and bury the numbers in the middle of
 * a column.
 *
 * Every fact here comes off `content/founder.ts`, which carries the source for
 * each one in a comment beside it. Nothing checkable about a living person is
 * written in this file.
 */

/** Half the 1280 column at the widest, the whole of it once the row stacks. */
const SIZES = "(min-width: 1024px) 640px, 100vw";

/**
 * Where the strip's own rules go, and it is all here rather than on the cell.
 *
 * A cell cannot know this. Which of the four starts a row, which one closes
 * it, and which sit in the row that has the frame's own seam above them are
 * all facts about the grid at a given width — one column on a phone, two at
 * md, four at lg — and a cell that writes `not-first:border-l` is guessing at
 * every one of them. That guess was wrong at md: it put a vertical rule down
 * the left of the third cell, which starts the second row, and took the
 * horizontal rule off the top of that row entirely.
 *
 * So the rules are set from the container, one line per fact:
 *
 * - every cell draws its own top rule…
 * - …except the ones in the top row, whichever cells those are at that width,
 *   because the frame above this one has already drawn that line and two
 *   translucent hairlines on the same pixel read as one twice as bright;
 * - a vertical rule goes on every cell that is *not* the start of its row;
 * - and the padding follows the vertical rule, so a cell only carries the
 *   inset on the side it has an edge to stand off.
 */
const STRIP = [
  "grid md:grid-cols-2 lg:grid-cols-4",
  "[&>*]:border-rule [&>*]:border-t",
  // Top row: child 1 on a phone, 1–2 at md, all four at lg.
  "[&>*:first-child]:border-t-0",
  "md:[&>*:nth-child(2)]:border-t-0",
  "lg:[&>*:nth-child(n+3)]:border-t-0",
  // Everything that differs between two and four columns is written
  // `md:max-lg:`, scoped to the two-column band alone, rather than as an md
  // rule that a wider one has to undo. Two utilities setting the same property
  // in two media queries resolve by the order Tailwind happens to emit them,
  // not by which breakpoint is narrower: `md:…pl-0` beat `lg:…pl-8` and left
  // the third cell's copy sitting on its own divider. Scoped, there is nothing
  // to win — only one of the two rules is ever live.
  "md:[&>*]:px-8",
  // Not the start of a row, so it stands off a rule: 2 and 4 at md, 2–4 at lg.
  "md:max-lg:[&>*:nth-child(even)]:border-l",
  "lg:[&>*:not(:first-child)]:border-l",
  // The starts and ends of rows, which is where the inset comes back off. One
  // and four are a row's ends at every width; two and three only at md.
  "[&>*:first-child]:pl-0 [&>*:last-child]:pr-0",
  "md:max-lg:[&>*:nth-child(2)]:pr-0 md:max-lg:[&>*:nth-child(3)]:pl-0",
].join(" ");

function Milestone({ label, detail }: { label: string; detail: string }) {
  return (
    // Vertical rhythm only. Every rule and every horizontal inset on this cell
    // is the strip's — see STRIP.
    <div className="flex flex-col py-6 md:py-8">
      {/* plain, not display: four of these in a row at the poster's weight is
          a headline four times over, and the strip is meant to be scanned
          under the block it belongs to rather than announced beside it. */}
      <p className="plain-5 text-white">{label}</p>
      <p className="text-ink-200 mt-2 max-w-[24ch] text-sm leading-[1.4]">
        {detail}
      </p>
    </div>
  );
}

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
            <Kicker>Front figure</Kicker>

            <LineRise
              as="h2"
              text="Youssef Assouik."
              className="display-2 mt-6 md:mt-8"
            />

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

      {/* The milestones, on the frame so the strip's own dividers meet the
          column's verticals rather than floating inside them. */}
      <SectionFrame>
        <div className={STRIP}>
          {milestones.map((milestone) => (
            <Milestone key={milestone.label} {...milestone} />
          ))}
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
                    {[honour.division, honour.note]
                      .filter(Boolean)
                      .join(" · ")}
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
