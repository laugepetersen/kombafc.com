import type { Person } from "@/components/ui/person-card";

/**
 * The people the card stack introduces.
 *
 * Youssef's title is the one from the comp. The other two are placeholders —
 * real titles are still needed, and inventing them for named people is worse
 * than leaving the gap visible.
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
    role: "Role TBC",
    imageSrc: "/team/lauge-petersen.webp",
  },
  {
    id: "houdaifa-harrar",
    name: "Houdaifa Harrar",
    role: "Role TBC",
    imageSrc: "/team/houdaifa-harrar.webp",
  },
];
