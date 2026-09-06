/**
 * Reads the KOMBA channel and reports how `content/videos.ts` differs from it.
 *
 * It does **not** rewrite that file, and the reason is in the file itself:
 * three of the fields there are corrections to what YouTube says. Björgskog is
 * spelled off the card poster rather than off the video title, O’Donnell takes
 * the roster's apostrophe, and Ceran flies the Turkish flag his description
 * gets wrong. A generator would undo all three every time it ran, and the
 * spelling argument would have to be had again.
 *
 * So this reports, and a person edits. What it does do on its own is fetch any
 * thumbnail that is missing from `public/watch` — that part has no judgement
 * in it.
 *
 *   node scripts/sync-youtube.mjs           # report, fetch missing thumbnails
 *   node scripts/sync-youtube.mjs --check   # report only, non-zero if drifted
 *
 * Two sources, because neither is complete on its own. The RSS feed has ISO
 * publish dates and full titles but no durations; the channel page has
 * durations but only says "10 months ago". Both are read without an API key,
 * which is the whole point — there is no secret to keep in sync with this.
 */

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const THUMB_DIR = join(ROOT, "public", "watch");
const CONTENT = join(ROOT, "content", "videos.ts");

const CHANNEL_ID = "UCVS9WOwm6FozNbuUe_6E69Q";
const CHANNEL_HANDLE = "kombafc";

/** Enough of a browser to be served the page rather than the consent wall. */
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";

const checkOnly = process.argv.includes("--check");

/* -- Sources --------------------------------------------------------------- */

/**
 * `ucbcb=1` is what keeps this out of consent.youtube.com. Without it an EU
 * request is redirected to a wall and the page never arrives.
 */
async function fetchChannelPage() {
  const res = await fetch(
    `https://www.youtube.com/@${CHANNEL_HANDLE}/videos?ucbcb=1`,
    { headers: { "user-agent": UA, "accept-language": "en" } },
  );
  if (!res.ok) throw new Error(`channel page: ${res.status}`);
  return res.text();
}

async function fetchFeed() {
  const res = await fetch(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
  );
  if (!res.ok) throw new Error(`feed: ${res.status}`);
  return res.text();
}

/* -- Parsing --------------------------------------------------------------- */

const decode = (s = "") =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");

function parseFeed(xml) {
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, entry]) => ({
    id: entry.match(/<yt:videoId>([^<]+)</)?.[1],
    youtubeTitle: decode(entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]),
    published: entry.match(/<published>([^<]+)</)?.[1],
    description: decode(
      entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1],
    ),
  }));
}

/**
 * Durations, off the thumbnail badges.
 *
 * YouTube's channel grid has moved from `videoRenderer` to `lockupViewModel`,
 * so this walks for the latter rather than reaching down a fixed path — the
 * shape around it is theirs to rearrange, and it has been rearranged before.
 * The badge text is locale-formatted (`38.33` when served Danish), so only the
 * digits are trusted and the separator is thrown away.
 */
function parseDurations(html) {
  const raw = html.match(/var ytInitialData = (\{.*?\});<\/script>/s)?.[1];
  if (!raw) throw new Error("no ytInitialData — the page shape changed");

  const lockups = [];
  (function walk(node) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) return node.forEach(walk);
    for (const [key, value] of Object.entries(node)) {
      if (key === "lockupViewModel") lockups.push(value);
      else walk(value);
    }
  })(JSON.parse(raw));

  const durations = new Map();
  for (const lockup of lockups) {
    const id = lockup?.contentId;
    const badge = lockup?.contentImage?.thumbnailViewModel?.overlays
      ?.map(
        (o) =>
          o?.thumbnailBottomOverlayViewModel?.badges?.[0]
            ?.thumbnailBadgeViewModel,
      )
      ?.find(Boolean);
    if (!id || !badge?.text) continue;

    const parts = badge.text.split(/\D+/).filter(Boolean).map(Number);
    if (!parts.length) continue;
    durations.set(
      id,
      parts.reduce((total, part) => total * 60 + part, 0),
    );
  }
  return durations;
}

/**
 * A string literal's *value*, not its source text.
 *
 * One title carries a non-breaking space, written in the content file as a
 * \u00A0 escape so that it is visible there. Compared as source text those six
 * characters never match the one character YouTube sends. JSON's escape
 * syntax is close enough to TS's for these; anything it cannot read is
 * compared as written.
 */
function literalValue(raw) {
  if (raw === undefined) return undefined;
  try {
    return JSON.parse(`"${raw}"`);
  } catch {
    return raw;
  }
}

/** What the committed file currently claims, read without importing TS. */
async function parseCommitted() {
  const source = await readFile(CONTENT, "utf8");
  const entries = new Map();
  for (const [, id] of source.matchAll(/^\s{4}id: "([^"]+)",$/gm)) {
    const block = source.slice(source.indexOf(`id: "${id}"`));
    const upTo = block.slice(0, block.indexOf("\n  },"));
    entries.set(id, {
      id,
      durationSeconds: Number(upTo.match(/durationSeconds: (\d+)/)?.[1]),
      published: upTo.match(/published: "([^"]+)"/)?.[1],
      youtubeTitle: literalValue(
        upTo.match(/youtubeTitle:\s*\n?\s*"([^"]+)"/)?.[1],
      ),
    });
  }
  return entries;
}

/* -- Thumbnails ------------------------------------------------------------ */

/**
 * Saved locally rather than hotlinked, so a page of ten cards loads without
 * asking Google for anything. That used to hold until somebody pressed play;
 * the grid previews on hover now, so it holds until somebody moves a mouse
 * onto a card and leaves it there. Still the difference between every visitor
 * and an interested one, and the previews go through youtube-nocookie for the
 * same reason the modal does.
 */
async function fetchThumbnail(id) {
  const res = await fetch(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);
  if (!res.ok) throw new Error(`thumbnail ${id}: ${res.status}`);
  await mkdir(THUMB_DIR, { recursive: true });
  await writeFile(
    join(THUMB_DIR, `${id}.jpg`),
    Buffer.from(await res.arrayBuffer()),
  );
}

/* -- Report ---------------------------------------------------------------- */

const [html, xml] = await Promise.all([fetchChannelPage(), fetchFeed()]);
const live = parseFeed(xml);
const durations = parseDurations(html);
const committed = await parseCommitted();

const added = [];
const changed = [];

for (const video of live) {
  const have = committed.get(video.id);
  const duration = durations.get(video.id);

  if (!have) {
    added.push({ ...video, durationSeconds: duration });
    continue;
  }
  if (have.youtubeTitle !== video.youtubeTitle) {
    changed.push(
      `${video.id}  title: ${have.youtubeTitle}\n              → ${video.youtubeTitle}`,
    );
  }
  if (duration && have.durationSeconds !== duration) {
    changed.push(
      `${video.id}  duration: ${have.durationSeconds}s → ${duration}s`,
    );
  }
}

const removed = [...committed.keys()].filter(
  (id) => !live.some((video) => video.id === id),
);

console.log(`channel: ${live.length} videos · committed: ${committed.size}`);

if (added.length) {
  console.log(`\n${added.length} to add:\n`);
  for (const video of added) {
    console.log(`  id: "${video.id}"`);
    console.log(`  youtubeTitle: ${JSON.stringify(video.youtubeTitle)}`);
    console.log(`  published: "${video.published}"`);
    console.log(`  durationSeconds: ${video.durationSeconds ?? "?"}`);
    // The description's first lines carry belt, discipline, class and both
    // corners — everything the entry needs that the title does not have.
    console.log(
      `${video.description
        ?.split("\n")
        .slice(0, 4)
        .map((line) => `      | ${line}`)
        .join("\n")}\n`,
    );
  }
}

if (changed.length) console.log(`\nchanged:\n  ${changed.join("\n  ")}`);
if (removed.length)
  console.log(`\ngone from the channel:\n  ${removed.join("\n  ")}`);

/**
 * Thumbnails for everything live, whether or not the entry is written yet —
 * a new video's picture is wanted before its entry is, and a missing one for
 * an existing entry is a broken card.
 */
const missing = live.filter(
  (video) => !existsSync(join(THUMB_DIR, `${video.id}.jpg`)),
);

if (missing.length && !checkOnly) {
  console.log(`\nfetching ${missing.length} thumbnail(s)…`);
  for (const video of missing) {
    await fetchThumbnail(video.id);
    console.log(`  public/watch/${video.id}.jpg`);
  }
} else if (missing.length) {
  console.log(`\n${missing.length} thumbnail(s) missing from public/watch`);
}

const drifted = added.length || changed.length || removed.length;
if (!drifted) console.log("\nup to date.");
else console.log(`\nedit content/videos.ts — this script will not.`);

if (checkOnly && (drifted || missing.length)) process.exit(1);
