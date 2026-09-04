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

## Content

`content/legacy-data.ts` is the v1 fighter/sponsor/copy data, carried over
verbatim as a reference. Not wired into anything yet.
