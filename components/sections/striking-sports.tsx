import { Fragment } from "react";

import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

/**
 * The band of sport names, full-bleed, running on a loop.
 *
 * It was written inside the About page's arena block and is on two pages now —
 * there and above the home page's footer — so it lives here instead. Two copies
 * of one band is two places to retune the gap, the speed and the stroke, and
 * one of them to forget.
 */

/**
 * Lauge's list, in his order, and no longer a placeholder — this used to carry
 * nine names of which only three had ever been in a KOMBA ring, which on the
 * front page read as billing a card the matchmaking had not booked.
 *
 * `K-1` rather than the `K1` it was given as: that is how the rest of the site
 * spells it, including the `Discipline` type the fight archive is filed under
 * in `content/videos.ts`. One spelling or the search for it finds half the
 * fights.
 */
const disciplines = [
  "Muay Thai",
  "K-1",
  "Kickboxing",
  "Taekwondo",
  "Boxing",
  "Karate",
];

/**
 * Strict alternation cannot tile over an odd number of names.
 *
 * The marquee's track is the row followed by a copy of itself, so the last name
 * in the row sits next to the first. At nine names that put a fill against a
 * fill once a lap — `Lethwei` then `Muay Thai`, dead on the seam, which is the
 * one place the loop is meant to be invisible.
 *
 * Six tiles cleanly, so this does nothing today. It is here because the list
 * has been edited twice already and the next odd one would bring the double
 * back silently: no error, no warning, just a band that looks slightly wrong
 * once every fifty seconds. Doubling the row makes any length even.
 */
const needsPad = disciplines.length % 2 === 1;

/**
 * Tuned at 52 seconds for the nine names this started with, and held per name
 * so the band travels at the same speed whatever the list becomes. A shorter
 * row on the same duration is a slower marquee, which is not what shortening
 * the list was for.
 */
const SECONDS_PER_NAME = 52 / 9;

/**
 * Shared by both faces of the name. Written out once and joined with a
 * template literal rather than `cn` — `text-trim`, `text-white/80` and
 * `text-transparent` are all `text-*`, and merging those leaves only the last.
 * See CLAUDE.md.
 *
 * `text-trim` is what makes the band centre properly. These are all caps, so
 * there is nothing under the baseline: inside an untrimmed line box the glyphs
 * take the top of it and the font's whole descent sits empty underneath, which
 * centres the *box* and leaves the words riding high in it. Measured at the old
 * setting: 40px of padding above and below, and the caps still 5.4px north of
 * the band's middle. Trimming the box to cap height and the baseline makes the
 * box and the letters the same thing, so centring one centres the other.
 *
 * `leading-[1.2]` stays underneath it as the fallback. Where `text-box` is not
 * supported the trim does nothing and this is the line height that keeps
 * Eurostile Black Italic's caps and its 1px stroke inside the marquee's
 * `overflow-hidden` — which is what shaved the top off every outlined word when
 * this was set to `leading-none`.
 */
const NAME =
  "font-heading text-trim text-xl leading-[1.2] font-black whitespace-nowrap uppercase italic md:text-3xl xl:text-4xl";

/**
 * Solid and hollow, alternating. Purely rhythm: a row of names in one colour is
 * a band of texture the eye slides off, and the outline is the poster device
 * the wordmark already uses. No claim is encoded in which is which — being
 * outlined does not make a sport a lesser one.
 *
 * The stroke goes on with a transparent fill, so the glyph is its own outline
 * rather than a second copy sitting behind it.
 *
 * `position`, not the index within the list: the padded copy continues the
 * count rather than restarting it, which is the whole point of the pad.
 */
function Name({ name, position }: { name: string; position: number }) {
  return (
    <span
      className={
        position % 2 === 0
          ? `${NAME} text-white/80`
          : `${NAME} text-transparent [-webkit-text-stroke:1px_var(--color-ink-400)]`
      }
    >
      {name}
    </span>
  );
}

export function StrikingSports({ className }: { className?: string }) {
  const names = needsPad ? [...disciplines, ...disciplines] : disciplines;

  return (
    // Full-bleed, and the only thing on its line — no label over it either,
    // because a row of sport names is not a list that needs introducing. A band
    // that stops at the 1280 column is a widget; run to both edges it is the
    // page saying the words.
    //
    // Rules are the caller's, because the two placements sit in different
    // company. On About it is a strip laid between two ordinary sections and
    // draws both its own edges. On the home page it draws only the top one and
    // lets the footer's own `border-t` close it — every seam on this site
    // carries exactly one hairline, and two translucent 1px rules a pixel apart
    // composite to a 2px one.
    <section
      aria-label="The striking sports"
      className={cn("border-rule overflow-hidden py-8 md:py-10", className)}
    >
      <Marquee
        durationSeconds={SECONDS_PER_NAME * names.length}
        // 40px between names on a phone, 64 from md — set on the row rather
        // than left at the component's 60px default, which is tuned for
        // sponsor marks rather than for words that already carry their own
        // side bearings.
        //
        // `py-1` is the slack the trim takes away. A trimmed box stops at the
        // cap and the baseline, and the marquee clips to it — so the 1px
        // stroke on the outlined names, and the italic overshoot, would be
        // shaved off the moment the box got honest. 4px either side is enough
        // for both and is invisible against the section's own padding.
        gapClassName="gap-10 py-1 pe-10 md:gap-16 md:pe-16"
      >
        {names.map((name, position) => {
          const span = (
            <Name key={`${name}-${position}`} name={name} position={position} />
          );

          // The padded half is the same names over again, so it is hidden from
          // assistive tech — read out, the band would list every sport twice.
          // Only the pad: the marquee hides its own duplicate already.
          return needsPad && position >= disciplines.length ? (
            <Fragment key={`${name}-${position}`}>
              <span aria-hidden="true" className="contents">
                {span}
              </span>
            </Fragment>
          ) : (
            span
          );
        })}
      </Marquee>
    </section>
  );
}
