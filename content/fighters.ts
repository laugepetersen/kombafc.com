import type { CountryCode } from "@/components/ui/flag";

/**
 * The KOMBA 1.0 fighters the page shows — a selection off the K.B. Hallen
 * card of October 2025, not the whole of it. Nineteen fought; seven are held
 * back here on Lauge's call, and their portraits are still in
 * `public/fighters` for whenever they go back on.
 *
 * The card poster is the source for everything but the weights. It settles
 * four things the v1 dump had wrong or missing:
 *
 * - Divisions. These are the ones the fighters were actually billed at, and
 *   they are not the ones a weight-to-division lookup produces. Larsen made
 *   72.5kg and fought MIDDLEWEIGHT; ONE Championship's ladder — which weighs
 *   hydrated and runs a notch heavy — calls that a lightweight. The lookup is
 *   gone; the poster's own names are stored per fighter.
 * - Björgskog. Three spellings were in play: the dump's "Björskog", the
 *   portrait's filename "bjorkskog", and the poster's "Björgskog". The poster
 *   is KOMBA's own artwork for this card, so it wins. The filename is left
 *   alone rather than renamed under the other session's feet.
 * - Titles. "Finish champ" was a typo for Finnish. Sesay is Nordic champion,
 *   not Danish. Larsen is billed as 2021 world champion rather than by the
 *   promotion he fights for.
 * - Flags. Ceran holds the Danish title and is Danish and Turkish both, which
 *   is the whole reason none of these were inferred from a belt — and why the
 *   field is a list rather than one code.
 *
 * Two of the twelve are not on the poster at all — Assouik and Bjerrum. Their
 * divisions are the only derived ones on the page, taken off the WBC Muaythai
 * limits, which the poster agrees with on ten of the twelve fighters it can be
 * checked against. They are marked where they appear.
 *
 * Order is Lauge's, not the dump's — it is a billing decision, so it is
 * edited by hand and never sorted. What is left of the dump's alphabetical
 * run on first name still shows through in the tail, but there are names
 * lifted out of it and names dropped into it, and it is not a rule any more.
 * Do not "fix" the sequence.
 */
export type Fighter = {
  id: string;
  firstName: string;
  lastName: string;
  /**
   * Which flags fly beside the name.
   *
   * A list, because a fighter can hold more than one and one of them does:
   * Ceran is Danish and Turkish, and picking either on his behalf was the site
   * making a decision that is his to make.
   *
   * Danish across the board is a placeholder Lauge asked for, not a fact. The
   * ones the poster shows are set from it and are not placeholders.
   */
  flags?: CountryCode[];
  /** The belt carried into the night, as the poster bills it. */
  title?: string;
  /** The division billed on the poster. */
  division: string;
  /** The contracted weight off the 1.0 card, in kilos. */
  weightKg: number;
  /** Wins, losses, draws. The poster gives these only for the uncrowned. */
  record?: { w: number; l: number; d: number };
  /** Instagram handle, without the @. */
  instagram?: string;
  imageSrc: string;
};

export const fighters: Fighter[] = [
  {
    id: "youssef-assouik",
    firstName: "Youssef",
    lastName: "Assouik",
    // Placeholder on Lauge's call: not on the card poster.
    flags: ["dk"],
    title: "World champion",
    // Derived, not billed — 75.0kg is inside the WBC super middleweight limit
    // of 76.2.
    division: "Super middleweight",
    weightKg: 75.0,
    imageSrc: "/fighters/youssef-assouik.webp",
  },
  {
    id: "niclas-larsen",
    firstName: "Niclas",
    lastName: "Larsen",
    flags: ["dk"],
    title: "2021 world champion",
    division: "Middleweight",
    weightKg: 72.5,
    imageSrc: "/fighters/niclas-larsen.webp",
  },
  {
    id: "yassine-mahssoun",
    firstName: "Yassine",
    lastName: "Mahssoun",
    flags: ["ma"],
    title: "African champion",
    division: "Welterweight",
    weightKg: 67.0,
    imageSrc: "/fighters/yassine-mahssoun.webp",
  },
  {
    id: "kristoffer-bjorkskog",
    firstName: "Kristoffer",
    lastName: "Björgskog",
    flags: ["fi"],
    title: "Finnish champion",
    division: "Middleweight",
    weightKg: 72.5,
    imageSrc: "/fighters/kristoffer-bjorkskog.webp",
  },
  {
    id: "tais-odonnell",
    firstName: "Tais",
    lastName: "O’Donnell",
    flags: ["dk"],
    title: "European champion",
    division: "Super featherweight",
    weightKg: 58.0,
    imageSrc: "/fighters/tais-o-donell.webp",
  },
  {
    id: "jaspar-landal",
    firstName: "Jaspar",
    lastName: "Landal",
    flags: ["dk"],
    title: "Danish champion",
    division: "Featherweight",
    weightKg: 57.0,
    imageSrc: "/fighters/jaspar-landal.webp",
  },
  {
    id: "aleksander-bjerrum",
    firstName: "Aleksander",
    lastName: "Bjerrum",
    // Placeholder on Lauge's call: not on the card poster.
    flags: ["dk"],
    title: "Danish champion",
    // Derived, not billed — 61.0kg is inside the WBC lightweight limit of 61.2.
    division: "Lightweight",
    weightKg: 61.0,
    imageSrc: "/fighters/aleksander-bjerrum.webp",
  },
  {
    id: "bedirhan-ceran",
    firstName: "Bedirhan",
    lastName: "Ceran",
    // Danish and Turkish, both flown. The poster bills neither — what it names
    // is the belt, and the belt is the Danish one.
    flags: ["dk", "tr"],
    title: "Danish champion",
    division: "Welterweight",
    weightKg: 65.0,
    imageSrc: "/fighters/bedirhan-ceran.webp",
  },
  {
    id: "benjamin-sesay",
    firstName: "Benjamin",
    lastName: "Sesay",
    flags: ["dk"],
    title: "Nordic champion",
    division: "Heavyweight",
    weightKg: 91.0,
    imageSrc: "/fighters/benjamin-sesay.webp",
  },
  {
    id: "youssef-bendahman",
    firstName: "Youssef",
    lastName: "Bendahman",
    flags: ["dk"],
    title: "Danish champion",
    division: "Super lightweight",
    weightKg: 63.5,
    imageSrc: "/fighters/youssef-bendahman.webp",
  },
  {
    id: "younes-sadi",
    firstName: "Younes",
    lastName: "Sadi",
    flags: ["dk"],
    title: "Unite world champion",
    division: "Light heavyweight",
    weightKg: 81.0,
    imageSrc: "/fighters/younes-sadi.webp",
  },
  {
    id: "luca-coker",
    firstName: "Luca",
    lastName: "Coker",
    flags: ["dk"],
    title: "Danish champion",
    division: "Super lightweight",
    weightKg: 63.5,
    imageSrc: "/fighters/luca-coker.webp",
  },
];
