import type { CountryCode } from "@/components/ui/flag";

/**
 * The KOMBA fight archive — every video on the YouTube channel, as of the
 * sync below.
 *
 * All ten are the K.B. Hallen card of 11 October 2025: a main event, a co-main
 * and eight undercard fights, uploaded a week after the show. There is nothing
 * else on the channel yet, so this file is the whole of it rather than a
 * selection.
 *
 * **This is a snapshot, not a feed.** It was read off the channel rather than
 * fetched at runtime, and that is a deliberate trade. Runtime would need
 * either an API key on the server or a scrape of YouTube's HTML in production,
 * and the second one breaks silently the next time they rename a field — a
 * watch page that renders an empty grid because a renderer key changed is
 * worse than one that is a fortnight out of date.
 *
 * `pnpm sync:youtube` reads the channel and reports how this file differs from
 * it, fetching any thumbnail it is missing. It stops short of writing the
 * entries because three of the fields below are corrections to what YouTube
 * says — see the list underneath — and a generator would undo all three on
 * every run. Run it when the channel changes; edit by hand from what it says.
 *
 * What was taken from where, because no one source has all of it:
 *
 * - **Ids, titles and publish dates** come from the channel's RSS feed
 *   (`/feeds/videos.xml?channel_id=…`), which gives ISO timestamps. The web
 *   page only offers "10 months ago", which is a fact with a shelf life.
 * - **Durations** come from the page's own thumbnail badges, cross-checked
 *   against their Danish accessibility labels. All ten agreed.
 * - **Everything about the fight** — belt, discipline, class, division and both
 *   corners — is parsed out of the first lines of each description, which are
 *   written to a consistent shape.
 *
 * Three things were changed on the way in, all of them so the archive agrees
 * with the rest of the site rather than with YouTube:
 *
 * - **Björgskog**, not the title's "Björkskog". `content/fighters.ts` settles
 *   this one at length: the card poster is KOMBA's own artwork and it wins.
 * - **O’Donnell** takes the roster's curly apostrophe.
 * - **Ceran flies Turkish.** His description says DEN; the roster says `tr`
 *   with a comment reading "Danish champion under the Turkish flag, both off
 *   the poster". The poster wins again — and the fact that he holds a Danish
 *   belt is very likely how the description came to get it wrong.
 *
 * View counts are deliberately absent. YouTube's own card carries them, but a
 * number frozen at sync time is not a stale fact, it is a wrong one — and it
 * would still be wrong in a year. What replaces it on the card is the fight's
 * own billing, which does not rot.
 */

/** When the channel was last read. Displayed nowhere; it dates the snapshot. */
export const SYNCED_AT = "2026-09-06";

/** Where the archive points anyone wanting the rest of it. */
export const CHANNEL_URL = "https://www.youtube.com/@kombafc";

/** Which show these are from. One card so far, so it is a constant. */
export const EVENT = "KOMBA 1.0";

/** The ruleset the fight was contested under. */
export type Discipline = "Muay Thai" | "K-1";

/** KOMBA's own billing tiers, off the descriptions. */
export type FightClass = "A-Class" | "B-Class";

export type Corner = {
  /** As the description introduces them, in full. */
  name: string;
  /**
   * What the card calls them.
   *
   * Stored rather than sliced off the end of `name`. It happens that the last
   * word is right for all twenty corners here, but that is a property of these
   * twenty names and not a rule about names — the first Dutch or Spanish
   * fighter on a KOMBA card breaks it, and it would break quietly, on a page
   * that has already shipped.
   */
  surname: string;
  nationality: CountryCode;
};

/**
 * The shows the archive is filed under.
 *
 * One today, and the whole reason it exists as a list is that there will not
 * be. Every video on the page is from the same night, which the page used to
 * say in an eyebrow over the grid — a label that stops being true the moment a
 * second card is filmed, and stops being findable at the same moment. A filter
 * says it and keeps saying it.
 *
 * `label` and `venue` apart rather than one string: the chip joins them with
 * the site's own separator, and a pre-joined label would be the one place that
 * punctuation is decided somewhere else.
 */
export const events = {
  "komba-1": { label: "KOMBA 1", venue: "K.B. Hallen" },
} as const;

export type EventId = keyof typeof events;

export type Video = {
  /** Which show it was filmed at. */
  event: EventId;
  /**
   * The YouTube id. Doubles as the thumbnail's filename stem in
   * `public/watch`, so the two cannot drift apart.
   */
  id: string;
  /** Verbatim, so a re-sync has something to diff the parse against. */
  youtubeTitle: string;
  /**
   * Where it sat on the card, for the badge on the still. The eight undercard
   * fights carry none — a badge on every card labels nothing.
   */
  topBilling?: "Main event" | "Co-main event";
  /**
   * Where a hover preview starts, in seconds: the "Round 1" mark from the
   * video's own chapter list.
   *
   * Nought would be right if these were trailers. They are full fights, and
   * the first six to twelve minutes of every one is walkouts, announcements
   * and the referee's instructions — ten cards previewing ten near-identical
   * shots of an empty ring. At the bell each one is its own fight.
   *
   * Only the preview jumps. The modal still opens at the top, because someone
   * who has chosen a fight wants the walkout too.
   */
  previewStart: number;
  corners: readonly [Corner, Corner];
  /** The belt on the line, where there was one. */
  belt?: string;
  discipline: Discipline;
  fightClass: FightClass;
  division: string;
  weightKg: number;
  /** Runtime in seconds — formatted for display, and for the ISO duration. */
  durationSeconds: number;
  /** ISO 8601, off the channel feed. */
  published: string;
};

/**
 * Upload order, which is the channel's own and reads as card order — the main
 * event first, then down through the undercard. That is a billing decision, so
 * like the roster it is edited by hand and never sorted. Do not "fix" it.
 */
export const videos: readonly Video[] = [
  {
    event: "komba-1",
    id: "VKWcRp_3Mgc",
    youtubeTitle:
      "KOMBA FC 1.0: Larsen vs Björkskog | Oct 11, 2025 | MAIN-EVENT 🟣",
    topBilling: "Main event",
    corners: [
      { name: "Niclas R. Larsen", surname: "Larsen", nationality: "dk" },
      {
        name: "Kristoffer Björgskog",
        surname: "Björgskog",
        nationality: "fi",
      },
    ],
    belt: "ISKA World Title",
    discipline: "K-1",
    fightClass: "A-Class",
    division: "Middleweight",
    weightKg: 72.5,
    durationSeconds: 2313,
    previewStart: 757,
    published: "2025-10-19T10:33:16Z",
  },
  {
    event: "komba-1",
    id: "C6qOT8Uxvrw",
    youtubeTitle: "KOMBA FC 1.0: Sadi vs Sun | Oct 11, 2025 | FULL FIGHT 🟣",
    topBilling: "Co-main event",
    corners: [
      { name: "Younes Sadi", surname: "Sadi", nationality: "dk" },
      { name: "Umut Sun", surname: "Sun", nationality: "tr" },
    ],
    belt: "WBC European Title",
    discipline: "Muay Thai",
    fightClass: "A-Class",
    division: "Light Heavyweight",
    weightKg: 79.3,
    durationSeconds: 2327,
    previewStart: 528,
    published: "2025-10-18T14:24:59Z",
  },
  {
    event: "komba-1",
    id: "JAXsVFqwx1g",
    youtubeTitle:
      "KOMBA FC 1.0: Mahssoun vs Bilben | Oct 11, 2025 | FULL FIGHT 🟣",
    corners: [
      { name: "Yassine Mahssoun", surname: "Mahssoun", nationality: "ma" },
      { name: "Ali Bilben", surname: "Bilben", nationality: "tr" },
    ],
    discipline: "Muay Thai",
    fightClass: "A-Class",
    division: "Welterweight",
    weightKg: 67.0,
    durationSeconds: 1289,
    previewStart: 392,
    published: "2025-10-18T14:18:55Z",
  },
  {
    event: "komba-1",
    id: "0nU0IdnbCaI",
    youtubeTitle:
      "KOMBA FC 1.0: Landal vs Zabihi | Oct 11, 2025 | FULL FIGHT 🟣",
    corners: [
      { name: "Jaspar Landal", surname: "Landal", nationality: "dk" },
      { name: "Farsid Zabihi", surname: "Zabihi", nationality: "se" },
    ],
    belt: "ISKA World Title",
    discipline: "K-1",
    fightClass: "A-Class",
    division: "Featherweight",
    weightKg: 57.0,
    durationSeconds: 2278,
    previewStart: 680,
    published: "2025-10-18T14:13:10Z",
  },
  {
    event: "komba-1",
    id: "TldNmbopowk",
    youtubeTitle:
      "KOMBA FC 1.0: O'Donnell vs Campusano | Oct 11, 2025 | FULL FIGHT 🟣",
    corners: [
      { name: "Tais O’Donnell", surname: "O’Donnell", nationality: "dk" },
      { name: "Angelo Campusano", surname: "Campusano", nationality: "se" },
    ],
    discipline: "Muay Thai",
    fightClass: "A-Class",
    division: "Super Featherweight",
    weightKg: 59.0,
    durationSeconds: 903,
    previewStart: 358,
    published: "2025-10-18T13:13:33Z",
  },
  {
    event: "komba-1",
    id: "lYYxrUKt3jg",
    youtubeTitle:
      "KOMBA FC 1.0: Ceran vs Johansson | Oct 11, 2025 | FULL FIGHT 🟣",
    corners: [
      // The description flags him DEN. See the note at the top of the file.
      { name: "Bedirhan Ceran", surname: "Ceran", nationality: "tr" },
      { name: "Tobias Johansson", surname: "Johansson", nationality: "se" },
    ],
    discipline: "Muay Thai",
    fightClass: "A-Class",
    division: "Welterweight",
    weightKg: 67.0,
    durationSeconds: 1264,
    previewStart: 392,
    published: "2025-10-18T12:54:54Z",
  },
  {
    event: "komba-1",
    id: "YcvzmdDZ0oM",
    youtubeTitle:
      "KOMBA FC 1.0: Bendahman vs Coker | Oct 11, 2025 | FULL FIGHT 🟣",
    corners: [
      { name: "Youssef Bendahman", surname: "Bendahman", nationality: "dk" },
      { name: "Luca Coker", surname: "Coker", nationality: "dk" },
    ],
    belt: "WBC National Title",
    discipline: "Muay Thai",
    fightClass: "B-Class",
    division: "Super Lightweight",
    weightKg: 63.5,
    durationSeconds: 1816,
    previewStart: 526,
    published: "2025-10-18T12:47:36Z",
  },
  {
    event: "komba-1",
    id: "GTDXmqIxLKU",
    youtubeTitle:
      "KOMBA FC 1.0: Kornval-Hansen vs Lapinskiene | Oct 11, 2025 | FULL FIGHT 🟣",
    corners: [
      {
        name: "Mathilde Kornval-Hansen",
        surname: "Kornval-Hansen",
        nationality: "dk",
      },
      {
        name: "Gintare Lapinskiene",
        surname: "Lapinskiene",
        nationality: "lt",
      },
    ],
    discipline: "Muay Thai",
    fightClass: "B-Class",
    division: "Lightweight",
    weightKg: 61.2,
    durationSeconds: 1350,
    previewStart: 392,
    published: "2025-10-18T12:41:03Z",
  },
  {
    event: "komba-1",
    id: "QZRGV45yYSg",
    youtubeTitle:
      "KOMBA FC 1.0: Jensen vs Nielsen | Oct 11, 2025 | FULL FIGHT 🟣",
    corners: [
      { name: "Kristoffer Jensen", surname: "Jensen", nationality: "dk" },
      { name: "Carl Nielsen", surname: "Nielsen", nationality: "dk" },
    ],
    discipline: "Muay Thai",
    fightClass: "B-Class",
    division: "Super Middleweight",
    weightKg: 76.2,
    durationSeconds: 1361,
    previewStart: 353,
    published: "2025-10-18T11:43:14Z",
  },
  {
    event: "komba-1",
    id: "dE-3hrWfp3g",
    // The one title with a non-breaking space in it, written as an escape so
    // that it is visible. Verbatim means verbatim — flatten it to an ordinary
    // space and `sync:youtube` reports this entry as drifted on every run.
    youtubeTitle:
      "KOMBA FC 1.0: Andruszkow vs Gebrenigus | Oct 11, 2025 |\u00A0FULL FIGHT 🟣",
    corners: [
      { name: "Isaac Andruszkow", surname: "Andruszkow", nationality: "dk" },
      { name: "Abdiel Gebrenigus", surname: "Gebrenigus", nationality: "se" },
    ],
    discipline: "Muay Thai",
    fightClass: "B-Class",
    division: "Super Lightweight",
    weightKg: 63.5,
    durationSeconds: 1314,
    previewStart: 353,
    published: "2025-10-18T11:32:45Z",
  },
];

/**
 * How the fight is billed: the two surnames, in corner order. One source of
 * truth with the corners themselves, so a spelling fixed in one place cannot
 * survive in the other.
 */
export function billing(video: Video) {
  return video.corners.map((corner) => corner.surname).join(" vs ");
}

/**
 * What the card and the player call the fight, in the register a title is read
 * in rather than the register a poster is: both fighters under the full name
 * they are billed with, and the belt after them where there was one.
 *
 * Surnames and a flag apiece is how a poster bills a fight, and the grid wore
 * that for a while. On a page of ten thumbnails it read as ten posters rather
 * than as ten videos — and `Sadi vs Sun` is not a title, it is a shorthand for
 * people who already know which Sadi.
 */
export function videoTitle(video: Video) {
  const bout = video.corners.map((corner) => corner.name).join(" vs ");
  return video.belt ? `${bout} — ${video.belt}` : bout;
}

/**
 * The events that actually have footage, in the order the archive runs.
 *
 * Derived rather than listed, so a chip can never appear for a show nothing
 * was filmed at — the same rule the news page's outlet wall was built on.
 */
export function filmedEvents() {
  const seen: EventId[] = [];
  for (const video of videos) {
    if (!seen.includes(video.event)) seen.push(video.event);
  }
  return seen.map((id) => ({ id, ...events[id] }));
}

/** Saved next to the id it belongs to, so the two cannot come apart. */
export function thumbnailFor(video: Video) {
  return `/watch/${video.id}.jpg`;
}

/**
 * `38:33`, and `1:02:15` if a fight ever runs the hour. Minutes are only
 * zero-padded once there are hours in front of them — `08:33` on a badge reads
 * as a timestamp rather than as a runtime.
 */
export function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${minutes}:${pad(seconds)}`;
}

/** What `<time datetime>` wants for a runtime: `PT38M33S`. */
export function isoDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `PT${minutes}M${seconds}S`;
}

/**
 * Read out in place of the badge, which is digits and a colon — a screen
 * reader saying "thirty-eight colon thirty-three" is not a runtime.
 *
 * The seconds are spoken rather than rounded away. Rounded, 38:33 was read out
 * as "39 minutes", which is a label contradicting the badge it labels; and
 * with ten fights inside a minute of each other on this card, the rounding
 * made pairs of them sound identical when they are not. Same shape as
 * YouTube's own label for the badge it was copied from.
 */
export function spokenDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const say = (n: number, unit: string) => `${n} ${unit}${n === 1 ? "" : "s"}`;

  return seconds === 0
    ? say(minutes, "minute")
    : `${say(minutes, "minute")} ${say(seconds, "second")}`;
}
