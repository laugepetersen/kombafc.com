/**
 * The news feed — what KOMBA published, and what was published about KOMBA.
 *
 * Two kinds of item share one list because they share one page. A `post` is
 * ours: written here, lives here, nobody to credit. A `coverage` item is
 * somebody else's article, and the rule for those is the only thing in this
 * file worth arguing about, so it is written down.
 *
 * **We never reproduce the article.** Not the body, not a translation of the
 * body. Copying a journalist's piece onto kombafc.com is an infringement, and
 * it puts our page in the same search result as the one they wrote — which is
 * a strange way to thank an outlet that covered the show for free. What a
 * coverage item carries instead:
 *
 * - the outlet's mark and name, so the credit is the loudest thing on the card
 * - their headline, verbatim and in their own language, as a citation
 * - the date and the byline
 * - `summary` and `body` — ours, written from the article, never lifted
 * - a link out, which is the point of the whole card
 *
 * `pullQuote` is the one place their words appear, and it is held to a single
 * short sentence with the speaker named. That is a quotation, which is fine;
 * three of them stitched together is a reprint, which is not.
 *
 * `thumbnail` is the exception to all of the above, and it was asked for
 * knowingly: it is the outlet's own cover photograph, saved into
 * `public/press/thumbs` and shown beside our summary. Two things make that a
 * defensible position rather than a comfortable one. It is each article's
 * declared `og:image`, which is the picture a publisher nominates for exactly
 * this — the frame every link preview on the internet reaches for. And it is
 * served from our own origin rather than hotlinked, because half of these URLs
 * carry an expiry parameter and would go blank on their own schedule.
 *
 * It is still their photograph. Presse-fotos.dk in particular is a press photo
 * agency, so the pictures are not illustration wrapped around an article, they
 * are the product. Worth a line of written permission from each of the four.
 * The fallback if any of them says no is KOMBA's own K.B. Hallen photography in
 * `public/show`, which costs nothing and is from the same night.
 *
 * Everything below was read off the live pages in September 2026. Headlines,
 * dates and bylines came from the pages themselves rather than from a search
 * summary, because those are the three facts a press page cannot get wrong.
 */

/* -- Outlets --------------------------------------------------------------- */

export type Outlet = {
  name: string;
  /** Where the mark links when it is not attached to a specific article. */
  home: string;
  logo: string;
  /**
   * The logo's own pixels, and for an SVG its viewBox. Both are needed even
   * though the mark renders at a fixed height — the browser wants the ratio up
   * front, and a press wall of differently proportioned marks is exactly where
   * a guessed one shows.
   */
  logoWidth: number;
  logoHeight: number;
  /**
   * Black artwork on transparency is a blank space on the void. Inverting a
   * greyscale mark leaves the alpha alone and produces the white version most
   * outlets ship anyway.
   *
   * Per-outlet rather than blanket, because the five here all differ.
   * Fighting.dk's is black — measured, mean luminance 3 of 255 across the
   * opaque pixels — and so is K.B. Hallen's SVG. Presse-fotos.dk ships pure
   * white. DR's is white on an opaque black ground, which needs no filter and
   * disappears into the page anyway. TV 2 publishes a dark-background variant,
   * which is the file used here.
   */
  invertLogo?: boolean;
  /**
   * Optical size, as a multiplier on whatever height the mark is asked for.
   *
   * Height-matching alone does not make a press wall look level. These five run
   * from 8.6:1 (K.B. Hallen's wordmark) to roughly square (Presse-fotos.dk's
   * monogram), and set to one height the wordmark reads as twice the size of
   * the monogram beside it — same pixels tall, five times the ink. So each mark
   * carries the correction its own proportions need, tuned by eye against
   * Fighting.dk at 1.0.
   */
  logoScale?: number;
};

export type OutletId = keyof typeof outlets;

export const outlets = {
  "fighting-dk": {
    name: "Fighting.dk",
    home: "https://fighting.dk",
    logo: "/press/fighting-dk.png",
    logoWidth: 1024,
    logoHeight: 184,
    invertLogo: true,
  },
  "presse-fotos": {
    name: "Presse-fotos.dk",
    home: "https://presse-fotos.dk",
    logo: "/press/presse-fotos-dk.png",
    logoWidth: 1000,
    logoHeight: 1000,
    logoScale: 2.2,
  },
  dr: {
    name: "DR",
    home: "https://www.dr.dk/sporten",
    logo: "/press/dr.png",
    logoWidth: 1215,
    logoHeight: 360,
    logoScale: 0.95,
  },
  "tv2-echo": {
    name: "TV 2 Echo",
    home: "https://echo.tv2.dk",
    logo: "/press/tv2-echo.svg",
    logoWidth: 52,
    logoHeight: 25,
    logoScale: 1.3,
  },
  kbhallen: {
    name: "K.B. Hallen",
    home: "https://kbhallen.dk",
    logo: "/press/kbhallen.svg",
    logoWidth: 533,
    logoHeight: 62,
    logoScale: 0.8,
    invertLogo: true,
  },
} satisfies Record<string, Outlet>;

/* -- Items ----------------------------------------------------------------- */

/** What the piece is, in a word. Sets the label on the card. */
export type CoverageKind =
  | "Preview"
  | "Interview"
  | "Results"
  | "Report"
  | "Gallery"
  | "Profile"
  | "Video"
  | "Listing";

/**
 * The row's picture, and who took it.
 *
 * `credit` is not decoration and it is not always the outlet. Ten of these are
 * the article's own `og:image` and belong to whoever ran the piece; the other
 * eight are KOMBA's own K.B. Hallen photography, standing in where the outlet's
 * CDN will not serve an image to anything but a live browser session. The row
 * shows the picture; the article page prints this line under it. Get the two
 * out of step and the page credits a photograph to a publication that never
 * shot it.
 */
export type Thumbnail = {
  src: string;
  width: number;
  height: number;
  credit: string;
};

type Base = {
  /** The URL segment under /news. Ours, in English, and permanent. */
  slug: string;
  /** Our headline for our page. Never a translation of theirs. */
  title: string;
  /** One line, for the index. */
  summary: string;
  /**
   * ISO date. Theirs for coverage, ours for a post.
   *
   * Optional only for the one item that genuinely has none — a social post
   * whose date sits behind a login. Undated items are placed by hand at the end
   * of their group and render without a date rather than with a guessed one.
   */
  published?: string;
};

export type Coverage = Base & {
  kind: "coverage";
  outlet: OutletId;
  label: CoverageKind;
  /** Their headline, exactly as they set it. */
  sourceHeadline: string;
  sourceUrl: string;
  /** Absent on a venue listing, which has no writer. */
  byline?: string;
  /** The row's picture. See the note at the top of this file. */
  thumbnail?: Thumbnail;
  /** Our account of what they wrote. Paragraphs. */
  body: string[];
  /** At most one short line of theirs, with the speaker named. */
  pullQuote?: { text: string; speaker: string };
};

export type Post = Base & {
  kind: "post";
  body: string[];
  thumbnail?: Thumbnail;
};

export type NewsItem = Coverage | Post;

/**
 * Newest first, and kept that way by hand — the page does not sort. A press
 * list is a billing decision like any other on this site, and the day KOMBA
 * wants a piece at the top that is not the most recent one, the order is
 * already where it needs to be edited.
 *
 * Two stories run through it, and the dates keep them apart without a heading:
 * everything from October 2025 is the K.B. Hallen show, and everything before
 * May 2025 is Youssef Assouik — the world titles, the gym, the pedagogy, all of
 * it years older than the promotion. The page used to say so in two subheads
 * and does not any more, so the join is only as clear as the order is. Keep new
 * items in date order and it stays legible; sort a founder piece into the
 * middle of fight week and nothing on the page explains it.
 */
export const news: NewsItem[] = [
  /* -- The show ------------------------------------------------------------ */

  {
    kind: "coverage",
    slug: "the-gallery-from-komba-1-0",
    outlet: "presse-fotos",
    label: "Gallery",
    title: "The gallery from KOMBA 1.0",
    summary:
      "A photo essay from the night — the fights, the room, and the music that ran between them.",
    published: "2025-10-20",
    byline: "Simon Holm Rønne",
    sourceHeadline:
      "Kunstfærdig vold i K.B. Hallen: Se de vilde billeder fra KOMBA Fight Club 1.0",
    sourceUrl:
      "https://presse-fotos.dk/kunstfaerdig-vold-i-k-b-hallen-se-de-vilde-billeder-fra-komba-fight-club-1-0/",
    thumbnail: {
      src: "/press/thumbs/artful-violence-gallery.jpg",
      width: 1600,
      height: 1067,
      credit: "Presse-fotos.dk",
    },
    body: [
      "Nine days after the show, Presse-fotos.dk put out its picture set from K.B. Hallen — a full gallery off the Muay Thai and K-1 card, shot from the apron. Their headline calls it artful violence, which is a fair description of what the pictures are of.",
      "The captions carry the night with them: Niclas Larsen's ISKA world title over Kristoffer Björgskog in the main event, the Danish names who turned up to watch, and the sets rappers Kundo and SAFIA played between fights.",
    ],
  },
  {
    kind: "coverage",
    slug: "you-miss-the-atmosphere-already",
    outlet: "fighting-dk",
    label: "Report",
    title: "A report from the floor of K.B. Hallen",
    summary:
      "Two days after the debut, a write-up from inside the hall — the room, the queue at the doors, and the gyms who made the noise.",
    published: "2025-10-13",
    byline: "Michael Nielsen",
    sourceHeadline:
      "Reportage fra Komba FC's debutstævne: “Man savner allerede stemningen”",
    sourceUrl:
      "https://fighting.dk/reportage-fra-komba-fcs-premierestaevne-man-savner-allerede-stemningen/",
    thumbnail: {
      src: "/show/show-17.webp",
      width: 1400,
      height: 934,
      credit: "KOMBA FC",
    },
    body: [
      "Fighting.dk sent a writer to K.B. Hallen for KOMBA's first night and ran the report on the Monday. It reads the show as a debut that landed: ten fights, a card with real names on it, and a venue the piece rates highly for combat sports — room to move, seats that see the ring, facilities that took the crowd without strain.",
      "It is not a clean sweep. The report notes a slow start at the doors before the room settled. What it keeps coming back to is the crowd: gym blocks in from across the country, Extreme Muay Thai out of Køge the loudest of them, and an atmosphere the writer says he was already missing the next day.",
    ],
    pullQuote: {
      text: "Man savner allerede stemningen",
      speaker: "Fighting.dk",
    },
  },
  {
    kind: "coverage",
    slug: "kb-hallen-event-archive",
    outlet: "kbhallen",
    label: "Listing",
    title: "K.B. Hallen's own listing for the night",
    summary:
      "The venue's event page for 11 October 2025, now filed in its archive.",
    published: "2025-10-11",
    sourceHeadline: "KOMBA FIGHT CLUB",
    sourceUrl: "https://kbhallen.dk/eventarkiv/komba-fight-club_2025-10-11/",
    thumbnail: {
      src: "/press/thumbs/kbh-listing.jpg",
      width: 1648,
      height: 863,
      credit: "K.B. Hallen",
    },
    body: [
      "Not journalism, and it carries no byline — this is the hall's own listing, kept on in its event archive. It earns its place anyway. K.B. Hallen is one of the rooms Danish sport is measured in, and what sits in its archive is a record of what the room has held.",
      "The page bills the night as Denmark's largest Muay Thai and K-1 event, names Youssef Assouik as the promoter behind it, and sets out the running order: doors at 17:00, prelims at 18:00, main card at 20:00.",
    ],
  },
  {
    kind: "coverage",
    slug: "every-result-from-komba-1-0",
    outlet: "fighting-dk",
    label: "Results",
    title: "Every result from KOMBA 1.0",
    summary:
      "All ten fights, called as they finished. Niclas Larsen takes the ISKA middleweight world title on a unanimous decision to close the night.",
    published: "2025-10-11",
    byline: "Søren Schwartz",
    sourceHeadline:
      "Vild aften i KB Hallen: Her er alle resultaterne fra Komba FC's premierestævne",
    sourceUrl:
      "https://fighting.dk/vild-aften-i-kb-hallen-her-er-alle-resultaterne-fra-komba-fcs-premierestaevne/",
    thumbnail: {
      src: "/show/show-01.webp",
      width: 1400,
      height: 935,
      credit: "KOMBA FC",
    },
    body: [
      "The results piece went up the same night, a little after eleven. It runs the full card of ten in order and gives KOMBA's first show the verdict that matters to a promoter: value for the ticket, belts that were worth winning, and opposition brought in at a level the room could feel.",
      "The main event closed it. Niclas Larsen beat Kristoffer Björkskog on a unanimous decision, three judges to nil, for the ISKA middleweight world title.",
    ],
  },
  {
    kind: "coverage",
    slug: "fight-night-all-ten-bouts",
    outlet: "fighting-dk",
    label: "Preview",
    title: "Fight night: a bout-by-bout read on the whole card",
    summary:
      "The morning-of preview. Twelve fights became ten after two withdrawals, with four titles left on the line across three sessions.",
    published: "2025-10-11",
    byline: "Søren Schwartz",
    sourceHeadline: "It's fight night: Optakt til samtlige kampe ved Komba FC",
    sourceUrl:
      "https://fighting.dk/its-fight-night-optakt-til-samtlige-kampe-ved-komba-fc/",
    thumbnail: {
      src: "/show/show-05.webp",
      width: 1400,
      height: 935,
      credit: "KOMBA FC",
    },
    body: [
      "Published on the Saturday morning, this one goes through every fight on the bill in turn. It is the piece that records what the week did to the card: twelve bouts announced, two opponents lost to injury, ten walking to the ring.",
      "Four titles survived the cull, ISKA world honours among them. The night is set out in three blocks — prelims at 18:00, main card at 20:00, main event at 22:00 — with fighters in from Denmark, Finland, Sweden, Morocco and Turkey.",
    ],
  },
  {
    kind: "coverage",
    slug: "niclas-back-on-the-big-stage",
    outlet: "presse-fotos",
    label: "Profile",
    title: "Niclas Larsen, back on the biggest stage in Denmark",
    summary:
      "The main-event profile, filed the day before: out through ONE and GLORY, and home for the first main event KOMBA ever put on.",
    published: "2025-10-10",
    byline: "Simon Holm Rønne",
    sourceHeadline:
      "Niclas jagtede drømmen i udlandet: Nu er han tilbage på Danmarks største scene",
    sourceUrl:
      "https://presse-fotos.dk/niclas-har-kaempet-over-alt-i-verden-nu-er-han-tilbage-paa-den-stoerste-scene-i-danmark/",
    thumbnail: {
      src: "/press/thumbs/niclas-back-on-the-big-stage.jpg",
      width: 1170,
      height: 780,
      credit: "Presse-fotos.dk",
    },
    body: [
      "Presse-fotos.dk ran its main-event profile the day before the show. It follows Niclas Larsen's years chasing the sport abroad — ONE Championship, GLORY Kickboxing — and brings him back to K.B. Hallen for the first main event KOMBA has ever staged, against Kristoffer Björgskog for the ISKA middleweight title.",
      "It does not skip the hard part. The piece goes through what the international run cost him, the knockout loss to Tawanchai P.K. Saenchai in 2022, and the family he credits with getting him back on his feet afterwards.",
    ],
  },
  {
    kind: "coverage",
    slug: "younes-sadi-chases-the-wbc-european-belt",
    outlet: "fighting-dk",
    label: "Interview",
    title: "Younes Sadi goes for the WBC European belt in the co-main",
    summary:
      "32-4 and just off a world championship, Sadi talks about adaptability, gratitude, and the belt he wants next.",
    published: "2025-10-10",
    byline: "Søren Schwartz",
    sourceHeadline:
      "Komba FC-optakt: Taknemmelig Younes Sadi jagter ny, stor titel til samlingen",
    sourceUrl: "https://fighting.dk/16679-2/",
    thumbnail: {
      src: "/show/show-09.webp",
      width: 1400,
      height: 934,
      credit: "KOMBA FC",
    },
    body: [
      "Fighting.dk sat down with Younes Sadi the day before he fought Umut Sun for the WBC European title in KOMBA 1.0's co-main event. He came in at 32-4, with a Unite world championship won not long before it.",
      "The interview is less about the opponent than about how he prepares. Sadi puts his case on being a fighter who can change shape mid-fight rather than one with a single plan, and he is straightforward about daily prayer being the part of the routine that does the mental work.",
    ],
  },
  {
    kind: "coverage",
    slug: "bedirhan-ceran-turns-professional",
    outlet: "fighting-dk",
    label: "Interview",
    title: "Bedirhan Ceran turns professional at K.B. Hallen",
    summary:
      "Three Danish titles and a WBC belt behind him, the 25-year-old made his pro debut on the card against Sweden's Tobias Johansson.",
    published: "2025-10-09",
    byline: "Søren Schwartz",
    sourceHeadline:
      "Tredobbelt danmarksmester før Komba-debut: “Hårdt arbejde slår altid talent”",
    sourceUrl:
      "https://fighting.dk/tredeobbelt-dm-vinder-inden-komba-debut-haardt-arbejde-slaar-altid-talent/",
    thumbnail: {
      src: "/show/show-11.webp",
      width: 1400,
      height: 875,
      credit: "KOMBA FC",
    },
    body: [
      "Bedirhan Ceran arrived at KOMBA 1.0 with three Danish championships and a WBC title, and left the amateur ranks on the night: his professional debut, against Tobias Johansson of Sweden.",
      "The interview is built around one line he keeps returning to — that hard work beats talent, every time. He credits the training and the head rather than anything he was born with.",
    ],
    pullQuote: {
      text: "Hårdt arbejde slår altid talent",
      speaker: "Bedirhan Ceran",
    },
  },
  {
    kind: "coverage",
    slug: "tais-odonnell-comes-home",
    outlet: "fighting-dk",
    label: "Interview",
    title: "'Muay Tais' comes home for his professional debut",
    summary:
      "Eleven months away in England, then a first professional Muay Thai fight in Denmark against Sweden's Angelo Campusano.",
    published: "2025-10-09",
    byline: "Søren Schwartz",
    sourceHeadline:
      "'Muay Tais' lover krig i KB Hallen: “Danmark skal mindes om, hvem jeg er”",
    sourceUrl:
      "https://fighting.dk/muay-tais-lover-krig-i-kb-hallen-danmark-skal-mindes-om-hvem-jeg-er/",
    thumbnail: {
      src: "/show/show-13.webp",
      width: 1400,
      height: 934,
      credit: "KOMBA FC",
    },
    body: [
      "Tais O'Donnell is eighteen, fights out of Great Danes, and had spent the previous eleven months in England on Combat Karate rather than in front of a Danish crowd. KOMBA 1.0 was his professional Muay Thai debut at home, opposite Angelo Campusano of Sweden.",
      "He is not quiet about it in the interview. The promise is an aggressive fight rather than a safe one, and a reminder to a room that had not watched him in a year.",
    ],
    pullQuote: {
      text: "Danmark skal mindes om, hvem jeg er",
      speaker: "Tais O'Donnell",
    },
  },
  {
    kind: "coverage",
    slug: "youssef-bendahman-biggest-night",
    outlet: "fighting-dk",
    label: "Interview",
    title: "From 87 kilos to Danish champion",
    summary:
      "An 18-year-old's route from an overweight teenager to a WBC national title fight closing the prelims.",
    published: "2025-10-08",
    byline: "Søren Schwartz",
    sourceHeadline:
      "Fra 87 kilo til dansk mester – 18-årige Youssef Bendahman klar til karrierens største kamp",
    sourceUrl:
      "https://fighting.dk/fra-87-kilo-til-dansk-mester-18-aarige-youssef-bendahman-klar-til-karrierens-stoerste-kamp/",
    thumbnail: {
      src: "/show/show-21.webp",
      width: 1400,
      height: 934,
      credit: "KOMBA FC",
    },
    body: [
      "The profile starts where Bendahman did — 87 kilos, a teenager who had not found the sport yet — and follows him to a Danish championship and the biggest fight of a career that is barely underway.",
      "At K.B. Hallen he took the last slot on the prelims, against Luca Coker, with a WBC national title on it.",
    ],
  },
  {
    kind: "coverage",
    slug: "fight-week-komba-debuts-saturday",
    outlet: "fighting-dk",
    label: "Preview",
    title: "Fight week opens on the K.B. Hallen debut",
    summary:
      "The first piece of the week. Eleven fights, three title bouts, and Youssef Assouik's new promotion named as the thing to watch.",
    published: "2025-10-07",
    byline: "Michael Nielsen",
    sourceHeadline:
      "It's fight week: Komba FC debuterer lørdag i KB Hallen med tre titelkampe på kortet",
    sourceUrl:
      "https://fighting.dk/its-fight-week-komba-fc-debuterer-loerdag-i-kb-hallen-med-tre-vm-kampe-paa-kortet/",
    thumbnail: {
      src: "/show/show-03.webp",
      width: 1400,
      height: 875,
      credit: "KOMBA FC",
    },
    body: [
      "Fighting.dk opened its KOMBA week on the Tuesday with the card as it then stood: eleven fights, three of them for titles, at K.B. Hallen on the Saturday. The main event was already set — Niclas Larsen against Kristoffer Björkskog for the ISKA middleweight world title.",
      "The piece names Youssef Assouik, multiple-time world champion, as the man behind the promotion, and lists a bill drawing from across Scandinavia, Turkey and Lithuania. By fight night it was down to ten after two injury withdrawals, with a fourth title added.",
    ],
  },

  /* -- The founder --------------------------------------------------------- */

  {
    kind: "coverage",
    slug: "korpset-anxiety-and-weight",
    outlet: "tv2-echo",
    label: "Video",
    title: "Korpset films the gym",
    summary:
      "TV 2 follows young fighters who arrived carrying anxiety and weight, and left with Danish championships.",
    published: "2025-05-20",
    byline: "Korpset, TV 2 Echo",
    sourceHeadline: "Fra angst og overvægt til danmarksmestre i thaiboksning",
    sourceUrl:
      "https://tv2.dk/reel/2025-05-20-fra-angst-og-overvaegt-til-danmarksmestre-i-thaiboksning-6373113869112",
    thumbnail: {
      src: "/press/thumbs/tv2-anxiety-to-champions.jpg",
      width: 1264,
      height: 711,
      credit: "TV 2 Echo",
    },
    body: [
      "An episode of Korpset on TV 2 Echo, filmed where Youssef Assouik actually spends his week: in the gym, with the young people he coaches.",
      "The through-line is what the training does to a teenager outside the ring rather than in it — the ones who walked in anxious or heavy, and walked out national champions.",
    ],
  },
  {
    kind: "coverage",
    slug: "from-a-knife-to-a-world-title",
    outlet: "tv2-echo",
    label: "Profile",
    title: "From a knife in his pocket to a world title",
    summary:
      "TV 2 Echo on the fourteen-year-old who kept ending up at the police station, and the eight-time world champion he became.",
    published: "2025-05-19",
    byline: "Laura Kongsmark Schuldt",
    sourceHeadline:
      "Han gik med kniv og endte ofte på politistationen - i dag er han verdensmester",
    sourceUrl:
      "https://echo.tv2.dk/2025-04-01-han-gik-med-kniv-og-endte-ofte-paa-politistationen-i-dag-er-han-verdensmester",
    thumbnail: {
      src: "/press/thumbs/tv2-knife-to-world-champion.jpg",
      width: 1280,
      height: 720,
      credit: "TV 2 Echo",
    },
    body: [
      "TV 2 Echo's profile opens with Assouik at fourteen — carrying a knife, known at the local police station — and the night after one of those visits when he decided to put everything into Muay Thai instead.",
      "Eight world titles later he runs a gym and works as a social counsellor with teenagers heading the way he was. That second job, rather than the belts, is what the piece is actually about.",
    ],
  },
  {
    kind: "coverage",
    slug: "two-boys-and-the-thank-you",
    outlet: "tv2-echo",
    label: "Video",
    title: "Two boys, and the thank you",
    summary:
      "A clip from Korpset: two young men come back to say what the gym changed for them.",
    // Deliberately undated. Facebook's post date sits behind a login and none
    // of the page's public metadata carries it — a guessed date on a press page
    // is worse than none at all. Read it off the post while signed in and fill
    // `published` in.
    byline: "Korpset, TV 2 Echo",
    sourceHeadline: "Youssef har ændret to unge drenges liv - nu takker de ham",
    sourceUrl: "https://www.facebook.com/watch/?v=1977029132702946",
    thumbnail: {
      src: "/press/thumbs/tv2-two-young-boys.jpg",
      width: 640,
      height: 1136,
      credit: "TV 2 Echo",
    },
    body: [
      "TV 2 Echo's own cut from Korpset, posted to their channel: two young men Assouik took under his wing, coming back to tell him what it did.",
      "It is the shortest thing on this page and the one that travelled furthest.",
    ],
  },
  {
    kind: "coverage",
    slug: "giving-up-a-world-title",
    outlet: "dr",
    label: "Profile",
    title: "Giving up a world title on principle",
    summary:
      "Assouik hands back a Muay Thai world title after IFMA moves him out of the weight class he built a career in.",
    published: "2023-10-23",
    byline: "Philip Selmann, DR Sport",
    sourceHeadline:
      "Dansk verdensmester opgiver sin VM-titel i vrede: 'Ubærligt'",
    sourceUrl:
      "https://www.dr.dk/sporten/kampsport/dansk-verdensmester-opgiver-sin-vm-titel-i-vrede-ubaerligt",
    thumbnail: {
      src: "/press/thumbs/dr-gives-up-the-title.jpg",
      width: 1200,
      height: 675,
      credit: "DR",
    },
    body: [
      "In October 2023 Assouik gave a Muay Thai world title back rather than accept what came attached to it. IFMA had left him out of the -75kg class he had fought his whole career at for that year's World Games, and offered him a division below instead.",
      "He calls it unbearable, and unfair to anyone who has held a weight since childhood in order to stay champion, and boycotts both IFMA and the WMC over it.",
    ],
    pullQuote: {
      text: "Ubærligt",
      speaker: "Youssef Assouik",
    },
  },
  {
    kind: "coverage",
    slug: "world-champion-and-pedagogue",
    outlet: "dr",
    label: "Profile",
    title: "World champion in the ring, zero tolerance outside it",
    summary:
      "DR on the other half of the job — the gym, the pedagogy, and a hard line on violence that stops at the door.",
    published: "2022-12-25",
    byline: "Arnela Muminovic and Jacob Mignon",
    sourceHeadline:
      "Youssef er verdensmester i thai- og kickboxing - men som pædagog har han nultolerance over for vold",
    sourceUrl:
      "https://www.dr.dk/sporten/oevrig/yousssef-er-verdensmester-i-thai-og-kickboxing-men-som-paedagog-har-han-nultolerance",
    thumbnail: {
      src: "/press/thumbs/dr-zero-tolerance.png",
      width: 468,
      height: 263,
      credit: "DR",
    },
    body: [
      "A seven-time world champion who is also a trained pedagogue, running a training centre and mentoring young people who are not having an easy year of it.",
      "The piece is built around the contradiction he lives inside, and the rule he settles it with: the sport is a weapon, and it stays in the club.",
    ],
  },
  {
    kind: "coverage",
    slug: "the-belt-he-dedicated-to-a-friend",
    outlet: "dr",
    label: "Report",
    title: "The belt he dedicated to a friend in hospital",
    summary:
      "Thirty-five seconds to defend an ISKA world title, then close to thirty hours at Younes Sadi's bedside.",
    published: "2022-10-17",
    byline: "Sebastian Taarsted Bagger",
    sourceHeadline:
      "Dansk verdensmester dedikerer VM-bælte til sin ven på hospitalet: 'Jeg vil gøre alt for ham'",
    sourceUrl:
      "https://www.dr.dk/sporten/dansk-verdensmester-dedikerer-vm-baelte-til-sin-ven-paa-hospitalet-jeg-vil-goere-alt-ham",
    thumbnail: {
      src: "/press/thumbs/dr-belt-for-a-friend.jpg",
      width: 1200,
      height: 675,
      credit: "DR",
    },
    body: [
      "Assouik defended his ISKA world title in Copenhagen in about thirty-five seconds, and then did not celebrate it. His friend and sparring partner Younes Sadi had lost his own title fight the same night with a broken shin.",
      "DR followed him to the hospital, where he stayed close to thirty hours without sleep and gave the win to Sadi. Three years later Sadi fought the co-main at KOMBA 1.0, for the WBC European title.",
    ],
    pullQuote: {
      text: "Jeg vil gøre alt for ham",
      speaker: "Youssef Assouik",
    },
  },
  {
    kind: "coverage",
    slug: "world-champion-again-in-ninety-seconds",
    outlet: "dr",
    label: "Results",
    title: "World champion again, ninety seconds in",
    summary:
      "DR on the knockout that took the belt back — and, further down the page, on the promoter Assouik was already becoming.",
    published: "2021-11-14",
    byline: "Mikkel Nygaard and Sebastian Taarsted Bagger",
    sourceHeadline:
      "Dansk kickbokser er verdensmester igen: Bæltet var kun ude af Youssefs hænder i halvandet minut",
    sourceUrl:
      "https://www.dr.dk/sporten/oevrig/dansk-kickbokser-er-verdensmester-igen-baeltet-var-kun-ude-af-youssefs-haender-i",
    thumbnail: {
      src: "/press/thumbs/dr-world-champion-again.jpg",
      width: 1200,
      height: 675,
      credit: "DR",
    },
    body: [
      "DR Sport covered Assouik taking the light middleweight world title back in November 2021, stopping France's Karim Guettaf ninety seconds in at Frederiksberghallen in front of 1,200 people.",
      "The detail that matters four years on is further down the piece. He had promoted the card himself, as Assouik Fight Night, and tells DR he is a fighter, a trainer and a promoter at once — and that being told he cannot be all three is most of the reason he is.",
    ],
  },
];

/* -- Lookups --------------------------------------------------------------- */

export function newsItemBySlug(slug: string) {
  return news.find((item) => item.slug === slug);
}

/** "11 October 2025". One format for the whole feed, fixed to en-GB. */
export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
