"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DropdownMenu } from "radix-ui";
import { useEffect, useId, useRef, useState } from "react";

import { Container } from "@/components/layout/container";
import { BrandIcon } from "@/components/ui/brand-icon";
import { Icon } from "@/components/ui/icon";
import { socials } from "@/content/socials";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";

/** The three the pill carries itself, while it is closed and wide enough. */
const navItems = [
  { label: "Events", href: "/events" },
  { label: "Athletes", href: "/athletes" },
  { label: "Partnerships", href: "/partnerships" },
];

/**
 * The menu card's list — the whole site, in three tiers.
 *
 * The card is a column now rather than a band across the page, so the list
 * cannot be the flat four-across grid it was: at 44% of the container there is
 * room for one column of links and nothing else. Nine in one run would be a
 * wall, so they are grouped three and three and three, and the last tier is
 * set smaller — the only ranking a single column can carry. The groups and
 * their order are Lauge's.
 *
 * Nothing is held back for the pill any more. The rail's three links leave the
 * pill the moment it splits, so the card is the complete list at every width.
 */
const menuGroups = [
  {
    tone: "major" as const,
    items: [
      { label: "Events", href: "/events" },
      { label: "Watch", href: "/watch" },
      { label: "Store", href: "/store" },
    ],
  },
  {
    tone: "major" as const,
    items: [
      { label: "Athletes", href: "/athletes" },
      { label: "Fight Pass", href: "/fight-pass" },
      { label: "Partnerships", href: "/partnerships" },
    ],
  },
  {
    tone: "minor" as const,
    items: [
      { label: "News", href: "/news" },
      { label: "About", href: "/about" },
      { label: "Fight Apply", href: "/fight-apply" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

/**
 * The pill row's type — the rail links and the language segment, which sit on
 * the same line and cannot be set differently without the row looking wrong.
 *
 * The scale's base step at the body's own 2%. The caps are gone and the 4%
 * went with them — that allowance was the caps' own, opening 12.8px words that
 * have no ascenders or descenders to keep them apart, and set lowercase the
 * row wants the 2% the scale is tuned for.
 *
 * Regular, not medium. It was the CTA's weight exactly, on the argument that
 * nothing in the bar should be set differently from a button — but a button is
 * one thing asking to be pressed and this is a row of six, and six mediums
 * side by side read as six asks. Navigation is where you are, not what to do.
 */
const railTypeClass = "font-body text-base font-normal tracking-[0.02em]";

/**
 * The page you are on, in the eyebrow's paint.
 *
 * `text-chrome-violet` and the same brightness-125 the Kicker wears, so the
 * two violets on the site are one violet — a gradient clipped to the glyphs,
 * never a flat `violet-*`.
 *
 * Written out whole rather than merged onto the resting class, and both
 * variants kept apart, because `text-chrome-violet` sets `color: transparent`
 * and a resting `text-white/80` sitting alongside it would win or lose by
 * stylesheet order rather than by intent — and `cn` would eat one of the two
 * outright. So a link takes one string or the other, never both. See CLAUDE.md.
 */
const ACTIVE_PAINT = "text-chrome-violet brightness-125";

/**
 * Whether a link is the page being looked at.
 *
 * Prefix-matched below the root so a story counts as News and a fighter counts
 * as Athletes — the nav names sections, and a reader inside one has not left
 * it. `/` is exact, or it would light on every page in the site.
 */
function isCurrent(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/** The rail. */
const navLinkClass = `${railTypeClass} text-white/80 transition-[color,opacity] duration-200 hover:text-white`;
const navLinkActiveClass = `${railTypeClass} ${ACTIVE_PAINT} transition-[color,opacity] duration-200`;

/**
 * The menu card, and deliberately not the row's type.
 *
 * `text-2xl` is the first step where `--heading-leading` takes over from body
 * leading — the smallest size that sets like a heading rather than like large
 * body copy — and caps at that size want *less* tracking than 12.8px caps, not
 * the same. So it keeps the CTA's own title case and 2%, which is what a
 * heading-sized link wants, and the two lists differ on purpose.
 */
const menuLinkClass =
  "font-body tap block w-fit py-1 text-2xl font-normal tracking-[0.02em] text-white/70 hover:text-white";
const menuLinkActiveClass = `font-body tap block w-fit py-1 text-2xl font-normal tracking-[0.02em] ${ACTIVE_PAINT}`;

/**
 * The third tier — two steps down the scale, and dimmer to match.
 *
 * The padding is the target, not the design. Set from the type alone these
 * came out 23px tall with 4px between them, which is under the 24px floor a
 * target is meant to clear and nowhere near what a thumb actually finds —
 * three of the nine links on the site's only menu, on a phone. `py-1.5` takes
 * them to 35 and `py-1` takes the majors to 37, and because both are `w-fit`
 * blocks in a spaced stack, nothing above or below them moves: the box grows
 * into space the `space-y` was already holding.
 */
const menuMinorLinkClass =
  "font-body tap block w-fit py-1.5 text-base font-normal tracking-[0.02em] text-white/45 hover:text-white";
const menuMinorLinkActiveClass = `font-body tap block w-fit py-1.5 text-base font-normal tracking-[0.02em] ${ACTIVE_PAINT}`;

/**
 * Everything the site is offered in.
 *
 * Language *and* region, each in its own language — 日本語 / 日本, not
 * "Japanese". A picker is read by the person who cannot read the page they are
 * on, so the one word that has to land is the one they are looking for, and
 * the region is what tells two Englishes or two Portugueses apart on the day
 * there is more than one of either.
 *
 * English leads, because it is what the site is in — the row a reader lands on
 * should be the one already ticked. The rest are alphabetical by the English
 * name of the language, which is the order every OS picker uses: Arabic,
 * Chinese, Danish, Finnish, French, German, Japanese. Below the first row the
 * reader is scanning for their own script, not for our market priorities.
 *
 * Selecting one moves the check and the trigger's label and changes nothing
 * else: there is no i18n in this project yet. The list is the design's, ready
 * for the routing to land under it.
 */
const languages = [
  { code: "en", label: "English", region: "International" },
  { code: "ar", label: "العربية", region: "العالم" },
  { code: "zh", label: "简体中文", region: "中国" },
  { code: "da", label: "Dansk", region: "Danmark" },
  { code: "fi", label: "Suomi", region: "Suomi" },
  { code: "fr", label: "Français", region: "France" },
  { code: "de", label: "Deutsch", region: "Deutschland" },
  { code: "ja", label: "日本語", region: "日本" },
];

/** What the site is actually in today, and so what the picker opens on. */
const DEFAULT_LANGUAGE = "en";

/** The row, in both places it is set: the trigger and every option under it. */
const languageRowClass = "flex items-center gap-2";

/**
 * The region, beside the language and a step quieter than it. Same size — it
 * is the second half of a name, not an annotation on one — and the contrast
 * carries the ranking instead.
 */
const languageRegionClass = "text-white/40";

function LanguageSelect({ className }: { className?: string }) {
  const [code, setCode] = useState(DEFAULT_LANGUAGE);
  const current = languages.find((item) => item.code === code) ?? languages[0];

  /*
   * A menu rather than a listbox, and modal={false} on it — both for the same
   * bug.
   *
   * Radix's Select scroll-locks the page whenever it opens, and
   * react-remove-scroll does that with `overflow: hidden` on <body>. Measured:
   * body went from `clip visible` to `hidden` on the frame the panel appeared.
   * That is the one thing this site cannot take — overflow on <body> makes it a
   * scroll container, which steals the scrollport from every `position: sticky`
   * on the page, so the rewatch gallery's pin releases mid-flight and that
   * screen goes black. The player's own lock goes on the scrolling element for
   * exactly this reason; the note in video-modal.tsx has the measurements.
   *
   * Select has no way to turn it off — no `modal` prop in 2.3.7, it is always
   * modal — and DropdownMenu does, so the picker is a menu of radio items.
   * `menuitemradio` carries the chosen one as honestly as an option does, the
   * keyboard behaviour is the same walk, and the page keeps scrolling under an
   * open picker, which is what a picker should do anyway.
   */
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        data-nav-item
        // The bar reads this on the way down to decide whether to press. See
        // the pointerdown handler in Header.
        data-language-trigger
        aria-label="Language"
        className={cn(
          languageRowClass,
          // The rail's own transition, to the millisecond, because this sits
          // in the rail's row and dims with it: hover any item and the others
          // drop to 40%. On its own clock — it wore the rail track's 130ms
          // delay for a while — it is the one thing in the bar that greys late.
          "group/lang cursor-pointer text-white/80 transition-[color,opacity] duration-200 outline-none hover:text-white",
          // Only below md, where this is the loose control in the corner of
          // the menu card rather than a full-height segment of the rail. Set
          // from its type alone it was a 23px target; it is absolutely
          // positioned there, so the padding grows it and moves nothing.
          "max-md:py-1.5",
          className,
        )}
      >
        <Icon name="language" className="size-4 shrink-0" aria-hidden="true" />

        {/* The label alone once something is chosen. The region is there to
            separate two entries that share a language, which is a question the
            list has to answer and the bar does not — in the row it is the
            second half of a name, in the bar it is a second word nobody asked
            for. */}
        {current.label}

        <span className="flex shrink-0 transition-transform duration-200 group-data-[state=open]/lang:rotate-180">
          <Icon name="keyboard_arrow_down" className="size-4" />
        </span>
      </DropdownMenu.Trigger>

      {/* Portalled, because the trigger sits inside two boxes that clip: the
          rail's own track, which closes to nothing, and the phone's sheet,
          which scrolls. z-[60] because the header is z-50 and a stacking
          context that high would otherwise paint straight over a panel with no
          z-index of its own.

          data-language-panel is read by the outside-press handler below. The
          panel is outside the nav's box by construction, and without the flag
          every press on an option would be a press outside the menu. */}
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          // On the trigger's centre line rather than its left edge. The panel
          // is more than twice the width of the word that opens it, so aligned
          // to an edge it reads as having been dropped next to the control
          // rather than out of it. Radix still shifts it back inside the
          // viewport where the centre would hang it off the screen.
          align="center"
          sideOffset={8}
          data-language-panel
          className={cn(
            "border-rule z-[60] min-w-[--radix-dropdown-menu-trigger-width] border",
            // Not the pill's white/5. Closed, this hangs over the hero's video
            // with no scrim under it, and 5% white on moving footage is a panel
            // you read the film through. The ground is the page's own black at
            // 90, so the rows sit on the site rather than on the shot.
            "bg-void/90 backdrop-blur-[12px]",
          )}
        >
          <DropdownMenu.RadioGroup
            value={code}
            onValueChange={setCode}
            className="[&>*+*]:border-rule [&>*+*]:border-t"
          >
            {languages.map(({ code: value, label, region }) => (
              <DropdownMenu.RadioItem
                key={value}
                value={value}
                // Typeahead matches the language, not the language and its
                // region run together — "dan" should find Dansk.
                textValue={label}
                className={cn(
                  languageRowClass,
                  "h-12 cursor-pointer px-5 whitespace-nowrap text-white/80 outline-none select-none",
                  "data-highlighted:bg-white/5 data-highlighted:text-white",
                )}
              >
                {label}
                <span className={languageRegionClass}>{region}</span>

                {/* Only the selected row draws one, so it needs no reserved
                    box — ml-auto puts it on the right edge of whichever row
                    that is. */}
                <DropdownMenu.ItemIndicator className="ml-auto pl-6">
                  <Icon name="check" className="size-4" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

/**
 * The two segments that leave the bar when it splits — the rail's links and
 * the language — on a track that can be closed rather than a `hidden` that
 * takes them out in one frame.
 *
 * `1fr → 0fr` on a single grid column, the same trick the card's height used
 * to use vertically: an `fr` under 1 resolves to that fraction of the column's
 * own content width, so the segment walks between nothing and exactly as wide
 * as it is, with no measuring.
 *
 * This is not decoration, it is what keeps the bar from flaring. Both widths
 * the bar has are its contents: 267px open, 730 shut, measured at 1280. Swap
 * the rail's 463px back in on one frame and the bar has to be 730 wide while
 * the card still holds 535 of the 1216 track — 49px more than there is, and it
 * takes it by hanging over both container edges. Grown back in step with the
 * card's collapse instead, the width is continuous, 681 → 730, with a worst
 * frame of 732.
 */
const railTrackClass = cn(
  // min-w-0 twice over — here and on the grid item inside, which is why that
  // item is a bare box with the padding pushed one level deeper. A track's
  // `auto` minimum is its item's min-content contribution, and padding is not
  // reducible: leave the segment's own 40px on the grid item and 0fr floors at
  // 40px, which is a clipped stub of "Even" and "Eng" left either side of the
  // empty middle. The padded row sits inside, at w-max, and overflows into the
  // clip instead.
  "grid h-full min-w-0 grid-cols-[1fr] overflow-hidden",
  "group-data-[open=true]/nav:grid-cols-[0fr]",
  // The card's clock exactly, both directions: out with the wipe, back with
  // the collapse.
  "transition-[grid-template-columns] duration-[250ms] ease-out",
  "group-data-[open=true]/nav:duration-300",
  "motion-reduce:transition-none",
);

/**
 * What is inside a closing track: the row of links, or the language.
 *
 * The track's job is the bar's *width* — it has to close, or the bar has
 * nowhere to put 463px of rail on the frame the menu shuts. The type inside it
 * is a different question, and being clipped by a shutting box is not a way to
 * leave: it reads as the words sliding sideways out of the bar. So they go
 * before the box does — 100ms down and out, off the press, long gone by the
 * time the clip reaches them — and come back the same way, 100ms up and in,
 * once the box has finished making room. Down on the way out, up on the way
 * in, which is the same 8px travelled both ways.
 */
const railItemsClass = cn(
  "relative flex h-full w-max items-center px-5 lg:px-7",
  // The seam. Inside the fade, so the rule leaves with the words rather than
  // outlasting them by a fifth of a second.
  "before:absolute before:inset-y-4 before:left-0 before:w-px before:bg-white/10",
  "transition-[opacity,translate] delay-[130ms] duration-100 ease-out",
  "group-data-[open=true]/nav:translate-y-2 group-data-[open=true]/nav:opacity-0 group-data-[open=true]/nav:delay-0",
  "motion-reduce:transition-none",
);

/**
 * Logo geometry, in the SVG's own units. The K mark occupies x 0–28.44 and
 * the lettering starts at x 34.43, so cropping the container down to the
 * mark's width hides the word cleanly without touching the asset.
 */
const WORDMARK_FULL = 122;
const WORDMARK_MARK_ONLY = 28.44;

/**
 * The scrim, which is the modal's and not a lighter cousin of it — the menu
 * takes the whole screen on a phone and half the width on a desktop, and a
 * surface that size either owns the page or looks like it is floating over one
 * by accident. Held one step off the player's `void/94`: the player is
 * replacing the page, this is covering it, and the hero staying faintly
 * readable underneath is what says which.
 *
 * Rendered outside the nav's own box on purpose. The outside-press handler
 * tests ancestry, so a scrim inside that box would swallow the press that is
 * meant to close the menu.
 */
const scrimClass = cn(
  "bg-void/85 fixed inset-0 opacity-0",
  // Out on the card's clock, not the pill's. A scrim still lifting after the
  // menu has gone reads as the page lagging behind the press.
  "transition-opacity duration-150 ease-out",
  "data-[open=true]:pointer-events-auto data-[open=true]:opacity-100",
  "data-[open=true]:duration-300",
  "motion-reduce:transition-none",
);

/**
 * The open, in two movements — the pill reaches for the container's edges, and
 * the card claims the right-hand end of the track.
 *
 * The pill no longer opens to the full width: the menu is a column beside it
 * now, so it grows to the container minus that column. It does not have to
 * know the number. Grow is a share of the *free* space, and the card takes its
 * share of the track first, so whatever is left is what the pill fills.
 */
const pillShellClass = cn(
  // The growth is flex-grow, not width. The pill's resting size is its
  // contents and its open size is what the card leaves it — two values neither
  // CSS nor this component can name in pixels without measuring the box every
  // frame. Grow interpolates between exactly those two: a flex factor under 1
  // hands the item that fraction of the free space, so 0 → 1 walks the pill
  // from its content width to the rest of the track, with no JS at all.
  //
  // On its own element rather than on the nav because the nav carries `tap`,
  // and a second `transition` shorthand there would silently drop one of the
  // two. See CLAUDE.md.
  // Below md the bar is the container: basis-full, so it reaches both gutters
  // at every phone and small tablet width rather than sitting at a fixed 384
  // with the container's slack either side of it. From md it is its contents
  // again, centred, and grow is what opens it.
  "pointer-events-auto grow-0 basis-full md:basis-auto",
  // Above the sheet, which is a sibling that covers the screen on a phone. The
  // bar is the only way back out, so it cannot be underneath the thing it
  // closes.
  "relative z-10",
  // One clock for the whole move: grow, the card's width and the rail's own
  // track, together, on the same curve. They have to be. Grow is a share of the
  // *free* space, so the bar's width is a product of what the card gives up and
  // what the rail takes back, and two of those three on different clocks is
  // what threw the flare — 814px measured, against a bar that is 681 open and
  // 730 shut. In step the product is flat: 681 → 730, worst frame 732.
  //
  // Nothing waits closing. The move used to sit out the card's 150ms fade
  // before any of it started, and 150ms of nothing after a press is not a
  // sequence, it is a stall. The fade still goes first, it just goes *over* the
  // move now — card gone at 150ms, bar home at 250.
  "transition-[flex-grow] duration-[250ms] ease-out",
  "data-[open=true]:grow data-[open=true]:duration-300",
  "motion-reduce:transition-none",
);

/**
 * The menu's box, which is two different things either side of `md`.
 *
 * Phone: a sheet the size of the screen. `fixed` takes it out of the header's
 * row *and* out of the container's gutters in one move, which is the whole
 * point — nothing about the bar's layout should reach a full-screen sheet.
 *
 * Desktop: the right-hand column of a split bar. Width rather than display, so
 * the column can be walked open instead of switched on, and `overflow-hidden`
 * so the card inside it is clipped by the track rather than squeezed by it.
 */
const menuTrackClass = cn(
  "group/menu fixed inset-0 overflow-y-auto",
  "md:static md:w-0 md:shrink-0 md:overflow-hidden",
  "md:data-[open=true]:w-[44%]",
  // Opening, the track wipes the card into view. Closing, it gives its width
  // back on exactly the pill's clock — same duration, same curve —
  // because the pill's return is a share of the *free* space and this track is
  // what free space means. Drop the width in one frame instead and 547px of it
  // arrives while the pill still has grow 1: the bar snaps out to the full
  // container and only then starts collapsing, which is the flare that was
  // there. In step, the two cancel — the pill's width falls the whole way and
  // never rises more than 6px above where it opened.
  //
  // Nothing of it is seen. The card is transparent from 150ms, so what is
  // collapsing here is an empty box, and the only thing on screen is the bar
  // sliding back to the middle.
  "transition-[width] duration-[250ms] ease-out",
  "md:data-[open=true]:duration-300",
  "motion-reduce:transition-none",
);

/**
 * The card's own two properties, kept off the track so each element carries a
 * single clock — one duration and one delay can only mean one thing, and the
 * open and the close want different things of the width and the opacity both.
 *
 * visibility rides with the opacity rather than switching outright: transitioned,
 * it holds `visible` for the whole run and flips on the last frame, which is
 * what lets the phone's full-screen sheet fade out instead of blinking off.
 */
const menuFadeClass = cn(
  "invisible opacity-0",
  "group-data-[open=true]/menu:visible group-data-[open=true]/menu:opacity-100",
  "transition-[opacity,visibility] duration-150 ease-out",
  "group-data-[open=true]/menu:duration-300",
  "motion-reduce:transition-none",
);

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [holdTap, setHoldTap] = useState(false);
  const [pressing, setPressing] = useState(false);
  const pathname = usePathname();
  const scrolled = useScrolled();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Escape and a press outside, both only while there is something to close.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      // The button is what opened it, so it is where the caret belongs — the
      // alternative is focus on a link that has just been made inert.
      buttonRef.current?.focus();
    };

    // pointerdown rather than click: a menu that waits for the release sits
    // open under the finger for as long as the press lasts.
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (rootRef.current?.contains(target)) return;
      // The language panel is portalled to the body, so by ancestry it is
      // always outside — picking a language would otherwise shut the menu
      // underneath it.
      if (target?.closest?.("[data-language-panel]")) return;
      setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  // The drawn press lifts with the finger, wherever it happens to be by then.
  useEffect(() => {
    if (!pressing) return;

    const release = () => setPressing(false);

    document.addEventListener("pointerup", release);
    document.addEventListener("pointercancel", release);
    return () => {
      document.removeEventListener("pointerup", release);
      document.removeEventListener("pointercancel", release);
    };
  }, [pressing]);

  /**
   * Scroll lock, on the scrolling element and nothing else — the same lock the
   * player uses, and for the reason written out there: `overflow: hidden` on
   * <body> makes it a scroll container, which steals every pinned section's
   * scrollport and releases the pins. On the root it propagates to the
   * viewport instead and sticky still measures against the viewport.
   */
  useEffect(() => {
    if (!menuOpen) return;

    const scroller = (document.scrollingElement ??
      document.documentElement) as HTMLElement;
    const previous = scroller.style.overflow;

    scroller.style.overflow = "hidden";

    return () => {
      scroller.style.overflow = previous;
    };
  }, [menuOpen]);

  return (
    // pointer-events-none on the bar, auto on the pill and the card. The header
    // is a full-width fixed box holding two floating surfaces, and without this
    // the empty track either side of the pill swallows every click along that
    // band of the page.
    <header className="pointer-events-none fixed inset-x-0 top-5 z-50">
      {/* Full-bleed scrim behind the pill, solid at the very top and fading
          out below it, so content scrolling up dissolves into the page edge
          instead of sliding under a hard line. Sits before the pill in the DOM,
          so it stays behind it without needing a z-index. */}
      <div
        aria-hidden="true"
        className="from-void/80 pointer-events-none fixed inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent"
      />

      <div aria-hidden="true" data-open={menuOpen} className={scrimClass} />

      <Container>
        {/* The split. One row holding the bar and the menu, top-aligned, so the
            card hangs from the same line the pill starts on however tall it
            gets. */}
        <div ref={rootRef} className="flex items-start justify-center">
          <div data-open={menuOpen} className={cn("group/nav", pillShellClass)}>
            <nav
              data-hold-tap={holdTap}
              data-pressing={pressing}
              /**
               * Whether this press should depress the bar, decided on the way
               * *down* and from the DOM.
               *
               * It hung off the panel's open state at first, and that inverted
               * the whole thing: Radix toggles on pointerdown and React flushes
               * that synchronously, so by the time the browser painted the
               * :active frame the state had already moved to what the press was
               * about to produce. The bar held still opening and pressed
               * closing — exactly backwards.
               *
               * Capture, so this runs before Radix's own handler on the trigger
               * (root-to-target beats target-to-root), and `aria-expanded` read
               * off the element itself, which is still the state the press
               * started in. Every press in the bar sets it, so it clears itself:
               * the next press on anything else lands with holdTap false.
               *
               * The press that *opens* the panel has to be drawn by hand, and
               * that is the second flag. Radix calls preventDefault on the
               * pointerdown that opens a menu — measured, `defaultPrevented`
               * true on every opening press and false on every closing one —
               * and a cancelled pointerdown never gets :active, so `tap` has
               * nothing to fire on. data-pressing plays the same 90ms scale off
               * an attribute instead, and lifts when the finger does.
               */
              onPointerDownCapture={(event) => {
                const trigger = (event.target as HTMLElement).closest?.(
                  "[data-language-trigger]",
                );
                const willClose =
                  trigger?.getAttribute("aria-expanded") === "true";

                setHoldTap(willClose);
                setPressing(Boolean(trigger) && !willClose);
              }}
              className={cn(
                // shine-border draws the outline as a masked ring on a pseudo
                // element, so like the inset ring it replaced it adds no layout
                // height — the pill stays 56px, as in the comp.
                "shine-border flex flex-col bg-white/5 backdrop-blur-[12px]",
                // Pressing any item depresses the whole pill rather than the item
                // alone. At ~570px wide the default depth would throw the edges
                // around, so it is dialled back to a 2% shrink — about 6px of travel
                // at each end, which is the same read as a button at 0.94.
                "tap [--tap-scale:0.98]",
                // Except the press that shuts the language panel. Opening it is
                // an action and the bar answers; closing it is dismissing
                // something the bar is already wearing, and a second press
                // there reads as the bar being clicked twice for one round
                // trip.
                "data-[hold-tap=true]:[--tap-scale:1]",
                // The opening press, drawn rather than inherited — the same
                // three declarations `tap` puts behind :active, because that is
                // the state Radix cancels out from under it.
                "data-[pressing=true]:[--tap-duration:90ms]",
                "data-[pressing=true]:[--tap-ease:cubic-bezier(0.3,0,0.2,1)]",
                "data-[pressing=true]:[transform:scale(var(--tap-scale))]",
                "motion-reduce:data-[pressing=true]:[transform:none]",
              )}
            >
              <div
                className={cn(
                  "flex h-14 items-center",
                  // While any item is hovered, every *other* item dims. Scoped with
                  // :not(:hover) so the hovered one needs no competing override.
                  "dim-rest",
                )}
              >
                {/* Segments, not a row of items with rules dropped between
                    them. Every segment runs the full height of the pill and
                    carries its own divider as a border, so the whole box is
                    the target rather than the label inside it — which is what
                    the menu button always did and nothing else did.

                    The two inner seams are still 24px and centred, though —
                    drawn on a pseudo-element rather than as a border, which
                    is the only way to have both: the segment keeps its full
                    height and stays the target, and the rule inside it does
                    not. `inset-y-4` off a 56px row *is* the 24px, so the
                    height stays derived from the pill rather than restated.

                    The button keeps a full-height border, and that is the
                    hierarchy: short rules separate items sharing the row,
                    the one full-height rule is where the row actually ends
                    and a box of its own begins.

                    One value does all the spacing — px on the segments, gap
                    between the links, and so the pill's own edges. Anything
                    else and the outside of the row is a different distance
                    from the inside of it. */}
                <Link
                  href="/"
                  data-nav-item
                  // Shuts the menu, like every other link that goes somewhere.
                  // It was the one that did not: the card's nine links each
                  // close it on the way out and the mark did not, so pressing
                  // it navigated home *under* an open menu — and pressing it
                  // while already home did nothing at all, since there was no
                  // navigation to hide the fact. The outside-press handler
                  // cannot help here either: the mark is inside the bar, which
                  // is the one region that handler deliberately ignores.
                  onClick={() => setMenuOpen(false)}
                  // h-full rather than padding pulled off the layout: the box
                  // is the segment now, so the target holds its size when the
                  // wordmark shrinks to the mark on scroll.
                  //
                  // No seam of its own — the rail carries it now, on its left
                  // edge, so the rule closes with the links rather than
                  // separately from them.
                  className="flex h-full items-center px-5 transition-opacity duration-200 lg:px-7"
                  aria-label="KOMBA Fight Club — home"
                >
                  <span
                    className="block overflow-hidden transition-[width] duration-500 ease-out"
                    style={{
                      width: scrolled ? WORDMARK_MARK_ONLY : WORDMARK_FULL,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size
                        brand mark; next/image adds a wrapper and a second hop for an
                        SVG it will not optimise anyway. */}
                    <img
                      src="/brand/komba-logo.svg"
                      alt=""
                      width={122}
                      height={12}
                      // max-w-none defeats the global `img { max-width: 100% }`, which
                      // would squash the mark rather than crop the word.
                      className="h-3 w-[122px] max-w-none"
                    />
                  </span>
                </Link>

                {/* The rail. Closed with the bar rather than hidden with it —
                    see railTrackClass — and it carries the seam that used to
                    hang off the logo, so the rule closes with the links
                    instead of blinking out on its own and leaving a 1px line
                    beside an empty bar.

                    min-w-0 is what lets the row be narrower than the links
                    inside it; the track clips them, so they are wiped in from
                    the left rather than squashed. The gap steps up at lg; md
                    is where the links and the language both arrive at once and
                    the row is tightest. */}
                <div className={cn(railTrackClass, "max-md:hidden")}>
                  <div className="min-w-0">
                    <div className={cn(railItemsClass, "gap-5 lg:gap-7")}>
                      {navItems.map(({ label, href }) => (
                        <Link
                          key={href}
                          href={href}
                          data-nav-item
                          aria-current={
                            isCurrent(pathname, href) ? "page" : undefined
                          }
                          className={
                            isCurrent(pathname, href)
                              ? navLinkActiveClass
                              : navLinkClass
                          }
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ml-auto on the track rather than the control, and it stays
                    there in both states. It is the one auto margin in the row,
                    so it holds the button against the bar's right edge at every
                    width the bar passes through — closed, the bar is its own
                    contents and there is nothing for it to take.

                    Below md the pill is a wordmark and a button with nothing
                    to spare, and open at any width the card carries the
                    language itself — top right of the menu, where the comp
                    puts it. */}
                <div className={cn(railTrackClass, "ml-auto max-md:hidden")}>
                  <div className="min-w-0">
                    {/* The fade and the padding on the box, the hover on the
                        control. Both were on the trigger, and the rail's 130ms
                        delay — right for words leaving the bar, wrong for a
                        hover — made this the one item in the row that greyed
                        late. */}
                    <div className={railItemsClass}>
                      <LanguageSelect className="h-full" />
                    </div>
                  </div>
                </div>

                <button
                  ref={buttonRef}
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-expanded={menuOpen}
                  aria-controls={menuId}
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  data-nav-item
                  className="group md:border-rule flex h-full items-center px-5 transition-opacity duration-200 max-md:ml-auto md:border-l lg:px-7"
                >
                  {/* Both marks in one grid cell, so the swap costs no width
                      and nothing in the row shifts under it.

                      One leaves before the other arrives — 100ms out, then
                      100ms in — rather than the two crossing at half opacity,
                      which is where the burger and the cross could be read
                      through one another. The delay always sits on whichever
                      mark is coming in, so the swap is the same 200ms either
                      way. */}
                  <span className="grid size-8 place-items-center">
                    <Icon
                      name="apps"
                      className="col-start-1 row-start-1 size-8 transition-[opacity,scale] delay-100 duration-100 ease-out group-aria-expanded:scale-75 group-aria-expanded:opacity-0 group-aria-expanded:delay-0"
                    />
                    <Icon
                      name="close"
                      className="col-start-1 row-start-1 size-8 scale-75 opacity-0 transition-[opacity,scale] duration-100 ease-out group-aria-expanded:scale-100 group-aria-expanded:opacity-100 group-aria-expanded:delay-100"
                    />
                  </span>
                </button>
              </div>
            </nav>
          </div>

          <div data-open={menuOpen} className={menuTrackClass}>
            {/* The card. On a phone it is the screen — no ring, no radius, no
                inset, and a top pad that clears the bar floating over it. From
                md it is a card again, held off the bar by the 8px seam that is
                now the split. */}
            <div
              id={menuId}
              inert={!menuOpen}
              className={cn(
                "pointer-events-auto relative bg-white/5 backdrop-blur-[12px]",
                menuFadeClass,
                // px-9 is not a guess: 16px of gutter plus the bar's own 20px
                // of segment padding is where the wordmark starts, and the
                // sheet's list lines up under it rather than near it. The top
                // is that same 36px, measured from the bar rather than from the
                // screen — the bar is floating over the sheet, so the top of
                // the box is not where the space starts. 76 + 36 = 112.
                "max-md:min-h-full max-md:px-9 max-md:pt-28 max-md:pb-10",
                "md:shine-border md:ml-4 md:p-8 lg:p-10",
              )}
            >
              {/* Out of the flow, so the list starts at the padding and the
                  space above the first link is the space to its left. In flow
                  it was a row of its own plus a margin — 60-odd px of the card's
                  top edge spent on the one control that is not navigation. */}
              <LanguageSelect className="absolute top-28 right-9 md:top-8 md:right-8 lg:top-10 lg:right-10" />

              <nav aria-label="Site">
                {/* One dim rule for the whole list, not per tier: the groups
                    are already told apart by the space between them and by the
                    third one's size, and a third signal on top of those two
                    would be decoration. */}
                <div className="dim-rest flex flex-col gap-8 lg:gap-10">
                  {menuGroups.map(({ tone, items }) => (
                    <ul
                      key={items[0].href}
                      /* The minors carry no gap of their own: `py-1.5` on the
                         link is already 12px of separation, and 4px of
                         space-y on top of it opened the third tier wider than
                         the majors above it. The padding is the target and the
                         spacing both. */
                      className={tone === "major" ? "space-y-2" : undefined}
                    >
                      {items.map(({ label, href }) => (
                        <li key={href}>
                          {/* `tap` and nothing else in the way of a transition — it
                              already carries colour and opacity alongside the press,
                              and a second shorthand here would drop one of them. */}
                          <Link
                            href={href}
                            onClick={() => setMenuOpen(false)}
                            aria-current={
                              isCurrent(pathname, href) ? "page" : undefined
                            }
                            className={
                              isCurrent(pathname, href)
                                ? tone === "major"
                                  ? menuLinkActiveClass
                                  : menuMinorLinkActiveClass
                                : tone === "major"
                                  ? menuLinkClass
                                  : menuMinorLinkClass
                            }
                          >
                            {label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </nav>

              {/* The footer's row, the same four marks from the same list, at
                  the foot of the card. A menu that ends on the small print and
                  nothing else ends on an apology; this is the one thing down
                  there worth reaching for.

                  gap-6 and the hover rule are the footer's too — a row that
                  behaves the same in both places reads as one site. */}
              <ul className="dim-rest mt-10 flex items-center gap-6 lg:mt-12">
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
        </div>
      </Container>
    </header>
  );
}
