"use client";

import Image from "next/image";
import {
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Section } from "@/components/layout/section";
import { VideoModal } from "@/components/media/video-modal";
import { CTA_FILL } from "@/components/ui/button";
import { LineRise } from "@/components/ui/line-rise";
import {
  type EventId,
  filmedEvents,
  formatDuration,
  isoDuration,
  spokenDuration,
  thumbnailFor,
  type Video,
  videoTitle,
  videos,
} from "@/content/videos";

/**
 * The fight archive.
 *
 * A grid of thumbnails that open in the site's own player rather than sending
 * anyone to YouTube — same modal the hero uses, so there is one full-screen
 * player on the site and not two.
 *
 * The card is YouTube's shape because that is the shape everyone already reads:
 * a 16:9 still with the runtime in the corner, a title under it, and one line
 * of grey underneath that. What is different is only what goes in the grey
 * line. YouTube's carries a channel name and a view count, neither of which
 * means anything on a page where every video is ours; this one carries the
 * ruleset, the class and the division, which is what somebody choosing between
 * ten fights from one night actually sorts on.
 *
 * The caption was a poster before this — surnames, a flag apiece, and the belt
 * over them in violet caps. It read as ten posters rather than ten videos, and
 * a title is the one thing a grid of thumbnails is asking you for.
 */

/** Three up at the widest: a 1280 content column, 16px gutters, so ~416px. */
const SIZES = "(min-width: 1024px) 416px, (min-width: 640px) 50vw, 100vw";

/** The separator on the caption's fact line, so its parts cannot drift. */
function Dot() {
  return (
    <span aria-hidden="true" className="text-ink-400 mx-1.5">
      ·
    </span>
  );
}

/**
 * One filter chip.
 *
 * Square, hairline, and the selected one inverts — the site has no pill
 * anywhere else and a rounded chip row would be the only one. `aria-pressed`
 * rather than a radio group: these are buttons that change what is on the page,
 * not a value being submitted, and a screen reader is better told which one is
 * pressed than handed a fieldset with no form under it.
 *
 * The unselected chip has a body rather than just an outline. It was a
 * white/10 hairline around ink-200, which is a real hairline and a real grey
 * but not next to a chip filled solid white — beside that much contrast the
 * outline read as a disabled control rather than as the other thing you can
 * press. white/5 on the fill and ink-100 on the label is what the hero's
 * "Watch the film" button and the player's close button already wear, so the
 * chip is now the same raised-glass surface as every other secondary control
 * on the site rather than a fourth idea about what an unselected thing is.
 */
function FilterChip({
  active,
  onSelect,
  children,
}: {
  active: boolean;
  onSelect: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`tap font-body h-11 px-4 text-sm font-medium whitespace-nowrap md:h-9 ${
        active
          ? "text-void bg-white"
          : "border-rule text-ink-100 border bg-white/5 hover:bg-white/15 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * The hover preview's embed.
 *
 * Muted, chromeless and starting at the bell. `nocookie` for the same reason
 * the modal uses it, and it matters more here: the modal is opened on purpose,
 * whereas this fires on a mouse crossing a card.
 */
function previewSrc(video: Video) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    disablekb: "1",
    modestbranding: "1",
    playsinline: "1",
    rel: "0",
    iv_load_policy: "3",
    start: String(video.previewStart),
  });

  return `https://www.youtube-nocookie.com/embed/${video.id}?${params}`;
}

/**
 * How long the pointer has to stay before a preview is worth loading.
 *
 * A mouse crossing the grid to reach the footer passes over three or four
 * cards, and without a wait each one would mount an iframe and start a video
 * on the way past. Long enough to mean it, short enough not to feel asked for.
 */
const PREVIEW_DELAY_MS = 450;

function VideoCard({ video, onPlay }: { video: Video; onPlay: () => void }) {
  const duration = formatDuration(video.durationSeconds);
  const [preview, setPreview] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopPreview = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setPreview(false);
  }, []);

  /**
   * Mouse only, and only where motion is welcome.
   *
   * A touch fires `pointerenter` on the way to firing a tap, so without the
   * pointerType check every phone would load a preview it has no way to see
   * and then immediately open the modal over it. `prefers-reduced-motion` is
   * the other gate: ten thumbnails that start moving when the pointer nears
   * them is exactly the kind of unrequested motion the setting is for, and
   * the still plus the runtime says everything the card has to say without it.
   */
  const startPreview = useCallback((event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (timer.current) return;
    timer.current = setTimeout(() => setPreview(true), PREVIEW_DELAY_MS);
  }, []);

  // A card can be scrolled out from under a stationary pointer, or unmounted
  // by a filter change, with the timer still pending.
  useEffect(() => stopPreview, [stopPreview]);

  return (
    // A button, not a link. It opens a dialog on this page — dressing that as
    // an anchor would promise a navigation that never happens, and hand the
    // middle-click and the copy-link-address a URL that is not the video's.
    //
    // `text-left` because a button centres its content by default, and every
    // line in the caption underneath is set to read as prose.
    <button
      type="button"
      onClick={onPlay}
      onPointerEnter={startPreview}
      onPointerLeave={stopPreview}
      // The pointer can leave without a `pointerleave` — a tap on a touch
      // screen, or the pointer being captured — and a preview left running
      // under a closed modal is a video playing at nobody.
      onPointerCancel={stopPreview}
      onClickCapture={stopPreview}
      className="group bg-panel tap flex h-full w-full flex-col text-left"
    >
      {/* 6px of the card's own ink on three sides, so the still reads as
          mounted rather than as the card's top edge. Nothing at the bottom:
          the caption is the frame on that side. Straight off the roster
          card — these two grids sit one click apart in the nav and a
          different mount on each would show. */}
      <div className="p-1.5 pb-0">
        <div className="bg-ink-800 relative aspect-video overflow-hidden">
          <Image
            src={thumbnailFor(video)}
            alt=""
            fill
            sizes={SIZES}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />

          {/* The preview, mounted only while hovered.

              It sits over the still rather than replacing it, so the card
              never goes blank in the moment between the iframe mounting and
              YouTube painting its first frame — the photograph stays
              underneath the whole time and the video simply arrives on top of
              it.

              `pointer-events-none` is load-bearing, not tidiness: an iframe
              takes every click that lands on it and the parent button would
              never hear one, so the card would stop opening the moment its own
              preview appeared. */}
          {preview ? (
            <iframe
              src={previewSrc(video)}
              title=""
              aria-hidden="true"
              tabIndex={-1}
              // No `allow="autoplay"` needed — muted autoplay is permitted
              // everywhere, and it is muted for exactly that reason as much as
              // for the ten-cards-shouting-at-once one.
              className="pointer-events-none absolute inset-0 size-full scale-[1.35] border-0"
            />
          ) : null}

          {/* Lifts the badges off whatever is behind them, still or video.
              Nothing at rest — these are fight stills and they are the reason
              for the page. Bottom rather than top, because that is the corner
              both badges live in now. */}
          <div
            aria-hidden="true"
            className="from-void/70 pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />

          {/* Billing and runtime as one cluster in the bottom-right corner,
              the billing to the left of the clock.

              A flex row rather than two absolutely-positioned badges that
              happen to line up: "Co-main event" is nearly twice the width of
              "Main event", so hand-placing the left one means picking an
              offset that clears the longest label and leaves a gap under every
              other. Laid out as a row they simply sit against each other, and
              the pair grows leftwards off the corner the clock is pinned to.

              `items-stretch` so the two boxes come out the same height off
              different type sizes — the runtime is set a step larger than the
              billing's caps, and matching their padding would not have matched
              their heights. */}
          <div className="absolute right-1.5 bottom-1.5 flex items-stretch gap-1.5">
            {video.topBilling ? (
              // Which cards are not like the others, said once each. On the
              // still rather than in the caption because the caption's line is
              // already carrying the belt, and these two fights both have one.
              //
              // The primary CTA's own fill, straight off `CTA_FILL` rather
              // than a violet picked to look like it. The site has one violet
              // block of colour and this is it — flat `violet-500` beside a
              // button running 600 into 500 was a second, slightly wrong one.
              //
              // Both billings wear it. The co-main was the quieter of the two
              // for a while, on the argument that matching fills bill them
              // level; the words already say which is which, and two chips in
              // two different paints read as two kinds of thing rather than
              // as one thing ranked.
              //
              // No glow and no hover lift — those come with the button and
              // are deliberately left behind. This is a label on a
              // photograph, and a label that lights up is asking to be
              // pressed.
              <span
                className={`font-body flex items-center px-2 text-sm leading-none font-medium tracking-[0.08em] uppercase ${CTA_FILL}`}
              >
                {video.topBilling}
              </span>
            ) : null}

            {/* YouTube's own corner for the runtime. The visible text is
                digits and a colon, which a screen reader has no good way to
                say, so the readable runtime is in the label and the badge is
                hidden from it. */}
            <span className="bg-void/80 font-body flex items-center px-2 py-1 text-sm leading-none text-white tabular-nums">
              <time
                dateTime={isoDuration(video.durationSeconds)}
                aria-label={spokenDuration(video.durationSeconds)}
              >
                <span aria-hidden="true">{duration}</span>
              </time>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 md:p-4">
        {/* h2 under the page's one h1, and the whole of the caption's first
            job. Plain rather than display: ten titles set in italic caps is a
            wall, and the display face is doing enough work on the heading above
            them.

            Full names and the belt in one line, from `videoTitle`. It was three
            elements before — a violet belt line, then surnames with a flag
            apiece either side of a grey `vs` — which is how a poster bills a
            fight and not how anything titles a video. */}
        <h2 className="plain-6">{videoTitle(video)}</h2>

        {/* Ruleset, class, division. Three facts about the fight, in the order
            somebody narrows on them — what it was fought under, how hard, and
            at what weight. The division carries the weight on its own; the
            kilos were beside it and said the same thing a second time, in
            numbers, to a reader who already knows what a middleweight is.
            `weightKg` stays in the content file — it is a fact about the
            fight, just not one this line has to spend a word on.

            This is the grey line under a YouTube title, and it behaves like
            one: it sits under the title wherever the title ends rather than
            being pushed to the bottom of the card. The belt used to be held
            open at a fixed line so these lined up across a row; with the belt
            in the title there is nothing to hold open, and a row of captions
            that all start at the top is what the shape asks for anyway. */}
        <p className="text-ink-200 mt-2 text-sm">
          {video.discipline}
          <Dot />
          {video.fightClass}
          {/* Still held together, so a line break can fall before the dot but
              never between it and the word it introduces. */}
          <span className="whitespace-nowrap">
            <Dot />
            {video.division}
          </span>
        </p>
      </div>
    </button>
  );
}

export function WatchIndex() {
  /**
   * Which video the player holds, and whether it is up — two pieces of state
   * rather than one nullable.
   *
   * The modal fades out over 260ms and only then fires its native close, so
   * clearing the video on the way out would pull the source out from under an
   * animation that is still running and swap the player for the modal's "no
   * video configured" message for a quarter of a second. So `open` closes it
   * and `playing` stays put until the next card replaces it.
   */
  const [playing, setPlaying] = useState<Video | null>(null);
  const [open, setOpen] = useState(false);

  /** Which show the grid is showing. "all" is not an event id, deliberately. */
  const [event, setEvent] = useState<EventId | "all">("all");
  const shown =
    event === "all" ? videos : videos.filter((video) => video.event === event);

  return (
    // The top padding is clearance, not rhythm: the nav pill floats over this
    // page and comes to about 76px, which the section's own spacing does not
    // clear on a phone. Same as the roster and the news index.
    <Section spacing="lg" className="pt-32 md:pt-40">
      <div className="flex flex-col items-start">
        <LineRise as="h1" text="Watch" className="display-2" />
      </div>

      {/* Which show these are from, and the way to say it that survives a
          second one. It was an eyebrow reading "1.0 · K.B. Hallen" — true
          today, wrong the night KOMBA 2 is filmed, and no use to anyone
          looking for one card in an archive of several.

          Drawn even with one event on it. A single chip beside All is a filter
          that has nothing to do yet, which is a fair thing for a page with one
          night in it to say — and it is where the label lives now. */}
      <div
        role="group"
        aria-label="Filter by event"
        className="mt-8 flex flex-wrap gap-2 md:mt-10"
      >
        <FilterChip active={event === "all"} onSelect={() => setEvent("all")}>
          All
        </FilterChip>
        {filmedEvents().map(({ id, label, venue }) => (
          <FilterChip
            key={id}
            active={event === id}
            onSelect={() => setEvent(id)}
          >
            {`${label} · ${venue}`}
          </FilterChip>
        ))}
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-10 lg:grid-cols-3">
        {shown.map((video) => (
          <li key={video.id}>
            <VideoCard
              video={video}
              onPlay={() => {
                setPlaying(video);
                setOpen(true);
              }}
            />
          </li>
        ))}
      </ul>

      {/* One player for the grid, not one per card. Keyed on the video so a
          second choice mounts a fresh player rather than handing a new source
          to the one that just ran its open. */}
      <VideoModal
        key={playing?.id}
        youtubeId={playing?.id}
        open={open}
        onClose={() => setOpen(false)}
        title={playing ? videoTitle(playing) : undefined}
      />
    </Section>
  );
}
