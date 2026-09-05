@AGENTS.md

# KOMBA FC — v2

Next.js app at the repo root. v1 lived in `src/`; that whole tree was replaced
on the `v2` branch. Production still runs v1 from `main`.

## Layout primitives

Two components own page layout, and they never touch the same axis:

- `Container` (`components/layout/container.tsx`) — horizontal only. 1280px
  content, 16px gutter on mobile, 32px from `md`. Widths: `narrow` (800),
  `default` (1280), `wide` (1600). Each preset just sets `--container-content`.
- `Section` (`components/layout/section.tsx`) — vertical only, plus an optional
  wrapping `Container`. Pass `container={false}` for full-bleed content.

Never hand-roll `max-w-*` + `mx-auto` + `px-*` on a section. Use these, and
retune the shared values in `app/globals.css` instead.

## Type scale

Modular scale driven by `--text-ratio` (currently 1.25, major third) off a
16px `--text-base`. Every step is a `calc()` chain, so changing the one
variable rescales the site. Options: 1.200 / 1.250 / 1.333.

## Spacing

Everything lands on a 4px grid. Tailwind's default scale already is one
(`p-1` = 4px), so use scale steps and avoid arbitrary `[Npx]` values — if a
step does not exist, round to the nearest multiple of 4 rather than inventing
one. Build responsively: step padding and rhythm up through the breakpoints
rather than shipping one desktop value.

The Figma is the vision, not the source of truth. Where a comp value is off the
grid or off the type scale, snap it and note the deviation.

Typographic leading is the exception — the gap between stacked lines inside a
heading is set in `em` so it tracks the type size. That is leading, not
spacing.

## Fonts

Eurostile (headings) and Aeonik (body) are licensed and not in the repo.
`app/fonts.css` points at `public/fonts/*.woff2` with fallback stacks, so a
missing file degrades rather than breaking the build. Once the real files
land, move to `next/font/local` for preloading and size-adjust metrics.

## Icons

Material Symbols for everything. The only non-Material vector in the project is
the KOMBA wordmark (`public/brand/komba-wordmark.svg`), which is a brand mark,
not an icon.

Icons live in `components/ui/icon.tsx` as inlined path data — no icon font, no
per-icon request, unused entries dropped by the bundler. To add one, copy the
`d` attribute from `node_modules/@material-symbols/svg-400/outlined/<name>.svg`
into the `paths` map. All Material Symbols share the `0 -960 960 960` viewBox,
so nothing else changes. Do not hand-draw SVG paths for icons.

## Components

- `components/ui/` — shadcn + Aceternity registry installs. Do not hand-edit
  beyond restyling; they can be re-fetched.
- `components/layout/` — structural (Section, Container, Header, Footer).

Aceternity: `pnpm dlx shadcn@latest add @aceternity/<name>`. The registry is
already wired in `components.json`. Its semantic tokens (`bg-background`,
`border-border`, `bg-primary`…) are mapped onto the KOMBA palette in
`app/globals.css`, so installs land on-brand without editing.

## Reporting back

Answer in two labelled bullet lists and nothing else:

- **What I did** — what changed, and the measurement that shows it worked.
- **What you should do** — only when something is genuinely waiting on Lauge.
  Leave the heading out entirely when there is nothing.

Short bullets. No preamble, no recap of the request, no narration of the
route taken. A number that was measured beats an adjective every time: "fires
at 87%, holds to 97%" says more than "the timing feels better now".

When something was got wrong along the way, say so plainly in the first list
rather than quietly correcting it — a bullet, not a paragraph.

## Class merging

`cn` runs tailwind-merge, which files every `text-*` class it does not
recognise under text-colour and keeps only the last. Our custom type
utilities all start with `text-`, so `cn("text-chrome text-paint-room")`
resolves to `text-paint-room` alone — the chrome is dropped in silence, with
no error and no warning.

Never pass two of `text-chrome`, `text-chrome-violet`, `text-relief`,
`text-trim` or `text-paint-room` through `cn`, in one argument or several.
Compose those with a template literal, or set them in a plain `className`
string. `cn` is fine for everything else.

## Content

`content/legacy-data.ts` is the v1 fighter/sponsor/copy data, carried over
verbatim as a reference. Not wired into anything yet.
