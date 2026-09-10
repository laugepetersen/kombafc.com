import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Icon } from "@/components/ui/icon";
import { Kicker } from "@/components/ui/kicker";
import { LineRise } from "@/components/ui/line-rise";
import { StaggerReveal } from "@/components/ui/stagger-reveal";

/**
 * The rule set, at more than two words.
 *
 * The home page's format grid has a card that says "new rules" and one that
 * says "anyone can follow", and both are claims rather than information. A
 * reader who wants to know what is actually different about a KOMBA fight has
 * nowhere on the site to find out. This is that page's answer, and it is on
 * About rather than on the home page because it is the promotion explaining
 * itself, which is what this route is for.
 *
 * The device is a numbered list on the frame's own rules, not more cards.
 * Six panels with photographs behind them is the format grid again at greater
 * length; a numbered list reads as a rule set, which is the thing it is.
 *
 * The heading sits over a photograph rather than above one. It is the only
 * block on the page that does that, and it is the pivot: everything before it
 * is who KOMBA is, everything after it is what a night is like, and a
 * full-bleed frame with type on it is the loudest way the site says a page has
 * turned a corner.
 *
 * SOURCING. Four of the six rules are KOMBA's own, off the format slides and
 * already on the home page — pros only, small gloves, ground and pound, and
 * cross-sport. The two marked below are written here, extrapolated from
 * "new rules" and "anyone can follow", and the second line of every entry is
 * written here too. None of it is Lauge's. Replace the copy when the real rule
 * set lands; the shape holds whatever it says.
 */

type Rule = {
  title: string;
  body: string;
  /** True where the rule itself, not just its wording, is written here. */
  extrapolated?: boolean;
};

const rules: Rule[] = [
  {
    title: "Professionals only",
    body: "No amateur bouts padding out the card. Everyone who walks to the ring does this for a living, and is matched against someone who does too.",
  },
  {
    title: "Small gloves",
    body: "Closer to what the sport looks like at its sharpest, and closer to what a knockout actually is. It shortens fights, which is the point.",
  },
  {
    title: "Ground and pound",
    body: "The best thing MMA has, allowed inside a striking fight. Nobody else in striking will write this rule. A knockdown stops being a pause.",
  },
  {
    title: "Cross-sport",
    body: "Karate, Thai boxing, kickboxing — whatever you came up in, you meet on the same terms. No style gets its own scoring, and no style gets a home advantage.",
  },
  {
    title: "One scoring standard",
    body: "Not a federation’s glossary with three exceptions in it. One way a round is won, explained on the screens, the same for every fight on the card.",
    extrapolated: true,
  },
  {
    title: "Nothing rewards holding on",
    body: "The rule set is written so that the safe fight is also the boring one. If you are ahead, you still have to go and take the round.",
    extrapolated: true,
  },
];

export function Ruleset() {
  return (
    <>
      {/* Full-bleed, and taller than a band: this is a frame with type set on
          it rather than a strip of decoration, so it needs enough picture above
          the words to still be a photograph. 3:4 on a phone — a landscape crop
          at 375 wide is 280px of letterbox with a heading jammed into it. */}
      <section className="relative isolate flex min-h-125 items-end overflow-hidden md:min-h-150 lg:min-h-175">
        <Image
          src="/show/show-21.webp"
          alt=""
          fill
          sizes="100vw"
          // The kick is dead centre of the frame and the ring floor takes the
          // bottom third, so a centred crop into a tall box on a phone keeps
          // the canvas and loses the leg. Held high, and back to centre once
          // the box is wider than it is tall.
          className="object-cover object-[60%_35%] lg:object-center"
        />

        {/* Two scrims, not one. The vertical is what makes the type legible;
            the flat one under it takes the whole frame down a stop so the
            photograph reads as ground rather than as a picture with a caption
            on it. A single heavier gradient did the first job and left the top
            of the frame at full brightness, which pulled the eye off the
            words. */}
        <div aria-hidden="true" className="bg-void/30 absolute inset-0" />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--color-void) 0%, rgb(5 5 8 / 0.75) 30%, transparent 75%)",
          }}
        />

        <Container className="relative pb-12 md:pb-16 lg:pb-20">
          <Kicker>The rules</Kicker>

          <LineRise
            as="h2"
            className="display-2 mt-6 md:mt-8"
          >
            {/* Forced into two lines, for the reason the page's h1 is: it is
                two halves of one claim, and left to a measure it broke as
                "Short enough to explain" over "between fights." on some widths
                and three ways on others. Both halves fit a 375 column at the
                step's phone size. */}
            <span className="block">Short enough to explain</span>
            <span className="block">between fights.</span>
          </LineRise>

          <p className="text-ink-100 mt-6 max-w-[54ch] text-base leading-[1.5] md:mt-8">
            A KOMBA fight is not a compromise between six rule sets. It is one,
            written from scratch, and it is written to be watched — every line
            in it exists to make the next ninety seconds worth looking at.
          </p>
        </Container>
      </section>

      <Section spacing="lg">
        <div className="flex items-center gap-3">
          <Icon name="gavel" violet className="size-8" />
          <Kicker as="h3">Six things that are different</Kicker>
        </div>

        {/* The list, on the frame's hairline. Each row draws its own top edge
            and the last draws a bottom one, so the run is closed at both ends
            — a ruled list that stops mid-air after its final entry reads as
            content that was cut off. */}
        <StaggerReveal className="mt-8 md:mt-10">
          <ol className="border-rule border-b">
            {rules.map((rule, index) => (
              <li
                key={rule.title}
                className="border-rule grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-2 border-t py-6 md:grid-cols-[auto_18rem_1fr] md:gap-x-8 md:py-8 lg:grid-cols-[auto_22rem_1fr] lg:gap-x-12"
              >
                {/* The numeral, zero-padded, in the eyebrow's violet. Its own
                    column at a fixed width so six of them line up whatever the
                    title beside them does, and set in the heading face —
                    Aeonik's figures are a body face's and read as a list
                    marker where Eurostile's read as a rule number. */}
                <span
                  aria-hidden="true"
                  className="text-chrome-violet font-heading w-8 shrink-0 text-base leading-none font-black italic brightness-125 md:w-10 md:text-xl"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* plain, not display: six italic uppercase titles stacked down
                    a column is a wall, and this list is read rather than
                    announced — the same argument the format card makes. */}
                <h4 className="plain-5 text-white">{rule.title}</h4>

                {/* Starts in the second column when the row stacks, so the body
                    hangs under the title rather than under the numeral. */}
                <p className="text-ink-200 col-start-2 max-w-[62ch] text-base leading-[1.5] md:col-start-3">
                  {rule.body}
                  {rule.extrapolated ? (
                    // Visible, not a code comment, and deliberately so: this is
                    // a rule the site is claiming and KOMBA has not written
                    // yet, and a page that quietly invents a rule is worse than
                    // one that says which line is still a draft. Delete the
                    // flag with the placeholder.
                    <span className="text-ink-400 mt-1 block text-xs tracking-[0.04em] uppercase">
                      Draft wording — awaiting the official rule set
                    </span>
                  ) : null}
                </p>
              </li>
            ))}
          </ol>
        </StaggerReveal>
      </Section>
    </>
  );
}
