import type { Person } from "@/components/ui/person-card";

/**
 * The people the card stack introduces.
 *
 * Youssef's title is the one from the comp. The other two are Lauge's own,
 * given for the About page's co-founder blocks and carried here so the chip
 * and the block do not bill the same person two different ways.
 *
 * Youssef's portrait is the comp's own square export. The other two were
 * cropped square from full portraits with matching headroom, which lands close
 * but not identical — his head sits a little smaller in its frame than theirs.
 */
export const team: Person[] = [
  {
    id: "youssef-assouik",
    name: "Youssef Assouik",
    role: "President & ONE Fighter",
    imageSrc: "/team/youssef-assouik.webp",
  },
  {
    id: "lauge-petersen",
    name: "Lauge Petersen",
    role: "Head of Product",
    imageSrc: "/team/lauge-petersen.webp",
  },
  {
    id: "houdaifa-harrar",
    name: "Houdaifa Harrar",
    role: "Commercial Director",
    imageSrc: "/team/houdaifa-harrar.webp",
  },
];
