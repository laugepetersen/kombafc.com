import Image from "next/image";
import type { ReactNode } from "react";

import { PixelNoise } from "@/components/effects/pixel-noise";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { CardStack } from "@/components/ui/card-stack";
import {
  BlurRise,
  LineReveal,
  ScrollFill,
} from "@/components/ui/heading-reveal";
import { Kicker } from "@/components/ui/kicker";
import { PersonCard } from "@/components/ui/person-card";
import {
  StaggerReveal,
  type StaggerVariant,
} from "@/components/ui/stagger-reveal";
import { team } from "@/content/team";

export const metadata = { title: "Styleguide" };

const typeScale = [
  "text-7xl",
  "text-6xl",
  "text-5xl",
  "text-4xl",
  "text-3xl",
  "text-2xl",
  "text-xl",
  "text-lg",
  "text-base",
  "text-sm",
  "text-xs",
];

/* Literal class strings, not `bg-${token}`. Tailwind scans source text for
   complete class names, so anything assembled at runtime is never generated
   and the swatch renders with no colour at all. */
const inkRamp = [
  ["void", "bg-void"],
  ["900", "bg-ink-900"],
  ["800", "bg-ink-800"],
  ["700", "bg-ink-700"],
  ["600", "bg-ink-600"],
  ["500", "bg-ink-500"],
  ["400", "bg-ink-400"],
  ["300", "bg-ink-300"],
  ["200", "bg-ink-200"],
  ["100", "bg-ink-100"],
];

const violetRamp = [
  ["950", "bg-violet-950"],
  ["900", "bg-violet-900"],
  ["800", "bg-violet-800"],
  ["700", "bg-violet-700"],
  ["600", "bg-violet-600"],
  ["500", "bg-violet-500"],
  ["400", "bg-violet-400"],
  ["300", "bg-violet-300"],
  ["200", "bg-violet-200"],
];

/** Module scope: passed inline these would be new arrays on every render, and
 *  PixelNoise would rebuild its grid on each one. */
const REVEAL_TEXT = "We're aiming to set our mark Q1, 2027.";
const REVEAL_LINES = ["We're aiming to set", "our mark Q1, 2027."];

/* Composed with a template literal, not `cn`. tailwind-merge files every
   unrecognised `text-*` class under text-colour, so `cn(..., "text-relief")`
   beside `text-paint-room` drops one of the two without a word. */
const revealHeading =
  "font-heading text-2xl font-black uppercase italic md:text-3xl";

const blockVariants: {
  variant: StaggerVariant;
  title: string;
  note: string;
}[] = [
  {
    variant: "crop",
    title: "crop",
    note: "Each element rides up out of its own mask, so it reads as landing rather than arriving. The clip is dropped once a piece has settled — left on, it would cut the CTAs' glow.",
  },
  {
    variant: "fade",
    title: "fade",
    note: "Opacity only. Nothing moves, which is the quietest of the three and the safest above the fold, where movement competes with the hero.",
  },
  {
    variant: "rise",
    title: "rise",
    note: "A fade with 12px of travel — just enough to give it a direction without reading as motion. The middle setting.",
  },
];

const VIOLET = ["#7a1fff", "#9d5cff", "#c0a0ff", "#5311c4"];
const WHITE = ["#ffffff", "#d2d2d7", "#a3a3ac"];
const SPARSE = [0, 0, 0, 0, 0, 0.08, 0.16, 0.3];

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Section spacing="md" className="border-rule border-b">
      <Kicker as="h2" className="mb-8">
        {title}
      </Kicker>
      {children}
    </Section>
  );
}

function Note({ children }: { children: ReactNode }) {
  return <p className="text-ink-300 mb-4 max-w-[60ch] text-sm">{children}</p>;
}

function Ramp({ tokens, label }: { tokens: string[][]; label: string }) {
  return (
    <div className="mb-8">
      <p className="text-ink-300 mb-3 font-mono text-xs uppercase">{label}</p>
      <div className="ring-rule flex overflow-hidden rounded-md ring-1">
        {tokens.map(([name, className]) => (
          <div key={name} className={`${className} h-20 flex-1`} />
        ))}
      </div>
      <div className="mt-2 flex">
        {tokens.map(([name]) => (
          <code
            key={name}
            className="text-ink-400 flex-1 font-mono text-[10px]"
          >
            {name}
          </code>
        ))}
      </div>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <main className="pt-32">
      <Section spacing="md">
        <h1 className="text-chrome text-paint-room text-4xl font-black uppercase italic md:text-6xl">
          KOMBA foundation
        </h1>
      </Section>

      <Block title="Fonts">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-ink-300 mb-2 font-mono text-xs uppercase">
              Eurostile — headings
            </p>
            <p className="font-heading text-4xl font-black uppercase italic">
              Komba Fight Club
            </p>
            <Note>
              Licensed, so the files ship with the repo. Loaded through
              next/font/local in Bold and Black, roman and italic.
            </Note>
          </div>
          <div>
            <p className="text-ink-300 mb-2 font-mono text-xs uppercase">
              Google Sans Flex — body
            </p>
            <p className="font-body text-2xl">Komba Fight Club</p>
            <Note>
              Variable, self-hosted through next/font/google, so there is no
              request to fonts.googleapis.com on load.
            </Note>
          </div>
        </div>
      </Block>

      <Block title="Type scale">
        <Note>
          Modular scale off a 16px base. Every step is a calc() chain from
          <code className="text-violet-300"> --text-ratio</code>, currently
          1.250, so swapping the ratio rescales the whole site. Headings sit on
          100% leading and are trimmed to cap height.
        </Note>
        <div className="flex flex-col gap-4">
          {typeScale.map((step) => (
            <div key={step} className="flex items-baseline gap-6">
              <code className="w-24 shrink-0 font-mono text-xs text-violet-400">
                {step}
              </code>
              <span className={`${step} font-heading truncate`}>
                Komba Fight Club
              </span>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Colour">
        <Note>
          Note the ink ramp runs light-numbered = light, so ink-100 is the
          palest and ink-900 the darkest, with void beneath it.
        </Note>
        <Ramp label="Ink" tokens={inkRamp} />
        <Ramp label="Violet" tokens={violetRamp} />
      </Block>

      <Block title="Calls to action">
        <div className="flex flex-wrap items-center gap-4">
          <Button href="#">Become Partner</Button>
          <Button href="#" variant="secondary">
            About Us
          </Button>
        </div>
        <Note>
          Primary is filled, secondary is an outline and carries no fill at any
          state. Both follow the cursor slightly and brighten on hover; the
          primary also lights a dot field inside itself, which runs only for as
          long as the hover lasts. The pull is skipped under reduced motion.
        </Note>
      </Block>

      <Block title="Text treatments">
        <div className="flex flex-col gap-8">
          <div>
            <code className="text-ink-400 font-mono text-xs">.text-chrome</code>
            <p className="text-chrome text-paint-room font-heading mt-2 text-4xl font-black uppercase italic">
              A new fight format
            </p>
            <Note>
              Gradient fill whose angle rocks between the two diagonals, so the
              light appears to move across the type. Painted with
              background-clip, which is why headings using it need
              <code className="text-violet-300"> .text-paint-room</code> — glyph
              parts outside the box would otherwise go unpainted.
            </Note>
          </div>
          <div>
            <code className="text-ink-400 font-mono text-xs">
              .text-chrome-violet
            </code>
            <div className="mt-2">
              <Kicker>The Ressurect</Kicker>
            </div>
          </div>
        </div>
      </Block>

      <Block title="Dot field">
        <Note>
          A flickering dot matrix on a 2D canvas. Drawn at a fixed low frame
          rate, skipped entirely while off-screen or the tab is hidden, and
          static under prefers-reduced-motion.
        </Note>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 font-mono text-xs text-violet-400 uppercase">
              Violet
            </p>
            <div className="bg-void h-56 overflow-clip">
              <PixelNoise />
            </div>
          </div>
          <div>
            <p className="mb-3 font-mono text-xs text-violet-400 uppercase">
              White
            </p>
            <div className="bg-void h-56 overflow-clip">
              <PixelNoise colors={WHITE} />
            </div>
          </div>
          <div>
            <p className="mb-3 font-mono text-xs text-violet-400 uppercase">
              Over a photograph — screen
            </p>
            <div className="bg-void relative isolate h-56 overflow-clip">
              <Image
                src="/ressurect.webp"
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0">
                <PixelNoise
                  className="mix-blend-screen"
                  colors={VIOLET}
                  opacities={SPARSE}
                />
              </div>
            </div>
          </div>
          <div>
            <p className="mb-3 font-mono text-xs text-violet-400 uppercase">
              Over the video — screen
            </p>
            <div className="bg-void relative isolate h-56 overflow-clip">
              <video
                src="/hero-loop.mp4"
                poster="/hero-poster.webp"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0">
                <PixelNoise
                  className="mix-blend-screen"
                  colors={WHITE}
                  pitch={5}
                  churn={0.18}
                  opacities={SPARSE}
                  fadeUpwards={false}
                />
              </div>
            </div>
          </div>
        </div>
      </Block>

      <Block title="Heading motion">
        <Note>
          Three arrivals, all on the same string and the same type treatment so
          the only difference is the motion. Each one replays whenever it comes
          back into view, so scrolling up and down compares them. All hold still
          under prefers-reduced-motion. The animation components carry no type
          styling of their own — the size and treatment come from the class you
          pass them.
        </Note>
        <div className="flex flex-col gap-12">
          <div>
            <code className="text-ink-400 font-mono text-xs">
              &lt;LineReveal&gt;
            </code>
            <div className="mt-3">
              <LineReveal
                lines={REVEAL_LINES}
                className={`${revealHeading} text-relief`}
              />
            </div>
            <Note>
              Each line rides up out of its own mask, the second a beat behind
              the first. Nothing moves but the type, and it travels only just
              past its own height, so it reads as being uncovered rather than
              flying in.
            </Note>
          </div>
          <div>
            <code className="text-ink-400 font-mono text-xs">
              &lt;ScrollFill&gt;
            </code>
            <div className="mt-3">
              <ScrollFill
                text={REVEAL_TEXT}
                className={`${revealHeading} text-relief text-paint-room`}
              />
            </div>
            <Note>
              Tied to scroll position rather than played on entry, so it runs at
              whatever pace you scroll and reverses on the way back up. The
              bloom in
              <code className="text-violet-300"> .text-relief</code> is mixed
              off the fill, so it greys out with the type instead of leaving
              grey words inside a white halo.
            </Note>
          </div>
          <div>
            <code className="text-ink-400 font-mono text-xs">
              &lt;BlurRise&gt;
            </code>
            <div className="mt-3">
              <BlurRise
                text={REVEAL_TEXT}
                className={`${revealHeading} text-relief text-paint-room`}
              />
            </div>
            <Note>
              Per word rather than per line, so it suits a heading that wraps
              unpredictably. The blur is the expensive part — a heading is fine,
              a paragraph would not be.
            </Note>
          </div>
        </div>
      </Block>

      <Block title="Block motion">
        <Note>
          A text block arriving one element at a time — kicker, heading, copy,
          buttons — played when the block reaches the viewport rather than tied
          to scroll position, so it runs at its own pace however fast the page
          is moving. 80ms between pieces. Spacing lives on the wrapper, not as
          margins on the children: a margin inside a crop mask is height the
          mask has to clip through before anything appears.
        </Note>
        <div className="grid gap-12 lg:grid-cols-3">
          {blockVariants.map(({ variant, title, note }) => (
            <div key={variant}>
              <code className="text-ink-400 font-mono text-xs">
                variant=&quot;{title}&quot;
              </code>
              <StaggerReveal
                variant={variant}
                className="mt-4 flex flex-col items-start gap-6"
              >
                <Kicker>The Ressurect</Kicker>
                <p
                  className={`${revealHeading} text-relief`}
                >{`We\u2019re aiming to set our mark Q1, 2027.`}</p>
                <p className="text-ink-200 text-base leading-[1.4]">
                  We have been silent for almost a year, but not out of the
                  game.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button href="#">Become Partner</Button>
                  <Button href="#" variant="secondary">
                    About Us
                  </Button>
                </div>
              </StaggerReveal>
              <Note>{note}</Note>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Card stack">
        <Note>
          Chips sharing one grid cell, the card at the back coming forward every
          five seconds. Each card behind is lifted 4px and gives up 12% of its
          size, both measured off the comp. The deck holds still under
          prefers-reduced-motion.
        </Note>
        {/* Headroom: the cards behind paint above the stack's own box. */}
        <div className="pt-3">
          <CardStack
            items={team.map((person) => ({
              id: person.id,
              content: <PersonCard person={person} />,
            }))}
          />
        </div>
      </Block>

      <Section spacing="md" container={false}>
        <Container>
          <Kicker as="h2" className="mb-8">
            Container widths
          </Kicker>
        </Container>
        <div className="flex flex-col gap-3">
          {(["narrow", "default", "wide"] as const).map((width) => (
            <Container key={width} width={width}>
              <div className="rounded border border-dashed border-violet-500/50 bg-violet-500/15 px-4 py-3 text-center font-mono text-xs">
                {width}
              </div>
            </Container>
          ))}
        </div>
      </Section>
    </main>
  );
}
