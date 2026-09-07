import Link from "next/link";

import { PixelNoise } from "@/components/effects/pixel-noise";
import { Container } from "@/components/layout/container";
import { BrandIcon } from "@/components/ui/brand-icon";
import { LineRise } from "@/components/ui/line-rise";
import { NotifyForm } from "@/components/ui/notify-form";
import { Wordmark } from "@/components/ui/wordmark";
import { socials } from "@/content/socials";

/**
 * The routes, in named groups.
 *
 * The header's menu card is this same list flat, which is right there — a panel
 * you opened to find one thing wants the shortest path to it. A footer is read
 * rather than searched, so the grouping is the point: it says what kind of site
 * this is before anybody clicks anything.
 *
 * Social is not among them. It is the icon row in the block below, and the same
 * destinations spelled out in words beside it would be the footer saying it
 * twice.
 *
 * Contact is not here either: the two addresses in that block are the contact
 * route, and a link to a page that holds the same two addresses is a hop for
 * nothing.
 */
const groups = [
  {
    label: "Discover",
    links: [
      { label: "Events", href: "/events" },
      { label: "Watch", href: "/watch" },
      { label: "Fight Pass", href: "/fight-pass" },
      { label: "Merch", href: "/store" },
    ],
  },
  {
    label: "KOMBA",
    links: [
      { label: "About", href: "/about" },
      { label: "News", href: "/news" },
    ],
  },
  {
    label: "Fighters",
    links: [
      { label: "Athletes", href: "/athletes" },
      { label: "Fight Apply", href: "/fight-apply" },
    ],
  },
  {
    label: "Business",
    links: [
      { label: "Press", href: "/press" },
      { label: "Partnerships", href: "/partnerships" },
    ],
  },
];

/** Group heads. Small, quiet, and not a link — they label, they do not go. */
const columnLabel =
  "font-body text-xs font-medium tracking-[0.08em] text-white/40 uppercase";

/**
 * The dim-the-siblings rule is the header's, lifted deliberately: a list that
 * behaves the same way in both places reads as one site. Scoped per list, so
 * hovering in one column leaves the others alone.
 */
/* gap-0, with the space moved inside the links as padding. Set from the type
   alone each one was a 23px box with a 10px gap under it — a 33px pitch made
   almost entirely of dead space, and a 23px target, which is under the floor.
   With `py-1.5` on the link and no gap the pitch is 35 and the whole of it is
   the target: two pixels of visual change, and twelve of thumb. */
const linkList = "dim-rest mt-4 flex flex-col";

/*
 * `tap` and nothing else in the way of a transition. It already carries colour
 * and opacity on its own 200ms fade alongside the press, and a second
 * `transition` shorthand on the same element does not merge with it — the two
 * resolve by stylesheet order and one is dropped without a word. See CLAUDE.md.
 */
const linkClass =
  "tap font-body inline-flex w-fit items-center gap-1.5 py-1.5 text-base text-white/70 hover:text-white";

/**
 * The site footer.
 *
 * A full-bleed band with no ground of its own, closed by the site's hairline
 * at the top. Two layers under the content: the site's dot field, and over it
 * a glow running page colour at the top of the panel to violet at the foot,
 * breathing between 15 and 40 per cent. Two halves: who we are and what to do about it on the left, every route
 * on the site on the right.
 *
 * The left column reads top down as an introduction — mark, channels, what
 * this actually is, how to reach a person — and only then asks for an address.
 * The ask is last because it is the one thing here that wants something back,
 * and a footer that opens with a demand has not earned it yet.
 *
 * Server component. The line reveal, the stagger and the signup each bring
 * their own client boundary.
 */
export function Footer() {
  return (
    <footer className="border-rule relative border-t">
      {/* The events hold's field, at its settings — same pitch, same ramp, and
          the component's own violet colours. It is the site's one dot field
          and a second tuning of it would read as a different texture.

          Bottom of the stack, under the glow: the violet arrives over the
          dots rather than beside them, so the field is buried where the light
          is strongest and only really reads across the top of the panel,
          where the glow has given out. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <PixelNoise
          pitch={12}
          opacities={[0, 0, 0, 0, 0, 0, 0.06, 0.12, 0.24, 0.45]}
        />
      </div>

      {/* No ground of its own — the page shows through the top of this and the
          violet arrives underneath the content, rather than the panel being a
          colour the content sits on. See globals.css. */}
      <div
        aria-hidden="true"
        className="footer-glow pointer-events-none absolute inset-0"
      />

      <Container className="relative pt-12 pb-10 md:pt-16 md:pb-12 lg:pt-20 lg:pb-16">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-2">
          <div className="max-w-xl lg:col-start-1 lg:row-start-1">
            {/* The ask, first. It is the one thing in this footer that wants
                something back, and burying it under the introduction put it
                where nobody scrolling to the bottom would meet it. */}
            {/* The poster register, with the relief on it — the white bloom
                and the inner shadow are built for a dark ground.

                A plain string, not `cn`: `text-relief` is a custom text-*
                utility and tailwind-merge cannot be trusted with those. See
                the note in CLAUDE.md. */}
            {/* display-4, and nothing else. It was display-5 with an xl size
                bolted on, because the ladder stops at md below display-4 — a
                step up removes the need for the bolt as well: 21.6 / 25.9 /
                31.1, all of it the step's own.

                The old note, kept because it is why the step sets leading at
                all: */}
            {/* The leading is set here rather than left to the size utility.
                `text-lg` and `text-xl` carry the *body* line heights — 1.5 and
                1.4 — because most type at those sizes is prose; only from
                `text-2xl` up do the tokens resolve to --heading-leading. This
                heading crosses that boundary, so left alone it set itself at
                1.5 on a phone, 1.4 from md and 1 from xl: three different
                leadings on one heading, and two of them loose enough to read
                as a paragraph in caps.

                Off the variable rather than `leading-none`, so retuning the
                site's heading leading moves this with the display scale. */}
            <LineRise as="h2" className="display-4">
              <span className="block">Don’t miss</span>
              <span className="block">the next card.</span>
            </LineRise>

            <p className="text-ink-200 mt-4 max-w-96 text-base leading-[1.4]">
              Fight announcements, ticket drops and nothing else. You hear it
              before it goes public.
            </p>

            <NotifyForm size="sm" className="mt-5 max-w-sm" />
          </div>

          {/* Two across, and the groups run down them. Four in a row would
              give each about ninety pixels of the half-container; two by two
              leaves each group its own measure and keeps the column short
              enough to read as a column.

              No reveal on it. Every other entrance on this site plays in on
              scroll, and a footer is where the reader has already arrived —
              staggering ten links in at the end of the page is motion for its
              own sake, and it leaves them invisible to anything that does not
              run the observer. The heading keeps its line reveal; that one is
              the ask announcing itself, which is the one thing here worth
              announcing.

              Spanning both rows from lg, which is what keeps the desktop
              exactly where it was. The brand block below is a grid child of its
              own now so a phone can put it after the links, and left in one row
              each, the taller of ask-and-links would set row 1 and push the
              brand down with it. Across both rows the links measure against the
              whole left column instead, and the brand sits 80px under the ask —
              48 of row gap and its own 32 — the way it did when the two were
              one box.

              `self-start` is load-bearing. Without it this stretches to the
              left column's height — grid items do — and then its own rows,
              being auto and under an `align-content` that defaults to stretch,
              share the surplus out between them. The result is two rows of
              230 and 161 holding content that needs 130 and 100, so every
              group sits in a box far taller than its links and the whole
              block reads as badly spaced. Sized to its content instead, the
              rows are the links and nothing else. */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:gap-x-16 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start lg:pt-2">
            {groups.map((group) => (
              <FooterGroup key={group.label} {...group} />
            ))}
          </div>

          {/* Who this is, and on a phone it comes after the links rather than
              between them and the ask. A mark, a paragraph and four icons is
              the end of a page, not something to be scrolled past on the way to
              the nav — so in source order it is last, and from lg it is placed
              back under the ask where the two-column layout wants it.

              mt-8 rather than the 20 it used to carry: the grid's own gap-y-12
              is already under it, and 48 + 32 is the same 80 that separated the
              ask from the brand before. Two separate things — one asks, one
              introduces — and at 48 alone they read as one block with an odd
              gap in the middle. */}
          <div className="mt-8 max-w-xl lg:col-start-1 lg:row-start-2">
            {/* The full lockup, not the wordmark alone: this is the one
                place the brand is stated rather than used, and the K belongs
                to it. Width sets the size — the mark works out its own height
                off the 122:12 the file carries. 256 and 288, both on the 4px
                grid. */}
            <Wordmark part="logo" className="w-64 bg-white md:w-72" />

            {/* What this is, for anyone who reached the bottom without
                finding out. Two sentences and a narrow measure: it is a
                caption under a mark, not a paragraph of body copy. */}
            <p className="text-ink-200 mt-6 max-w-sm text-xs leading-[1.6]">
              KOMBA is a striking promotion built in Copenhagen. Every striking
              sport in one ring, under a single format anyone can follow from
              the first bell.
            </p>

            {/* Fully white, and each mark optically sized against YouTube's
                rather than all drawn at the same box — see the note in
                brand-icon.tsx. The siblings dim on hover the way every other
                list here does. */}
            <ul className="dim-rest mt-7 flex items-center gap-6">
              {socials.map(({ name, label, href }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="tap block text-white"
                  >
                    <BrandIcon name={name} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
}

/** One named group of links. */
function FooterGroup({
  label,
  links,
}: {
  label: string;
  links: { label: string; href: string }[];
}) {
  const id = `footer-${label.toLowerCase()}`;

  return (
    <nav aria-labelledby={id}>
      <p id={id} className={columnLabel}>
        {label}
      </p>

      <ul className={linkList}>
        {links.map(({ label: text, href }) => (
          <li key={href}>
            <Link href={href} className={linkClass}>
              {text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
