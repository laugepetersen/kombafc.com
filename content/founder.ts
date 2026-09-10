/**
 * Youssef Assouik, as the About page tells it.
 *
 * Here rather than inside the section for the same reason `content/news.ts`
 * exists: this is the one block on the site that makes checkable claims about
 * a living person, and a claim you can check is a claim somebody has to be
 * able to find. Every fact below is sourced in the comment above it. Nothing
 * on this page is inferred from another line on this page.
 *
 * Sources, once, so the entries can point at them by name:
 *
 * - **WIKI** — en.wikipedia.org/wiki/Youssef_Assouik. Record, honours, the
 *   physicals, the gym.
 * - **ONE** — onefc.com's own athlete page and its pre-debut feature,
 *   "Collecting Belts And Helping The Youth". The childhood, the quote, the
 *   route into Muay Thai.
 * - **REPO** — `content/news.ts`, which is already sourced article by article
 *   against DR and TV 2 Echo. Where the repo has already established a fact
 *   and cited it, this file takes the repo's version rather than re-deriving
 *   one that might disagree with the news page two clicks away.
 * - **KBH** — K.B. Hallen's own listing for KOMBA 1.0, which is where his
 *   billing as the man behind the promotion comes from.
 *
 * PLACEHOLDER, and the only one in the file: `intro`, `story` and `pullQuote`
 * are written here, from the sources above, not given by Lauge. They are
 * accurate and they are not his. Replace them when the real copy lands — the
 * honours, the record and the milestones below are facts and stay.
 */

export type Honour = {
  /** The year the belt was won. */
  year: string;
  /** Sanctioning body, spelled the way it spells itself. */
  body: string;
  /**
   * What the belt is, in the case it renders in — the row reads
   * "<body> <title>", so this is "world champion" and not "World champion".
   * It was lowercased at the call site for a while, which turned WMC's
   * European belt into a "european" one.
   */
  title: string;
  /** The division, where it distinguishes one belt from another. */
  division?: string;
  /** One short line, where a belt has a story the year cannot carry. */
  note?: string;
};

/**
 * The professional record. WIKI, and stated as a record rather than as a run
 * of results — a page that lists individual fights goes stale the week after
 * the next one.
 */
export const record = { wins: 28, losses: 4, knockouts: 9 };

/**
 * The belts, newest first.
 *
 * WIKI for all seven. Amateur and professional are not separated here and the
 * IFMA golds are marked instead: IFMA is the amateur world championship and
 * calling one of its golds a professional title would be wrong, but leaving
 * the biggest amateur medal in the sport off a list of what he has won would
 * be stranger still.
 *
 * The count is deliberately not printed anywhere. DR called him a seven-time
 * world champion in 2022 and TV 2 Echo an eight-time one in 2025; both are in
 * `content/news.ts`, and a number on this page that disagrees with the number
 * on that one is worse than no number. The list says it without counting.
 */
export const honours: Honour[] = [
  {
    year: "2023",
    body: "WMC",
    title: "world champion",
    division: "Middleweight",
    // REPO: the WMC belt he handed back in October 2023 over IFMA's weight
    // classes — see the `giving-up-a-world-title` entry in content/news.ts.
    note: "Handed back the same year, on principle",
  },
  {
    year: "2022",
    body: "IFMA",
    title: "world champion",
    division: "−75 kg",
    note: "Amateur world championship",
  },
  {
    year: "2022",
    body: "WMC",
    title: "European champion",
    division: "Super middleweight",
  },
  {
    year: "2018",
    body: "Tatneft Cup",
    title: "winner",
    division: "−70 kg",
  },
  {
    year: "2017",
    body: "ISKA",
    title: "world champion",
    division: "K-1 light middleweight",
    note: "Four defences",
  },
  {
    year: "2016",
    body: "ISKA",
    title: "European champion",
    division: "Muay Thai 67 kg",
  },
  {
    year: "2012",
    body: "IFMA",
    title: "junior world champion",
    division: "−60 kg",
    note: "The first Danish junior gold at the championships",
  },
];

export type Milestone = { label: string; detail: string };

/**
 * The four things a reader should take away if they read nothing else.
 *
 * `label` is the fact and `detail` is what it is — the same shape the show bar
 * uses, so the two strips read as one device used twice rather than two.
 */
export const milestones: Milestone[] = [
  // WIKI.
  {
    label: `${record.wins}–${record.losses}`,
    detail: `As a professional — ${record.knockouts} of them by knockout`,
  },
  // WIKI + ONE: debut at ONE Fight Night 25, Bangkok, October 2024, a
  // unanimous decision over Sinsamut Klinmee.
  { label: "ONE Championship", detail: "Debut won in Bangkok, October 2024" },
  // WIKI: Assouik Gym, his own, since 2020. REPO: the pedagogy and the youth
  // work, off DR and TV 2 Echo.
  { label: "Assouik Gym", detail: "His own, in Copenhagen, since 2020" },
  // ONE + REPO: Komeback, the company he runs with the municipality.
  { label: "Komeback", detail: "The youth work, and the reason for it" },
];

/**
 * How he is billed. KBH bills him as the man behind the event; the repo's own
 * `content/team.ts` gives him the presidency, and the About page already calls
 * all three of them co-founders.
 */
export const role = "Co-founder and president · ONE Championship fighter";

/** PLACEHOLDER — see the file header. Written from the sources, not by Lauge. */
export const intro =
  "KOMBA has a front figure, and he is still fighting. Youssef Assouik built the promotion out of the sport he has spent half his life inside — and he is the reason the room believes a Danish card can hold a world title.";

/** PLACEHOLDER — see the file header. */
export const story = [
  // ONE, for Nordvest, the taekwondo, and finding Muay Thai at fifteen in
  // Morocco. REPO, for the fourteen-year-old and the police station, which is
  // TV 2 Echo's own framing in `from-a-knife-to-a-world-title`.
  "He grew up in Nordvest, in Copenhagen, and by fourteen he was known at the local police station. His father had already pushed him into a dojo; it was Muay Thai, found at fifteen on a summer in Morocco, that took. The sport is what he did with the rest of it.",
  // WIKI for the belts and the four defences; REPO for the pedagogy, the
  // gym, and Komeback's work with the municipality.
  "What followed is on the record, and most of it is above: world titles in Muay Thai and in K-1, a European belt, an IFMA gold, four defences of an ISKA world title. Alongside all of it he trained as a pedagogue. He runs his own gym in Copenhagen and a company, Komeback, that works with the city to reach teenagers heading the way he was heading — the half of the job DR and TV 2 keep coming back to.",
  // WIKI + ONE for the debut; REPO for Assouik Fight Night, which is the
  // detail DR buried at the bottom of its 2021 piece.
  "In October 2024 he walked out in Bangkok for his ONE Championship debut and took a decision over Sinsamut Klinmee. He had been promoting his own cards since 2021, as Assouik Fight Night, and telling anyone who would listen that being a fighter, a trainer and a promoter at once was not a contradiction. KOMBA is what that argument turned into.",
];

/**
 * PLACEHOLDER — see the file header.
 *
 * ONE's feature, in his own words, and held to one short line with his name on
 * it. That is a quotation; a paragraph of them stitched together is a reprint,
 * which is the rule `content/news.ts` sets for the whole site.
 */
export const pullQuote = {
  text: "You had to have your hands up.",
  attribution: "Youssef Assouik, on growing up in Nordvest",
};

/**
 * The portrait. 1200×1800 — the roster's own file, not the 160px chip the
 * founder row wears, which is an upscale at anything over 60px.
 *
 * Described rather than decorative, and the description is the reason this
 * photograph is the one: two ISKA world belts over the shoulders and the WMC
 * world title held at the waist is the honours list already in the frame.
 */
export const portrait = {
  src: "/fighters/youssef-assouik.webp",
  alt: "Youssef Assouik in a studio portrait, two ISKA world title belts over his shoulders and the WMC world title held at his waist",
};
